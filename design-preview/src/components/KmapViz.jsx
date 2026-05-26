'use client'
import { useState } from 'react'

const PRESETS = {
  ex1: {
    label: "F(A,B,C,D) = Sum(0,1,2,3,4,5,6,7)",
    shortLabel: "Sum(0-7)",
    minterms: [0,1,2,3,4,5,6,7],
    answer: "F = A'",
    terms: 1,
    groups: [
      { minterms: [0,1,2,3,4,5,6,7], color: 'rgba(58,110,165,0.2)', border: 'var(--accent)', label: "A'" }
    ],
    tutorial: [
      {
        title: "Place the 1s on the grid",
        text: "We need to put a 1 in every cell whose minterm number is in our list: m0 through m7. Look at the grid. These 8 cells fill the top two rows completely (where AB = 00 and AB = 01).",
        highlight: [0,1,2,3,4,5,6,7],
        notice: "All 8 cells sit in rows where A = 0. The bottom two rows (where A = 1) are all 0s.",
        why: "The minterm numbers 0-7 in binary are 0000 through 0111. The first bit (A) is always 0 in this range."
      },
      {
        title: "Find the biggest possible group",
        text: "K-map rule: groups must be rectangles, and their size must be a power of 2 (1, 2, 4, 8, or 16 cells). Here, all 8 cells form a perfect 2-row x 4-column rectangle. That is a group of 8.",
        highlight: [0,1,2,3,4,5,6,7],
        notice: "A group of 8 cells eliminates 3 variables (since 2^3 = 8). With 4 variables total, only 1 variable remains.",
        why: "Bigger groups = more variables cancel = simpler expression. Always start with the largest group you can make."
      },
      {
        title: "Read the simplified expression",
        text: "Look at what stays CONSTANT inside the group. B changes (0 and 1), C changes, D changes. All three cancel out. Only A stays at 0 throughout. A = 0 means A'. So the answer is F = A'.",
        highlight: [],
        notice: "The final answer F = A' has just 1 variable. We started with 4 variables (A, B, C, D) and the group of 8 eliminated 3 of them.",
        why: "When a variable takes both values (0 and 1) inside a group, it does not matter for the output, so it disappears from the expression."
      }
    ]
  },
  ex2: {
    label: "F(A,B,C,D) = Sum(0,2,8,10)",
    shortLabel: "Sum(0,2,8,10)",
    minterms: [0,2,8,10],
    answer: "F = B'D'",
    terms: 1,
    groups: [
      { minterms: [0,2,8,10], color: 'rgba(58,110,165,0.2)', border: 'var(--accent)', label: "B'D'" }
    ],
    tutorial: [
      {
        title: "Place the 1s -- they look scattered",
        text: "Put 1s at m0, m2, m8, and m10. On the grid, these land at four corners: top-left, top-right, bottom-left, bottom-right. They look far apart!",
        highlight: [0,2,8,10],
        notice: "The 4 cells seem to be at the four corners of the grid. In a normal grid, corners are NOT adjacent.",
        why: "This is where K-maps get interesting. The grid is not a flat sheet. It wraps around like a donut (torus). The left edge touches the right edge, and the top touches the bottom."
      },
      {
        title: "The K-map wraps around -- corners ARE adjacent",
        text: "Because the K-map wraps, the left column (CD=00) is actually next to the right column (CD=10). And the top row (AB=00) is next to the bottom row (AB=10). So all four corners form a valid group of 4!",
        highlight: [0,2,8,10],
        notice: "This is the most important K-map trick students miss. ALWAYS check if cells on opposite edges can form a group by wrapping.",
        why: "Gray code ordering ensures that adjacent columns/rows differ by exactly 1 variable. Column 00 and column 10 differ by only 1 bit (C), making them logically adjacent."
      },
      {
        title: "Read the group",
        text: "In all 4 cells: B = 0 and D = 0 (constant). A changes (0 in top rows, 1 in bottom rows) and C changes (0 in left columns, 1 in right columns). Both cancel. Answer: F = B'D'.",
        highlight: [],
        notice: "Group of 4 eliminates 2 variables (A and C), leaving 2 variables (B' and D') in the answer.",
        why: "B'D' means: output is 1 whenever B is 0 AND D is 0, regardless of what A and C are."
      }
    ]
  },
  ex3: {
    label: "F(A,B,C,D) = Sum(4,5,6,7,12,13,14,15)",
    shortLabel: "Sum(4-7,12-15)",
    minterms: [4,5,6,7,12,13,14,15],
    answer: "F = B",
    terms: 1,
    groups: [
      { minterms: [4,5,6,7,12,13,14,15], color: 'rgba(58,110,165,0.2)', border: 'var(--accent)', label: "B" }
    ],
    tutorial: [
      {
        title: "Place the 1s",
        text: "Minterms 4-7 and 12-15 fill the middle two rows of the grid (AB = 01 and AB = 11). Both of these rows have one thing in common: B = 1.",
        highlight: [4,5,6,7,12,13,14,15],
        notice: "The two filled rows are in the middle. They are adjacent because in Gray code, 01 and 11 differ by only 1 bit (the A bit).",
        why: "Minterms 4-7 are 0100 to 0111 (B=1, A=0). Minterms 12-15 are 1100 to 1111 (B=1, A=1). B is always 1."
      },
      {
        title: "Group all 8 into one rectangle",
        text: "2 rows x 4 columns = 8 cells. This is the biggest possible group. A changes, C changes, D changes. All 3 cancel out.",
        highlight: [4,5,6,7,12,13,14,15],
        notice: "Only B stays constant at 1 across all 8 cells. The answer is just one variable: F = B.",
        why: "When B = 1, the output is always 1 no matter what A, C, or D are. The K-map makes this visually obvious: the entire B = 1 region is filled."
      },
      {
        title: "Final answer",
        text: "F = B. This is as simple as it gets. The output depends on only one variable. If B is 1, output is 1. If B is 0, output is 0.",
        highlight: [],
        notice: "Compare this to writing out the original sum-of-products with 8 minterms. The K-map reduced it to a single variable.",
        why: "This is the power of K-maps: finding patterns that are hard to spot algebraically."
      }
    ]
  },
  ex4: {
    label: "F(A,B,C,D) = Sum(0,1,2,3,5,7)",
    shortLabel: "Sum(0-3,5,7)",
    minterms: [0,1,2,3,5,7],
    answer: "F = A'B' + A'D",
    terms: 2,
    groups: [
      { minterms: [0,1,2,3], color: 'rgba(58,110,165,0.2)', border: 'var(--accent)', label: "A'B'" },
      { minterms: [1,3,5,7], color: 'rgba(196,120,50,0.2)', border: 'var(--sienna)', label: "A'D" }
    ],
    tutorial: [
      {
        title: "Place the 1s",
        text: "m0 through m3 fill the entire first row (AB = 00). m5 and m7 are in the second row (AB = 01). Not all cells in a row are filled this time: m4 and m6 are 0.",
        highlight: [0,1,2,3,5,7],
        notice: "The first row is completely filled. In the second row, only the odd-numbered minterms (m5, m7) have 1. These are cells where D = 1.",
        why: "This is a case where one big group is not enough. We will need multiple groups to cover all the 1s."
      },
      {
        title: "Group 1: the full first row",
        text: "m0, m1, m2, m3 form a group of 4 (1 row x 4 columns). A = 0 and B = 0 are constant. C and D change, so they cancel. This gives the term A'B'.",
        highlight: [0,1,2,3],
        notice: "This group covers the entire top row. It is easy to spot because the entire row is filled with 1s.",
        why: "Group of 4 = eliminate 2 variables. We started with ABCD and eliminated C and D, leaving A'B'."
      },
      {
        title: "Group 2: the D=1 column pairs",
        text: "m1, m3, m5, m7 all have A = 0 and D = 1 (constant). B and C change, so they cancel. This gives the term A'D. Note that m1 and m3 appear in BOTH groups. Overlapping is allowed and encouraged!",
        highlight: [1,3,5,7],
        notice: "Overlapping groups are one of the most useful K-map strategies. A cell can belong to as many groups as you want. This lets you make each group as large as possible.",
        why: "Without overlapping, you would need smaller groups (pairs instead of quads), giving a more complex expression."
      },
      {
        title: "Combine: F = A'B' + A'D",
        text: "The final SOP expression ORs all the groups together. Two product terms, each with 2 variables. That is much simpler than writing out 6 individual minterms.",
        highlight: [],
        notice: "Every 1 on the grid is covered by at least one group. No 0 is included in any group. These are the two rules that guarantee correctness.",
        why: "The expression means: output is 1 when (A is 0 AND B is 0) OR when (A is 0 AND D is 1). You can verify: plug in any of the 6 minterms and one of these conditions will be true."
      }
    ]
  },
  ex5: {
    label: "F(A,B,C,D) = Sum(1,3,4,5,9,11,12,13)",
    shortLabel: "Sum(1,3,4,5,9,11,12,13)",
    minterms: [1,3,4,5,9,11,12,13],
    answer: "F = B'D + BC'",
    terms: 2,
    groups: [
      { minterms: [1,3,9,11], color: 'rgba(58,110,165,0.2)', border: 'var(--accent)', label: "B'D" },
      { minterms: [4,5,12,13], color: 'rgba(196,120,50,0.2)', border: 'var(--sienna)', label: "BC'" }
    ],
    tutorial: [
      {
        title: "Place the 1s -- scattered pattern",
        text: "8 minterms spread across all 4 rows. This looks messy at first. The key is to find groups by looking for rectangles of 1s, including ones that wrap around edges.",
        highlight: [1,3,4,5,9,11,12,13],
        notice: "Half the grid is 1s, half is 0s. There must be a fairly simple expression hiding in here.",
        why: "Even scattered-looking patterns have structure. K-maps reveal it visually where algebra struggles."
      },
      {
        title: "Group 1: B'D (wraps top to bottom)",
        text: "m1, m3 are in row AB=00 and m9, m11 are in row AB=10. These rows wrap around vertically (top and bottom are adjacent in Gray code). All 4 cells have B = 0 and D = 1. A and C vary, so they cancel. This gives B'D.",
        highlight: [1,3,9,11],
        notice: "Rows AB=00 and AB=10 are adjacent because they differ by only the A bit. This wrapping group is easy to miss if you only look at physically close cells.",
        why: "In Gray code order: 00, 01, 11, 10. The first (00) and last (10) are adjacent, just like the middle two (01, 11). The grid is a cylinder."
      },
      {
        title: "Group 2: BC' (middle rows, left half)",
        text: "m4, m5, m12, m13 are in rows AB=01 and AB=11 (both have B=1), columns CD=00 and CD=01 (both have C=0). B = 1 and C = 0 are constant. A and D cancel. This gives BC'.",
        highlight: [4,5,12,13],
        notice: "These 4 cells form a visible 2x2 square in the middle-left of the grid. No wrapping needed for this group.",
        why: "Group of 4 eliminates 2 variables. B=1 (hence B, not B') and C=0 (hence C') stay constant."
      },
      {
        title: "Final: F = B'D + BC'",
        text: "Two groups, no overlap, all 8 minterms covered. The expression means: output is 1 when (B=0 AND D=1) OR (B=1 AND C=0).",
        highlight: [],
        notice: "Check: every 1 cell belongs to exactly one group. Every 0 cell is excluded from all groups. This is a clean, minimal cover.",
        why: "Without K-maps, simplifying Sum(1,3,4,5,9,11,12,13) algebraically would take many steps of Boolean algebra. The K-map gives the answer by visual inspection."
      }
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
  const [showGuide, setShowGuide] = useState(true)

  const p = PRESETS[preset] || { label: 'Custom', shortLabel: 'Custom', minterms: [], answer: '---', terms: 0, groups: [], tutorial: [] }

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

  const currentStep = p.tutorial && p.tutorial[stepIdx]
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
        <span className="rubric">Viz · learn to solve K-maps step by step</span>
        <span className="mono theory__progress">pick an example · read the tutorial · try your own</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          See the pattern. <em>Read the answer.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          A K-map turns messy Boolean algebra into a visual puzzle. Place 1s on a grid,
          circle groups of adjacent 1s, and read off the simplified expression.
          No algebra needed. Just pattern recognition.
        </p>
      </header>

      {/* What is a K-map? (collapsible reference) */}
      <section style={{marginBottom:24}}>
        <button onClick={() => setShowGuide(g => !g)} style={{
          display:'flex', alignItems:'center', gap:8, padding:'12px 20px', width:'100%',
          border:'1px solid var(--rule)', borderRadius:showGuide ? '8px 8px 0 0' : '8px', background:'var(--surface)',
          cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--accent)', textAlign:'left',
          fontFamily:'inherit'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform: showGuide ? 'rotate(90deg)' : 'rotate(0)', transition:'transform 200ms ease-out'}}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
          UNDERSTANDING THE K-MAP GRID {showGuide ? '(click to collapse)' : '(click to expand)'}
        </button>

        {showGuide && (
          <div style={{padding:'20px', border:'1px solid var(--rule)', borderTop:'none', borderRadius:'0 0 8px 8px', background:'var(--surface)'}}>
            <div style={{display:'grid', gap:16}}>
              <div>
                <div className="mono" style={{fontSize:10, color:'var(--accent)', letterSpacing:'0.06em', marginBottom:6, fontWeight:700}}>WHAT IS A K-MAP?</div>
                <p style={{fontSize:13, color:'var(--ink)', lineHeight:1.6, margin:0}}>
                  A Karnaugh Map is a special grid where <strong>each cell represents one combination of input variables</strong>.
                  For 4 variables (A, B, C, D), we get 2^4 = 16 cells, arranged in a 4x4 grid.
                  The magic is in the <strong>ordering</strong>: rows and columns use Gray code (00, 01, 11, 10),
                  so any two neighboring cells differ by exactly one variable.
                </p>
              </div>

              <div>
                <div className="mono" style={{fontSize:10, color:'var(--accent)', letterSpacing:'0.06em', marginBottom:6, fontWeight:700}}>WHY GRAY CODE ORDER?</div>
                <p style={{fontSize:13, color:'var(--ink)', lineHeight:1.6, margin:0}}>
                  Normal binary counting (00, 01, 10, 11) has a problem: going from 01 to 10 changes TWO bits at once.
                  Gray code (00, 01, 11, 10) ensures every step changes exactly ONE bit.
                  This means <strong>physically adjacent cells on the grid are also logically adjacent</strong>. They differ by exactly 1 variable.
                  When two adjacent cells both have 1, the variable that changes between them can be eliminated.
                </p>
              </div>

              <div>
                <div className="mono" style={{fontSize:10, color:'var(--accent)', letterSpacing:'0.06em', marginBottom:6, fontWeight:700}}>THE WRAPPING RULE</div>
                <p style={{fontSize:13, color:'var(--ink)', lineHeight:1.6, margin:0}}>
                  The grid wraps around like a donut: <strong>the left edge is adjacent to the right edge</strong>,
                  and <strong>the top edge is adjacent to the bottom edge</strong>.
                  This means the four corners of the grid are actually all adjacent to each other!
                  This is the trick that students miss most often. See Example 2 for a demo.
                </p>
              </div>

              <div>
                <div className="mono" style={{fontSize:10, color:'var(--accent)', letterSpacing:'0.06em', marginBottom:6, fontWeight:700}}>THE 3-STEP RECIPE</div>
                <div style={{display:'grid', gap:6}}>
                  <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                    <span className="mono" style={{fontSize:12, color:'var(--accent)', fontWeight:700, minWidth:20}}>1.</span>
                    <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}><strong>PLACE</strong> -- Write 1 in every cell whose minterm is in the given function. Write 0 everywhere else.</span>
                  </div>
                  <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                    <span className="mono" style={{fontSize:12, color:'var(--accent)', fontWeight:700, minWidth:20}}>2.</span>
                    <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}><strong>GROUP</strong> -- Circle rectangular groups of 1s. Size must be a power of 2 (1, 2, 4, 8, 16). Make groups as LARGE as possible. Groups can overlap. Every 1 must be in at least one group.</span>
                  </div>
                  <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                    <span className="mono" style={{fontSize:12, color:'var(--accent)', fontWeight:700, minWidth:20}}>3.</span>
                    <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}><strong>READ</strong> -- For each group, find which variables stay constant. Variables that change inside the group are eliminated. OR all the group terms together for the final answer.</span>
                  </div>
                </div>
              </div>

              <div style={{padding:'12px 16px', borderRadius:6, background:'rgba(58,110,165,0.06)', border:'1px solid rgba(58,110,165,0.12)'}}>
                <div className="mono" style={{fontSize:10, color:'var(--accent)', letterSpacing:'0.06em', marginBottom:4, fontWeight:700}}>GROUP SIZE CHEAT SHEET</div>
                <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:'4px 16px', fontSize:13, color:'var(--ink)'}}>
                  <span className="mono" style={{fontWeight:600}}>2 cells</span><span>eliminates 1 variable (3 remain)</span>
                  <span className="mono" style={{fontWeight:600}}>4 cells</span><span>eliminates 2 variables (2 remain)</span>
                  <span className="mono" style={{fontWeight:600}}>8 cells</span><span>eliminates 3 variables (1 remains)</span>
                  <span className="mono" style={{fontWeight:600}}>16 cells</span><span>eliminates all 4 variables (F = 1)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">{p.shortLabel || p.label}</span>
            <span className="mono vizstage__statesub">{cells.filter(c=>c).length} minterms active · {p.terms} product term{p.terms !== 1 ? 's' : ''}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>result</span>
            <span className="serif vizstage__id">{p.answer}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          {/* Interactive K-map grid */}
          <svg viewBox={`0 0 ${headerW + 4*cellSize + 20} ${headerH + 4*cellSize + 40}`} width="100%"
               style={{background:'var(--paper)', borderRadius:8}}>

            {/* Column headers CD */}
            <text x={headerW + 2*cellSize} y="14" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-mute)" fontWeight="600">CD</text>
            {GRAY.map((g, ci) => (
              <text key={`ch${ci}`} x={headerW + ci*cellSize + cellSize/2} y={headerH-4} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">{g}</text>
            ))}

            {/* Row headers AB */}
            <text x="10" y={headerH + 2*cellSize} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-mute)" fontWeight="600" transform={`rotate(-90,10,${headerH+2*cellSize})`}>AB</text>
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
                        fontWeight={isOne ? 700 : 400} fill={isOne ? (group ? group.border : 'var(--accent)') : 'var(--ink-faint)'}>{isOne ? '1' : '0'}</text>
                  <text x={x+4} y={y+12} fontSize="7" fontFamily="JetBrains Mono" fill="var(--ink-faint)" opacity="0.5">m{m}</text>
                </g>
              )
            })}

            {/* Group labels below grid */}
            {p.groups && p.groups.map((g, gi) => {
              const positions = g.minterms.map(m => mintermToCell(m))
              const avgCol = positions.reduce((s, pos) => s + pos[1], 0) / positions.length
              const maxRow = Math.max(...positions.map(pos => pos[0]))
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

          {/* Interactive instruction */}
          <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', textAlign:'center', marginTop:4, letterSpacing:'0.04em'}}>
            Click any cell to toggle it between 0 and 1. Selecting a preset below resets the grid.
          </div>
        </div>

        {/* Step-by-step tutorial */}
        {p.tutorial && p.tutorial.length > 0 && (
          <div style={{marginTop:20}}>
            {/* Step navigation */}
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
              <div className="mono" style={{fontSize:11, color:'var(--accent)', letterSpacing:'0.06em', fontWeight:700}}>
                WALKTHROUGH — STEP {stepIdx + 1} OF {p.tutorial.length}
              </div>
              <div style={{display:'flex', gap:8}}>
                <button onClick={() => setStepIdx(i => Math.max(0, i-1))}
                        disabled={stepIdx === 0}
                        style={{padding:'6px 14px', borderRadius:4, border:'1px solid var(--rule)', background:'var(--paper)', cursor: stepIdx === 0 ? 'default' : 'pointer', opacity: stepIdx === 0 ? 0.4 : 1, fontSize:11, fontFamily:'JetBrains Mono', color:'var(--ink-mute)'}}>
                  Prev
                </button>
                <button onClick={() => setStepIdx(i => Math.min(p.tutorial.length - 1, i+1))}
                        disabled={stepIdx === p.tutorial.length - 1}
                        style={{padding:'6px 14px', borderRadius:4, border:'1px solid var(--accent)', background:'rgba(58,110,165,0.1)', cursor: stepIdx === p.tutorial.length - 1 ? 'default' : 'pointer', opacity: stepIdx === p.tutorial.length - 1 ? 0.4 : 1, fontSize:11, fontFamily:'JetBrains Mono', color:'var(--accent)', fontWeight:600}}>
                  Next
                </button>
              </div>
            </div>

            {/* Step content card */}
            <div style={{border:'1px solid var(--rule)', borderRadius:8, overflow:'hidden'}}>
              {/* Step title */}
              <div style={{padding:'14px 20px', background:'rgba(58,110,165,0.06)', borderBottom:'1px solid var(--rule)'}}>
                <span className="serif" style={{fontSize:16, fontWeight:600, color:'var(--ink)'}}>
                  Step {stepIdx + 1}: {currentStep.title}
                </span>
              </div>

              {/* Main explanation */}
              <div style={{padding:'16px 20px'}}>
                <p style={{fontSize:14, color:'var(--ink)', lineHeight:1.7, margin:0}}>
                  {currentStep.text}
                </p>
              </div>

              {/* What to notice */}
              <div style={{padding:'14px 20px', borderTop:'1px solid var(--rule)', background:'rgba(76,175,80,0.04)'}}>
                <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2" style={{marginTop:2, flexShrink:0}}>
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                  </svg>
                  <div>
                    <div className="mono" style={{fontSize:9, color:'var(--ok)', letterSpacing:'0.08em', marginBottom:4, fontWeight:700}}>WHAT TO NOTICE</div>
                    <p style={{fontSize:13, color:'var(--ink)', lineHeight:1.6, margin:0}}>{currentStep.notice}</p>
                  </div>
                </div>
              </div>

              {/* Why this works */}
              <div style={{padding:'14px 20px', borderTop:'1px solid var(--rule)', background:'rgba(196,120,50,0.04)'}}>
                <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sienna)" strokeWidth="2" style={{marginTop:2, flexShrink:0}}>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
                  </svg>
                  <div>
                    <div className="mono" style={{fontSize:9, color:'var(--sienna)', letterSpacing:'0.08em', marginBottom:4, fontWeight:700}}>WHY THIS WORKS</div>
                    <p style={{fontSize:13, color:'var(--ink)', lineHeight:1.6, margin:0}}>{currentStep.why}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step progress dots */}
            <div style={{display:'flex', gap:6, marginTop:12, justifyContent:'center'}}>
              {p.tutorial.map((_, i) => (
                <div key={i} onClick={() => setStepIdx(i)} style={{
                  width:10, height:10, borderRadius:'50%', cursor:'pointer',
                  background: i === stepIdx ? 'var(--accent)' : i < stepIdx ? 'rgba(58,110,165,0.3)' : 'var(--rule)',
                  transition: 'background 0.2s ease',
                  border: i === stepIdx ? '2px solid var(--accent)' : '2px solid transparent'
                }}/>
              ))}
            </div>
          </div>
        )}

        {/* Quick reference: group rules */}
        <div style={{marginTop:20, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
          <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:12}}>K-MAP RULES QUICK REFERENCE</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            <div style={{fontSize:12, color:'var(--ink)', lineHeight:1.6}}>
              <strong style={{color:'var(--accent)'}}>Groups must be:</strong><br/>
              Rectangles (1x2, 2x2, 1x4, 2x4, 4x4)<br/>
              Power of 2 in size (1, 2, 4, 8, 16)<br/>
              As large as possible
            </div>
            <div style={{fontSize:12, color:'var(--ink)', lineHeight:1.6}}>
              <strong style={{color:'var(--accent)'}}>Remember:</strong><br/>
              Groups CAN overlap<br/>
              Grid wraps (left-right, top-bottom)<br/>
              Only group the 1s, never the 0s
            </div>
          </div>
        </div>

        {/* How to read the answer */}
        <div style={{marginTop:12, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
          <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:12}}>HOW TO READ A GROUP</div>
          <div style={{display:'grid', gap:8}}>
            <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:20}}>1.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                Look at each variable (A, B, C, D) inside the group.
              </span>
            </div>
            <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:20}}>2.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                If a variable is <strong>always 0</strong> in the group, write it as the complement (e.g., A = 0 gives A').
              </span>
            </div>
            <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:20}}>3.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                If a variable is <strong>always 1</strong>, write it as-is (e.g., B = 1 gives B).
              </span>
            </div>
            <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:20}}>4.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                If a variable takes <strong>both 0 and 1</strong>, it cancels out. Do not include it.
              </span>
            </div>
            <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:20}}>5.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                AND the remaining variables together for that group's product term. OR all groups for the final SOP.
              </span>
            </div>
          </div>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">Simplified expression</div>
            <h3 className="serif vizexplain__head"><em>{p.answer}</em></h3>
          </div>
          <p className="vizexplain__body">
            {p.terms} product term{p.terms !== 1 ? 's' : ''} in minimum SOP form.
            {p.groups && p.groups.length > 1 ? ` Groups: ${p.groups.map(g => g.label).join(' + ')}.` : ''}
            {p.groups && p.groups.length === 1 ? ` One group covering all ${p.minterms.length} minterms.` : ''}
          </p>
          <div className="vizexplain__formula mono">{p.label}</div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">try an example</span>
          <div className="vizctrl__quickbtns">
            {Object.entries(PRESETS).map(([key, val]) => (
              <button key={key} className={`vizctrl__jumpbtn ${preset === key ? 'is-active' : ''}`}
                      onClick={() => selectPreset(key)}>
                <span className="serif vizctrl__jumpname" style={{fontSize:11}}>{val.shortLabel || val.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{marginTop:12, padding:'12px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
          <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:6}}>TRY IT YOURSELF</div>
          <p style={{fontSize:13, color:'var(--ink-mute)', lineHeight:1.6, margin:0}}>
            Click any cell on the grid to toggle between 0 and 1. Create your own function and practice grouping.
            When you click a cell, the preset resets to "Custom" and you are on your own to find the groups!
          </p>
        </div>
      </section>
    </article>
  )
}
