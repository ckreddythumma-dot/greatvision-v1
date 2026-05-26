export const BOOL_THEORY = {
  eli10: {
    headline: 'ON or OFF. Every computer starts here.',
    body: [
      'A light switch has two positions — ON and OFF. In digital circuits, we call them 1 and 0. That is all a computer understands. Boolean algebra is the math for working with these two values.',
      'There are only three basic operations. AND: both switches must be ON for the light to turn on (like two switches in series). OR: either switch being ON turns the light on (like switches in parallel). NOT: flip the switch — ON becomes OFF, OFF becomes ON.',
      'With just these three operations, you can build anything — calculators, phones, the entire A19 Pro chip. Every circuit in every computer is a combination of AND, OR, and NOT.',
      'A truth table is a cheat sheet that lists every possible combination of inputs (ON/OFF) and the resulting output. For 2 inputs there are 4 combinations. For 3 inputs, 8 combinations. For n inputs, 2 raised to n.',
      'GATE tests if you can simplify expressions. Simpler expression = fewer gates = fewer transistors = cheaper, faster chip. De Morgan\'s theorem is the key trick: NOT(A AND B) = (NOT A) OR (NOT B).',
    ],
  },
  pullQuote: 'ON or OFF. Every computer starts here.',
  technical: [
    {
      h: 'Fundamental operations',
      body: '<strong>AND (·):</strong> A·B = 1 only when both A=1 and B=1.<br/><strong>OR (+):</strong> A+B = 1 when at least one is 1.<br/><strong>NOT (\'):</strong> A\' flips the value. 0→1, 1→0.<br/><strong>XOR (⊕):</strong> A⊕B = 1 when inputs differ.<br/><strong>NAND:</strong> (A·B)\' — universal gate. <strong>NOR:</strong> (A+B)\' — universal gate.',
    },
    {
      h: 'Key laws',
      body: '<strong>Commutative:</strong> A+B = B+A, A·B = B·A.<br/><strong>Associative:</strong> (A+B)+C = A+(B+C).<br/><strong>Distributive:</strong> A·(B+C) = A·B + A·C. Also: A+(B·C) = (A+B)·(A+C).<br/><strong>De Morgan\'s:</strong> (A·B)\' = A\'+B\'. (A+B)\' = A\'·B\'.<br/><strong>Absorption:</strong> A + A·B = A. A·(A+B) = A.',
    },
    {
      h: 'Canonical forms',
      body: '<strong>SOP (Sum of Products):</strong> OR of AND terms (minterms). F = Σm(1,3,5).<br/><strong>POS (Product of Sums):</strong> AND of OR terms (maxterms). F = ΠM(0,2,4).<br/><strong>Minterms:</strong> each row where F=1. <strong>Maxterms:</strong> each row where F=0.<br/>SOP and POS are duals. Convert between them using the complement rule.',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Simplification using Boolean laws (most common). De Morgan\'s theorem application. SOP/POS conversion. Number of gates needed for implementation. Universal gate implementation (NAND/NOR only). Duality principle.',
    },
  ],
  realWorld: [
    { k: 'Logic synthesis', v: 'EDA tools simplify Boolean expressions into optimal gate networks for the A19 Pro' },
    { k: 'NAND flash', v: 'Storage cells are NAND gates — 256GB of NAND gates on the iPhone' },
    { k: 'Address decoding', v: 'Memory address decoders are AND/OR networks — select 1 of billions of SRAM cells' },
    { k: 'ALU', v: 'The arithmetic logic unit implements add/subtract/compare using Boolean operations' },
    { k: 'Power gating', v: 'Boolean enable signals control which chip blocks are powered — sleep mode logic' },
    { k: 'Error detection', v: 'Parity check = XOR of all bits — single-bit error detection in every bus transfer' },
    { k: 'Instruction decode', v: 'CPU instruction decoder maps opcodes to control signals via Boolean logic' },
  ],
  formulas: [
    { name: 'De Morgan\'s (AND)', eq: '(A·B)\' = A\' + B\'', when: 'converting AND-NOT to OR', stars: 5 },
    { name: 'De Morgan\'s (OR)', eq: '(A+B)\' = A\' · B\'', when: 'converting OR-NOT to AND', stars: 5 },
    { name: 'Absorption', eq: 'A + A·B = A', when: 'simplifying redundant terms', stars: 4 },
    { name: 'Consensus', eq: 'A·B + A\'·C + B·C = A·B + A\'·C', when: 'removing redundant consensus term', stars: 3 },
    { name: 'XOR identity', eq: 'A⊕B = A·B\' + A\'·B', when: 'expanding XOR into AND/OR', stars: 4 },
    { name: 'Shannon expansion', eq: 'F = A·F(A=1) + A\'·F(A=0)', when: 'decomposing function around a variable', stars: 3 },
  ],
}

export const BOOL_LAB = {
  title: 'A19 Pro · power gating logic',
  narrative: 'The A19 Pro has a power gating controller. A block should power ON when: (CPU_active AND NOT sleep_mode) OR (GPU_active AND high_perf_mode). Simplify the enable expression E = A·S\' + G·H using Boolean algebra.',
  params: [
    { label: 'Expression', value: 'E = A·S\' + G·H' },
    { label: 'Variables', value: 'A = CPU_active, S = sleep_mode, G = GPU_active, H = high_perf' },
    { label: 'Question', value: 'How many 2-input gates needed?' },
    { label: 'NOT gate', value: '1 (for S\')' },
    { label: 'AND gates', value: '2 (for A·S\' and G·H)' },
    { label: 'OR gates', value: '1 (to combine)' },
  ],
  correctAnswer: 4.00,
  tolerance: 0.05,
  answerLabel: 'Gates',
  unit: '',
  hint: 'Count: 1 NOT + 2 AND + 1 OR = total gates.',
  solution: [
    { tag: 'Expression', line: 'E = A·S\' + G·H' },
    { tag: 'NOT', line: 'S\' requires 1 NOT gate' },
    { tag: 'AND', line: 'A·S\' requires 1 AND gate. G·H requires 1 AND gate.' },
    { tag: 'OR', line: '(A·S\') + (G·H) requires 1 OR gate' },
    { tag: 'Total', line: '<strong>4 gates</strong> (1 NOT + 2 AND + 1 OR)' },
    { tag: 'Meaning', line: 'This is already minimal — no further Boolean simplification possible. The expression has two independent terms.' },
  ],
}

