using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Portfolio.Tests;

public sealed class ApiIntegrationTests : IClassFixture<PortfolioApiFactory>
{
    private readonly HttpClient _client;

    public ApiIntegrationTests(PortfolioApiFactory factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    [Fact]
    public async Task Health_endpoint_reports_service_status()
    {
        var response = await _client.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<HealthResponse>();
        Assert.Equal("healthy", body?.Status);
    }

    [Fact]
    public async Task Readiness_endpoint_includes_a_successful_database_probe()
    {
        var response = await _client.GetAsync("/health/ready");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<HealthResponse>();
        Assert.Equal("healthy", body?.Status);
    }

    [Fact]
    public async Task Projects_endpoint_returns_the_three_supplied_case_studies()
    {
        var projects = await _client.GetFromJsonAsync<ProjectResponse[]>("/api/projects");

        Assert.NotNull(projects);
        Assert.Equal(3, projects.Length);
        Assert.Contains(projects, project => project.Slug == "ai-code-documentation");
        Assert.Contains(projects, project => project.Slug == "job-application-tracker");
        Assert.Contains(projects, project => project.Slug == "cloud-project-management");
        Assert.All(projects, project => Assert.Equal("[ADD GITHUB URL]", project.GithubUrl));
    }

    [Fact]
    public async Task Project_detail_returns_a_known_case_study_and_not_found_for_an_unknown_slug()
    {
        var known = await _client.GetAsync("/api/projects/job-application-tracker");
        var unknown = await _client.GetAsync("/api/projects/not-a-project");

        Assert.Equal(HttpStatusCode.OK, known.StatusCode);
        Assert.Equal("job-application-tracker", (await known.Content.ReadFromJsonAsync<ProjectResponse>())?.Slug);
        Assert.Equal(HttpStatusCode.NotFound, unknown.StatusCode);
    }

    [Fact]
    public async Task Contact_endpoint_rejects_invalid_fields_with_problem_details()
    {
        var response = await _client.PostAsJsonAsync("/api/contact", new
        {
            name = "",
            email = "not-an-email",
            subject = "",
            message = "too short",
            website = ""
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationResponse>();
        Assert.NotNull(problem);
        Assert.Contains("name", problem.Errors.Keys);
        Assert.Contains("email", problem.Errors.Keys);
        Assert.Contains("message", problem.Errors.Keys);
    }

    [Fact]
    public async Task Contact_endpoint_persists_valid_submission_and_returns_neutral_receipt()
    {
        var response = await _client.PostAsJsonAsync("/api/contact", new
        {
            name = "Ada Recruiter",
            email = "ada@example.com",
            subject = "Junior developer role",
            message = "Would you be available for a technical interview next week?",
            website = ""
        });

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        var receipt = await response.Content.ReadFromJsonAsync<ContactResponse>();
        Assert.False(string.IsNullOrWhiteSpace(receipt?.Id));
        Assert.Equal("Message received.", receipt?.Message);
    }

    [Fact]
    public async Task Contact_honeypot_returns_a_neutral_accepted_receipt()
    {
        var response = await _client.PostAsJsonAsync("/api/contact", new
        {
            name = "Automated Sender",
            email = "bot@example.com",
            subject = "Filled by a bot",
            message = "This request should be discarded by the honeypot.",
            website = "https://spam.example"
        });

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        Assert.Equal("Message received.", (await response.Content.ReadFromJsonAsync<ContactResponse>())?.Message);
    }

    [Fact]
    public async Task Contact_endpoint_validates_normalized_values_and_handles_a_null_honeypot()
    {
        var response = await _client.PostAsJsonAsync("/api/contact", new
        {
            name = "\u0000\u0001",
            email = "ada@example.com",
            subject = "\u0007",
            message = new string('\u0001', 20),
            website = (string?)null
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationResponse>();
        Assert.NotNull(problem);
        Assert.Contains("name", problem.Errors.Keys);
        Assert.Contains("subject", problem.Errors.Keys);
        Assert.Contains("message", problem.Errors.Keys);
    }

    [Fact]
    public async Task Contact_endpoint_rejects_an_oversized_request_before_model_validation()
    {
        using var content = JsonContent.Create(new
        {
            name = "Ada",
            email = "ada@example.com",
            subject = "Oversized request",
            message = new string('x', 20_000),
            website = ""
        });

        var response = await _client.PostAsync("/api/contact", content);

        Assert.Equal(HttpStatusCode.RequestEntityTooLarge, response.StatusCode);
    }

    [Fact]
    public async Task Contact_rate_limit_rejects_the_sixth_request_from_one_client_window()
    {
        var isolatedFactory = new PortfolioApiFactory();
        try
        {
            using var client = isolatedFactory.CreateClient();
            var payload = new
            {
                name = "Automated Sender",
                email = "bot@example.com",
                subject = "Rate limit check",
                message = "This request exercises the public contact limiter.",
                website = "https://spam.example"
            };

            for (var attempt = 1; attempt <= 5; attempt++)
            {
                var accepted = await client.PostAsJsonAsync("/api/contact", payload);
                Assert.Equal(HttpStatusCode.Accepted, accepted.StatusCode);
            }

            var rejected = await client.PostAsJsonAsync("/api/contact", payload);
            Assert.Equal(HttpStatusCode.TooManyRequests, rejected.StatusCode);
        }
        finally
        {
            await ((IAsyncLifetime)isolatedFactory).DisposeAsync();
        }
    }

    private sealed record HealthResponse(string Status);
    private sealed record ProjectResponse(string Slug, string GithubUrl);
    private sealed record ContactResponse(string Id, string Message);
    private sealed record ValidationResponse(Dictionary<string, string[]> Errors);
}

public sealed class PortfolioApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly string _databasePath = Path.Combine(Path.GetTempPath(), $"portfolio-tests-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("Database:Provider", "Sqlite");
        builder.UseSetting("ConnectionStrings:Portfolio", $"Data Source={_databasePath}");
        builder.UseSetting("Cors:AllowedOrigins:0", "http://localhost:4200");
    }

    public Task InitializeAsync() => Task.CompletedTask;

    Task IAsyncLifetime.DisposeAsync()
    {
        Dispose();
        if (File.Exists(_databasePath)) File.Delete(_databasePath);
        return Task.CompletedTask;
    }
}
