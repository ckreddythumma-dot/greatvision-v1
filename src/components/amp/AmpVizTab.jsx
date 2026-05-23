'use client'
import { useState, useEffect } from 'react'
import { transconductance, csGain, drainCurrent, AMP_PRESETS, REGION_NUM_AMP, AMP_STATE_COPY } from '@/lib/amp-physics'
import AmpCircuit from './AmpCircuit'

const Vt = 0.4
const kn = 4

const REGION_LABELS = {
  'cutoff': 'Cutoff',
  'low-gain': 'Low Gain',
  'mid-gain': 'Mid Gain',
  'high-gain': 'High Gain',
}

function ampRegionFromVGS(vgs) {
  if (vgs < Vt) return 'cutoff'
  if (vgs < 0.55) return 'low-gain'
  if (vgs < 0.75) return 'mid-gain'
  return 'high-gain'
}

export default function AmpVizTab({ forceRegion }) {
  const [vgs, setVgs] = useState(0.2)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    if (!forceRegion) return
    const p = AMP_PRESETS[forceRegion]
    if (p) setVgs(p.vgs)
  }, [forceRegion])

  const region = ampRegionFromVGS(vgs)
  const gm = transconductance(kn, vgs, Vt)
  const RD = 5
  const gain = Math.abs(csGain(gm, RD))
  const id = drainCurrent(kn, vgs, Vt)
  const copy = AMP_STATE_COPY[region]

  const jumpTo = (key) => {
    const p = AMP_PRESETS[key]
    if (p) setVgs(p.vgs)
  }
  const onVgs = (v) => setVgs(Math.max(0, Math.min(1.2, +v)))

  return (
    <article className="viz-tab" data-region={region}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the diagram <em>is</em> the explanation</span>
        <span className="mono theory__progress">always labelled · always live</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(40px,4.4vw,64px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'18ch'}}>
          A common-source amplifier. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Change V<sub>GS</sub> and watch the gain, current, and output signal
          respond in real time. The signal amplitude shows the actual gain.
        </p>
      </header>

      <section className="vizstage" data-region={region}>
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="mono vizstage__statenum">{REGION_NUM_AMP[region]}</span>
            <span className="serif vizstage__statename">{copy.label}</span>
            <span className="mono vizstage__statesub">{copy.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>|A_v|</span>
            <span className="serif vizstage__id">{gain.toFixed(1)}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <AmpCircuit region={region} showLabels={showLabels}/>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">What is happening now</div>
            <h3 className="serif vizexplain__head"><em>{copy.headline}</em></h3>
          </div>
          <p className="vizexplain__body">{copy.explain}</p>
          <div className="vizexplain__formula mono">{copy.formula}</div>
        </div>

        <div className="vizstage__metrics">
          <div className="vizmetric">
            <span className="eyebrow">g_m</span>
            <span className="mono vizmetric__val">{gm.toFixed(2)} mA/V</span>
          </div>
          <div className="vizmetric">
            <span className="eyebrow">I_D</span>
            <span className="mono vizmetric__val">{id.toFixed(3)} mA</span>
          </div>
          <div className="vizmetric">
            <span className="eyebrow">V_ov</span>
            <span className="mono vizmetric__val">{Math.max(0, vgs - Vt).toFixed(2)} V</span>
          </div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row" style={{gridTemplateColumns:'1fr'}}>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_GS (bias)</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="1.2"
                value={vgs.toFixed(2)} onChange={e => onVgs(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="1.2" step="0.01" value={vgs}
                   onChange={e => onVgs(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--ink-mute)'}}>V_t = {Vt}</span>
              <span style={{color:'var(--accent)'}}>1.20</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to mode →</span>
          <div className="vizctrl__quickbtns">
            {['cutoff','low-gain','mid-gain','high-gain'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${region === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{REGION_NUM_AMP[r]}</span>
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
            One <em>{copy.label.toLowerCase()}</em> amplifier at this instant —
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
          One amplifier <span className="chipscale__x">×</span> <em>every signal path</em>
        </h2>
        <p className="chipscale__sub">
          The A19 Pro has thousands of amplifier stages — audio, sensor readout,
          PLL, ADC drivers — each tuned for the right gain-bandwidth trade-off.
        </p>

        <div className="chipscale__table">
          <div className="chipscale__row chipscale__row--head">
            <div className="mono">Mode</div>
            <div className="mono">What the chip is doing</div>
            <div className="mono">What the phone is doing</div>
          </div>
          {['cutoff','low-gain','mid-gain','high-gain'].map(r => {
            const c = AMP_STATE_COPY[r]
            const active = region === r
            return (
              <div key={r} className={`chipscale__row ${active ? 'is-active' : ''}`} onClick={() => jumpTo(r)}>
                <div className="chipscale__state">
                  <span className="mono chipscale__statenum">{REGION_NUM_AMP[r]}</span>
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
