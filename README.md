# Full-Stack Developer Portfolio

An Angular single-page portfolio with a small ASP.NET Core API for project data and contact submissions. It is designed to present Angular, .NET, Entity Framework Core, SQLite/Azure SQL, and Azure delivery practices without turning unknown personal facts into claims.

The repository includes Docker, Bicep, and GitHub Actions delivery definitions, but no Azure resources are provisioned by default and Docker/Azure were not run from this local environment. The placeholder resume PDF is present and visually verified; portfolio screenshots remain intentionally uncommitted.

## Screenshots

<!-- [ADD RESPONSIVE PORTFOLIO SCREENSHOT] -->

<!-- [ADD PROJECT DETAIL SCREENSHOT] -->

Replace these comments with committed, non-sensitive screenshots after the UI is running. Do not replace them with an unverified or private URL.

## Stack

- Frontend: Angular 22, TypeScript 6, SCSS, and Vitest.
- API: ASP.NET Core 10, C# 14, minimal APIs, OpenAPI, rate limiting, and health endpoints.
- Data: Entity Framework Core 10 with SQLite by default or SQL Server/Azure SQL when selected through configuration.
- Delivery definitions: Docker/Compose, Azure Bicep, and GitHub Actions CI plus manual OIDC deployment workflow.
- Free-preview Azure topology: one App Service F1 in Switzerland North serves Angular and the .NET API, backed by Azure SQL's free offer with monthly-limit auto-pause. Paid monitoring, Key Vault, custom domains, and paid SKU fallbacks are absent.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the component boundaries and request lifecycle, and [DEPLOYMENT.md](DEPLOYMENT.md) for the explicit delivery gaps and production checklist.

## Prerequisites

- Node.js compatible with the checked-in Angular dependencies; `frontend/package.json` declares npm `11.9.0`.
- .NET SDK 10, because every backend project targets `net10.0`.
- SQLite is used through the bundled EF Core provider for local development; a separately installed SQLite CLI is not required.
- Docker and the Azure CLI are needed for the checked-in container and Azure delivery commands; neither has been used to deploy from this local environment.

## Local setup

Install frontend dependencies:

```bash
cd frontend
npm ci
```

Restore the backend from the repository root:

```bash
dotnet restore backend/Portfolio.slnx
```

Run the API on the frontend runtime configuration's localhost fallback. `--no-launch-profile` matters: the checked-in launch profile otherwise uses port `5167`, while `APP_CONFIG` falls back to port `5050`.

```bash
ASPNETCORE_ENVIRONMENT=Development \
ASPNETCORE_URLS=http://localhost:5050 \
Database__Provider=Sqlite \
ConnectionStrings__Portfolio='Data Source=portfolio.db' \
Cors__AllowedOrigins__0=http://localhost:4200 \
Contact__HashSalt='[ADD LOCAL NON-PRODUCTION HASH SALT]' \
dotnet run --no-launch-profile --project backend/src/Portfolio.Api/Portfolio.Api.csproj
```

In a second terminal, start Angular:

```bash
cd frontend
npm start
```

The development server is served at `http://localhost:4200/`; the API health endpoint is `http://localhost:5050/api/health` when started with the command above.

`.env.example` is a configuration contract only; neither Angular nor ASP.NET Core automatically reads it. The frontend reads the public `/assets/config.js` runtime asset through `APP_CONFIG`, then falls back to `http://localhost:5050`. Export backend values in your shell, use user secrets, or add a deliberate loader before relying on a `.env` file.

## Commands

Run these from the repository root unless the command changes into `frontend`:

| Purpose | Command |
| --- | --- |
| Install frontend dependencies | `cd frontend && npm ci` |
| Serve frontend | `cd frontend && npm start` |
| Production frontend build | `cd frontend && npm run build` |
| Frontend tests | `cd frontend && npm test -- --watch=false` |
| Frontend lint | `cd frontend && npm run lint` |
| Restore backend | `dotnet restore backend/Portfolio.slnx` |
| Build backend | `dotnet build backend/Portfolio.slnx` |
| Test backend | `dotnet test backend/Portfolio.slnx` |
| Run API | `dotnet run --no-launch-profile --project backend/src/Portfolio.Api/Portfolio.Api.csproj` |
| Validate Compose file | `CONTACT_HASH_SALT="$(openssl rand -hex 32)" docker compose config` |
| Run local containers | `CONTACT_HASH_SALT="$(openssl rand -hex 32)" docker compose up --build` |

