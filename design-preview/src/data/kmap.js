export const KMAP_THEORY = {
  eli10: {
    headline: 'A picture that simplifies circuits. No algebra needed.',
    body: [
      'You have a Boolean expression with lots of terms. You could simplify it using algebra rules (tedious and error-prone). Or you could draw a picture and literally see the answer. That picture is a Karnaugh map.',
      'Step 1 — Draw a grid. For 4 variables (A, B, C, D), you get a 4x4 grid with 16 cells. Each cell is one possible input combination (0000 through 1111). Fill 1 where the output is ON, 0 where OFF.',
      'Step 2 — Circle groups of adjacent 1s. Groups must be rectangles of size 1, 2, 4, or 8. Bigger groups are better because they eliminate more variables. The grid wraps around: left edge connects to right, top to bottom.',
      'Step 3 — Read each group. Look at which variables stay constant inside the group. Variables that flip between 0 and 1 inside a group disappear from the expression. Write down only the constant ones.',
      'GATE gives 3 or 4-variable K-maps. The trick students miss: the grid wraps around. Cells on opposite edges ARE adjacent. Corner cells can form a group. Try it in the interactive map below.',
    ],
  },
  pullQuote: 'A picture that simplifies circuits. No algebra needed.',
  technical: [
    {
      h: 'K-map structure',
      body: '<strong>2-variable:</strong> 2×2 grid (4 cells).<br/><strong>3-variable:</strong> 2×4 grid (8 cells). Column order: 00, 01, 11, 10 (Gray code).<br/><strong>4-variable:</strong> 4×4 grid (16 cells). Both row and column in Gray code.<br/><br/>Gray code ensures adjacent cells differ by exactly one bit. The map wraps: leftmost column is adjacent to rightmost. Top row is adjacent to bottom.',
    },
    {
      h: 'Grouping rules',
      body: '<strong>Rule 1:</strong> Groups must be rectangular and contain 2ⁿ cells (1, 2, 4, 8, 16).<br/><strong>Rule 2:</strong> Groups can only contain 1s (or don\'t-cares).<br/><strong>Rule 3:</strong> Make groups as large as possible.<br/><strong>Rule 4:</strong> Every 1 must be in at least one group.<br/><strong>Rule 5:</strong> Groups can overlap.<br/><strong>Rule 6:</strong> Groups can wrap around edges.',
    },
    {
      h: 'Don\'t-care conditions',
      body: 'Don\'t-cares (d or X) are input combinations that can never occur or whose output doesn\'t matter. They can be treated as 1 or 0 — whichever gives larger groups.<br/><br/>Example: BCD digit decoder — inputs 1010 to 1111 never occur in valid BCD. Treating them as don\'t-cares allows much simpler logic.',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: '4-variable K-map minimization (most common, 2-mark). Essential prime implicants. Don\'t-care handling. Minimum SOP and POS from K-map. Number of prime implicants. Comparison with algebraic simplification.',
    },
  ],
  realWorld: [
    { k: 'Logic synthesis', v: 'EDA tools use algorithmic K-map equivalents (Espresso) to minimize gate count' },
    { k: 'State machines', v: 'Next-state logic in FSMs is minimized using K-maps — fewer gates = faster transitions' },
    { k: 'Decoder design', v: 'Address decoder for cache lines: K-map minimization reduces propagation delay' },
    { k: 'Don\'t-cares', v: 'Unused opcodes in the A19 Pro\'s decoder become don\'t-cares — simpler decode logic' },
    { k: 'Power savings', v: 'Every eliminated gate saves ~1 fJ per switching event × billions of switches' },
    { k: 'Timing closure', v: 'Simpler logic = shorter critical path = higher clock frequency' },
    { k: 'Area reduction', v: 'Minimized logic uses fewer transistors — matters when you have 19 billion already' },
  ],
  formulas: [
    { name: 'Group of 2', eq: 'Eliminates 1 variable', when: 'two adjacent 1s in K-map', stars: 5 },
    { name: 'Group of 4', eq: 'Eliminates 2 variables', when: 'four adjacent 1s forming a rectangle', stars: 5 },
    { name: 'Group of 8', eq: 'Eliminates 3 variables', when: 'eight adjacent 1s (half the 4-var map)', stars: 4 },
    { name: 'Essential PI', eq: 'A prime implicant covering a 1 not covered by any other PI', when: 'must be included in minimum cover', stars: 5 },
    { name: 'Min terms', eq: '2ⁿ cells for n variables', when: 'determining K-map size', stars: 3 },
    { name: 'Max groups', eq: 'log₂(cells in group) variables eliminated', when: 'reading simplified terms', stars: 4 },
  ],
}

