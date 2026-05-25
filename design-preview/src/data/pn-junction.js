export const PN_THEORY = {
  eli10: {
    headline: 'One junction. One barrier. Current flows one way.',
    body: [
      'A PN junction is a one-way valve in a water pipe.',
      'Push water from one side — the valve opens and water flows through. Push from the other side — the valve seals shut. Nothing gets through.',
      'The “one way” happens because of a natural barrier. When you join p-type silicon (lots of positive holes) with n-type silicon (lots of negative electrons), the carriers near the boundary cancel each other out. This empty zone — the depletion region — is the valve. No carriers means no current.',
      'Forward bias shrinks the barrier. The valve opens. Current rises exponentially — a trickle at first, then a flood past ~0.7 V.',
      'Reverse bias widens the barrier. The valve shuts tighter. Only a tiny leakage current flows.',
      'Too much reverse pressure and the valve breaks — that is breakdown. Avalanche or Zener, depending on how the junction was built.',
    ],
  },
  pullQuote: 'One junction. One barrier. Current flows one way.',
  technical: [
    {
      h: 'Structure — two regions, one junction',
      body: 'A PN junction is formed by joining <span class="mono">p-type</span> (doped with acceptors, N<sub>A</sub>) and <span class="mono">n-type</span> (doped with donors, N<sub>D</sub>) silicon. At the boundary, electrons from the n-side diffuse into the p-side and recombine with holes. This leaves behind fixed ions — negative on the p-side, positive on the n-side — creating the <em>depletion region</em>.<br/><br/>The depletion region has no free carriers. It acts as an insulating barrier with a built-in electric field pointing from n to p.',
    },
    {
      h: 'Key parameters',
      body: '<span class="mono">V<sub>bi</sub></span> — built-in potential; the natural barrier height (~0.7 V for Si).<br/><span class="mono">N<sub>A</sub></span>, <span class="mono">N<sub>D</sub></span> — acceptor and donor doping concentrations.<br/><span class="mono">n<sub>i</sub></span> — intrinsic carrier concentration (1.5 × 10<sup>10</sup> /cm³ for Si at 300K).<br/><span class="mono">V<sub>T</sub></span> — thermal voltage = kT/q ≈ 0.026 V at 300K.<br/><span class="mono">I<sub>s</sub></span> — reverse saturation current; process-dependent, typically 10<sup>−12</sup> to 10<sup>−14</sup> A.',
    },
    {
      h: 'Three modes of operation',
      body: '<strong>Forward bias</strong> — V > 0. External voltage opposes V<sub>bi</sub>, shrinks depletion region, lowers barrier. Current rises exponentially: I = I<sub>s</sub>(e<sup>V/nV<sub>T</sub></sup> − 1).<br/><strong>Reverse bias</strong> — V < 0. External voltage adds to V<sub>bi</sub>, widens depletion region. Only minority-carrier drift current flows (≈ I<sub>s</sub>, very small).<br/><strong>Breakdown</strong> — V < −V<sub>BR</sub>. Two mechanisms: <em>Zener</em> (heavy doping, V<sub>BR</sub> < 5V, quantum tunneling) and <em>Avalanche</em> (light doping, V<sub>BR</sub> > 5V, impact ionization chain reaction).',
    },
    {
      h: 'GATE depth — what is actually tested',
      body: 'V<sub>bi</sub> calculation from doping levels (most common, 2-mark NAT). Depletion width and its dependence on bias. Shockley diode equation I = I<sub>s</sub>(e<sup>V/nV<sub>T</sub></sup> − 1). Zener vs Avalanche distinction. Junction capacitance C<sub>j</sub> variation with reverse bias. Temperature dependence of V<sub>bi</sub> (conceptual, 1-mark MCQ).',
    },
  ],
  realWorld: [
    { k: 'ESD protection', v: 'PN diodes on every I/O pin of the A19 Pro — clamp voltage spikes before they reach internal gates' },
    { k: 'Body diodes', v: 'Every MOSFET has a parasitic PN junction (body-drain) — ~19 billion body diodes on one die' },
    { k: 'Camera sensor', v: 'Photodiodes convert light → current — each pixel is a reverse-biased PN junction' },
    { k: 'Power management', v: 'Schottky diodes in the PMIC for fast switching rectification' },
    { k: 'Built-in potential', v: '~0.7–0.9 V for silicon junctions at 300K, depending on doping' },
    { k: 'Breakdown voltage', v: 'ESD diodes designed for V_BR ≈ 5–8 V to clamp without damaging oxide' },
    { k: 'Leakage at scale', v: 'Even picoamps per diode × 19B junctions = measurable standby drain' },
  ],
  formulas: [
    { name: 'Shockley diode equation', eq: 'I = I_s · (e^(V / nV_T) − 1)', when: 'all bias conditions (ideal diode)', stars: 5 },
    { name: 'Built-in potential V_bi', eq: 'V_bi = V_T · ln(N_A · N_D / n_i²)', when: 'thermal equilibrium (no external bias)', stars: 5 },
    { name: 'Depletion width W', eq: 'W = √(2ε_s(V_bi − V) / q · (N_A + N_D) / (N_A · N_D))', when: 'reverse bias or zero bias (V ≤ 0)', stars: 4 },
    { name: 'Junction capacitance C_j', eq: 'C_j = C_j0 / (1 − V/V_bi)^m', when: 'reverse bias (V < 0)', stars: 4 },
    { name: 'Max electric field E_max', eq: 'E_max = 2(V_bi − V) / W', when: 'at the metallurgical junction', stars: 3 },
    { name: 'Depletion width ratio', eq: 'x_n / x_p = N_A / N_D', when: 'charge neutrality condition', stars: 3 },
  ],
}

