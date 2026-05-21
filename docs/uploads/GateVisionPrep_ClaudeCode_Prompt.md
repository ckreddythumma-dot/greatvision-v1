# GateVisionPrep — Claude Code Design Prompt

> Paste this entire prompt into Claude Code to generate the full design prototype.

---

## PROJECT OVERVIEW

Build a **Next.js 14 (App Router) + Tailwind CSS** design prototype for **GateVisionPrep** — a GATE ECE prep platform. This is a design check only: no real auth, no database, no API calls. All data is hardcoded mock data. The goal is to validate UI/UX flows across all major pages.

---

## TECH STACK

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Animations:** Custom SVG + CSS (no Framer Motion or heavy libs)
- **Charts:** Recharts (for PYQ viz)
- **No auth libraries needed** — mock a logged-in/logged-out state with a simple React context toggle

---

## GLOBAL DESIGN SYSTEM

**Color palette (dark theme, premium feel):**
- Background: `#0A0A0F` (near-black)
- Surface: `#111118` (card bg)
- Surface-2: `#1A1A24` (elevated card)
- Border: `#2A2A3A`
- Primary: `#6366F1` (indigo)
- Primary-glow: `#818CF8`
- Accent: `#10B981` (emerald — for correct answers, success)
- Danger: `#EF4444` (red — for wrong answers, failure)
- Warning: `#F59E0B` (amber)
- Text-primary: `#F1F5F9`
- Text-secondary: `#94A3B8`
- Text-muted: `#475569`

**Typography:**
- Font: Inter (Google Fonts)
- Hero headings: 600–700 weight
- Body: 400 weight, 16px base, 1.6 line-height

**Layout:**
- Right-side vertical navbar (fixed, 64px wide on desktop)
- Main content area fills the remaining width
- Max content width: 1280px centered

---

## LAYOUT: RIGHT-SIDE NAVBAR (PERSISTENT)

Create a `<RightNavbar />` component fixed to the **right edge** of the screen, full height, 64px wide.

**Contents (top to bottom):**
1. GV logo mark (stylized "GV" in indigo, top)
2. Navigation icons (vertically stacked, icon + tooltip on hover):
   - Home (house icon) → `/`
   - Subjects (book-open icon) → `/subjects`
   - Progress (bar-chart icon) → `/progress` (greyed out, "Coming Soon" tooltip)
   - PYQ Bank (file-text icon) → `/pyqs` (greyed out)
3. Spacer (flex-grow)
4. User profile section (bottom):
   - If logged out: login icon, clicking triggers mock sign-in
   - If logged in: user avatar circle (initials "RK"), name "Rahul K", small green dot (online), clicking opens a tiny dropdown (Profile / Sign out)

**Active state:** Current page icon gets indigo background pill.

---

## PAGE 1: LANDING PAGE (`/`)

Full-page landing. Right navbar visible. No top navbar.

### Section 1 — Hero
- Full viewport height
- Left 60%: 
  - Eyebrow text: "GATE ECE 2027" in indigo, small caps
  - H1: "Understand GATE. Don't just memorize it."
  - Subheading: "ELI10 explanations → Interactive Visualizations → Real-world Engineering Labs. Built for ECE aspirants who want genuine understanding, not just marks."
  - Two CTAs: "Start with MOSFET — free" (primary indigo button) and "See how it works ↓" (ghost button)
  - Small social proof line: "Join 50+ GATE ECE 2027 aspirants in the beta"
- Right 40%: 
  - Embedded mini MOSFET Viz animation (see Viz Tab spec below — use the same component, just smaller, 380px wide)
  - Label below: "Live MOSFET I-V Simulator — try it"

### Section 2 — How It Works
- Section heading: "One concept. Five layers of understanding."
- 5 cards in a horizontal row, each card:
  - Icon + tab name + one-line description
  - Theory: "Build intuition from scratch — ELI10 → Physics → Formulas"
  - Viz: "See parameters change the device in real time"
  - Lab: "Solve a real Apple A19 Pro engineering problem"
  - PYQs: "GATE 2020–2026 questions with full solutions"
  - Practice: "5 problems per concept. Mastery score tracked."
