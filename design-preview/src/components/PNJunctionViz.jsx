'use client'
import { useState } from 'react'

const REGIONS = {
  reverse: { label: 'Reverse Bias', sub: 'V_A < 0', headline: 'No current flows.', explain: 'The applied voltage widens the depletion region. Holes are pulled toward the negative terminal, electrons toward the positive. The barrier grows — no carriers cross. Only a tiny leakage current (nA) from thermally generated minority carriers.', formula: 'I ≈ -I_S (reverse saturation)', color: 'var(--ink-mute)', real: 'In reverse bias, the PN junction blocks current like a closed valve. ESD protection diodes on every I/O pin of the A19 Pro sit in reverse bias during normal operation, presenting near-infinite impedance.', phone: 'Every I/O pin is protected.' },
  threshold: { label: 'Turn-on', sub: 'V_A ≈ V_bi', headline: 'Barrier collapsing.', explain: 'The applied voltage nearly equals the built-in potential. The depletion region is shrinking rapidly. A trickle of majority carriers begins to diffuse across. The diode is at the knee of its I-V curve.', formula: 'I ≈ I_S · (e^(V/V_T) - 1), V ≈ 0.7V', color: 'var(--amber)', real: 'At ~0.7V forward bias (Si), the junction transitions from blocking to conducting. This threshold sets the base-emitter turn-on voltage in every BJT on the chip.', phone: 'Bandgap references lock to V_bi.' },
  forward: { label: 'Forward Bias', sub: 'V_A > V_bi', headline: 'Current flows freely.', explain: 'The external voltage overcomes the built-in potential. Depletion region collapses to nearly zero. Majority carriers flood across — electrons from N to P, holes from P to N. Current rises exponentially with voltage.', formula: 'I = I_S · (e^(V/nV_T) - 1)', color: 'var(--ok)', real: 'Forward-biased junctions conduct with near-zero resistance. In the A19 Pro, body diodes in CMOS transistors clamp substrate voltages, preventing latch-up.', phone: 'Substrate clamping keeps the chip alive.' },
  breakdown: { label: 'Breakdown', sub: 'V_A << 0', headline: 'Avalanche.', explain: 'Extreme reverse voltage accelerates minority carriers to such energy that they ionize atoms, creating electron-hole pairs that ionize more atoms — an avalanche. Current surges uncontrollably. The junction can be destroyed if current is not limited.', formula: 'I → ∞ at V = V_BR', color: 'var(--bad)', real: 'Zener/avalanche breakdown is used deliberately in voltage regulators. On the A19 Pro, ESD clamp diodes enter controlled breakdown to shunt static discharge away from gate oxides.', phone: 'ESD protection saves the chip from static.' },
}

const PRESETS = {
  reverse: { va: -3.0 },
  threshold: { va: 0.65 },
  forward: { va: 0.85 },
  breakdown: { va: -8.0 },
}

function getRegion(va) {
  if (va < -6) return 'breakdown'
  if (va < 0.5) return 'reverse'
  if (va < 0.75) return 'threshold'
  return 'forward'
}

const REGION_NUM = { reverse: '01', threshold: '02', forward: '03', breakdown: '04' }

