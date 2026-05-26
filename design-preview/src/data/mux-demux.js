export const MUX_THEORY = {
  eli10: {
    headline: 'Many inputs, one output. A switch that picks which one passes through.',
    body: [
      'Imagine a building with 4 security cameras but only 1 TV monitor. You cannot watch all 4 at once. So you have a switch — press button 0, you see camera 0. Press button 1, camera 1. That switch is a multiplexer (MUX).',
      'A 4:1 MUX has 4 data inputs (the cameras), 1 output (the monitor), and 2 select lines (the buttons). The select lines form a binary number that picks which input goes to the output. Select = 00 picks input 0. Select = 10 picks input 2.',
      'Why 2 select lines for 4 inputs? Because 2 bits can make 4 different values (00, 01, 10, 11). For 8 inputs you need 3 select lines (3 bits = 8 values). Pattern: n select lines handle 2 raised to n inputs.',
      'A demultiplexer (DEMUX) does the opposite — one input, many outputs. The select signal routes the single input to one specific output. Like one speaker broadcasting to one of 4 rooms.',
      'MUXes are everywhere inside chips. The A19 Pro uses them to pick which register to read, which operation to run, which data to store. GATE tests: find the output for given inputs, or build a Boolean function using a MUX.',
    ],
  },
  pullQuote: 'Many inputs, one output. A switch that picks which one passes through.',
  technical: [
    {
      h: 'MUX operation',
      body: 'A <span class="mono">2ⁿ:1 MUX</span> has 2ⁿ data inputs (I₀ to I₂ⁿ₋₁), n select lines (S), and 1 output (Y).<br/><br/><strong>2:1 MUX:</strong> Y = S\'·I₀ + S·I₁<br/><strong>4:1 MUX:</strong> Y = S₁\'S₀\'·I₀ + S₁\'S₀·I₁ + S₁S₀\'·I₂ + S₁S₀·I₃<br/><br/>A MUX implements any Boolean function by connecting minterms to data inputs.',
    },
    {
      h: 'Function implementation with MUX',
      body: '<strong>Direct method:</strong> Use a 2ⁿ:1 MUX for an n-variable function. Connect I_k = F(minterm k). Each minterm maps directly to a MUX input.<br/><strong>Reduced method:</strong> Use a 2ⁿ⁻¹:1 MUX. Connect the last variable (or its complement/0/1) to data inputs based on pairs of minterms. Saves one MUX level.',
    },
    {
      h: 'DEMUX and decoder',
      body: 'A <span class="mono">1:2ⁿ DEMUX</span> routes 1 input to one of 2ⁿ outputs based on select lines.<br/><br/>A <span class="mono">decoder</span> is a DEMUX with input fixed to 1. An n:2ⁿ decoder activates exactly one of 2ⁿ outputs.<br/><br/>Decoders can implement any function: OR the outputs corresponding to minterms.',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Implementing a Boolean function using an 8:1 or 4:1 MUX (most common, 2-mark). MUX tree design. MUX output expression. Decoder + OR gate implementation. DEMUX enable/select behavior. Cascading smaller MUXes.',
    },
  ],
  realWorld: [
    { k: 'Register file', v: 'ARM register file in A19 Pro uses 32:1 MUX trees to select source operands' },
    { k: 'Data bus', v: 'On-chip interconnect uses MUXes to route data between CPU, GPU, and memory' },
    { k: 'ALU input', v: 'MUX selects between register value, immediate value, or forwarded result' },
    { k: 'Clock MUX', v: 'Glitch-free clock MUX selects between PLL outputs for dynamic frequency scaling' },
    { k: 'Test MUX', v: 'Scan chain MUXes switch between normal operation and test mode' },
    { k: 'Memory address', v: 'Address DEMUX selects which memory bank/row to activate — 1 of millions' },
    { k: 'I/O routing', v: 'Pin MUX assigns multiple functions to limited physical pins on the chip package' },
  ],
  formulas: [
    { name: '2:1 MUX', eq: 'Y = S\'·I₀ + S·I₁', when: 'basic MUX operation', stars: 5 },
    { name: '4:1 MUX', eq: 'Y = Σ(mᵢ · Iᵢ) for i = 0 to 3', when: 'select lines decode to minterms', stars: 5 },
    { name: 'MUX inputs needed', eq: '2ⁿ inputs for n select lines', when: 'sizing a MUX', stars: 4 },
    { name: 'Function via MUX', eq: 'Connect Iₖ = F(minterm k)', when: 'implementing any Boolean function', stars: 5 },
    { name: 'Reduced MUX', eq: 'n-var function → 2ⁿ⁻¹:1 MUX + last variable on inputs', when: 'saving one MUX level', stars: 4 },
    { name: 'Decoder', eq: 'n:2ⁿ decoder = DEMUX with input = 1', when: 'minterm generator', stars: 4 },
  ],
}

