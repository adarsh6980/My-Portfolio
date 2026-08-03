namespace Portfolio.Api.Configuration;

public sealed class ContactOptions
{
    public const string SectionName = "Contact";
    public string HashSalt { get; init; } = "local-development-only-change-in-production";
}

public sealed class CorsOptions
{
    public const string SectionName = "Cors";
    public string[] AllowedOrigins { get; init; } = ["http://localhost:4200"];
}

public sealed class ReverseProxyOptions
{
    public const string SectionName = "ReverseProxy";
    public bool TrustForwardedHeaders { get; init; }
}
