'use client'
import { useState } from 'react'

const REGIONS = {
  cutoff: { label: 'Cutoff', sub: 'Both junctions reverse-biased', headline: 'Transistor is OFF.', explain: 'V_BE < 0.7V. The base-emitter junction is not forward biased. No base current flows, so no collector current flows. The transistor is an open switch — like a faucet with the handle fully closed.', formula: 'I_C = 0, I_B = 0', color: 'var(--ink-mute)', real: 'In cutoff, the BJT acts as an open circuit between collector and emitter. In the A19 Pro, BJTs in bandgap references are kept just above cutoff to maintain precise voltage regulation.', phone: 'Voltage references hold steady.' },
  active: { label: 'Active', sub: 'BE forward, BC reverse', headline: 'Linear amplification.', explain: 'V_BE ≈ 0.7V, V_CE > V_CE(sat). The base-emitter junction is forward biased, injecting electrons into the base. Most diffuse to the collector. A small base current controls a much larger collector current: I_C = beta * I_B.', formula: 'I_C = β · I_B, β ≈ 100-300', color: 'var(--accent)', real: 'In the active region, the BJT amplifies. A 10μA base current becomes 1mA of collector current. Bandgap reference circuits on the A19 Pro use this to generate a temperature-stable 1.2V reference.', phone: 'Analog circuits deliver precision.' },
  saturation: { label: 'Saturation', sub: 'Both junctions forward-biased', headline: 'Switch is ON.', explain: 'V_CE drops to ~0.2V. Both junctions are forward biased. The collector is flooded with carriers. I_C no longer depends on I_B — the transistor is a closed switch with minimal voltage drop. More base current does not increase collector current.', formula: 'V_CE(sat) ≈ 0.2V, I_C = V_CC/R_C', color: 'var(--ok)', real: 'In saturation, the BJT is a switch with only 0.2V drop. BiCMOS processes on advanced chips use saturated BJTs for high-speed I/O drivers where CMOS alone cannot deliver enough current.', phone: 'High-speed I/O drives data.' },
}

const PRESETS = { cutoff: { vbe: 0.3, vce: 2.0 }, active: { vbe: 0.72, vce: 3.0 }, saturation: { vbe: 0.80, vce: 0.15 } }
const REGION_NUM = { cutoff: '01', active: '02', saturation: '03' }

function getRegion(vbe, vce) {
  if (vbe < 0.6) return 'cutoff'
  if (vce < 0.3) return 'saturation'
  return 'active'
}

