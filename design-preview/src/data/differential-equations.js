export const DE_THEORY = {
  eli10: {
    headline: 'A rule about how things change. Solve it to see what actually happens.',
    body: [
      'You fill a bucket that has a hole at the bottom. Water flows in from a tap and leaks out through the hole. The leak rate depends on how much water is in the bucket — more water means more pressure means faster leak. This "the rate of change depends on the current amount" is a differential equation.',
      'The equation itself is just the rule — like saying "the water level drops by 10% every minute." Solving the equation gives you the actual water level at any point in time — the full picture, not just the rule.',
      'First-order means only the speed (first derivative) appears. Second-order means acceleration (second derivative) appears too. An RC circuit (resistor + capacitor) is first-order. An RLC circuit (add an inductor) is second-order and can oscillate.',
      'The key method for first-order: find an integrating factor (a special multiplier that makes the equation solvable). For second-order: write a helper equation, solve it, and the roots tell you the behavior — smooth decay, ringing, or blowing up.',
      'In GATE, you get an equation, figure out its type, pick the right method, and solve. RC/RL circuit transients are the most common application tested.',
    ],
  },
  pullQuote: 'A rule about how things change. Solve it to see what actually happens.',
  technical: [
    {
      h: 'Classification',
      body: '<strong>Order:</strong> highest derivative present. dy/dx → first order. d²y/dx² → second order.<br/><strong>Linearity:</strong> linear if y and its derivatives appear with power 1 and are not multiplied together.<br/><strong>Homogeneous:</strong> f(x) = 0 on the right side. Non-homogeneous: f(x) ≠ 0.',
    },
    {
      h: 'First-order methods',
      body: '<strong>Separable:</strong> dy/dx = g(x)h(y). Separate and integrate both sides.<br/><strong>Linear:</strong> dy/dx + P(x)y = Q(x). Multiply by integrating factor μ = e<sup>∫P dx</sup>.<br/><strong>Exact:</strong> M dx + N dy = 0 where ∂M/∂y = ∂N/∂x. Find F such that dF = 0.',
    },
    {
      h: 'Second-order linear (constant coefficients)',
      body: 'ay\'\' + by\' + cy = 0. Characteristic equation: ar² + br + c = 0.<br/><strong>Two real roots r₁ ≠ r₂:</strong> y = C₁e<sup>r₁x</sup> + C₂e<sup>r₂x</sup> (overdamped).<br/><strong>Repeated root r:</strong> y = (C₁ + C₂x)e<sup>rx</sup> (critically damped).<br/><strong>Complex roots α ± jβ:</strong> y = e<sup>αx</sup>(C₁cos βx + C₂sin βx) (underdamped).',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'First-order linear with integrating factor (most common, 2-mark). Second-order characteristic equation. Initial value problems. Classifying equation type. RC/RL circuit transients as first-order DEs. RLC circuit as second-order DE (overdamped / underdamped / critically damped).',
    },
  ],
  realWorld: [
    { k: 'RC circuits', v: 'Every signal path on the A19 Pro has parasitic RC — voltage decays as V(t) = V₀·e^(−t/RC)' },
    { k: 'RLC ringing', v: 'Power delivery network is an RLC circuit — underdamped response causes voltage droops' },
    { k: 'PLL dynamics', v: 'Phase-locked loop is a second-order system — damping ratio determines lock behavior' },
    { k: 'Thermal transient', v: 'Chip temperature follows dT/dt = (P − T/R_th)/C_th — a first-order DE' },
    { k: 'Clock distribution', v: 'Transmission line equations are coupled first-order PDEs — signal integrity' },
    { k: 'Battery discharge', v: 'dQ/dt = −I(t) — charge depletion modeled as a DE with variable current' },
    { k: 'Control systems', v: 'Feedback loops described by DEs — stability depends on characteristic roots' },
  ],
  formulas: [
    { name: 'Integrating factor', eq: 'μ(x) = e^(∫P(x)dx)', when: 'first-order linear: y\' + P(x)y = Q(x)', stars: 5 },
    { name: 'Characteristic equation', eq: 'ar² + br + c = 0', when: 'second-order constant coefficient: ay\'\' + by\' + cy = 0', stars: 5 },
    { name: 'RC time constant', eq: 'τ = RC, v(t) = V₀·e^(−t/τ)', when: 'first-order RC circuit transient', stars: 5 },
    { name: 'Underdamped response', eq: 'y = e^(αt)(C₁cos ωt + C₂sin ωt)', when: 'complex roots α ± jω', stars: 4 },
    { name: 'Particular solution (undetermined)', eq: 'try yₚ matching f(x) form', when: 'non-homogeneous with polynomial/exp/trig forcing', stars: 4 },
    { name: 'Wronskian', eq: 'W = y₁y₂\' − y₂y₁\'', when: 'testing linear independence of solutions', stars: 3 },
  ],
}

