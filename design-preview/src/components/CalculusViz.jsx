'use client'
import { useState } from 'react'

const FUNCTIONS = {
  quadratic: {
    label: 'Parabola', sub: 'f(x) = x² − 4x + 3',
    fn: (x) => x*x - 4*x + 3,
    dfn: (x) => 2*x - 4,
    critical: 2, criticalY: -1,
    type: 'Minimum',
    explain: 'f\'(x) = 2x − 4 = 0 at x = 2. f\'\'(2) = 2 > 0, so it is a minimum.',
    range: [-1, 5], yRange: [-2, 8],
  },
  cubic: {
    label: 'Cubic', sub: 'f(x) = x³ − 3x',
    fn: (x) => x*x*x - 3*x,
    dfn: (x) => 3*x*x - 3,
    critical: 1, criticalY: -2,
    type: 'Local min at x=1',
    explain: 'f\'(x) = 3x² − 3 = 0 at x = ±1. f\'\'(1) = 6 > 0 (min). f\'\'(−1) = −6 < 0 (max).',
    range: [-2.5, 2.5], yRange: [-4, 4],
  },
  sine: {
    label: 'Sine wave', sub: 'f(x) = sin(x)',
    fn: (x) => Math.sin(x),
    dfn: (x) => Math.cos(x),
    critical: Math.PI/2, criticalY: 1,
    type: 'Maximum at pi/2',
    explain: 'f\'(x) = cos(x) = 0 at x = pi/2. f\'\'(pi/2) = −sin(pi/2) = −1 < 0, so maximum.',
    range: [-1, 7], yRange: [-1.5, 1.5],
  },
}

export default function CalculusViz() {
  const [preset, setPreset] = useState('quadratic')
  const [xPos, setXPos] = useState(2.0)
  const f = FUNCTIONS[preset]

  const W = 400, H = 300
  const [xMin, xMax] = f.range
  const [yMin, yMax] = f.yRange

  const toSVG = (x, y) => [
    ((x - xMin) / (xMax - xMin)) * W,
    H - ((y - yMin) / (yMax - yMin)) * H,
  ]

  const steps = 200
  let pathD = ''
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin)
    const y = f.fn(x)
    const [sx, sy] = toSVG(x, y)
    pathD += i === 0 ? `M${sx},${sy}` : ` L${sx},${sy}`
  }

  const yAtX = f.fn(xPos)
  const slope = f.dfn(xPos)
  const [px, py] = toSVG(xPos, yAtX)

  const tangentLen = 0.8
  const [t1x, t1y] = toSVG(xPos - tangentLen, yAtX - slope * tangentLen)
  const [t2x, t2y] = toSVG(xPos + tangentLen, yAtX + slope * tangentLen)

  const [cx, cy] = toSVG(f.critical, f.criticalY)

  const xAxisY = toSVG(0, 0)[1]
  const yAxisX = toSVG(0, 0)[0]

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · see the slope change</span>
        <span className="mono theory__progress">drag the point · watch the tangent</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          Where the slope hits zero. <em>That is the answer.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          The red line is the tangent — it shows the slope at that point.
          When it goes flat (slope = 0), you found the maximum or minimum.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">{f.label}</span>
            <span className="mono vizstage__statesub">{f.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>slope</span>
            <span className="serif vizstage__id">{slope.toFixed(2)}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            {xAxisY >= 0 && xAxisY <= H && (
              <line x1="0" y1={xAxisY} x2={W} y2={xAxisY} stroke="var(--ink-faint)" strokeWidth="0.5"/>
            )}
            {yAxisX >= 0 && yAxisX <= W && (
              <line x1={yAxisX} y1="0" x2={yAxisX} y2={H} stroke="var(--ink-faint)" strokeWidth="0.5"/>
            )}

            <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5"/>

            <line x1={t1x} y1={t1y} x2={t2x} y2={t2y} stroke="#C74B50" strokeWidth="2" opacity="0.8"/>

            <circle cx={px} cy={py} r="6" fill="#C74B50" stroke="var(--paper)" strokeWidth="2"/>

            <circle cx={cx} cy={cy} r="5" fill="none" stroke="var(--ok)" strokeWidth="2" strokeDasharray="3,2">
              <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x={cx+10} y={cy-10} fontSize="9" fontFamily="JetBrains Mono" fill="var(--ok)">{f.type}</text>

            <rect x="8" y="8" width="120" height="48" rx="4" fill="var(--surface)" stroke="var(--rule)" opacity="0.9"/>
            <text x="16" y="24" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-soft)">x = {xPos.toFixed(2)}</text>
            <text x="16" y="38" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-soft)">f(x) = {yAtX.toFixed(2)}</text>
            <text x="16" y="52" fontSize="10" fontFamily="JetBrains Mono" fill={Math.abs(slope) < 0.15 ? 'var(--ok)' : '#C74B50'}>f'(x) = {slope.toFixed(2)}</text>
          </svg>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">Critical point</div>
            <h3 className="serif vizexplain__head"><em>{f.type}</em></h3>
          </div>
          <p className="vizexplain__body">{f.explain}</p>
          <div className="vizexplain__formula mono">
            {Math.abs(slope) < 0.15 ? 'slope ~ 0 — you are at a critical point!' : `slope = ${slope.toFixed(2)} — keep dragging toward the flat spot`}
          </div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row">
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">x position</span>
              <input className="mono vizctrl__num" type="number" step="0.1" min={f.range[0]} max={f.range[1]}
                value={xPos.toFixed(2)} onChange={e => setXPos(Math.max(f.range[0], Math.min(f.range[1], +e.target.value)))}/>
            </div>
            <input type="range" min={f.range[0]} max={f.range[1]} step="0.05" value={xPos}
                   onChange={e => setXPos(+e.target.value)} className="ctrl__slider vizctrl__slider"/>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">pick a function</span>
          <div className="vizctrl__quickbtns">
            {Object.entries(FUNCTIONS).map(([key, val]) => (
              <button key={key} className={`vizctrl__jumpbtn ${preset === key ? 'is-active' : ''}`}
                      onClick={() => { setPreset(key); setXPos(FUNCTIONS[key].critical) }}>
                <span className="serif vizctrl__jumpname">{val.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
