# TODOS — GreatVision V1

Deferred scope from CEO plan review (2026-05-21).

## P3 — Post-Launch

- [ ] **Keyboard shortcuts for viz controls** — Arrow keys +/- 0.01V, Shift+Arrow +/- 0.1V, number keys for regions. Power-user delight feature. Add post-launch if users spend 30+ min on viz. (Deferred: mobile controls are higher priority for V1.)

## P2 — Post-Validation

- [ ] **E2E tests with Playwright** — Add after Step 3 validation when UX stabilizes. Cover: shareable URL round-trip (?vgs=0.9&tab=viz → correct viz state), lab submission (correct + wrong answer flows), PYQ interaction (MCQ select + NAT input + solution reveal). Deferred from eng review D5: unit + component tests ship with V1, E2E deferred to avoid testing flows that may change after validation feedback.
- [ ] **Create DESIGN.md** — Document the design system after Step 3 validation stabilizes the design. Cover: token system (ink/paper palette, dark mode tokens, accent themes), typography scale (Geist/Instrument Serif/JetBrains Mono), component vocabulary (pills, cards, speccard, region cards), spacing scale (--pad/--gap), shadow scale. Deferred from design review D10: CSS is the implicit system for V1, formalize before building 4 new concepts in Step 4.
