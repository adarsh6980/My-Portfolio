# Free Azure Preview Deployment Design

**Date:** 2026-08-04
**Status:** Approved by the repository owner

## Goal

Publish the portfolio from `adarsh6980/My-Portfolio` as a production-like preview while keeping the Azure for Students spending limit enabled and avoiding pay-as-you-go resources.

## Approved constraints

- Regional compute/data: North Europe (`northeurope`, Ireland)
- Static Web Apps backend region: West Europe (`westeurope`), the nearest supported European location; static content remains globally distributed
- Frontend: Azure Static Web Apps Free
- API: Azure App Service Free F1
- Database: Azure SQL Database free offer only, with automatic pause when the monthly free allowance is exhausted
- Custom domain: deferred
- Key Vault: deferred
- Subscription upgrade: forbidden
- Paid fallback SKUs: forbidden
- Full local test suite: intentionally skipped at the owner's request

## Deployment shape

GitHub Actions authenticates to Azure through OpenID Connect. A repository `production` environment holds the non-secret deployment variables and the required deployment secrets. The workflow builds the Angular frontend and .NET API, deploys the API to App Service, applies the database migration, and deploys the frontend to Static Web Apps.

The first infrastructure deployment runs locally after a Bicep `what-if` review. This allows the generated Azure hostnames to be captured before the GitHub environment is configured. Later deployments run from GitHub Actions.

## Safety gates

1. Do not change or remove the Azure spending limit.
2. Verify the selected subscription is the Azure for Students subscription before creating resources.
3. Verify the signed-in account can create resources and role assignments within the deployment resource group.
4. Use `what-if` before the first Bicep deployment.
5. Reject any infrastructure plan that contains a non-free App Service or Static Web Apps SKU.
6. Create Azure SQL only when the free database offer is available and can use the auto-pause exhaustion behavior. If it is unavailable, stop and ask the owner instead of creating a paid database.
7. Keep credentials out of Git, shell output, and workflow logs.

## Naming

- Resource group: `rg-adarsh-portfolio-ne`
- Resource prefix: `adarsh6980-portfolio`
- GitHub environment: `production`

Globally unique resource names may receive a short deterministic suffix if Azure reports a collision.

## Verification

The minimum verification is a clean secret scan, successful production builds, successful Bicep validation and `what-if`, a successful GitHub deployment workflow, and HTTP health checks for the public frontend and API. This is deployment validation, not a full test-suite run.
