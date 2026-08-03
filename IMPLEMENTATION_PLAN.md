# Full-Stack Developer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, test, and prepare a production-ready Angular, .NET, SQLite/Azure SQL, and Azure portfolio for Adarsh Ramakrishna.

**Architecture:** Use an Angular 22 standalone SPA with local typed content and lazy project routes, backed by a .NET 10 layered Web API for project reads and persisted contact submissions. Local development uses SQLite; production configuration selects Azure SQL, Azure Static Web Apps, Azure App Service, Application Insights, and optional Key Vault through environment variables and Bicep.

**Tech Stack:** Angular 22, TypeScript 6, SCSS, Vitest, ASP.NET Core 10, C# 14, EF Core 10, SQLite, SQL Server, xUnit, Docker, Bicep, GitHub Actions, Azure Static Web Apps, Azure App Service, Azure SQL, Application Insights.

## Delivery status

Implemented on 2026-08-02. The repository now includes the anchored recruiter experience, lazy project-detail route, persisted/rate-limited contact flow, provider-neutral EF migration, Docker and Azure delivery definitions, independent review fixes, and complete handoff documentation. Automated builds and tests, browser accessibility checks, SQLite execution, SQL Server DDL generation, migration-bundle creation, Bicep validation, and workflow/config parsing were run locally. Docker image execution and a real Azure deployment remain environment-gated and are explicitly documented; no paid resources were created.

The checklist below is retained as the original executable work breakdown and review history rather than rewritten after implementation.

## Global constraints

- Keep all personal details, links, skills, experience, projects, and resume paths in central configuration files.
- Preserve unknown personal facts as bracketed `ADD ...` placeholders; never invent repositories, URLs, dates, metrics, or business outcomes.
- Use Angular standalone components, signals where useful, `OnPush`, strict TypeScript, reactive forms, lazy routes, and no UI framework.
- Use .NET 10 LTS with DTOs, validation, dependency injection, structured logging, global exception handling, OpenAPI, health checks, narrow CORS, security headers, and rate limiting.
- Use SQLite locally and Azure SQL through environment configuration; do not commit secrets.
- Target WCAG 2.1 AA, semantic HTML, keyboard access, visible focus, sufficient contrast, and reduced-motion support.
- Prepare Azure resources and CI/CD but do not deploy or create paid resources.
- Use test-first red-green-refactor for handwritten behavior; generated scaffolding and declarative configuration are exempt.

---

## Task 1: Workspace and toolchain foundation

**Files:** root workspace files, `frontend/`, `backend/Portfolio.slnx`, `.gitignore`, `.editorconfig`, `.env.example`.

**Produces:** Angular and .NET projects that restore, build, and run tests; stable root commands; environment contract.

- [ ] Initialise Git and record the approved design and plan.
- [ ] Install a workspace-local .NET 10 SDK because the machine currently exposes .NET 8 only.
- [ ] Scaffold Angular 22 with standalone components, strict mode, SCSS, routing, and Vitest.
- [ ] Scaffold `Portfolio.Api`, `Portfolio.Application`, `Portfolio.Domain`, `Portfolio.Infrastructure`, and `Portfolio.Tests`; add references in dependency direction.
- [ ] Add root ignore rules and environment examples for API URL, database provider, connection string, allowed origins, telemetry, and Azure identifiers.
- [ ] Run clean frontend and backend builds and baseline tests.

## Task 2: Typed content system and page shell

**Files:** `frontend/src/app/models/portfolio.models.ts`, `frontend/src/app/data/portfolio-data.ts`, layout/shared components, global token SCSS.

**Produces:** `PORTFOLIO_DATA: PortfolioData`, reusable shell components, responsive design tokens.

- [ ] Write tests that require the central data object to expose every navigation item, profile field, skill category, experience, project, architecture stage, cloud practice, and placeholder link.
- [ ] Verify tests fail before the data and components exist.
- [ ] Implement interfaces and the single immutable data object using supplied factual content only.
- [ ] Build header, mobile menu, active-section state, resume action, footer, section heading, badge, social links, loading indicator, and status message components.
- [ ] Implement the approved Ink/Azure/Signal/Violet token system, typography packages, spacing, breakpoints, focus styles, container rules, buttons, cards, forms, and reduced motion.
- [ ] Run unit tests and a production build.

## Task 3: Recruiter-facing home experience

**Files:** home feature sections and section-specific tests/styles.

**Produces:** complete anchored home route with hero, about, skills, experience, projects, architecture, Azure, and contact composition.

- [ ] Write component tests for supplied hero copy, 2.8 years experience, education, skill confidence labels, three experience groups, three project cards, architecture nodes, and cloud pipeline steps.
- [ ] Verify expected failures.
- [ ] Implement the hero with the living architecture console, credibility strip, calls to action, location, availability, and placeholder social links.
- [ ] Implement concise About content, evidence-based skill groups, editable experience timeline, and meaningful project case-study cards.
- [ ] Implement interactive architecture and deployment visuals with keyboard-operable explanations and reduced-motion fallbacks.
- [ ] Add scroll reveal and active-section behavior without delaying content.
- [ ] Run focused tests and the production build.

## Task 4: Projects routing and detail experience

**Files:** `features/projects/project-detail.*`, router configuration, tests.

**Produces:** lazy `/projects/:slug` route and typed project lookup behavior.

