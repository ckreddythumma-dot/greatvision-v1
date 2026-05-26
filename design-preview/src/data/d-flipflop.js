export const DFF_THEORY = {
  eli10: {
    headline: 'A tiny memory. It remembers one bit — on command.',
    body: [
      'Imagine a camera. You see a scene through the viewfinder (that is the D input). Nothing is saved yet — you are just looking. The moment you press the shutter button (that is the clock), the camera captures exactly what is in front of it. After that, the photo (Q, the output) stays frozen — even if the scene changes.',
      'A D flip-flop works exactly like this. It has one data input (D), one clock input (CLK), and one output (Q). Most of the time, Q holds its old value and ignores D. Only at the rising edge of the clock (the instant CLK jumps from 0 to 1), Q captures whatever D is.',
      'Between clock edges, D can change as much as it wants — Q stays frozen. This is what makes it memory. Without this, digital circuits could never store or remember anything.',
      'A register in your phone is just 64 flip-flops side by side, each storing one bit. All 64 update together on the same clock edge. The A19 Pro has millions of flip-flops holding the entire processor state.',
      'GATE tests timing diagrams (given CLK and D waveforms, draw Q), setup time (D must be stable before the clock edge), hold time (D must stay stable briefly after), and state machines built from flip-flops.',
    ],
  },
  pullQuote: 'A tiny memory. It remembers one bit — on command.',
  technical: [
    {
      h: 'D flip-flop operation',
      body: '<strong>Characteristic equation:</strong> Q(next) = D.<br/>On the rising edge of CLK: Q takes the value of D. Q\' takes the complement.<br/>Between edges: Q holds its previous value regardless of D changes.<br/><br/><strong>Truth table:</strong><br/>CLK↑, D=0 → Q=0<br/>CLK↑, D=1 → Q=1<br/>No edge → Q unchanged',
    },
    {
      h: 'Timing parameters',
      body: '<span class="mono">t_setup</span> — D must be stable this long BEFORE the clock edge.<br/><span class="mono">t_hold</span> — D must remain stable this long AFTER the clock edge.<br/><span class="mono">t_clk-to-Q</span> — delay from clock edge to output Q changing.<br/><br/>If setup or hold is violated, the flip-flop enters a <em>metastable</em> state — output is neither 0 nor 1. This can cause catastrophic system failures.',
    },
    {
      h: 'Other flip-flop types',
      body: '<strong>SR flip-flop:</strong> Set (S=1→Q=1) and Reset (R=1→Q=0). S=R=1 is invalid.<br/><strong>JK flip-flop:</strong> Like SR but J=K=1 toggles output. No invalid state.<br/><strong>T flip-flop:</strong> Toggle. T=1 flips Q; T=0 holds. Q(next) = T⊕Q.<br/><br/>All can be built from D flip-flops with external logic.',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Timing diagram interpretation (most common). Setup/hold time calculation for a given circuit. Maximum clock frequency = 1/(t_clk-Q + t_comb + t_setup). Excitation tables for SR, JK, T flip-flops. Converting between flip-flop types. State machines using D flip-flops.',
    },
  ],
  realWorld: [
    { k: 'Pipeline registers', v: 'A19 Pro\'s CPU pipeline: each stage separated by flip-flop banks — ~15 pipeline stages' },
    { k: 'Register file', v: '31 general-purpose registers × 64 bits = 1,984 D flip-flops just for integer state' },
    { k: 'Cache tags', v: 'L1 cache tag array: thousands of flip-flops storing address tags for fast lookup' },
    { k: 'Clock frequency', v: 'Max f_clk limited by t_clk-Q + t_logic + t_setup along the critical path' },
    { k: 'Metastability', v: 'Synchronizer flip-flops at clock domain crossings — two stages to reduce failure rate' },
    { k: 'Scan chains', v: 'Every flip-flop has a test MUX — can shift test patterns through the entire chip' },
    { k: 'Power gating', v: 'Retention flip-flops preserve state when a power domain is turned off in sleep mode' },
  ],
  formulas: [
    { name: 'D FF characteristic', eq: 'Q(next) = D', when: 'at every active clock edge', stars: 5 },
    { name: 'Max clock frequency', eq: 'f_max = 1 / (t_clk-Q + t_comb + t_setup)', when: 'timing analysis of synchronous circuit', stars: 5 },
    { name: 'T FF characteristic', eq: 'Q(next) = T ⊕ Q', when: 'T=1 toggles, T=0 holds', stars: 4 },
    { name: 'JK FF characteristic', eq: 'Q(next) = J·Q\' + K\'·Q', when: 'J=K=1 toggles, covers SR behavior', stars: 4 },
    { name: 'Setup slack', eq: 'slack = T_clk − (t_clk-Q + t_comb + t_setup)', when: 'positive slack = timing met', stars: 4 },
    { name: 'Hold check', eq: 't_clk-Q + t_comb > t_hold', when: 'data must not arrive too early at next FF', stars: 3 },
  ],
}

