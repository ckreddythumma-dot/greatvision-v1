'use client'
import { useState, useEffect } from 'react'
import { diodeRegion, diodeCurrent, DIODE_PRESETS, REGION_NUM_DIODE, DIODE_STATE_COPY } from '@/lib/diode-physics'
import DiodeCrossSection from './DiodeCrossSection'

const REGION_LABELS = {
  'reverse': 'Reverse',
  'zero-bias': 'Zero Bias',
  'forward-weak': 'Forward (weak)',
  'forward-strong': 'Forward (strong)',
  'breakdown': 'Breakdown',
}

export default function PNVizTab({ forceRegion }) {
  const [voltage, setVoltage] = useState(0.0)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    if (!forceRegion) return
    const p = DIODE_PRESETS[forceRegion]
    if (p) setVoltage(p.v)
  }, [forceRegion])

  const region = diodeRegion(voltage)
  const current = diodeCurrent(voltage)
  const copy = DIODE_STATE_COPY[region]

  const formatCurrent = (I) => {
    const abs = Math.abs(I)
    if (abs < 1e-9) return `${(I * 1e12).toFixed(1)} pA`
    if (abs < 1e-6) return `${(I * 1e9).toFixed(1)} nA`
    if (abs < 1e-3) return `${(I * 1e6).toFixed(1)} uA`
    return `${(I * 1e3).toFixed(2)} mA`
  }

  const jumpTo = (key) => {
    const p = DIODE_PRESETS[key]
    if (p) setVoltage(p.v)
  }
  const onV = (v) => setVoltage(Math.max(-6, Math.min(1.0, +v)))

  return (
    <article className="viz-tab" data-region={region}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the diagram <em>is</em> the explanation</span>
        <span className="mono theory__progress">always labelled · always live</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(40px,4.4vw,64px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'18ch'}}>
          A PN junction cross-section. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Every part is labelled. Change V and the depletion region,
          carrier flow, and current rewrite themselves in real time.
        </p>
      </header>

      {/* main stage */}
      <section className="vizstage" data-region={region}>
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="mono vizstage__statenum">{REGION_NUM_DIODE[region]}</span>
            <span className="serif vizstage__statename">{copy.label}</span>
            <span className="mono vizstage__statesub">{copy.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>I</span>
            <span className="serif vizstage__id">{formatCurrent(current)}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <DiodeCrossSection voltage={voltage} region={region} showLabels={showLabels}/>
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

      {/* controls */}
      <section className="vizctrl">
        <div className="vizctrl__row" style={{gridTemplateColumns:'1fr'}}>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V (applied)</span>
              <input className="mono vizctrl__num" type="number" step="0.1" min="-6" max="1.0"
                value={voltage.toFixed(2)} onChange={e => onV(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="-6" max="1.0" step="0.01" value={voltage}
                   onChange={e => onV(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span style={{color:'var(--bad)'}}>-6.0 (breakdown)</span>
              <span>0.00</span>
              <span style={{color:'var(--accent)'}}>+1.0 (forward)</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to mode →</span>
          <div className="vizctrl__quickbtns">
            {['reverse','zero-bias','forward-weak','forward-strong','breakdown'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${region === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{REGION_NUM_DIODE[r]}</span>
                <span className="serif vizctrl__jumpname">{REGION_LABELS[r]}</span>
              </button>
            ))}
          </div>
          <button className={`viz-toolbtn ${showLabels ? 'is-on' : ''}`} onClick={() => setShowLabels(s => !s)}>
            {showLabels ? '✕ hide labels' : '+ show labels'}
          </button>
        </div>
      </section>

      {/* real-world consequence */}
      <section className="vizrw">
        <div className="theory__rubric" style={{marginBottom:16}}>
          <span className="rubric">Consequence in the world</span>
        </div>
        <div className="vizrw__body">
          <h3 className="serif vizrw__head">
            One <em>{copy.label.toLowerCase()}</em> diode at this instant —
          </h3>
          <p className="vizrw__copy">{copy.real}</p>
          {copy.phoneDetail && (
            <div className="vizrw__phone">
              <div className="vizrw__phone-icon">📱</div>
              <div>
                <div className="eyebrow" style={{marginBottom:4}}>In your phone right now</div>
                <p className="vizrw__phone-text">{copy.phoneDetail}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'48px 0 32px'}}/>

      {/* chip-scale impact */}
      <section className="chipscale">
        <div className="rubric">Chip-scale impact</div>
        <h2 className="serif chipscale__head">
          One diode <span className="chipscale__x">×</span> <em>every I/O pin</em>
        </h2>
        <p className="chipscale__sub">
          The A19 Pro has hundreds of I/O pads, each with ESD protection diodes.
          Plus ~19 billion parasitic body diodes — one per MOSFET.
        </p>

        <div className="chipscale__table">
          <div className="chipscale__row chipscale__row--head">
            <div className="mono">Mode</div>
            <div className="mono">What the chip is doing</div>
            <div className="mono">What the phone is doing</div>
          </div>
          {['reverse','zero-bias','forward-weak','forward-strong','breakdown'].map(r => {
            const c = DIODE_STATE_COPY[r]
            const active = region === r
            return (
              <div key={r} className={`chipscale__row ${active ? 'is-active' : ''}`} onClick={() => jumpTo(r)}>
                <div className="chipscale__state">
                  <span className="mono chipscale__statenum">{REGION_NUM_DIODE[r]}</span>
                  <span className="serif chipscale__statename">{c.label}</span>
                  <span className="mono chipscale__statesub">{c.sub}</span>
                </div>
                <div className="chipscale__cell"><span className="serif" style={{fontSize:18}}>{c.chip}</span></div>
                <div className="chipscale__cell"><span className="serif" style={{fontSize:18, fontStyle:'italic'}}>{c.phone}</span></div>
                {active && <div className="chipscale__tag mono">you are here</div>}
              </div>
            )
          })}
        </div>
      </section>
    </article>
  )
}
