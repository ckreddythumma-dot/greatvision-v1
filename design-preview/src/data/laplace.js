export const LAPLACE_THEORY = {
  eli10: {
    headline: 'Hard math in, easy algebra out. Solve, then translate back.',
    body: [
      'Imagine you get a math problem written in a language you find hard. You could struggle with it directly, or you could translate it to a language you know, solve it there, and translate the answer back. The Laplace transform does exactly this for engineers.',
      'Differential equations (the "hard language") involve rates of change and integrals — messy to solve directly. The Laplace transform converts them into simple algebra (the "easy language") — just multiply, divide, and simplify fractions. Things you already know.',
      'The magic trick: in the new world (called the s-domain), taking a derivative becomes "multiply by s." Integration becomes "divide by s." A scary calculus problem becomes a fraction you can simplify with basic algebra.',
      'After solving the easy algebra, you use the inverse Laplace transform (basically a lookup table) to convert the answer back to the real world. Three steps: transform, solve algebra, look up the answer.',
      'GATE loves Laplace because it connects circuits, control systems, and signals into one framework. Most questions: transform, simplify, look up the inverse in a standard table.',
    ],
  },
  pullQuote: 'Hard math in, easy algebra out. Solve, then translate back.',
  technical: [
    {
      h: 'Definition and intuition',
      body: 'The Laplace transform of f(t) is F(s) = ∫₀<sup>∞</sup> f(t)·e<sup>−st</sup> dt, where s = σ + jω is a complex variable.<br/><br/>The transform maps time-domain signals to the complex frequency domain. Convolution in time becomes multiplication in s. Differentiation becomes multiplication by s.',
    },
    {
      h: 'Key transform pairs',
      body: '<span class="mono">1 → 1/s</span><br/><span class="mono">t → 1/s²</span><br/><span class="mono">e<sup>at</sup> → 1/(s−a)</span><br/><span class="mono">sin(ωt) → ω/(s²+ω²)</span><br/><span class="mono">cos(ωt) → s/(s²+ω²)</span><br/><span class="mono">u(t−a) → e<sup>−as</sup>/s</span> (shifted step)',
    },
    {
      h: 'Properties',
      body: '<strong>Linearity:</strong> L{af + bg} = aF + bG.<br/><strong>Differentiation:</strong> L{f\'(t)} = sF(s) − f(0).<br/><strong>Integration:</strong> L{∫f dt} = F(s)/s.<br/><strong>Shifting:</strong> L{e<sup>at</sup>f(t)} = F(s−a).<br/><strong>Final value theorem:</strong> lim(t→∞) f(t) = lim(s→0) sF(s).<br/><strong>Initial value theorem:</strong> f(0⁺) = lim(s→∞) sF(s).',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Finding Laplace transform using standard pairs (most common). Inverse Laplace using partial fractions. Transfer function H(s) = output/input. Initial and final value theorems. Convolution theorem (conceptual). ROC (Region of Convergence) for causal signals.',
    },
  ],
  realWorld: [
    { k: 'Transfer functions', v: 'Every analog block on the A19 Pro is characterized by H(s) — gain and phase vs frequency' },
    { k: 'Control loops', v: 'Voltage regulators use PID control — designed entirely in the s-domain' },
    { k: 'Filter design', v: 'Butterworth, Chebyshev filters specified by pole-zero placement in s-plane' },
    { k: 'Stability analysis', v: 'Poles in left half-plane → stable system. Right half-plane → oscillation/blowup' },
    { k: 'Impedance', v: 'Z_L = sL, Z_C = 1/sC — circuit analysis becomes algebra in s-domain' },
    { k: 'Signal processing', v: 'Continuous-time filter prototypes designed in s-domain, then converted to z-domain' },
    { k: 'Transient analysis', v: 'Step response = inverse Laplace of H(s)/s — complete circuit behavior from one transform' },
  ],
  formulas: [
    { name: 'Laplace definition', eq: 'F(s) = ∫₀^∞ f(t)·e^(−st) dt', when: 'transforming any causal signal', stars: 5 },
    { name: 'Differentiation property', eq: 'L{f\'(t)} = sF(s) − f(0⁻)', when: 'solving DEs via Laplace', stars: 5 },
    { name: 'Final value theorem', eq: 'lim(t→∞) f(t) = lim(s→0) sF(s)', when: 'finding steady-state without inverse transform', stars: 5 },
    { name: 'Exponential transform', eq: 'L{e^(at)} = 1/(s−a)', when: 's > a for convergence', stars: 5 },
    { name: 'Convolution', eq: 'L{f*g} = F(s)·G(s)', when: 'output = input convolved with impulse response', stars: 4 },
    { name: 'Initial value theorem', eq: 'f(0⁺) = lim(s→∞) sF(s)', when: 'finding initial value without inverse', stars: 4 },
  ],
}

