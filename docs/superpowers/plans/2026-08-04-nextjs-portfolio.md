# Next.js Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Angular frontend at `frontend/` with a Next.js 14 App Router portfolio site (Tailwind, shadcn/ui, Framer Motion, a Spline hero), reusing all existing portfolio content, matching the current navy-glassmorphism brand, and hitting Lighthouse 90+ performance.

**Architecture:** A single Next.js app with server components by default. Content lives in typed local TS modules ported from the existing Angular data file — no CMS, no runtime fetching. Each landing-page section is its own component, assembled in `app/page.tsx`. The Spline 3D hero is the one client-heavy piece and is isolated behind a lazy-mount wrapper so it can't drag down the rest of the site's performance score.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, `@splinetool/react-spline` + `@splinetool/runtime`.

## Global Constraints

- Next.js 14, App Router (not Pages Router).
- TypeScript throughout — no `.js`/`.jsx` files.
- Tailwind CSS for all styling; no separate `.scss`.
- shadcn/ui initialized via CLI (`components.json`, `/components/ui`, `lib/utils.ts` with `cn()`) — required so future shadcn/21st.dev components can be copy-pasted in without restructuring.
- Framer Motion for every animation; every animated element must respect `prefers-reduced-motion` (reduced or skipped, never forced).
- Mobile-first, fully responsive at minimum for 375px / 768px / 1280px+ widths.
- Content is ported verbatim from `frontend/src/app/data/portfolio-data.ts` — never invent testimonials, results, or screenshots; keep `[ADD ...]` placeholders visible in the UI where the source data has them.
- No FAQ section, no pricing section (replaced by an Experience Timeline), no changes to `backend/`, `infra/`, Docker, or GitHub Actions.
- Brand tokens carried over exactly from `frontend/src/styles.scss`: `--navy:#12172c`, `--navy-deep:#0f1428`, `--navy-panel:#1b2340`, `--navy-card:#232c4f`, `--ink:#f5f7fd`, `--muted:#8b93b8`, `--accent:#5b7fff`, `--accent-hover:#7896ff`. Fonts: Plus Jakarta Sans (display), IBM Plex Sans (body), IBM Plex Mono (accents), loaded via `next/font/google` (not `@fontsource`).
- Spline hero (`@splinetool/react-spline`) must be lazy-mounted (IntersectionObserver-gated), with a static fallback on mobile and on `prefers-reduced-motion`, and must never block first paint.
- Target Lighthouse performance score 90+, verified at the end of the build.
- After every task: show the result to the user (dev server screenshot via the browser tool) before starting the next task — the user explicitly asked to review each section before moving on.

---

## File Structure

```
frontend/                         # Next.js app root (replaces Angular app)
  app/
    layout.tsx                    # fonts, <html>/<body>, metadata
    page.tsx                      # assembles all sections in order
    globals.css                   # Tailwind directives + CSS var tokens
  components/
    navbar.tsx
    hero.tsx
    feature-cards.tsx
    projects.tsx
    social-proof.tsx
    experience-timeline.tsx
    footer.tsx
    ui/
      button.tsx                  # shadcn
      card.tsx                    # shadcn
      section-heading.tsx         # custom: eyebrow + title + description
      reveal.tsx                  # custom: Framer Motion scroll-reveal wrapper
      lazy-mount.tsx              # custom: IntersectionObserver mount gate
      spotlight.tsx                # 21st.dev-sourced
      splite.tsx                  # 21st.dev-sourced (SplineScene)
  lib/
    types.ts                      # ported from portfolio.models.ts
    data.ts                       # ported from portfolio-data.ts
  public/
    assets/                       # copied from old frontend/public/assets
    favicon.ico
    robots.txt
    sitemap.xml
  components.json                 # shadcn config
  tailwind.config.ts
  package.json
```

---

### Task 1: Scaffold Next.js app in place of Angular

**Files:**
- Delete: entire current contents of `frontend/` (Angular app) — tracked in git, fully recoverable from history.
- Create: fresh Next.js 14 app at `frontend/` via `create-next-app`.
- Create: `frontend/components.json`, `frontend/lib/utils.ts` via `shadcn init`.
- Copy: `Adarsh-Ramakrishna-Resume-placeholder.pdf`, `social-preview-placeholder.svg`, `favicon.svg`, `robots.txt`, `sitemap.xml` from the old `frontend/public/` tree into the new one.

**Interfaces:**
- Produces: a buildable Next.js app skeleton (`npm run dev`, `npm run build`) that all later tasks add to.

- [ ] **Step 1: Copy assets out before deleting**

```bash
cd /Users/adarsh/Documents/Portfolio
mkdir -p /tmp/portfolio-assets-keep
cp frontend/public/assets/Adarsh-Ramakrishna-Resume-placeholder.pdf /tmp/portfolio-assets-keep/
cp frontend/public/assets/social-preview-placeholder.svg /tmp/portfolio-assets-keep/
cp frontend/public/assets/favicon.svg /tmp/portfolio-assets-keep/
cp frontend/public/robots.txt /tmp/portfolio-assets-keep/
cp frontend/public/sitemap.xml /tmp/portfolio-assets-keep/
cp frontend/src/app/data/portfolio-data.ts /tmp/portfolio-assets-keep/
cp frontend/src/app/models/portfolio.models.ts /tmp/portfolio-assets-keep/
```

- [ ] **Step 2: Remove the Angular app**

```bash
git rm -rq frontend
```

- [ ] **Step 3: Scaffold Next.js**

