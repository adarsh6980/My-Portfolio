# Changelog

All notable changes to this portfolio should be recorded here. This file starts from the repository baseline; it does not reconstruct unverified release history.

## Unreleased

### Added

- Root developer, architecture, deployment, contribution, changelog, and security documentation.
- Angular portfolio shell, typed portfolio content, lazy `/projects/:slug` case studies, placeholder-aware project links/images, contact form, and backend contact/project API baseline.
- Typed Contact/CORS/reverse-proxy/database configuration, a 16 KiB contact-body limit, `202 Accepted` neutral receipts, fail-fast production salt validation, conditional Application Insights, and database readiness.
- Frontend runtime config with no-store caching plus matching Nginx/Static Web Apps security headers.

### Current limitations

- Dockerfiles, root `.dockerignore`, Docker Compose, Bicep, CI, and a manual GitHub Actions OIDC deployment workflow are checked in; Docker/Azure were not run locally and no Azure resources are provisioned by default.
- A provider-neutral EF migration runs in Development/Testing or via explicit local Compose opt-in; SQLite execution and SQL Server DDL generation were verified. Azure selects SQL Server, reconciles persistent App Service outbound-IP rules, uses an `always()`-cleaned runner rule for its EF bundle, deploys/readiness-checks the API, then deploys the frontend last.
- A visually verified resume placeholder PDF is supplied; screenshots, verified project URLs, canonical domain, professional email, and measurable project results intentionally remain bracketed placeholders.
- The frontend uses `/assets/config.js` at runtime and falls back to `http://localhost:5050`; `.env.example` is not loaded automatically.

### Security notes

- Production must set a unique secret `Contact__HashSalt` and must not use the development default in `appsettings.json`.
- `ApplicationInsights__ConnectionString` conditionally enables API Application Insights registration when configured.
- Bicep leaves broad Azure-services SQL access off by default, disables basic publishing authentication, and needs `roleAssignments/write` only when optional Key Vault role assignment is provisioned.
