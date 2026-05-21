# GateVision Prep — Product Requirements Document
### Version 1.0 (Feedback Release)

**Version:** 1.0  
**Date:** May 2026  
**Status:** V1 Scope — Founder Approved  
**Audience:** GATE ECE 2027 aspirants — third-year students and passouts  

---

## 1. What V1 Is and Is Not

### 1.1 What V1 Is
A focused, high-quality concept experience for **3 subjects** — built to answer one question:

> *Does the ELI10 → Technical → Real-world → Viz → Lab flow create genuine "aha" moments for GATE aspirants?*

V1 is a **feedback product**. It ships ~15 gold-standard concept pages, a public-facing Theory + Viz layer, and a soft-auth gate before Lab and PYQs. No payments. No adaptive queue. No mock tests. Just the core learning experience, built right.

### 1.2 What V1 Is Not
- Not a full platform. 580 concepts come in V2+.
- Not a paid product. Razorpay is not integrated.
- Not an adaptive system. No spaced repetition, no weakness radar, no mock tests.
- Not a mobile app. Web only.

---

## 2. V1 Subject Scope

### 2.1 The 3 Subjects

| # | Subject | Why It's In V1 |
|---|---|---|
| 1 | Engineering Mathematics | Compulsory anchor for all GATE ECE aspirants. Easy to explain in ELI10 style. High GATE weight. Validates the theory tab flow. |
| 2 | Electronic Devices | MOSFET is the product's hero demo. The Viz tab and Lab tab (Apple A19 zoom-out) live here. Non-negotiable. |
| 3 | Digital Circuits | Highest GATE frequency (58 concepts). Familiar content. Logic gate animations are buildable. Strong PYQ bank. |

### 2.2 Concepts Per Subject — V1 Scope

Build **5 gold-standard concepts per subject = 15 total**. Every concept must have all 5 tabs fully built to spec before it ships. No half-built concepts.

| Subject | 5 Concepts for V1 |
|---|---|
| Engineering Mathematics | Linear Algebra (eigenvalues), Calculus (maxima/minima), Differential Equations (first order), Laplace Transform, Probability & Statistics |
| Electronic Devices | **MOSFET I-V (hero)**, MOSFET regions of operation, PN Junction diode, BJT operating regions, Energy band diagrams |
| Digital Circuits | Boolean algebra & simplification, K-Map (up to 4 variables), Combinational circuits (MUX/DEMUX), Sequential circuits (D flip-flop), Counters |

### 2.3 The Hero Concept
**MOSFET I-V characteristics** is the single concept that must be perfect before anything else ships. It is the product demo, the shareable asset, and the benchmark against which all other concepts are measured. Every other concept is built after this one is signed off.

---

## 3. Tab Structure — Detailed Spec

Every concept page has 5 tabs in this order: **Theory → Viz → Lab → PYQs → Practice**

---

### 3.1 Theory Tab

**Goal:** Build genuine understanding before the student sees a single formula. The flow is strictly sequential — each section unlocks or flows into the next.

#### Section 1 — ELI10 Explanation
- Write as if explaining to a curious 10-year-old who has never studied electronics.
- Use a physical-world story, analogy, or metaphor. No jargon. No formulas.
- Must answer: *what is this thing, what does it do, why does it matter?*
- Length: 3–5 short paragraphs or a clear narrative. Conversational tone.
- Example for MOSFET: "Imagine a water tap. Turning the handle (gate voltage) controls how much water (current) flows from one end to the other. The MOSFET is an electronic tap — instead of turning a handle, you apply a voltage to control current. Apple uses 19 billion of them in the A19 Pro chip — all smaller than a virus."

#### Section 2 — Technical Explanation
- Now introduce the actual physics and engineering.
- Define all key terms precisely.
- Derive or explain the governing equations step by step.
- Reference the GATE syllabus explicitly — what exactly is tested, at what depth.
- Length: as long as needed for completeness. Structured with sub-headings.

#### Section 3 — Real-World Anchor
- Connect the concept to a 2025–2026 real product. Use the same anchors as the image shown in the brief: TSMC manufacturing context, Apple A19 Pro chip specs, device parameters.
- Show exact numbers: "Apple's A19 Pro uses N3E process — 3nm gate length, ~19 billion transistors, VGS threshold ~0.3V."
- Write in the storytelling style shown in the reference image: chain of facts that build on each other, each paragraph revealing something surprising.
- End with: "This is the same MOSFET you just simulated in the Viz tab."

#### Section 4 — Formula Reference
- Clean, scannable list of all formulas relevant to this concept for GATE.
- Each formula has: the equation, variable definitions, and the condition under which it applies.
- Mark GATE-frequency: ⭐⭐⭐⭐⭐ for formulas that appear in almost every GATE paper.