export const BOOL_PYQS = [
  {
    id: 'bool-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'Simplify F = A·B + A·B\' + A\'·B. How many minterms does F have?',
    answer: 3.00, unit: '',
    trap: 'F = A·B + A·B\' + A\'·B = A(B+B\') + A\'B = A + A\'B = A + B. Minterms: 01, 10, 11 = 3.',
    why: 'F = A + B. Truth table: F=0 only when A=0,B=0. Three minterms: m1, m2, m3.',
  },
  {
    id: 'bool-pyq-2024', year: 2024, marks: 1, type: 'MCQ',
    q: 'The dual of A + A\'·B is:',
    options: ['A · (A\' + B)', 'A\' + A·B', 'A · (A + B\')', '(A + A\') · B'],
    answerIdx: 0,
    trap: 'Duality: swap AND↔OR, 0↔1, keep complements. A + A\'·B → A · (A\' + B).',
    why: 'Replace + with · and · with +: A·(A\'+B). Variables and complements unchanged.',
  },
  {
    id: 'bool-pyq-2023', year: 2023, marks: 2, type: 'NAT',
    q: 'Minimum NAND gates to implement F = (A+B)\'? ',
    answer: 1.00, unit: '',
    trap: '(A+B)\' = A\'·B\' (De Morgan). But a NOR gate is (A+B)\'. With NAND only: need bubble pushing. Actually, F = (A+B)\' can be done with 1 NOR or 3 NANDs.',
    why: 'Using NAND: A\' = NAND(A,A), B\' = NAND(B,B), A\'·B\' = NAND(NAND(A\',B\'), NAND(A\',B\')) — but more simply, (A+B)\' needs 3 NAND gates. However, if NOR is available, 1 gate suffices.',
  },
  {
    id: 'bool-pyq-2022', year: 2022, marks: 1, type: 'MCQ',
    q: 'Which gate is a universal gate?',
    options: ['AND', 'OR', 'XOR', 'NAND'],
    answerIdx: 3,
    trap: 'NAND and NOR are universal — any function can be built using only NAND (or only NOR).',
    why: 'NAND is universal: NOT(A) = NAND(A,A). AND = NAND then NOT. OR via De Morgan.',
  },
  {
    id: 'bool-pyq-2021', year: 2021, marks: 2, type: 'NAT',
    q: 'F(A,B,C) = Σm(0,2,4,6). Simplify. F = ?',
    answer: 0.00, unit: '',
    trap: 'Minterms 0,2,4,6 are all even — C=0 in all. F = C\'. Answer expressed as a single literal.',
    why: 'All minterms have C=0: F = C\'. One literal, one NOT gate.',
  },
  {
    id: 'bool-pyq-2020', year: 2020, marks: 1, type: 'MCQ',
    q: 'A⊕A = ?',
    options: ['A', '1', '0', 'A\''],
    answerIdx: 2,
    trap: 'XOR with itself: A⊕A = 0. Any value XOR itself is 0.',
    why: 'A⊕A = A·A\' + A\'·A = 0 + 0 = 0.',
  },
]

export const BOOL_PRACTICE = [
  {
    id: 'bool-p1', kind: 'mcq',
    q: 'Simplify: A + A\'·B',
    options: ['A + B', 'A·B', 'B', 'A\'·B'],
    answerIdx: 0,
    why: 'A + A\'B = (A+A\')(A+B) = 1·(A+B) = A+B. Or: A covers A·B, leaving A\'·B → A+B.',
  },
  {
    id: 'bool-p2', kind: 'mcq',
    q: 'Apply De Morgan to (X·Y·Z)\':',
    options: ['X\'+Y\'+Z\'', 'X\'·Y\'·Z\'', '(X+Y+Z)\'', 'X·Y\'·Z\''],
    answerIdx: 0,
    why: 'De Morgan: complement of AND = OR of complements. (XYZ)\' = X\'+Y\'+Z\'.',
  },
  {
    id: 'bool-p3', kind: 'nat',
    q: 'How many rows in a truth table with 4 inputs?',
    unit: '', answer: 16.00,
    why: '2⁴ = 16 rows.',
  },
  {
    id: 'bool-p4', kind: 'mcq',
    q: 'A·1 = ?',
    options: ['0', '1', 'A', 'A\''],
    answerIdx: 2,
    why: 'Identity law: A AND 1 = A. The 1 has no effect.',
  },
  {
    id: 'bool-p5', kind: 'nat',
    q: 'F = A\'·B\' + A·B\'. How many minterms? (F has 2 variables)',
    unit: '', answer: 2.00,
    why: 'F = B\'(A\'+A) = B\'·1 = B\'. Minterms where B=0: m0 (A=0,B=0) and m2 (A=1,B=0). Two minterms.',
  },
]

export const BOOL_INSIGHT = {
  frequency: '4 of 7',
  body: 'Boolean simplification and De Morgan\'s theorem appear frequently. Universal gate implementation and SOP/POS conversions are common 2-mark questions.',
}