There is no end-to-end-test script. CI runs frontend lint, tests, and production build plus backend restore/build/test; Docker, Azure CLI, and a .NET 10 SDK are required to run the delivery commands locally.

## Database and API configuration

The API reads normal ASP.NET Core configuration keys, so double underscores map to nested settings. These keys bind to typed `ContactOptions`, `CorsOptions`, `ReverseProxyOptions`, and `DatabaseOptions`; database provider selection is implemented in `backend/src/Portfolio.Infrastructure/DependencyInjection.cs`.

| Setting | Local value/example | Effect |
| --- | --- | --- |
| `Database__Provider` | `Sqlite` | Selects SQLite; `SqlServer` selects the SQL Server provider. |
| `Database__ApplyMigrationsOnStartup` | `false` | Explicit local/container opt-in; Compose sets it to `true`, while Azure production leaves it disabled. |
| `ConnectionStrings__Portfolio` | `Data Source=portfolio.db` | Database connection string. |
| `Cors__AllowedOrigins__0` | `http://localhost:4200` | First allowed browser origin; add indexed values for more origins. |
| `Contact__HashSalt` | `[ADD LOCAL NON-PRODUCTION HASH SALT]` | Salts the IP-derived requester hash. Non-development startup fails unless it is a non-placeholder secret of at least 32 characters with sufficient character variety. |
| `ReverseProxy__TrustForwardedHeaders` | `false` | Enables forwarded host/protocol processing only for explicitly trusted RFC1918 private proxy networks, with one forwarded hop. |
| `ASPNETCORE_ENVIRONMENT` | `Development` | Enables development behavior including OpenAPI. |
| `ASPNETCORE_URLS` | `http://localhost:5050` | Explicit API binding for the frontend's present configuration. |
| `ApplicationInsights__ConnectionString` | empty in `.env.example` | Optional; the strict free preview keeps it empty, and the API conditionally registers Application Insights only when configured. |

A provider-neutral initial migration is checked in under `backend/src/Portfolio.Infrastructure/Persistence/Migrations/`; its SQLite application and generated SQL Server DDL have both been verified locally. The API applies migrations in Development/Testing or when the explicit `Database__ApplyMigrationsOnStartup=true` local-container switch is set. Azure leaves that switch disabled and uses the deployment bundle through a temporary runner-IP firewall rule; see [DEPLOYMENT.md](DEPLOYMENT.md) for safeguards and rollback limits.

The implemented endpoints are:

- `GET /api/health`
- `GET /health/ready`
- `GET /api/projects`
- `GET /api/projects/{slug}`
- `POST /api/contact`

`POST /api/contact` accepts at most 16 KiB and expects `name`, `email`, `subject`, `message`, and `website` (honeypot). The server applies a global per-IP fixed-window limiter and a contact-specific fixed-window limiter, validates the request, and returns `202 Accepted` with a neutral receipt. It does not send email.

## Content, resume, and projects

Editable portfolio content lives in [frontend/src/app/data/portfolio-data.ts](frontend/src/app/data/portfolio-data.ts). Update it as one coherent change:

