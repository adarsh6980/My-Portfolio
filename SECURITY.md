# Security Policy

## Reporting a vulnerability

Do not publish suspected vulnerabilities, credentials, connection strings, contact-submission records, raw IP addresses, or proof-of-concept data in a public issue, commit, or pull request.

Report privately to `[ADD SECURITY CONTACT]` with:

- a concise description and affected path/endpoint;
- safe reproduction steps;
- impact and any mitigation already taken;
- whether personal data, secrets, or production access might be involved.

The repository does not yet provide an approved security contact, response-time commitment, or disclosure process. Keep this placeholder until the owner establishes one.

## Current security controls

- The contact endpoint rejects bodies over 16 KiB, validates normalized required fields and lengths, checks email syntax, uses a honeypot, and returns the same neutral `202 Accepted` shape for real and discarded requests.
- Contact requests are limited by a global per-IP fixed-window limiter and a stricter endpoint policy.
- The API configures problem details, response compression, CORS with configured origins, HSTS/HTTPS redirection outside tests, and headers for content type, framing, referrer policy, and a restrictive CSP.
- The API logs successful contact-submission identifiers rather than email or message content.
- Requester metadata is hashed with `Contact:HashSalt` before persistence.
- Non-development startup fails when `Contact:HashSalt` is blank, short, low-variety, development-like, or still a bracketed placeholder.
- Application Insights is registered only when `ApplicationInsights__ConnectionString` is configured, and `/health/ready` includes a `PortfolioDbContext` check.
- Forwarded headers are disabled by default; when enabled, the API trusts one hop only from RFC1918 private proxy networks.
- Nginx and Static Web Apps set CSP, permissions, anti-framing, referrer, and content-type headers, and make `/assets/config.js` non-cacheable.
- The deployment workflow authenticates with Azure OIDC, reconciles persistent SQL rules for current App Service outbound IPs, creates a temporary runner-only rule for the SQL Server EF bundle, and removes the temporary rule even after failure.
- Bicep leaves the broad Azure-services SQL firewall rule disabled by default, and the deployment workflow removes that rule if an earlier incremental deployment left it behind. SCM/FTP basic publishing authentication is disabled; optional Key Vault uses a bounded independent name.
- The deployment workflow validates all required production inputs before application-deployment mutations and removes stale indexed CORS origins before writing the single approved frontend origin.

## Sensitive data and secrets

`ContactSubmissions` stores name, email, subject, message, requester hash, and creation time. Treat the database as personal data. Limit database access, avoid copying records into logs/tests/tickets, and define retention/deletion requirements before collecting production submissions.

Do not commit:

- `ConnectionStrings__Portfolio` values with credentials;
- `Contact__HashSalt`;
- `ApplicationInsights__ConnectionString`;
- Azure credentials, access tokens, client secrets, Key Vault values, private URLs, or production `.env` files.

`.env.example` contains placeholders and safe local defaults, but it is not a secret store. The checked-in `Contact:HashSalt` fallback is explicitly development-only and must be overridden in every production environment.

## Current limitations and required hardening

- There is no authentication/authorization because the API only exposes health, project reads, and anonymous contact submission. Do not add privileged functionality without an authorization design.
- There is no external secret-provider wiring, dedicated secret-scanning job, dependency-update automation, or Docker image scanning. CI does run npm and NuGet vulnerability checks. Bicep can provision optional Key Vault and GitHub Actions uses OIDC, but neither replaces deliberate production secret configuration.
- The initial migration is applied in Development/Testing or through the explicit local Compose opt-in. Production migration is the provider-selected workflow EF-bundle step; do not treat local startup migration as the Azure schema-change process.
- The frontend reads public API configuration from `/assets/config.js`, while `.env.example` is not automatically loaded; avoid inserting production secrets or private URLs into frontend code.
- The inline JSON-LD is allowed by an exact CSP SHA-256. Any JSON-LD edit must regenerate that hash in both frontend hosting configurations or the browser will block it.
- Project, social, canonical-domain, and email fields intentionally include bracketed placeholders. Replacing them requires verified owner-provided content.

## Production baseline

Before accepting public production traffic:

1. Use a .NET 10-supported, patched runtime and keep Angular/npm and NuGet dependencies reviewed and updated.
2. Set exact HTTPS CORS origins and a unique, varied `Contact__HashSalt` of at least 32 characters; non-development startup deliberately rejects unsafe values.
3. Store database and telemetry values in platform settings or a managed secret store, with least-privilege access.
4. Implement reviewed migrations, backups, restore tests, and a safe deployment/rollback process.
5. Use deployment OIDC with least-privilege resource-group RBAC and a protected GitHub `production` environment. Grant `Microsoft.Authorization/roleAssignments/write` only when optional Key Vault provisioning needs the managed-identity role assignment; do not use a long-lived Azure client secret where federation is available.
6. Configure telemetry, alerting, database-readiness monitoring, and privacy-aware log redaction.
7. Validate request-size/rate limits, forwarded-header trust, persistent and temporary SQL firewall rules, frontend/API headers, HTTPS, error handling, contact behavior, and dependency vulnerabilities in the deployment environment.
8. Establish a retention/deletion policy and approved security contact before collecting real submissions.

See [DEPLOYMENT.md](DEPLOYMENT.md) for migration, monitoring, rollback, cost, and teardown requirements.
