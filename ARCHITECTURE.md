# Architecture

## Current system

The portfolio is split into an Angular application and an ASP.NET Core minimal API. The frontend renders profile and project content from a typed local file; the API exposes a matching, smaller project catalogue and persists contact submissions.

```text
Browser
  ├─ Angular 22 SPA
  │    ├─ PORTFOLIO_DATA (editable local content)
  │    └─ PortfolioApiService ── POST /api/contact ─┐
  │                                                 │
  └─ ASP.NET Core API                               │
       ├─ API endpoints, CORS, rate limits, headers │
       ├─ Application: contracts, validation, use case
       ├─ Domain: ContactSubmission
       └─ Infrastructure: EF Core repository ───────┴─ SQLite or SQL Server/Azure SQL
```

The Azure topology is defined but not provisioned: Angular on Azure Static Web Apps; API on Azure App Service; optional Azure SQL; Application Insights/Log Analytics; and optional Key Vault. `infra/main.bicep` and the GitHub workflows are checked in; all names and credentials still require verified deployment configuration.

## Frontend boundaries

| Area | Current responsibility |
| --- | --- |
| `frontend/src/app/data/portfolio-data.ts` | Single typed source for profile, links, skills, experience, projects, architecture content, cloud practices, and pipeline copy. |
| `frontend/src/app/models/portfolio.models.ts` | Type contracts for local portfolio content. |
| `frontend/src/app/core/config/app-config.ts` | Reads public runtime API configuration from `globalThis.__PORTFOLIO_CONFIG__` and provides the localhost fallback plus canonical placeholder. |
| `frontend/src/app/core/services/portfolio-api.service.ts` | Typed contact POST request. |
| `frontend/src/app/features/contact/` | Reactive contact form, browser-side validation, submission state, and honeypot field. |
| `frontend/src/app/layout/` | Header, responsive navigation state, resume action, and footer. |
| `frontend/src/app/shared/` | Presentational project, section-heading, and architecture-diagram components. |

The home experience remains one long anchored page. Project cards also link to the lazy `/projects/:slug` case-study component, which looks up the same typed frontend data and renders an accessible not-found state for unknown slugs.

## Backend dependency direction

```text
Portfolio.Api
  → Portfolio.Application
  → Portfolio.Domain

Portfolio.Api → Portfolio.Infrastructure → Portfolio.Application + Portfolio.Domain
Portfolio.Tests → API + Application + Domain + Infrastructure
```

- `Portfolio.Domain` owns `ContactSubmission`.
- `Portfolio.Application` owns `ContactRequest`, `ContactResponse`, validation, the contact service, and the API-facing `ProjectCatalog` contract.
- `Portfolio.Infrastructure` owns `PortfolioDbContext`, provider selection, and contact persistence.
- `Portfolio.Api` composes dependencies and owns HTTP endpoints, response compression, CORS, rate limiting, security headers, exception handling, OpenAPI, and health endpoints.
- `Portfolio.Tests` contains API integration tests.

## Contact request lifecycle

1. The user enters a reactive Angular form. Browser validation applies required, email, length, and message-length constraints.
2. `PortfolioApiService` posts the payload to `${APP_CONFIG.apiUrl}/api/contact`.
3. Kestrel and endpoint middleware reject a request body larger than 16 KiB; the API then applies the global per-IP limiter and contact policy.
4. The request is normalized. A non-empty normalized `website` honeypot produces a neutral `202 Accepted` receipt without persistence.
5. `ContactRequestValidator` validates the normalized request. Invalid requests return problem-details validation errors.
6. The API derives a SHA-256 requester hash from the remote IP and `Contact:HashSalt`.
7. `ContactSubmissionService` normalizes the values, creates an identifier and timestamp, and calls `ContactSubmissionRepository`.
8. EF Core writes the submission; the API logs the submission identifier and returns `202 Accepted` with a neutral message.

The client retries manually after an error and preserves its typed form values. Portfolio content remains locally rendered when the API is down; only contact submission depends on it.

