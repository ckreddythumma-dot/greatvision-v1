const VT_300K = 0.026

export function diodeRegion(V, VBR = -5.0) {
  if (V <= VBR) return 'breakdown'
  if (V < -0.01) return 'reverse'
  if (V < 0.01) return 'zero-bias'
  if (V < 0.45) return 'forward-weak'
  return 'forward-strong'
}

export function diodeCurrent(V, Is = 1e-12, n = 1, VT = VT_300K) {
  if (V < -5) return -0.1
  const raw = Is * (Math.exp(V / (n * VT)) - 1)
  return Math.max(-0.1, Math.min(raw, 50))
}

export function builtInPotential(NA, ND, ni, VT = VT_300K) {
  return VT * Math.log((NA * ND) / (ni * ni))
}

export function depletionWidth(Vbi, Vapplied, NA, ND) {
  const eps = 11.7 * 8.854e-14
  const q = 1.6e-19
  const Veff = Vbi - Vapplied
  if (Veff <= 0) return 0
  return Math.sqrt((2 * eps * Veff * (NA + ND)) / (q * NA * ND)) * 1e4
}

export const DIODE_PRESETS = {
  'reverse':        { v: -2.0 },
  'zero-bias':      { v: 0.0 },
  'forward-weak':   { v: 0.3 },
  'forward-strong': { v: 0.7 },
  'breakdown':      { v: -5.5 },
}

export const REGION_NUM_DIODE = {
  'reverse': '01',
  'zero-bias': '02',
  'forward-weak': '03',
  'forward-strong': '04',
  'breakdown': '05',
}

export const DIODE_STATE_COPY = {
  'reverse': {
    label: 'Reverse Bias',
    sub: 'V < 0',
    headline: 'Valve sealed shut. No current.',
    explain: 'Reverse voltage widens the depletion region. The barrier grows taller. Only a tiny leakage current (reverse saturation current I_s) flows — thermally generated carriers drifting across.',
    formula: 'I = -I_s (very small)',
    chip: 'Diode OFF, blocks current, protects circuit',
    phone: 'ESD diode blocking, power rail isolation',
    phoneDetail: 'The ESD protection diodes on every I/O pin sit in reverse bias during normal operation. They block, drawing only picoamps of leakage. When you plug in a charging cable, thousands of protection diodes silently guard the chip.',
    real: 'Every I/O pin on the A19 Pro has reverse-biased protection diodes. They draw essentially zero current, consuming no power, until a voltage spike forces them to activate.',
  },
  'zero-bias': {
    label: 'Zero Bias',
    sub: 'V = 0',
    headline: 'Equilibrium. Drift equals diffusion.',
    explain: 'No external voltage. The built-in potential V_bi creates a depletion region at equilibrium. Diffusion current (majority carriers crossing) exactly cancels drift current (minority carriers swept by the field). Net current = 0.',
    formula: 'I = 0 (equilibrium)',
    chip: 'Junction at rest, depletion region at natural width',
    phone: 'Phone off, junctions at thermal equilibrium',
    phoneDetail: 'When your phone is completely powered off, every PN junction in the chip sits at zero bias. The built-in potential holds the depletion region at its natural width. No current flows. The chip draws zero power.',
    real: 'At zero bias, the depletion region width is determined by the doping concentrations alone. This is the reference state — the natural barrier height V_bi that forward bias must overcome.',
  },
  'forward-weak': {
    label: 'Forward (weak)',
    sub: '0 < V < V_knee',
    headline: 'Valve cracking open. Trickle of current.',
    explain: 'Small forward voltage begins to shrink the depletion region. The barrier lowers slightly. Some majority carriers have enough thermal energy to cross, but current is still very small — microamps to nanoamps.',
    formula: 'I = I_s(e^(V/nV_T) - 1) ≈ small',
    chip: 'Diode beginning to conduct, sub-mA current',
    phone: 'Sensor readout, low-power analog signal path',
    phoneDetail: 'The photodiodes in your camera sensor operate here. Light generates a tiny current proportional to brightness — microamps, not milliamps. The image signal processor reads these tiny currents from millions of pixels 30-60 times per second.',
    real: 'Photodiodes, temperature sensors, and reference circuits operate in this weak forward region. The exponential I-V relationship makes the current extremely sensitive to voltage — useful for sensing.',
  },
  'forward-strong': {
    label: 'Forward (strong)',
    sub: 'V > V_knee (~0.7V Si)',
    headline: 'Valve wide open. Heavy current.',
    explain: 'Forward voltage exceeds the knee (~0.7V for silicon). Depletion region nearly vanishes. Majority carriers flood across the junction. Current rises steeply — milliamps to amps. The diode is fully ON.',
    formula: 'I = I_s · e^(V/nV_T)',
    chip: 'Diode fully ON, conducting heavily, V_D ≈ 0.7V',
    phone: 'Charging, power delivery, voltage clamping',
    phoneDetail: 'When you plug in a USB-C charger, the body diodes in the power MOSFETs forward-bias. Current flows at 0.7V drop per junction. At 20W charging, that is real power dissipated as heat — which is why your phone gets warm while charging.',
    real: 'Power rectification, voltage clamping, and ESD protection all use strong forward bias. The 0.7V drop is a fundamental cost of silicon — every diode in the power path wastes 0.7V worth of energy as heat.',
  },
  'breakdown': {
    label: 'Breakdown',
    sub: 'V < -V_BR',
    headline: 'Barrier shattered. Reverse flood.',
    explain: 'Reverse voltage exceeds the breakdown voltage V_BR. In avalanche breakdown (lightly doped, V_BR > 5V), accelerated carriers knock loose more carriers in a chain reaction. In Zener breakdown (heavily doped, V_BR < 5V), the electric field is strong enough for quantum tunneling.',
    formula: 'I → large reverse current',
    chip: 'Controlled: voltage regulation. Uncontrolled: device failure',
    phone: 'Zener reference in power management, ESD clamping',
    phoneDetail: 'The power management IC inside your phone uses Zener diodes as voltage references — precise breakdown at a known voltage. But uncontrolled avalanche in a signal diode means the chip is absorbing energy it was not designed for. If the current is not limited, the junction overheats and melts.',
    real: 'Zener diodes are intentionally operated in breakdown for voltage regulation — the breakdown voltage is stable and predictable. Avalanche breakdown in regular diodes is destructive unless current is externally limited.',
  },
}
