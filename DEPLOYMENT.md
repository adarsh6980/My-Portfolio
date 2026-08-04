# Deployment and Operations

## Free preview topology

The approved preview runs entirely in Azure Switzerland North (`switzerlandnorth`):

```text
GitHub Actions (environment-scoped OIDC)
  ├─ build Angular with same-origin API configuration
  ├─ publish ASP.NET Core and copy Angular into wwwroot
  ├─ reconcile App Service outbound-IP SQL firewall rules
  ├─ temporary runner SQL rule → EF migration bundle → cleanup
  └─ deploy one combined package → verify site and API

Azure resource group: rg-adarsh-portfolio-swn
  ├─ Linux App Service plan: F1 Free
  ├─ App Service: Angular static files + .NET API
  ├─ Azure SQL logical server
  └─ Azure SQL free-offer database: AutoPause at monthly limit
```

The template does not create Static Web Apps, Key Vault, Application Insights, Log Analytics, storage accounts, custom domains, or a paid hosting fallback. North Europe is an Azure service region, but the Azure for Students policy assigned to this subscription does not permit it.

## Runtime behavior

ASP.NET Core serves `/api/*`, `/api/health`, and `/health/ready`. It also serves the Angular production bundle from `wwwroot` and falls back to `index.html` only for non-API browser routes. `/assets/config.js` contains `apiUrl: ''`, so browser API requests stay on the current HTTPS origin.

App Service liveness uses `/api/health`, which does not query SQL. `/health/ready` includes the database check and is used after deployment. This avoids a platform health probe continually waking a serverless database.

## GitHub production environment

Create these environment variables:

| Variable | Purpose |
| --- | --- |
| `AZURE_RESOURCE_GROUP` | `rg-adarsh-portfolio-swn` deployment scope. |
| `AZURE_WEBAPP_NAME` | Globally unique combined site/API App Service name. |
| `AZURE_SQL_SERVER_NAME` | Globally unique Azure SQL logical-server name. |
| `FRONTEND_ORIGIN` | Exact App Service HTTPS origin without a trailing slash; also the single explicit CORS origin. |

Create these environment secrets:

| Secret | Purpose |
| --- | --- |
| `AZURE_CLIENT_ID` | Entra application client ID for GitHub OIDC. |
| `AZURE_TENANT_ID` | Azure tenant ID. |
| `AZURE_SUBSCRIPTION_ID` | Azure for Students subscription ID. |
| `AZURE_SQL_ADMINISTRATOR_PASSWORD` | SQL provisioning credential. |
| `AZURE_SQL_CONNECTION_STRING` | API SQL Server connection string. |
| `CONTACT_HASH_SALT` | Unique random value of at least 32 varied characters. |

The federated identity subject is `repo:adarsh6980/My-Portfolio:environment:production`. Its service principal receives Contributor only on `rg-adarsh-portfolio-swn`; no client secret is created.

## Infrastructure safeguards

Before the first deployment:

1. Confirm subscription state is `Enabled` and `spendingLimit` is `On`.
2. Confirm `switzerlandnorth` is in the enforced region allow-list.
3. Confirm Linux App Service F1 availability.
4. Confirm Azure SQL `GP_S_Gen5_1` supports free-limit `AutoPause`.
5. Run Bicep validation and `az deployment group what-if`.
6. Reject any plan containing resources outside the approved list.

The database resource always sets:

```text
useFreeLimit: true
freeLimitExhaustionBehavior: AutoPause
maxSizeBytes: 34359738368
requestedBackupStorageRedundancy: Local
```

When the monthly SQL free allowance is exhausted, Azure pauses the database until the next calendar month instead of billing overage. Static portfolio pages can remain available, while contact submission and readiness can be unavailable. Never switch the database to `BillOverUsage` without separate owner approval.

App Service F1 uses shared compute with a CPU quota and has no SLA or scale-out. Optional monitoring and custom-domain work remain deferred.

## Deployment workflow

`.github/workflows/deploy-azure.yml` is manual and protected by the GitHub `production` environment. Use `deploy_infrastructure=true` only when intentionally reconciling Bicep. Normal application releases use `false`.

The workflow validates every required input before mutation, builds Angular and .NET, manages narrow SQL firewall rules, applies the checked-in migration with a temporary EF bundle, deploys one combined package, and retries these URLs:

- `/`
- `/api/health`
- `/health/ready`

The temporary GitHub runner firewall rule is removed with `always()` cleanup. Persistent SQL rules are limited to App Service's current possible outbound addresses. SCM and FTP basic publishing authentication remain disabled.

## Local commands

```bash
cd frontend && npm run build -- --configuration production
/usr/local/share/dotnet/dotnet build backend/Portfolio.slnx --configuration Release
az bicep build --file infra/main.bicep --stdout >/dev/null
```

The full automated test suite is intentionally omitted for this preview deployment at the owner's request.

## Rollback and teardown

The preview has no deployment slots or automatic rollback. Preserve the prior Git commit and workflow run before each release. Database changes must remain backward-compatible because application rollback does not reverse migrations.

For teardown, first disable the GitHub federated credential, follow the approved contact-data retention process, then delete only the resolved resource group `rg-adarsh-portfolio-swn`. Confirm removal of App Service, the F1 plan, Azure SQL, the resource-group role assignment, and GitHub production secrets. Never issue a broad subscription-level deletion command.
