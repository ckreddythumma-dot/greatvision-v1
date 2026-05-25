export const PROB_THEORY = {
  eli10: {
    headline: 'How likely? How spread out? That is probability.',
    body: [
      'Probability answers one question: how likely is something to happen? Flip a fair coin — probability of heads is 1/2. Roll a die — probability of getting 6 is 1/6.',
      'A random variable is a number that depends on chance. Your GATE score is a random variable before the exam. After the exam, it is a fixed number.',
      'The mean (expected value) tells you the center — the average outcome if you repeated the experiment forever. The variance tells you how spread out the outcomes are around the mean.',
      'Two events are independent if one does not affect the other. Coin flips are independent. Drawing cards without replacement is not.',
      'GATE tests Bayes\' theorem (updating probability with new evidence), common distributions (Gaussian, Poisson, Binomial), and expectation calculations.',
    ],
  },
  pullQuote: 'How likely? How spread out? That is probability.',
  technical: [
    {
      h: 'Foundations',
      body: '<strong>Sample space Ω:</strong> set of all outcomes. <strong>Event A:</strong> subset of Ω.<br/><span class="mono">P(A)</span> ∈ [0, 1]. P(Ω) = 1. P(A∪B) = P(A) + P(B) − P(A∩B).<br/><strong>Conditional:</strong> P(A|B) = P(A∩B)/P(B).<br/><strong>Independence:</strong> P(A∩B) = P(A)·P(B).',
    },
    {
      h: 'Random variables and distributions',
      body: '<strong>Discrete:</strong> PMF p(x) = P(X = x). <strong>Continuous:</strong> PDF f(x), P(a ≤ X ≤ b) = ∫ₐᵇ f(x)dx.<br/><strong>CDF:</strong> F(x) = P(X ≤ x). F\'(x) = f(x) for continuous.<br/><br/>Common: Bernoulli (p), Binomial (n,p), Poisson (λ), Uniform, Exponential (λ), Gaussian (μ,σ²).',
    },
    {
      h: 'Expectation and variance',
      body: '<span class="mono">E[X]</span> = Σ x·p(x) or ∫ x·f(x)dx — the mean/average value.<br/><span class="mono">Var(X)</span> = E[X²] − (E[X])² — measures spread.<br/><span class="mono">σ</span> = √Var — standard deviation.<br/><br/>Linearity: E[aX+b] = aE[X]+b. Var(aX+b) = a²Var(X).',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Bayes\' theorem (most common, 2-mark). Expected value and variance calculations. Gaussian distribution: 68-95-99.7 rule. Poisson distribution: P(X=k) = e<sup>−λ</sup>λᵏ/k!. Conditional probability. Total probability theorem. CDF to PDF conversion.',
    },
  ],
  realWorld: [
    { k: 'Yield prediction', v: 'TSMC models defect probability per die — Poisson distribution determines yield rate' },
    { k: 'Error correction', v: 'LDPC codes in the flash controller use probability to decode corrupted bits' },
    { k: 'Noise modeling', v: 'Thermal noise is Gaussian — SNR calculations assume N(0, kT/C) distribution' },
    { k: 'Reliability', v: 'MTBF of the A19 Pro follows exponential distribution — failure rate in FITs' },
    { k: 'ML inference', v: 'Neural Engine outputs are probabilities — softmax converts logits to P(class)' },
    { k: 'Testing', v: 'Statistical sampling: test 1000 chips, infer defect rate with confidence intervals' },
    { k: 'Random number gen', v: 'Secure enclave uses hardware RNG — uniform distribution verified by NIST tests' },
  ],
  formulas: [
    { name: 'Bayes\' theorem', eq: 'P(A|B) = P(B|A)·P(A) / P(B)', when: 'updating probability with new evidence', stars: 5 },
    { name: 'Total probability', eq: 'P(B) = Σ P(B|Aᵢ)·P(Aᵢ)', when: 'B can occur via multiple paths A₁, A₂, ...', stars: 5 },
    { name: 'Variance shortcut', eq: 'Var(X) = E[X²] − (E[X])²', when: 'computing variance (always use this form)', stars: 5 },
    { name: 'Poisson PMF', eq: 'P(X=k) = e^(−λ)·λᵏ/k!', when: 'rare events, known average rate λ', stars: 4 },
    { name: 'Gaussian PDF', eq: 'f(x) = (1/σ√2π)·e^(−(x−μ)²/2σ²)', when: 'continuous, bell-shaped distribution', stars: 4 },
    { name: 'Binomial PMF', eq: 'P(X=k) = C(n,k)·pᵏ·(1−p)^(n−k)', when: 'n independent trials, probability p each', stars: 4 },
  ],
}

export const PROB_LAB = {
  title: 'A19 Pro · chip yield Bayes estimation',
  narrative: 'TSMC\'s N3E process has two fab lines. Line A produces 60% of A19 Pro dies with 2% defect rate. Line B produces 40% with 5% defect rate. A randomly selected chip is found defective. What is the probability it came from Line A?',
  params: [
    { label: 'Line A', value: 'P(A) = 0.60, P(defect|A) = 0.02' },
    { label: 'Line B', value: 'P(B) = 0.40, P(defect|B) = 0.05' },
    { label: 'Method', value: 'Bayes\' theorem' },
    { label: 'Find', value: 'P(A|defect)' },
    { label: 'P(defect)', value: 'Use total probability theorem' },
    { label: 'Required', value: 'P(A|defect) as decimal' },
  ],
  correctAnswer: 0.375,
  tolerance: 0.005,
  answerLabel: 'P(A|def)',
  unit: '',
  hint: 'First find P(defect) = P(def|A)·P(A) + P(def|B)·P(B). Then apply Bayes.',
  solution: [
    { tag: 'Total prob', line: 'P(def) = 0.02×0.60 + 0.05×0.40 = 0.012 + 0.020 = 0.032' },
    { tag: 'Bayes', line: 'P(A|def) = P(def|A)·P(A) / P(def)' },
    { tag: 'Compute', line: 'P(A|def) = 0.012 / 0.032 = <strong>0.375</strong>' },
    { tag: 'Interpret', line: 'Even though Line A produces more chips, its lower defect rate means only 37.5% of defective chips came from A.' },
    { tag: 'Meaning', line: 'Line B, despite lower volume, contributes 62.5% of defects — focus quality improvement there.' },
  ],
}