- [ ] Write routing and detail tests for a known slug and an unknown slug.
- [ ] Verify failures.
- [ ] Implement signal-based lookup with problem, solution, contribution, architecture, stack, challenges, placeholder results, links, and screenshot placeholders.
- [ ] Add accessible not-found guidance back to Projects.
- [ ] Run routing tests and production build.

## Task 5: Backend domain, validation, and persistence

**Files:** domain entity, application DTOs/interfaces/validators/services, infrastructure DbContext/configurations/repository/migrations, tests.

**Produces:** `ContactRequest`, `ContactResponse`, `IContactSubmissionService`, provider-selectable `PortfolioDbContext`.

- [ ] Write validator tests for required values, length boundaries, invalid email, honeypot use, and whitespace normalisation.
- [ ] Verify failures.
- [ ] Implement validation without recording sensitive values in error logs.
- [ ] Write service tests for persisted neutral text and generated identifiers.
- [ ] Verify failures, then implement the entity, service, repository, EF configuration, and SQLite migration.
- [ ] Add SQL Server provider selection through `Database__Provider` and `ConnectionStrings__Portfolio`.
- [ ] Run application and infrastructure tests.

## Task 6: Secure HTTP API

**Files:** API endpoints, middleware, configuration, OpenAPI, integration tests.

**Produces:** `GET /api/health`, `GET /api/projects`, `GET /api/projects/{id}`, `POST /api/contact`.

- [ ] Write integration tests for healthy response, project list/detail/not-found, valid contact persistence, invalid request problem details, and honeypot neutral rejection.
- [ ] Verify failures against the configured test host.
- [ ] Implement endpoints and central server-side project data with matching slugs.
- [ ] Add exception middleware, HTTPS behavior, HSTS, CSP and related headers, response compression, narrow CORS, rate limiter policies, OpenAPI, and structured request logging.
- [ ] Add liveness and readiness health checks without exposing secrets or database details.
- [ ] Run all backend tests and a Release build.

## Task 7: End-to-end contact integration

**Files:** Angular API service, contact component/tests, proxy and environment configuration.

**Produces:** typed contact submission with idle/loading/success/error state.

- [ ] Write service tests for API URL composition and success/problem responses.
- [ ] Write form tests for labels, validation messages, disabled/loading state, success reset, retryable error, and hidden honeypot.
- [ ] Verify failures.
- [ ] Implement `PortfolioApiService`, runtime configuration, reactive contact form, abort-safe submission flow, accessible live status, and alternative contact placeholders.
- [ ] Run frontend tests, start the API with SQLite, and smoke-test a real contact POST and persisted record.

## Task 8: SEO, accessibility, and production polish

**Files:** `index.html`, app metadata service, `public/robots.txt`, `public/sitemap.xml`, placeholder assets, accessibility tests.

**Produces:** recruiter-focused metadata, Person JSON-LD, canonical placeholder, social metadata, sitemap, robots, favicon/social image placeholders, resume placeholder.

- [ ] Write tests for the skip link, landmarks, heading order, project image text alternatives, form labels, menu semantics, and metadata output.
- [ ] Verify failures, then implement the accessibility and metadata behavior.
- [ ] Add a small valid placeholder resume PDF and clear replacement path.
- [ ] Optimise lazy loading, font loading, SVG/CSS visuals, caching headers, and bundle budgets.
- [ ] Run tests, production build, browser keyboard checks, reduced-motion checks, and accessibility scan.

## Task 9: Containers, Azure IaC, and CI/CD

**Files:** frontend/backend Dockerfiles, `docker-compose.yml`, `infra/main.bicep`, parameter examples, workflow YAML.

**Produces:** local multi-container environment and non-deploying infrastructure/deployment definitions.

- [ ] Add multi-stage Angular/Nginx and .NET runtime images with non-root API execution and health checks.
- [ ] Add Compose services for frontend, API, and persistent SQLite with explicit environment configuration.
- [ ] Add Bicep for Static Web Apps, App Service plan/API, Azure SQL, Application Insights/Log Analytics, and optional Key Vault using cost-conscious parameters.
- [ ] Add CI for frontend install/lint/test/build and backend restore/build/test.
- [ ] Add OIDC-based Azure deployment workflow gated by the `production` GitHub environment and documented secrets/variables.
- [ ] Validate Compose configuration, Docker builds where Docker is available, and Bicep syntax.

## Task 10: Documentation and final quality gate

**Files:** `README.md`, `ARCHITECTURE.md`, `DEPLOYMENT.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`.

**Produces:** complete developer and deployment handoff.

- [ ] Document overview, screenshots, stack, prerequisites, local and Docker setup, commands, database configuration, tests, content replacement, resume replacement, projects, troubleshooting, security, and costs.
- [ ] Document request lifecycle, dependency boundaries, database schema, Azure topology, failure modes, and architectural decisions.
- [ ] Document OIDC setup, required Azure/GitHub values, migration safety, production checklist, rollback, monitoring, and teardown.
- [ ] Run independent UI/accessibility and backend/security/Azure reviews; fix all critical and important findings.
- [ ] Run fresh full tests, Release/production builds, API smoke tests, responsive screenshots, secret scan, and repository-status inspection.
- [ ] Record exact commands, test counts, build results, placeholders, known limitations, costs, and recommended improvements in the final delivery.