export const PN_LAB = {
  title: 'A19 Pro · ESD protection diode',
  narrative: 'You are the ESD protection engineer at Apple. A static discharge from a USB-C cable can spike to 2,000 V in nanoseconds. Every I/O pin on the A19 Pro has a PN junction diode that must activate (forward bias) before the spike reaches the internal MOSFET gates. Your first task: calculate the built-in potential V_bi to know when the diode begins conducting.',
  params: [
    { label: 'Diode type', value: 'Silicon PN junction (ESD clamp)' },
    { label: 'p-side doping N_A', value: '5 × 10^17 /cm³' },
    { label: 'n-side doping N_D', value: '10^16 /cm³' },
    { label: 'Intrinsic conc. n_i', value: '1.5 × 10^10 /cm³' },
    { label: 'Temperature T', value: '300 K' },
    { label: 'Thermal voltage V_T', value: '0.026 V (= kT/q)' },
  ],
  correctAnswer: 0.80,
  tolerance: 0.05,
  answerLabel: 'V_bi',
  unit: 'V',
  hint: 'V_bi = V_T · ln(N_A · N_D / n_i²). Compute the argument of ln first, then multiply by V_T.',
  solution: [
    { tag: 'Formula', line: 'V_bi = V_T × ln(N_A × N_D / n_i²)' },
    { tag: 'Numerator', line: 'N_A × N_D = 5×10<sup>17</sup> × 10<sup>16</sup> = 5×10<sup>33</sup>' },
    { tag: 'Denominator', line: 'n_i² = (1.5×10<sup>10</sup>)² = 2.25×10<sup>20</sup>' },
    { tag: 'Ratio', line: '5×10<sup>33</sup> / 2.25×10<sup>20</sup> = 2.22×10<sup>13</sup>' },
    { tag: 'Logarithm', line: 'ln(2.22×10<sup>13</sup>) = ln(2.22) + 13·ln(10) = 0.80 + 29.93 = 30.73' },
    { tag: 'Result', line: 'V_bi = 0.026 × 30.73 = 0.799 V ≈ <strong>0.80 V</strong>' },
    { tag: 'Meaning', line: 'The ESD diode has a 0.80 V barrier. Any spike above this activates the clamp before internal gates see danger.' },
  ],
}

