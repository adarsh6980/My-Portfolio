# Free Azure Preview Deployment Plan

> Execute this plan sequentially because subscription, identity, and generated endpoint values are dependencies between phases.

**Goal:** Push the current portfolio to GitHub and deploy it to free Azure preview resources in North Europe without disabling the student spending limit or falling back to paid services.

**Architecture:** Angular deploys to Azure Static Web Apps Free. ASP.NET Core deploys to an App Service F1 plan. Azure SQL is provisioned only through the subscription's free database offer with automatic pause at the free monthly limit. GitHub Actions uses an environment-scoped OIDC credential.

**Stack:** Angular 22, .NET 10, Bicep, Azure CLI, GitHub Actions, GitHub CLI

---

## Task 1: Preserve and publish the current application state

**Files:** Existing frontend changes and repository history

1. Inspect the current diff and scan tracked/untracked source files for credentials.
2. Run `git diff --check`.
3. Build the Angular and .NET projects without running the full test suite.
4. Commit the current frontend changes as their own application commit.
5. Add the public GitHub repository as `origin` and push `main`.

## Task 2: Enforce the approved free-only infrastructure

**Files:** `infra/main.bicep`, `infra/parameters/production.example.json`, `.github/workflows/deploy-azure.yml`, related deployment documentation

1. Confirm the current Azure SQL free-offer ARM schema from Microsoft documentation.
2. Change the production region to `northeurope` and the App Service plan to F1.
3. Configure Azure SQL to use the free-offer exhaustion behavior that pauses usage instead of billing beyond the allowance.
4. Add validation that prevents paid SKU fallbacks in the preview configuration.
5. Keep Key Vault and custom-domain resources disabled.
6. Validate Bicep syntax and review the generated resource plan.
7. Commit and push the infrastructure changes.

## Task 3: Authenticate and validate the Azure subscription

1. Sign in with Azure CLI and select the Azure for Students subscription.
2. Record the subscription, tenant, and signed-in account identifiers without exposing tokens.
3. Confirm the subscription is enabled and do not alter its spending-limit or offer settings.
4. Confirm North Europe availability for the selected free services.
5. Confirm resource and role-assignment permissions.
6. Confirm the Azure SQL free offer is available. Stop if it is not.

## Task 4: Prepare Azure and GitHub identity

1. Create `rg-adarsh-portfolio-ne` in North Europe.
2. Create an Entra application and service principal dedicated to GitHub Actions.
3. Add one federated credential scoped to `repo:adarsh6980/My-Portfolio:environment:production`.
4. Grant Contributor only at the deployment resource-group scope.
5. Create the GitHub `production` environment and store tenant, subscription, and client identifiers as environment secrets.

## Task 5: Review and provision infrastructure

1. Resolve globally unique resource names and verify their availability.
2. Run `az deployment group what-if` with the free-only production parameters.
3. Inspect the result for unexpected or chargeable resources.
4. Generate the SQL administrator password in memory and run the approved Bicep deployment.
5. Capture Azure outputs and configure the remaining GitHub environment variables and secrets without printing credentials.

## Task 6: Deploy and verify

1. Trigger the manual GitHub Actions deployment without recreating infrastructure.
2. Monitor the workflow until it succeeds or produces an actionable failure.
3. Verify the frontend URL, API health endpoint, and frontend-to-API access over HTTPS.
4. Report the deployed URLs, Azure resource group, workflow run, free-tier safeguards, and any deferred items.