```bash
npx --yes create-next-app@latest frontend \
  --typescript --tailwind --eslint --app \
  --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

- [ ] **Step 4: Initialize shadcn/ui**

```bash
cd frontend
npx --yes shadcn@latest init -d
npx --yes shadcn@latest add button card
```

- [ ] **Step 5: Install Framer Motion and Spline deps**

```bash
npm install framer-motion @splinetool/react-spline @splinetool/runtime
```

- [ ] **Step 6: Restore copied assets**

```bash
mkdir -p public/assets
cp /tmp/portfolio-assets-keep/Adarsh-Ramakrishna-Resume-placeholder.pdf public/assets/
cp /tmp/portfolio-assets-keep/social-preview-placeholder.svg public/assets/
cp /tmp/portfolio-assets-keep/favicon.svg public/assets/
cp /tmp/portfolio-assets-keep/robots.txt public/
cp /tmp/portfolio-assets-keep/sitemap.xml public/
```

- [ ] **Step 7: Verify it builds and runs**

Run: `npm run build`
Expected: build succeeds with no errors.

Run: `npm run dev` (in background), then load `http://localhost:3000` in the browser tool and confirm the default Next.js starter page renders.

- [ ] **Step 8: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend
git commit -m "chore(frontend): scaffold Next.js 14 app, replace Angular"
```

---

### Task 2: Design tokens, fonts, and global layout shell

**Files:**
- Modify: `frontend/app/globals.css`
- Modify: `frontend/tailwind.config.ts`
- Modify: `frontend/app/layout.tsx`

**Interfaces:**
- Produces: CSS vars (`--navy`, `--navy-deep`, `--navy-panel`, `--navy-card`, `--ink`, `--muted`, `--accent`, `--accent-hover`) and Tailwind theme extensions (`colors.navy`, `colors.navy-deep`, etc., `fontFamily.display`, `fontFamily.body`, `fontFamily.mono`) that every later component task uses.

- [ ] **Step 1: Add CSS var tokens to `globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --navy: #12172c;
  --navy-deep: #0f1428;
  --navy-panel: #1b2340;
  --navy-card: #232c4f;
  --ink: #f5f7fd;
  --muted: #8b93b8;
  --accent: #5b7fff;
  --accent-hover: #7896ff;
  --glass-border: rgba(255, 255, 255, 0.14);
  --glass-bg: rgba(40, 49, 87, 0.38);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--navy);
  color: var(--ink);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Extend `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "var(--navy)",
        "navy-deep": "var(--navy-deep)",
        "navy-panel": "var(--navy-panel)",
        "navy-card": "var(--navy-card)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        13: "3.25rem",
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Load fonts via `next/font/google` in `layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Adarsh Ramakrishna — Full-Stack Software Developer",
  description:
    "Full-stack developer building scalable applications with Angular, .NET and Microsoft Azure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify visually**

Run: `npm run dev`, load `http://localhost:3000` in the browser tool, screenshot it.
Expected: dark navy background (`#12172c`), no console errors, no FOUC.

- [ ] **Step 5: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/app/globals.css frontend/tailwind.config.ts frontend/app/layout.tsx
git commit -m "feat(frontend): add navy-glass design tokens and next/font setup"
```

---

### Task 3: Port portfolio content into typed data module

**Files:**
- Create: `frontend/lib/types.ts`
- Create: `frontend/lib/data.ts`

**Interfaces:**
- Produces: `PortfolioData` type and `PORTFOLIO_DATA` constant, imported by every section component in later tasks. Shape:
  - `PORTFOLIO_DATA.profile: { name, title, heroTitle, valueProposition, location, availability, experienceYears, education, institution, previousEducation, summary, resumePath, email }`
  - `PORTFOLIO_DATA.navigation: { label: string; target: string }[]`
  - `PORTFOLIO_DATA.socialLinks: { label: string; url: string; placeholder: boolean }[]`
  - `PORTFOLIO_DATA.skillGroups: { title: string; confidence: Confidence; skills: string[] }[]`
  - `PORTFOLIO_DATA.experience: { period, role, organisation, kind, summary, highlights: string[], technologies: string[] }[]`
  - `PORTFOLIO_DATA.projects: { slug, title, eyebrow, problem, solution, contribution, architecture, challenges: string[], features: string[], technologies: string[], result, githubUrl, liveUrl, screenshot, screenshotAlt }[]`
  - `PORTFOLIO_DATA.achievements: { value, label, detail }[]`
  - `PORTFOLIO_DATA.testimonials: { quote, name, role }[]`

- [ ] **Step 1: Create `lib/types.ts`** (verbatim port of `portfolio.models.ts`, dropping the Angular import)

```typescript
export type Confidence =
  | "Professional experience"
  | "Strong working knowledge"
  | "Working knowledge"
  | "Currently developing";

export interface SocialLink {
  label: string;
  url: string;
  placeholder: boolean;
}

export interface SkillGroup {
  title: string;
  confidence: Confidence;
  skills: readonly string[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  organisation: string;
  kind: string;
  summary: string;
  highlights: readonly string[];
  technologies: readonly string[];
}

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  problem: string;
  solution: string;
  contribution: string;
  architecture: string;
  challenges: readonly string[];
  features: readonly string[];
  technologies: readonly string[];
  result: string;
  githubUrl: string;
  liveUrl: string;
  screenshot: string;
  screenshotAlt: string;
}