export default function PNJunctionViz() {
  const [va, setVa] = useState(0.0)
  const region = getRegion(va)
  const copy = REGIONS[region]

  const depW = region === 'reverse' ? 60 + Math.abs(va) * 12 : region === 'breakdown' ? 120 : region === 'threshold' ? 30 : Math.max(6, 40 - (va - 0.5) * 80)
  const current = region === 'forward' ? Math.min(8, (va - 0.6) * 20) : region === 'threshold' ? 0.5 : 0

  const jumpTo = (key) => setVa(PRESETS[key].va)
  const onVa = (v) => setVa(Math.max(-10, Math.min(1.2, +v)))

  return (
    <article className="viz-tab" data-region={region}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the junction is alive</span>
        <span className="mono theory__progress">drag the slider · watch the physics</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'20ch'}}>
          A PN junction. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Change the applied voltage and watch the depletion region widen or collapse. See carriers flow or halt. Every label stays visible.
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
            <span className="eyebrow" style={{marginRight:8}}>I</span>
            <span className="serif vizstage__id">{current.toFixed(2)}<span className="mono vizstage__idunit">mA</span></span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox="0 0 600 340" width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            <defs>
              <linearGradient id="pn-p" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#C74B50" stopOpacity="0.12"/>
                <stop offset="1" stopColor="#C74B50" stopOpacity="0.25"/>
              </linearGradient>
              <linearGradient id="pn-n" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#3A6EA5" stopOpacity="0.25"/>
                <stop offset="1" stopColor="#3A6EA5" stopOpacity="0.12"/>
              </linearGradient>
            </defs>

            {/* P-type region */}
            <rect x="40" y="80" width={260 - depW/2} height="180" fill="url(#pn-p)" stroke="rgba(199,75,80,0.4)"/>
            <text x={40 + (260 - depW/2)/2} y="70" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="#C74B50" letterSpacing="0.08em">P-TYPE</text>

            {/* Acceptor ions (fixed) */}
            {Array.from({length: 12}).map((_, i) => (
              <g key={`a${i}`}>
                <circle cx={60 + (i % 4) * 45} cy={110 + Math.floor(i/4) * 50} r="6" fill="none" stroke="#C74B50" strokeWidth="1" opacity="0.5"/>
                <text x={60 + (i % 4) * 45} y={114 + Math.floor(i/4) * 50} textAnchor="middle" fontSize="10" fill="#C74B50" opacity="0.6">-</text>
              </g>
            ))}

            {/* N-type region */}
            <rect x={300 + depW/2} y="80" width={260 - depW/2} height="180" fill="url(#pn-n)" stroke="rgba(58,110,165,0.4)"/>
            <text x={300 + depW/2 + (260 - depW/2)/2} y="70" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="#3A6EA5" letterSpacing="0.08em">N-TYPE</text>

            {/* Donor ions (fixed) */}
            {Array.from({length: 12}).map((_, i) => (
              <g key={`d${i}`}>
                <circle cx={320 + depW/2 + (i % 4) * 45} cy={110 + Math.floor(i/4) * 50} r="6" fill="none" stroke="#3A6EA5" strokeWidth="1" opacity="0.5"/>
                <text x={320 + depW/2 + (i % 4) * 45} y={114 + Math.floor(i/4) * 50} textAnchor="middle" fontSize="10" fill="#3A6EA5" opacity="0.6">+</text>
              </g>
            ))}

            {/* Depletion region */}
            <rect x={300 - depW/2} y="80" width={depW} height="180" fill="var(--surface-2)" stroke="var(--rule-strong)" strokeDasharray="4,3" opacity="0.8"/>
            <text x="300" y="175" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.06em">
              DEPLETION
            </text>
            <text x="300" y="188" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-faint)">
              W = {(depW * 0.5).toFixed(0)} nm
            </text>

            {/* Electric field arrows in depletion region */}
            {depW > 20 && (
              <g opacity="0.4">
                {Array.from({length: Math.min(5, Math.floor(depW / 15))}).map((_, i) => (
                  <line key={`ef${i}`} x1={300 + depW/4} y1={100 + i * 30} x2={300 - depW/4} y2={100 + i * 30}
                        stroke="var(--ink-mute)" strokeWidth="1" markerEnd="url(#arrowhead)"/>
                ))}
              </g>
            )}

            {/* Current flow - electrons moving right to left in forward bias */}
            {current > 0 && (
              <g>
                {Array.from({length: Math.ceil(current * 2)}).map((_, i) => (
                  <circle key={`ef${i}`} r="4" fill="#3A6EA5" opacity="0.7">
                    <animate attributeName="cx" values={`${380 + depW/2};${80}`} dur={`${1.5 - current * 0.08}s`}
                             repeatCount="indefinite" begin={`${i * 0.2}s`}/>
                    <animate attributeName="cy" values={`${140 + (i%3)*30};${155 + ((i+1)%3)*25};${140 + (i%3)*30}`}
                             dur="0.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${1.5 - current * 0.08}s`}
                             repeatCount="indefinite" begin={`${i * 0.2}s`}/>
                  </circle>
                ))}
                {Array.from({length: Math.ceil(current * 2)}).map((_, i) => (
                  <circle key={`hf${i}`} r="4" fill="#C74B50" opacity="0.7">
                    <animate attributeName="cx" values={`${80};${380 + depW/2}`} dur={`${1.5 - current * 0.08}s`}
                             repeatCount="indefinite" begin={`${i * 0.2}s`}/>
                    <animate attributeName="cy" values={`${200 + (i%3)*20};${210 + ((i+1)%3)*15};${200 + (i%3)*20}`}
                             dur="0.7s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${1.5 - current * 0.08}s`}
                             repeatCount="indefinite" begin={`${i * 0.2}s`}/>
                  </circle>
                ))}
              </g>
            )}

            {/* Breakdown sparks */}
            {region === 'breakdown' && (
              <g>
                <path d="M 280 100 L 290 130 L 270 140 L 295 170" stroke="var(--bad)" strokeWidth="2" fill="none">
                  <animate attributeName="opacity" values="0;1;0.3;1;0" dur="0.6s" repeatCount="indefinite"/>
                </path>
                <path d="M 320 110 L 310 145 L 330 150 L 305 180" stroke="var(--bad)" strokeWidth="2" fill="none">
                  <animate attributeName="opacity" values="0.3;1;0;1;0.5" dur="0.5s" repeatCount="indefinite"/>
                </path>
                <circle cx="300" cy="160" r="4" fill="var(--bad)" opacity="0">
                  <animate attributeName="r" values="4;25;10" dur="0.8s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0;0.5;0" dur="0.8s" repeatCount="indefinite"/>
                </circle>
              </g>
            )}

            {/* Terminal contacts */}
            <rect x="20" y="140" width="20" height="60" rx="2" fill="var(--surface)" stroke="var(--rule-strong)"/>
            <text x="30" y="128" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">A</text>
            <rect x="560" y="140" width="20" height="60" rx="2" fill="var(--surface)" stroke="var(--rule-strong)"/>
            <text x="570" y="128" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">K</text>

            {/* Junction line */}
            <line x1="300" y1="78" x2="300" y2="262" stroke="var(--ink-mute)" strokeWidth="1" strokeDasharray="2,4" opacity="0.4"/>
            <text x="300" y="278" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-faint)">JUNCTION</text>

            {/* Voltage label */}
            <g transform="translate(300, 300)">
              <text x="0" y="0" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill={copy.color}>
                V_A = {va.toFixed(2)} V
              </text>
            </g>

            {/* Status badge */}
            <rect x="190" y="290" width="220" height="24" rx="3" fill={copy.color} opacity="0.1"/>
            <text x="300" y="306" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={copy.color} letterSpacing="0.06em">
              {region === 'forward' ? 'CONDUCTING · CARRIERS CROSSING' :
               region === 'threshold' ? 'BARRIER COLLAPSING · ONSET' :
               region === 'breakdown' ? 'AVALANCHE · BREAKDOWN' :
               'BLOCKING · DEPLETION WIDENED'}
            </text>
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

      {/* Controls */}
      <section className="vizctrl">
        <div className="vizctrl__row">
          <div className="vizctrl__slot" style={{flex:1}}>
            <div className="vizctrl__head">
              <span className="eyebrow">V_A</span>
              <input className="mono vizctrl__num" type="number" step="0.1" min="-10" max="1.2"
                value={va.toFixed(2)} onChange={e => onVa(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="-10" max="1.2" step="0.05" value={va}
                   onChange={e => onVa(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>-10.0</span>
              <span style={{color:'var(--amber-ink)'}}>V_bi ≈ 0.7</span>
              <span>1.20</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to region</span>
          <div className="vizctrl__quickbtns">
            {['reverse','threshold','forward','breakdown'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${region === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{REGION_NUM[r]}</span>
                <span className="serif vizctrl__jumpname">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Real-world consequence */}
      <section className="vizrw">
        <div className="theory__rubric" style={{marginBottom:16}}>
          <span className="rubric">Consequence in the world</span>
        </div>
        <div className="vizrw__body">
          <h3 className="serif vizrw__head">One <em>{copy.label.toLowerCase()}</em> junction —</h3>
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