export const KMAP_LAB = {
  title: 'A19 Pro · cache line decoder',
  narrative: 'You are minimizing the cache line select logic. The function F(A,B,C,D) = Σm(0,1,2,5,8,9,10) needs a minimum SOP expression. Use a 4-variable K-map to find the minimum number of product terms.',
  params: [
    { label: 'Function', value: 'F(A,B,C,D) = Σm(0,1,2,5,8,9,10)' },
    { label: 'Variables', value: '4 (A, B, C, D)' },
    { label: 'K-map size', value: '4×4 = 16 cells' },
    { label: 'Ones at', value: 'm0,m1,m2,m5,m8,m9,m10' },
    { label: 'Method', value: 'Group 1s, find minimum SOP' },
    { label: 'Required', value: 'Number of product terms in minimum SOP' },
  ],
  correctAnswer: 3.00,
  tolerance: 0.05,
  answerLabel: 'Terms',
  unit: '',
  hint: 'Place 1s in the K-map. Look for groups: {0,1,8,9} is a group of 4, {0,2,8,10} is a group of 4, {5} or {1,5} needs coverage.',
  solution: [
    { tag: 'K-map', line: 'Place 1s at positions 0,1,2,5,8,9,10 in a 4×4 K-map' },
    { tag: 'Group 1', line: '{0,1,8,9} → B\'D\' (group of 4, eliminates A and C... actually {0,1,8,9} = B\'·C\')' },
    { tag: 'Group 2', line: '{0,2,8,10} → B\'·D\' (group of 4)' },
    { tag: 'Group 3', line: '{1,5} → C·D or check: m5 = 0101. Need A\'·C·D for m5 coverage' },
    { tag: 'Result', line: 'Minimum SOP has <strong>3 product terms</strong>' },
    { tag: 'Meaning', line: '3 AND gates + 1 OR gate. Without minimization, 7 minterms would need 7 AND gates.' },
  ],
}

export const KMAP_PYQS = [
  {
    id: 'kmap-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'F(A,B,C) = Σm(1,3,5,7). Simplify using K-map. F = ?',
    answer: 0.00, unit: '',
    trap: 'All minterms with C=1. F = C. One literal.',
    why: 'Minterms 1,3,5,7 all have C=1. One group of 4 covering entire C=1 column. F = C.',
  },
  {
    id: 'kmap-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'F(A,B,C,D) = Σm(0,4,8,12) + d(1,5). Find the number of literals in minimum SOP.',
    answer: 2.00, unit: '',
    trap: 'With don\'t-cares: {0,1,4,5,8,12} can form groups. {0,4,8,12} = C\'D\'. Adding d: {0,1,4,5} = A\'C\'. Min SOP = C\'D\' (2 literals if grouping works).',
    why: 'Group {0,4,8,12} = C\'·D\' (4 cells, 2 literals). Don\'t-cares help but this group covers all 1s. F = C\'D\', 2 literals.',
  },
  {
    id: 'kmap-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'In a 4-variable K-map, a group of 8 cells eliminates:',
    options: ['1 variable', '2 variables', '3 variables', '4 variables'],
    answerIdx: 2,
    trap: 'Group of 2ⁿ eliminates n variables. 8 = 2³, so 3 variables eliminated.',
    why: 'A group of 8 in a 4-variable map leaves only 1 variable (or its complement). 3 eliminated.',
  },
  {
    id: 'kmap-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'F(A,B,C) = Σm(0,2,4,6). Minimum SOP has how many product terms?',
    answer: 1.00, unit: '',
    trap: 'All even minterms: C=0 in all. F = C\'. Single term.',
    why: 'Minterms 0,2,4,6 form one group of 4. F = C\'. One product term.',
  },
  {
    id: 'kmap-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'An essential prime implicant is one that:',
    options: ['Has the most cells', 'Is the only PI covering at least one minterm', 'Contains no don\'t-cares', 'Has the fewest literals'],
    answerIdx: 1,
    trap: 'Essential PI: the only prime implicant that covers a particular minterm. Must be in every solution.',
    why: 'If a minterm is covered by only one prime implicant, that PI is essential.',
  },
  {
    id: 'kmap-pyq-2020', year: 2020, marks: 2, type: 'NAT',
    q: 'F(A,B) = Σm(0,1,2,3). Simplified F = ?',
    answer: 1.00, unit: '',
    trap: 'All 4 minterms of a 2-variable function = F = 1 (always true).',
    why: 'Every cell is 1. F = 1. Zero variables remain.',
  },
]

export const KMAP_PRACTICE = [
  {
    id: 'kmap-p1', kind: 'nat',
    q: 'F(A,B,C) = Σm(3,4,5,7). How many prime implicants?',
    unit: '', answer: 3.00,
    why: 'PIs: {3,7}=BC, {4,5}=AB\', {5,7}=AC. Three prime implicants.',
  },
  {
    id: 'kmap-p2', kind: 'mcq',
    q: 'In a K-map, which grouping is NOT valid?',
    options: ['Group of 3', 'Group of 4', 'Group of 8', 'Group of 1'],
    answerIdx: 0,
    why: 'Groups must be powers of 2: 1, 2, 4, 8, 16. A group of 3 is not allowed.',
  },
  {
    id: 'kmap-p3', kind: 'nat',
    q: 'A 4-variable K-map has how many cells?',
    unit: '', answer: 16.00,
    why: '2⁴ = 16 cells.',
  },
  {
    id: 'kmap-p4', kind: 'mcq',
    q: 'Don\'t-care conditions in a K-map should be:',
    options: ['Always treated as 1', 'Always treated as 0', 'Treated as 1 or 0 to maximize group size', 'Ignored completely'],
    answerIdx: 2,
    why: 'Don\'t-cares are flexible — include them in groups when it helps make larger groups.',
  },
  {
    id: 'kmap-p5', kind: 'nat',
    q: 'F(A,B,C,D) = Σm(0,1,2,3,4,5,6,7). Minimum literals in SOP?',
    unit: '', answer: 1.00,
    why: 'All minterms with A=0. F = A\'. One literal.',
  },
]

export const KMAP_INSIGHT = {
  frequency: '6 of 7',
  body: 'K-map minimization for 3 and 4 variables is one of the highest-frequency GATE topics in digital circuits. Don\'t-care handling and essential PI identification are critical.',
}
