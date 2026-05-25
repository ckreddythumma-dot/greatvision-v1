export function mosfetRegion(vgs, vds, vt = 0.3) {
  if (vgs < vt - 0.005) return 'cutoff'
  if (Math.abs(vgs - vt) < 0.02) return 'threshold'
  if (vds < vgs - vt) return 'linear'
  return 'saturation'
}

export function mosfetID(vgs, vds, vt = 0.3, k = 25) {
  if (vgs < vt) return 0
  const ov = vgs - vt
  if (vds < ov) return k * (ov * vds - (vds * vds) / 2)
  return (k / 2) * ov * ov
}

export const REGION_LABEL = {
  cutoff: 'Cutoff',
  threshold: 'Threshold',
  linear: 'Linear',
  saturation: 'Saturation',
}

export const REGION_SUB = {
  cutoff: 'V_GS < V_t',
  threshold: 'V_GS = V_t',
  linear: 'V_GS > V_t · V_DS < V_GS − V_t',
  saturation: 'V_GS > V_t · V_DS ≥ V_GS − V_t',
}

export const REGION_NOTE = {
  cutoff: 'Gate voltage is below V_t. No electrons in the channel. The transistor passes no current.',
  threshold: 'Gate voltage is exactly at V_t. The first electrons appear right under the oxide.',
  linear: 'Channel is full and uniform. Current grows almost linearly as V_DS rises. Used for analog switches.',
  saturation: 'Channel is full near source but pinched off near drain. Current is set by V_GS only. Used for amplifiers and digital switching.',
}

export const VIZ_PRESETS = {
  cutoff: { vgs: 0.15, vds: 0.60 },
  threshold: { vgs: 0.30, vds: 0.60 },
  linear: { vgs: 0.65, vds: 0.18 },
  saturation: { vgs: 0.90, vds: 0.70 },
}

export const STATE_COPY = {
  cutoff: {
    label: 'Cutoff',
    sub: 'V_GS < V_t',
    headline: 'The transistor is fully OFF.',
    explain: 'V_GS < V_t. The gate voltage is too weak to form an inversion layer. No path for electrons from source to drain. I_D = 0 regardless of V_DS.',
    formula: 'I_D = 0',
    chip: 'Transistor OFF · no current · stores binary 0',
    phone: 'Screen off, idle, near-zero power draw',
    phoneDetail: 'Phone in your pocket, screen off. The CPU is asleep. Almost every transistor is in cutoff — tap closed, no water. Battery drain: ~0.5% per hour. The phone is waiting for a wake signal.',
    real: 'Every transistor in cutoff is a binary 0. When your phone screen is off and the device is idle, most transistors are held in cutoff — this is why standby barely drains the battery. Power consumption is near zero.',
  },
  threshold: {
    label: 'Threshold',
    sub: 'V_GS = V_t',
    headline: 'The switching moment. ON-OFF boundary.',
    explain: 'V_GS = V_t exactly. The surface potential is just sufficient to invert the p-type substrate to n-type at the interface. I_D is effectively zero but the channel is on the verge of forming.',
    formula: 'I_D ≈ 0  ·  channel just appears',
    chip: 'Switching · crossing 0→1 or 1→0',
    phone: 'Decoding one pixel, adding two numbers, fetching one byte from cache',
    phoneDetail: 'When you tap "Send" on a message, the CPU decodes that tap into a memory address (one instruction), loads the message buffer (another instruction), encrypts one block of text (dozens of instructions). Each instruction = one threshold crossing × billions of transistors.',
    real: 'Every time your phone unlocks, processes a tap, or executes a clock cycle — billions of transistors cross this threshold. A 3.78 GHz processor means each transistor crosses threshold roughly 3.78 billion times per second. The sharpness of this transition defines how clean the logic signal is.',
  },
  linear: {
    label: 'Linear',
    sub: 'V_GS > V_t · V_DS < V_GS − V_t',
    headline: 'Channel is full. Behaves like a resistor.',
    explain: 'The channel is fully open and uniform. I_D = k_n[(V_GS−V_t)·V_DS − ½V_DS²]. Both V_GS and V_DS control current here. The transistor is ON and conducting.',
    formula: 'I_D = kₙ[(V_GS − V_t)·V_DS − ½V_DS²]',
    chip: 'Transistor ON · conducting · stores binary 1',
    phone: 'Active compute · app running, frame rendering, GPS solving',
    phoneDetail: 'You open Instagram. The GPU renders 60 frames per second — each frame requires millions of transistors fully ON, passing current like open taps. Scrolling = billions of taps opening and closing every 16 milliseconds.',
    real: 'Transistors in linear region are fully ON — binary 1 in digital logic. When the processor runs an app, executes code, renders a frame — transistors are switching between cutoff and linear billions of times per second. Each switch = one bit of computation.',
  },
  saturation: {
    label: 'Saturation',
    sub: 'V_GS > V_t · V_DS ≥ V_GS − V_t',
    headline: 'Channel pinched off. I_D set by V_GS only.',
    explain: 'V_DS ≥ V_GS−V_t — pinch-off has occurred. I_D = ½kₙ(V_GS−V_t)². V_GS controls the current; increasing V_DS just shifts the pinch point. This independence is what makes saturation useful for amplifiers.',
    formula: 'I_D = ½kₙ(V_GS − V_t)²',
    chip: 'Analog amplification · current ∝ V_GS',
    phone: 'Audio amp, 5G RF front-end, camera sensor readout',
    phoneDetail: 'You take a photo. The camera sensor\'s amplifier transistors sit in saturation — converting tiny light-generated voltages into readable signals. Your 5G modem\'s RF transistors amplify the antenna signal from microvolts to millivolts. Saturation = precision analog control.',
    real: 'Audio amplifiers, the RF front-end receiving your 5G signal, op-amps inside the camera sensor — all operate MOSFETs in saturation. A small variation in V_GS produces a large, proportional variation in I_D. That is amplification.',
  },
}
