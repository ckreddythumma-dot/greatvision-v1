export const AMP_THEORY = {
  eli10: {
    headline: 'Small signal in, big signal out. That is the amplifier.',
    body: [
      'A MOSFET amplifier is a volume knob for electrical signals.',
      'Imagine a stereo. You speak into a microphone — a tiny electrical signal. The amplifier boosts it, and the speaker blasts it out at full volume. The amplifier itself does not create energy — it uses power from the wall outlet to make a larger copy of your signal.',
      'A MOSFET amplifier does the same thing. A small AC signal on the gate produces a much larger AC signal at the drain. The amplification factor is called the voltage gain A_v. It depends on two things: how sensitive the MOSFET is to gate voltage (transconductance g_m) and how much load resistance (R_D) converts the amplified current back to voltage.',
      'More g_m or more R_D = more gain. But push too far and the output clips — like turning the volume knob past the speaker\'s limit.',
    ],
  },
  pullQuote: 'Small signal in, big signal out. That is the amplifier.',
  technical: [
    {
      h: 'Common-source amplifier — the workhorse',
      body: 'The common-source (CS) configuration is the most basic MOSFET amplifier. The gate is the input, the drain is the output, and the source is the common (ground) terminal.<br/><br/>The MOSFET must be biased in the <em>saturation region</em> (V<sub>DS</sub> > V<sub>GS</sub> − V<sub>t</sub>) for amplification. A DC bias sets the operating point (Q-point), and the AC signal rides on top.',
    },
    {
      h: 'Key parameters',
      body: '<span class="mono">g<sub>m</sub></span> — transconductance = k<sub>n</sub>(V<sub>GS</sub> − V<sub>t</sub>) = 2I<sub>D</sub>/(V<sub>GS</sub> − V<sub>t</sub>). Units: mA/V or mS.<br/><span class="mono">A<sub>v</sub></span> — voltage gain = −g<sub>m</sub> × R<sub>D</sub>. Negative sign means the output is inverted.<br/><span class="mono">r<sub>o</sub></span> — output resistance = 1/(λ·I<sub>D</sub>). Finite r<sub>o</sub> means gain is actually −g<sub>m</sub>(R<sub>D</sub> ∥ r<sub>o</sub>).<br/><span class="mono">V<sub>ov</sub></span> — overdrive voltage = V<sub>GS</sub> − V<sub>t</sub>. Larger V<sub>ov</sub> = more I<sub>D</sub> and g<sub>m</sub>.',
    },
    {
      h: 'Gain, bandwidth, and the trade-off',
      body: '<strong>More gain</strong> — increase g<sub>m</sub> (higher I<sub>D</sub> or wider W/L) or increase R<sub>D</sub>.<br/><strong>More bandwidth</strong> — reduce parasitic capacitances (smaller transistor) or reduce R<sub>D</sub>.<br/><strong>The trade-off</strong> — gain × bandwidth ≈ constant (gain-bandwidth product). You cannot maximize both. The A19 Pro\'s design team chooses the optimal point for each amplifier stage.',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'Voltage gain calculation A<sub>v</sub> = −g<sub>m</sub>R<sub>D</sub> (most common, 2-mark NAT). Transconductance g<sub>m</sub> = k<sub>n</sub>(V<sub>GS</sub> − V<sub>t</sub>). Q-point: find I<sub>D</sub> and V<sub>DS</sub> at the operating point. Small-signal equivalent circuit. Output resistance r<sub>o</sub> = 1/(λI<sub>D</sub>).<br/><br/>Multi-stage gain and source-degeneration appear as 2-mark problems.',
    },
  ],
  realWorld: [
    { k: 'Audio codec', v: 'CS amplifiers in the DAC output stage — drive headphone signals from digital-to-analog' },
    { k: 'ADC driver', v: 'Amplifier stages before the ADC condition the signal — gain + anti-alias filtering' },
    { k: 'Sensor interface', v: 'Accelerometer, gyro, magnetometer all need front-end amplifiers before digitization' },
    { k: 'PLL VCO', v: 'The voltage-controlled oscillator uses tuned MOSFET amplifiers in a feedback loop' },
    { k: 'Gain', v: 'Typical single-stage |A_v| = 5–20; cascaded stages multiply: 10 × 10 = 100' },
    { k: 'Power trade-off', v: 'Higher g_m needs more I_D — more gain costs more power, always' },
    { k: '3nm advantage', v: 'Shorter channels → higher g_m per unit current → more gain-efficient amplifiers' },
  ],
  formulas: [
    { name: 'Voltage gain (CS amp)', eq: 'A_v = −g_m · R_D', when: 'common-source with resistive load, λ = 0', stars: 5 },
    { name: 'Transconductance g_m', eq: 'g_m = k_n(V_GS − V_t) = 2I_D / (V_GS − V_t)', when: 'MOSFET in saturation', stars: 5 },
    { name: 'Drain current (saturation)', eq: 'I_D = (k_n/2)(V_GS − V_t)²', when: 'saturation: V_DS ≥ V_GS − V_t', stars: 5 },
    { name: 'Output resistance r_o', eq: 'r_o = 1 / (λ · I_D) = V_A / I_D', when: 'including channel-length modulation', stars: 4 },
    { name: 'Gain with r_o', eq: 'A_v = −g_m · (R_D ∥ r_o)', when: 'finite output resistance (λ ≠ 0)', stars: 4 },
    { name: 'Gain with source degeneration', eq: 'A_v = −g_m · R_D / (1 + g_m · R_S)', when: 'CS amp with source resistor R_S', stars: 3 },
  ],
}

