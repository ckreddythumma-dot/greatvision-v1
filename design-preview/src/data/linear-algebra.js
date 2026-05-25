export const LA_THEORY = {
  eli10: {
    headline: 'Stretch, rotate, squish. Every matrix is a transformation.',
    body: [
      'A matrix is a machine that transforms vectors. Put in a vector, get out a different vector — stretched, rotated, or squished.',
      'Some special vectors go through the machine and come out pointing in the same direction — only their length changes. These are eigenvectors. The scaling factor is the eigenvalue.',
      'If the eigenvalue is 2, the vector gets twice as long. If it is 0.5, it gets half as long. If it is negative, it flips direction.',
      'Why does GATE care? Because eigenvalues tell you everything about a system — stability, oscillation, steady state. A control system with a negative eigenvalue is stable. A positive one blows up.',
      'Every linear system — circuits, signals, control — reduces to matrices and eigenvalues at some point.',
    ],
  },
  pullQuote: 'Stretch, rotate, squish. Every matrix is a transformation.',
  technical: [
    {
      h: 'Structure — rows, columns, and what they mean',
      body: 'A matrix is a rectangular array of numbers. An <span class="mono">m × n</span> matrix has m rows and n columns. A <em>square matrix</em> (n × n) is where eigenvalues live.<br/><br/><span class="mono">det(A)</span> — the determinant. If det(A) = 0, the matrix is <em>singular</em> (no inverse, maps some vectors to zero). If det(A) ≠ 0, it is invertible.',
    },
    {
      h: 'Key parameters',
      body: '<span class="mono">λ</span> — eigenvalue, found from det(A − λI) = 0 (the characteristic equation).<br/><span class="mono">x</span> — eigenvector, satisfying Ax = λx.<br/><span class="mono">tr(A)</span> — trace = sum of diagonal elements = sum of eigenvalues.<br/><span class="mono">det(A)</span> — product of eigenvalues.<br/><span class="mono">rank(A)</span> — number of linearly independent rows/columns.<br/><span class="mono">A<sup>−1</sup></span> — inverse, exists only if det(A) ≠ 0.',
    },
    {
      h: 'Eigenvalue computation',
      body: '<strong>Step 1:</strong> Form A − λI (subtract λ from each diagonal element).<br/><strong>Step 2:</strong> Set det(A − λI) = 0. This gives the <em>characteristic polynomial</em>.<br/><strong>Step 3:</strong> Solve for λ. For a 2×2 matrix: λ² − tr(A)·λ + det(A) = 0.<br/><strong>Step 4:</strong> For each λ, solve (A − λI)x = 0 to find the eigenvector.',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Eigenvalue calculation for 2×2 and 3×3 matrices (most common, 2-mark NAT). Properties: tr(A) = Σλ, det(A) = Πλ. Cayley-Hamilton theorem: every matrix satisfies its own characteristic equation. Diagonalization: A = PDP<sup>−1</sup>. Rank-nullity theorem. Positive definiteness (all eigenvalues > 0).',
    },
  ],
  realWorld: [
    { k: 'GPU computation', v: 'The A19 Pro GPU performs millions of matrix multiplications per frame — vertex transforms, lighting' },
    { k: 'Neural Engine', v: 'Every neural network layer is a matrix multiplication — 16-core engine does 35 TOPS' },
    { k: 'Image processing', v: 'Blur, sharpen, edge detect — all are matrix convolutions on pixel arrays' },
    { k: 'Stability analysis', v: 'PLL eigenvalues determine lock time and stability of the clock generation circuit' },
    { k: 'Signal compression', v: 'SVD (built on eigenvalues) powers image and video compression in the ISP' },
    { k: 'PageRank', v: 'Google\'s original algorithm = dominant eigenvector of the web link matrix' },
    { k: 'Vibration modes', v: 'Eigenvalues of the chip\'s mechanical model predict resonant frequencies' },
  ],
  formulas: [
    { name: 'Characteristic equation', eq: 'det(A − λI) = 0', when: 'finding eigenvalues of any square matrix', stars: 5 },
    { name: 'Trace-eigenvalue relation', eq: 'tr(A) = λ₁ + λ₂ + ... + λₙ', when: 'quick check / shortcut for eigenvalue sum', stars: 5 },
    { name: 'Determinant-eigenvalue', eq: 'det(A) = λ₁ · λ₂ · ... · λₙ', when: 'quick check / shortcut for eigenvalue product', stars: 4 },
    { name: '2×2 eigenvalues', eq: 'λ = [tr(A) ± √(tr²(A) − 4·det(A))] / 2', when: '2×2 matrix shortcut (quadratic formula)', stars: 5 },
    { name: 'Cayley-Hamilton', eq: 'p(A) = 0 where p(λ) is the characteristic polynomial', when: 'computing A⁻¹ or high powers of A', stars: 4 },
    { name: 'Inverse via eigenvalues', eq: 'eigenvalues of A⁻¹ are 1/λᵢ', when: 'A is invertible (all λᵢ ≠ 0)', stars: 3 },
  ],
}

