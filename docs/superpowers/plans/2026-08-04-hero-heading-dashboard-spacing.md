# Hero Heading and Dashboard Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the crowded hero name line and move the existing hero dashboard slightly lower without changing the portfolio's visual design.

**Architecture:** Use semantic spans and a dedicated flex layout hook to control the heading's word spacing and wrapping. Use responsive CSS margins to create layout spacing above the dashboard, with a smaller value after the dashboard becomes a stacked layout.

**Tech Stack:** Angular 22 templates, SCSS, Jasmine/Karma, Node.js, agent-browser

## Global Constraints

- Preserve the current portfolio design, content card structure, colors, typography, graphics, and animations.
- Correct `Im` to `I'm`.
- Keep `Adarsh Ramakrishna,` together as one highlighted name unit.
- Add no 3D globe, parallax effect, dependency, backend behavior, Azure topology, or workflow-trigger change.

---

### Task 1: Add layout regression coverage

**Files:**
- Modify: `frontend/src/app/app.spec.ts`
- Create: `frontend/scripts/verify-hero-layout.mjs`
- Modify: `frontend/package.json`

**Interfaces:**
- Consumes: the rendered Angular hero template and `frontend/src/app/app.scss`
- Produces: a component contract for `.hero-name-line` and `.hero-name`, plus an npm script named `test:hero-layout`

- [ ] **Step 1: Add the failing component test**

Render `App`, require `.hero-name-line`, require its normalized text to equal `I'm Adarsh Ramakrishna,`, and require a child `.hero-name` whose text equals `Adarsh Ramakrishna,`.

- [ ] **Step 2: Add the failing style verifier**

Create a dependency-free Node script that reads `src/app/app.scss` and requires a `.hero-name-line` flex layout, a `.hero-name` no-wrap rule, a positive `.hero-dashboard` top margin, and a smaller top-margin override inside the existing `max-width: 980px` media query. Register it as `"test:hero-layout": "node scripts/verify-hero-layout.mjs"`.

- [ ] **Step 3: Verify RED**

Run `npm test -- --watch=false --include src/app/app.spec.ts` and `npm run test:hero-layout` from `frontend/`.

Expected: the component test fails because the dedicated heading hooks do not exist, and the style verifier fails because the spacing rules do not exist.

### Task 2: Apply the minimal template and SCSS repair

**Files:**
- Modify: `frontend/src/app/app.html`
- Modify: `frontend/src/app/app.scss`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: the regression contracts from Task 1
- Produces: a correctly spaced heading and responsive dashboard separation

- [ ] **Step 1: Repair the heading markup**

Replace the second hero line with a `.hero-name-line` span containing a plain `I'm` span and a `.hero-name.accent-name` span containing the interpolated profile name plus its comma.

- [ ] **Step 2: Add the minimal layout rules**

Make `.hero-name-line` a wrapping flex row aligned on the text baseline, with a small `column-gap` and `row-gap`. Keep `.hero-name` on one line. Add `margin-top: clamp(1.5rem, 4vh, 2.5rem)` to `.hero-dashboard`, and override it with `margin-top: .9rem` inside the `max-width: 980px` media query.

- [ ] **Step 3: Ignore local brainstorming artifacts**

Add `.superpowers/` under test and tool output in `.gitignore`; this keeps local design-companion state out of the repository without deleting it.

- [ ] **Step 4: Verify GREEN**

Run the focused component test and `npm run test:hero-layout` again. Expected: both pass.

### Task 3: Verify, publish, and check the public result

**Files:**
- Verify only; no further source changes expected

**Interfaces:**
- Consumes: the tested layout repair and existing deployment workflow
- Produces: automated and real-browser evidence for local and public desktop/mobile layouts

- [ ] **Step 1: Run the full automated suite**

From `frontend/`, run `npm test -- --watch=false`, `npm run lint`, `npm run test:hero-layout`, and `npm run test:production-csp`. Then run `/usr/local/share/dotnet/dotnet test backend/Portfolio.slnx --configuration Release` from the repository root.

- [ ] **Step 2: Verify the rendered local layout**

Serve the production build through the existing .NET host. At 2048×1036, verify the visible gap between the introductory phrase and name and confirm the dashboard top is farther below the hero than the pre-change 35.19-pixel gap. At a mobile viewport, confirm the name is readable and the stacked dashboard remains compact.

- [ ] **Step 3: Commit and push**

Commit the docs, tests, template, SCSS, verifier, package script, and ignore rule with a focused message, then push `main` to `origin`.

- [ ] **Step 4: Deploy and verify production**

Start `deploy-azure.yml` for `main`, monitor it to success, and repeat the desktop/mobile browser checks against `https://adarsh6980-portfolio-api.azurewebsites.net`.
