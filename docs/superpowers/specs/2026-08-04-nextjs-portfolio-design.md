# Next.js Portfolio Redesign — Design Spec

Date: 2026-08-04
Status: Approved

## Context

The repo currently has a working Angular 22 + ASP.NET Core 10 portfolio (`frontend/`, `backend/`) with real CI/CD, Docker, and Azure delivery infra. This spec covers replacing the Angular frontend with a Next.js 14 site while leaving the .NET API and infra untouched.

## Goals

- Replace `frontend/` (Angular) with a Next.js 14 (App Router) + TypeScript + Tailwind CSS site.
- Reuse all existing content (profile, skills, experience, projects, testimonials) from `frontend/src/app/data/portfolio-data.ts` — do not re-author or fabricate content.
- Keep placeholders (`[ADD ...]`) visible in the UI wherever real data doesn't exist yet (testimonials, project screenshots/URLs/results).
- Mobile-first, fully responsive.
- Lighthouse performance 90+ (verified at the end of the build).
- Framer Motion for all animation (scroll reveals, hover states, transitions), respecting `prefers-reduced-motion`.
- Carry forward the existing brand identity (navy glassmorphism, accent blue, Plus Jakarta Sans + IBM Plex Sans/Mono, glass cards, pill buttons) rather than starting from a generic template look.
- Apply frontend-design-skill discipline (8px spacing grid, real type scale, deliberate color tokens) on top of the existing brand rather than ad hoc Tailwind values.

## Non-goals

- No changes to `backend/` (.NET API), `infra/`, Docker, or GitHub Actions in this pass — the contact form continues to POST to the existing API.
- No CMS — content stays as typed TS data in the repo.
- No FAQ section.
- No custom-designed 3D scene — the Spline hero uses the generic public demo scene (`prod.spline.design/kZDDjO5HuC9GJUM2`) as a placeholder; swapping in a bespoke scene from spline.design is a future follow-up, not part of this build.

## Project structure

New `frontend/` (Next.js), replacing the Angular app in place:

```
frontend/
  app/
    layout.tsx          # fonts (next/font), metadata, root shell
    page.tsx             # assembles sections
    globals.css          # Tailwind + design tokens as CSS vars
  components/
    navbar.tsx
    hero.tsx
    feature-cards.tsx
    projects.tsx
    social-proof.tsx
    experience-timeline.tsx
    footer.tsx
    ui/                  # shadcn primitives (button, card) + custom (glass-card, section-heading, reveal wrappers, spotlight)
  lib/
    data.ts              # ported PORTFOLIO_DATA content
    types.ts
  components.json         # shadcn config
```

`npx shadcn@latest init` is run as part of setup to establish `/components/ui`, `lib/utils.ts` (`cn()` helper), and the Tailwind CSS-variable theme shadcn expects. This folder convention is required because shadcn's CLI and any further shadcn/21st.dev components generated later assume components land in `/components/ui` with `cn()` available — deviating from it breaks copy-paste compatibility with future components.

## Design tokens

Carried forward from the current Angular app's `styles.scss` into Tailwind theme + CSS vars, refined with a consistent 8px spacing scale and type scale:

- Backgrounds: `--navy: #12172c`, `--navy-deep: #0f1428`, `--navy-panel: #1b2340`, `--navy-card: #232c4f`
- Text: `--ink: #f5f7fd`, `--muted: #8b93b8`
- Accent: `--accent: #5b7fff`, `--accent-hover: #7896ff`
- Glass surfaces, pill buttons, hairline borders — same visual language as today
- Fonts: Plus Jakarta Sans Variable (display), IBM Plex Sans Variable (body), IBM Plex Mono (accents/eyebrows) — loaded via `next/font` for zero layout shift

## Sections (in order)

