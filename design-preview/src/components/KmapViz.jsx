'use client'
import { useState } from 'react'

const PRESETS = {
  ex1: {
    label: "Sum(0,1,2,3,4,5,6,7)",
    minterms: [0,1,2,3,4,5,6,7],
    answer: "F = A'",
    terms: 1,
    groups: [
      { minterms: [0,1,2,3,4,5,6,7], color: 'rgba(58,110,165,0.25)', border: 'var(--accent)', label: "A'" }
    ],
    steps: [
      { text: "Place the 1s: all 8 minterms (m0 to m7) fall in the top two rows where A = 0.", highlight: [0,1,2,3,4,5,6,7] },
      { text: "Find the biggest group: all 8 cells form one rectangle (2 rows x 4 columns). Group of 8 eliminates 3 variables.", highlight: [0,1,2,3,4,5,6,7] },
      { text: "Read the group: B, C, D all change inside the group, so they cancel. Only A stays constant at 0. Answer: F = A'.", highlight: [] },
    ]
  },
  ex2: {
    label: "Sum(0,2,8,10)",
    minterms: [0,2,8,10],
    answer: "F = B'D'",
    terms: 1,
    groups: [
      { minterms: [0,2,8,10], color: 'rgba(58,110,165,0.25)', border: 'var(--accent)', label: "B'D'" }
    ],
    steps: [
      { text: "Place the 1s: m0, m2, m8, m10 land at the four corners of the grid.", highlight: [0,2,8,10] },
      { text: "Remember: the K-map wraps around! Left edge touches right edge, top touches bottom. So the four corners ARE adjacent.", highlight: [0,2,8,10] },
      { text: "Read the group: B = 0 and D = 0 in all four. A and C change, so they cancel. Answer: F = B'D'.", highlight: [] },
    ]
  },
  ex3: {
    label: "Sum(4,5,6,7,12,13,14,15)",
    minterms: [4,5,6,7,12,13,14,15],
    answer: "F = B",
    terms: 1,
    groups: [
      { minterms: [4,5,6,7,12,13,14,15], color: 'rgba(58,110,165,0.25)', border: 'var(--accent)', label: "B" }
    ],
    steps: [
      { text: "Place the 1s: all 8 minterms fall in the middle two rows (AB = 01 and AB = 11). These rows have B = 1.", highlight: [4,5,6,7,12,13,14,15] },
      { text: "One big group of 8 cells (2 rows x 4 cols). A, C, D all change inside — they cancel.", highlight: [4,5,6,7,12,13,14,15] },
      { text: "Only B stays constant at 1. Answer: F = B.", highlight: [] },
    ]
  },
  ex4: {
    label: "Sum(0,1,2,3,5,7)",
    minterms: [0,1,2,3,5,7],
    answer: "F = A'B' + A'D",
    terms: 2,
    groups: [
      { minterms: [0,1,2,3], color: 'rgba(58,110,165,0.25)', border: 'var(--accent)', label: "A'B'" },
      { minterms: [1,3,5,7], color: 'rgba(196,120,50,0.25)', border: 'var(--sienna)', label: "A'D" }
    ],
    steps: [
      { text: "Group 1: m0, m1, m2, m3 fill the entire first row (AB = 00). A = 0, B = 0 constant. C, D change and cancel. This gives A'B'.", highlight: [0,1,2,3] },
      { text: "Group 2: m1, m3, m5, m7 all have A = 0 and D = 1. B, C change and cancel. This gives A'D.", highlight: [1,3,5,7] },
      { text: "m1 and m3 appear in BOTH groups — overlapping is allowed in K-maps. Final answer: F = A'B' + A'D.", highlight: [] },
    ]
  },
  ex5: {
    label: "Sum(1,3,4,5,9,11,12,13)",
    minterms: [1,3,4,5,9,11,12,13],
    answer: "F = B'D + BC'",
    terms: 2,
    groups: [
      { minterms: [1,3,9,11], color: 'rgba(58,110,165,0.25)', border: 'var(--accent)', label: "B'D" },
      { minterms: [4,5,12,13], color: 'rgba(196,120,50,0.25)', border: 'var(--sienna)', label: "BC'" }
    ],
    steps: [
      { text: "Group 1: m1, m3, m9, m11 all have B = 0 and D = 1 (wrapping vertically between rows 0 and 3). A, C cancel. Gives B'D.", highlight: [1,3,9,11] },
      { text: "Group 2: m4, m5, m12, m13 all have B = 1 and C = 0. A, D cancel. Gives BC'.", highlight: [4,5,12,13] },
      { text: "No overlap. Two clean groups. Final answer: F = B'D + BC'.", highlight: [] },
    ]
  },
}

