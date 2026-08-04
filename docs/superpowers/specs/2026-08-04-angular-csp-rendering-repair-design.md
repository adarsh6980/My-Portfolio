# Angular CSP Rendering Repair Design

## Problem

The deployed application returns successful HTTP responses and exposes its full Angular DOM, but the browser renders only the background canvas. Production evidence shows two related CSP/build incompatibilities:

- Angular component styles are inserted as inline `<style>` elements, while the frontend CSP currently allows only `style-src 'self'`.
- The optimized production build defers the global stylesheet with `media="print"` and an inline `onload` handler. The strict `script-src` correctly blocks that handler, so the stylesheet never becomes active for screen media.

The unit suites did not catch the problem because it exists only where the optimized Angular output meets the production response headers.

## Approved Approach

Keep the strict script policy and make CSS handling explicitly Angular-compatible:

1. Configure the production Angular build with `optimization.styles.inlineCritical: false`. The generated global stylesheet will load as a normal external stylesheet and will not depend on an inline event handler.
2. Change only the frontend CSP style directive to `style-src 'self' 'unsafe-inline'` so Angular's generated component `<style>` elements can apply.
3. Keep `script-src` unchanged. In particular, do not add `'unsafe-inline'` for scripts.
4. Keep the API CSP unchanged at `default-src 'none'` with its existing frame and base restrictions.

This is the smallest maintainable repair. Dynamic per-response nonces would provide a stricter style policy, but would require transforming the static Angular entry point and wiring the nonce through Angular dependency injection on every request. That complexity is disproportionate for this free preview deployment.

## Regression Coverage

- Add an API integration test proving frontend responses allow Angular inline styles while scripts remain protected from unrestricted inline execution.
- Add a production-build verifier proving the emitted stylesheet does not use the blocked `media="print"`/inline-`onload` loading pattern.
- Run frontend unit tests, frontend lint, the production-build verifier, and backend tests.
- Render the combined application in a real browser and verify representative header and hero elements have the expected layout before deployment.
- After deployment, repeat desktop and mobile screenshots, console/error checks, computed-style checks, API health, and database readiness checks.

## Scope

This repair restores production styling and adds coverage for the missed deployment boundary. It does not redesign the portfolio, loosen inline script protections, alter the Azure free-tier topology, or change contact data behavior.