- Animate cards with a subtle stagger fade-in on scroll

### Section 3 — Real-World Anchor
- Dark card, full width
- Left: Large chip image placeholder (use a styled SVG of a chip die with glowing nodes)
- Right: Narrative text block:
  - "TSMC's N3E process. 3nm gate length."
  - "Apple's A19 Pro: 19 billion transistors."
  - "Each one switching 3.78 billion times per second."
  - "Threshold voltage: ~0.3V. Oxide breakdown: 1.2V."
  - "This is the MOSFET you're about to simulate."
- CTA: "Open the MOSFET Lab →"

### Section 4 — Subject List
- Heading: "3 subjects. 15 gold-standard concepts. V1."
- 3 cards in a row:
  - **Engineering Mathematics** — 5 concepts — "Eigenvalues, Laplace, Probability"
  - **Electronic Devices** — 5 concepts — "MOSFET (Hero), BJT, PN Junction"
  - **Digital Circuits** — 5 concepts — "Boolean, K-Map, Flip-Flops"
- Each card: subject name, concept count, concept list as pills, "Explore →" button

### Section 5 — Footer
- Simple: "GateVisionPrep V1 · Built for GATE ECE 2027 · AI-assisted content — reviewed for accuracy"
- Links: Privacy · Terms · Feedback

---

## PAGE 2: SIGN IN / SIGN UP (`/auth`)

Centered card, dark bg, no navbar (or navbar hidden).

- Logo top center: "GateVision" wordmark
- Heading: "Sign in to unlock Labs & PYQs"
- Subheading: "Theory and Viz are free. Sign in with Google for full access — free, no payment."
- Large Google Sign-In button (white bg, Google logo SVG, "Continue with Google")
- Divider: "or"
- Email input + "Continue with email" button (ghost, lighter — "Coming soon" on hover)
- Below button: "By signing in, you agree to our Terms and Privacy Policy."
- Bottom: Small text — "Already part of the beta? Your progress is saved automatically."

**Mock behavior:** Clicking "Continue with Google" sets `isLoggedIn = true` in context and redirects to `/subjects`.

---

## PAGE 3: SUBJECTS PAGE (`/subjects`)

Right navbar visible.

- Page header: "Subjects" (H1) + "GATE ECE 2027 · V1 Beta — 3 subjects, 15 concepts" (subtext)
- 3 subject cards, stacked or 3-column grid:

**Each Subject Card:**
- Subject name (large)
- GATE weight badge (e.g., "~15 marks" in amber)
- Description (1–2 lines)
- Concept list: 5 concept chips, each clickable → goes to concept page
- Progress bar (mock — 0% for new users, or 40% if logged in as mock data)
- "Explore Subject →" button

**Subjects:**
1. Engineering Mathematics — ~13 marks — "The mathematical backbone of all GATE ECE topics"
   Concepts: Linear Algebra, Calculus, Differential Equations, Laplace Transform, Probability & Statistics

2. Electronic Devices — ~15 marks — "Semiconductor physics from PN junction to MOSFET — the hero concept"
   Concepts: MOSFET I-V ⭐ HERO, MOSFET Regions, PN Junction Diode, BJT Regions, Energy Band Diagrams

3. Digital Circuits — ~14 marks — "Logic design fundamentals with the highest PYQ frequency"
   Concepts: Boolean Algebra, K-Map, MUX/DEMUX, D Flip-Flop, Counters

---

## PAGE 4: CONCEPT PAGE (`/subjects/[subject]/[concept]`)

**Use MOSFET I-V as the reference implementation.** This is the most important page.

### Layout
- **Right navbar:** Persistent (as defined above)
- **Left sidebar (280px, fixed):** Concept navigator (see below)
- **Main content area:** Tab content
- **Top bar:** Breadcrumb + Tab bar