export const AMP_LAB = {
  title: 'A19 Pro · audio codec amplifier',
  narrative: 'You are designing a common-source amplifier stage in the A19 Pro\'s audio codec. The microphone produces a 50 μV signal that must be amplified before the ADC. Your task: calculate the voltage gain |A_v| to verify the signal reaches the ADC\'s input range.',
  params: [
    { label: 'Configuration', value: 'Common-source (CS) with R_D' },
    { label: 'V_GS (bias)', value: '0.8 V' },
    { label: 'V_t (threshold)', value: '0.4 V' },
    { label: 'k_n = μ_nC_ox(W/L)', value: '4 mA/V²' },
    { label: 'R_D', value: '5 kΩ' },
    { label: 'λ (CLM)', value: '0 (ideal)' },
  ],
  correctAnswer: 8.00,
  tolerance: 0.05,
  answerLabel: '|A_v|',
  unit: '',
  hint: 'Find g_m = k_n(V_GS − V_t) first. Then |A_v| = g_m × R_D.',
  solution: [
    { tag: 'Overdrive', line: 'V<sub>ov</sub> = V<sub>GS</sub> − V<sub>t</sub> = 0.8 − 0.4 = 0.4 V' },
    { tag: 'Transconductance', line: 'g<sub>m</sub> = k<sub>n</sub> × V<sub>ov</sub> = 4 × 0.4 = 1.6 mA/V' },
    { tag: 'Gain', line: '|A<sub>v</sub>| = g<sub>m</sub> × R<sub>D</sub> = 1.6 × 5 = <strong>8.00</strong>' },
    { tag: 'Verify', line: 'I<sub>D</sub> = (k<sub>n</sub>/2)V<sub>ov</sub>² = (4/2)(0.16) = 0.32 mA. V<sub>DS</sub> = V<sub>DD</sub> − I<sub>D</sub>R<sub>D</sub> — in saturation' },
    { tag: 'Meaning', line: 'A 50 μV microphone signal becomes 400 μV after this stage — enough for the ADC input.' },
  ],
}

