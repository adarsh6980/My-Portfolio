import { PortfolioData } from "./types";

export const PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "Adarsh Ramakrishna",
    title: "Full-Stack Software Developer | Angular | .NET | Azure",
    heroTitle:
      "Full-stack, built to scale — React, Next.js & Angular up front, .NET, Azure & microservices behind.",
    valueProposition:
      "I combine professional software development experience with modern frontend, backend and cloud engineering skills to build reliable, maintainable and user-focused applications.",
    location: "Athlone, Ireland",
    availability: "Open to software development opportunities",
    experienceYears: "3+ years",
    education: "MSc in Software Design with Artificial Intelligence",
    institution: "Technological University of the Shannon, Athlone, Ireland",
    previousEducation: "B.Tech in Information Science and Engineering",
    summary:
      "Full-stack developer with approximately 3+ years of software development experience, now completing an MSc in Ireland. I work across accessible Angular interfaces, maintainable .NET APIs, relational data and practical Azure delivery.",
    resumePath: "/assets/Adarsh-Ramakrishna-Resume.pdf",
    email: "adarshrk.dev@gmail.com",
  },
  navigation: [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Skills", target: "skills" },
    { label: "Experience", target: "experience" },
    { label: "Projects", target: "projects" },
    { label: "Open Source", target: "open-source" },
    { label: "Contact", target: "contact" },
  ],
  socialLinks: [
    { label: "GitHub", url: "https://github.com/adarsh6980", placeholder: false },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/adarsh-ramakrishna-sd/",
      placeholder: false,
    },
  ],
  skillGroups: [
    {
      title: "Frontend engineering",
      confidence: "Professional experience",
      skills: [
        "Angular",
        "TypeScript",
        "JavaScript",
        "HTML5",
        "CSS3",
        "SCSS",
        "Responsive design",
        "Reactive forms",
        "API integration",
      ],
    },
    {
      title: "Backend engineering",
      confidence: "Professional experience",
      skills: [
        "C#",
        "ASP.NET Core",
        ".NET Web API",
        "Entity Framework Core",
        "REST APIs",
        "Authentication and authorization",
        "Clean Architecture",
        "Dependency injection",
      ],
    },
    {
      title: "Data",
      confidence: "Strong working knowledge",
      skills: ["SQL Server", "Azure SQL", "SQLite", "Database design", "LINQ", "Entity Framework migrations"],
    },
    {
      title: "Cloud and DevOps",
      confidence: "Working knowledge",
      skills: [
        "Microsoft Azure",
        "Azure App Service",
        "Azure Static Web Apps",
        "Azure SQL Database",
        "Application Insights",
        "GitHub Actions",
        "CI/CD",
        "Docker",
        "Git and GitHub",
      ],
    },
    {
      title: "Tools and practices",
      confidence: "Strong working knowledge",
      skills: [
        "Visual Studio Code",
        "Swagger",
        "Postman",
        "Agile development",
        "Object-oriented programming",
        "Debugging",
        "Version control",
      ],
    },
  ],
  experience: [
    {
      period: "FEB 2023 - SEPT 2025",
      role: "PRODUCT DESIGN ENGINEER (FULL-STACK SOFTWARE)",
      organisation: "Resideo Smart Home Technology, Bangalore, India",
      kind: "Professional experience",
      summary:
        "Two years and seven months of production experience building Angular applications, ASP.NET Core APIs and Azure services through to release on a smart-home product.",
      highlights: [
        "Owned Angular feature modules connected to ASP.NET Core 6 APIs, including shared components used by the wider product team.",
        "Migrated the application from Angular 13 to 16 and refactored more than 25 components, reducing bundle size by 15%.",
        "Improved Azure APIs using batching and caching, bringing response time on owned paths down to 50ms.",
        "Released modules with UX and QA colleagues, cutting feature release time on that work by 30%.",
      ],
      technologies: ["Angular", "TypeScript", "C#", "ASP.NET Core 6", "Azure", "SQL", "Git"],
    },
    {
      period: "JUNE 2026 - AUG 2026",
      role: "Full-Stack Developer (Internship)",
      organisation: "Mersus Technologies, Ireland",
      kind: "Industry placement",
      summary:
        "Built an internal code-documentation tool in Angular and Node.js integrated into the team's source-control workflow.",
      highlights: [
        "Built an internal code-documentation tool on the team's source-control workflow, cutting manual documentation effort by 90%.",
        "Added a SQLite-backed editor so writers could update content without a new deployment, with a clear split between data and UI.",
        "Extracted code structures and integrated LLM workflows for documentation generation.",
      ],
      technologies: ["Angular", "Node.js", "C#", "SQLite", "REST APIs", "Git"],
    },
    {
      period: "SEPT 2025 - OCT 2026",
      role: "MSc Software Design with Artificial Intelligence",
      organisation: "Technological University of the Shannon",
      kind: "Academic and technical work",
      summary:
        "Awarded 27 October 2026 (NFQ Level 9), with coursework spanning software design, machine learning and applied artificial intelligence.",
      highlights: [
        "Completed coursework in software design, machine learning and applied artificial intelligence.",
        "Applied AI integration patterns alongside conventional full-stack engineering in course and hackathon projects.",
        "Built on a B.E. in Information Science and Engineering from Mangalore Institute of Technology and Engineering.",
      ],
      technologies: ["Software design", "Machine learning", "Artificial intelligence", "Full-stack development"],
    },
  ],
  projects: [
    {
      slug: "ai-code-documentation",
      title: "AI-Assisted Code Documentation Platform",
      eyebrow: "AI integration · Developer tooling",
      problem:
        "Codebases often contain incomplete documentation, making onboarding and maintenance slower.",
      solution:
        "A review-first platform that extracts source structures, generates documentation drafts and preserves editable history.",
      contribution:
        "Designed the full-stack workflow, API boundaries, extraction pipeline, processing dashboard and resilient error states.",
      architecture:
        "Angular dashboard → ASP.NET Core API → source analysis worker → local LLM adapter → SQLite/Azure SQL history.",
      challenges: [
        "Parsing heterogeneous source structures",
        "Keeping AI output reviewable rather than authoritative",
        "Reporting long-running processing state",
      ],
      features: [
        "Codebase upload or connection",
        "Class and method extraction",
        "Documentation drafts",
        "Review and editing",
        "History",
        "Processing status",
        "Structured logging",
      ],
      technologies: ["Angular", "ASP.NET Core", "C#", "REST APIs", "LLM integration", "SQLite", "Azure"],
      result: "[ADD MEASURABLE RESULT]",
      githubUrl: "[CONFIDENTIAL]",
      liveUrl: "[ADD LIVE DEMO URL]",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "Processing dashboard for the AI-assisted code documentation platform",
    },
    {
      slug: "streakhire",
      title: "Streakhire — Job Application Tracker & Chrome Extension",
      eyebrow: "Browser extension · Automated tracking",
      problem: "Job seekers lose momentum because logging every application by hand is tedious enough that they stop doing it.",
      solution:
        "A Manifest V3 Chrome/Comet extension that auto-detects submitted applications and postmarks them instantly, paired with a streak-driven pipeline dashboard.",
      contribution:
        "Designed the postal-themed brand system end to end, built the Next.js marketing site, the extension's site-detection logic and Firebase-backed sync, and the Azure deployment path.",
      architecture: "Next.js marketing site → Manifest V3 extension (Google OAuth via Chrome Identity) → Firebase Auth / Firestore → Azure App Service.",
      challenges: [
        "Detecting real submissions across different job sites without false positives",
        "Cross-browser Google auth (Chrome vs. Comet) without a Chrome-only API",
        "Locking each user's data to only themselves under a shared backend",
      ],
      features: [
        "Auto-detected applications",
        "Daily streak tracking",
        "Kanban pipeline dashboard",
        "Resume & notes per application",
        "Follow-up reminders",
        "Google sign-in",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Chrome Extension (Manifest V3)",
        "Firebase Auth",
        "Firestore",
        "Azure App Service",
      ],
      result: "Eliminated manual data entry entirely for every auto-detected application.",
      githubUrl: "https://github.com/adarsh6980/streak-hire",
      liveUrl: "https://streakhire-web.azurewebsites.net",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "Streakhire's postmarked application card and streak dashboard",
    },
    {
      slug: "docdrift",
      title: "DocDrift",
      eyebrow: "Nebius x NVIDIA Global AI Hackathon 2026 · Developer tooling",
      problem:
        "README code samples silently drift out of sync with the codebase, so docs quietly go stale and mislead readers.",
      solution:
        "A Python tool that runs each README code sample in a sandbox, asks an NVIDIA Nemotron model for a fix when it fails, and only keeps the fix if the sandboxed re-run passes.",
      contribution:
        "Built the sandboxed execution pipeline, the Nemotron-based fix proposal flow, the pass/fail verification loop and the automated test suite end to end.",
      architecture: "README parser → sandboxed runner → NVIDIA Nemotron fix adapter → re-run verifier → report.",
      challenges: [
        "Running untrusted README code safely in a sandbox",
        "Keeping AI-proposed fixes verified rather than trusted blindly",
        "Covering heterogeneous code-sample formats across READMEs",
      ],
      features: [
        "Sandboxed sample execution",
        "AI-proposed fixes via NVIDIA Nemotron",
        "Verify-before-keep re-run loop",
        "65 automated tests",
        "Public demo",
      ],
      technologies: ["Python", "NVIDIA Nemotron", "Sandboxing", "LLM integration", "Automated testing"],
      result: "65 automated tests passing; shipped as a public hackathon demo.",
      githubUrl: "https://github.com/adarsh6980/docdrift",
      liveUrl: "https://adarsh6980.github.io/docdrift",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "DocDrift sandboxed re-run verification report",
    },
    {
      slug: "localdeploy",
      title: "LocalDeploy",
      eyebrow: "Personal project · Developer tooling",
      problem:
        "Sharing a local Angular + ASP.NET Core app for quick feedback normally means a real deployment just to get one demo link.",
      solution:
        "A command-line tool that turns a local Angular and ASP.NET Core application into one temporary, single-origin demonstration link via an embedded YARP reverse proxy.",
      contribution:
        "Designed and built the CLI, the embedded YARP reverse-proxy routing and the single-origin tunnelling flow end to end.",
      architecture: "CLI → embedded YARP reverse proxy → single temporary origin → local Angular + ASP.NET Core app.",
      challenges: [
        "Routing both the Angular frontend and ASP.NET Core API through one origin",
        "Keeping the setup to a single CLI command with no manual proxy config",
        "Making the demo link temporary and safe to tear down",
      ],
      features: [
        "One-command local-to-demo-link flow",
        "Embedded YARP reverse proxy",
        "Single-origin routing for frontend + API",
        "Temporary, disposable demo links",
      ],
      technologies: ["C#", "ASP.NET Core", "YARP"],
      result: "Collapses a two-service local app into one shareable demo link with a single command.",
      githubUrl: "https://github.com/adarsh6980/LocalDeploy",
      liveUrl: "[NO LIVE DEMO — CLI TOOL]",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "LocalDeploy CLI turning a local app into a demo link",
    },
  ],
  achievements: [
    {
      value: "3+ yrs",
      label: "Professional experience",
      detail: "Shipped production features across frontend, backend and data at Resideo Smart Home Technologies.",
    },
    {
      value: "3",
      label: "End-to-end case studies",
      detail: "Each project below spans the full request lifecycle from browser to Azure SQL, not an isolated demo.",
    },
    {
      value: "MSc",
      label: "Software Design with AI",
      detail: "Completing a master's at TUS Athlone alongside applied engineering work.",
    },
    {
      value: "5",
      label: "Core skill domains",
      detail: "Frontend, backend, data, cloud/DevOps and tooling — each backed by named tools, not an aggregate score.",
    },
  ],
  testimonials: [
    {
      quote:
        "[ADD TESTIMONIAL QUOTE — ask a manager, mentor or collaborator for a short, specific line about working with you]",
      name: "[ADD NAME]",
      role: "[ADD ROLE, COMPANY]",
    },
    {
      quote: "[ADD TESTIMONIAL QUOTE]",
      name: "[ADD NAME]",
      role: "[ADD ROLE, COMPANY]",
    },
  ],
  openSourceContributions: [
    {
      repo: "dotnet/docs",
      title: "Clarify when to apply Orleans ADO.NET migration scripts",
      url: "https://github.com/dotnet/docs/pull/56247",
      status: "Merged",
    },
    {
      repo: "dotnet/docs",
      title: "Add directory note to F# get-started tutorial",
      url: "https://github.com/dotnet/docs/pull/56245",
      status: "Merged",
    },
    {
      repo: "dotnet/docs",
      title: "Document SYSLIB1219 options validation diagnostic",
      url: "https://github.com/dotnet/docs/pull/56288",
      status: "Merged",
    },
    {
      repo: "dotnet/docs",
      title: "Fix stale struct field-initializer rule in using-constructors.md",
      url: "https://github.com/dotnet/docs/pull/56425",
      status: "Merged",
    },
    {
      repo: "dotnet/AspNetCore.Docs",
      title: "Add RHEL instructions for trusting the ASP.NET Core dev certificate",
      url: "https://github.com/dotnet/AspNetCore.Docs/pull/37737",
      status: "Merged",
    },
    {
      repo: "unoplatform/uno",
      title: "docs: fix Vulkan backend selection examples",
      url: "https://github.com/unoplatform/uno/pull/24854",
      status: "Merged",
    },
    {
      repo: "xunit/xunit.net",
      title: "Add extensibility overview doc for v3",
      url: "https://github.com/xunit/xunit.net/pull/21",
      status: "Merged",
    },
    {
      repo: "crewAIInc/crewAI",
      title: "fix(agent): preserve task expected_output when planning finalizes the answer",
      url: "https://github.com/crewAIInc/crewAI/pull/9059",
      status: "Open",
    },
  ],
  hackathons: [
    {
      name: "Nebius x NVIDIA Global AI Hackathon 2026",
      period: "October 2026",
      project: "DocDrift",
      description:
        "Built a tool that finds README code samples that no longer match the code, proposes AI fixes via NVIDIA Nemotron, and verifies them by re-running in a sandbox.",
      url: "https://github.com/adarsh6980/docdrift",
    },
    {
      name: "Nebius x NVIDIA Global AI Hackathon 2026",
      period: "September 2026",
      project: "Form Friend",
      description:
        "Ireland bureaucracy co-pilot that turns official Irish forms into guided, plain-language steps for international students and immigrants.",
      url: "https://github.com/adarsh6980/form-friend",
    },
    {
      name: "NASA Space Apps Challenge 2025",
      period: "October 2025",
      project: "Exoplanet Prediction",
      description:
        "AI/ML platform automating exoplanet discovery from NASA datasets, classifying celestial objects as exoplanets, candidates or false positives at 81.6% accuracy and 90.1% ROC-AUC.",
      url: "https://github.com/adarsh6980/Exoplanet-prediction-NASA",
    },
  ],
};
