# Deployment and Operations

## Status and topology

The repository contains delivery definitions but no provisioned Azure resources. `.github/workflows/ci.yml` runs frontend and backend checks. `.github/workflows/deploy-azure.yml` is a manual `workflow_dispatch` workflow with a `deploy_infrastructure` toggle that defaults to `false`; it is protected by the GitHub `production` environment and authenticates to Azure with OIDC.

```text
GitHub Actions CI
  └─ lint, test, and production-build Angular + .NET

Manual GitHub Actions deployment (OIDC, production environment)
  ├─ optional Bicep provisioning in an existing resource group
  ├─ build Angular artifact
  ├─ reconcile App Service outbound-IP SQL rules
  ├─ temporary runner SQL rule → EF bundle
  ├─ full App Service settings → API deploy → readiness probe
  └─ transiently fetch/mask SWA key → deploy Angular last
Optional: Key Vault resource and managed identity role assignment
```

`infra/main.bicep` defines Azure Static Web Apps, Linux App Service plan/API, Log Analytics/Application Insights, optional Azure SQL, and optional Key Vault. It does not own App Service application settings; the deployment workflow reconciles the complete expected settings set. `infra/parameters/dev.example.json` and `infra/parameters/production.example.json` are examples only and contain no deployment credentials.

## Required runtime configuration

Use platform application settings, managed identity/Key Vault references where wired, or an approved secret store. Do not commit production values to `appsettings.json`, `.env`, frontend source, parameter files, or workflow YAML.

| Key | Required for | Source status | Notes |
| --- | --- | --- | --- |
| `ASPNETCORE_ENVIRONMENT` | API runtime | `.env.example`; deployment workflow | Workflow configures `Production` on App Service. |
| `ASPNETCORE_URLS` | Local/container API binding | `.env.example`; Compose/Docker | Platform hosting may provide its own binding. |
| `Database__Provider` | API persistence | `.env.example`; deployment workflow | Workflow sets `SqlServer`; local/Compose uses `Sqlite`. |
| `Database__ApplyMigrationsOnStartup` | Local-container schema setup | `.env.example`; Compose | Compose opts in for its SQLite volume; keep disabled in Azure, which uses the gated migration bundle. |
| `ConnectionStrings__Portfolio` | API persistence | `.env.example`; deployment workflow | `AZURE_SQL_CONNECTION_STRING` is a production GitHub secret. |
| `Cors__AllowedOrigins__0` | Browser access | `.env.example`; deployment workflow | Must equal the verified public frontend origin; never use a broad wildcard. |
| `Contact__HashSalt` | Requester-hash salting | Consumed by API | Use `CONTACT_HASH_SALT` in GitHub/Compose; non-development requires a unique, varied value of at least 32 characters. |
| `ReverseProxy__TrustForwardedHeaders` | Proxy-aware scheme/IP handling | `.env.example`; deployment workflow | Azure enables it; API trusts one hop only from RFC1918 private networks. |
| `ApplicationInsights__ConnectionString` | Telemetry configuration | `.env.example`; deployment workflow | Workflow reads the provisioned component and writes the setting; API registers telemetry only when non-empty. |
| `PORTFOLIO_API_URL` | Docker frontend build | `docker-compose.yml` / `frontend/Dockerfile` | Browser-reachable URL, defaulting to `http://localhost:5050`. |

`.env.example` is not loaded automatically. The frontend loads public API configuration from `/assets/config.js` via `globalThis.__PORTFOLIO_CONFIG__`; the deployment workflow writes it from `FRONTEND_API_URL` and Docker writes it from `PORTFOLIO_API_URL`.

## GitHub Actions, OIDC, variables, and secrets

The deployment workflow uses `azure/login@v2` with `id-token: write`; it does not use a long-lived Azure client secret. Configure an Azure Entra federated credential whose subject matches the approved repository and `production` environment. At the target resource-group scope, the OIDC principal needs permission to deploy resources, read App Service outbound addresses and Application Insights, manage SQL firewall rules, update/deploy App Service, and list the Static Web Apps API key. Resource-group `Contributor` covers the ordinary resource operations but does not grant role-assignment writes. Enable optional Key Vault provisioning only after separately granting `Microsoft.Authorization/roleAssignments/write` at the required scope (for example, an appropriate RBAC-administration role or a narrowly scoped custom role); that extra permission is unnecessary when `deployKeyVault=false`.

