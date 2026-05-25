export const BJT_THEORY = {
  eli10: {
    headline: 'Small current in, big current out. That is amplification.',
    body: [
      'A BJT is a current amplifier — a tiny current in, a big current out.',
      'Imagine a lever. You press one end with your finger — a small force. The other end lifts a heavy weight — a large force. The lever multiplies your effort. The ratio depends on where the fulcrum sits.',
      'A BJT works the same way with current. A small base current I_B controls a large collector current I_C. The multiplication factor is β (beta), typically 50–300. Push 10 μA into the base, get 1 mA out of the collector.',
      'Three things can happen: the transistor is OFF (cutoff — no current), it is amplifying (active — I_C = β × I_B), or it is fully ON like a closed switch (saturation — V_CE drops to ~0.2V).',
      'The BJT was the first practical transistor. Every analog circuit — amplifiers, references, current mirrors — traces back to this device.',
    ],
  },
  pullQuote: 'Small current in, big current out. That is amplification.',
  technical: [
    {
      h: 'Structure — three layers, two junctions',
      body: 'An npn BJT has three doped regions: <em>emitter</em> (n+, heavily doped), <em>base</em> (p, thin and lightly doped), and <em>collector</em> (n, moderately doped). Two PN junctions form: base-emitter (BE) and base-collector (BC).<br/><br/>The base must be thin — electrons injected from the emitter can diffuse across it and reach the collector before recombining. Thinner base = higher gain.',
    },
    {
      h: 'Key parameters',
      body: '<span class="mono">β</span> (or h<sub>FE</sub>) — common-emitter current gain = I<sub>C</sub>/I<sub>B</sub>, typically 50–300.<br/><span class="mono">α</span> — common-base current gain = I<sub>C</sub>/I<sub>E</sub> = β/(β+1), close to 1.<br/><span class="mono">V<sub>BE(on)</sub></span> — turn-on voltage ≈ 0.7 V for silicon.<br/><span class="mono">V<sub>CE(sat)</sub></span> — saturation voltage ≈ 0.2 V.<br/><span class="mono">I<sub>C</sub></span> = β · I<sub>B</sub> in active region.<br/><span class="mono">I<sub>E</sub></span> = I<sub>C</sub> + I<sub>B</sub> (KCL at the transistor).',
    },
    {
      h: 'Three operating regions',
      body: '<strong>Cutoff</strong> — V<sub>BE</sub> < V<sub>BE(on)</sub>. Both junctions reverse biased. I<sub>C</sub> = 0. Transistor is OFF.<br/><strong>Active (Forward Active)</strong> — V<sub>BE</sub> > V<sub>BE(on)</sub>, V<sub>CE</sub> > V<sub>CE(sat)</sub>. BE forward biased, BC reverse biased. I<sub>C</sub> = β × I<sub>B</sub>. This is the amplification region.<br/><strong>Saturation</strong> — Both junctions forward biased. V<sub>CE</sub> drops to V<sub>CE(sat)</sub> ≈ 0.2V. I<sub>C</sub> < β × I<sub>B</sub> (limited by external circuit). Transistor is a closed switch.',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Q-point calculation (most common, 2-mark NAT): given V<sub>CC</sub>, R<sub>C</sub>, R<sub>B</sub>, β, find I<sub>C</sub> and V<sub>CE</sub>. Region identification from given voltages. Current relationships I<sub>C</sub> = β·I<sub>B</sub> and I<sub>E</sub> = I<sub>C</sub> + I<sub>B</sub>. Hybrid-π small-signal model parameters: g<sub>m</sub> = I<sub>C</sub>/V<sub>T</sub>, r<sub>π</sub> = β/g<sub>m</sub>.<br/><br/>Ebers-Moll model and Early effect appear occasionally as 1-mark conceptual MCQs.',
    },
  ],
  realWorld: [
    { k: 'Bandgap reference', v: 'BJTs in the A19 Pro\'s PMIC generate a stable 1.2V reference — immune to temperature' },
    { k: 'Current mirrors', v: 'Matched BJT pairs copy currents precisely — bias generators for analog blocks' },
    { k: 'ESD protection', v: 'Parasitic BJTs in the substrate activate during ESD events — snapback protection' },
    { k: 'Temperature sensing', v: 'V_BE drops ~2 mV/°C — the chip monitors its own temperature via BJT sensors' },
    { k: 'Power management', v: 'Pass transistors and error amplifiers in the PMIC use BJTs for precision' },
    { k: 'Gain (β)', v: 'Typical β = 100–200 in integrated BJTs — process controlled, not user-selectable' },
    { k: 'Speed', v: 'SiGe HBTs in RF front-end achieve f_T > 300 GHz — faster than any MOSFET' },
  ],
  formulas: [
    { name: 'Collector current (active)', eq: 'I_C = β · I_B', when: 'forward active region (V_BE > 0.7V, V_CE > 0.2V)', stars: 5 },
    { name: 'Emitter current', eq: 'I_E = I_C + I_B = (β + 1) · I_B', when: 'always (KCL)', stars: 5 },
    { name: 'α and β relationship', eq: 'α = β / (β + 1), β = α / (1 − α)', when: 'converting between CB and CE gains', stars: 4 },
    { name: 'Transconductance g_m', eq: 'g_m = I_C / V_T', when: 'small-signal model at Q-point', stars: 4 },
    { name: 'Input resistance r_π', eq: 'r_π = β / g_m = β · V_T / I_C', when: 'hybrid-π small-signal model', stars: 3 },
    { name: 'Ebers-Moll (simplified)', eq: 'I_C = I_S · (e^(V_BE/V_T) − 1)', when: 'active region, exponential I-V', stars: 3 },
  ],
}