1. **Sticky Navbar** — logo/name, nav links (from `navigation[]`), mobile menu with animated open/close (Framer Motion).
2. **Hero** — headline (`profile.heroTitle`), value proposition, CTA buttons (resume + contact), and a Spline 3D scene (robot, generic demo scene) with `Spotlight` effect in a shadcn `Card`, lazy-mounted (see Performance).
3. **3 Feature Cards** — shadcn `Card`-based, one card each for: (1) Frontend engineering, (2) Backend engineering, (3) Cloud & DevOps — the three largest groups in `skillGroups`, each card listing its `skills[]`. ("Data" and "Tools and practices" groups are folded into the Projects/Architecture sections rather than getting their own cards, keeping the count at exactly 3 as specified.)
4. **Projects** — grid of the 3 real case studies from `projects[]` (title, problem/solution, tech, links — with `[ADD ...]` placeholders shown as-is where present).
5. **Social Proof** — `testimonials[]` (shown with visible `[ADD ...]` placeholders) + `achievements[]` stats row.
6. **Experience Timeline** — replaces the originally-requested "pricing" section; visual timeline built from `experience[]` (Resideo, Mersus internship, MSc).
7. **Footer** — social links (`socialLinks[]`), contact email, copyright.

No FAQ section.

## Component sourcing

- **shadcn/ui**: `Card`, `Button`, and other primitives installed via CLI, used as the base for feature cards, project cards, and the hero card.
- **21st.dev-sourced components**: integrated directly (not just inspiration) —
  - `SplineScene` + `Spotlight` + `Card` combo for the hero (from the pasted snippets), using `@splinetool/react-spline` + `@splinetool/runtime`.
  - Additional 21st.dev components may be pulled for navbar/testimonials if useful, hand-adapted to match design tokens and real content.
- Everything else (feature cards, projects, timeline, footer) is hand-built in Tailwind + Framer Motion matching the established design tokens.

## Animation

Framer Motion throughout:
- Staggered `whileInView` fades/slides for card grids and timeline entries.
- Hero entrance animation on load.
- Hover lift/scale on cards and buttons.
- Animated mobile nav open/close.
- All motion respects `prefers-reduced-motion` (reduced/disabled).

## Performance

- Server components by default; Framer Motion/Spline components marked `"use client"` only where required.
- `next/image` for any real images; existing project placeholders (`[ADD PROJECT SCREENSHOT]`) render as styled placeholders, not broken `<img>` tags.
- `next/font` for all typefaces.
- Static generation — no runtime data fetching for page content (data is local TS).
- **Spline hero**: because `@splinetool/react-spline` + `@splinetool/runtime` is a heavy WebGL bundle, it is:
  - Lazy-loaded via `React.lazy`/`Suspense` (already in the snippet).
  - Mounted only when the hero enters the viewport or on user interaction (IntersectionObserver-gated), not eagerly on first paint.
  - Replaced with a static gradient/image fallback on mobile viewports and when `prefers-reduced-motion` is set.
  - Kept off the critical rendering path so the rest of the site's Lighthouse score isn't dragged down by it.
- A Lighthouse pass is run at the end of the build; anything under 90 gets fixed before calling the work done. The Spline-bearing hero page's score is the one most at risk and gets the most scrutiny.

## Content/data flow

`lib/data.ts` is a direct TypeScript port of `frontend/src/app/data/portfolio-data.ts` (same shape as `PortfolioData`), imported by server components at build time. No new content is invented — placeholders remain placeholders.

## Testing

- `npm run build` must succeed (static export/build check).
- Manual responsive check (mobile/tablet/desktop) via browser tool.
- Manual scroll-through to confirm all Framer Motion reveals fire correctly and reduced-motion is respected.
- Lighthouse performance/accessibility/best-practices pass at the end, target 90+ on performance.

## Open follow-ups (explicitly out of scope now)

- Swapping the generic Spline demo scene for a bespoke one (requires designing it in Spline's editor).
- Filling in real testimonials, project screenshots, live URLs, and measurable results (still `[ADD ...]` placeholders).
- Any change to the .NET backend, contact form wiring, or deployment infra.
