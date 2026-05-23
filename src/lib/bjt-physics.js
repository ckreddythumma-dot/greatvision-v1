const VT_300K = 0.026

export function bjtRegion(VBE, VCE, VBEon = 0.7, VCEsat = 0.2) {
  if (VBE < VBEon - 0.05) return 'cutoff'
  if (VCE < VCEsat) return 'saturation'
  return 'active'
}

export function bjtIC(IB, beta = 100) {
  return beta * IB
}

export function bjtIE(IC, IB) {
  return IC + IB
}

export function bjtAlpha(beta) {
  return beta / (beta + 1)
}

export const BJT_PRESETS = {
  'cutoff':     { vbe: 0.0,  vce: 3.0 },
  'active':     { vbe: 0.72, vce: 3.0 },
  'saturation': { vbe: 0.75, vce: 0.15 },
}

export const REGION_NUM_BJT = {
  'cutoff': '01',
  'active': '02',
  'saturation': '03',
}

export const BJT_STATE_COPY = {
  'cutoff': {
    label: 'Cutoff',
    sub: 'V_BE < V_BE(on)',
    headline: 'Switch OFF. No current.',
    explain: 'Base-emitter voltage is below the turn-on threshold (~0.7V for Si). Both junctions are reverse biased. No base current flows, so no collector current flows. The transistor is an open switch.',
    formula: 'I_C = 0, I_B = 0',
    chip: 'Transistor OFF, draws zero current',
    phone: 'Logic LOW, sleep mode, power gating',
    phoneDetail: 'When your phone screen is off, billions of BJTs in the power management IC sit in cutoff. They draw zero current, enabling days of standby. The bandgap reference stays active — everything else is gated off.',
    real: 'In cutoff, the BJT is an open circuit from collector to emitter. Digital logic uses this as the OFF state. Power management ICs gate entire voltage rails by keeping reference BJTs in cutoff.',
  },
  'active': {
    label: 'Forward Active',
    sub: 'V_BE > 0.7V, V_CE > V_CE(sat)',
    headline: 'Amplifying. I_C = β × I_B.',
    explain: 'Base-emitter junction is forward biased — base current I_B flows. The thin base allows most injected electrons to reach the collector. Collector current I_C = β × I_B, where β is the current gain (typically 50–300). This is the amplification region.',
    formula: 'I_C = β · I_B',
    chip: 'Linear amplification, analog signal processing',
    phone: 'Audio amp, sensor readout, voltage reference',
    phoneDetail: 'The bandgap voltage reference in your phone\'s power management IC uses BJTs in the active region. Two BJTs at different current densities produce a voltage proportional to absolute temperature (PTAT). This gives a stable 1.2V reference that doesn\'t drift — critical for accurate power regulation.',
    real: 'The active region is where BJTs amplify. A small base current controls a large collector current. Every analog circuit — amplifiers, references, current mirrors — operates here.',
  },
  'saturation': {
    label: 'Saturation',
    sub: 'V_CE < V_CE(sat)',
    headline: 'Switch ON. Maximum current.',
    explain: 'Both junctions are forward biased. V_CE drops to a small value (~0.2V). The collector current is no longer β × I_B — it is limited by the external circuit. The transistor acts as a closed switch with a small voltage drop.',
    formula: 'V_CE ≈ 0.2V, I_C < β · I_B',
    chip: 'Saturated switch, logic HIGH driver',
    phone: 'Power switching, LED driver, logic output',
    phoneDetail: 'When the notification LED on your phone lights up, a BJT in saturation drives current through it. V_CE drops to ~0.2V, wasting minimal power. The base is overdriven to ensure the transistor stays fully ON regardless of LED forward voltage variation.',
    real: 'In saturation, the BJT is a closed switch. V_CE(sat) ≈ 0.2V means very low power dissipation. Digital logic and power switching use this as the ON state.',
  },
}
