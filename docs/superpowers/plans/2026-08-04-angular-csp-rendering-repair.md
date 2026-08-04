# Angular CSP Rendering Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the production Angular interface without weakening inline-script protection, and prevent the same CSP/build mismatch from deploying again.

**Architecture:** The Angular production build will emit a normal external global stylesheet instead of the inline-handler-based critical CSS loader. The .NET frontend response CSP will allow Angular's runtime-generated inline component styles while retaining the current strict script directive. Separate automated checks cover each side of this production boundary.

**Tech Stack:** Angular 22, Node.js 22, ASP.NET Core 10, xUnit, GitHub Actions, agent-browser, Azure App Service

## Global Constraints

- Keep the API CSP unchanged.
- Do not add `'unsafe-inline'` to `script-src`.
- Allow `'unsafe-inline'` only in the frontend `style-src` directive.
- Keep the Azure F1 and Azure SQL free-limit topology unchanged.
- Make no portfolio redesign or contact-data behavior changes.

---

### Task 1: Add failing production-boundary regression checks

**Files:**
- Modify: `backend/tests/Portfolio.Tests/ApiIntegrationTests.cs`
- Create: `frontend/scripts/verify-production-csp-compatibility.mjs`
- Modify: `frontend/package.json`
- Modify: `.github/workflows/deploy-azure.yml`

**Interfaces:**
- Consumes: the frontend CSP response header and `frontend/dist/frontend/browser/index.html`
- Produces: xUnit test `Frontend_csp_supports_Angular_styles_without_allowing_inline_scripts` and npm script `test:production-csp`

- [ ] **Step 1: Add the failing API CSP test**

Add a test that requests `/`, extracts the semicolon-delimited `style-src` and `script-src` directives, requires `'unsafe-inline'` in the style directive, and rejects it in the script directive.

- [ ] **Step 2: Run the focused backend test and verify RED**

Run:

```bash
/usr/local/share/dotnet/dotnet test backend/tests/Portfolio.Tests/Portfolio.Tests.csproj --configuration Release --filter Frontend_csp_supports_Angular_styles_without_allowing_inline_scripts
```

Expected: FAIL because the current `style-src` directive is only `'self'`.

- [ ] **Step 3: Add the production build verifier**

Create a dependency-free Node script that reads `dist/frontend/browser/index.html`, finds the global stylesheet link, fails if it has `media="print"` or an inline `onload` handler, and prints a success line otherwise. Add this package script:

```json
"test:production-csp": "npm run build -- --configuration production && node scripts/verify-production-csp-compatibility.mjs"
```

Call `node scripts/verify-production-csp-compatibility.mjs` immediately after the production frontend build in `.github/workflows/deploy-azure.yml`.

- [ ] **Step 4: Run the production verifier and verify RED**

Run `npm run test:production-csp` from `frontend/`.

Expected: FAIL because the current stylesheet link uses `media="print"` and an inline `onload` handler.

### Task 2: Apply the minimal CSP/build repair

**Files:**
- Modify: `backend/src/Portfolio.Api/Program.cs`
- Modify: `frontend/angular.json`

**Interfaces:**
- Consumes: the regression contracts from Task 1
- Produces: an Angular-compatible frontend CSP and a normal external production stylesheet link

- [ ] **Step 1: Make only the frontend style directive Angular-compatible**

Change the frontend CSP from `style-src 'self'` to `style-src 'self' 'unsafe-inline'`. Do not change `apiContentSecurityPolicy` or the `script-src` directive.

- [ ] **Step 2: Disable the inline critical-style loader in production**

Add this exact production setting in `frontend/angular.json`:

```json
"optimization": {
  "styles": {
    "minify": true,
    "inlineCritical": false
  },
  "scripts": true,
  "fonts": true
}
```

- [ ] **Step 3: Verify both focused checks are GREEN**

Run the focused backend test and `npm run test:production-csp` again. Expected: both PASS, and the emitted stylesheet link has neither `media="print"` nor `onload`.

- [ ] **Step 4: Commit the tested repair**

```bash
git add backend/tests/Portfolio.Tests/ApiIntegrationTests.cs backend/src/Portfolio.Api/Program.cs frontend/scripts/verify-production-csp-compatibility.mjs frontend/package.json frontend/angular.json .github/workflows/deploy-azure.yml
git commit -m "fix(frontend): restore Angular styles under production CSP"
```

### Task 3: Verify the complete application locally

**Files:**
- Verify only; no production file changes expected

**Interfaces:**
- Consumes: the combined Angular and .NET deployment package
- Produces: complete automated-suite results and rendered browser evidence

- [ ] **Step 1: Run the complete automated suite**

Run frontend tests with `npm test -- --watch=false`, lint with `npm run lint`, the production build verifier with `npm run test:production-csp`, and backend tests with `/usr/local/share/dotnet/dotnet test backend/Portfolio.slnx --configuration Release`.

Expected: 8 frontend tests, lint, the production CSP verifier, and 16 backend tests all pass.

- [ ] **Step 2: Build a combined local deployment package**

Publish `Portfolio.Api` to a temporary directory, copy `frontend/dist/frontend/browser/` into its `wwwroot/`, and start it with the Testing environment, SQLite, and an explicit localhost CORS origin.

- [ ] **Step 3: Verify rendered desktop and mobile UI**

Use the existing `portfolio-live-ui` browser session against the local combined server. Capture screenshots at desktop and mobile viewport sizes; confirm the header is positioned as designed, the hero is inside the first viewport, the canvas is behind the application, the console is clean, and representative computed styles are non-default.

- [ ] **Step 4: Run accessibility and route checks**

Run the browser accessibility audit, navigate through the primary anchors and a project case-study deep link, and verify the contact form validation without submitting personal data.

### Task 4: Push, deploy, and verify production

**Files:**
- Verify only; no production file changes expected unless deployment evidence exposes a new root cause

**Interfaces:**
- Consumes: the green local commit and existing GitHub OIDC deployment workflow
- Produces: a successful GitHub Actions run and independently verified public UI/API

- [ ] **Step 1: Push `main` and start the deployment workflow**

```bash
git push origin main
gh workflow run deploy-azure.yml --repo adarsh6980/My-Portfolio --ref main
```

- [ ] **Step 2: Monitor the workflow to completion**

Use `gh run watch <run-id> --repo adarsh6980/My-Portfolio --exit-status`. Expected: database migration, package deployment, CSP production verifier, and live readiness steps pass.

- [ ] **Step 3: Repeat the real-browser production verification**

Reload the public URL in the existing browser session, capture desktop and mobile screenshots, check console/errors and computed layout, and verify the stylesheet is active for screen media.

- [ ] **Step 4: Reconfirm free-tier safeguards and repository state**

Verify App Service SKU `F1`, SQL `useFreeLimit: true` with `AutoPause`, Azure Student spending limit `On`, successful workflow SHA equals remote `main`, and the worktree is clean.