export interface Achievement {
  value: string;
  label: string;
  detail: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    heroTitle: string;
    valueProposition: string;
    location: string;
    availability: string;
    experienceYears: string;
    education: string;
    institution: string;
    previousEducation: string;
    summary: string;
    resumePath: string;
    email: string;
  };
  navigation: readonly { label: string; target: string }[];
  socialLinks: readonly SocialLink[];
  skillGroups: readonly SkillGroup[];
  experience: readonly ExperienceItem[];
  projects: readonly Project[];
  achievements: readonly Achievement[];
  testimonials: readonly Testimonial[];
}
```

- [ ] **Step 2: Create `lib/data.ts`** — copy the `profile`, `navigation`, `socialLinks`, `skillGroups`, `experience`, `projects`, `achievements`, and `testimonials` fields verbatim from `/tmp/portfolio-assets-keep/portfolio-data.ts` (content already captured in Task 1 Step 1), typed as `PortfolioData`, importing `PortfolioData` from `./types`. Drop the `architecture`, `cloudPractices`, and `pipeline` fields — no section in this build uses them.

```typescript
import { PortfolioData } from "./types";

export const PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "Adarsh Ramakrishna",
    title: "Full-Stack Software Developer | Angular | .NET | Azure",
    heroTitle:
      "Building scalable full-stack applications with Angular, .NET and Microsoft Azure.",
    valueProposition:
      "I combine professional software development experience with modern frontend, backend and cloud engineering skills to build reliable, maintainable and user-focused applications.",
    location: "Athlone, Ireland",
    availability: "Open to software development opportunities",
    experienceYears: "3+ years",
    education: "MSc in Software Design with Artificial Intelligence",
    institution: "Technological University of the Shannon, Athlone, Ireland",
    previousEducation: "B.Tech in Information Science and Engineering",
    summary:
      "Full-stack developer with approximately 3+ years of software development experience, now completing an MSc in Ireland. I work across accessible Angular interfaces, maintainable .NET APIs, relational data and practical Azure delivery.",
    resumePath: "/assets/Adarsh-Ramakrishna-Resume-placeholder.pdf",
    email: "adarshrk.dev@gmail.com",
  },
  navigation: [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Skills", target: "skills" },
    { label: "Experience", target: "experience" },
    { label: "Projects", target: "projects" },
    { label: "Contact", target: "contact" },
  ],
  socialLinks: [
    { label: "GitHub", url: "https://github.com/adarsh6980", placeholder: false },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/adarsh-ramakrishna-sd/",
      placeholder: false,
    },
  ],
  skillGroups: [
    {
      title: "Frontend engineering",
      confidence: "Professional experience",
      skills: [
        "Angular",
        "TypeScript",
        "JavaScript",
        "HTML5",
        "CSS3",
        "SCSS",
        "Responsive design",
        "Reactive forms",
        "API integration",
      ],
    },
    {
      title: "Backend engineering",
      confidence: "Professional experience",
      skills: [
        "C#",
        "ASP.NET Core",
        ".NET Web API",
        "Entity Framework Core",
        "REST APIs",
        "Authentication and authorization",
        "Clean Architecture",
        "Dependency injection",
      ],
    },
    {
      title: "Data",
      confidence: "Strong working knowledge",
      skills: ["SQL Server", "Azure SQL", "SQLite", "Database design", "LINQ", "Entity Framework migrations"],
    },
    {
      title: "Cloud and DevOps",
      confidence: "Working knowledge",
      skills: [
        "Microsoft Azure",
        "Azure App Service",
        "Azure Static Web Apps",
        "Azure SQL Database",
        "Application Insights",
        "GitHub Actions",
        "CI/CD",
        "Docker",
        "Git and GitHub",
      ],
    },
    {
      title: "Tools and practices",
      confidence: "Strong working knowledge",
      skills: [
        "Visual Studio Code",
        "Swagger",
        "Postman",
        "Agile development",
        "Object-oriented programming",
        "Debugging",
        "Version control",
      ],
    },
  ],
  experience: [
    {
      period: "FEB 2022 - SEPT 2025",
      role: "PRODUCT DESIGN ENGINEER",
      organisation: "Resideo Smart Home Technologies , Honeywell International Inc.",
      kind: "Professional experience",
      summary:
        "Approximately 3+ years contributing to software development work across frontend, backend, data and API integration.",
      highlights: [
        "Built and maintained practical application features in collaborative development environments.",
        "Worked across user interfaces, backend services, relational data and debugging workflows.",
        "Used source control and maintainable object-oriented practices to deliver changes safely.",
      ],
      technologies: ["Angular", "TypeScript", "C#", ".NET", "SQL", "Git"],
    },
    {
      period: "June 2026 - present",
      role: "Software Development Intern",
      organisation: "Mersus Technologies",
      kind: "Industry placement",
      summary:
        "Worked on an AI-assisted software documentation solution connecting source-control workflows, code analysis, APIs and a frontend application.",
      highlights: [
        "Built and integrated API endpoints and connected backend services with a frontend application.",
        "Extracted code structures including classes, methods, fields and comments.",
        "Integrated local large-language-model workflows for documentation generation.",
        "Worked with source-control-triggered workflows, Node.js, C# and API integration.",
      ],
      technologies: ["Node.js", "C#", "REST APIs", "LLM integration", "Git"],
    },
    {
      period: "Sept 2025 - present",
      role: "MSc in Software Design with Artificial Intelligence",
      organisation: "Technological University of the Shannon",
      kind: "Academic and technical work",
      summary:
        "Developing deeper software design and artificial intelligence knowledge while building practical technical work in Athlone, Ireland.",
      highlights: [
        "Applied software design principles to maintainable full-stack solutions.",
        "Explored responsible AI integration alongside conventional software engineering.",
        "Built on a B.Tech foundation in Information Science and Engineering.",
      ],
      technologies: ["Software design", "Artificial intelligence", "Full-stack development"],
    },
  ],
  projects: [
    {
      slug: "ai-code-documentation",
      title: "AI-Assisted Code Documentation Platform",
      eyebrow: "AI integration · Developer tooling",
      problem:
        "Codebases often contain incomplete documentation, making onboarding and maintenance slower.",
      solution:
        "A review-first platform that extracts source structures, generates documentation drafts and preserves editable history.",
      contribution:
        "Designed the full-stack workflow, API boundaries, extraction pipeline, processing dashboard and resilient error states.",
      architecture:
        "Angular dashboard → ASP.NET Core API → source analysis worker → local LLM adapter → SQLite/Azure SQL history.",
      challenges: [
        "Parsing heterogeneous source structures",
        "Keeping AI output reviewable rather than authoritative",
        "Reporting long-running processing state",
      ],
      features: [
        "Codebase upload or connection",
        "Class and method extraction",
        "Documentation drafts",
        "Review and editing",
        "History",
        "Processing status",
        "Structured logging",
      ],
      technologies: ["Angular", "ASP.NET Core", "C#", "REST APIs", "LLM integration", "SQLite", "Azure"],
      result: "[ADD MEASURABLE RESULT]",
      githubUrl: "[ADD GITHUB URL]",
      liveUrl: "[ADD LIVE DEMO URL]",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "Processing dashboard for the AI-assisted code documentation platform",
    },
    {
      slug: "job-application-tracker",
      title: "Full-Stack Job Application Tracker",
      eyebrow: "Product engineering · Secure CRUD",
      problem: "Job seekers need one reliable view of applications, follow-ups and next actions.",
      solution:
        "A responsive tracker with validated workflows, authentication boundaries, useful filters and dashboard summaries.",
      contribution:
        "Defined the domain model, built the Angular forms and dashboard, implemented the .NET API and automated the Azure delivery path.",
      architecture: "Angular SPA → authenticated ASP.NET Core API → Entity Framework Core → Azure SQL.",
      challenges: [
        "Consistent status transitions",
        "Secure user-level data access",
        "Accessible dense data on mobile",
      ],
      features: [
        "Application CRUD",
        "Stages and notes",
        "Follow-up dates",
        "Search and filters",
        "Dashboard statistics",
        "Authentication",
        "CI/CD",
      ],
      technologies: [
        "Angular",
        "ASP.NET Core",
        "Entity Framework Core",
        "Azure SQL",
        "Azure App Service",
        "GitHub Actions",
      ],
      result: "[ADD MEASURABLE RESULT]",
      githubUrl: "[ADD GITHUB URL]",
      liveUrl: "[ADD LIVE DEMO URL]",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "Responsive application pipeline dashboard for the job application tracker",
    },
    {
      slug: "cloud-project-management",
      title: "Cloud-Based Project Management Application",
      eyebrow: "Cloud architecture · Real-time collaboration",
      problem: "Small teams need a focused place to coordinate ownership, due dates and project activity.",
      solution:
        "A maintainable project workspace with real-time updates, role-aware actions and operational telemetry.",
      contribution:
        "Designed the layered application, real-time event model, role boundaries, Azure topology and monitoring strategy.",
      architecture:
        "Angular SPA → ASP.NET Core + SignalR → Entity Framework Core → Azure SQL, observed by Application Insights.",
      challenges: [
        "Ordering real-time activity",
        "Role-based access rules",
        "Diagnosing cloud failures without logging sensitive data",
      ],
      features: [
        "Projects and tasks",
        "Priorities and owners",
        "Comments",
        "Activity history",
        "Real-time updates",
        "Role-based access",
        "Search and filtering",
      ],
      technologies: ["Angular", "ASP.NET Core", "SignalR", "Azure SQL", "Azure App Service", "Application Insights"],
      result: "[ADD MEASURABLE RESULT]",
      githubUrl: "[ADD GITHUB URL]",
      liveUrl: "[ADD LIVE DEMO URL]",
      screenshot: "[ADD PROJECT SCREENSHOT]",
      screenshotAlt: "Project workspace showing tasks, owners and recent activity",
    },
  ],
  achievements: [
    {
      value: "3+ yrs",
      label: "Professional experience",
      detail: "Shipped production features across frontend, backend and data at Resideo Smart Home Technologies.",
    },
    {
      value: "3",
      label: "End-to-end case studies",
      detail: "Each project below spans the full request lifecycle from browser to Azure SQL, not an isolated demo.",
    },
    {
      value: "MSc",
      label: "Software Design with AI",
      detail: "Completing a master's at TUS Athlone alongside applied engineering work.",
    },
    {
      value: "5",
      label: "Core skill domains",
      detail: "Frontend, backend, data, cloud/DevOps and tooling — each backed by named tools, not an aggregate score.",
    },
  ],
  testimonials: [
    {
      quote:
        "[ADD TESTIMONIAL QUOTE — ask a manager, mentor or collaborator for a short, specific line about working with you]",
      name: "[ADD NAME]",
      role: "[ADD ROLE, COMPANY]",
    },
    {
      quote: "[ADD TESTIMONIAL QUOTE]",
      name: "[ADD NAME]",
      role: "[ADD ROLE, COMPANY]",
    },
  ],
};
```

- [ ] **Step 3: Verify it type-checks**

Run: `cd frontend && npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/lib
git commit -m "feat(frontend): port portfolio content into typed data module"
rm -rf /tmp/portfolio-assets-keep
```

---

### Task 4: Shared UI primitives — SectionHeading and Reveal

**Files:**
- Create: `frontend/components/ui/section-heading.tsx`
- Create: `frontend/components/ui/reveal.tsx`

**Interfaces:**
- Produces:
  - `SectionHeading(props: { eyebrow?: string; title: string; description?: string })` — every section task below uses this for its heading.
  - `Reveal(props: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" })` — wraps any element in a Framer Motion `whileInView` fade/slide; every section task below wraps its animated elements in this.

- [ ] **Step 1: Create `Reveal`**

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const offsets = {
  up: { y: 32, x: 0 },
  left: { y: 0, x: -32 },
  right: { y: 0, x: 32 },
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const offset = offsets[direction];
  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `SectionHeading`**

```tsx
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="max-w-2xl mb-12">
        {eyebrow && (
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-muted">{description}</p>}
      </div>
    </Reveal>
  );
}
```

- [ ] **Step 3: Verify it type-checks**

Run: `cd frontend && npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/ui/section-heading.tsx frontend/components/ui/reveal.tsx
git commit -m "feat(frontend): add SectionHeading and Reveal primitives"
```

---

### Task 5: Navbar

**Files:**
- Create: `frontend/components/navbar.tsx`
- Modify: `frontend/app/page.tsx` (render `<Navbar />` at the top, wired to `PORTFOLIO_DATA`)

**Interfaces:**
- Consumes: `PORTFOLIO_DATA.navigation`, `PORTFOLIO_DATA.profile.name` from `lib/data.ts` (Task 3).
- Produces: `Navbar()` — a sticky top nav, no props (reads `PORTFOLIO_DATA` directly, matching how `page.tsx` will assemble every section).

- [ ] **Step 1: Create `components/navbar.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/data";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <a href="#home" className="font-display text-lg font-bold text-ink">
          {PORTFOLIO_DATA.profile.name}
        </a>

        <ul className="hidden gap-8 md:flex">
          {PORTFOLIO_DATA.navigation.map((item) => (
            <li key={item.target}>
              <a
                href={`#${item.target}`}
                className="text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ink md:hidden"
        >
          <span aria-hidden>{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            {PORTFOLIO_DATA.navigation.map((item) => (
              <li key={item.target}>
                <a
                  href={`#${item.target}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-muted hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

```tsx
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main id="home">
      <Navbar />
    </main>
  );
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, load `http://localhost:3000` in the browser tool.
Expected: sticky navbar with name + nav links visible at desktop width; resize to 375px width and confirm the hamburger menu appears and toggles open/closed with animation. Screenshot both states.

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/navbar.tsx frontend/app/page.tsx
git commit -m "feat(frontend): add sticky animated navbar"
```

- [ ] **Step 5: Show the user this section and wait for go-ahead before Task 6.**

---

### Task 6: Lazy-mount wrapper + Spotlight + SplineScene (hero dependencies)

**Files:**
- Create: `frontend/components/ui/lazy-mount.tsx`
- Create: `frontend/components/ui/spotlight.tsx` (21st.dev-sourced, adapted)
- Create: `frontend/components/ui/splite.tsx` (21st.dev-sourced)

**Interfaces:**
- Produces:
  - `LazyMount(props: { children: React.ReactNode; fallback: React.ReactNode; rootMargin?: string })` — mounts `children` only once the wrapper scrolls into view (via `IntersectionObserver`) AND the viewport is not narrow/reduced-motion; otherwise renders `fallback` permanently. Used by Task 7 (Hero) to gate the Spline scene.
  - `Spotlight(props: { className?: string; size?: number })` — cursor-follow glow, used inside the hero card.
  - `SplineScene(props: { scene: string; className?: string })` — lazy-loaded Spline canvas wrapper.

- [ ] **Step 1: Create `components/ui/lazy-mount.tsx`**

```tsx
"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export function LazyMount({
  children,
  fallback,
  rootMargin = "200px",
}: {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isNarrowViewport = window.matchMedia("(max-width: 767px)").matches;

    if (prefersReducedMotion || isNarrowViewport) {
      return; // stay on fallback
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{shouldRender ? children : fallback}</div>;
}
```

- [ ] **Step 2: Create `components/ui/spotlight.tsx`**

```tsx
"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useSpring, useTransform, SpringOptions } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function Spotlight({ className, size = 200, springOptions = { bounce: 0 } }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = "relative";
        parent.style.overflow = "hidden";
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;
    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);
    parentElement.addEventListener("mousemove", handleMouseMove);
    parentElement.addEventListener("mouseenter", onEnter);
    parentElement.addEventListener("mouseleave", onLeave);
    return () => {
      parentElement.removeEventListener("mousemove", handleMouseMove);
      parentElement.removeEventListener("mouseenter", onEnter);
      parentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200",
        "from-accent/40 via-accent/10 to-transparent",
        isHovered ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ width: size, height: size, left: spotlightLeft, top: spotlightTop }}
    />
  );
}
```

- [ ] **Step 3: Create `components/ui/splite.tsx`**

```tsx
"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
```

- [ ] **Step 4: Verify it type-checks**

Run: `cd frontend && npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/ui/lazy-mount.tsx frontend/components/ui/spotlight.tsx frontend/components/ui/splite.tsx
git commit -m "feat(frontend): add lazy-mount gate, Spotlight, and SplineScene primitives"
```

---

### Task 7: Hero section

**Files:**
- Create: `frontend/components/hero.tsx`
- Modify: `frontend/app/page.tsx` (render `<Hero />` after `<Navbar />`)

**Interfaces:**
- Consumes: `PORTFOLIO_DATA.profile` (Task 3), `Reveal` (Task 4), `LazyMount`, `Spotlight`, `SplineScene` (Task 6), shadcn `Card` (Task 1), `Button` (Task 1).
- Produces: `Hero()` — no props, reads `PORTFOLIO_DATA` directly.

- [ ] **Step 1: Create `components/hero.tsx`**

```tsx
import { PORTFOLIO_DATA } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";
import { LazyMount } from "@/components/ui/lazy-mount";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";

const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

function SplineFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_60%_40%,rgba(91,127,255,0.25),transparent_70%)]">
      <div className="h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(91,127,255,0.5),transparent_70%)] blur-2xl" />
    </div>
  );
}