Create these **production environment variables**:

| Variable | Used for |
| --- | --- |
| `AZURE_RESOURCE_GROUP` | Existing resource group used by Bicep, Static Web Apps, and App Service operations. |
| `AZURE_STATIC_WEB_APP_NAME` | Bicep override and transient lookup of the persistent Static Web Apps deployment API key. |
| `AZURE_WEBAPP_NAME` | Bicep override and API deployment target. |
| `AZURE_SQL_SERVER_NAME` | Bicep override plus persistent App Service and temporary runner firewall-rule management. |
| `FRONTEND_API_URL` | Public API base URL written to the frontend runtime config. |
| `FRONTEND_ORIGIN` | Exact public Static Web Apps origin allowed by API CORS, without a trailing slash. |

Create these **production environment secrets**:

| Secret | Used for |
| --- | --- |
| `AZURE_CLIENT_ID` | OIDC Azure login; corresponds to `[ADD FEDERATED IDENTITY CLIENT ID]`. |
| `AZURE_TENANT_ID` | OIDC Azure login; corresponds to `[ADD AZURE TENANT ID]`. |
| `AZURE_SUBSCRIPTION_ID` | OIDC Azure login; corresponds to `[ADD AZURE SUBSCRIPTION ID]`. |
| `AZURE_SQL_ADMINISTRATOR_PASSWORD` | Bicep SQL provisioning only; required when SQL is provisioned. |
| `AZURE_SQL_CONNECTION_STRING` | API App Service connection string. |
| `CONTACT_HASH_SALT` | API requester-hash salt. |

The workflow fetches the Static Web Apps resource's persistent deployment API key transiently during the OIDC-authenticated run, masks it immediately, and does not store it as a GitHub secret. The `.env.example` placeholder `AZURE_RESOURCE_GROUP=[ADD RESOURCE GROUP]` is a local deployment contract; the workflow reads `AZURE_RESOURCE_GROUP` as an environment variable.

Before enabling deployment, configure `production` protection/review rules, verify the federated subject/RBAC, and replace every Bicep example name with an approved unique value. Before any application-deployment mutation, the workflow validates every required production value, HTTPS origins, and the contact-hash salt. It removes any broad `AllowAzureServices` SQL rule, reconciles persistent `portfolio-app-*` rules against all possible App Service outbound IPs, deletes obsolete rules in that namespace, and separately creates an `always()`-cleaned runner rule for the SQL Server EF bundle. It also deletes stale indexed CORS settings before writing the single approved origin, deploys the API, retries `/health/ready`, and only then deploys the frontend. Azure deployment has not been run from this local environment.

## Docker and local containers

The frontend image uses a Node 22 build stage and the pinned Nginx 1.30.4 Alpine 3.24 runtime on port `8080`. The API image uses .NET 10 build/runtime images, runs as the non-root `portfolio` user, exposes port `5050`, and probes `/health/ready`. The root `.dockerignore` keeps secrets, VCS metadata, local databases, dependencies, outputs, and reports out of both build contexts.

Compose creates a frontend service on `8080`, API service on `5050`, and persistent SQLite volume named `portfolio-data`; it explicitly enables startup migration for that local SQLite volume and waits for readiness. `CONTACT_HASH_SALT` is mandatory and must satisfy the non-development startup policy. Validate and run it with:

```bash
CONTACT_HASH_SALT="$(openssl rand -hex 32)" docker compose config
CONTACT_HASH_SALT="$(openssl rand -hex 32)" docker compose up --build
```

Replace the hash-salt placeholder before executing the commands. Set `PORTFOLIO_API_URL` to a browser-reachable API base URL before building the frontend image when the default is unsuitable. Do not use the Docker service name as this value: a browser cannot resolve it. Docker was unavailable in the current local verification environment, so these commands have not been executed here.

## Azure configuration and costs

The Bicep defaults are Static Web Apps `Free`; App Service `B1` (with `F1` allowed for experimentation); optional Azure SQL serverless General Purpose at one minimum/maximum vCore, 60-minute auto-pause, and 32 GiB maximum size; and Log Analytics retention of 30 days. Key Vault and SQL are disabled in the development example. `allowAzureServicesToSql` defaults to `false`; the broad `AllowAzureServices` rule is created only when explicitly requested, while the normal deployment manages named outbound-IP rules. The default Key Vault name is independently bounded to Azure's length rules, and both SCM and FTP basic publishing credentials are disabled. App Service platform health uses the liveness-only `/api/health` path so probes do not continually wake auto-paused SQL; workflow deployment readiness uses `/health/ready`.