export const LAPLACE_LAB = {
  title: 'A19 Pro · voltage regulator step response',
  narrative: 'The A19 Pro\'s voltage regulator has transfer function H(s) = 10/(s+5). When a load step occurs, the output follows V(s) = H(s) × (1/s). Use the final value theorem to find the steady-state output voltage.',
  params: [
    { label: 'System', value: 'Voltage regulator, first-order' },
    { label: 'Transfer function', value: 'H(s) = 10/(s+5)' },
    { label: 'Input', value: 'Unit step: U(s) = 1/s' },
    { label: 'Output', value: 'V(s) = 10/[s(s+5)]' },
    { label: 'Method', value: 'Final value theorem' },
    { label: 'Required', value: 'Steady-state output v(∞)' },
  ],
  correctAnswer: 2.00,
  tolerance: 0.05,
  answerLabel: 'v(∞)',
  unit: 'V',
  hint: 'Final value theorem: v(∞) = lim(s→0) s·V(s) = lim(s→0) s · 10/[s(s+5)].',
  solution: [
    { tag: 'Output', line: 'V(s) = H(s) · U(s) = 10 / [s(s+5)]' },
    { tag: 'FVT', line: 'v(∞) = lim(s→0) s · V(s) = lim(s→0) 10/(s+5)' },
    { tag: 'Evaluate', line: 'v(∞) = 10/5 = <strong>2.00 V</strong>' },
    { tag: 'Verify', line: 'Partial fractions: V(s) = 2/s − 2/(s+5). v(t) = 2 − 2e<sup>−5t</sup>. As t→∞, v→2.' },
    { tag: 'Meaning', line: 'The regulator settles to 2V after the load transient. Time constant = 1/5 = 0.2s.' },
  ],
}

