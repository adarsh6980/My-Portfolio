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
    resumePath: "/assets/Adarsh-Ramakrishna-Resume-placeholder.pdf",
    email: "adarshrk.dev@gmail.com",
  },
  navigation: [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Skills", target: "skills" },
    { label: "Experience", target: "experience" },
    { label: "Projects", target: "projects" },
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
      period: "FEB 2022 - SEPT 2025",
      role: "PRODUCT DESIGN ENGINEER",
      organisation: "Resideo Smart Home Technologies , Honeywell International Inc.",
      kind: "Professional experience",
      summary:
        "Approximately 3+ years contributing to software development work across frontend, backend, data and API integration.",
      highlights: [
        "Built and maintained practical application features in collaborative development environments.",
        "Worked across user interfaces, backend services, relational data and debugging workflows.",
        "Used source control and maintainable object-oriented practices to deliver changes safely.",
      ],
      technologies: ["Angular", "TypeScript", "C#", ".NET", "SQL", "Git"],
    },
    {
      period: "June 2026 - present",
      role: "Software Development Intern",
      organisation: "Mersus Technologies",
      kind: "Industry placement",
      summary:
        "Worked on an AI-assisted software documentation solution connecting source-control workflows, code analysis, APIs and a frontend application.",
      highlights: [
        "Built and integrated API endpoints and connected backend services with a frontend application.",
        "Extracted code structures including classes, methods, fields and comments.",
        "Integrated local large-language-model workflows for documentation generation.",
        "Worked with source-control-triggered workflows, Node.js, C# and API integration.",
      ],
      technologies: ["Node.js", "C#", "REST APIs", "LLM integration", "Git"],
    },
    {
      period: "Sept 2025 - present",
      role: "MSc in Software Design with Artificial Intelligence",
      organisation: "Technological University of the Shannon",
      kind: "Academic and technical work",
      summary:
        "Developing deeper software design and artificial intelligence knowledge while building practical technical work in Athlone, Ireland.",
      highlights: [
        "Applied software design principles to maintainable full-stack solutions.",
        "Explored responsible AI integration alongside conventional software engineering.",
        "Built on a B.Tech foundation in Information Science and Engineering.",
      ],
      technologies: ["Software design", "Artificial intelligence", "Full-stack development"],
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
      githubUrl: "[ADD GITHUB URL]",
      liveUrl: "[ADD LIVE DEMO URL]",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "Processing dashboard for the AI-assisted code documentation platform",
    },
    {
      slug: "job-application-tracker",
      title: "Full-Stack Job Application Tracker",
      eyebrow: "Product engineering · Secure CRUD",
      problem: "Job seekers need one reliable view of applications, follow-ups and next actions.",
      solution:
        "A responsive tracker with validated workflows, authentication boundaries, useful filters and dashboard summaries.",
      contribution:
        "Defined the domain model, built the Angular forms and dashboard, implemented the .NET API and automated the Azure delivery path.",
      architecture: "Angular SPA → authenticated ASP.NET Core API → Entity Framework Core → Azure SQL.",
      challenges: [
        "Consistent status transitions",
        "Secure user-level data access",
        "Accessible dense data on mobile",
      ],
      features: [
        "Application CRUD",
        "Stages and notes",
        "Follow-up dates",
        "Search and filters",
        "Dashboard statistics",
        "Authentication",
        "CI/CD",
      ],
      technologies: [
        "Angular",
        "ASP.NET Core",
        "Entity Framework Core",
        "Azure SQL",
        "Azure App Service",
        "GitHub Actions",
      ],
      result: "[ADD MEASURABLE RESULT]",
      githubUrl: "[ADD GITHUB URL]",
      liveUrl: "[ADD LIVE DEMO URL]",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "Responsive application pipeline dashboard for the job application tracker",
    },
    {
      slug: "cloud-project-management",
      title: "Cloud-Based Project Management Application",
      eyebrow: "Cloud architecture · Real-time collaboration",
      problem: "Small teams need a focused place to coordinate ownership, due dates and project activity.",
      solution:
        "A maintainable project workspace with real-time updates, role-aware actions and operational telemetry.",
      contribution:
        "Designed the layered application, real-time event model, role boundaries, Azure topology and monitoring strategy.",
      architecture:
        "Angular SPA → ASP.NET Core + SignalR → Entity Framework Core → Azure SQL, observed by Application Insights.",
      challenges: [
        "Ordering real-time activity",
        "Role-based access rules",
        "Diagnosing cloud failures without logging sensitive data",
      ],
      features: [
        "Projects and tasks",
        "Priorities and owners",
        "Comments",
        "Activity history",
        "Real-time updates",
        "Role-based access",
        "Search and filtering",
      ],
      technologies: ["Angular", "ASP.NET Core", "SignalR", "Azure SQL", "Azure App Service", "Application Insights"],
      result: "[ADD MEASURABLE RESULT]",
      githubUrl: "[ADD GITHUB URL]",
      liveUrl: "[ADD LIVE DEMO URL]",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "Project workspace showing tasks, owners and recent activity",
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
};
