namespace Portfolio.Application.Projects;

public sealed record ProjectSummary(
    string Slug,
    string Title,
    string Summary,
    string Architecture,
    string[] Technologies,
    string GithubUrl,
    string LiveUrl);

public static class ProjectCatalog
{
    public static readonly IReadOnlyList<ProjectSummary> All =
    [
        new("ai-code-documentation", "AI-Assisted Code Documentation Platform", "Extracts code structures and creates reviewable documentation drafts.", "Angular → ASP.NET Core → analysis and LLM adapters → SQLite/Azure SQL", ["Angular", "ASP.NET Core", "C#", "LLM integration", "Azure"], "[ADD GITHUB URL]", "[ADD LIVE DEMO URL]"),
        new("job-application-tracker", "Full-Stack Job Application Tracker", "Tracks applications, stages, notes, follow-ups and dashboard statistics.", "Angular → authenticated ASP.NET Core API → Entity Framework Core → Azure SQL", ["Angular", "ASP.NET Core", "Entity Framework Core", "Azure SQL", "GitHub Actions"], "[ADD GITHUB URL]", "[ADD LIVE DEMO URL]"),
        new("cloud-project-management", "Cloud-Based Project Management Application", "Coordinates projects, tasks, owners and real-time activity.", "Angular → ASP.NET Core and SignalR → Entity Framework Core → Azure SQL", ["Angular", "ASP.NET Core", "SignalR", "Azure SQL", "Application Insights"], "[ADD GITHUB URL]", "[ADD LIVE DEMO URL]"),
    ];
}
