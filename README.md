# Full-Stack Developer Portfolio

A Next.js portfolio landing page with a small ASP.NET Core API for project data and contact submissions. It is designed to present full-stack, .NET, Entity Framework Core, SQLite/Azure SQL, and Azure delivery practices without turning unknown personal facts into claims.

The repository includes Docker, Bicep, and GitHub Actions delivery definitions, but no Azure resources are provisioned by default and Docker/Azure were not run from this local environment. The placeholder resume PDF is present and visually verified; portfolio screenshots remain intentionally uncommitted.

## Screenshots

<!-- [ADD RESPONSIVE PORTFOLIO SCREENSHOT] -->

<!-- [ADD PROJECT DETAIL SCREENSHOT] -->

Replace these comments with committed, non-sensitive screenshots after the UI is running. Do not replace them with an unverified or private URL.

## Stack

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.
- API: ASP.NET Core 10, C# 14, minimal APIs, OpenAPI, rate limiting, and health endpoints.
- Data: Entity Framework Core 10 with SQLite by default or SQL Server/Azure SQL when selected through configuration.
- Delivery definitions: Docker/Compose, Azure Bicep, and GitHub Actions CI plus manual OIDC deployment workflow.
- Free-preview Azure topology: one App Service F1 in Switzerland North serves the frontend and the .NET API, backed by Azure SQL's free offer with monthly-limit auto-pause. Paid monitoring, Key Vault, custom domains, and paid SKU fallbacks are absent. (This topology predates the Next.js rebuild and has not been re-verified against it — see [DEPLOYMENT.md](DEPLOYMENT.md).)

See [ARCHITECTURE.md](ARCHITECTURE.md) for the component boundaries and request lifecycle, and [DEPLOYMENT.md](DEPLOYMENT.md) for the explicit delivery gaps and production checklist.

## Prerequisites

- Node.js compatible with Next.js 14 (Node 18.17+).
- .NET SDK 10, because every backend project targets `net10.0`.
- SQLite is used through the bundled EF Core provider for local development; a separately installed SQLite CLI is not required.
- Docker and the Azure CLI are needed for the checked-in container and Azure delivery commands; neither has been used to deploy from this local environment.

## Local setup

Install frontend dependencies:

```bash
cd frontend
npm install
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
Cors__AllowedOrigins__0=http://localhost:3000 \
Contact__HashSalt='[ADD LOCAL NON-PRODUCTION HASH SALT]' \
dotnet run --no-launch-profile --project backend/src/Portfolio.Api/Portfolio.Api.csproj
```

In a second terminal, start Next.js:

```bash
cd frontend
npm run dev
```

The development server is served at `http://localhost:3000/`; the API health endpoint is `http://localhost:5050/api/health` when started with the command above.

`.env.example` is a configuration contract only; ASP.NET Core does not automatically read it. Export backend values in your shell, use user secrets, or add a deliberate loader before relying on a `.env` file.

## Commands

Run these from the repository root unless the command changes into `frontend`:

| Purpose | Command |
| --- | --- |
| Install frontend dependencies | `cd frontend && npm install` |
| Serve frontend | `cd frontend && npm run dev` |
| Production frontend build | `cd frontend && npm run build` |
| Frontend lint | `cd frontend && npm run lint` |
| Restore backend | `dotnet restore backend/Portfolio.slnx` |
| Build backend | `dotnet build backend/Portfolio.slnx` |
| Test backend | `dotnet test backend/Portfolio.slnx` |
| Run API | `dotnet run --no-launch-profile --project backend/src/Portfolio.Api/Portfolio.Api.csproj` |
| Validate Compose file | `CONTACT_HASH_SALT="$(openssl rand -hex 32)" docker compose config` |
| Run local containers | `CONTACT_HASH_SALT="$(openssl rand -hex 32)" docker compose up --build` |

There is no frontend or end-to-end test suite yet. CI's frontend job predates the Next.js rebuild and has not been re-verified against it (see `.github/workflows/ci.yml`); Docker, Azure CLI, and a .NET 10 SDK are required to run the delivery commands locally.

## Database and API configuration

The API reads normal ASP.NET Core configuration keys, so double underscores map to nested settings. These keys bind to typed `ContactOptions`, `CorsOptions`, `ReverseProxyOptions`, and `DatabaseOptions`; database provider selection is implemented in `backend/src/Portfolio.Infrastructure/DependencyInjection.cs`.

