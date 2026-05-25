export const COUNTER_THEORY = {
  eli10: {
    headline: 'Count up, count down, count to any number. Flip-flops in sequence.',
    body: [
      'A counter is a group of flip-flops connected so that on each clock pulse, the stored number increases (or decreases) by one.',
      'A 3-bit counter counts from 000 to 111 (0 to 7), then wraps back to 000. That is 8 states, cycling forever. Like an odometer that rolls over.',
      'Synchronous counters update all flip-flops at the same clock edge — faster and cleaner. Asynchronous (ripple) counters chain flip-flops — each one triggers the next. Simpler but slower because of accumulated delays.',
      'A modulo-N counter counts from 0 to N-1. A mod-10 counter counts 0 to 9 — used in digital clocks and decimal displays.',
      'GATE tests state diagrams, counting sequences, and the design of mod-N counters from flip-flops.',
    ],
  },
  pullQuote: 'Count up, count down, count to any number. Flip-flops in sequence.',
  technical: [
    {
      h: 'Types of counters',
      body: '<strong>Ripple (asynchronous):</strong> Each FF\'s output clocks the next. Simple but slow — total delay = n × t_clk-Q.<br/><strong>Synchronous:</strong> All FFs share the same clock. Combinational logic determines next state. Faster — delay = t_clk-Q + t_logic.<br/><strong>Ring counter:</strong> Circulating \'1\'. n FFs → n states. Simple but uses many FFs.<br/><strong>Johnson counter:</strong> Twisted ring. n FFs → 2n states.',
    },
    {
      h: 'Binary counter design',
      body: 'An n-bit binary up-counter using T flip-flops:<br/>T₀ = 1 (always toggles, LSB).<br/>T₁ = Q₀ (toggles when Q₀ = 1).<br/>T₂ = Q₀·Q₁.<br/>General: Tₖ = Q₀·Q₁·...·Qₖ₋₁.<br/><br/>For a down-counter, use Q\' instead of Q in the toggle conditions.',
    },
    {
      h: 'Modulo-N counters',
      body: 'Count 0 to N-1, then reset. Two approaches:<br/><strong>External reset:</strong> Use a natural binary counter + AND gate to detect state N. On detection, force all FFs to 0.<br/><strong>State machine:</strong> Design a custom state table with exactly N states and implement with D/JK FFs.<br/><br/>Common: Mod-10 (BCD counter), Mod-6 (seconds/minutes), Mod-12 (hours).',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Counting sequence from a given circuit (most common). Number of flip-flops needed for mod-N counter: ⌈log₂N⌉. Ripple counter timing analysis. Synchronous counter state table and excitation. Ring vs Johnson: states and decoding. Frequency divider circuits.',
    },
  ],
  realWorld: [
    { k: 'Program counter', v: 'The PC in the A19 Pro\'s CPU increments by 4 every cycle — a 64-bit up-counter' },
    { k: 'Timer/watchdog', v: 'Hardware timers count clock cycles — trigger interrupts or reset on overflow' },
    { k: 'Clock divider', v: 'Divide 3.78 GHz down to MHz for slower peripherals using counter chains' },
    { k: 'Performance counters', v: 'Count cache misses, branch mispredictions — hardware profiling counters' },
    { k: 'Refresh counter', v: 'DRAM refresh address counter — cycles through all rows periodically' },
    { k: 'USB frame count', v: 'USB controller counts 1ms frames for isochronous timing' },
    { k: 'PWM generation', v: 'Counter + comparator generates precise duty cycle waveforms for display backlight' },
  ],
  formulas: [
    { name: 'FFs for mod-N', eq: 'n = ⌈log₂(N)⌉', when: 'minimum flip-flops to represent N states', stars: 5 },
    { name: 'Ripple counter delay', eq: 't_total = n × t_clk-Q', when: 'worst-case delay of n-bit ripple counter', stars: 4 },
    { name: 'T FF toggle rule', eq: 'Tₖ = Q₀ · Q₁ · ... · Qₖ₋₁', when: 'synchronous binary up-counter', stars: 5 },
    { name: 'Ring counter states', eq: 'States = n (for n FFs)', when: 'ring counter — one hot encoding', stars: 4 },
    { name: 'Johnson counter states', eq: 'States = 2n (for n FFs)', when: 'twisted ring counter', stars: 4 },
    { name: 'Max ripple frequency', eq: 'f_max = 1 / (n × t_clk-Q)', when: 'maximum clock for n-bit ripple counter', stars: 3 },
  ],
}

