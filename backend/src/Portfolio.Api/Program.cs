using System.Security.Cryptography;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.Contacts;
using Portfolio.Application.Projects;
using Portfolio.Api.Configuration;
using Portfolio.Api.Security;
using Portfolio.Infrastructure;
using Portfolio.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
const long maximumRequestBodyBytes = 16 * 1024;
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = maximumRequestBodyBytes);

var contactOptions = builder.Configuration.GetSection(ContactOptions.SectionName).Get<ContactOptions>() ?? new ContactOptions();
var contactHashSalt = contactOptions.HashSalt.Trim();
if (!builder.Environment.IsDevelopment()
    && !builder.Environment.IsEnvironment("Testing")
    && (string.IsNullOrWhiteSpace(contactHashSalt)
        || contactHashSalt.Length < 32
        || contactHashSalt.Distinct().Count() < 8
        || contactHashSalt.Contains("development", StringComparison.OrdinalIgnoreCase)
        || contactHashSalt.Contains("replace", StringComparison.OrdinalIgnoreCase)
        || contactHashSalt.Contains("[ADD", StringComparison.OrdinalIgnoreCase)))
{
    throw new InvalidOperationException("Contact:HashSalt must be a unique secret of at least 32 characters in non-development environments.");
}

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddResponseCompression();
builder.Services.AddOptions<ContactOptions>().BindConfiguration(ContactOptions.SectionName);
builder.Services.AddOptions<CorsOptions>().BindConfiguration(CorsOptions.SectionName);
builder.Services.AddOptions<ReverseProxyOptions>().BindConfiguration(ReverseProxyOptions.SectionName);
var applicationInsightsConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
if (!string.IsNullOrWhiteSpace(applicationInsightsConnectionString))
{
    builder.Services.AddApplicationInsightsTelemetry(options =>
        options.ConnectionString = applicationInsightsConnectionString);
}
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHealthChecks().AddDbContextCheck<PortfolioDbContext>("portfolio-database");
builder.Services.AddScoped<IContactSubmissionService, ContactSubmissionService>();

var reverseProxyOptions = builder.Configuration.GetSection(ReverseProxyOptions.SectionName).Get<ReverseProxyOptions>() ?? new ReverseProxyOptions();
var trustForwardedHeaders = reverseProxyOptions.TrustForwardedHeaders;
if (trustForwardedHeaders)
{
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        options.ForwardLimit = 1;
        options.KnownIPNetworks.Clear();
        options.KnownIPNetworks.Add(System.Net.IPNetwork.Parse("10.0.0.0/8"));
        options.KnownIPNetworks.Add(System.Net.IPNetwork.Parse("172.16.0.0/12"));
        options.KnownIPNetworks.Add(System.Net.IPNetwork.Parse("192.168.0.0/16"));
    });
}

var corsOptions = builder.Configuration.GetSection(CorsOptions.SectionName).Get<CorsOptions>() ?? new CorsOptions();
var allowedOrigins = corsOptions.AllowedOrigins;
if (allowedOrigins.Length == 0 || allowedOrigins.Any(origin =>
        origin.Contains('*')
        || !Uri.TryCreate(origin, UriKind.Absolute, out var uri)
        || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)))
{
    throw new InvalidOperationException("Cors:AllowedOrigins must contain explicit HTTP or HTTPS origins without wildcards.");
}
builder.Services.AddCors(options => options.AddPolicy("portfolio", policy =>
    policy.WithOrigins(allowedOrigins).WithMethods("GET", "POST").WithHeaders("Content-Type", "Accept")));

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = 120, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
    options.AddPolicy("contact", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(10),
                QueueLimit = 0
            }));
});

var app = builder.Build();
const string apiContentSecurityPolicy = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'";
var frontendIndexPath = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "index.html");
var frontendIndexHtml = File.Exists(frontendIndexPath)
    ? await File.ReadAllTextAsync(frontendIndexPath)
    : null;
var frontendScriptDirective = FrontendScriptPolicy.BuildDirective(frontendIndexHtml);
var frontendContentSecurityPolicy = $"default-src 'self'; {frontendScriptDirective}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https: http://localhost:5050; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";