### Left Sidebar — Concept Navigator
- Shows the subject's concept list
- Current concept highlighted with indigo left-border
- Each item: concept name + GATE stars (⭐ count) + completion tick (if attempted)
- Header: subject name + "5 concepts"
- Sticky, scrollable if many concepts

### Top Bar
- Breadcrumb: "Subjects → Electronic Devices → MOSFET I-V Characteristics"
- GATE frequency: ⭐⭐⭐⭐⭐ (5 stars)
- Tag pills: "ECE Core" · "2 marks" · "NAT + MCQ"
- Tab bar: **Theory | Viz | Lab | PYQs | Practice**
  - Active tab: indigo underline, bold
  - Lab, PYQs, Practice: show a small lock icon if user is logged out; clicking triggers a modal

### Auth Gate Modal (for logged-out users clicking Lab/PYQs/Practice)
- Dark overlay modal
- "Unlock Lab & PYQs — free"
- "Sign in with Google to access Labs, PYQs, and Practice. Theory and Viz are always free."
- "Sign in with Google" button → mock sets logged in
- "No thanks, keep exploring Theory" link

---

## TAB 1: THEORY TAB

**Layout:** Single column, max-width 720px, centered in content area.

**Section 1 — ELI10 Explanation**
- Section label: "ELI10 — Start Here" (indigo badge)
- Content (styled as a story card with warm bg):
  > "Imagine a water tap. Turning the handle controls how much water flows through the pipe. The MOSFET is an electronic tap — instead of a handle, you apply a voltage (VGS) to control current flow from drain to source. Apple packs 19 billion of these taps into the A19 Pro chip. Each one smaller than a virus. Each one switching 3.78 billion times per second."
- Pull quote callout: "One voltage. Billions of switches. That's the MOSFET."

**Section 2 — Technical Explanation**
- Section label: "Technical — Physics & Equations"
- Sub-sections with H3 headings:
  - "Structure: Gate, Oxide, Source, Drain, Channel"
  - "Key Parameters: VGS, VDS, Vt, ID, Cox, μn"
  - "Three Regions of Operation" (table: Cutoff / Linear / Saturation with conditions)
  - "Governing Equations" (styled math blocks — use code-style formatting for formulas)
  - "GATE Depth: What's Actually Tested" (bullet list)

**Section 3 — Real-World Anchor**
- Section label: "Real-World — TSMC N3E + Apple A19 Pro"
- Dark card with chip-glow aesthetic:
  - Chain of facts, each line building: Process → Gate length → Transistor count → Clock speed → VGS → Oxide limit
  - Closing line (italic): *"This is the same MOSFET you're about to simulate in the Viz tab."*

**Section 4 — Formula Reference**
- Section label: "Formula Sheet — GATE Ready"
- Clean table or cards:
  - Each formula: equation (mono font) | variables | condition | GATE frequency stars
  - 5–6 formulas for MOSFET I-V
- "AI-assisted content — reviewed for accuracy" disclaimer at the bottom

**Feedback button:** "Was this helpful? 👍 👎" fixed at bottom-right corner.

---

## TAB 2: VIZ TAB

**Layout:**
- **Left sidebar (320px):** Concept & topic navigator tree (subjects → topics → concepts, collapsible)
- **Right main area:** Visualization canvas

### Left Sidebar — Viz Navigator
- Header: "Electronic Devices"
- Tree structure:
  - ▼ MOSFET (expanded, current)
    - • I-V Characteristics ← (current, highlighted)
    - • Regions of Operation
  - ▶ PN Junction Diode (collapsed)
  - ▶ BJT (collapsed)
  - ▶ Energy Band Diagrams (collapsed)
- Clicking a concept loads its Viz in the main area

### Main Viz Area — MOSFET I-V Simulator

**Input Controls (top of main area):**
- Two numeric inputs + sliders side by side:
  - VGS: range 0.0 – 1.2V, step 0.01, default 0.5V
  - VDS: range 0.0 – 1.5V, step 0.01, default 0.6V
