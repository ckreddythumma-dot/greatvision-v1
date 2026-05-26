'use client'
import { useState } from 'react'

const CIRCUITS = {
  fast: { R: 1000, C: 0.000001, label: 'Fast decay', sub: 'R=1k, C=1uF, tau=1ms' },
  medium: { R: 10000, C: 0.00001, label: 'Medium decay', sub: 'R=10k, C=10uF, tau=100ms' },
  slow: { R: 100000, C: 0.0001, label: 'Slow decay', sub: 'R=100k, C=100uF, tau=10s' },
}

export default function DiffEqViz() {
  const [preset, setPreset] = useState('medium')
  const [time, setTime] = useState(0.5)
  const circ = CIRCUITS[preset]
  const tau = circ.R * circ.C

  const V0 = 5.0
  const vt = V0 * Math.exp(-time / tau * (tau < 0.01 ? 1000 : tau < 1 ? 10 : 1))
  const tNorm = time / (tau < 0.01 ? 0.005 : tau < 1 ? 0.5 : 50)
  const tauCount = tNorm

  const W = 400, H = 250
  const tMax = tau < 0.01 ? 5 : tau < 1 ? 500 : 50000
  const steps = 200
  let pathD = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax
    const v = V0 * Math.exp(-t / (tau * 1000))
    const sx = (i / steps) * W
    const sy = H - (v / V0) * H
    pathD += i === 0 ? `M${sx},${sy}` : ` L${sx},${sy}`
  }

  const tauMarks = [1, 2, 3, 4, 5]
  const currentV = V0 * Math.exp(-tauCount)
  const pctRemaining = (currentV / V0 * 100).toFixed(1)

  const cursorX = Math.min(1, tauCount / 5) * W
  const cursorY = H - (currentV / V0) * H

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · watch the capacitor discharge</span>
        <span className="mono theory__progress">change R and C · see tau change</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'20ch'}}>
          Voltage fades like memory. <em>Exponentially.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          An RC circuit is the simplest differential equation in electronics.
          The solution is always e to the power of negative t over tau.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">{circ.label}</span>
            <span className="mono vizstage__statesub">{circ.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>V(t)</span>
            <span className="serif vizstage__id">{currentV.toFixed(2)}<span className="mono vizstage__idunit">V</span></span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox={`0 0 ${W} ${H+40}`} width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            <line x1="0" y1={H} x2={W} y2={H} stroke="var(--ink-faint)" strokeWidth="1"/>
            <line x1="0" y1="0" x2="0" y2={H} stroke="var(--ink-faint)" strokeWidth="1"/>

            {tauMarks.map(n => {
              const x = (n / 5) * W
              const pct = (Math.exp(-n) * 100).toFixed(1)
              return (
                <g key={n}>
                  <line x1={x} y1="0" x2={x} y2={H} stroke="var(--rule)" strokeWidth="0.5" strokeDasharray="3,3"/>
                  <text x={x} y={H+14} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">{n}tau</text>
                  <text x={x} y={H+26} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono" fill="var(--ink-faint)">{pct}%</text>
                </g>
              )
            })}

            <text x="4" y="12" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-mute)">5V</text>
            <text x="4" y={H-4} fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-mute)">0V</text>

            <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5"/>

            <circle cx={cursorX} cy={cursorY} r="6" fill="#C74B50" stroke="var(--paper)" strokeWidth="2"/>

            <line x1={cursorX} y1={cursorY} x2={cursorX} y2={H} stroke="#C74B50" strokeWidth="1" strokeDasharray="3,2" opacity="0.5"/>

            <rect x={cursorX+8} y={cursorY-24} width="100" height="20" rx="3" fill="var(--surface)" stroke="var(--rule)" opacity="0.9"/>
            <text x={cursorX+14} y={cursorY-10} fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-soft)">
              {pctRemaining}% remaining
            </text>

            {tauCount >= 4.8 && (
              <text x={W/2} y={H/2} textAnchor="middle" fontSize="12" fontFamily="JetBrains Mono" fill="var(--ok)" letterSpacing="0.08em">
                FULLY DISCHARGED (~0V)
              </text>
            )}
          </svg>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">The exponential decay</div>
            <h3 className="serif vizexplain__head"><em>V(t) = V₀ · e^(-t/RC)</em></h3>
          </div>
          <p className="vizexplain__body">
            At t = 1tau, 36.8% remains. At t = 3tau, only 5% remains. At t = 5tau, effectively zero.
            The time constant tau = RC controls how fast the decay happens.
          </p>
          <div className="vizexplain__formula mono">tau = R x C = {(tau*1000).toFixed(tau < 0.01 ? 1 : 0)} ms | Currently at {tauCount.toFixed(1)} time constants</div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row">
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">Time (in tau units)</span>
              <span className="mono vizctrl__num">{tauCount.toFixed(2)} tau</span>
            </div>
            <input type="range" min="0" max="5" step="0.05" value={tauCount}
                   onChange={e => setTime(+e.target.value * (tau < 0.01 ? 0.005 : tau < 1 ? 0.5 : 50) / 5 * 5)}
                   className="ctrl__slider vizctrl__slider"/>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">RC values</span>
          <div className="vizctrl__quickbtns">
            {Object.entries(CIRCUITS).map(([key, val]) => (
              <button key={key} className={`vizctrl__jumpbtn ${preset === key ? 'is-active' : ''}`}
                      onClick={() => { setPreset(key); setTime(0.5) }}>
                <span className="serif vizctrl__jumpname">{val.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