export const DFF_LAB = {
  title: 'A19 Pro · pipeline timing closure',
  narrative: 'You are checking if the A19 Pro\'s integer pipeline meets timing at 3.78 GHz. The flip-flop has t_clk-Q = 30 ps and t_setup = 40 ps. The combinational logic delay between pipeline stages is 180 ps. Does the circuit meet timing?',
  params: [
    { label: 'Clock frequency', value: '3.78 GHz' },
    { label: 'Clock period', value: 'T = 1/3.78G ≈ 264.6 ps' },
    { label: 't_clk-Q', value: '30 ps' },
    { label: 't_setup', value: '40 ps' },
    { label: 't_comb', value: '180 ps' },
    { label: 'Required', value: 'Timing slack in ps' },
  ],
  correctAnswer: 14.60,
  tolerance: 0.50,
  answerLabel: 'Slack',
  unit: 'ps',
  hint: 'Slack = T_clk − (t_clk-Q + t_comb + t_setup) = 264.6 − (30 + 180 + 40).',
  solution: [
    { tag: 'Period', line: 'T = 1/f = 1/3.78×10⁹ = 264.6 ps' },
    { tag: 'Path delay', line: 't_path = t_clk-Q + t_comb + t_setup = 30 + 180 + 40 = 250 ps' },
    { tag: 'Slack', line: 'Slack = T − t_path = 264.6 − 250 = <strong>14.6 ps</strong>' },
    { tag: 'Result', line: 'Slack > 0 → timing met. But only 14.6 ps margin — very tight.' },
    { tag: 'Meaning', line: 'At 3.78 GHz, the pipeline barely meets timing. Any voltage/temperature variation could cause failure — PVT corners must be checked.' },
  ],
}

