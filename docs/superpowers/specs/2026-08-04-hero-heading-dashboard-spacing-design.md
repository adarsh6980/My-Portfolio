# Hero Heading and Dashboard Spacing Design

## Problem

At the wide desktop breakpoint, the hero heading visually joins `Im` and `Adarsh Ramakrishna` into one crowded word. The summary dashboard containing the MSc, experience, project radar, and core-expertise content also sits too close to the hero content above it.

## Approved Direction

Preserve the current portfolio design and make only two layout corrections:

1. Correct the copy to `I'm` and give the introductory phrase and highlighted name explicit, controlled spacing. Keep the name and comma together so wrapping cannot leave punctuation behind.
2. Add real layout space above the existing hero dashboard so it appears slightly lower on desktop. Reduce that additional space at the stacked tablet/mobile breakpoints to avoid wasting limited vertical space.

The current typography, colors, circuit graphics, avatar, technology badges, dashboard contents, and animations remain unchanged.

## Responsive Behavior

- At desktop sizes, `I'm` and `Adarsh Ramakrishna,` are separate flex items with a small typographic gap and baseline alignment.
- The name may move to the next line as one readable unit when horizontal space is constrained.
- At tablet and mobile sizes, the dashboard keeps a smaller top margin so the stacked hero remains compact.

## Regression Coverage and Verification

- Add a component test for the corrected `I'm` copy and the dedicated heading layout hooks.
- Add a source-level style test for the desktop dashboard spacing and its responsive override.
- Run the frontend unit suite, lint, production build check, and backend test suite.
- Render the page in a real browser at desktop and mobile sizes, confirm the name-line gap is visible, and compare the hero/dashboard bounding boxes.
- Deploy the existing Azure workflow and repeat the browser check on the public site.

## Out of Scope

No 3D globe, parallax effect, visual redesign, content rewrite, new dependency, backend behavior change, Azure topology change, or automatic-deployment workflow change is included.