---

### 3.2 Viz Tab

**Goal:** Show the student what happens *physically and behaviourally* when parameters change. Animation is not decoration — it is the explanation.

#### Primary Interaction
- **Input method:** Numeric entry field (primary). Slider (secondary, for exploration).
- The student types in a value (e.g., VGS = 0.8V) and presses Enter or clicks Apply. The animation responds.
- A slider allows continuous scrubbing to feel the behaviour.

#### Animation Requirements — MOSFET Viz (reference implementation)
1. **Device cross-section view:** Render a simplified MOSFET cross-section — gate, oxide layer, source, drain, channel region visible.
2. **Channel behaviour animation:**
   - VGS below threshold (< Vt): channel region is empty/depleted — show this visually with colour or fill state.
   - VGS at threshold: channel just begins to form — animate the onset at the exact point under the gate oxide.
   - VGS above threshold (linear region): channel fills, current arrow appears from drain to source.
   - VGS well above threshold (saturation): channel pinches off near drain — animate the pinch-off point moving.
3. **Point-of-change highlighting:** When the threshold is crossed, a visual pulse or glow appears at the gate-oxide-channel interface — the physical point where the change originates.
4. **Live readouts:** Display ID (drain current), VDS, region name ("Cutoff / Linear / Saturation") updating in real time as inputs change.
5. **Threshold marker:** A visible line or indicator on the VGS axis marking Vt. Crossing it triggers the animation state change.

#### Viz Requirements for All Other Concepts
- Every Viz must animate the *mechanism*, not just plot a graph.
- The animation must show *where* the change happens in the physical or logical structure.
- Digital Circuits Viz: logic gate truth table with input toggles that animate signal propagation through the gate symbol.
- Maths Viz: for eigenvalues, animate a vector being transformed by a matrix — show it stretching along eigenvector directions.

#### What Viz Does NOT Include
- No static images passed off as Viz.
- No graph-only visualisations without physical/structural context.
- No animations that start immediately on page load — they respond to user input.

---

### 3.3 Lab Tab

**Goal:** Put the student inside a real engineering problem. They calculate a specific input value to make a real-world system work. Wrong answers show failure consequences. Correct answers show the system working.

#### Lab Structure — MOSFET Lab (reference implementation)

**Step 1 — Context Setup**
Show a zoomed-out view of the Apple A19 Pro chip. Then animate a zoom-in, ending on a single transistor (represented as a MOSFET symbol or simplified cross-section).

Narrative: *"You are an Apple chip engineer. This is a single MOSFET inside the A19 Pro. It needs to switch 3.78 GHz reliably — 3.78 billion times per second — without breaking down. Your job: find the VGS that keeps it in saturation without exceeding the oxide breakdown voltage."*

**Step 2 — Given Parameters**
Display a clean parameter table:
- Process: TSMC N3E (3nm)
- VDD: 0.75V
- Vt (threshold): 0.3V
- Oxide breakdown voltage: 1.2V
- Required ID (drain current): [calculated from context]
- VDS: 0.6V

**Step 3 — The Problem**
Ask the student to calculate and enter VGS such that:
- MOSFET is in saturation region
- VGS does not exceed oxide breakdown
- The required drain current is achieved

Input type: NAT (numerical answer, to 2 decimal places).