export const BJT_LAB = {
  title: 'A19 Pro · bandgap reference bias',
  narrative: 'You are designing the bandgap voltage reference in the A19 Pro\'s power management IC. The reference must produce a stable 1.2V regardless of temperature. Your first task: calculate the collector current I_C at the Q-point of the reference BJT to verify it is in the active region.',
  params: [
    { label: 'Circuit', value: 'Fixed-bias npn BJT' },
    { label: 'Supply V_CC', value: '5 V' },
    { label: 'Collector resistor R_C', value: '2 kΩ' },
    { label: 'Base resistor R_B', value: '430 kΩ' },
    { label: 'Current gain β', value: '100' },
    { label: 'V_BE(on)', value: '0.7 V' },
  ],
  correctAnswer: 1.00,
  tolerance: 0.05,
  answerLabel: 'I_C',
  unit: 'mA',
  hint: 'First find I_B = (V_CC − V_BE) / R_B. Then I_C = β × I_B.',
  solution: [
    { tag: 'Base current', line: 'I<sub>B</sub> = (V<sub>CC</sub> − V<sub>BE</sub>) / R<sub>B</sub> = (5 − 0.7) / 430k' },
    { tag: 'Compute', line: 'I<sub>B</sub> = 4.3 / 430,000 = 10 μA' },
    { tag: 'Collector', line: 'I<sub>C</sub> = β × I<sub>B</sub> = 100 × 10 μA = <strong>1.00 mA</strong>' },
    { tag: 'Verify region', line: 'V<sub>CE</sub> = V<sub>CC</sub> − I<sub>C</sub>·R<sub>C</sub> = 5 − 1.0×2 = 3.0 V > 0.2 V → active' },
    { tag: 'Meaning', line: 'The BJT operates at I<sub>C</sub> = 1 mA in the active region. V<sub>CE</sub> = 3.0 V gives plenty of headroom for the reference circuit.' },
  ],
}

