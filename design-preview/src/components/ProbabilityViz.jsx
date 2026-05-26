'use client'
import { useState } from 'react'

function factorial(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r }
function comb(n, k) { return factorial(n) / (factorial(k) * factorial(n - k)) }
function binomialPMF(n, p, k) { return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k) }

export default function ProbabilityViz() {
  const [n, setN] = useState(10)
  const [p, setP] = useState(0.3)

  const bars = []
  let maxP = 0
  for (let k = 0; k <= n; k++) {
    const prob = binomialPMF(n, p, k)
    bars.push({ k, prob })
    if (prob > maxP) maxP = prob
  }

  const mean = n * p
  const variance = n * p * (1 - p)
  const std = Math.sqrt(variance)

  const W = 400, H = 220
  const barW = Math.min(30, (W - 40) / (n + 1))
  const gap = 2

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · see the distribution form</span>
        <span className="mono theory__progress">change n and p · watch the shape shift</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          Flip a biased coin n times. <em>Count the heads.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          This is the Binomial distribution — the most tested probability concept in GATE.
          Change the number of trials and the probability to see how the shape changes.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">Binomial(n={n}, p={p.toFixed(2)})</span>
            <span className="mono vizstage__statesub">mean = {mean.toFixed(1)}, std = {std.toFixed(2)}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>E[X]</span>
            <span className="serif vizstage__id">{mean.toFixed(1)}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox={`0 0 ${W} ${H+30}`} width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            <line x1="20" y1={H} x2={W} y2={H} stroke="var(--ink-faint)" strokeWidth="1"/>

            {bars.map(({k, prob}) => {
              const x = 20 + k * (barW + gap)
              const h = (prob / maxP) * (H - 30)
              const isMean = Math.abs(k - mean) < 0.6
              return (
                <g key={k}>
                  <rect x={x} y={H - h} width={barW} height={h} rx="2"
                        fill={isMean ? 'var(--accent)' : 'rgba(58,110,165,0.5)'}
                        stroke={isMean ? 'var(--accent)' : 'rgba(58,110,165,0.7)'} strokeWidth="0.5"/>
                  <text x={x + barW/2} y={H+12} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono" fill="var(--ink-faint)">{k}</text>
                  {prob > 0.02 && (
                    <text x={x + barW/2} y={H - h - 4} textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono" fill="var(--ink-mute)">
                      {(prob*100).toFixed(1)}%
                    </text>
                  )}
                </g>
              )
            })}

            {/* Mean line */}
            <line x1={20 + mean * (barW + gap) + barW/2} y1="10" x2={20 + mean * (barW + gap) + barW/2} y2={H}
                  stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6"/>
            <text x={20 + mean * (barW + gap) + barW/2} y="22" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--accent)">
              mean={mean.toFixed(1)}
            </text>

            <text x={W/2} y={H+26} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">k (number of successes)</text>
          </svg>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">Key formulas</div>
            <h3 className="serif vizexplain__head"><em>P(X=k) = C(n,k) · p^k · (1-p)^(n-k)</em></h3>
          </div>
          <p className="vizexplain__body">
            Mean = np = {mean.toFixed(1)}. Variance = np(1-p) = {variance.toFixed(2)}.
            As n gets large and p stays small, this approaches a Poisson distribution.
          </p>
          <div className="vizexplain__formula mono">E[X] = np | Var(X) = np(1-p) | sigma = {std.toFixed(2)}</div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row">
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">n (trials)</span>
              <input className="mono vizctrl__num" type="number" step="1" min="2" max="20"
                value={n} onChange={e => setN(Math.max(2, Math.min(20, +e.target.value)))}/>
            </div>
            <input type="range" min="2" max="20" step="1" value={n}
                   onChange={e => setN(+e.target.value)} className="ctrl__slider vizctrl__slider"/>
          </div>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">p (probability)</span>
              <input className="mono vizctrl__num" type="number" step="0.05" min="0.05" max="0.95"
                value={p.toFixed(2)} onChange={e => setP(Math.max(0.05, Math.min(0.95, +e.target.value)))}/>
            </div>
            <input type="range" min="0.05" max="0.95" step="0.05" value={p}
                   onChange={e => setP(+e.target.value)} className="ctrl__slider vizctrl__slider"/>
          </div>
        </div>
      </section>
    </article>
  )
}
