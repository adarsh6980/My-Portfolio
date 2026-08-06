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
        new("streakhire", "Streakhire — Job Application Tracker & Chrome Extension", "Auto-postmarks every job application on submit via a Manifest V3 browser extension, tracks a daily streak, and gives a full Kanban pipeline dashboard with resume tracking and follow-up reminders.", "Next.js marketing site → Manifest V3 extension (Google OAuth + Chrome Identity) → Firebase Auth/Firestore → Azure App Service", ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Chrome Extension (Manifest V3)", "Firebase Auth", "Firestore", "Azure App Service"], "https://github.com/adarsh6980/streak-hire", "https://streakhire-web.azurewebsites.net"),
        new("cloud-project-management", "Cloud-Based Project Management Application", "Coordinates projects, tasks, owners and real-time activity.", "Angular → ASP.NET Core and SignalR → Entity Framework Core → Azure SQL", ["Angular", "ASP.NET Core", "SignalR", "Azure SQL", "Application Insights"], "[ADD GITHUB URL]", "[ADD LIVE DEMO URL]"),
    ];
}