export const BJT_PYQS = [
  {
    id: 'bjt-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'An npn BJT has β = 100, V_CC = 10 V, R_C = 5 kΩ, R_B = 930 kΩ, V_BE(on) = 0.7 V. Find I_C in mA. (2 dp)',
    answer: 1.00, unit: 'mA',
    trap: 'Students sometimes forget to subtract V_BE from V_CC when calculating I_B.',
    why: 'I_B = (V_CC − V_BE) / R_B = (10 − 0.7) / 930k = 10 μA. I_C = β × I_B = 100 × 10 μA = 1.00 mA.',
  },
  {
    id: 'bjt-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'A BJT is in the active region. If β = 100, what is α?',
    options: ['0.99', '1.00', '100', '0.01'],
    answerIdx: 0,
    trap: 'α = β/(β+1) = 100/101 ≈ 0.99. Don\'t confuse α with β. α is always less than 1.',
    why: 'α = β / (β + 1) = 100 / 101 = 0.99. α is the common-base current gain, always < 1.',
  },
  {
    id: 'bjt-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'For a BJT with I_C = 1 mA at 300K, find g_m in mA/V. (V_T = 0.026 V, 2 dp)',
    answer: 38.46, unit: 'mA/V',
    trap: 'g_m = I_C / V_T. Make sure to keep units consistent.',
    why: 'g_m = I_C / V_T = 1 mA / 0.026 V = 38.46 mA/V.',
  },
  {
    id: 'bjt-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'In a saturated BJT, which statement is true?',
    options: ['Only BE junction is forward biased', 'Both BE and BC junctions are forward biased', 'Both junctions are reverse biased', 'Only BC junction is forward biased'],
    answerIdx: 1,
    trap: 'Saturation in BJT ≠ MOSFET saturation. In BJT saturation, BOTH junctions are forward biased.',
    why: 'BJT saturation = both junctions forward biased. Active = only BE forward. Cutoff = both reverse.',
  },
  {
    id: 'bjt-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'An npn BJT has β = 150 and I_E = 3.02 mA. Find I_B in μA. (2 dp)',
    answer: 20.00, unit: 'μA',
    trap: 'I_E = (β + 1) × I_B, so I_B = I_E / (β + 1). Don\'t use I_B = I_E / β.',
    why: 'I_E = (β + 1) × I_B. I_B = 3.02 / (150 + 1) = 3.02 / 151 = 20.00 μA.',
  },
  {
    id: 'bjt-pyq-2020', year: 2020, marks: 1, type: 'MCQ',
    q: 'The Early effect in a BJT causes:',
    options: ['I_C to decrease with increasing V_CE', 'I_C to increase slightly with increasing V_CE', 'V_BE to increase with temperature', 'β to become exactly 1'],
    answerIdx: 1,
    trap: 'Base width modulation: increasing V_CE widens BC depletion → narrows effective base → slightly more I_C.',
    why: 'The Early effect means I_C vs V_CE has a slight upward slope in active region. Modeled by r_o = V_A / I_C.',
  },
]

export const BJT_PRACTICE = [
  {
    id: 'bjt-p1', kind: 'mcq',
    q: 'An npn BJT has V_BE = 0.8V and V_CE = 0.15V. Which region is it in?',
    options: [
      'Cutoff — V_BE is too low',
      'Active — V_BE > 0.7V, so it must be active',
      'Saturation — V_CE < V_CE(sat), both junctions forward',
      'Reverse active — collector and emitter are swapped',
    ],
    answerIdx: 2,
    why: 'V_BE = 0.8V > 0.7V → BE forward. V_CE = 0.15V < 0.2V → V_BC = V_BE − V_CE = 0.65V > 0 → BC also forward. Both forward = saturation.',
  },
  {
    id: 'bjt-p2', kind: 'nat',
    q: 'β = 200, I_C = 2 mA. Find r_π in kΩ at 300K. (V_T = 0.026V, 2 dp)',
    unit: 'kΩ', answer: 2.60,
    why: 'g_m = I_C/V_T = 2/0.026 = 76.92 mA/V. r_π = β/g_m = 200/76.92 = 2.60 kΩ.',
  },
  {
    id: 'bjt-p3', kind: 'nat',
    q: 'V_CC = 12V, R_C = 4kΩ, I_C = 2 mA. Find V_CE in volts. (2 dp)',
    unit: 'V', answer: 4.00,
    why: 'V_CE = V_CC − I_C × R_C = 12 − 2 × 4 = 4.00 V.',
  },
  {
    id: 'bjt-p4', kind: 'mcq',
    q: 'Increasing β from 100 to 200 in a fixed-bias circuit will:',
    options: [
      'Double I_C and potentially push the BJT into saturation',
      'Have no effect since I_B is fixed by the circuit',
      'Halve I_C due to increased gain',
      'Only affect the emitter current, not I_C',
    ],
    answerIdx: 0,
    why: 'In fixed-bias, I_B = (V_CC − V_BE)/R_B is constant. I_C = β × I_B, so doubling β doubles I_C. May push V_CE below V_CE(sat).',
  },
  {
    id: 'bjt-p5', kind: 'nat',
    q: 'α = 0.98. Find β. (2 dp)',
    unit: '', answer: 49.00,
    why: 'β = α/(1−α) = 0.98/0.02 = 49.00.',
  },
]

export const BJT_INSIGHT = {
  frequency: '5 of 7',
  body: 'BJT Q-point calculation and region identification are staples of GATE ECE. The current gain relationships and small-signal parameters appear frequently.',
}
