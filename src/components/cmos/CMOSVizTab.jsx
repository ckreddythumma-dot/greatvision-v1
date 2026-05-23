'use client'
import { useState, useEffect } from 'react'
import { cmosRegion, cmosVout, CMOS_PRESETS, REGION_NUM_CMOS, CMOS_STATE_COPY } from '@/lib/cmos-physics'
import CMOSCircuit from './CMOSCircuit'

const VDD = 1.0
const Vtn = 0.3
const Vtp = -0.3

const REGION_LABELS = {
  'region1': 'PMOS ON',
  'region2': 'Transition ↓',
  'region3': 'Both Saturated',
  'region4': 'Transition ↓',
  'region5': 'NMOS ON',
}

export default function CMOSVizTab({ forceRegion }) {
  const [vin, setVin] = useState(0.0)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    if (!forceRegion) return
    const p = CMOS_PRESETS[forceRegion]
    if (p) setVin(p.vin)
  }, [forceRegion])

  const region = cmosRegion(vin, VDD, Vtn, Vtp)
  const vout = cmosVout(vin, VDD, Vtn, Vtp)
  const copy = CMOS_STATE_COPY[region]

  const jumpTo = (key) => {
    const p = CMOS_PRESETS[key]
    if (p) setVin(p.vin)
  }
  const onVin = (v) => setVin(Math.max(0, Math.min(1.0, +v)))

  return (
    <article className="viz-tab" data-region={region}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the diagram <em>is</em> the explanation</span>
        <span className="mono theory__progress">always labelled · always live</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(40px,4.4vw,64px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'18ch'}}>
          A CMOS inverter. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Sweep V<sub>in</sub> from 0 to V<sub>DD</sub> and watch the VTC unfold.
          See which transistor is ON, the current path, and V<sub>out</sub> in real time.
        </p>
      </header>

      <section className="vizstage" data-region={region}>
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="mono vizstage__statenum">{REGION_NUM_CMOS[region]}</span>
            <span className="serif vizstage__statename">{copy.label}</span>
            <span className="mono vizstage__statesub">{copy.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>V_out</span>
            <span className="serif vizstage__id">{vout.toFixed(2)} V</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <CMOSCircuit region={region} showLabels={showLabels}/>
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
        <div className="vizctrl__row" style={{gridTemplateColumns:'1fr'}}>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_in</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="1.0"
                value={vin.toFixed(2)} onChange={e => onVin(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="1.0" step="0.01" value={vin}
                   onChange={e => onVin(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00 (LOW)</span>
              <span style={{color:'var(--ink-mute)'}}>V_M = 0.50</span>
              <span style={{color:'var(--accent)'}}>1.00 (HIGH)</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to region →</span>
          <div className="vizctrl__quickbtns">
            {['region1','region2','region3','region4','region5'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${region === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{REGION_NUM_CMOS[r]}</span>
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
            One <em>{copy.label.toLowerCase()}</em> inverter at this instant —
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
          One inverter <span className="chipscale__x">×</span> <em>19 billion</em>
        </h2>
        <p className="chipscale__sub">
          Every logic gate — NAND, NOR, XOR, flip-flop — is built from CMOS inverters.
          The A19 Pro has 19 billion transistors, each switching at up to 4 GHz.
        </p>

        <div className="chipscale__table">
          <div className="chipscale__row chipscale__row--head">
            <div className="mono">Region</div>
            <div className="mono">What the chip is doing</div>
            <div className="mono">What the phone is doing</div>
          </div>
          {['region1','region2','region3','region4','region5'].map(r => {
            const c = CMOS_STATE_COPY[r]
            const active = region === r
            return (
              <div key={r} className={`chipscale__row ${active ? 'is-active' : ''}`} onClick={() => jumpTo(r)}>
                <div className="chipscale__state">
                  <span className="mono chipscale__statenum">{REGION_NUM_CMOS[r]}</span>
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
