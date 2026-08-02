# Adarsh Ramakrishna Full-Stack Portfolio Design

## Product intent

The portfolio presents Adarsh Ramakrishna as a working full-stack software developer with 2.8 years of experience and a focused Angular, .NET, and Azure skill set. Its primary job is to let a recruiter understand his value, evidence, and technical range in under two minutes while giving engineering reviewers enough architectural depth to keep exploring.

The product must never turn missing evidence into invented claims. Unknown links, dates, screenshots, metrics, and contact details remain visibly labelled placeholders in one central data file.

## Chosen approach

Build a deployable monorepo with an Angular 22 standalone SPA, a .NET 10 LTS API, Entity Framework Core, SQLite for local development, Azure SQL for production, and cost-conscious Azure PaaS infrastructure. Angular is hosted by Azure Static Web Apps; the API runs on an Azure App Service Linux plan; Azure SQL, Application Insights, and Key Vault are optional production resources controlled by Bicep parameters.

This approach is preferred over Angular SSR because the portfolio content is static enough for excellent prerendered SEO without adding a long-running Node server. It is preferred over a serverless-only API because the requested .NET architecture, health checks, EF Core persistence, rate limiting, and portfolio demonstration value are clearer in a small ASP.NET Core service.

## Experience architecture

The site is a single long-form portfolio route with anchored sections and progressive disclosure into project detail routes. The header shows the current section, offers a compact accessible mobile menu, and always retains a resume action. Project cards open dedicated project detail pages populated from the same typed data source.

The hierarchy is:

1. Hero thesis and immediate actions.
2. Credibility strip with experience, location, and current education.
3. About and working philosophy.
4. Capability groups with evidence-based confidence labels.
5. Editable experience timeline.
6. Three engineering case studies.
7. Interactive request-lifecycle architecture.
8. Azure deployment pipeline and operational practices.
9. Working contact form.

## Visual system

The reference image contributes its blue-lit outer canvas, oversized dark workspace panel, compact navigation, split hero, subtle source-code texture, generous radius, and soft depth. No branding, artwork, copy, or exact composition is reused.

### Palette

- `Ink` — `#070B14`: page background.
- `Workspace` — `#0D1424`: primary raised surface.
- `Panel` — `#121C30`: cards and secondary surfaces.
- `Azure` — `#5B8CFF`: principal interaction accent.
- `Signal` — `#55D6BE`: healthy system and availability accent.
- `Violet` — `#9B8AFB`: architecture and secondary highlight.
- `Paper` — `#F4F7FF`: primary text.
- `Slate` — `#9CAAC2`: secondary text.

### Typography

Space Grotesk Variable carries display headlines, Manrope Variable carries body content, and JetBrains Mono Variable carries technical labels, snippets, and system states. Fonts are bundled locally through npm packages to avoid layout shifts and third-party font requests.

### Layout and signature

Desktop content sits inside a rounded workspace shell over a restrained radial blue aura and fine perspective grid. Mobile removes the shell illusion and uses the full viewport. The single intentional aesthetic risk is the hero's “living architecture console”: an original animated diagram where a request travels from Angular through the API and data layer to Azure services, with readable live status messages. It proves the site's central engineering story instead of decorating it with floating technology logos.

### Motion

One orchestrated hero entrance, small section reveals, navigation transitions, card elevation, and architecture-flow motion provide depth. `prefers-reduced-motion` disables non-essential animation and never hides or delays content.

## Frontend boundaries

- `core/config` owns runtime API configuration.
- `core/services` owns HTTP communication and document-level behavior.
- `data/portfolio-data.ts` is the single source of editable personal portfolio content.
- `models` defines strict content and API contracts.
- `layout` owns the header, footer, and page shell.
- `shared` owns presentational components such as section headings, badges, social links, and status messages.
- `features/home` composes the portfolio sections.
- `features/projects` renders project details from the same data source.
- `features/contact` owns the reactive form and submission state.

Signals drive menu, active-section, filter, animation, and contact-form UI state. Components use `OnPush`. Routes are lazy-loaded. No UI framework is added.

## Backend boundaries

- `Portfolio.Domain` owns the `ContactSubmission` entity and domain rules.
- `Portfolio.Application` owns DTOs, validators, service interfaces, and use cases.
- `Portfolio.Infrastructure` owns EF Core, database selection, persistence, and provider-specific configuration.
- `Portfolio.Api` owns HTTP endpoints, middleware, rate limiting, health checks, security headers, OpenAPI, and dependency composition.
- `Portfolio.Tests` covers validators, services, and API integration.

The API surface is `GET /api/health`, `GET /api/projects`, `GET /api/projects/{id}`, and `POST /api/contact`. Project responses come from a server-side central content file so the API is demonstrable without adding project-management CRUD that the portfolio itself does not need.

## Contact data flow

Angular validates required fields and sends name, email, subject, message, and an invisible honeypot field. ASP.NET Core applies size limits, syntactic validation, HTML-neutral storage, IP-derived abuse metadata hashing, per-IP rate limiting, and persistence. The response contains a generated submission identifier and neutral success message. Logs contain identifiers and operational state, never the message body or email address. A server-side email adapter can be added later without changing the frontend contract.

## Data and environment strategy

Local runs default to SQLite in a mounted data directory. `Database__Provider=SqlServer` and `ConnectionStrings__Portfolio` switch production to Azure SQL. Startup runs migrations only in local development; production CI uses a guarded migration bundle before application deployment. CORS accepts the configured `Cors__AllowedOrigins` list. Secrets are supplied by user secrets, environment variables, GitHub environments, or Key Vault references.

## Azure and cost strategy

Static Web Apps Free is the default frontend tier. The API Bicep defaults to a Linux Basic plan suitable for a public portfolio; a Free plan can be selected for experimentation but may sleep and lacks production guarantees. Azure SQL uses the serverless General Purpose model with a low maximum vCore and auto-pause parameter where supported. Application Insights and Log Analytics use capped retention. Key Vault is included only when external secrets are configured. No deployment is executed automatically.

## Accessibility, SEO, and resilience

Semantic landmarks, sequential headings, skip navigation, visible focus, keyboard-operable menus, descriptive controls, live form status, contrast-safe tokens, and reduced motion target WCAG 2.1 AA. Metadata includes recruiter-focused title and description, canonical placeholder, Open Graph and Twitter cards, Person structured data, sitemap, robots, and placeholder social image/favicons.

If the API is unavailable, portfolio content still renders and project navigation still works from the frontend data file. Contact preserves typed values, presents a specific retry message, and exposes alternative placeholder contact links. Static content never depends on a successful backend request.

## Testing and acceptance

Angular tests cover routing, data rendering, navigation behavior, contact validation, submission states, and service contracts. .NET tests cover validation, persistence service behavior, health/projects/contact endpoints, honeypot rejection, and rate-limit configuration where practical. Final verification includes production builds, all automated tests, API smoke tests against SQLite, responsive browser screenshots, keyboard checks, accessibility checks, Docker configuration validation, and a secret scan.

## Assumptions

- Professional employer names, exact dates, project screenshots, public URLs, resume, email, phone, domain, and measurable results are unknown and remain explicit placeholders.
- The Mersus Technologies placement description is used exactly within the factual boundaries supplied.
- Contact submissions are persisted by default; outbound email is optional and disabled until provider configuration is supplied.
- Infrastructure is prepared but no paid Azure resource is created or deployed.
