export const CALC_THEORY = {
  eli10: {
    headline: 'Find the peak. Find the valley. That is optimization.',
    body: [
      'Calculus is about change. The derivative tells you how fast something is changing at any instant. The integral tells you how much has accumulated over time.',
      'Maxima and minima are the peaks and valleys of a function. At a peak, the function stops going up and starts going down. At that exact point, the slope is zero — the derivative equals zero.',
      'But zero slope does not always mean a peak or valley. It could be a flat spot (inflection point). The second derivative test settles it: negative means peak (concave down), positive means valley (concave up).',
      'GATE loves this because optimization is everywhere in engineering — minimizing power, maximizing gain, finding the best operating point.',
      'Partial derivatives extend this to functions of multiple variables — most real engineering problems have more than one knob to turn.',
    ],
  },
  pullQuote: 'Find the peak. Find the valley. That is optimization.',
  technical: [
    {
      h: 'Derivatives — the rate of change',
      body: 'The derivative f\'(x) gives the instantaneous rate of change of f at x. Geometrically, it is the slope of the tangent line.<br/><br/><span class="mono">f\'(x) = lim(h→0) [f(x+h) − f(x)] / h</span><br/><br/>Key rules: power rule (d/dx x<sup>n</sup> = nx<sup>n−1</sup>), product rule, quotient rule, chain rule.',
    },
    {
      h: 'Maxima and minima',
      body: '<strong>Critical points:</strong> where f\'(x) = 0 or f\'(x) is undefined.<br/><strong>First derivative test:</strong> f\' changes sign from + to − → local maximum. From − to + → local minimum.<br/><strong>Second derivative test:</strong> At critical point x₀: f\'\'(x₀) < 0 → maximum. f\'\'(x₀) > 0 → minimum. f\'\'(x₀) = 0 → inconclusive.',
    },
    {
      h: 'Integration — accumulation',
      body: 'The definite integral ∫ₐᵇ f(x)dx gives the signed area under f(x) from a to b.<br/><br/>Fundamental theorem of calculus: if F\'(x) = f(x), then ∫ₐᵇ f(x)dx = F(b) − F(a).<br/><br/>Key techniques: substitution, integration by parts (∫u·dv = uv − ∫v·du), partial fractions.',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Finding maxima/minima of single-variable functions (most common, 2-mark NAT). Definite integrals with limits. Multivariable partial derivatives and gradient. Taylor/Maclaurin series expansion. Lagrange multipliers for constrained optimization (rare but high-mark). Mean value theorem (conceptual MCQ).',
    },
  ],
  realWorld: [
    { k: 'Power optimization', v: 'Apple engineers minimize P = C·V²·f by finding the optimal voltage-frequency tradeoff' },
    { k: 'Signal processing', v: 'Fourier transforms are integrals — decompose signals into frequencies' },
    { k: 'Clock tree', v: 'Minimize skew (derivative of delay with respect to wire length) across 19B transistors' },
    { k: 'Thermal design', v: 'Heat equation is a PDE — temperature gradient drives thermal throttling decisions' },
    { k: 'Battery curve', v: 'Integral of current over time = charge consumed. iOS integrates I(t) for battery %' },
    { k: 'Antenna design', v: 'Radiation pattern optimization = maximizing gain integral over solid angle' },
    { k: 'PLL loop filter', v: 'Transfer function poles found by setting derivative of denominator to zero' },
  ],
  formulas: [
    { name: 'Power rule', eq: 'd/dx [xⁿ] = n·xⁿ⁻¹', when: 'polynomial differentiation', stars: 5 },
    { name: 'Chain rule', eq: 'd/dx [f(g(x))] = f\'(g(x)) · g\'(x)', when: 'composite functions', stars: 5 },
    { name: 'Integration by parts', eq: '∫u·dv = u·v − ∫v·du', when: 'product of two functions', stars: 4 },
    { name: 'Taylor series', eq: 'f(x) = Σ f⁽ⁿ⁾(a)/n! · (x−a)ⁿ', when: 'approximation near point a', stars: 4 },
    { name: 'Second derivative test', eq: 'f\'\'(x₀) < 0 → max, f\'\'(x₀) > 0 → min', when: 'classifying critical points', stars: 5 },
    { name: 'Leibniz integral rule', eq: 'd/dx ∫ₐ⁽ˣ⁾ f(t)dt = f(x)', when: 'differentiating an integral with variable limit', stars: 3 },
  ],
}

export const CALC_LAB = {
  title: 'A19 Pro · optimal voltage scaling',
  narrative: 'Dynamic voltage scaling: the A19 Pro adjusts supply voltage to minimize power. Power P(V) = 0.5V³ − 3V² + 6V (in mW) for the valid range V ∈ [1, 4]. Find the voltage that gives minimum power consumption.',
  params: [
    { label: 'System', value: 'Dynamic voltage-frequency scaling' },
    { label: 'Power function', value: 'P(V) = 0.5V³ − 3V² + 6V mW' },
    { label: 'Valid range', value: 'V ∈ [1, 4] volts' },
    { label: 'Method', value: 'Set P\'(V) = 0, verify with P\'\'(V)' },
    { label: 'P\'(V)', value: '1.5V² − 6V + 6' },
    { label: 'Required', value: 'V at minimum power' },
  ],
  correctAnswer: 2.00,
  tolerance: 0.05,
  answerLabel: 'V_min',
  unit: 'V',
  hint: 'Set P\'(V) = 1.5V² − 6V + 6 = 0. Divide by 1.5 to get V² − 4V + 4 = 0.',
  solution: [
    { tag: 'Differentiate', line: 'P\'(V) = 1.5V² − 6V + 6' },
    { tag: 'Set to zero', line: '1.5V² − 6V + 6 = 0 → V² − 4V + 4 = 0' },
    { tag: 'Factor', line: '(V − 2)² = 0 → V = <strong>2.00 V</strong>' },
    { tag: 'Verify', line: 'P\'\'(V) = 3V − 6. P\'\'(2) = 0 → test boundary. P(1) = 3.5, P(2) = 2, P(4) = 8 → min at V = 2' },
    { tag: 'Meaning', line: 'The chip achieves minimum power at V = 2V. Below this, leakage dominates. Above, dynamic power dominates cubically.' },
  ],
}