export const AMP_PYQS = [
  {
    id: 'amp-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'A CS amplifier has k_n = 2 mA/V², V_GS = 0.9V, V_t = 0.5V, R_D = 10 kΩ. Find |A_v|. (2 dp)',
    answer: 8.00, unit: '',
    trap: 'Students sometimes use the wrong g_m formula. g_m = k_n(V_GS − V_t), not k_n·V_GS.',
    why: 'g_m = k_n(V_GS − V_t) = 2 × (0.9 − 0.5) = 0.8 mA/V. |A_v| = g_m × R_D = 0.8 × 10 = 8.00.',
  },
  {
    id: 'amp-pyq-2023', year: 2023, marks: 1, type: 'MCQ',
    q: 'Adding a source degeneration resistor R_S to a CS amplifier:',
    options: ['Increases voltage gain', 'Decreases voltage gain but improves linearity', 'Has no effect on gain', 'Converts it to a common-drain amplifier'],
    answerIdx: 1,
    trap: 'Source degeneration introduces negative feedback: A_v = −g_m·R_D/(1+g_m·R_S). Gain decreases but linearity improves.',
    why: 'R_S introduces negative feedback. Gain drops by factor (1+g_m·R_S) but bandwidth and linearity improve — classic gain-bandwidth trade-off.',
  },
  {
    id: 'amp-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'A MOSFET in saturation has I_D = 0.5 mA and V_ov = 0.2V. Find g_m in mA/V. (2 dp)',
    answer: 5.00, unit: 'mA/V',
    trap: 'Use g_m = 2I_D/V_ov. Don\'t confuse with BJT formula g_m = I_C/V_T.',
    why: 'g_m = 2I_D/V_ov = 2 × 0.5 / 0.2 = 5.00 mA/V.',
  },
  {
    id: 'amp-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'The output resistance r_o of a MOSFET in saturation is:',
    options: ['1/(λ·I_D)', 'λ·I_D', 'g_m·R_D', 'β/g_m'],
    answerIdx: 0,
    trap: 'r_o = 1/(λ·I_D) = V_A/I_D. β/g_m is the BJT r_π formula — don\'t mix up.',
    why: 'r_o = 1/(λ·I_D). Higher I_D or larger λ → lower output resistance.',
  },
  {
    id: 'amp-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'A CS amp has g_m = 2 mA/V, R_D = 10 kΩ, r_o = 40 kΩ. Find |A_v| with r_o included. (2 dp)',
    answer: 16.00, unit: '',
    trap: 'Students who ignore r_o get 20 instead of 16.',
    why: 'R_D ∥ r_o = (10×40)/(10+40) = 400/50 = 8 kΩ. |A_v| = g_m × (R_D ∥ r_o) = 2 × 8 = 16.00.',
  },
  {
    id: 'amp-pyq-2020', year: 2020, marks: 1, type: 'MCQ',
    q: 'In a common-source amplifier, the phase relationship between input and output is:',
    options: ['In-phase (0°)', 'Out-of-phase (180°)', '90° phase shift', 'Depends on frequency'],
    answerIdx: 1,
    trap: 'The negative sign in A_v = −g_m·R_D means 180° phase inversion.',
    why: 'A_v = −g_m·R_D. The minus sign → 180° phase inversion. When V_in goes up, V_out goes down.',
  },
]

export const AMP_PRACTICE = [
  {
    id: 'amp-p1', kind: 'mcq',
    q: 'In a CS amplifier, doubling R_D while keeping the Q-point in saturation will:',
    options: [
      'Double the voltage gain |A_v|',
      'Halve the voltage gain',
      'Have no effect — gain depends only on g_m',
      'Push the MOSFET into the triode region always',
    ],
    answerIdx: 0,
    why: '|A_v| = g_m × R_D. Since g_m depends on bias (V_GS, k_n), doubling R_D doubles gain. Caveat: larger R_D may push V_DS below V_ov into triode.',
  },
  {
    id: 'amp-p2', kind: 'nat',
    q: 'g_m = 3 mA/V, R_D = 4 kΩ, R_S = 1 kΩ. Find |A_v| with source degeneration. (2 dp)',
    unit: '', answer: 3.00,
    why: '|A_v| = g_m·R_D/(1+g_m·R_S) = 3×4/(1+3×1) = 12/4 = 3.00.',
  },
  {
    id: 'amp-p3', kind: 'nat',
    q: 'k_n = 1 mA/V², V_GS = 1.0V, V_t = 0.5V. Find I_D in mA. (2 dp)',
    unit: 'mA', answer: 0.13,
    why: 'I_D = (k_n/2)(V_GS − V_t)² = (1/2)(0.5)² = 0.125 ≈ 0.13 mA.',
  },
  {
    id: 'amp-p4', kind: 'mcq',
    q: 'To increase g_m without changing I_D, you should:',
    options: [
      'Increase W/L ratio (wider transistor)',
      'Decrease the supply voltage V_DD',
      'Increase R_D',
      'Reduce the channel length below minimum',
    ],
    answerIdx: 0,
    why: 'g_m = √(2k_n·I_D). Increasing W/L raises k_n, which raises g_m for the same I_D. This is the fundamental sizing knob.',
  },
  {
    id: 'amp-p5', kind: 'nat',
    q: 'I_D = 0.25 mA, λ = 0.05 V⁻¹. Find r_o in kΩ. (2 dp)',
    unit: 'kΩ', answer: 80.00,
    why: 'r_o = 1/(λ·I_D) = 1/(0.05 × 0.25×10⁻³) = 1/12.5×10⁻⁶ = 80 kΩ.',
  },
]

export const AMP_INSIGHT = {
  frequency: '4 of 7',
  body: 'MOSFET amplifier questions focus on g_m calculation and voltage gain. Source degeneration and output resistance appear as follow-ups.',
}