**Step 4 — Feedback**
- **Correct answer:** The transistor animation shows the channel forming cleanly, current flowing, chip running at 3.78 GHz. A small confirmation: "The A19 Pro stays alive. 19 billion MOSFETs, all switching correctly."
- **Wrong answer (too low — cutoff):** Animation shows no channel. "No current flows. The transistor is off. The chip is dead."
- **Wrong answer (too high — oxide breakdown):** Animation shows the gate oxide shattering. "Oxide breakdown. Gate destroyed. You just killed a $1,000 chip." (Reference the image's "You broke it and saw why" moment.)

**Step 5 — Solution Walkthrough**
After any attempt (correct or wrong), show a full step-by-step solution with formula derivation.

#### Lab Requirements for All Other Concepts
- Every Lab must have a real-world engineering anchor (chip, circuit, system).
- The problem must require calculation, not just recall.
- There must be a visible failure consequence for wrong answers — not just "incorrect."
- Solution walkthrough is always available after first attempt.

---

### 3.4 PYQ Tab

**Goal:** Connect every concept directly to how GATE has tested it.

#### Content Requirements
- GATE 2020–2026 questions tagged to this specific concept.
- Each question shows: year, marks (1 or 2), question type (MCQ or NAT).
- After answering: full step-by-step solution with the key insight called out explicitly.
- Tag each solution step with the formula or principle it uses.
- Mark which questions are "examiner traps" — common wrong answers and why they're wrong.

#### V1 PYQ Count Target
- Minimum 3 PYQs per concept (7 years × GATE ECE papers).
- For MOSFET I-V: target 6–8 PYQs (it appears in most years).

---

### 3.5 Practice Tab

**Goal:** Concept-check problems that are not PYQs — built to deepen intuition, not exam drill.

#### Problem Types
- **Concept-check MCQ:** Tests understanding of mechanism, not formula recall. "If VGS increases while VDS is fixed and the MOSFET is in saturation — what happens to ID and why?"
- **Numerical (NAT-style):** Exact value entry. Similar difficulty to GATE 2-mark problems.
- **Threshold/boundary problems:** "At exactly what VGS does this MOSFET transition from linear to saturation?"

#### V1 Practice Count Target
- 5 practice problems per concept minimum.
- Mix: 2 MCQ concept-check + 2 NAT + 1 boundary/threshold problem.

#### Mastery Score (V1 light version)
- Each correct answer: +5 points.
- Each wrong answer: -2 points.
- Hint used: +2 points.
- Displayed as a concept-level mastery bar. No adaptive queue in V1 — just local tracking per concept page.

---

## 4. Authentication — V1 Decision

### 4.1 Model: Soft Auth with Google OAuth

| Tab | Auth Required | Rationale |
|---|---|---|
| Theory | No — fully public | SEO, shareability, top-of-funnel |
| Viz | No — fully public | Most shareable feature. The animation is the hook. |
| Lab | Yes — Google sign-in | Highest-value feature. Gate here to capture email. |
| PYQs | Yes — Google sign-in | High intent feature. Students sign in for PYQs. |
| Practice | Yes — Google sign-in | Mastery tracking requires identity. |

### 4.2 Auth Flow
1. User lands on a concept page. Theory and Viz are immediately accessible.
2. User clicks Lab or PYQs tab.
3. A modal appears: *"Sign in with Google to unlock the Lab and PYQs — free."*
4. One-click Google OAuth. No password. No email/password form.
5. After sign-in: full access to all 5 tabs across all V1 concepts.
6. No payment, no subscription tier selection in V1.

### 4.3 What Auth Gives You
- Email address for the V1 feedback cohort.
- User identity for mastery score tracking.
- Conversion funnel data: how many users hit the auth gate vs complete sign-in.
- Foundation for V2 subscription gating.

### 4.4 Implementation
- NextAuth.js with Google provider only.
- Session stored in a cookie (JWT). No database required for V1 auth — use NextAuth's default JWT strategy.
- User record created on first sign-in: `{ id, email, name, createdAt }`.
- Store in a simple database (Supabase free tier or PlanetScale free tier). 

---

## 5. Navigation and Information Architecture

### 5.1 Page Structure

```
/ (Landing page)
/subjects (Subject list — 3 subjects)
/subjects/electronic-devices (Subject page — concept list)
/subjects/electronic-devices/mosfet-iv (Concept page — 5 tabs)
/subjects/engineering-maths
/subjects/digital-circuits
```

### 5.2 Landing Page — V1 Requirements
The landing page must communicate the product's core differentiation in under 10 seconds. Required sections:

1. **Hero section:** Headline + the MOSFET Viz animation embedded and running. Not a screenshot. The actual interactive animation. This is the product demo, not a promise.
2. **"How it works" section:** Theory → Viz → Lab flow shown with 3 panels and short descriptions.
3. **Real-world anchor section:** The TSMC → Apple A19 narrative from the reference image. Builds credibility and explains why the product exists.
4. **Subject list:** The 3 subjects with concept counts.
5. **CTA:** "Start with MOSFET — free" → links to `/subjects/electronic-devices/mosfet-iv`.

### 5.3 Concept Page Layout
- Tab bar at the top: Theory | Viz | Lab | PYQs | Practice
- Active tab content below.
- Persistent right sidebar (desktop): concept metadata (GATE frequency stars, subject, topic, related concepts).
- Persistent bottom bar (mobile): tab navigation.
- No infinite scroll. Each tab is a bounded page.

---

## 6. Content Quality Standards

### 6.1 The Gold Standard Check
Before any concept page ships, it must pass this check:

- [ ] ELI10 section: Can a curious 10-year-old follow it without Googling anything?
- [ ] Technical section: Are all formulas correct? Has a subject matter expert reviewed it?
- [ ] Real-world anchor: Are all specs accurate? (Verify against TSMC/Apple published data.)
- [ ] Viz: Does the animation show the *physical point of change*, not just a graph update?
- [ ] Lab: Does a wrong answer produce a visible failure consequence?
- [ ] Lab: Is the calculation non-trivial — does it require understanding, not just formula plugging?
- [ ] PYQs: Are the solutions correct and complete? (Cross-check against published GATE answer keys.)
- [ ] Practice: Do problems test understanding or just recall?

### 6.2 Subject Matter Expert Review
Every concept page — especially formulas, PYQ solutions, and Lab problem parameters — must be reviewed by someone with GATE ECE expertise before shipping. This is non-negotiable. A wrong formula on a GATE prep platform destroys credibility permanently.

### 6.3 Content Accuracy Disclaimer
All theory content generated with AI assistance must carry a footer label: *"AI-assisted content — reviewed for accuracy."* The reviewer's name or credential is added once the review process is formalised.

---

## 7. What Is Explicitly Out of Scope for V1

| Feature | Why It's Out of Scope |
|---|---|
| Adaptive daily practice queue | Requires user history data that doesn't exist yet in V1. |
| Streak system | Requires daily engagement data. Build in V2. |
| GATE mock tests (65Q, timed) | Requires full content bank, not available in V1. |
| Weakness radar | Requires cross-concept mastery data. |
| Razorpay / payments | Do not monetise before product-market fit is validated. |
| Email/password auth | Google OAuth only in V1. Reduces friction and dev time. |
| Mobile app | Web only in V1. |
| All 580 concepts | V1 ships 15 gold-standard concepts. Quality > quantity. |
| Admin analytics dashboard | Not needed until there are paying users. |
| Subjects beyond the 3 listed | Content quality cannot be maintained at scale in V1. |

---

## 8. Success Metrics for V1

V1 is a feedback product. Success is measured by qualitative signal and early engagement data, not revenue.

| Metric | V1 Target | How to Measure |
|---|---|---|
| Viz tab engagement | >60% of concept page visitors interact with Viz slider/input | PostHog event: `viz_input_changed` |
| Lab completion rate | >40% of signed-in users attempt the Lab problem | PostHog event: `lab_answer_submitted` |
| Theory full-read rate | >50% of visitors scroll through all 4 theory sections | PostHog scroll depth event |
| Auth conversion | >30% of users who hit the auth gate complete sign-in | Auth events in NextAuth |
| "Aha moment" qualitative | 10+ unprompted messages/DMs saying "I finally understood MOSFET" | Manual tracking |
| Feedback form responses | 50+ responses from the V1 cohort | Typeform or Tally embed |

---

## 9. V1 Build Sequence

Build in this order. Do not skip ahead.

1. **MOSFET I-V concept page** — all 5 tabs — to gold standard. This is the benchmark.
2. **Sign-off on MOSFET page** with 5 test users (friends, seniors, GATE aspirants). Do they feel the aha moment?
3. **Landing page** with MOSFET Viz embedded.
4. **Google OAuth** integration. Gate Lab + PYQs.
5. **Remaining 4 Electronic Devices concepts.**
6. **5 Engineering Maths concepts.**
7. **5 Digital Circuits concepts.**
8. **Subject pages and navigation.**
9. **V1 soft launch** to a feedback cohort of 50 aspirants.

---

## 10. Tech Stack (V1 Recommendation)

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO, file-based routing, easy API routes |
| Styling | Tailwind CSS | Fast iteration |
| Auth | NextAuth.js (Google provider) | One-day integration, no password management |
| Database | Supabase (free tier) | Auth user records + mastery scores. Free up to 500MB. |
| Animations | Custom SVG + CSS (no heavy library) | MOSFET Viz is bespoke — a library won't give you point-of-change animation |
| Hosting | Vercel | Zero config, free tier, instant deploys |
| Analytics | PostHog (free tier) | Event tracking for the V1 success metrics |

---

## 11. V1 Sign-Off Checklist

**Before soft launch:**

- [ ] MOSFET I-V concept page reviewed by subject matter expert
- [ ] MOSFET Viz shows channel behaviour and point-of-change animation correctly
- [ ] MOSFET Lab failure animations working (cutoff + oxide breakdown)
- [ ] All 15 concept pages have correct formulas (SME-reviewed)
- [ ] Google OAuth working: sign-in gates Lab and PYQs
- [ ] PostHog events firing for Viz interaction, Lab submission, auth conversion
- [ ] Landing page embeds live MOSFET Viz (not a screenshot)
- [ ] Mobile layout tested for all concept pages
- [ ] AI-assisted content disclaimer visible on all theory pages
- [ ] Feedback form accessible from every concept page
- [ ] 5 test users have completed the MOSFET concept end-to-end and given feedback

---

**Document end. GateVision Prep V1.0.**
