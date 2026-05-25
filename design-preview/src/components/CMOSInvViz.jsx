'use client'
import { useState } from 'react'

const STATES = {
  low: { label: 'Input LOW', sub: 'V_in = 0', headline: 'Output HIGH.', explain: 'When V_in = 0, the PMOS gate-source voltage |V_GSp| = V_DD > |V_tp|, so PMOS is ON. The NMOS gate-source voltage V_GSn = 0 < V_tn, so NMOS is OFF. The output is pulled to V_DD through the PMOS. Static power dissipation is zero — no DC path from V_DD to ground.', formula: 'PMOS ON, NMOS OFF → V_out = V_DD', color: 'var(--ok)', real: 'With input LOW, the output is pulled to V_DD. Zero static current flows. This is why CMOS dominates digital — it only draws power during switching. The A19 Pro\'s 19 billion gates spend most of their time in this state.', phone: '36-hour battery life from zero standby power.' },
  transition: { label: 'Transition', sub: 'V_in ≈ V_DD/2', headline: 'Both partially ON.', explain: 'At the switching threshold (≈ V_DD/2 for symmetric sizing), both PMOS and NMOS are partially conducting. A direct path exists from V_DD to ground — this is the ONLY moment when significant static current flows. The output voltage is in the undefined logic region.', formula: 'I_peak = crowbar current, both ON', color: 'var(--bad)', real: 'During transition, crowbar current flows. The faster the input transitions, the less time both transistors spend ON together. At 3.78 GHz, each of 19 billion gates transitions twice per cycle — this is the dominant source of dynamic power in the A19 Pro.', phone: 'Fast transitions save battery.' },
  high: { label: 'Input HIGH', sub: 'V_in = V_DD', headline: 'Output LOW.', explain: 'When V_in = V_DD, V_GSn = V_DD > V_tn, so NMOS is ON. |V_GSp| = 0 < |V_tp|, so PMOS is OFF. The output is pulled to ground through the NMOS. Again, zero static power — no path from V_DD to GND.', formula: 'PMOS OFF, NMOS ON → V_out = 0', color: 'var(--accent)', real: 'With input HIGH, output is LOW — the inversion. Combined with the LOW-in/HIGH-out state, this gives CMOS its name. Every logic function (NAND, NOR, XOR) is built from cascaded inverters.', phone: 'Logic gates build every computation.' },
}

const PRESETS = { low: { vin: 0 }, transition: { vin: 0.45 }, high: { vin: 0.9 } }
const STATE_NUM = { low: '01', transition: '02', high: '03' }

function getState(vin, vdd) {
  const ratio = vin / vdd
  if (ratio < 0.35) return 'low'
  if (ratio > 0.65) return 'high'
  return 'transition'
}