- Threshold voltage Vt = 0.3V (shown as a fixed label)
- "Apply" button (or auto-apply on slider drag)
- Live readout badges: `Region: Saturation` · `ID: 2.34 mA` · `VGS: 0.50V`

**Visualization Canvas (SVG, 580px × 360px):**

Build an animated SVG MOSFET cross-section:

```
[Source]  [Gate oxide + Gate]  [Drain]
   │              │                │
   └──────[Channel region]─────────┘
              [Substrate]
```

Animate based on VGS:
- **VGS < 0.3V (Cutoff):** Channel region is empty — grey/dark fill, no current arrow. Status badge: "Cutoff — No Channel"
- **VGS = 0.3V (Threshold):** Channel just begins — faint blue glow at gate-oxide interface. "Threshold — Channel Forming"  
- **0.3V < VGS < 0.8V, VDS < VGS-Vt (Linear):** Channel fills (blue fill), current arrow flows drain→source, wider near source. "Linear — Ohmic Region"
- **VGS > 0.3V, VDS ≥ VGS-Vt (Saturation):** Channel shows pinch-off near drain (narrows to a point). "Saturation — Pinch-Off"

**Additional: I-V Curve plot (Recharts, below the SVG):**
- X-axis: VDS (0–1.5V)
- Y-axis: ID (mA)
- 4 lines for VGS = 0.3, 0.5, 0.7, 0.9V (color coded)
- A moving dot on the curve showing the current operating point
- Dashed line showing the saturation boundary (VDS = VGS - Vt)

**Interaction notes:**
- Animations must NOT run on page load — they respond only to user input
- Smooth CSS transitions (300ms) on all state changes
- When threshold is crossed: brief glow pulse at gate-oxide interface

---

## TAB 3: LAB TAB

**Layout:**
- **Right sidebar (280px):** Lab navigator tree (same as Lab pages, showing lab steps + hints)
- **Main content area:** Lab problem

### Main Lab Area — MOSFET Lab: Apple A19 Pro Engineer

**Step 1 — Context (cinematic intro card):**
- Dark card with subtle chip-grid background pattern
- Heading: "You are an Apple chip engineer."
- Animated zoom sequence: Chip die → single transistor (CSS animation, no video)
- Narrative: "This MOSFET inside the A19 Pro must switch at 3.78 GHz. Your task: calculate the VGS that keeps it in saturation without destroying the gate oxide."

**Step 2 — Parameters Table:**
```
Process:              TSMC N3E (3nm)
VDD:                  0.75V
Threshold (Vt):       0.3V
Oxide Breakdown:      1.2V
Required ID:          4.5 mA
VDS:                  0.6V
μn·Cox·(W/L):         25 mA/V²
```
Styled as a terminal/spec-sheet card.

**Step 3 — Problem Statement:**
- "Calculate VGS such that: (1) MOSFET is in saturation, (2) VGS < oxide breakdown, (3) Required ID is achieved."
- Input: Numeric entry, 2 decimal places, units "V"
- "Submit Answer" button (indigo)
- "Show Hint" toggle (reveals: "Use ID = (μnCox·W/L)/2 · (VGS - Vt)²")

**Step 4 — Feedback (conditional rendering):**
- **Correct (VGS ≈ 0.90V):**
  - Green success card: "Correct. VGS = 0.90V"
  - Animation: channel forms cleanly, current flows, chip label "3.78 GHz ✓"
  - "The A19 Pro stays alive. 19 billion MOSFETs. All switching correctly."
- **Too low (VGS < 0.3V — Cutoff):**
  - Red card: "No channel. The transistor is off. The chip is dead."
  - Animation: empty channel, no current arrow, chip label "DEAD ✗"
- **Too high (VGS > 1.2V — Oxide Breakdown):**
  - Red card with orange glow: "Oxide breakdown. Gate destroyed."
  - Animation: gate oxide flashes red/orange, cracks (CSS clip-path animation)
  - "You just killed a \$1,000 chip. (19 billion MOSFETs × 0.05¢ each)"