const GRAY = ['00','01','11','10']

function mintermToCell(m) {
  const a = (m >> 3) & 1, b = (m >> 2) & 1, c = (m >> 1) & 1, d = m & 1
  const row = GRAY.indexOf(`${a}${b}`)
  const col = GRAY.indexOf(`${c}${d}`)
  return [row, col]
}

export default function KmapViz() {
  const [preset, setPreset] = useState('ex1')
  const [cells, setCells] = useState(() => {
    const c = Array(16).fill(0)
    PRESETS.ex1.minterms.forEach(m => c[m] = 1)
    return c
  })
  const [stepIdx, setStepIdx] = useState(0)

  const p = PRESETS[preset] || { label: 'Custom', minterms: [], answer: '—', terms: 0, groups: [], steps: [] }

  const selectPreset = (key) => {
    setPreset(key)
    setStepIdx(0)
    const c = Array(16).fill(0)
    PRESETS[key].minterms.forEach(m => c[m] = 1)
    setCells(c)
  }

  const toggleCell = (m) => {
    setPreset('custom')
    setStepIdx(0)
    setCells(prev => { const n = [...prev]; n[m] = n[m] ? 0 : 1; return n })
  }

  const cellSize = 56
  const headerH = 30
  const headerW = 30

  const currentStep = p.steps && p.steps[stepIdx]
  const highlightedMinterms = currentStep ? currentStep.highlight : []

  const getCellGroupColor = (m) => {
    if (!p.groups) return null
    for (const g of p.groups) {
      if (g.minterms.includes(m)) return g
    }
    return null
  }

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · learn to solve K-maps</span>
        <span className="mono theory__progress">pick an example · follow the steps · click cells to try your own</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          Place. Group. Read. <em>Simplified.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          A 4-variable K-map has 16 cells (one per input combination ABCD).
          Place the 1s, circle the biggest groups of adjacent 1s, and read off which variables stay constant.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">F = {p.label}</span>
            <span className="mono vizstage__statesub">{cells.filter(c=>c).length} minterms active · {p.terms} product term{p.terms !== 1 ? 's' : ''}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>result</span>
            <span className="serif vizstage__id">{p.answer}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox={`0 0 ${headerW + 4*cellSize + 20} ${headerH + 4*cellSize + 40}`} width="100%"
               style={{background:'var(--paper)', borderRadius:8}}>

            {/* Column headers CD */}
            <text x={headerW + 2*cellSize} y="14" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-mute)">CD</text>
            {GRAY.map((g, ci) => (
              <text key={`ch${ci}`} x={headerW + ci*cellSize + cellSize/2} y={headerH-4} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">{g}</text>
            ))}

            {/* Row headers AB */}
            <text x="10" y={headerH + 2*cellSize} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-mute)" transform={`rotate(-90,10,${headerH+2*cellSize})`}>AB</text>
            {GRAY.map((g, ri) => (
              <text key={`rh${ri}`} x={headerW - 6} y={headerH + ri*cellSize + cellSize/2 + 4} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">{g}</text>
            ))}

            {/* Cells */}
            {Array.from({length:16}).map((_, m) => {
              const [row, col] = mintermToCell(m)
              const x = headerW + col * cellSize
              const y = headerH + row * cellSize
              const isOne = cells[m]
              const group = isOne ? getCellGroupColor(m) : null
              const isHighlighted = highlightedMinterms.includes(m)
              return (
                <g key={m} onClick={() => toggleCell(m)} style={{cursor:'pointer'}}>
                  <rect x={x} y={y} width={cellSize} height={cellSize}
                        fill={group ? group.color : (isOne ? 'rgba(58,110,165,0.08)' : 'var(--surface)')}
                        stroke={isHighlighted ? (group ? group.border : 'var(--accent)') : 'var(--rule)'}
                        strokeWidth={isHighlighted ? 2.5 : 1}/>
                  <text x={x+cellSize/2} y={y+cellSize/2+5} textAnchor="middle" fontSize="14" fontFamily="JetBrains Mono"
                        fontWeight={isOne ? 700 : 400} fill={isOne ? 'var(--accent)' : 'var(--ink-faint)'}>{isOne ? '1' : '0'}</text>
                  <text x={x+4} y={y+12} fontSize="7" fontFamily="JetBrains Mono" fill="var(--ink-faint)" opacity="0.5">m{m}</text>
                </g>
              )
            })}

            {/* Group labels */}
            {p.groups && p.groups.map((g, gi) => {
              const positions = g.minterms.map(m => mintermToCell(m))
              const avgCol = positions.reduce((s, p) => s + p[1], 0) / positions.length
              const maxRow = Math.max(...positions.map(p => p[0]))
              return (
                <text key={`gl${gi}`}
                      x={headerW + avgCol * cellSize + cellSize/2}
                      y={headerH + (maxRow + 1) * cellSize + 14}
                      textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600"
                      fill={g.border}>
                  {g.label}
                </text>
              )
            })}
          </svg>
        </div>

        {/* Step-by-step guide */}
        {p.steps && p.steps.length > 0 && (
          <div style={{marginTop:16, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
              <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em'}}>
                HOW TO SOLVE &mdash; STEP {stepIdx + 1} OF {p.steps.length}
              </div>
              <div style={{display:'flex', gap:8}}>
                <button onClick={() => setStepIdx(i => Math.max(0, i-1))}
                        disabled={stepIdx === 0}
                        style={{padding:'4px 12px', borderRadius:4, border:'1px solid var(--rule)', background:'var(--paper)', cursor: stepIdx === 0 ? 'default' : 'pointer', opacity: stepIdx === 0 ? 0.4 : 1, fontSize:11, fontFamily:'JetBrains Mono'}}>
                  Prev
                </button>
                <button onClick={() => setStepIdx(i => Math.min(p.steps.length - 1, i+1))}
                        disabled={stepIdx === p.steps.length - 1}
                        style={{padding:'4px 12px', borderRadius:4, border:'1px solid var(--accent)', background:'rgba(58,110,165,0.1)', cursor: stepIdx === p.steps.length - 1 ? 'default' : 'pointer', opacity: stepIdx === p.steps.length - 1 ? 0.4 : 1, fontSize:11, fontFamily:'JetBrains Mono', color:'var(--accent)'}}>
                  Next
                </button>
              </div>
            </div>
            <p style={{fontSize:14, color:'var(--ink)', lineHeight:1.6, margin:0}}>
              <strong style={{color:'var(--accent)'}}>Step {stepIdx + 1}:</strong> {currentStep.text}
            </p>
            {/* Step progress dots */}
            <div style={{display:'flex', gap:6, marginTop:12}}>
              {p.steps.map((_, i) => (
                <div key={i} onClick={() => setStepIdx(i)} style={{
                  width:8, height:8, borderRadius:'50%', cursor:'pointer',
                  background: i === stepIdx ? 'var(--accent)' : 'var(--rule)',
                  transition: 'background 0.2s ease'
                }}/>
              ))}
            </div>
          </div>
        )}

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">Simplified expression</div>
            <h3 className="serif vizexplain__head"><em>{p.answer}</em></h3>
          </div>
          <p className="vizexplain__body">
            <strong>Key rules:</strong> Group of 2 = eliminate 1 variable. Group of 4 = eliminate 2. Group of 8 = eliminate 3.
            Always make the biggest groups possible. Groups can overlap. The grid wraps around (edges are adjacent).
          </p>
          <div className="vizexplain__formula mono">{p.terms} product term{p.terms !== 1 ? 's' : ''} in minimum SOP form</div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">try an example</span>
          <div className="vizctrl__quickbtns">
            {Object.entries(PRESETS).map(([key, val]) => (
              <button key={key} className={`vizctrl__jumpbtn ${preset === key ? 'is-active' : ''}`}
                      onClick={() => selectPreset(key)}>
                <span className="serif vizctrl__jumpname" style={{fontSize:11}}>{val.label.length > 20 ? val.answer.replace('F = ','') : val.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