Prices and availability are region- and subscription-dependent. Before provisioning, verify current pricing and availability, then create budgets/cost alerts, set telemetry ingestion/retention limits, apply owner/environment tags, and select an App Service tier appropriate to availability needs. Do not place a fabricated cost estimate in this repository.

## Migration safety

A provider-neutral initial migration exists in `backend/src/Portfolio.Infrastructure/Persistence/Migrations/`. SQLite execution and SQL Server idempotent-DDL generation are verified, and CI repeats the SQL Server provider check. The API executes `MigrateAsync` in Development/Testing or with the explicit startup switch used by local Compose; Azure sets that switch to false. The workflow restores the repository-pinned .NET 10.0.10 EF tool, explicitly selects `Database__Provider=SqlServer`, builds a framework-dependent migration bundle, opens a temporary runner-IP firewall rule, runs the bundle with `AZURE_SQL_CONNECTION_STRING`, and removes the rule even after failure. An actual Azure SQL migration still requires the protected production environment and has not been run locally.

Before production contact data:

1. Create and review provider-appropriate migrations and test an empty-database upgrade for the selected production provider.
2. Keep the workflow EF-bundle step reviewed, auditable, and single-writer; preserve version/rollback evidence outside the temporary runner artifact when releases require it.
3. Verify backup/restore capability before destructive changes and test upgrades against representative data/locking conditions.
4. Use backward-compatible expand/contract changes so the prior API can run during an application rollback.
5. Record the applied migration/version and verify connectivity without logging credentials.

Never enable automatic production schema mutation merely by changing the environment; retain the explicit migration gate.

## Production checklist

- [ ] Angular production build, frontend tests, .NET Release build, and backend tests pass on .NET 10.
- [ ] `docker compose config` and container builds have been validated in an environment with Docker.
- [ ] `production` reviewers/protection, OIDC federation, ordinary resource permissions, and—only if Key Vault is provisioned—`roleAssignments/write` are verified.
- [ ] All required variables/secrets above are configured, with no placeholder values.
- [ ] `FRONTEND_ORIGIN` is the exact HTTPS site origin allowed by CORS, and `FRONTEND_API_URL` is the browser-reachable production API base URL.
- [ ] `Contact__HashSalt` is unique, strong, and secret; Azure SQL credentials are not committed.
- [ ] Azure resource names are unique and approved; pricing, region availability, budgets, and tags are reviewed.
- [ ] A migration artifact, restore plan, and pre-deploy migration validation are complete.
- [ ] `ApplicationInsights__ConnectionString` is configured, alerts are implemented/tested, and the database readiness check is observed in the target environment.
- [ ] App Service liveness uses `/api/health`; workflow `/health/ready` succeeds before the frontend deploys last; contact-form smoke testing succeeds.
- [ ] Resume, screenshots, domain, contact details, links, dates, and metrics are verified or intentionally retain their bracketed placeholders.

## Rollback, monitoring, and teardown

The workflow has no deployment-slot strategy, release-artifact retention policy, or rollback script. It builds a temporary migration bundle during deployment rather than retaining a release artifact. Before production, preserve the prior frontend/API artifact identifiers; roll back application traffic/artifacts before considering a database change; use forward-compatible migrations; and restore a database only from a tested backup after impact review.

Current logging records operational events and contact-submission identifiers. The workflow writes the Application Insights connection string, which conditionally enables API telemetry; `/health/ready` includes the database-context check. Monitor liveness/readiness separately, request latency and errors, rate-limit rejections, persistent firewall-rule drift, migration failures, frontend contact failures, telemetry ingestion, and budget alerts. Redact names, emails, subjects, messages, raw IP addresses, connection strings, keys, tokens, and hash salts.

No Azure resources have been created by this repository. For a future teardown, first disable federation/deployment access after approval, apply the approved personal-data retention/export process, verify required database backups, then delete only the resolved approved resource group/resources. Confirm removal of App Service, Static Web Apps, Azure SQL, Application Insights/Log Analytics, Key Vault, DNS/certificates, and billing/access assignments. Do not issue a broad subscription-level deletion command or guess resource names.