## API contract

| Method | Path | Current behavior |
| --- | --- | --- |
| `GET` | `/api/health` | Returns an application status and UTC timestamp. |
| `GET` | `/health/ready` | Returns ASP.NET Core health-check status, including the `PortfolioDbContext` check. |
| `GET` | `/api/projects` | Returns the server-side three-project catalogue. |
| `GET` | `/api/projects/{slug}` | Case-insensitive project lookup; returns `404` for an unknown slug. |
| `POST` | `/api/contact` | Accepts at most 16 KiB, validates and persists a contact submission, then returns `202`; honeypots receive the same neutral status without persistence. |

OpenAPI is mapped only in Development and Testing. There is no API authentication, authorization, email adapter, contact retrieval endpoint, or project CRUD endpoint.

## Persistence

`PortfolioDbContext` defines one table, `ContactSubmissions`:

| Column/property | Constraint or purpose |
| --- | --- |
| `Id` | Primary-key `Guid`. |
| `Name` | Required, maximum 100 characters. |
| `Email` | Required, maximum 254 characters. |
| `Subject` | Required, maximum 160 characters. |
| `Message` | Required, maximum 4,000 characters. |
| `RequesterHash` | Required, maximum 64 characters. |
| `CreatedAt` | Indexed timestamp. |

`Database:Provider` defaults to `Sqlite`; `SqlServer` selects EF Core SQL Server. `ConnectionStrings:Portfolio` chooses the database. The initial migration uses provider-neutral operations and was verified against SQLite plus SQL Server script generation. Startup runs `MigrateAsync` in Development/Testing or with the explicit `Database:ApplyMigrationsOnStartup` opt-in used by local Compose. Azure does not enable that switch: its migration is an explicit workflow EF-bundle step guarded by a temporary runner-IP SQL firewall rule.

## Security and failure boundaries

- CORS permits configured origins and only `GET`/`POST` with `Content-Type` and `Accept` headers.
- The API adds `nosniff`, `DENY` framing, strict-origin referrer policy, and a restrictive response CSP.
- Typed `Contact`, `Cors`, `ReverseProxy`, and `Database` options centralize configuration. Provider/origin validation and the non-development hash-salt policy fail fast at startup.
- Forwarded headers are disabled by default. When explicitly enabled, only one forwarded hop from RFC1918 `10/8`, `172.16/12`, or `192.168/16` proxy networks is trusted.
- Nginx and Static Web Apps add frontend CSP, permissions, framing, referrer, and content-type headers; `/assets/config.js` is explicitly non-cacheable. The inline JSON-LD CSP hash must be regenerated whenever its exact content changes.
- HSTS and HTTPS redirection are skipped only in the Testing environment.
- Validation errors do not log request values; successful contact logs include only the generated identifier.
- The current default `Contact:HashSalt` is development-only and must not be used in production.

Important current limitations: no external secret-provider wiring or deployment-slot configuration exists. The API conditionally registers Application Insights when configured; readiness includes a database-context check. Docker/Compose, Bicep, CI, and a manual OIDC deployment workflow exist, but Docker/Azure have not been run locally and require environment values and validation before use. [DEPLOYMENT.md](DEPLOYMENT.md) records the remaining prerequisites.

## Architectural decisions

- Keep personal content local and typed so static portfolio sections can render independently of API availability.
- Use a small layered API to demonstrate request validation and persisted contact handling without adding content-management CRUD.
- Make persistence provider-selectable so local SQLite and production SQL Server share application code.
- Keep unknown links, dates, results, domains, screenshots, and contact details as bracketed placeholders until they are verified.
- Describe Docker, Bicep, CI, OIDC, outbound-IP firewall reconciliation, and the provider-selected EF-bundle step as checked-in delivery definitions, not as a completed Azure deployment. App Service uses `/api/health` as liveness so Azure SQL auto-pause is not defeated; workflow readiness uses `/health/ready` before the frontend deploys last.