export const LA_LAB = {
  title: 'A19 Pro · PLL stability check',
  narrative: 'You are verifying the stability of the A19 Pro\'s main PLL (Phase-Locked Loop). The loop dynamics reduce to a 2×2 state matrix A. If any eigenvalue has a positive real part, the PLL oscillates uncontrollably and the chip fails to boot. Your task: compute the eigenvalues.',
  params: [
    { label: 'System', value: '2×2 state matrix of PLL loop filter' },
    { label: 'Matrix A', value: '[[4, 1], [2, 3]]' },
    { label: 'tr(A)', value: '4 + 3 = 7' },
    { label: 'det(A)', value: '4×3 − 1×2 = 10' },
    { label: 'Characteristic eq.', value: 'λ² − 7λ + 10 = 0' },
    { label: 'Required', value: 'Largest eigenvalue λ₁' },
  ],
  correctAnswer: 5.00,
  tolerance: 0.05,
  answerLabel: 'λ₁',
  unit: '',
  hint: 'Use the quadratic formula: λ = [tr(A) ± √(tr²−4·det)] / 2 = [7 ± √(49−40)] / 2.',
  solution: [
    { tag: 'Trace', line: 'tr(A) = 4 + 3 = 7' },
    { tag: 'Determinant', line: 'det(A) = 4×3 − 1×2 = 10' },
    { tag: 'Characteristic eq.', line: 'λ² − 7λ + 10 = 0' },
    { tag: 'Discriminant', line: 'Δ = 49 − 40 = 9, √Δ = 3' },
    { tag: 'Eigenvalues', line: 'λ = (7 ± 3)/2 → λ₁ = <strong>5</strong>, λ₂ = 2' },
    { tag: 'Meaning', line: 'Both eigenvalues are positive and real — the PLL loop needs negative feedback (sign inversion) to be stable. As-is, this matrix represents an unstable open-loop system.' },
  ],
}