if (trustForwardedHeaders) app.UseForwardedHeaders();
app.UseExceptionHandler();
app.UseResponseCompression();
app.Use(async (context, next) =>
{
    var isApiResponse = context.Request.Path.StartsWithSegments("/api")
        || context.Request.Path.StartsWithSegments("/health")
        || context.Request.Path.StartsWithSegments("/openapi");
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Content-Security-Policy"] = isApiResponse
        ? apiContentSecurityPolicy
        : frontendContentSecurityPolicy;
    context.Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    await next();
});
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = staticFileContext =>
    {
        var path = staticFileContext.Context.Request.Path;
        if (path.Equals("/assets/config.js"))
        {
            staticFileContext.Context.Response.Headers.CacheControl = "no-store, max-age=0";
        }
        else if (path.Equals("/index.html"))
        {
            staticFileContext.Context.Response.Headers.CacheControl = "no-cache";
        }
    }
});
app.UseCors("portfolio");
if (!app.Environment.IsDevelopment() && !app.Environment.IsEnvironment("Testing"))
{
    app.UseHsts();
    app.UseHttpsRedirection();
}
app.UseRateLimiter();
app.Use(async (context, next) =>
{
    if (context.Request.ContentLength is > maximumRequestBodyBytes)
    {
        context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
        return;
    }

    if (HttpMethods.IsPost(context.Request.Method) && context.Request.Path.Equals("/api/contact"))
    {
        context.Request.EnableBuffering();
        var buffer = new byte[maximumRequestBodyBytes + 1];
        var bytesRead = 0;
        while (bytesRead < buffer.Length)
        {
            var count = await context.Request.Body.ReadAsync(
                buffer.AsMemory(bytesRead, buffer.Length - bytesRead),
                context.RequestAborted);
            if (count == 0) break;
            bytesRead += count;
        }
        context.Request.Body.Position = 0;
        if (bytesRead > maximumRequestBodyBytes)
        {
            context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
            return;
        }
    }

    await next();
});

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Testing")) app.MapOpenApi();

var databaseOptions = app.Configuration.GetSection(DatabaseOptions.SectionName).Get<DatabaseOptions>() ?? new DatabaseOptions();
var applyMigrationsOnStartup = app.Environment.IsDevelopment()
    || app.Environment.IsEnvironment("Testing")
    || databaseOptions.ApplyMigrationsOnStartup;
if (applyMigrationsOnStartup)
{
    await using var scope = app.Services.CreateAsyncScope();
    var database = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
    await database.Database.MigrateAsync();
}

app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", timestamp = DateTimeOffset.UtcNow }))
    .WithName("Health")
    .WithTags("Operations");

app.MapHealthChecks("/health/ready", new HealthCheckOptions { ResponseWriter = async (context, report) =>
{
    context.Response.ContentType = "application/json";
    await context.Response.WriteAsJsonAsync(new { status = report.Status.ToString().ToLowerInvariant() });
}});

app.MapGet("/api/projects", () => TypedResults.Ok(ProjectCatalog.All))
    .WithName("GetProjects")
    .WithTags("Projects");

app.MapGet("/api/projects/{slug}", Results<Ok<ProjectSummary>, NotFound> (string slug) =>
{
    var project = ProjectCatalog.All.FirstOrDefault(item => item.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
    return project is null ? TypedResults.NotFound() : TypedResults.Ok(project);
})
    .WithName("GetProject")
    .WithTags("Projects");

app.MapPost("/api/contact", async Task<IResult> (
    ContactRequest request,
    HttpContext context,
    IContactSubmissionService service,
    ILogger<Program> logger,
    CancellationToken cancellationToken) =>
{
    var normalizedRequest = ContactRequestValidator.Normalize(request);
    if (!string.IsNullOrWhiteSpace(normalizedRequest.Website))
    {
        logger.LogInformation("Contact honeypot triggered; request discarded");
        var discardedId = Guid.NewGuid().ToString("N");
        return Results.Accepted(value: new ContactResponse(discardedId, "Message received."));
    }

    var errors = ContactRequestValidator.Validate(normalizedRequest);
    if (errors.Count > 0) return Results.ValidationProblem(errors);

    var requester = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    var requesterHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes($"{contactHashSalt}:{requester}")));
    var response = await service.SubmitAsync(normalizedRequest, requesterHash, cancellationToken);
    logger.LogInformation("Contact submission {SubmissionId} stored", response.Id);
    return Results.Accepted(value: response);
})
    .RequireRateLimiting("contact")
    .WithName("SubmitContact")
    .WithTags("Contact");

var unsupportedApiMethods = new[] { "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS" };
app.MapMethods("/api/{**path}", unsupportedApiMethods, () => Results.NotFound());
app.MapMethods("/health/{**path}", unsupportedApiMethods, () => Results.NotFound());
app.MapFallbackToFile("index.html");

app.Run();

public partial class Program;
