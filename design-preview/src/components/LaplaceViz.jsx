'use client'
import { useState } from 'react'

const SIGNALS = {
  step: { label: 'Step function', sub: 'u(t) — switch on', laplace: '1/s', timeFn: (t) => t >= 0 ? 1 : 0, explain: 'A sudden switch-on. In s-domain: 1/s. The pole at s=0 means the signal stays forever.' },
  exp: { label: 'Exponential decay', sub: 'e^(-2t)', laplace: '1/(s+2)', timeFn: (t) => Math.exp(-2*t), explain: 'Decaying exponential. Pole at s = -2. The more negative the pole, the faster the decay.' },
  sine: { label: 'Sine wave', sub: 'sin(3t)', laplace: '3/(s²+9)', timeFn: (t) => Math.sin(3*t), explain: 'A pure sine wave. Poles at s = ±3j (imaginary axis). Imaginary poles = oscillation.' },
  damped: { label: 'Damped sine', sub: 'e^(-t)·sin(3t)', laplace: '3/((s+1)²+9)', timeFn: (t) => Math.exp(-t)*Math.sin(3*t), explain: 'Decaying oscillation. Pole at s = -1±3j. Real part (-1) causes decay. Imaginary part (3) causes oscillation.' },
  ramp: { label: 'Ramp', sub: 't·u(t)', laplace: '1/s²', timeFn: (t) => t >= 0 ? t : 0, explain: 'Linearly increasing. Double pole at s=0. Each pole at origin adds one power of t.' },
}

export default function LaplaceViz() {
  const [preset, setPreset] = useState('step')
  const sig = SIGNALS[preset]

  const W = 400, H = 200
  const tMax = 5
  const steps = 200

  let pathD = ''
  let yMax = 0
  const points = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax
    const y = sig.timeFn(t)
    points.push([t, y])
    if (Math.abs(y) > yMax) yMax = Math.abs(y)
  }
  if (yMax === 0) yMax = 1
  yMax *= 1.2

  for (let i = 0; i < points.length; i++) {
    const [t, y] = points[i]
    const sx = (t / tMax) * W
    const sy = H/2 - (y / yMax) * (H/2)
    pathD += i === 0 ? `M${sx},${sy}` : ` L${sx},${sy}`
  }

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · time domain meets s-domain</span>
        <span className="mono theory__progress">pick a signal · see its transform</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          Time is hard. Frequency is easy. <em>Transform.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          The Laplace transform converts differential equations into simple algebra.
          Poles in the s-domain tell you everything about the signal's behavior.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">{sig.label}</span>
            <span className="mono vizstage__statesub">{sig.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>F(s)</span>
            <span className="serif vizstage__id" style={{fontSize:16}}>{sig.laplace}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="var(--ink-faint)" strokeWidth="0.5"/>
            <line x1="0" y1="0" x2="0" y2={H} stroke="var(--ink-faint)" strokeWidth="0.5"/>

            {[1,2,3,4].map(n => (
              <g key={n}>
                <line x1={(n/tMax)*W} y1="0" x2={(n/tMax)*W} y2={H} stroke="var(--rule)" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.3"/>
                <text x={(n/tMax)*W} y={H-4} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">{n}s</text>
              </g>
            ))}

            <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5"/>

            <text x={W/2} y="16" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-mute)">
              TIME DOMAIN: f(t) = {sig.sub}
            </text>
          </svg>

          <div style={{marginTop:16, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
            <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:8}}>S-DOMAIN (LAPLACE)</div>
            <div style={{display:'flex', alignItems:'center', gap:16}}>
              <span className="serif" style={{fontSize:28, color:'var(--accent)'}}>F(s) = {sig.laplace}</span>
              <span style={{fontSize:13, color:'var(--ink-mute)', flex:1}}>{sig.explain}</span>
            </div>
          </div>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">The key insight</div>
            <h3 className="serif vizexplain__head"><em>Poles control everything</em></h3>
          </div>
          <p className="vizexplain__body">
            Real negative pole = decay. Real positive pole = blow up. Imaginary poles = oscillation.
            Pole at origin = constant or ramp. This is what GATE tests.
          </p>
          <div className="vizexplain__formula mono">L[f(t)] = integral from 0 to inf of f(t)·e^(-st) dt</div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">pick a signal</span>
          <div className="vizctrl__quickbtns">
            {Object.entries(SIGNALS).map(([key, val]) => (
              <button key={key} className={`vizctrl__jumpbtn ${preset === key ? 'is-active' : ''}`}
                      onClick={() => setPreset(key)}>
                <span className="serif vizctrl__jumpname">{val.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
