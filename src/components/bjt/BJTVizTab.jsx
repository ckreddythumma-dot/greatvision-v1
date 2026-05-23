'use client'
import { useState, useEffect } from 'react'
import { bjtRegion, bjtIC, BJT_PRESETS, REGION_NUM_BJT, BJT_STATE_COPY } from '@/lib/bjt-physics'
import BJTCrossSection from './BJTCrossSection'

const REGION_LABELS = {
  'cutoff': 'Cutoff',
  'active': 'Forward Active',
  'saturation': 'Saturation',
}

export default function BJTVizTab({ forceRegion }) {
  const [vbe, setVbe] = useState(0.0)
  const [vce, setVce] = useState(3.0)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    if (!forceRegion) return
    const p = BJT_PRESETS[forceRegion]
    if (p) { setVbe(p.vbe); setVce(p.vce) }
  }, [forceRegion])

  const region = bjtRegion(vbe, vce)
  const ib = vbe >= 0.65 ? (vbe - 0.7 + 0.05) * 20e-6 / 0.05 : 0
  const ic = region === 'cutoff' ? 0 : region === 'active' ? bjtIC(Math.max(0, ib), 100) : 0.8e-3
  const copy = BJT_STATE_COPY[region]

  const formatCurrent = (I) => {
    const abs = Math.abs(I)
    if (abs < 1e-9) return '0 A'
    if (abs < 1e-6) return `${(I * 1e6).toFixed(1)} μA`
    if (abs < 1e-3) return `${(I * 1e3).toFixed(2)} mA`
    return `${(I * 1e3).toFixed(1)} mA`
  }

  const jumpTo = (key) => {
    const p = BJT_PRESETS[key]
    if (p) { setVbe(p.vbe); setVce(p.vce) }
  }
  const onVbe = (v) => setVbe(Math.max(0, Math.min(0.85, +v)))
  const onVce = (v) => setVce(Math.max(0, Math.min(5.0, +v)))

  return (
    <article className="viz-tab" data-region={region}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the diagram <em>is</em> the explanation</span>
        <span className="mono theory__progress">always labelled · always live</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(40px,4.4vw,64px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'18ch'}}>
          An npn BJT cross-section. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Every region is labelled. Change V<sub>BE</sub> and V<sub>CE</sub> and the
          carrier flow, depletion regions, and current rewrite themselves in real time.
        </p>
      </header>

      <section className="vizstage" data-region={region}>
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="mono vizstage__statenum">{REGION_NUM_BJT[region]}</span>
            <span className="serif vizstage__statename">{copy.label}</span>
            <span className="mono vizstage__statesub">{copy.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>I_C</span>
            <span className="serif vizstage__id">{formatCurrent(ic)}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <BJTCrossSection region={region} showLabels={showLabels}/>
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
        <div className="vizctrl__row" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_BE</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="0.85"
                value={vbe.toFixed(2)} onChange={e => onVbe(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="0.85" step="0.01" value={vbe}
                   onChange={e => onVbe(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--ink-mute)'}}>0.7 (on)</span>
              <span style={{color:'var(--accent)'}}>0.85</span>
            </div>
          </div>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_CE</span>
              <input className="mono vizctrl__num" type="number" step="0.1" min="0" max="5.0"
                value={vce.toFixed(2)} onChange={e => onVce(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="5.0" step="0.01" value={vce}
                   onChange={e => onVce(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span style={{color:'var(--ok)'}}>0.0 (sat)</span>
              <span>2.5</span>
              <span>5.0</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to mode →</span>
          <div className="vizctrl__quickbtns">
            {['cutoff','active','saturation'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${region === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{REGION_NUM_BJT[r]}</span>
                <span className="serif vizctrl__jumpname">{REGION_LABELS[r]}</span>
              </button>
            ))}
          </div>
          <button className={`viz-toolbtn ${showLabels ? 'is-on' : ''}`} onClick={() => setShowLabels(s => !s)}>
            {showLabels ? '✕ hide labels' : '+ show labels'}
          </button>
        </div>
      </section>

      <section className="vizrw">
        <div className="theory__rubric" style={{marginBottom:16}}>
          <span className="rubric">Consequence in the world</span>
        </div>
        <div className="vizrw__body">
          <h3 className="serif vizrw__head">
            One <em>{copy.label.toLowerCase()}</em> BJT at this instant —
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

      <section className="chipscale">
        <div className="rubric">Chip-scale impact</div>
        <h2 className="serif chipscale__head">
          One BJT <span className="chipscale__x">×</span> <em>every analog block</em>
        </h2>
        <p className="chipscale__sub">
          The A19 Pro uses BJTs in its bandgap reference, current mirrors,
          temperature sensors, and ESD protection — hundreds of critical analog circuits.
        </p>

        <div className="chipscale__table">
          <div className="chipscale__row chipscale__row--head">
            <div className="mono">Mode</div>
            <div className="mono">What the chip is doing</div>
            <div className="mono">What the phone is doing</div>
          </div>
          {['cutoff','active','saturation'].map(r => {
            const c = BJT_STATE_COPY[r]
            const active = region === r
            return (
              <div key={r} className={`chipscale__row ${active ? 'is-active' : ''}`} onClick={() => jumpTo(r)}>
                <div className="chipscale__state">
                  <span className="mono chipscale__statenum">{REGION_NUM_BJT[r]}</span>
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