export const COUNTER_LAB = {
  title: 'A19 Pro · clock divider design',
  narrative: 'You need to divide the A19 Pro\'s 3.78 GHz clock down to ~473 MHz for the memory controller. This requires a divide-by-8 (mod-8) counter. How many D flip-flops do you need?',
  params: [
    { label: 'Input clock', value: '3.78 GHz' },
    { label: 'Target output', value: '~473 MHz (÷8)' },
    { label: 'Counter type', value: 'Mod-8 binary counter' },
    { label: 'Formula', value: 'n = ⌈log₂(N)⌉' },
    { label: 'N', value: '8' },
    { label: 'Required', value: 'Number of flip-flops' },
  ],
  correctAnswer: 3.00,
  tolerance: 0.05,
  answerLabel: 'FFs',
  unit: '',
  hint: 'log₂(8) = 3. A 3-bit counter counts 0-7 (8 states).',
  solution: [
    { tag: 'Formula', line: 'n = ⌈log₂(N)⌉ = ⌈log₂(8)⌉ = 3' },
    { tag: 'States', line: '3 FFs → 2³ = 8 states (000 to 111)' },
    { tag: 'Result', line: '<strong>3 flip-flops</strong>' },
    { tag: 'Output', line: 'MSB (Q₂) toggles at f_in/8 = 3.78/8 = 472.5 MHz' },
    { tag: 'Meaning', line: '3 flip-flops create a ÷8 prescaler. The MSB output is a 50% duty cycle square wave at 472.5 MHz.' },
  ],
}

export const COUNTER_PYQS = [
  {
    id: 'ctr-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'A mod-12 counter needs minimum how many flip-flops?',
    answer: 4.00, unit: '',
    trap: '⌈log₂(12)⌉ = ⌈3.58⌉ = 4. Three FFs only give 8 states, not enough.',
    why: 'log₂(12) = 3.58. Ceiling = 4. Need 4 flip-flops (16 states, detect and reset at 12).',
  },
  {
    id: 'ctr-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'A 4-bit ripple counter with t_clk-Q = 15ns per stage. Max total delay in ns?',
    answer: 60.00, unit: 'ns',
    trap: 't_total = 4 × 15 = 60 ns. This limits max clock frequency.',
    why: 'Ripple delay = n × t_clk-Q = 4 × 15 = 60 ns.',
  },
  {
    id: 'ctr-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'A Johnson counter with 4 flip-flops has how many valid states?',
    options: ['4', '8', '16', '2'],
    answerIdx: 1,
    trap: 'Johnson counter: 2n states for n FFs. 4 FFs → 8 states.',
    why: 'Johnson (twisted ring) counter: 2 × n = 2 × 4 = 8 valid states.',
  },
  {
    id: 'ctr-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'A 3-bit synchronous up-counter starts at 5 (101). After 6 clock pulses, output = ? (decimal)',
    answer: 3.00, unit: '',
    trap: '5→6→7→0→1→2→3. After 6 pulses from 5: 3-bit wraps at 8. (5+6) mod 8 = 3.',
    why: '(5 + 6) mod 8 = 11 mod 8 = 3.',
  },
  {
    id: 'ctr-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'In a ring counter, the number of valid states equals:',
    options: ['2ⁿ', 'n', '2n', 'n²'],
    answerIdx: 1,
    trap: 'Ring counter: exactly n states for n flip-flops (one-hot encoding).',
    why: 'A ring counter circulates a single 1 through n positions → n unique states.',
  },
  {
    id: 'ctr-pyq-2020', year: 2020, marks: 2, type: 'NAT',
    q: 'A divide-by-16 counter requires how many T flip-flops?',
    answer: 4.00, unit: '',
    trap: 'log₂(16) = 4. Four flip-flops.',
    why: '⌈log₂(16)⌉ = 4 flip-flops.',
  },
]

export const COUNTER_PRACTICE = [
  {
    id: 'ctr-p1', kind: 'nat',
    q: 'A mod-5 counter needs how many flip-flops?',
    unit: '', answer: 3.00,
    why: '⌈log₂(5)⌉ = ⌈2.32⌉ = 3 flip-flops.',
  },
  {
    id: 'ctr-p2', kind: 'mcq',
    q: 'Advantage of synchronous over ripple counter:',
    options: ['Uses fewer flip-flops', 'Faster — no accumulated propagation delay', 'Simpler design', 'Needs no clock'],
    answerIdx: 1,
    why: 'Synchronous: all FFs clock together. Delay = one FF delay + logic. Ripple: delay accumulates.',
  },
  {
    id: 'ctr-p3', kind: 'nat',
    q: 'A 4-bit up-counter at state 1111. Next state?',
    unit: '', answer: 0.00,
    why: '1111 + 1 = 10000. 4-bit overflow → wraps to 0000 = 0.',
  },
  {
    id: 'ctr-p4', kind: 'mcq',
    q: 'BCD counter is a:',
    options: ['Mod-8 counter', 'Mod-10 counter', 'Mod-16 counter', 'Mod-12 counter'],
    answerIdx: 1,
    why: 'BCD = Binary Coded Decimal. Counts 0-9 (10 states) then resets. Mod-10.',
  },
  {
    id: 'ctr-p5', kind: 'nat',
    q: 'Ring counter with 8 FFs needs how many decoding gates for state detection?',
    unit: '', answer: 0.00,
    why: 'Ring counter states are one-hot — each state has exactly one FF high. No decoding needed (0 gates).',
  },
]

export const COUNTER_INSIGHT = {
  frequency: '5 of 7',
  body: 'Mod-N counter design and flip-flop count calculation appear frequently. Ripple vs synchronous comparison and counting sequence analysis are common.',
}