**Step 5 — Solution Walkthrough (shown after first attempt):**
- Step-by-step derivation in styled math blocks
- Each step tagged: "Formula: ID (saturation)" | "Condition: VDS ≥ VGS - Vt"

---

## TAB 4: PYQs TAB

**Layout:** Full width, no special sidebar.

**Top filter bar:**
- Filter by Year: 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | All
- Filter by Type: MCQ | NAT | All
- Filter by Marks: 1 mark | 2 marks | All

**PYQ Card (repeat for 4–5 mock questions):**
```
┌─────────────────────────────────────────────────┐
│ GATE 2023 · 2 Marks · NAT                ⭐⭐⭐⭐  │
│                                                 │
│ Q: A MOSFET has Vt = 0.4V, μnCox(W/L) = 2mA/V²│
│ With VGS = 1.0V and VDS = 0.8V, find ID (mA).  │
│                                                 │
│ [Your answer: ____] [Submit]                    │
│                                                 │
│ ⚠ Examiner Trap: Students often forget to       │
│   check if VDS ≥ VGS - Vt before using         │
│   saturation formula.                           │
└─────────────────────────────────────────────────┘
```
After Submit → expands to show full step-by-step solution with formula tags.

**PYQ Viz section (below all questions):**
- Recharts bar chart: "MOSFET questions per GATE year (2020–2026)"
- X: Year, Y: Question count, colored by 1-mark/2-mark
- Small insight: "MOSFET I-V appeared in 6 of the last 7 GATE ECE papers."

---

## TAB 5: PRACTICE TAB

**Layout:** Full width. Problem cards stacked.

**Header:**
- "Concept Practice — MOSFET I-V"
- Mastery score bar: `Mastery: 0 / 50 pts` (animated fill bar, indigo)
- Scoring legend: "+5 correct · -2 wrong · +2 hint used"

**5 Practice Problem Cards:**

**P1 — Concept-check MCQ:**
"A MOSFET is in saturation. If VGS increases while VDS is held constant, what happens to ID?"
- Options: (A) Decreases (B) Increases (C) Stays the same (D) Goes to zero
- After answer: explanation shown + mastery score updates

**P2 — NAT:**
"Calculate ID for VGS = 0.8V, Vt = 0.3V, μnCox·W/L = 4 mA/V². Assume saturation."
- Numeric input (mA, 2 decimal places)

**P3 — Threshold/Boundary:**
"At exactly what VDS does this MOSFET transition from linear to saturation? (VGS = 0.7V, Vt = 0.3V)"
- Numeric input (V, 2 decimal places)

**P4 — Concept-check MCQ:**
"Which region has ID approximately linear with VDS?"
- Options: (A) Cutoff (B) Linear (C) Saturation (D) Breakdown

**P5 — NAT:**
"Find VGS for ID = 6.25 mA given Vt = 0.5V, μnCox·W/L = 5 mA/V². (Assume saturation)"
- Numeric input (V, 2 decimal places)

**Each card behavior:**
- Expand on click
- "Show Hint" toggle (-2 pts if used)
- Answer reveals explanation + updates mastery bar
- Correct → green border flash. Wrong → red border flash.

---

## ADDITIONAL PAGES

### PYQ Viz Page (`/pyqs/viz` or as a standalone page linked from PYQ tab)
- Full-width Recharts dashboard
- Charts: Question frequency by year, by subject, by topic
- Heatmap-style grid: subjects (rows) × years (cols) × question count (cell color)
- Filter sidebar on left
- Styled like an analytics dashboard, dark theme

### Practice Lab Page (`/practice/lab` or modal from Practice tab)
- Standalone focused mode: no distractions, only the current problem
- Timer (optional mock: 4:00 countdown for 2-mark problem)
- "Exit Lab Mode" button top-right
- Black background, single centered problem card

---

## MOCK DATA FILE

