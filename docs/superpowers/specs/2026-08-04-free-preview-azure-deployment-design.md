# Free Azure Preview Deployment Design

**Date:** 2026-08-04
**Status:** Approved verbally; written review pending

## Goal

Publish the portfolio from `adarsh6980/My-Portfolio` as an all-Azure, production-like preview while keeping the Azure for Students spending limit enabled and avoiding pay-as-you-go resources.

## Subscription constraints discovered

The subscription's Microsoft-managed region policy permits Poland Central, Norway East, Sweden Central, Italy North, and Switzerland North. It blocks the originally requested North Europe region and Static Web Apps' nearest supported backend region, West Europe. Azure SQL free serverless capacity is unavailable in Norway East but is available in Switzerland North.

## Approved constraints

- Region: Switzerland North (`switzerlandnorth`)
- Frontend and API: one Linux Azure App Service Free F1 application
- Database: Azure SQL Database free offer only, with automatic pause when the monthly free allowance is exhausted
- Azure spending limit: remains enabled
- Custom domain: deferred
- Key Vault: deferred
- Application Insights and Log Analytics: deferred
- Subscription upgrade: forbidden
- Paid fallback SKUs: forbidden
- Full local test suite: intentionally skipped at the owner's request

## Approaches considered

1. **One Azure App Service for Angular and .NET — selected.** The Angular production output is packaged into the ASP.NET Core application's `wwwroot`. The API serves the static portfolio, API routes, and SPA fallback from the same F1 instance. This stays entirely on Azure, uses one free hosting quota, and avoids the blocked Static Web Apps region.
2. **GitHub Pages frontend plus Azure API.** This would remain free but split runtime ownership across platforms and require separate base-path, SPA-routing, and CORS handling.
3. **Retain Static Web Apps or North Europe.** Azure Policy rejects these locations for this subscription. Upgrading the subscription to bypass the restriction is outside the approved scope.

## Components and data flow

GitHub Actions authenticates to Azure through OpenID Connect. A repository `production` environment holds non-secret deployment variables and required secrets.

The deployment workflow:

1. Builds Angular with a same-origin API base URL.
2. Publishes the .NET API.
3. Copies the Angular browser output into the API package's `wwwroot` directory.
4. Opens a temporary, runner-specific Azure SQL firewall rule.
5. Applies the reviewed Entity Framework migration bundle.
6. Removes the temporary firewall rule even if migration fails.
7. Configures App Service production settings and deploys the combined package.
8. Verifies the public site and `/health/ready` endpoint over HTTPS.

ASP.NET Core maps `/api/*` and health endpoints before the SPA fallback. Unknown non-file browser routes return `index.html`, allowing Angular deep links to work. Static content does not require database availability.

## Infrastructure deployment

The first Bicep deployment runs locally after an Azure `what-if` review. It creates only:

- one resource group in Switzerland North;
- one Linux App Service plan using F1;
- one App Service application;
- one Azure SQL logical server; and
- one Azure SQL free-offer database with `useFreeLimit: true` and `freeLimitExhaustionBehavior: AutoPause`.

Static Web Apps, Key Vault, Application Insights, Log Analytics, storage accounts, custom domains, and paid hosting plans are absent from this preview deployment.

## Error handling and free-limit behavior

App Service liveness uses the database-independent `/api/health` endpoint so platform probes do not keep SQL awake. If Azure SQL exhausts its free monthly allowance, Azure pauses the database until the next calendar month instead of billing overage. The portfolio's static pages remain available, while database-dependent readiness and contact submission can be unavailable during that pause.

The workflow must stop on migration, configuration, deployment, or readiness failure. It must never switch SQL to `BillOverUsage`, select a paid App Service SKU, disable the subscription spending limit, or upgrade the subscription.

## Safety gates

1. Confirm the selected subscription is `Azure for Students`, is enabled, and reports `spendingLimit: On`.
2. Keep all resources in `switzerlandnorth`, an allowed subscription region.
3. Confirm the signed-in account can create resources and scoped role assignments.
4. Verify App Service F1 and Azure SQL free-offer serverless capacity before deployment.
5. Use Bicep validation and `what-if` before the first resource deployment.
6. Reject any infrastructure plan containing Static Web Apps, a non-F1 App Service plan, consumption monitoring, Key Vault, or SQL billing beyond the free offer.
7. Keep credentials out of Git, command output, and workflow logs.

## Naming

- Resource group: `rg-adarsh-portfolio-swn`
- Resource prefix: `adarsh6980-portfolio`
- GitHub environment: `production`

Globally unique resource names may receive a short deterministic suffix if Azure reports a collision.

## Verification

The minimum verification is a clean secret scan, successful Angular and .NET production builds, successful Bicep validation and `what-if`, a successful GitHub deployment workflow, and HTTP checks for the public site, API liveness, and database readiness. This is deployment validation, not a full test-suite run.

