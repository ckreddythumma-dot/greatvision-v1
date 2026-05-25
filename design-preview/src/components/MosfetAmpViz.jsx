'use client'
import { useState, useEffect, useRef } from 'react'

const STATES = {
  small: { label: 'Small Signal', sub: 'Linear amplification', headline: 'Clean gain.', explain: 'The input signal is small enough that the MOSFET stays in saturation throughout the swing. The output is a faithful, inverted, amplified copy of the input. Distortion is negligible — total harmonic distortion < 1%.', formula: 'A_v = -g_m · (R_D || r_o)', color: 'var(--ok)', real: 'Most audio and sensor signals are small-signal. The A19 Pro\'s analog front-end amplifies microphone signals from microvolts to millivolts with < 0.01% THD before the ADC digitizes them.', phone: 'Crystal-clear audio capture.' },
  moderate: { label: 'Moderate Signal', sub: 'Approaching nonlinearity', headline: 'Slight distortion.', explain: 'The signal swing is large enough that g_m changes across the cycle. The peaks clip slightly as the MOSFET approaches the triode/cutoff boundary. THD rises to 2-5%. Still usable but not hi-fi.', formula: 'A_v varies across swing, THD rises', color: 'var(--amber)', real: 'At moderate amplitudes, cascading stages must limit each stage\'s swing. In the A19 Pro, multi-stage amplifiers keep each stage in its linear range to preserve signal integrity across the chain.', phone: 'Multi-stage design keeps quality.' },
  clipping: { label: 'Clipping', sub: 'Output saturated', headline: 'Signal destroyed.', explain: 'The input is so large that the output hits the supply rails. The MOSFET swings between deep triode and cutoff. The output is a clipped square wave — all the signal information above the clip level is permanently lost. Harmonic distortion exceeds 10%.', formula: 'V_out clipped at V_DD and V_DS(sat)', color: 'var(--bad)', real: 'Clipping destroys information irreversibly. In the A19 Pro, automatic gain control (AGC) circuits detect when amplifiers approach clipping and reduce gain before distortion occurs.', phone: 'AGC prevents audio distortion.' },
}

const PRESETS = { small: { amp: 0.05, gain: 10 }, moderate: { amp: 0.15, gain: 10 }, clipping: { amp: 0.4, gain: 10 } }
const STATE_NUM = { small: '01', moderate: '02', clipping: '03' }

function getState(amp, gain) {
  const outPeak = amp * gain
  if (outPeak < 0.8) return 'small'
  if (outPeak < 1.8) return 'moderate'
  return 'clipping'
}