export const LA_PYQS = [
  {
    id: 'la-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'Find the sum of eigenvalues of A = [[3, 1], [0, 2]].',
    answer: 5.00, unit: '',
    trap: 'Sum of eigenvalues = trace. Don\'t compute the full characteristic equation.',
    why: 'tr(A) = 3 + 2 = 5. For a triangular matrix, eigenvalues are the diagonal elements: 3 and 2.',
  },
  {
    id: 'la-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'A 3×3 matrix has eigenvalues 1, 2, 3. Find det(A).',
    answer: 6.00, unit: '',
    trap: 'det(A) = product of eigenvalues, not sum.',
    why: 'det(A) = 1 × 2 × 3 = 6.',
  },
  {
    id: 'la-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'If A is a 3×3 matrix with rank 2, what can be said about its eigenvalues?',
    options: ['All three are non-zero', 'At least one is zero', 'All three are zero', 'Exactly two are zero'],
    answerIdx: 1,
    trap: 'Rank < n means the matrix is singular → det = 0 → at least one eigenvalue is 0.',
    why: 'rank(A) = 2 < 3, so A is singular. det(A) = 0, meaning at least one eigenvalue is zero.',
  },
  {
    id: 'la-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'Find the eigenvalues of A = [[5, 4], [1, 2]]. Give the larger eigenvalue.',
    answer: 6.00, unit: '',
    trap: 'Don\'t forget: λ² − tr(A)·λ + det(A) = 0. tr = 7, det = 6.',
    why: 'tr(A) = 7, det(A) = 10−4 = 6. λ² − 7λ + 6 = 0. (λ−6)(λ−1) = 0. λ = 6 or 1.',
  },
  {
    id: 'la-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'The Cayley-Hamilton theorem states that:',
    options: ['Every matrix commutes with its transpose', 'Every matrix satisfies its own characteristic equation', 'Every symmetric matrix has real eigenvalues', 'det(A) = tr(A) for all matrices'],
    answerIdx: 1,
    trap: 'Cayley-Hamilton is specifically about the characteristic equation, not general matrix properties.',
    why: 'The Cayley-Hamilton theorem: if p(λ) = det(A − λI) is the characteristic polynomial, then p(A) = 0.',
  },
  {
    id: 'la-pyq-2020', year: 2020, marks: 2, type: 'NAT',
    q: 'A 2×2 matrix has tr(A) = 6 and det(A) = 8. Find the smaller eigenvalue.',
    answer: 2.00, unit: '',
    trap: 'λ² − 6λ + 8 = 0 → (λ−4)(λ−2) = 0.',
    why: 'λ² − 6λ + 8 = 0. Factoring: (λ−4)(λ−2) = 0. Eigenvalues: 4 and 2. Smaller = 2.',
  },
]

export const LA_PRACTICE = [
  {
    id: 'la-p1', kind: 'nat',
    q: 'Find det(A) if A = [[2, 3], [1, 4]]. (2 dp)',
    unit: '', answer: 5.00,
    why: 'det(A) = 2×4 − 3×1 = 8 − 3 = 5.',
  },
  {
    id: 'la-p2', kind: 'mcq',
    q: 'A matrix has eigenvalues 2 and −3. The matrix is:',
    options: [
      'Singular — because one eigenvalue is negative',
      'Invertible — because no eigenvalue is zero',
      'Positive definite — because eigenvalues are real',
      'Orthogonal — because eigenvalues multiply to −6',
    ],
    answerIdx: 1,
    why: 'A matrix is invertible iff all eigenvalues are non-zero. det(A) = 2 × (−3) = −6 ≠ 0.',
  },
  {
    id: 'la-p3', kind: 'nat',
    q: 'Eigenvalues of A are 3, 5. Find eigenvalues of A². Give the larger one.',
    unit: '', answer: 25.00,
    why: 'If λ is an eigenvalue of A, then λ² is an eigenvalue of A². So: 9 and 25.',
  },
  {
    id: 'la-p4', kind: 'mcq',
    q: 'For an orthogonal matrix Q, which is always true?',
    options: [
      'det(Q) = 0',
      '|λ| = 1 for all eigenvalues',
      'All eigenvalues are positive',
      'Q = Q⁻¹',
    ],
    answerIdx: 1,
    why: 'Orthogonal matrix: Q^T Q = I. All eigenvalues have magnitude 1. det(Q) = ±1.',
  },
  {
    id: 'la-p5', kind: 'nat',
    q: 'A 3×3 matrix has eigenvalues 1, −1, 2. Find trace(A). (2 dp)',
    unit: '', answer: 2.00,
    why: 'tr(A) = sum of eigenvalues = 1 + (−1) + 2 = 2.',
  },
]

export const LA_INSIGHT = {
  frequency: '5 of 7',
  body: 'Eigenvalue computation and properties dominate GATE questions. The 2×2 shortcut (quadratic from trace and determinant) is the most tested pattern.',
}