export default function CMOSInvViz() {
  const vdd = 0.9
  const [vin, setVin] = useState(0)
  const state = getState(vin, vdd)
  const copy = STATES[state]
  const vout = state === 'low' ? vdd : state === 'high' ? 0 : vdd * (1 - vin/vdd)

  const pmosOn = vin < vdd * 0.5
  const nmosOn = vin > vdd * 0.4

  const jumpTo = (key) => setVin(PRESETS[key].vin)

  return (
    <article className="viz-tab" data-region={state}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the inverter is alive</span>
        <span className="mono theory__progress">drag V_in · watch the output flip</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          A CMOS inverter. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Slide V<sub>in</sub> from 0 to V<sub>DD</sub>. Watch PMOS and NMOS trade places. See the output voltage invert — and the dangerous moment when both are ON.
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
            <span className="eyebrow" style={{marginRight:8}}>V_out</span>
            <span className="serif vizstage__id">{vout.toFixed(2)}<span className="mono vizstage__idunit">V</span></span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox="0 0 600 400" width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            {/* V_DD rail */}
            <line x1="200" y1="40" x2="200" y2="80" stroke="var(--ink)" strokeWidth="2"/>
            <text x="200" y="30" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="var(--ok)">V_DD = {vdd}V</text>
            <line x1="160" y1="40" x2="240" y2="40" stroke="var(--ok)" strokeWidth="2"/>

            {/* PMOS */}
            <rect x="150" y="80" width="100" height="80" rx="6" fill={pmosOn ? 'rgba(43,122,75,0.12)' : 'rgba(22,22,19,0.03)'}
                  stroke={pmosOn ? 'var(--ok)' : 'var(--rule)'} strokeWidth={pmosOn ? 2 : 1}
                  style={{transition: 'all 300ms ease-out'}}/>
            <text x="200" y="115" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12"
                  fill={pmosOn ? 'var(--ok)' : 'var(--ink-mute)'} letterSpacing="0.06em" fontWeight={pmosOn ? 600 : 400}>
              PMOS
            </text>
            <text x="200" y="132" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9"
                  fill={pmosOn ? 'var(--ok)' : 'var(--ink-faint)'}>
              {pmosOn ? 'ON' : 'OFF'}
            </text>
            {pmosOn && (
              <rect x="150" y="80" width="100" height="80" rx="6" fill="none" stroke="var(--ok)" strokeWidth="2" opacity="0.3">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.4s" repeatCount="indefinite"/>
              </rect>
            )}

            {/* Connection PMOS to NMOS */}
            <line x1="200" y1="160" x2="200" y2="200" stroke="var(--ink)" strokeWidth="2"/>

            {/* Output node */}
            <circle cx="200" cy="200" r="5" fill={copy.color} stroke={copy.color}/>
            <line x1="205" y1="200" x2="320" y2="200" stroke="var(--ink)" strokeWidth="2"/>
            <text x="340" y="195" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">V_out</text>
            <text x="340" y="210" fontFamily="Instrument Serif" fontSize="20" fill={copy.color} fontStyle="italic">{vout.toFixed(2)}V</text>

            {/* NMOS */}
            <rect x="150" y="200" width="100" height="80" rx="6" fill={nmosOn ? 'rgba(58,110,165,0.12)' : 'rgba(22,22,19,0.03)'}
                  stroke={nmosOn ? 'var(--accent)' : 'var(--rule)'} strokeWidth={nmosOn ? 2 : 1}
                  style={{transition: 'all 300ms ease-out'}}/>
            <text x="200" y="235" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12"
                  fill={nmosOn ? 'var(--accent)' : 'var(--ink-mute)'} letterSpacing="0.06em" fontWeight={nmosOn ? 600 : 400}>
              NMOS
            </text>
            <text x="200" y="252" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9"
                  fill={nmosOn ? 'var(--accent)' : 'var(--ink-faint)'}>
              {nmosOn ? 'ON' : 'OFF'}
            </text>
            {nmosOn && (
              <rect x="150" y="200" width="100" height="80" rx="6" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.4s" repeatCount="indefinite"/>
              </rect>
            )}

            {/* GND rail */}
            <line x1="200" y1="280" x2="200" y2="320" stroke="var(--ink)" strokeWidth="2"/>
            <line x1="160" y1="320" x2="240" y2="320" stroke="var(--ink-mute)" strokeWidth="2"/>
            <text x="200" y="340" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="var(--ink-mute)">GND</text>

            {/* Gate input */}
            <line x1="50" y1="200" x2="150" y2="200" stroke="var(--ink)" strokeWidth="2"/>
            <line x1="90" y1="120" x2="150" y2="120" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4,3"/>
            <line x1="90" y1="120" x2="90" y2="240" stroke="var(--ink)" strokeWidth="1.5"/>
            <line x1="90" y1="240" x2="150" y2="240" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4,3"/>
            <text x="50" y="195" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">V_in</text>
            <text x="50" y="212" fontFamily="Instrument Serif" fontSize="18" fill={copy.color} fontStyle="italic">{vin.toFixed(2)}V</text>

            {/* Current flow arrows */}
            {pmosOn && state !== 'high' && (
              <g>
                {Array.from({length: 3}).map((_, i) => (
                  <circle key={`pc${i}`} r="3" fill="var(--ok)" opacity="0.6">
                    <animate attributeName="cy" values="60;190" dur="1s" repeatCount="indefinite" begin={`${i * 0.3}s`}/>
                    <animate attributeName="cx" values="200;200" dur="1s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.7;0" dur="1s" repeatCount="indefinite" begin={`${i * 0.3}s`}/>
                  </circle>
                ))}
              </g>
            )}
            {nmosOn && state !== 'low' && (
              <g>
                {Array.from({length: 3}).map((_, i) => (
                  <circle key={`nc${i}`} r="3" fill="var(--accent)" opacity="0.6">
                    <animate attributeName="cy" values="210;310" dur="1s" repeatCount="indefinite" begin={`${i * 0.3}s`}/>
                    <animate attributeName="cx" values="200;200" dur="1s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.7;0" dur="1s" repeatCount="indefinite" begin={`${i * 0.3}s`}/>
                  </circle>
                ))}
              </g>
            )}

            {/* Crowbar current warning */}
            {state === 'transition' && (
              <g>
                <rect x="250" y="130" width="140" height="30" rx="4" fill="var(--bad)" opacity="0.1"/>
                <text x="320" y="150" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--bad)" letterSpacing="0.04em">
                  CROWBAR CURRENT
                </text>
                <line x1="200" y1="60" x2="200" y2="310" stroke="var(--bad)" strokeWidth="1" strokeDasharray="2,2" opacity="0.3"/>
              </g>
            )}

            {/* VTC curve (small, bottom-right) */}
            <g transform="translate(400, 80)">
              <rect x="0" y="0" width="160" height="120" rx="4" fill="var(--surface)" stroke="var(--rule)" opacity="0.8"/>
              <text x="80" y="16" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-faint)" letterSpacing="0.06em">VTC</text>
              {/* VTC line */}
              <polyline points="15,25 55,25 80,95 100,95 145,95" fill="none" stroke="var(--ink-mute)" strokeWidth="1.5"/>
              {/* Operating point dot */}
              <circle cx={15 + (vin/vdd) * 130} cy={25 + (vout < vdd*0.5 ? 70 : vout > vdd*0.5 ? 0 : 35)} r="4"
                      fill={copy.color} stroke="white" strokeWidth="1.5">
                <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <text x="15" y="112" fontFamily="JetBrains Mono" fontSize="7" fill="var(--ink-faint)">0</text>
              <text x="145" y="112" fontFamily="JetBrains Mono" fontSize="7" fill="var(--ink-faint)">V_DD</text>
            </g>
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
          <div className="vizctrl__slot" style={{flex:1}}>
            <div className="vizctrl__head">
              <span className="eyebrow">V_in</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max={vdd}
                value={vin.toFixed(2)} onChange={e => setVin(Math.max(0, Math.min(vdd, +e.target.value)))}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max={vdd} step="0.01" value={vin}
                   onChange={e => setVin(+e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--amber-ink)'}}>V_DD/2 = {(vdd/2).toFixed(2)}</span>
              <span>{vdd.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to state</span>
          <div className="vizctrl__quickbtns">
            {['low','transition','high'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${state === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{STATE_NUM[r]}</span>
                <span className="serif vizctrl__jumpname">{r === 'low' ? 'Low' : r === 'high' ? 'High' : 'Transition'}</span>
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
          <h3 className="serif vizrw__head">With <em>{copy.label.toLowerCase()}</em> —</h3>
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
