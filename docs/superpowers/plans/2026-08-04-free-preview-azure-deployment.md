# Switzerland North Free Azure Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the Angular portfolio and .NET API together on one Azure App Service F1 instance in Switzerland North, backed only by Azure SQL's free offer with monthly-limit auto-pause.

**Architecture:** GitHub Actions builds Angular, writes a same-origin runtime API configuration, publishes ASP.NET Core, copies the browser output into the API package's `wwwroot`, migrates Azure SQL, and deploys one package. Bicep creates only App Service F1, the web app, an Azure SQL logical server, and a free-offer database.

**Tech Stack:** Angular 22, ASP.NET Core/.NET 10, Azure App Service F1, Azure SQL Database free offer, Bicep, Azure CLI, GitHub Actions OIDC

## Global Constraints

- Region is `switzerlandnorth`.
- Azure for Students spending limit remains `On`; do not upgrade the subscription.
- App Service SKU is exactly F1.
- SQL sets `useFreeLimit: true` and `freeLimitExhaustionBehavior: AutoPause`.
- Do not create Static Web Apps, Key Vault, Application Insights, Log Analytics, storage accounts, custom domains, or paid fallbacks.
- Full automated tests are intentionally skipped at the owner's request; production builds and deployment validation remain mandatory.
- Never print, commit, or persist generated SQL credentials outside Azure/GitHub secret stores.

---

### Task 1: Serve the Angular SPA from ASP.NET Core

**Files:**
- Modify: `backend/src/Portfolio.Api/Program.cs`

**Interfaces:**
- Consumes: Angular browser files placed in `wwwroot` by the deployment workflow.
- Produces: static-file hosting, `index.html` fallback for non-API routes, no-store handling for `/assets/config.js`, and frontend-compatible security headers.

- [ ] **Step 1: Add static file middleware**

Register default files and static files before endpoint execution. Set `/assets/config.js` to `Cache-Control: no-store, max-age=0`; hashed assets may use long-lived immutable caching.

- [ ] **Step 2: Preserve endpoint routing**

Keep `/api/*`, `/health/ready`, and OpenAPI mappings ahead of a final `app.MapFallbackToFile("index.html")` so API errors never become SPA responses.

- [ ] **Step 3: Split API and browser security headers**

Retain `default-src 'none'` for API/health responses. For browser assets use the existing frontend CSP, including the approved inline JSON-LD hash, plus `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

- [ ] **Step 4: Verify production compilation**

Run:

```bash
/usr/local/share/dotnet/dotnet build backend/Portfolio.slnx --configuration Release
```

Expected: exit code 0 with zero build errors.

### Task 2: Reduce Bicep to the free-only resource set

**Files:**
- Modify: `infra/main.bicep`
- Modify: `infra/parameters/production.example.json`
- Modify: `infra/parameters/dev.example.json`

**Interfaces:**
- Consumes: `apiAppName`, `sqlServerName`, and a secure SQL administrator password.
- Produces: `apiHostname` and `sqlServerFqdn` deployment outputs.

- [ ] **Step 1: Remove blocked and deferred resources**

Delete Static Web Apps, Log Analytics, Application Insights, Key Vault, their parameters, and their outputs. Delete the broad Azure-services SQL firewall option.

- [ ] **Step 2: Lock regional and free settings**

Set `location` to `switzerlandnorth` in both parameter examples, retain App Service F1 as the sole allowed SKU, always create SQL with `useFreeLimit: true`, `freeLimitExhaustionBehavior: 'AutoPause'`, 32 GiB maximum size, local backup redundancy, and serverless auto-pause.

- [ ] **Step 3: Compile and inspect Bicep**

Run:

```bash
az bicep build --file infra/main.bicep --stdout >/dev/null
```

Expected: exit code 0; repository search finds no `Microsoft.Web/staticSites`, `BillOverUsage`, paid App Service SKU, Key Vault, or monitoring resource.

### Task 3: Build and deploy one combined package

**Files:**
- Modify: `.github/workflows/deploy-azure.yml`

**Interfaces:**
- Consumes GitHub variables: `AZURE_RESOURCE_GROUP`, `AZURE_WEBAPP_NAME`, `AZURE_SQL_SERVER_NAME`, `FRONTEND_ORIGIN`.
- Consumes GitHub secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_SQL_ADMINISTRATOR_PASSWORD`, `AZURE_SQL_CONNECTION_STRING`, `CONTACT_HASH_SALT`.
- Produces: one App Service package containing the API and Angular SPA.

- [ ] **Step 1: Remove Static Web Apps contracts**

Delete `AZURE_STATIC_WEB_APP_NAME`, `FRONTEND_API_URL`, Static Web Apps token retrieval, and the Static Web Apps upload step.

- [ ] **Step 2: Generate same-origin frontend configuration**

Before `npm run build -- --configuration production`, write `public/assets/config.js` with `apiUrl: ''`, causing frontend requests to use `/api/*` on the current host.