export const PROB_PYQS = [
  {
    id: 'prob-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'A die is rolled twice. P(sum = 7) = ?. Give answer as fraction decimal (e.g., 0.17).',
    answer: 0.17, unit: '',
    trap: '6 favorable outcomes out of 36 total. 6/36 = 1/6 ≈ 0.167 ≈ 0.17.',
    why: 'Pairs summing to 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1). P = 6/36 = 1/6 ≈ 0.17.',
  },
  {
    id: 'prob-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'X ~ Poisson(3). Find P(X = 0). (4 dp)',
    answer: 0.0498, unit: '',
    trap: 'P(X=0) = e^(−3) · 3⁰/0! = e^(−3) ≈ 0.0498.',
    why: 'P(X=0) = e^(−λ) = e^(−3) = 0.0498.',
  },
  {
    id: 'prob-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'For a Gaussian random variable, P(μ−σ ≤ X ≤ μ+σ) ≈',
    options: ['50%', '68%', '95%', '99.7%'],
    answerIdx: 1,
    trap: 'The 68-95-99.7 rule: ±1σ contains 68%, ±2σ contains 95%, ±3σ contains 99.7%.',
    why: '68% of data falls within one standard deviation of the mean for a Gaussian distribution.',
  },
  {
    id: 'prob-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'E[X] = 3, E[X²] = 11. Find Var(X).',
    answer: 2.00, unit: '',
    trap: 'Var(X) = E[X²] − (E[X])² = 11 − 9 = 2. Don\'t forget to square E[X].',
    why: 'Var(X) = E[X²] − (E[X])² = 11 − 3² = 11 − 9 = 2.',
  },
  {
    id: 'prob-pyq-2021', year: 2021, marks: 2, type: 'NAT',
    q: 'Two independent events: P(A) = 0.3, P(B) = 0.4. Find P(A∪B).',
    answer: 0.58, unit: '',
    trap: 'P(A∪B) = P(A) + P(B) − P(A∩B) = 0.3 + 0.4 − 0.12 = 0.58.',
    why: 'Independent: P(A∩B) = P(A)·P(B) = 0.12. P(A∪B) = 0.3 + 0.4 − 0.12 = 0.58.',
  },
  {
    id: 'prob-pyq-2020', year: 2020, marks: 1, type: 'MCQ',
    q: 'A CDF F(x) must satisfy:',
    options: ['F(−∞) = 1, F(∞) = 0', 'F(−∞) = 0, F(∞) = 1, non-decreasing', 'F(x) can be negative', 'F(x) must be differentiable everywhere'],
    answerIdx: 1,
    trap: 'CDF properties: starts at 0, ends at 1, non-decreasing, right-continuous.',
    why: 'F(−∞) = 0, F(∞) = 1, and F is monotonically non-decreasing.',
  },
]

export const PROB_PRACTICE = [
  {
    id: 'prob-p1', kind: 'nat',
    q: 'Coin flipped 3 times. P(exactly 2 heads) = ? (4 dp)',
    unit: '', answer: 0.375,
    why: 'Binomial: C(3,2)·(0.5)²·(0.5)¹ = 3 × 0.25 × 0.5 = 0.375.',
  },
  {
    id: 'prob-p2', kind: 'mcq',
    q: 'For independent X and Y, Var(X + Y) = ?',
    options: ['Var(X) + Var(Y)', 'Var(X) · Var(Y)', '[Var(X)]² + [Var(Y)]²', 'Var(X) − Var(Y)'],
    answerIdx: 0,
    why: 'For independent variables, Var(X+Y) = Var(X) + Var(Y). Covariance = 0.',
  },
  {
    id: 'prob-p3', kind: 'nat',
    q: 'X is uniform on [0, 4]. Find E[X]. (2 dp)',
    unit: '', answer: 2.00,
    why: 'Uniform on [a,b]: E[X] = (a+b)/2 = (0+4)/2 = 2.',
  },
  {
    id: 'prob-p4', kind: 'mcq',
    q: 'Exponential distribution models:',
    options: ['Number of events in an interval', 'Time between events', 'Sum of squared normals', 'Difference of two means'],
    answerIdx: 1,
    why: 'Exponential: time between Poisson events. Memoryless property: P(X>s+t|X>s) = P(X>t).',
  },
  {
    id: 'prob-p5', kind: 'nat',
    q: 'P(A) = 0.5, P(B|A) = 0.6. Find P(A∩B). (2 dp)',
    unit: '', answer: 0.30,
    why: 'P(A∩B) = P(B|A)·P(A) = 0.6 × 0.5 = 0.30.',
  },
]

export const PROB_INSIGHT = {
  frequency: '5 of 7',
  body: 'Bayes\' theorem and expected value calculations are the most tested. Gaussian properties and Poisson distribution appear frequently. The variance shortcut E[X²]−(E[X])² is essential.',
}
