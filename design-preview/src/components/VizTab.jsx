'use client'
import { useState, useEffect } from 'react'
import { mosfetRegion, mosfetID, VIZ_PRESETS, STATE_COPY } from '@/lib/physics'
import MOSFETStage from '@/components/MOSFETStage'

const REGION_NUM = { cutoff:'01', threshold:'02', linear:'03', saturation:'04' }

export default function VizTab({ forceRegion }) {
  const VT = 0.30, KN = 25

  const [vgs, setVgs] = useState(0.65)
  const [vds, setVds] = useState(0.18)
  const [showLabels, setShowLabels] = useState(true)
  const [showRWB, setShowRWB] = useState(true)

  useEffect(() => {
    if (!forceRegion) return
    const p = VIZ_PRESETS[forceRegion]
    if (p) { setVgs(p.vgs); setVds(p.vds) }
  }, [forceRegion])

  const region = mosfetRegion(vgs, vds, VT)
  const id_mA = mosfetID(vgs, vds, VT, KN)
  const copy = STATE_COPY[region]

  const jumpTo = (key) => { const p = VIZ_PRESETS[key]; setVgs(p.vgs); setVds(p.vds) }
  const onVgs = (v) => setVgs(Math.max(0, Math.min(1.2, +v)))
  const onVds = (v) => setVds(Math.max(0, Math.min(1.5, +v)))

  return (
    <article className="viz-tab" data-region={region}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the diagram <em>is</em> the explanation</span>
        <span className="mono theory__progress">always labelled · always live</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(40px,4.4vw,64px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'18ch'}}>
          A MOSFET cross-section. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Biology-textbook style. Every part is labelled with a one-line definition that never disappears.
          Change V<sub>GS</sub> or V<sub>DS</sub> and the diagram rewrites itself.
        </p>
      </header>

      {/* main stage */}
      <section className="vizstage" data-region={region}>
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="mono vizstage__statenum">{REGION_NUM[region]}</span>
            <span className="serif vizstage__statename">{copy.label}</span>
            <span className="mono vizstage__statesub">{copy.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>I_D</span>
            <span className="serif vizstage__id">{id_mA.toFixed(2)}<span className="mono vizstage__idunit">mA</span></span>
          </div>
        </div>

        <div className="vizstage__stage">
          <MOSFETStage vgs={vgs} vds={vds} vt={VT} k={KN} showLabels={showLabels} region={region}/>
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
        <div className="vizctrl__row">
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_GS</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="1.2"
                value={vgs.toFixed(2)} onChange={e => onVgs(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="1.2" step="0.01" value={vgs}
                   onChange={e => onVgs(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--amber-ink)'}}>V_t = 0.30</span>
              <span>1.20</span>
            </div>
          </div>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_DS</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="1.5"
                value={vds.toFixed(2)} onChange={e => onVds(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="1.5" step="0.01" value={vds}
                   onChange={e => onVds(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--amber-ink)'}}>V_DS(sat) = {Math.max(0, vgs - VT).toFixed(2)}</span>
              <span>1.50</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to region</span>
          <div className="vizctrl__quickbtns">
            {['cutoff','threshold','linear','saturation'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${region === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{REGION_NUM[r]}</span>
                <span className="serif vizctrl__jumpname">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
              </button>
            ))}
          </div>
          <button className={`viz-toolbtn ${showLabels ? 'is-on' : ''}`} onClick={() => setShowLabels(s => !s)}>
            {showLabels ? 'hide labels' : '+ show labels'}
          </button>
        </div>
      </section>

      {/* real-world consequence */}
      <section className="vizrw">
        <div className="theory__rubric" style={{marginBottom:16}}>
          <span className="rubric">Consequence in the world</span>
          <button className="mono vizrw__toggle" onClick={() => setShowRWB(v => !v)}>
            {showRWB ? '- collapse' : '+ expand'}
          </button>
        </div>
        {showRWB && (
          <div className="vizrw__body">
            <h3 className="serif vizrw__head">
              One <em>{copy.label.toLowerCase()}</em> transistor at this instant —
            </h3>
            <p className="vizrw__copy">{copy.real}</p>
            {copy.phoneDetail && (
              <div className="vizrw__phone">
                <div className="vizrw__phone-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="2" width="14" height="20" rx="3"/>
                    <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="eyebrow" style={{marginBottom:4}}>In your phone right now</div>
                  <p className="vizrw__phone-text">{copy.phoneDetail}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <hr className="rule-strong" style={{margin:'48px 0 32px'}}/>

      {/* chip-scale impact */}
      <section className="chipscale">
        <div className="rubric">Chip-scale impact</div>
        <h2 className="serif chipscale__head">
          One transistor <span className="chipscale__x">x</span> <em>19,000,000,000</em>
        </h2>
        <p className="chipscale__sub">
          A flagship mobile SoC packs ~19 billion MOSFETs on one die. Every state you just saw
          plays out simultaneously across the die, every clock cycle.
        </p>

        <div className="chipscale__table">
          <div className="chipscale__row chipscale__row--head">
            <div className="mono">State</div>
            <div className="mono">What the chip is doing</div>
            <div className="mono">What the phone is doing</div>
          </div>
          {['cutoff','threshold','linear','saturation'].map(r => {
            const c = STATE_COPY[r]
            const active = region === r
            return (
              <div key={r} className={`chipscale__row ${active ? 'is-active' : ''}`} onClick={() => jumpTo(r)}>
                <div className="chipscale__state">
                  <span className="mono chipscale__statenum">{REGION_NUM[r]}</span>
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

        <div className="chipscale__narration">
          <p className="serif chipscale__nartext">
            Clock speed is how many times per second each transistor <em>crosses threshold</em>.
            At 3.78 GHz, each of the 19 billion transistors switches 3,780,000,000 times per
            second. Every switch is one bit.
          </p>
          <div className="chipscale__bignum">
            <div className="eyebrow">switches per second · whole die</div>
            <div className="serif chipscale__bigval">7.18 x 10<sup>19</sup></div>
            <div className="mono chipscale__bigsub">19 x 10^9 transistors x 3.78 x 10^9 Hz</div>
          </div>
        </div>
      </section>
    </article>
  )
}
