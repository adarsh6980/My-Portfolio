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
        new("ai-code-documentation", "AI-Assisted Code Documentation Platform", "Extracts code structures and creates reviewable documentation drafts.", "Angular → ASP.NET Core → analysis and LLM adapters → SQLite/Azure SQL", ["Angular", "ASP.NET Core", "C#", "LLM integration", "Azure"], "[CONFIDENTIAL]", "[ADD LIVE DEMO URL]"),
        new("streakhire", "Streakhire — Job Application Tracker & Chrome Extension", "Auto-postmarks every job application on submit via a Manifest V3 browser extension, tracks a daily streak, and gives a full Kanban pipeline dashboard with resume tracking and follow-up reminders.", "Next.js marketing site → Manifest V3 extension (Google OAuth + Chrome Identity) → Firebase Auth/Firestore → Azure App Service", ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Chrome Extension (Manifest V3)", "Firebase Auth", "Firestore", "Azure App Service"], "https://github.com/adarsh6980/streak-hire", "https://streakhire-web.azurewebsites.net"),
        new("docdrift", "DocDrift", "Finds README code samples that no longer match the code, proposes AI fixes via NVIDIA Nemotron, and verifies them by re-running in a sandbox.", "README parser → sandboxed runner → NVIDIA Nemotron fix adapter → re-run verifier → report", ["Python", "NVIDIA Nemotron", "Sandboxing", "LLM integration"], "https://github.com/adarsh6980/docdrift", "https://adarsh6980.github.io/docdrift"),
        new("localdeploy", "LocalDeploy", "CLI that turns a local Angular + ASP.NET Core project into one temporary, single-origin demo link via an embedded YARP reverse proxy.", "CLI → embedded YARP reverse proxy → single temporary origin → local Angular + ASP.NET Core app", ["C#", "ASP.NET Core", "YARP"], "https://github.com/adarsh6980/LocalDeploy", "[NO LIVE DEMO — CLI TOOL]"),
    ];
}