export default function BJTViz() {
  const [vbe, setVbe] = useState(0.72)
  const [vce, setVce] = useState(3.0)
  const region = getRegion(vbe, vce)
  const copy = REGIONS[region]
  const beta = 150
  const ib = region === 'cutoff' ? 0 : (vbe - 0.6) * 0.1
  const ic = region === 'cutoff' ? 0 : region === 'saturation' ? 5.0 / 1.0 : ib * beta

  const jumpTo = (key) => { const p = PRESETS[key]; setVbe(p.vbe); setVce(p.vce) }

  return (
    <article className="viz-tab" data-region={region}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the transistor is alive</span>
        <span className="mono theory__progress">drag sliders · watch carriers flow</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'20ch'}}>
          A BJT cross-section. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Change V<sub>BE</sub> and V<sub>CE</sub> to see the BJT move through cutoff, active, and saturation. Watch electrons flow from emitter to collector.
        </p>
      </header>

      <section className="vizstage" data-region={region}>
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="mono vizstage__statenum">{REGION_NUM[region]}</span>
            <span className="serif vizstage__statename">{copy.label}</span>
            <span className="mono vizstage__statesub">{copy.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>I_C</span>
            <span className="serif vizstage__id">{ic.toFixed(2)}<span className="mono vizstage__idunit">mA</span></span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox="0 0 600 360" width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            {/* Emitter region (N-type, bottom-left) */}
            <rect x="60" y="220" width="160" height="100" fill="rgba(58,110,165,0.12)" stroke="rgba(58,110,165,0.35)"/>
            <text x="140" y="215" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#3A6EA5" letterSpacing="0.08em">EMITTER (N)</text>

            {/* Base region (P-type, center) */}
            <rect x="220" y="120" width="80" height="200" fill="rgba(199,75,80,0.12)" stroke="rgba(199,75,80,0.35)"/>
            <text x="260" y="110" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#C74B50" letterSpacing="0.08em">BASE (P)</text>

            {/* Collector region (N-type, right) */}
            <rect x="300" y="120" width="200" height="100" fill="rgba(58,110,165,0.12)" stroke="rgba(58,110,165,0.35)"/>
            <text x="400" y="110" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#3A6EA5" letterSpacing="0.08em">COLLECTOR (N)</text>

            {/* BE Junction line */}
            <line x1="220" y1="218" x2="220" y2="322" stroke="var(--ink-mute)" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
            <text x="220" y="336" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-faint)">BE JUNCTION</text>

            {/* BC Junction line */}
            <line x1="300" y1="118" x2="300" y2="222" stroke="var(--ink-mute)" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
            <text x="300" y="236" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-faint)">BC JUNCTION</text>

            {/* Electron flow from E to C through B */}
            {region !== 'cutoff' && (
              <g>
                {Array.from({length: region === 'saturation' ? 10 : 6}).map((_, i) => (
                  <circle key={`ec${i}`} r="3.5" fill="#3A6EA5" opacity="0.7">
                    <animate attributeName="cx" values="140;260;430" dur={region === 'saturation' ? '1s' : '1.6s'}
                             repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                    <animate attributeName="cy" values={`${250 + (i%3)*15};${170 + (i%2)*20};${165 + ((i+1)%3)*15}`}
                             dur={region === 'saturation' ? '1s' : '1.6s'} repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                    <animate attributeName="opacity" values="0;0.8;0.7;0" dur={region === 'saturation' ? '1s' : '1.6s'}
                             repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                  </circle>
                ))}
              </g>
            )}

            {/* Base current - holes entering from left */}
            {region !== 'cutoff' && (
              <g>
                {Array.from({length: 2}).map((_, i) => (
                  <circle key={`bh${i}`} r="3" fill="#C74B50" opacity="0.6">
                    <animate attributeName="cx" values="220;260" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.5}s`}/>
                    <animate attributeName="cy" values={`${180 + i*30};${190 + i*25}`} dur="1.2s" repeatCount="indefinite" begin={`${i * 0.5}s`}/>
                    <animate attributeName="opacity" values="0.7;0.3;0" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.5}s`}/>
                  </circle>
                ))}
              </g>
            )}

            {/* Cutoff indicator */}
            {region === 'cutoff' && (
              <g>
                <text x="300" y="180" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="var(--ink-mute)" letterSpacing="0.1em">
                  NO CARRIER FLOW
                </text>
                <line x1="170" y1="270" x2="440" y2="270" stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="5,4"/>
              </g>
            )}

            {/* Saturation glow */}
            {region === 'saturation' && (
              <rect x="220" y="120" width="80" height="200" fill="none" stroke="var(--ok)" strokeWidth="2" opacity="0.3">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.2s" repeatCount="indefinite"/>
              </rect>
            )}

            {/* Active region indicator - gain arrow */}
            {region === 'active' && (
              <g transform="translate(520, 140)">
                <text x="0" y="0" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--accent)" letterSpacing="0.04em">GAIN</text>
                <text x="0" y="20" textAnchor="middle" fontFamily="Instrument Serif" fontSize="24" fill="var(--accent)">
                  x{beta}
                </text>
                <text x="0" y="38" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-mute)">I_C/I_B</text>
              </g>
            )}

            {/* Terminal contacts */}
            <rect x="100" y="320" width="80" height="20" rx="2" fill="var(--surface)" stroke="var(--rule-strong)"/>
            <text x="140" y="355" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">E</text>
            <rect x="230" y="88" width="60" height="20" rx="2" fill="var(--surface)" stroke="var(--rule-strong)"/>
            <text x="260" y="82" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">B</text>
            <rect x="370" y="88" width="80" height="20" rx="2" fill="var(--surface)" stroke="var(--rule-strong)"/>
            <text x="410" y="82" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">C</text>

            {/* Status badge */}
            {<g>
              <rect x="170" y="60" width="260" height="24" rx="3" fill={copy.color} opacity="0.1"/>
              <text x="300" y="76" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={copy.color} letterSpacing="0.06em">
                {region === 'active' ? `ACTIVE · I_C = ${ic.toFixed(1)} mA · AMPLIFYING` :
                 region === 'saturation' ? 'SATURATED · SWITCH ON · V_CE ≈ 0.2V' :
                 'CUTOFF · SWITCH OFF · I_C = 0'}
              </text>
            </g>}
          </svg>
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
              <span className="eyebrow">V_BE</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="1.0"
                value={vbe.toFixed(2)} onChange={e => setVbe(Math.max(0, Math.min(1.0, +e.target.value)))}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="1.0" step="0.01" value={vbe}
                   onChange={e => setVbe(+e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--amber-ink)'}}>V_on = 0.7</span>
              <span>1.00</span>
            </div>
          </div>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_CE</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="5.0"
                value={vce.toFixed(2)} onChange={e => setVce(Math.max(0, Math.min(5.0, +e.target.value)))}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="5.0" step="0.05" value={vce}
                   onChange={e => setVce(+e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--amber-ink)'}}>V_CE(sat) = 0.2</span>
              <span>5.00</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to region</span>
          <div className="vizctrl__quickbtns">
            {['cutoff','active','saturation'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${region === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{REGION_NUM[r]}</span>
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
          <h3 className="serif vizrw__head">One <em>{copy.label.toLowerCase()}</em> BJT —</h3>
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
