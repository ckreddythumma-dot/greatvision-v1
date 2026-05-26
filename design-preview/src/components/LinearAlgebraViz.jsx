'use client'
import { useState } from 'react'

const MATRICES = {
  stretch:   { a: 2, b: 0, c: 0, d: 2, label: 'Stretch', sub: 'Both axes scale equally', eigenInfo: 'λ₁ = 2, λ₂ = 2 — uniform scaling' },
  rotate:    { a: 0, b: -1, c: 1, d: 0, label: 'Rotate 90°', sub: 'No real eigenvectors', eigenInfo: 'λ = ±i — complex eigenvalues (rotation)' },
  shear:     { a: 1, b: 1, c: 0, d: 1, label: 'Shear', sub: 'Slants along x-axis', eigenInfo: 'λ₁ = λ₂ = 1 — repeated eigenvalue' },
  reflect:   { a: -1, b: 0, c: 0, d: 1, label: 'Reflect (y-axis)', sub: 'Flip horizontally', eigenInfo: 'λ₁ = −1, λ₂ = 1 — one axis flips' },
  squish:    { a: 1, b: 0, c: 0, d: 0, label: 'Project onto x', sub: 'Collapses y dimension', eigenInfo: 'λ₁ = 1, λ₂ = 0 — singular (det=0)' },
  custom:    { a: 3, b: 1, c: 0, d: 2, label: 'GATE-style', sub: 'Upper triangular 3×2', eigenInfo: 'λ₁ = 3, λ₂ = 2 — diagonal = eigenvalues (triangular)' },
}

const GRID_POINTS = []
for (let x = -2; x <= 2; x++) {
  for (let y = -2; y <= 2; y++) {
    GRID_POINTS.push([x, y])
  }
}

const UNIT_SQUARE = [[0,0],[1,0],[1,1],[0,1]]

export default function LinearAlgebraViz() {
  const [preset, setPreset] = useState('stretch')
  const [showEigen, setShowEigen] = useState(true)
  const m = MATRICES[preset]

  const transform = (x, y) => [m.a * x + m.b * y, m.c * x + m.d * y]

  const tr = m.a + m.d
  const det = m.a * m.d - m.b * m.c
  const disc = tr * tr - 4 * det
  const hasRealEigen = disc >= 0

  const toSVG = (x, y) => [200 + x * 60, 200 - y * 60]
  const toSVGT = (x, y) => { const [tx, ty] = transform(x, y); return [200 + tx * 60, 200 - ty * 60] }

  const sqOrig = UNIT_SQUARE.map(([x,y]) => toSVG(x, y))
  const sqTrans = UNIT_SQUARE.map(([x,y]) => toSVGT(x, y))

  const origPath = sqOrig.map((p,i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ') + ' Z'
  const transPath = sqTrans.map((p,i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ') + ' Z'

  const [ex, ey] = toSVG(1, 0)
  const [eex, eey] = toSVGT(1, 0)
  const [fx, fy] = toSVG(0, 1)
  const [fex, fey] = toSVGT(0, 1)

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · see the matrix work</span>
        <span className="mono theory__progress">pick a matrix · watch it transform</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'20ch'}}>
          A matrix transforms space. <em>Watch.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          The blue square is the original. The orange square is what the matrix does to it.
          Eigenvectors are the arrows that stay on their line.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">{m.label}</span>
            <span className="mono vizstage__statesub">{m.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="mono" style={{fontSize:12, color:'var(--ink-mute)'}}>det = {det.toFixed(1)}</span>
            <span className="mono" style={{fontSize:12, color:'var(--ink-mute)', marginLeft:12}}>tr = {tr.toFixed(1)}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox="0 0 400 400" width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            {/* Grid lines */}
            {[-3,-2,-1,0,1,2,3].map(i => (
              <g key={`grid${i}`}>
                <line x1={200+i*60} y1="0" x2={200+i*60} y2="400" stroke="var(--rule)" strokeWidth="0.5" opacity="0.4"/>
                <line x1="0" y1={200-i*60} x2="400" y2={200-i*60} stroke="var(--rule)" strokeWidth="0.5" opacity="0.4"/>
              </g>
            ))}

            {/* Axes */}
            <line x1="0" y1="200" x2="400" y2="200" stroke="var(--ink-faint)" strokeWidth="1"/>
            <line x1="200" y1="0" x2="200" y2="400" stroke="var(--ink-faint)" strokeWidth="1"/>

            {/* Original unit square */}
            <path d={origPath} fill="rgba(58,110,165,0.15)" stroke="#3A6EA5" strokeWidth="1.5"/>

            {/* Transformed unit square */}
            <path d={transPath} fill="rgba(199,120,50,0.2)" stroke="#C77832" strokeWidth="2"/>

            {/* Original basis vectors */}
            <line x1="200" y1="200" x2={ex} y2={ey} stroke="#3A6EA5" strokeWidth="2" markerEnd="url(#arrowBlue)"/>
            <line x1="200" y1="200" x2={fx} y2={fy} stroke="#3A6EA5" strokeWidth="2" markerEnd="url(#arrowBlue)"/>

            {/* Transformed basis vectors */}
            <line x1="200" y1="200" x2={eex} y2={eey} stroke="#C77832" strokeWidth="2.5" markerEnd="url(#arrowOrange)"/>
            <line x1="200" y1="200" x2={fex} y2={fey} stroke="#C77832" strokeWidth="2.5" markerEnd="url(#arrowOrange)"/>

            {/* Labels */}
            <text x={ex+8} y={ey+4} fontSize="10" fontFamily="JetBrains Mono" fill="#3A6EA5">e1</text>
            <text x={fx-4} y={fy-8} fontSize="10" fontFamily="JetBrains Mono" fill="#3A6EA5">e2</text>
            <text x={eex+8} y={eey+4} fontSize="10" fontFamily="JetBrains Mono" fill="#C77832">Ae1</text>
            <text x={fex-4} y={fey-8} fontSize="10" fontFamily="JetBrains Mono" fill="#C77832">Ae2</text>

            {/* Matrix display */}
            <rect x="10" y="10" width="90" height="50" rx="4" fill="var(--surface)" stroke="var(--rule)" opacity="0.9"/>
            <text x="20" y="30" fontSize="11" fontFamily="JetBrains Mono" fill="var(--ink-soft)">A = [{m.a} {m.b}]</text>
            <text x="36" y="48" fontSize="11" fontFamily="JetBrains Mono" fill="var(--ink-soft)">    [{m.c} {m.d}]</text>

            <defs>
              <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="none" stroke="#3A6EA5" strokeWidth="1"/>
              </marker>
              <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="none" stroke="#C77832" strokeWidth="1"/>
              </marker>
            </defs>
          </svg>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">What the matrix does</div>
            <h3 className="serif vizexplain__head"><em>{m.label}</em></h3>
          </div>
          <p className="vizexplain__body">{m.eigenInfo}</p>
          <div className="vizexplain__formula mono">
            det = {det.toFixed(0)} {det === 0 ? '(singular — no inverse!)' : `(invertible)`} | disc = {disc.toFixed(1)} {hasRealEigen ? '(real eigenvalues)' : '(complex eigenvalues)'}
          </div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">pick a transformation</span>
          <div className="vizctrl__quickbtns">
            {Object.entries(MATRICES).map(([key, val]) => (
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
