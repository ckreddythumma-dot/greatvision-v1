export function csGain(gm, RD) {
  return -gm * RD
}

export function transconductance(kn, VGS, Vt) {
  const vov = VGS - Vt
  if (vov <= 0) return 0
  return kn * vov
}

export function drainCurrent(kn, VGS, Vt) {
  const vov = VGS - Vt
  if (vov <= 0) return 0
  return (kn / 2) * vov * vov
}

export function outputVoltage(VDD, ID, RD) {
  return VDD - ID * RD
}

export function ampRegion(VGS, Vt, Vout, VDS) {
  if (VGS < Vt) return 'cutoff'
  if (VDS < VGS - Vt) return 'triode'
  return 'saturation'
}

export const AMP_PRESETS = {
  'cutoff':     { vgs: 0.2 },
  'low-gain':   { vgs: 0.5 },
  'mid-gain':   { vgs: 0.7 },
  'high-gain':  { vgs: 0.9 },
}

export const REGION_NUM_AMP = {
  'cutoff': '01',
  'low-gain': '02',
  'mid-gain': '03',
  'high-gain': '04',
}

export const AMP_STATE_COPY = {
  'cutoff': {
    label: 'Cutoff',
    sub: 'V_GS < V_t',
    headline: 'No amplification. Output = V_DD.',
    explain: 'The MOSFET is OFF — gate voltage is below threshold. No drain current flows, so the entire V_DD appears at the output. The amplifier produces no gain. This is the OFF state.',
    formula: 'V_out = V_DD, A_v = 0',
    chip: 'Amplifier OFF, output rail-high',
    phone: 'Unused signal path, power-gated block',
    phoneDetail: 'When a sensor is not active, its amplifier sits in cutoff. The output is pulled to V_DD through R_D. Zero current flows — zero power wasted. The A19 Pro gates hundreds of amplifier blocks this way.',
    real: 'In cutoff, the common-source amplifier draws no current. Output sits at V_DD. This is how the chip saves power — unused analog blocks are gated off.',
  },
  'low-gain': {
    label: 'Low Gain',
    sub: 'V_GS just above V_t',
    headline: 'Small overdrive. Weak amplification.',
    explain: 'The MOSFET barely conducts. Drain current is small, so g_m is low. Voltage gain |A_v| = g_m × R_D is modest. The output swing is limited. Useful for low-noise, low-power front-ends.',
    formula: 'A_v = −g_m · R_D (small)',
    chip: 'Low-power amplification, sensor readout',
    phone: 'Microphone preamp, low-noise front-end',
    phoneDetail: 'Your phone\'s microphone preamp runs at low overdrive for minimum noise. g_m is small but noise figure is optimized. The signal is tiny (microvolts) — even a gain of 5–10× is enough to bring it to the next stage.',
    real: 'Low overdrive means low g_m but also low noise and low power. Front-end amplifiers in sensor interfaces operate here intentionally.',
  },
  'mid-gain': {
    label: 'Mid Gain',
    sub: 'Moderate overdrive',
    headline: 'Sweet spot. Good gain, good swing.',
    explain: 'Moderate overdrive gives useful g_m. The gain |A_v| = g_m × R_D is substantial (5–15×). The Q-point is centered, allowing maximum output swing before clipping. This is the typical operating point for general-purpose amplifiers.',
    formula: 'A_v = −g_m · R_D (moderate)',
    chip: 'General-purpose amplification',
    phone: 'Audio signal chain, ADC driver',
    phoneDetail: 'The audio codec in your phone uses mid-gain amplifiers to drive the ADC. The signal from the microphone preamp is amplified 10× before digitization. The Q-point is centered for maximum dynamic range — loud sounds don\'t clip, quiet sounds stay above the noise floor.',
    real: 'Most amplifier stages operate at mid-gain: enough amplification to be useful, enough headroom to avoid clipping. The Q-point determines the trade-off.',
  },
  'high-gain': {
    label: 'High Gain',
    sub: 'Large overdrive',
    headline: 'Maximum gain. Risk of clipping.',
    explain: 'Large overdrive pushes g_m high. Gain |A_v| = g_m × R_D is large (15–30×). But the Q-point moves toward V_DD/2 or lower, reducing output swing. Large signals clip at V_DD or ground. High gain = high sensitivity but less headroom.',
    formula: 'A_v = −g_m · R_D (large)',
    chip: 'High-sensitivity detection, comparator-like',
    phone: 'Weak signal detection, wake-up circuits',
    phoneDetail: 'The always-on motion coprocessor uses high-gain amplifiers to detect faint accelerometer signals. When you raise your phone to check the time, a high-gain stage detects the motion and wakes the display — all in microseconds, using microwatts.',
    real: 'High-gain stages sacrifice headroom for sensitivity. They are used where the signal is weak and distortion tolerance is high — detection circuits, comparators, wake-up logic.',
  },
}
