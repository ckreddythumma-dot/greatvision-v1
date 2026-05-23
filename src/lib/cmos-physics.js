export function cmosRegion(Vin, VDD, Vtn, Vtp) {
  const absVtp = Math.abs(Vtp)
  if (Vin < Vtn) return 'region1'
  if (Vin < VDD / 2 - 0.05) return 'region2'
  if (Vin < VDD / 2 + 0.05) return 'region3'
  if (Vin < VDD - absVtp) return 'region4'
  return 'region5'
}

export function cmosVout(Vin, VDD, Vtn, Vtp, knkp = 1) {
  const absVtp = Math.abs(Vtp)
  if (Vin <= Vtn) return VDD
  if (Vin >= VDD - absVtp) return 0
  const mid = switchingThreshold(VDD, Vtn, Vtp, knkp)
  const t = (Vin - Vtn) / (VDD - absVtp - Vtn)
  const curve = 1 / (1 + Math.exp(-12 * (t - 0.5)))
  return VDD * (1 - curve)
}

export function switchingThreshold(VDD, Vtn, Vtp, knkp = 1) {
  const r = Math.sqrt(knkp)
  return (VDD + Vtp + Vtn * r) / (1 + r)
}

export function noiseMarginHigh(VOH, VIH) {
  return VOH - VIH
}

export function noiseMarginLow(VIL, VOL) {
  return VIL - VOL
}

export const CMOS_PRESETS = {
  'region1': { vin: 0.0 },
  'region2': { vin: 0.3 },
  'region3': { vin: 0.5 },
  'region4': { vin: 0.7 },
  'region5': { vin: 1.0 },
}

export const REGION_NUM_CMOS = {
  'region1': '01',
  'region2': '02',
  'region3': '03',
  'region4': '04',
  'region5': '05',
}

export const CMOS_STATE_COPY = {
  'region1': {
    label: 'PMOS ON, NMOS OFF',
    sub: 'V_in < V_tn',
    headline: 'Output = V_DD. Logic HIGH.',
    explain: 'Input is below the NMOS threshold. NMOS is completely OFF — no path to ground. PMOS is fully ON with |V_GS,p| = V_DD. Output is pulled to V_DD through the PMOS. Zero static current flows. This is the ideal logic HIGH state.',
    formula: 'V_out = V_DD, I_static = 0',
    chip: 'Logic HIGH, zero static power',
    phone: 'Storing a 1, idle logic gate',
    phoneDetail: 'When a logic gate stores a HIGH, the PMOS pulls the output to V_DD while the NMOS is completely OFF. No current flows from supply to ground. This is why CMOS logic uses almost zero power when not switching — 19 billion gates, zero static current.',
    real: 'In Region 1, the inverter output is a solid V_DD. No static power is consumed. This is one of the two stable states that makes CMOS the dominant logic family.',
  },
  'region2': {
    label: 'PMOS linear, NMOS sat',
    sub: 'V_tn < V_in < V_M',
    headline: 'Output dropping. Transition begins.',
    explain: 'Input exceeds V_tn — NMOS turns on in saturation and starts pulling current. PMOS is still ON but now in the linear region. Output begins to fall from V_DD. The gain (slope of VTC) increases rapidly.',
    formula: 'V_out starts falling, both conduct',
    chip: 'Transition zone, brief current spike',
    phone: 'Signal edge, switching transient',
    phoneDetail: 'As a clock edge propagates through the chip, each inverter passes through this region. Both transistors conduct simultaneously for a brief instant — this is where dynamic power is consumed. At 4 GHz, this happens 4 billion times per second per gate.',
    real: 'Region 2 is the beginning of the transition. NMOS starts conducting while PMOS still pulls up. A short-circuit current flows — this is one source of dynamic power dissipation.',
  },
  'region3': {
    label: 'Both saturated',
    sub: 'V_in ≈ V_M',
    headline: 'Maximum gain. Switching point.',
    explain: 'Both transistors are in saturation simultaneously. The VTC slope is steepest here — maximum voltage gain. The switching threshold V_M is where V_in = V_out. Short-circuit current is maximum. This is the most power-hungry instant of a transition.',
    formula: 'V_out = V_in = V_M, max gain',
    chip: 'Peak short-circuit current, fastest transition',
    phone: 'Clock edge, maximum instantaneous power',
    phoneDetail: 'At the switching threshold, both transistors are ON and in saturation. Short-circuit current peaks. Multiply this by 19 billion gates switching at 4 GHz and you understand why the A19 Pro needs aggressive power management and a heat spreader.',
    real: 'Region 3 is the gain region. Both transistors in saturation means maximum amplification — the inverter can be used as an amplifier here. But the short-circuit current means this state should be transient, not steady-state.',
  },
  'region4': {
    label: 'PMOS sat, NMOS linear',
    sub: 'V_M < V_in < V_DD−|V_tp|',
    headline: 'Output approaching ground.',
    explain: 'NMOS is now in the linear region, pulling hard toward ground. PMOS is in saturation, weakening. Output is near zero. The transition is almost complete. Current flow decreases as PMOS contribution fades.',
    formula: 'V_out approaching 0V',
    chip: 'Near-complete switching, current decreasing',
    phone: 'Signal settling, approaching logic LOW',
    phoneDetail: 'The output is settling toward ground. In high-speed circuits, this settling time determines the maximum clock frequency. The A19 Pro\'s 3nm transistors switch through this region in picoseconds.',
    real: 'Region 4 mirrors Region 2. The NMOS dominates, pulling the output low. Short-circuit current decreases as PMOS turns off. The output approaches a clean logic LOW.',
  },
  'region5': {
    label: 'PMOS OFF, NMOS ON',
    sub: 'V_in > V_DD−|V_tp|',
    headline: 'Output = 0V. Logic LOW.',
    explain: 'Input exceeds V_DD − |V_tp|, turning PMOS completely OFF. NMOS is fully ON, pulling the output to ground. Zero static current flows. This is the ideal logic LOW state — the complement of Region 1.',
    formula: 'V_out = 0V, I_static = 0',
    chip: 'Logic LOW, zero static power',
    phone: 'Storing a 0, idle logic gate',
    phoneDetail: 'The complement of Region 1. NMOS pulls to ground, PMOS is OFF. Zero static current. Between Region 1 and Region 5, the inverter spends >99.9% of its time — the transition through Regions 2–4 takes picoseconds.',
    real: 'In Region 5, the output is a solid 0V. Combined with Region 1, these two stable states are why CMOS consumes near-zero static power — current only flows during the brief switching transition.',
  },
}