export const LAPLACE_PYQS = [
  {
    id: 'lap-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'Find L{3e^(−2t)}. The coefficient of 1/(s+2) is:',
    answer: 3.00, unit: '',
    trap: 'L{e^(at)} = 1/(s−a). Here a = −2, so L{e^(−2t)} = 1/(s+2). Multiply by 3.',
    why: 'L{3e^(−2t)} = 3/(s+2). Coefficient = 3.',
  },
  {
    id: 'lap-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'F(s) = 5/(s²+25). Find the inverse Laplace transform at t = π/10. Give f(π/10).',
    answer: 1.00, unit: '',
    trap: 'F(s) = 5/(s²+25) = ω/(s²+ω²) with ω = 5. So f(t) = sin(5t). f(π/10) = sin(π/2) = 1.',
    why: 'L⁻¹{5/(s²+25)} = sin(5t). At t = π/10: sin(5·π/10) = sin(π/2) = 1.',
  },
  {
    id: 'lap-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'The final value theorem applies when:',
    options: ['All poles of sF(s) are in the left half-plane', 'F(s) has no poles', 'f(t) is periodic', 'f(0) = 0'],
    answerIdx: 0,
    trap: 'FVT requires all poles of sF(s) in LHP (system must be stable). Fails for oscillatory signals.',
    why: 'FVT: lim(t→∞) f(t) = lim(s→0) sF(s), valid only if all poles of sF(s) have negative real parts.',
  },
  {
    id: 'lap-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'Given F(s) = (2s+3)/(s²+3s+2). Use partial fractions. Find the coefficient of 1/(s+1).',
    answer: 1.00, unit: '',
    trap: 's²+3s+2 = (s+1)(s+2). Cover-up: at s=−1: (−2+3)/(−1+2) = 1/1 = 1.',
    why: 'F = A/(s+1) + B/(s+2). A = [(2s+3)/(s+2)] at s=−1 = 1/1 = 1.',
  },
  {
    id: 'lap-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'L{tf(t)} equals:',
    options: ['−dF/ds', 'sF(s)', 'F(s)/s', 'F(s−1)'],
    answerIdx: 0,
    trap: 'Multiplication by t in time domain = −d/ds in frequency domain.',
    why: 'L{t·f(t)} = −dF(s)/ds. This is the frequency differentiation property.',
  },
  {
    id: 'lap-pyq-2020', year: 2020, marks: 2, type: 'NAT',
    q: 'L{u(t)} = 1/s. L{t·u(t)} = 1/s². Find L{t²·u(t)}. The denominator power is:',
    answer: 3.00, unit: '',
    trap: 'L{tⁿ} = n!/s^(n+1). For n = 2: L{t²} = 2/s³. Denominator power = 3.',
    why: 'L{t²} = 2!/s³ = 2/s³. The denominator power is 3.',
  },
]

export const LAPLACE_PRACTICE = [
  {
    id: 'lap-p1', kind: 'nat',
    q: 'Find L{5cos(3t)}. The numerator is:',
    unit: '', answer: 5.00,
    why: 'L{cos(ωt)} = s/(s²+ω²). L{5cos(3t)} = 5s/(s²+9). Numerator coefficient = 5.',
  },
  {
    id: 'lap-p2', kind: 'mcq',
    q: 'To solve dy/dt + 3y = 6 with y(0) = 0 using Laplace:',
    options: [
      'sY − 0 + 3Y = 6/s → Y = 6/[s(s+3)]',
      'sY + 3Y = 6 → Y = 6/(s+3)',
      's²Y + 3Y = 6/s',
      'Y = 6e^(−3s)/s',
    ],
    answerIdx: 0,
    why: 'L{y\'} = sY − y(0) = sY. Equation: sY + 3Y = 6/s. Y = 6/[s(s+3)].',
  },
  {
    id: 'lap-p3', kind: 'nat',
    q: 'Use IVT: f(0⁺) for F(s) = (3s+1)/(s²+4s+3). Find f(0⁺). (2 dp)',
    unit: '', answer: 3.00,
    why: 'IVT: f(0⁺) = lim(s→∞) sF(s) = lim(s→∞) s(3s+1)/(s²+4s+3) = lim 3s²/s² = 3.',
  },
  {
    id: 'lap-p4', kind: 'mcq',
    q: 'A system has poles at s = −2 and s = −5. The system is:',
    options: ['Unstable', 'Marginally stable', 'Stable', 'Oscillatory'],
    answerIdx: 2,
    why: 'Both poles in the left half-plane (negative real parts) → stable.',
  },
  {
    id: 'lap-p5', kind: 'nat',
    q: 'FVT for F(s) = 4/[s(s+2)]. Find f(∞). (2 dp)',
    unit: '', answer: 2.00,
    why: 'f(∞) = lim(s→0) sF(s) = lim(s→0) 4/(s+2) = 4/2 = 2.',
  },
]

export const LAPLACE_INSIGHT = {
  frequency: '6 of 7',
  body: 'Laplace transform pairs, partial fractions, and the final/initial value theorems are GATE staples. Transfer function analysis connects directly to Signals and Control Systems.',
}