Create `/src/data/mockData.ts` with:
- 3 subjects with metadata
- 5 concepts per subject (names, GATE stars, tags)
- MOSFET I-V: full Theory content, 4 PYQs, 5 practice problems
- Mock user: `{ name: "Rahul K", email: "rahul@example.com", avatar: "RK" }`
- Mock mastery scores per concept

---

## ROUTING STRUCTURE

```
app/
├── page.tsx                          → Landing page
├── auth/page.tsx                     → Sign in/up
├── subjects/
│   ├── page.tsx                      → Subjects list
│   └── [subject]/
│       ├── page.tsx                  → Subject detail (concept list)
│       └── [concept]/
│           └── page.tsx              → Concept page (5 tabs)
├── pyqs/
│   └── viz/page.tsx                  → PYQ analytics viz
└── practice/
    └── lab/page.tsx                  → Focused practice lab mode

components/
├── layout/
│   ├── RightNavbar.tsx
│   ├── ConceptSidebar.tsx            → Left sidebar for Theory/Lab/PYQ/Practice
│   └── VizSidebar.tsx                → Left sidebar for Viz tab (topic tree)
├── tabs/
│   ├── TheoryTab.tsx
│   ├── VizTab.tsx
│   ├── LabTab.tsx
│   ├── PYQsTab.tsx
│   └── PracticeTab.tsx
├── viz/
│   └── MOSFETViz.tsx                 → The core MOSFET SVG simulator
├── ui/
│   ├── TabBar.tsx
│   ├── AuthGateModal.tsx
│   ├── MasteryBar.tsx
│   └── FormulaCard.tsx
└── context/
    └── AuthContext.tsx               → Mock auth state (isLoggedIn toggle)
```

---

## CRITICAL IMPLEMENTATION NOTES

1. **MOSFET Viz is the hero component.** Build it first, build it well. The SVG must show real structural changes (channel fill, pinch-off, oxide crack) — not just color changes.

2. **Right navbar layout:** Use CSS Grid or Flexbox with `margin-right: 64px` on the main content wrapper to account for the fixed right navbar. The navbar is `position: fixed; right: 0; top: 0; height: 100vh; width: 64px`.

3. **Viz tab left sidebar vs Lab tab right sidebar:**
   - Viz tab: left sidebar = topic/concept tree navigator. Main area = visualization.
   - Lab tab: NO left sidebar. Instead a **right** sidebar with lab steps + parameter reference. Main area = lab problem.
   - Theory, PYQ, Practice: left sidebar = concept navigator (same across these three).

4. **Tab transitions:** Smooth fade (150ms opacity) between tabs. Not a page reload — use React state for active tab.

5. **Mobile awareness:** The right navbar collapses to a bottom tab bar on screens < 768px. Left sidebars collapse to a slide-in drawer triggered by a hamburger icon.

6. **All animations respond to user input only.** The MOSFET Viz SVG starts in a neutral "Cutoff" state. No animation on page load.

7. **Locked tab behavior:** If `isLoggedIn = false`, Lab / PYQs / Practice tabs show a lock icon (🔒) and clicking them opens the `<AuthGateModal />`. Theory and Viz are always unlocked.

8. **Color consistency:** Use Tailwind's arbitrary values (`bg-[#0A0A0F]`) consistently or define a `tailwind.config.ts` with the custom color palette from the Design System section above.

---

## DELIVERABLE

A fully runnable Next.js 14 app that:
- Starts with `npm run dev`
- Shows all 6 pages (Landing, Auth, Subjects, Concept with 5 working tabs, PYQ Viz, Practice Lab)
- Has a working MOSFET SVG simulator in the Viz tab
- Has the working Lab with correct/wrong/breakdown feedback
- Has mock PYQ cards with expandable solutions
- Has a mastery score bar in the Practice tab
- Has the right-side navbar with mock auth toggle
- Looks polished and production-ready (not a wireframe)

---

*Generated from GateVisionPrep PRD v1.0 — May 2026*