export const DFF_PYQS = [
  {
    id: 'dff-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'A circuit has t_clk-Q = 50ps, t_setup = 60ps, t_comb = 200ps. Max clock frequency in GHz? (2dp)',
    answer: 3.23, unit: 'GHz',
    trap: 'T_min = 50+200+60 = 310 ps. f_max = 1/310ps = 3.23 GHz.',
    why: 'f_max = 1/(t_clk-Q + t_comb + t_setup) = 1/310×10⁻¹² = 3.23 GHz.',
  },
  {
    id: 'dff-pyq-2024', year: 2024, marks: 1, type: 'MCQ',
    q: 'A D flip-flop with D tied to Q\' behaves as:',
    options: ['A latch', 'A T flip-flop with T=1', 'A buffer', 'An SR flip-flop'],
    answerIdx: 1,
    trap: 'Q(next) = D = Q\'. This means Q toggles every clock edge = T FF with T=1 = divide-by-2.',
    why: 'D = Q\' means Q(next) = Q\' → toggle every cycle. This is a T flip-flop with T permanently 1.',
  },
  {
    id: 'dff-pyq-2023', year: 2023, marks: 2, type: 'NAT',
    q: 'A 4-bit synchronous counter uses D flip-flops. How many flip-flops?',
    answer: 4.00, unit: '',
    trap: 'n-bit counter needs n flip-flops. 4-bit → 4 flip-flops.',
    why: 'Each bit of the counter state needs one flip-flop. 4 bits = 4 D flip-flops.',
  },
  {
    id: 'dff-pyq-2022', year: 2022, marks: 1, type: 'MCQ',
    q: 'Metastability in a flip-flop occurs when:',
    options: ['Clock frequency is too low', 'Setup or hold time is violated', 'D input is always 0', 'Power supply drops'],
    answerIdx: 1,
    trap: 'Metastability: flip-flop cannot decide 0 or 1 because data changed too close to clock edge.',
    why: 'Setup/hold violation means D was changing during the forbidden window around the clock edge.',
  },
  {
    id: 'dff-pyq-2021', year: 2021, marks: 2, type: 'NAT',
    q: 'JK flip-flop: J=1, K=1, current Q=0. After one clock edge, Q = ?',
    answer: 1.00, unit: '',
    trap: 'J=K=1 → toggle. Q was 0, becomes 1.',
    why: 'Q(next) = J·Q\' + K\'·Q = 1·1 + 0·0 = 1. Or simply: J=K=1 toggles Q.',
  },
  {
    id: 'dff-pyq-2020', year: 2020, marks: 1, type: 'MCQ',
    q: 'The output of a D latch vs D flip-flop:',
    options: ['Latch is edge-triggered, FF is level-sensitive', 'Latch is level-sensitive, FF is edge-triggered', 'Both are edge-triggered', 'Both are level-sensitive'],
    answerIdx: 1,
    trap: 'Latch = transparent when enable is high (level). Flip-flop = captures only on edge.',
    why: 'D latch: Q follows D while CLK=1 (level-sensitive). D FF: Q updates only on CLK edge.',
  },
]

export const DFF_PRACTICE = [
  {
    id: 'dff-p1', kind: 'mcq',
    q: 'D flip-flop characteristic equation Q(next) = ?',
    options: ['D', 'D ⊕ Q', 'D · Q', 'D + Q'],
    answerIdx: 0,
    why: 'Q(next) = D. The simplest flip-flop — output equals input at clock edge.',
  },
  {
    id: 'dff-p2', kind: 'nat',
    q: 'Clock period = 500ps. t_clk-Q = 80ps, t_setup = 70ps. Max combinational delay? (ps)',
    unit: 'ps', answer: 350.00,
    why: 't_comb_max = T − t_clk-Q − t_setup = 500 − 80 − 70 = 350 ps.',
  },
  {
    id: 'dff-p3', kind: 'mcq',
    q: 'How many D flip-flops to store one ASCII character (8 bits)?',
    options: ['4', '7', '8', '16'],
    answerIdx: 2,
    why: '8-bit ASCII needs 8 flip-flops, one per bit.',
  },
  {
    id: 'dff-p4', kind: 'mcq',
    q: 'T flip-flop with T=0 does what?',
    options: ['Toggles Q', 'Resets Q to 0', 'Holds Q unchanged', 'Sets Q to 1'],
    answerIdx: 2,
    why: 'T=0: Q(next) = 0⊕Q = Q. Output holds its current value.',
  },
  {
    id: 'dff-p5', kind: 'nat',
    q: 'A ring counter with 5 flip-flops has how many unique states?',
    unit: '', answer: 5.00,
    why: 'Ring counter: one \'1\' circulates through n flip-flops. n states for n flip-flops.',
  },
]

export const DFF_INSIGHT = {
  frequency: '6 of 7',
  body: 'Timing analysis (f_max calculation) and flip-flop characteristic equations are the most tested. Setup/hold concepts and timing diagrams appear in almost every GATE paper.',
}