export const DE_LAB = {
  title: 'A19 Pro · power-on RC transient',
  narrative: 'When the A19 Pro powers on, the supply voltage ramps through an RC filter. The voltage across the capacitor follows v(t) = V_DD(1 − e^(−t/τ)). You need to find the time constant τ = RC to ensure the voltage reaches 90% of V_DD within the boot spec of 10 ms.',
  params: [
    { label: 'Circuit', value: 'Series RC, step input V_DD = 0.9V' },
    { label: 'Resistance R', value: '100 Ω' },
    { label: 'Capacitance C', value: '10 μF' },
    { label: 'Equation', value: 'R·C·dv/dt + v = V_DD' },
    { label: 'Required', value: 'Time constant τ in ms' },
    { label: 'Boot spec', value: 'v(t) > 0.9 × V_DD within 10 ms' },
  ],
  correctAnswer: 1.00,
  tolerance: 0.05,
  answerLabel: 'τ',
  unit: 'ms',
  hint: 'τ = R × C. Convert units: 100 Ω × 10 μF = ?',
  solution: [
    { tag: 'Formula', line: 'τ = R × C' },
    { tag: 'Substitute', line: 'τ = 100 Ω × 10 × 10<sup>−6</sup> F' },
    { tag: 'Compute', line: 'τ = 1 × 10<sup>−3</sup> s = <strong>1.00 ms</strong>' },
    { tag: '90% check', line: '0.9V_DD reached at t = 2.3τ = 2.3 ms ≪ 10 ms → boot spec met' },
    { tag: 'Meaning', line: 'τ = 1 ms means the supply settles in ~5τ = 5 ms. Well within the 10 ms boot window.' },
  ],
}

export const DE_PYQS = [
  {
    id: 'de-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'Solve dy/dx + 2y = 4 with y(0) = 0. Find y(∞).',
    answer: 2.00, unit: '',
    trap: 'As t→∞, the transient e^(−2x) → 0 and y → 4/2 = 2.',
    why: 'IF = e^(2x). Solution: y = 2 + Ce^(−2x). y(0) = 0 → C = −2. y = 2(1−e^(−2x)). y(∞) = 2.',
  },
  {
    id: 'de-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'The characteristic equation r² + 4r + 4 = 0 has roots. Find the repeated root.',
    answer: -2.00, unit: '',
    trap: '(r+2)² = 0. Double root at r = −2. This gives critically damped response.',
    why: 'r² + 4r + 4 = (r+2)² = 0. Repeated root r = −2.',
  },
  {
    id: 'de-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'An RLC circuit with complex characteristic roots is:',
    options: ['Overdamped', 'Critically damped', 'Underdamped', 'Unstable'],
    answerIdx: 2,
    trap: 'Complex roots = oscillatory decaying response = underdamped.',
    why: 'Complex conjugate roots α ± jω → oscillatory with exponential envelope → underdamped.',
  },
  {
    id: 'de-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'Find the integrating factor for dy/dx + 3y = 6.',
    answer: 0.00, unit: '',
    trap: 'This is a trick question format — IF = e^(∫3dx) = e^(3x). Not a number. Re-read: the answer is e^(3x), but if asking for P(x), P = 3.',
    why: 'IF = e^(∫P(x)dx) = e^(3x). If asked for P(x), the coefficient of y is 3.',
  },
  {
    id: 'de-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'The general solution of y\'\' − 5y\' + 6y = 0 is:',
    options: ['C₁e²ˣ + C₂e³ˣ', 'C₁e⁻²ˣ + C₂e⁻³ˣ', '(C₁+C₂x)e²ˣ', 'C₁cos2x + C₂sin3x'],
    answerIdx: 0,
    trap: 'r² − 5r + 6 = (r−2)(r−3) = 0. Roots: r = 2, 3. Both real and distinct.',
    why: 'Characteristic: r² − 5r + 6 = 0 → (r−2)(r−3) = 0 → y = C₁e^(2x) + C₂e^(3x).',
  },
  {
    id: 'de-pyq-2020', year: 2020, marks: 2, type: 'NAT',
    q: 'An RC circuit has R = 1 kΩ, C = 1 μF. Find τ in ms.',
    answer: 1.00, unit: 'ms',
    trap: 'τ = RC = 1000 × 10⁻⁶ = 10⁻³ s = 1 ms.',
    why: 'τ = R × C = 1×10³ × 1×10⁻⁶ = 1×10⁻³ s = 1 ms.',
  },
]

export const DE_PRACTICE = [
  {
    id: 'de-p1', kind: 'nat',
    q: 'Solve dy/dx = 3y with y(0) = 2. Find y(1). (2 dp)',
    unit: '', answer: 40.17,
    why: 'Separable: y = 2e^(3x). y(1) = 2e³ = 2 × 20.086 = 40.17.',
  },
  {
    id: 'de-p2', kind: 'mcq',
    q: 'The equation dy/dx + y·sin(x) = cos(x) is:',
    options: ['Nonlinear', 'First-order linear', 'Second-order linear', 'Exact'],
    answerIdx: 1,
    why: 'Form: y\' + P(x)y = Q(x) where P = sin(x), Q = cos(x). First-order linear.',
  },
  {
    id: 'de-p3', kind: 'nat',
    q: 'Characteristic eq: r² + 6r + 9 = 0. Find the root. (2 dp)',
    unit: '', answer: -3.00,
    why: '(r+3)² = 0. Repeated root r = −3.',
  },
  {
    id: 'de-p4', kind: 'mcq',
    q: 'A system with characteristic roots −1 ± j2 will:',
    options: ['Decay monotonically', 'Oscillate with growing amplitude', 'Oscillate with decaying amplitude', 'Remain constant'],
    answerIdx: 2,
    why: 'Real part −1 < 0 → decaying. Imaginary part ±j2 → oscillation. Combined: damped oscillation.',
  },
  {
    id: 'de-p5', kind: 'nat',
    q: 'An RL circuit: L=2H, R=4Ω. Time constant τ = L/R = ? (2 dp)',
    unit: 's', answer: 0.50,
    why: 'τ = L/R = 2/4 = 0.50 s.',
  },
]

export const DE_INSIGHT = {
  frequency: '4 of 7',
  body: 'First-order linear DEs and second-order characteristic equations appear regularly. Circuit transients (RC, RL, RLC) are the most practical application tested.',
}
