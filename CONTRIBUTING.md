# Contributing

## Scope

Contributions should preserve the portfolio's central rule: do not turn unknown personal facts, links, dates, metrics, screenshots, contact details, employers, domains, or project outcomes into invented claims. Keep existing bracketed `[ADD ...]` placeholders until verified content is supplied.

The repository is currently uncommitted scaffolding/baseline work. Check the working tree before changing files and avoid overwriting unrelated local changes.

## Development workflow

1. Install frontend dependencies with `cd frontend && npm ci`.
2. Restore backend dependencies with `dotnet restore backend/Portfolio.slnx`.
3. Use .NET SDK 10; backend projects target `net10.0`.
4. Run the API and frontend with the local-setup commands in [README.md](README.md).
5. Make a focused change with tests where the relevant test infrastructure exists.
6. Run the applicable checks before requesting review.

## Validation commands

```bash
cd frontend && npm test -- --watch=false
cd frontend && npm run lint
cd frontend && npm run build
dotnet build backend/Portfolio.slnx
dotnet test backend/Portfolio.slnx
```

The repository has frontend Vitest tests and linting, backend xUnit integration tests, Docker/Compose definitions, Bicep, and CI/OIDC workflow definitions. It has no end-to-end-test script. Do not claim container, Azure, or workflow checks ran unless you validate them in an environment with the needed tools and credentials.

## Content changes

- Edit profile, social, skills, experience, project, architecture, and pipeline content in `frontend/src/app/data/portfolio-data.ts`.
- Update `frontend/src/index.html` metadata when changing the person name, public domain, or social links.
- Replace the checked-in placeholder resume at `frontend/public/assets/Adarsh-Ramakrishna-Resume-placeholder.pdf` and update `profile.resumePath` together when the approved public resume is available.
- Keep frontend project slugs consistent with `backend/src/Portfolio.Application/Projects/ProjectCatalog.cs` if both representations are changed.
- Treat screenshots, demo links, repository URLs, professional email, and results as evidence that requires owner approval. Replacing a bracketed project screenshot/URL activates the real lazy image or external link behavior.
- When editing the inline Person JSON-LD in `frontend/src/index.html`, regenerate its exact SHA-256 CSP hash in both `frontend/nginx.conf` and `frontend/public/staticwebapp.config.json`.

## Backend changes

- Preserve dependency direction: Domain has no dependency on other project layers; Application depends on Domain; Infrastructure provides persistence; API performs HTTP composition.
- Validate and normalize contact data in Application; do not log the contact message or email address.
- Keep the 16 KiB request cap, typed `Contact`/`Cors`/`ReverseProxy`/`Database` options, narrow CORS validation, rate limiting, fail-fast production salt policy, and security headers unless a reviewed requirement changes them.
- Forwarded headers are opt-in and limited to one hop from RFC1918 private proxy networks; never broaden trust casually.
- The checked-in migration is applied in Development/Testing or with the explicit Compose startup opt-in. Azure selects SQL Server for its EF bundle, manages persistent App Service outbound-IP rules plus a temporary runner rule, and removes the temporary rule after migration. Do not add automatic Azure startup migrations; retain the reviewed strategy in [DEPLOYMENT.md](DEPLOYMENT.md).

## Frontend changes

- Use standalone Angular components and existing typed models.
- Keep contact feedback accessible and avoid losing a user's typed form values on network errors.
- Preserve visible focus, semantic structure, keyboard operation, and reduced-motion behavior when changing interaction or styling.
- Use `frontend/public/assets/config.js` for the deployed API URL, or `PORTFOLIO_API_URL` while building the Docker frontend image. Do not hard-code a private or unreviewed production URL in source.
- Preserve `Cache-Control: no-store` for `/assets/config.js` and the frontend security headers in both Nginx and Static Web Apps configuration.

## Documentation and review checklist

- [ ] Commands and paths were checked against `frontend/package.json`, `backend/Portfolio.slnx`, and the relevant project files.
- [ ] Any new environment variable is documented in `.env.example`, README, and deployment documentation without adding a secret value.
- [ ] Placeholder content remains bracketed until verified.
- [ ] Tests/builds relevant to the change pass, or the limitation is clearly reported.
- [ ] New production infrastructure includes monitoring, rollback, migration, cost, and teardown considerations.
- [ ] No secrets, contact-submission data, or personally identifying logs are committed.

Report potential vulnerabilities through the process in [SECURITY.md](SECURITY.md), not in a public issue or commit message.