export const MUX_LAB = {
  title: 'A19 Pro · ALU operand selector',
  narrative: 'The A19 Pro\'s ALU needs a 4:1 MUX to select the second operand. Inputs: I₀ = register value, I₁ = immediate, I₂ = forwarded result, I₃ = zero. With select S₁S₀ = 10, which operand reaches the ALU?',
  params: [
    { label: 'MUX type', value: '4:1 MUX' },
    { label: 'I₀', value: 'Register value' },
    { label: 'I₁', value: 'Immediate value' },
    { label: 'I₂', value: 'Forwarded result' },
    { label: 'I₃', value: 'Zero' },
    { label: 'Select', value: 'S₁S₀ = 10 (decimal 2)' },
  ],
  correctAnswer: 2.00,
  tolerance: 0.05,
  answerLabel: 'Input #',
  unit: '',
  hint: 'S₁S₀ = 10 in binary = 2 in decimal. Which input has index 2?',
  solution: [
    { tag: 'Select decode', line: 'S₁S₀ = 10 → decimal 2' },
    { tag: 'MUX behavior', line: 'Y = I₂ when select = 2' },
    { tag: 'Result', line: 'Output = I₂ = <strong>Forwarded result</strong> (input #2)' },
    { tag: 'Expression', line: 'Y = S₁\'S₀\'·I₀ + S₁\'S₀·I₁ + S₁S₀\'·I₂ + S₁S₀·I₃. Only S₁S₀\' = 1·1 = 1' },
    { tag: 'Meaning', line: 'Data forwarding: the ALU uses a result computed one cycle ago, avoiding a pipeline stall.' },
  ],
}

export const MUX_PYQS = [
  {
    id: 'mux-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'An 8:1 MUX implements F(A,B,C) = Σm(1,2,6,7). I₀ through I₇ are connected to 0 or 1. How many inputs are connected to 1?',
    answer: 4.00, unit: '',
    trap: 'Minterms 1,2,6,7 get I = 1. All others get I = 0. Four inputs connected to 1.',
    why: 'I₁=1, I₂=1, I₆=1, I₇=1. Others = 0. Four inputs are 1.',
  },
  {
    id: 'mux-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'How many 2:1 MUXes are needed to build a 16:1 MUX?',
    answer: 15.00, unit: '',
    trap: 'Tree structure: 8 + 4 + 2 + 1 = 15. Or formula: 2ⁿ − 1 for n levels. 16:1 = 4 levels.',
    why: '16:1 from 2:1: first level 8 MUXes, second 4, third 2, fourth 1. Total = 15.',
  },
  {
    id: 'mux-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'A 4:1 MUX has how many select lines?',
    options: ['1', '2', '3', '4'],
    answerIdx: 1,
    trap: '4 = 2², so 2 select lines. log₂(4) = 2.',
    why: '2ⁿ:1 MUX needs n select lines. 4:1 → n = 2.',
  },
  {
    id: 'mux-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'A 3:8 decoder has how many AND gates internally?',
    answer: 8.00, unit: '',
    trap: 'A 3:8 decoder has 8 output lines, each driven by a 3-input AND gate.',
    why: '3:8 decoder generates all 8 minterms of 3 variables. One AND gate per output = 8.',
  },
  {
    id: 'mux-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'A DEMUX with 1 input and 3 select lines has:',
    options: ['3 outputs', '6 outputs', '8 outputs', '16 outputs'],
    answerIdx: 2,
    trap: '3 select lines → 2³ = 8 outputs.',
    why: '1:2ⁿ DEMUX with n = 3 select lines has 2³ = 8 outputs.',
  },
  {
    id: 'mux-pyq-2020', year: 2020, marks: 2, type: 'NAT',
    q: 'Implement F(A,B) = Σm(1,3) using a 2:1 MUX with A as select. I₀ = ?, I₁ = ?',
    answer: 0.00, unit: '',
    trap: 'A=0: F(0,B) has m1 (B=1) → I₀ = B. A=1: F(1,B) has m3 (B=1) → I₁ = B. Both inputs = B.',
    why: 'When A=0: minterms 0(F=0),1(F=1) → depends on B → I₀ = B. When A=1: minterms 2(F=0),3(F=1) → I₁ = B.',
  },
]

export const MUX_PRACTICE = [
  {
    id: 'mux-p1', kind: 'mcq',
    q: 'A MUX is fundamentally a:',
    options: ['Data selector', 'Data generator', 'Memory element', 'Arithmetic unit'],
    answerIdx: 0,
    why: 'A MUX selects one of many inputs to pass to the output based on select lines.',
  },
  {
    id: 'mux-p2', kind: 'nat',
    q: 'An 8:1 MUX needs how many select lines?',
    unit: '', answer: 3.00,
    why: '8 = 2³. Need 3 select lines. log₂(8) = 3.',
  },
  {
    id: 'mux-p3', kind: 'mcq',
    q: 'To implement a 4-variable function, the minimum MUX size using the reduced method is:',
    options: ['16:1', '8:1', '4:1', '2:1'],
    answerIdx: 1,
    why: 'Reduced method: n-variable function uses 2ⁿ⁻¹:1 MUX. 4 variables → 8:1 MUX.',
  },
  {
    id: 'mux-p4', kind: 'mcq',
    q: 'A decoder can implement any Boolean function when combined with:',
    options: ['AND gates', 'OR gate', 'XOR gates', 'NOT gates'],
    answerIdx: 1,
    why: 'Decoder generates minterms. OR the minterms where F=1 to implement any function.',
  },
  {
    id: 'mux-p5', kind: 'nat',
    q: 'A 4:1 MUX with S₁S₀=01. Output Y = I₁. If I₁ = 1, Y = ?',
    unit: '', answer: 1.00,
    why: 'Select 01 = decimal 1. Y = I₁ = 1.',
  },
]

export const MUX_INSIGHT = {
  frequency: '5 of 7',
  body: 'MUX-based function implementation is a GATE favorite. The reduced method (n-1 select lines) and MUX tree construction are commonly tested.',
}