export const PN_PYQS = [
  {
    id: 'pn-pyq-2024', year: 2024, marks: 2, type: 'NAT',
    q: 'A silicon PN junction has N_A = 10^17 /cm³, N_D = 10^15 /cm³, and n_i = 10^10 /cm³ at T = 300K. Find the built-in potential V_bi in volts. (V_T = 0.026 V. Round to 2 dp.)',
    answer: 0.72, unit: 'V',
    trap: 'Students often forget to square n_i in the denominator, or mix up ln and log₁₀. The formula uses natural log (ln), not log base 10.',
    why: 'V_bi = V_T × ln(N_A × N_D / n_i²) = 0.026 × ln(10^32 / 10^20) = 0.026 × ln(10^12) = 0.026 × 27.63 = 0.72 V.',
  },
  {
    id: 'pn-pyq-2023a', year: 2023, marks: 1, type: 'MCQ',
    q: 'In a reverse-biased PN junction, increasing the magnitude of the reverse voltage:',
    options: ['Narrows the depletion region', 'Widens the depletion region', 'Has no effect on depletion width', 'Increases the forward current'],
    answerIdx: 1,
    trap: 'Confusing forward and reverse bias effects. Reverse bias adds to V_bi, which widens the depletion region.',
    why: 'W ∝ √(V_bi + |V_R|). More reverse voltage → larger effective barrier → wider depletion.',
  },
  {
    id: 'pn-pyq-2022', year: 2022, marks: 2, type: 'NAT',
    q: 'A silicon diode at 300K has I_s = 10^−12 A and ideality factor n = 1. Find the forward current at V = 0.5 V in mA. (Round to 2 dp.)',
    answer: 0.22, unit: 'mA',
    trap: 'The exponential e^(0.5/0.026) = e^19.23 ≈ 2.24×10^8 is large. Students who round too early get very different answers.',
    why: 'I = I_s(e^(V/nV_T) − 1) = 10^−12 × (e^(0.5/0.026) − 1) = 10^−12 × 2.24×10^8 = 2.24×10^−4 A = 0.22 mA.',
  },
  {
    id: 'pn-pyq-2021', year: 2021, marks: 1, type: 'MCQ',
    q: 'Which breakdown mechanism dominates in a heavily doped PN junction with V_BR < 5 V?',
    options: ['Avalanche (impact ionization)', 'Zener (quantum tunneling)', 'Thermal runaway', 'Oxide rupture'],
    answerIdx: 1,
    trap: 'Heavy doping → narrow depletion region → strong electric field at relatively low voltage → Zener tunneling.',
    why: 'V_BR < 5V → Zener (tunneling). V_BR > 5V → Avalanche (impact ionization). Heavy doping narrows W, so electrons tunnel through.',
  },
  {
    id: 'pn-pyq-2025', year: 2025, marks: 2, type: 'NAT',
    q: 'In a PN junction, N_A = 4 × 10^16 /cm³ and N_D = 10^16 /cm³. Find x_n / x_p (the ratio of depletion widths on the n-side to the p-side).',
    answer: 4.00, unit: '',
    trap: 'Students confuse the ratio direction. Charge neutrality requires N_A × x_p = N_D × x_n, so x_n/x_p = N_A/N_D.',
    why: 'Charge neutrality: q × N_A × x_p = q × N_D × x_n. Therefore x_n / x_p = N_A / N_D = 4×10^16 / 10^16 = 4.00.',
  },
  {
    id: 'pn-pyq-2020', year: 2020, marks: 1, type: 'MCQ',
    q: 'As temperature increases, the built-in potential V_bi of a silicon PN junction:',
    options: ['Increases', 'Decreases', 'Remains constant', 'First increases then decreases'],
    answerIdx: 1,
    trap: 'While V_T increases linearly with T, n_i increases exponentially — so n_i² grows much faster, making the ln term shrink.',
    why: 'n_i ∝ e^(−E_g/2kT) doubles roughly every 11°C. n_i² in the denominator grows faster than V_T in the numerator → V_bi falls.',
  },
]

export const PN_PRACTICE = [
  {
    id: 'pn-p1', kind: 'mcq',
    q: 'As forward bias across a PN junction increases, the depletion region width:',
    options: [
      'Increases — more voltage pushes carriers further apart',
      'Decreases — forward bias opposes V_bi, shrinking the barrier',
      'Stays the same — depletion width depends only on doping',
      'Goes to zero instantly at any forward bias',
    ],
    answerIdx: 1,
    why: 'Forward bias subtracts from V_bi, reducing the effective barrier. W ∝ √(V_bi − V). As V increases toward V_bi, the depletion region shrinks.',
  },
  {
    id: 'pn-p2', kind: 'nat',
    q: 'Calculate V_bi for a symmetric junction: N_A = N_D = 10^16 /cm³, n_i = 10^10 /cm³, T = 300K. (2 dp, V)',
    unit: 'V', answer: 0.72,
    why: 'V_bi = 0.026 × ln(10^16 × 10^16 / (10^10)²) = 0.026 × ln(10^12) = 0.026 × 27.63 = 0.72 V.',
  },
  {
    id: 'pn-p3', kind: 'nat',
    q: 'Forward current at V = 0.6 V. I_s = 10^−14 A, n = 1, V_T = 0.026 V. Answer in mA. (2 dp)',
    unit: 'mA', answer: 0.11,
    why: 'I = 10^−14 × (e^(0.6/0.026) − 1) = 10^−14 × e^23.08 ≈ 10^−14 × 1.06×10^10 = 0.11 mA.',
  },
  {
    id: 'pn-p4', kind: 'mcq',
    q: 'At zero bias (V = 0), the net current through a PN junction is:',
    options: [
      'Large forward current — carriers always diffuse',
      'Small reverse current — minority carriers drift',
      'Zero — drift current exactly cancels diffusion current',
      'Cannot be determined without knowing doping',
    ],
    answerIdx: 2,
    why: 'At thermal equilibrium (V = 0), diffusion current of majority carriers exactly equals drift current of minority carriers. Net current is zero.',
  },
  {
    id: 'pn-p5', kind: 'nat',
    q: 'In a one-sided junction, N_A = 3×10^17 /cm³ and N_D = 10^16 /cm³. Find x_n / x_p.',
    unit: '', answer: 30.00,
    why: 'Charge neutrality: N_A × x_p = N_D × x_n → x_n/x_p = N_A/N_D = 3×10^17 / 10^16 = 30. The n-side depletion is 30× wider.',
  },
]

export const PN_INSIGHT = {
  frequency: '5 of 7',
  body: 'PN Junction is one of the highest-frequency topics in Electronic Devices. V_bi calculation and depletion width questions appear almost every year.',
}