export const CALC_PYQS = [
  {
    id: 'calc-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'Find the maximum value of f(x) = −x² + 4x + 5.',
    answer: 9.00, unit: '',
    trap: 'f\'(x) = −2x + 4 = 0 → x = 2. f(2) = −4 + 8 + 5 = 9. Verify: f\'\'(2) = −2 < 0 → maximum.',
    why: 'Critical point at x = 2. f\'\'(2) = −2 < 0 confirms maximum. f(2) = 9.',
  },
  {
    id: 'calc-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'Evaluate ∫₀¹ (3x² + 2x) dx.',
    answer: 2.00, unit: '',
    trap: 'Integrate term by term: x³ + x². Evaluate from 0 to 1: (1 + 1) − (0) = 2.',
    why: '∫(3x² + 2x)dx = x³ + x². [x³ + x²]₀¹ = (1 + 1) − 0 = 2.',
  },
  {
    id: 'calc-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'At a point where f\'(x) = 0 and f\'\'(x) = 0, the point is:',
    options: ['Definitely a maximum', 'Definitely a minimum', 'Definitely an inflection point', 'Inconclusive — higher order test needed'],
    answerIdx: 3,
    trap: 'f\'\'(x) = 0 makes the second derivative test fail. Need higher derivatives or first derivative sign test.',
    why: 'When both f\'(x) = 0 and f\'\'(x) = 0, the second derivative test is inconclusive.',
  },
  {
    id: 'calc-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'Find the first three terms of the Maclaurin series for eˣ. The coefficient of x² is:',
    answer: 0.50, unit: '',
    trap: 'eˣ = 1 + x + x²/2! + ... The coefficient of x² is 1/2 = 0.50.',
    why: 'Maclaurin series: eˣ = Σ xⁿ/n!. Coefficient of x² = 1/2! = 0.50.',
  },
  {
    id: 'calc-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'The mean value theorem guarantees that for f continuous on [a,b] and differentiable on (a,b):',
    options: ['f(a) = f(b)', 'f\'(c) = [f(b)−f(a)]/(b−a) for some c ∈ (a,b)', 'f has a maximum on [a,b]', 'f\'\'(c) = 0 for some c'],
    answerIdx: 1,
    trap: 'MVT says there exists a c where the instantaneous slope equals the average slope.',
    why: 'MVT: ∃ c ∈ (a,b) such that f\'(c) = [f(b) − f(a)] / (b − a).',
  },
  {
    id: 'calc-pyq-2020', year: 2020, marks: 2, type: 'NAT',
    q: 'Find the area bounded by y = x², the x-axis, and lines x = 0, x = 3.',
    answer: 9.00, unit: '',
    trap: 'Area = ∫₀³ x² dx = [x³/3]₀³ = 27/3 = 9.',
    why: '∫₀³ x² dx = x³/3 |₀³ = 27/3 − 0 = 9.',
  },
]

export const CALC_PRACTICE = [
  {
    id: 'calc-p1', kind: 'nat',
    q: 'Find f\'(2) if f(x) = x³ − 3x² + 2.',
    unit: '', answer: 0.00,
    why: 'f\'(x) = 3x² − 6x. f\'(2) = 12 − 12 = 0. (This is a critical point.)',
  },
  {
    id: 'calc-p2', kind: 'mcq',
    q: 'f(x) = x³ has f\'(0) = 0 and f\'\'(0) = 0. Point x = 0 is:',
    options: ['A local maximum', 'A local minimum', 'An inflection point', 'A saddle point'],
    answerIdx: 2,
    why: 'f\'\'\'(0) = 6 ≠ 0. First non-zero higher derivative is odd order → inflection point, not extremum.',
  },
  {
    id: 'calc-p3', kind: 'nat',
    q: 'Evaluate ∫₁ᵉ (1/x) dx. (2 dp)',
    unit: '', answer: 1.00,
    why: '∫(1/x)dx = ln|x|. [ln x]₁ᵉ = ln(e) − ln(1) = 1 − 0 = 1.00.',
  },
  {
    id: 'calc-p4', kind: 'mcq',
    q: 'Which integration technique works for ∫ x·eˣ dx?',
    options: ['Substitution', 'Integration by parts', 'Partial fractions', 'Direct formula'],
    answerIdx: 1,
    why: 'Product of polynomial and exponential → integration by parts. u = x, dv = eˣdx.',
  },
  {
    id: 'calc-p5', kind: 'nat',
    q: 'f(x) = sin(x). f\'\'(π/2) = ?',
    unit: '', answer: -1.00,
    why: 'f\'(x) = cos(x). f\'\'(x) = −sin(x). f\'\'(π/2) = −sin(π/2) = −1.',
  },
]

export const CALC_INSIGHT = {
  frequency: '6 of 7',
  body: 'Maxima/minima and definite integrals appear in almost every GATE paper. The second derivative test and integration by parts are the most tested techniques.',
}