- [ ] **Step 3: Assemble the deployment artifact**

After `dotnet publish`, create `$RUNNER_TEMP/api/wwwroot` and copy all files from `frontend/dist/frontend/browser/` into it.

- [ ] **Step 4: Keep guarded SQL migration and application settings**

Retain App Service outbound-IP firewall reconciliation, the always-cleaned temporary runner rule, EF migration bundle, production hash salt, SQL connection, HTTPS, and self-origin CORS configuration.

- [ ] **Step 5: Verify both site and API after deployment**

After `azure/webapps-deploy@v3`, retry `FRONTEND_ORIGIN/`, `FRONTEND_ORIGIN/api/health`, and `FRONTEND_ORIGIN/health/ready`. Each request must return a successful HTTP status.

### Task 4: Reconcile deployment documentation

**Files:**
- Modify: `README.md`
- Modify: `DEPLOYMENT.md`
- Modify: `SECURITY.md`

**Interfaces:**
- Consumes: the finalized Bicep parameters and GitHub environment contract.
- Produces: an accurate operator handoff without Static Web Apps or North Europe instructions.

- [ ] **Step 1: Update architecture and configuration tables**

Document Switzerland North, combined hosting, same-origin frontend configuration, the reduced variable list, and the free SQL auto-pause behavior.

- [ ] **Step 2: Update operational limitations**

Document App Service F1 shared CPU quota, database unavailability after monthly free-limit exhaustion, lack of SLA, and the absence of optional monitoring/custom domain/Key Vault.

- [ ] **Step 3: Scan for stale deployment claims**

Search deployment documentation and workflow for `Static Web Apps`, `AZURE_STATIC_WEB_APP_NAME`, `FRONTEND_API_URL`, `northeurope`, and `westeurope`. Any remaining occurrence must describe historical constraints rather than the active deployment.

### Task 5: Validate, commit, and push implementation

**Files:** All files modified by Tasks 1–4

**Interfaces:**
- Produces: a clean, deployable `main` branch on `adarsh6980/My-Portfolio`.

- [ ] **Step 1: Run minimum validation without tests**

Run Angular production build, .NET 10 Release build, Bicep compilation, JSON parsing for parameter files, workflow YAML parsing, `git diff --check`, and a tracked-file secret scan.

- [ ] **Step 2: Commit implementation**

```bash
git add backend/src/Portfolio.Api/Program.cs infra .github/workflows/deploy-azure.yml README.md DEPLOYMENT.md SECURITY.md docs/superpowers
git commit -m "feat(azure): deploy portfolio on one free App Service"
```

- [ ] **Step 3: Push `main`**

```bash
git push origin main
```

Expected: local `main` matches `origin/main` and the worktree is clean.

### Task 6: Provision and verify Azure deployment

**Files:** No repository file mutations; Azure and GitHub environment configuration only

**Interfaces:**
- Produces: resource group `rg-adarsh-portfolio-swn`, environment-scoped GitHub OIDC access, free Azure resources, and the public portfolio URL.

- [ ] **Step 1: Re-verify subscription safeguards and capacity**

Confirm subscription state `Enabled`, `spendingLimit: On`, `switzerlandnorth` in the policy allow-list, App Service F1 availability, and SQL `GP_S_Gen5_1` support for `AutoPause`.

- [ ] **Step 2: Resolve names and create the resource group**

Check global name availability for `adarsh6980-portfolio-api` and `adarsh6980-portfolio-sql`, adding only a short deterministic suffix if required. Create `rg-adarsh-portfolio-swn` in `switzerlandnorth`.

- [ ] **Step 3: Create least-scope GitHub OIDC identity**

Create one Entra application/service principal, add the federated subject `repo:adarsh6980/My-Portfolio:environment:production`, and assign Contributor only at the resource-group scope.

- [ ] **Step 4: Run Bicep what-if**

Generate SQL credentials in memory and run `az deployment group what-if`. Continue only if the plan contains exactly the approved App Service plan, web app and credential policies, SQL server, and SQL free-offer database.

- [ ] **Step 5: Deploy infrastructure and verify effective SKUs**

Run the Bicep deployment, then query Azure to prove App Service is F1 and SQL reports `useFreeLimit: true` plus `freeLimitExhaustionBehavior: AutoPause`.

- [ ] **Step 6: Configure the GitHub production environment**

Create the environment; store OIDC identifiers, SQL credentials, and a generated contact hash salt as environment secrets; store the resolved resource names and `https://<apiHostname>` as environment variables.

- [ ] **Step 7: Run and monitor deployment workflow**

Dispatch `.github/workflows/deploy-azure.yml` with `deploy_infrastructure=false`, monitor it to completion, and inspect any failure before retrying.

- [ ] **Step 8: Verify public endpoints and report**

Request the public root page, `/api/health`, and `/health/ready`; report the URL, workflow run, resource group, effective free settings, and deferred custom-domain/monitoring features.