export function Hero() {
  const { profile } = PORTFOLIO_DATA;

  return (
    <section id="home" className="px-4 pt-16 sm:px-8 sm:pt-24">
      <Card className="mx-auto max-w-6xl overflow-hidden border-white/10 bg-navy-panel/60">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={300} />
        <div className="flex flex-col md:flex-row md:min-h-[520px]">
          <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 p-8 sm:p-12">
            <Reveal>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                {profile.title}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
                {profile.heroTitle}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="max-w-xl text-muted">{profile.valueProposition}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={profile.resumePath}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-accent-hover"
                >
                  Download résumé
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Get in touch
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative min-h-[320px] flex-1">
            <LazyMount fallback={<SplineFallback />}>
              <SplineScene scene={SPLINE_SCENE_URL} className="h-full w-full" />
            </LazyMount>
          </div>
        </div>
      </Card>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`**

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
    </main>
  );
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, load `http://localhost:3000`, wait ~2s, screenshot.
Expected: headline, value prop, and CTA buttons visible; scrolling the hero into view triggers the Spline robot scene to load on desktop width; resize to 375px and confirm the static gradient fallback shows instead (no Spline network request at that width — check via the browser network tool).

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/hero.tsx frontend/app/page.tsx
git commit -m "feat(frontend): add hero section with lazy-mounted Spline scene"
```

- [ ] **Step 5: Show the user this section and wait for go-ahead before Task 8.**

---

### Task 8: Feature cards

**Files:**
- Create: `frontend/components/feature-cards.tsx`
- Modify: `frontend/app/page.tsx`

**Interfaces:**
- Consumes: `PORTFOLIO_DATA.skillGroups` (Task 3), `SectionHeading`, `Reveal` (Task 4), shadcn `Card` (Task 1).
- Produces: `FeatureCards()` — no props; internally filters `skillGroups` to the three titled `"Frontend engineering"`, `"Backend engineering"`, `"Cloud and DevOps"`.

- [ ] **Step 1: Create `components/feature-cards.tsx`**

```tsx
import { PORTFOLIO_DATA } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";

const FEATURED_TITLES = ["Frontend engineering", "Backend engineering", "Cloud and DevOps"];

export function FeatureCards() {
  const cards = PORTFOLIO_DATA.skillGroups.filter((group) => FEATURED_TITLES.includes(group.title));

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <SectionHeading
        eyebrow="What I bring"
        title="Full-stack, cloud-aware engineering"
        description="Three areas I work in day to day, each backed by named tools rather than a vague label."
      />
      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.1}>
            <Card className="h-full border-white/10 bg-navy-card/60 p-6 transition-transform hover:-translate-y-1">
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{group.confidence}</p>
              <h3 className="mb-4 font-display text-xl font-bold text-ink">{group.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** (add `<FeatureCards />` after `<Hero />`)

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, screenshot at desktop and 375px widths.
Expected: exactly 3 cards (Frontend, Backend, Cloud and DevOps), stacked on mobile, 3-column on desktop, fading in with a stagger on scroll.

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/feature-cards.tsx frontend/app/page.tsx
git commit -m "feat(frontend): add 3 feature cards section"
```

- [ ] **Step 5: Show the user this section and wait for go-ahead before Task 9.**

---

### Task 9: Projects section

**Files:**
- Create: `frontend/components/projects.tsx`
- Modify: `frontend/app/page.tsx`

**Interfaces:**
- Consumes: `PORTFOLIO_DATA.projects` (Task 3), `SectionHeading`, `Reveal` (Task 4), shadcn `Card` (Task 1).
- Produces: `Projects()` — no props.

- [ ] **Step 1: Create `components/projects.tsx`**

```tsx
import { PORTFOLIO_DATA } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Case studies"
        title="Projects, end to end"
        description="Each one spans the full request lifecycle, not an isolated demo."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {PORTFOLIO_DATA.projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.1}>
            <Card className="flex h-full flex-col border-white/10 bg-navy-card/60 p-6">
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{project.eyebrow}</p>
              <h3 className="mb-3 font-display text-lg font-bold text-ink">{project.title}</h3>
              <p className="mb-4 flex-1 text-sm text-muted">{project.solution}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-sm font-semibold text-ink">
                <a href={project.githubUrl} className="hover:text-accent">
                  {project.githubUrl.startsWith("[ADD") ? project.githubUrl : "GitHub"}
                </a>
                <a href={project.liveUrl} className="hover:text-accent">
                  {project.liveUrl.startsWith("[ADD") ? project.liveUrl : "Live demo"}
                </a>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** (add `<Projects />` after `<FeatureCards />`)

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, screenshot at desktop and 375px widths.
Expected: 3 project cards showing title, solution summary, top technologies, and the `[ADD GITHUB URL]` / `[ADD LIVE DEMO URL]` placeholders rendered as visible text (not broken links).

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/projects.tsx frontend/app/page.tsx
git commit -m "feat(frontend): add projects section"
```

- [ ] **Step 5: Show the user this section and wait for go-ahead before Task 10.**

---

### Task 10: Social proof section

**Files:**
- Create: `frontend/components/social-proof.tsx`
- Modify: `frontend/app/page.tsx`

**Interfaces:**
- Consumes: `PORTFOLIO_DATA.testimonials`, `PORTFOLIO_DATA.achievements` (Task 3), `Reveal` (Task 4), shadcn `Card` (Task 1).
- Produces: `SocialProof()` — no props.

- [ ] **Step 1: Create `components/social-proof.tsx`**

```tsx
import { PORTFOLIO_DATA } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";

export function SocialProof() {
  const { achievements, testimonials } = PORTFOLIO_DATA;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <div className="grid gap-6 sm:grid-cols-4">
        {achievements.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08}>
            <div className="text-center">
              <p className="font-display text-3xl font-extrabold text-accent">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{item.label}</p>
              <p className="mt-1 text-xs text-muted">{item.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {testimonials.map((testimonial, i) => (
          <Reveal key={i} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
            <Card className="h-full border-white/10 bg-navy-card/60 p-6">
              <p className="text-sm italic text-muted">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-ink">{testimonial.name}</p>
              <p className="text-xs text-muted">{testimonial.role}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** (add `<SocialProof />` after `<Projects />`)

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, screenshot at desktop and 375px widths.
Expected: 4 stat tiles in a row (stacked/wrapped on mobile), 2 testimonial cards below with the `[ADD ...]` placeholder text visible, alternating left/right entrance direction.

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/social-proof.tsx frontend/app/page.tsx
git commit -m "feat(frontend): add social proof section (achievements + testimonials)"
```

- [ ] **Step 5: Show the user this section and wait for go-ahead before Task 11.**

---

### Task 11: Experience timeline

**Files:**
- Create: `frontend/components/experience-timeline.tsx`
- Modify: `frontend/app/page.tsx`

**Interfaces:**
- Consumes: `PORTFOLIO_DATA.experience` (Task 3), `SectionHeading`, `Reveal` (Task 4).
- Produces: `ExperienceTimeline()` — no props.

- [ ] **Step 1: Create `components/experience-timeline.tsx`**

```tsx
import { PORTFOLIO_DATA } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function ExperienceTimeline() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-4 py-20 sm:px-8">
      <SectionHeading eyebrow="Experience" title="Where I've worked and studied" />
      <ol className="relative border-l border-white/10 pl-8">
        {PORTFOLIO_DATA.experience.map((item, i) => (
          <Reveal key={item.role} delay={i * 0.1}>
            <li className="mb-12 last:mb-0">
              <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-accent" />
              <p className="font-mono text-xs uppercase tracking-wider text-accent">{item.period}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-ink">{item.role}</h3>
              <p className="text-sm font-medium text-muted">{item.organisation}</p>
              <p className="mt-2 text-sm text-muted">{item.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** (add `<ExperienceTimeline />` after `<SocialProof />`)

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, screenshot.
Expected: vertical timeline with 3 entries (Resideo, Mersus, MSc), each revealing on scroll.

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/experience-timeline.tsx frontend/app/page.tsx
git commit -m "feat(frontend): add experience timeline section"
```

- [ ] **Step 5: Show the user this section and wait for go-ahead before Task 12.**

---

### Task 12: Footer

**Files:**
- Create: `frontend/components/footer.tsx`
- Modify: `frontend/app/page.tsx`

**Interfaces:**
- Consumes: `PORTFOLIO_DATA.socialLinks`, `PORTFOLIO_DATA.profile` (Task 3).
- Produces: `Footer()` — no props.

- [ ] **Step 1: Create `components/footer.tsx`**

```tsx
import { PORTFOLIO_DATA } from "@/lib/data";

export function Footer() {
  const { socialLinks, profile } = PORTFOLIO_DATA;
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-white/10 px-4 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-bold text-ink">{profile.name}</p>
          <a href={`mailto:${profile.email}`} className="text-sm text-muted hover:text-accent">
            {profile.email}
          </a>
        </div>

        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="text-sm font-semibold text-muted hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted">
        © {year} {profile.name}. Built with Next.js, Tailwind CSS, and Framer Motion.
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** — final assembled version:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeatureCards } from "@/components/feature-cards";
import { Projects } from "@/components/projects";
import { SocialProof } from "@/components/social-proof";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureCards />
      <Projects />
      <SocialProof />
      <ExperienceTimeline />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`, screenshot the full scrolled page at desktop and 375px widths.
Expected: full page renders top to bottom in the order above, no console errors, nav anchor links (`#home`, `#skills`, `#experience`, `#projects`, `#contact`) scroll to the right section.

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components/footer.tsx frontend/app/page.tsx
git commit -m "feat(frontend): add footer and assemble full page"
```

- [ ] **Step 5: Show the user the full assembled page and wait for go-ahead before Task 13.**

---

### Task 13: Responsive QA pass

**Files:**
- Modify: any component file where the QA pass finds a real responsive bug (overflow, unreadable text, broken stacking, tap targets under 44px).

**Interfaces:** none new — this task only fixes issues found in the existing components from Tasks 5–12.

- [ ] **Step 1: Check 375px width**

Resize the browser tool to 375×812, load `http://localhost:3000`, scroll through the full page, screenshot each section.
Expected: no horizontal scroll, no text overflow, tap targets (buttons, nav links) at least 44px tall, mobile nav menu usable.

- [ ] **Step 2: Check 768px width**

Resize to 768×1024, repeat the scroll-through and screenshot.
Expected: layouts using the tablet breakpoint read correctly (feature/project card grids not awkwardly 1-wide if they're meant to wrap to 2).

- [ ] **Step 3: Check 1280px+ width**

Resize to 1280×800, repeat.
Expected: content is centered with the `max-w-6xl`/`max-w-4xl` containers, no excessive whitespace or stretched cards.

- [ ] **Step 4: Fix any issues found**

For each issue found in Steps 1–3, edit the relevant component's Tailwind classes directly (e.g. adjust `grid-cols-*` breakpoints, `text-*` sizes, `gap-*`, `min-h-*` for tap targets). Re-screenshot after each fix to confirm.

- [ ] **Step 5: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend/components
git commit -m "fix(frontend): responsive QA fixes across breakpoints"
```

(Skip this commit if Steps 1–3 found nothing to fix.)

---

### Task 14: Performance pass and Lighthouse verification

**Files:**
- Modify: any component/config file the Lighthouse audit flags (typically `next.config.js` for image/font settings, or a component doing eager work that should be deferred).

**Interfaces:** none new.

- [ ] **Step 1: Production build**

```bash
cd frontend
npm run build
npm run start
```

Expected: build succeeds, `npm run start` serves the production build on `http://localhost:3000`.

- [ ] **Step 2: Run Lighthouse against the production build**

Use the browser tool's DevTools/Lighthouse panel (or `npx --yes lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=/tmp/lighthouse.json` if a CLI run is available) against `http://localhost:3000`.
Expected: performance ≥ 90. Record the actual scores.

- [ ] **Step 3: If performance < 90, diagnose and fix**

Common fixes, applied only if the report calls for them:
- If the Spline bundle is flagged for render-blocking or main-thread work even though lazy-mounted: confirm `LazyMount`'s `rootMargin` isn't triggering it too early (reduce from `200px` to `0px` if needed), and confirm it's truly excluded from the initial JS bundle (check the Network tab for `@splinetool` chunks not loading until scroll).
- If fonts are flagged for layout shift: confirm `next/font` variables are applied on `<html>` (Task 2 Step 3) and no `@fontsource` imports remain anywhere.
- If unused JS is flagged: confirm no component is missing `"use client"` scoping that would otherwise force the whole tree client-side (only `navbar.tsx`, `reveal.tsx`, `lazy-mount.tsx`, `spotlight.tsx`, `splite.tsx`, and `hero.tsx`'s Spline-adjacent parts need it).

Re-run Step 2 after each fix until performance ≥ 90.

- [ ] **Step 4: Commit any fixes**

```bash
cd /Users/adarsh/Documents/Portfolio
git add frontend
git commit -m "perf(frontend): fix Lighthouse performance findings"
```

(Skip this commit if Step 2 already scored ≥ 90 with no changes needed.)

- [ ] **Step 5: Report final scores to the user.**

---

### Task 15: Update root README for the new stack

**Files:**
- Modify: `README.md` (repo root) — the "Stack" and "Local setup" sections currently describe the Angular frontend verbatim; they now describe a removed app.

**Interfaces:** none — documentation only.

- [ ] **Step 1: Update the "Stack" section**

Replace the `Frontend: Angular 22, TypeScript 6, SCSS, and Vitest.` line with:

```markdown
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.
```

- [ ] **Step 2: Update the "Local setup" and "Commands" sections**

Replace `cd frontend && npm ci` / `npm start` / `ng build` / `ng test` / `ng lint` instructions with:

```markdown
cd frontend
npm install
npm run dev
```

and update the commands table's frontend rows to `npm run dev`, `npm run build`, `npm run lint` (drop the Angular-specific `npm test -- --watch=false` row — no test suite exists yet for the Next.js app).

- [ ] **Step 3: Verify**

Read the diff (`git diff README.md`) and confirm no remaining references to Angular, `ng serve`, or `ng build` in the frontend-facing sections.

- [ ] **Step 4: Commit**

```bash
cd /Users/adarsh/Documents/Portfolio
git add README.md
git commit -m "docs: update README for Next.js frontend stack"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers setup/shadcn init; Task 2 covers tokens/fonts; Task 3 covers data porting; Tasks 5–12 cover every section in the spec's order (Navbar, Hero+Spline, Feature Cards, Projects, Social Proof, Experience Timeline, Footer); Task 13 covers mobile-first responsiveness; Task 14 covers Lighthouse 90+; Task 6/7 cover the Spline lazy-mount/fallback performance constraint; Task 15 covers the now-stale root README. No FAQ/pricing tasks exist, matching the spec's non-goals.
- **Placeholder scan:** no TBD/TODO markers; every step has literal code or literal shell commands.
- **Type consistency:** `PortfolioData` (Task 3) is consumed with matching field names (`profile`, `navigation`, `socialLinks`, `skillGroups`, `experience`, `projects`, `achievements`, `testimonials`) by every section task; `Reveal`, `SectionHeading`, `LazyMount`, `Spotlight`, `SplineScene` prop names match between their defining task and every consuming task.