export default function MosfetAmpViz() {
  const [amp, setAmp] = useState(0.05)
  const [gain, setGain] = useState(10)
  const state = getState(amp, gain)
  const copy = STATES[state]
  const canvasRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    let t = 0
    let raf

    function draw() {
      t += 0.03
      ctx.clearRect(0, 0, W, H)

      const midY = H / 2
      const inH = H * 0.35
      const outPeak = Math.min(amp * gain, 2.0)
      const outH = H * 0.35

      ctx.strokeStyle = 'rgba(22,22,19,0.08)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke()
      ctx.setLineDash([4,4])
      ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke()
      ctx.setLineDash([])

      ctx.font = '10px "JetBrains Mono"'
      ctx.fillStyle = 'rgba(22,22,19,0.35)'
      ctx.textAlign = 'center'
      ctx.fillText('INPUT', W * 0.25, 16)
      ctx.fillText('OUTPUT', W * 0.75, 16)

      // Input waveform
      ctx.strokeStyle = '#3A6EA5'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = 10; x < W/2 - 10; x++) {
        const phase = (x / (W/2 - 20)) * Math.PI * 4 + t
        const y = midY - Math.sin(phase) * amp * inH * 4
        x === 10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Output waveform (inverted, amplified, possibly clipped)
      ctx.strokeStyle = state === 'clipping' ? '#B33A3A' : state === 'moderate' ? '#B08428' : '#2B7A4B'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = W/2 + 10; x < W - 10; x++) {
        const phase = (((x - W/2) / (W/2 - 20)) * Math.PI * 4) + t
        let y = midY + Math.sin(phase) * outPeak * outH * 1.5
        // Clipping
        if (y < midY - outH * 1.3) y = midY - outH * 1.3
        if (y > midY + outH * 1.3) y = midY + outH * 1.3
        x === W/2 + 10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Clip lines
      if (state === 'clipping') {
        ctx.strokeStyle = 'rgba(179,58,58,0.3)'
        ctx.lineWidth = 1
        ctx.setLineDash([3,3])
        ctx.beginPath()
        ctx.moveTo(W/2 + 10, midY - outH * 1.3)
        ctx.lineTo(W - 10, midY - outH * 1.3)
        ctx.moveTo(W/2 + 10, midY + outH * 1.3)
        ctx.lineTo(W - 10, midY + outH * 1.3)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.font = '9px "JetBrains Mono"'
        ctx.fillStyle = '#B33A3A'
        ctx.fillText('V_DD', W - 30, midY - outH * 1.3 - 6)
        ctx.fillText('GND', W - 30, midY + outH * 1.3 + 14)
      }

      // Gain arrow
      ctx.fillStyle = copy.color
      ctx.font = '11px "JetBrains Mono"'
      ctx.fillText(`|A_v| = ${gain}`, W/2, H - 12)

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [amp, gain, state, copy.color])

  const jumpTo = (key) => { const p = PRESETS[key]; setAmp(p.amp); setGain(p.gain) }

  return (
    <article className="viz-tab" data-region={state}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the amplifier is alive</span>
        <span className="mono theory__progress">drag sliders · watch the signal</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          A CS amplifier. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Change the input amplitude and gain. Watch the output waveform — it inverts, amplifies, and eventually clips when driven too hard.
        </p>
      </header>

      <section className="vizstage" data-region={state}>
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="mono vizstage__statenum">{STATE_NUM[state]}</span>
            <span className="serif vizstage__statename">{copy.label}</span>
            <span className="mono vizstage__statesub">{copy.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>|A_v|</span>
            <span className="serif vizstage__id">{gain}<span className="mono vizstage__idunit">V/V</span></span>
          </div>
        </div>

        <div className="vizstage__stage" style={{background:'var(--paper)', borderRadius:8, padding:16}}>
          <canvas ref={canvasRef} width={700} height={280} style={{width:'100%', height:'auto', display:'block'}}/>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">What is happening now</div>
            <h3 className="serif vizexplain__head"><em>{copy.headline}</em></h3>
          </div>
          <p className="vizexplain__body">{copy.explain}</p>
          <div className="vizexplain__formula mono">{copy.formula}</div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row">
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_in (amplitude)</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0.01" max="0.5"
                value={amp.toFixed(2)} onChange={e => setAmp(Math.max(0.01, Math.min(0.5, +e.target.value)))}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0.01" max="0.5" step="0.01" value={amp}
                   onChange={e => setAmp(+e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.01</span><span>0.25</span><span>0.50</span>
            </div>
          </div>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">Gain |A_v|</span>
              <input className="mono vizctrl__num" type="number" step="1" min="1" max="30"
                value={gain} onChange={e => setGain(Math.max(1, Math.min(30, +e.target.value)))}/>
              <span className="mono vizctrl__unit">V/V</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={gain}
                   onChange={e => setGain(+e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>1</span><span>15</span><span>30</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to state</span>
          <div className="vizctrl__quickbtns">
            {['small','moderate','clipping'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${state === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{STATE_NUM[r]}</span>
                <span className="serif vizctrl__jumpname">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="vizrw">
        <div className="theory__rubric" style={{marginBottom:16}}>
          <span className="rubric">Consequence in the world</span>
        </div>
        <div className="vizrw__body">
          <h3 className="serif vizrw__head">A <em>{copy.label.toLowerCase()}</em> amplifier —</h3>
          <p className="vizrw__copy">{copy.real}</p>
          <div className="vizrw__phone">
            <div className="vizrw__phone-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="2" width="14" height="20" rx="3"/>
                <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="eyebrow" style={{marginBottom:4}}>In the A19 Pro</div>
              <p className="vizrw__phone-text">{copy.phone}</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