1. Replace only the existing bracketed placeholders such as `[ADD PROFESSIONAL EMAIL]`, `[ADD GITHUB URL]`, `[ADD LINKEDIN URL]`, `[ADD MEASURABLE RESULT]`, `[ADD PROJECT SCREENSHOT]`, and the employment/date placeholders with verified information. For social links, replace the URL and set its `placeholder` flag to `false` to render an interactive link.
2. Keep project `slug` values aligned with the backend catalogue in `backend/src/Portfolio.Application/Projects/ProjectCatalog.cs`; cards link to the lazy `/projects/:slug` case-study route.
3. Keep links and images as bracketed placeholders until they are known. Project cards render verified screenshot paths as lazy images and verified GitHub/live URLs as external links; do not invent those assets or URLs.
4. Replace `profile.resumePath` and the visually verified placeholder PDF at `frontend/public/assets/Adarsh-Ramakrishna-Resume-placeholder.pdf` with the approved public resume asset.
5. Update the canonical and social metadata placeholders in `frontend/src/index.html` at the same time as the public-domain and social-link content. If the inline JSON-LD changes, regenerate the exact SHA-256 script hash used by both frontend CSP configurations.
6. Set the deployed API URL through `frontend/public/assets/config.js` (or the Docker `PORTFOLIO_API_URL` build argument). The Angular app reads `globalThis.__PORTFOLIO_CONFIG__.apiUrl` and falls back to `http://localhost:5050`.

The three current case studies are AI-Assisted Code Documentation Platform, Full-Stack Job Application Tracker, and Cloud-Based Project Management Application. Their result, image, repository, and live-demo fields intentionally remain placeholders.

## Docker, Azure, and CI/CD

`frontend/Dockerfile` builds Angular and serves it through Nginx on port `8080`; `backend/Dockerfile` publishes the API and runs it as a non-root user on port `5050`. The root `.dockerignore` excludes local secrets, dependencies, builds, databases, and test output from build contexts. `docker-compose.yml` binds both ports, persists SQLite in the `portfolio-data` volume, opts into SQLite migration on startup, waits for `/health/ready`, accepts `PORTFOLIO_API_URL`, and requires a valid `CONTACT_HASH_SALT`.

`infra/main.bicep` and `infra/parameters/*.example.json` define the Switzerland North App Service F1 and Azure SQL free-offer resources. `.github/workflows/ci.yml` audits dependencies, lints/tests/builds, and verifies SQL Server migration generation. `.github/workflows/deploy-azure.yml` is a manual, `production`-gated OIDC deployment: it builds Angular for same-origin API access, embeds it in the .NET publish output, reconciles narrow SQL firewall rules, applies the EF bundle, deploys one package, and verifies the public site and API. Required variables, secrets, RBAC, free-limit behavior, rollback, and teardown are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `NETSDK1045` or a target-framework error | Install/select a .NET 10 SDK; .NET 8 cannot build `net10.0` projects. |
| Angular form cannot reach the API | Start the API with `ASPNETCORE_URLS=http://localhost:5050` and `--no-launch-profile`, or deliberately change `APP_CONFIG.apiUrl`. |
| Browser CORS failure | Ensure the frontend origin exactly matches an indexed `Cors__AllowedOrigins__*` value. |
| Database opens in an unexpected location | Set an explicit `ConnectionStrings__Portfolio` path; relative SQLite paths resolve from the API process working directory. |
| Telemetry is absent | Set `ApplicationInsights__ConnectionString`; the API only registers telemetry when this value is non-empty. |
| Resume download shows placeholder content | Replace the checked-in placeholder PDF and retain the `profile.resumePath` contract. |
| Container API is unreachable from the browser | Set `PORTFOLIO_API_URL` to the browser-reachable API URL before building the frontend image; a browser cannot resolve the Compose service name. |
| Azure deployment fails before upload | Check the `production` GitHub environment, required OIDC secrets/variables, and placeholder-free Bicep parameter values described in `DEPLOYMENT.md`. |
| API exits immediately in Production | Supply a valid `Contact__HashSalt`; placeholder, low-variety, or shorter-than-32-character values fail fast. |
| Metadata changes are blocked by frontend CSP | Recompute the inline JSON-LD SHA-256 and update both `frontend/nginx.conf` and `frontend/public/staticwebapp.config.json`. |

## Security and contributing

Read [SECURITY.md](SECURITY.md) before configuring a production environment and [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes. The project has no published security-reporting contact yet; retain `[ADD SECURITY CONTACT]` until one is approved.