| Setting | Local value/example | Effect |
| --- | --- | --- |
| `Database__Provider` | `Sqlite` | Selects SQLite; `SqlServer` selects the SQL Server provider. |
| `Database__ApplyMigrationsOnStartup` | `false` | Explicit local/container opt-in; Compose sets it to `true`, while Azure production leaves it disabled. |
| `ConnectionStrings__Portfolio` | `Data Source=portfolio.db` | Database connection string. |
| `Cors__AllowedOrigins__0` | `http://localhost:3000` | First allowed browser origin; add indexed values for more origins. |
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

Editable portfolio content lives in [frontend/lib/data.ts](frontend/lib/data.ts) (types in [frontend/lib/types.ts](frontend/lib/types.ts)). Update it as one coherent change:

1. Replace only the existing bracketed placeholders such as `[ADD MEASURABLE RESULT]`, `[ADD GITHUB URL]`, `[ADD LIVE DEMO URL]`, `[ADD PROJECT SCREENSHOT]`, and the testimonial placeholders with verified information. For social links, the `placeholder` flag is informational only; both current links (GitHub, LinkedIn) are already real.
2. Keep links as bracketed placeholders until they are known — project cards render the raw `[ADD ...]` text instead of a broken link until you fill them in; do not invent those URLs.
3. Replace `profile.resumePath` and the placeholder PDF at `frontend/public/assets/Adarsh-Ramakrishna-Resume-placeholder.pdf` with the approved public resume asset.
4. Update the page `<title>`/description in `frontend/app/layout.tsx`'s `metadata` export alongside any public-domain or social-link content changes.

The three current case studies are AI-Assisted Code Documentation Platform, Full-Stack Job Application Tracker, and Cloud-Based Project Management Application. Their result, screenshot, repository, and live-demo fields intentionally remain placeholders. There is no contact form or project-detail route in the Next.js rebuild yet — the API's `/api/contact` and per-project endpoints exist but are not currently called from the frontend.

## Docker, Azure, and CI/CD

**Known gap:** `frontend/Dockerfile`, `frontend/nginx.conf`, and the frontend half of `docker-compose.yml`/`deploy-azure.yml`/`infra/*` were written for the Angular build and were removed or left unmodified during the Next.js rebuild — `frontend/Dockerfile` no longer exists, so `docker compose up --build` and the Azure frontend deploy step will fail until a Next.js-appropriate Dockerfile (and any related Nginx/Bicep/workflow updates) is added. This was an explicit non-goal of the rebuild, not an oversight; treat it as open work before relying on Docker or the Azure workflow again.

`backend/Dockerfile` publishes the API and runs it as a non-root user on port `5050` and is unaffected. The root `.dockerignore` excludes local secrets, dependencies, builds, databases, and test output from build contexts.

`infra/main.bicep` and `infra/parameters/*.example.json` define the Switzerland North App Service F1 and Azure SQL free-offer resources (backend-focused; unaffected by the frontend rebuild). `.github/workflows/ci.yml` and `.github/workflows/deploy-azure.yml` predate the Next.js rebuild and have not been re-verified against it. Required variables, secrets, RBAC, free-limit behavior, rollback, and teardown are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `NETSDK1045` or a target-framework error | Install/select a .NET 10 SDK; .NET 8 cannot build `net10.0` projects. |
| Browser CORS failure | Ensure the frontend origin (`http://localhost:3000`) exactly matches an indexed `Cors__AllowedOrigins__*` value if you wire up a frontend API call. |
| Database opens in an unexpected location | Set an explicit `ConnectionStrings__Portfolio` path; relative SQLite paths resolve from the API process working directory. |
| Telemetry is absent | Set `ApplicationInsights__ConnectionString`; the API only registers telemetry when this value is non-empty. |
| Resume download shows placeholder content | Replace the checked-in placeholder PDF and retain the `profile.resumePath` contract. |
| `docker compose up --build` fails on the frontend service | Expected — see the Docker/Azure known gap above; `frontend/Dockerfile` needs to be rewritten for Next.js. |
| Azure deployment fails before upload | Check the `production` GitHub environment, required OIDC secrets/variables, and placeholder-free Bicep parameter values described in `DEPLOYMENT.md`; also see the known gap above. |
| API exits immediately in Production | Supply a valid `Contact__HashSalt`; placeholder, low-variety, or shorter-than-32-character values fail fast. |
| Metadata changes are blocked by frontend CSP | Recompute the inline JSON-LD SHA-256 and update both `frontend/nginx.conf` and `frontend/public/staticwebapp.config.json`. |

## Security and contributing

Read [SECURITY.md](SECURITY.md) before configuring a production environment and [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes. The project has no published security-reporting contact yet; retain `[ADD SECURITY CONTACT]` until one is approved.
