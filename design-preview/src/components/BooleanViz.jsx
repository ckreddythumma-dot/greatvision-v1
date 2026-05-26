'use client'
import React, { useState } from 'react'

const GATES = {
  AND:  { fn: (a,b) => a & b, symbol: 'A . B', desc: 'Output is 1 only when BOTH inputs are 1', analogy: 'Two switches in series — BOTH must be ON for current to flow.' },
  OR:   { fn: (a,b) => a | b, symbol: 'A + B', desc: 'Output is 1 when ANY input is 1', analogy: 'Two switches in parallel — EITHER being ON lets current flow.' },
  NOT:  { fn: (a) => a ? 0 : 1, symbol: "A'", desc: 'Flips the input: 0 becomes 1, 1 becomes 0', single: true, analogy: 'An inverter — flips the switch. ON becomes OFF, OFF becomes ON.' },
  NAND: { fn: (a,b) => (a & b) ? 0 : 1, symbol: "(A.B)'", desc: 'Opposite of AND. Universal gate.', analogy: 'AND followed by NOT. Can build ANY other gate from NAND alone.' },
  NOR:  { fn: (a,b) => (a | b) ? 0 : 1, symbol: "(A+B)'", desc: 'Opposite of OR. Universal gate.', analogy: 'OR followed by NOT. Can build ANY other gate from NOR alone.' },
  XOR:  { fn: (a,b) => a ^ b, symbol: 'A xor B', desc: 'Output is 1 when inputs are DIFFERENT', analogy: 'A "difference detector" — are the two inputs different? If yes, output 1.' },
}

export default function BooleanViz() {
  const [gate, setGate] = useState('AND')
  const [inputA, setInputA] = useState(0)
  const [inputB, setInputB] = useState(0)
  const g = GATES[gate]
  const output = g.single ? g.fn(inputA) : g.fn(inputA, inputB)

  const rows = g.single
    ? [[0],[1]].map(([a]) => ({ a, out: g.fn(a) }))
    : [[0,0],[0,1],[1,0],[1,1]].map(([a,b]) => ({ a, b, out: g.fn(a,b) }))

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · toggle the inputs</span>
        <span className="mono theory__progress">pick a gate · flip switches · see output</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          Every computer is built from these. <em>Just gates.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Click the switches to change inputs. The gate combines them using a simple rule.
          NAND alone can build any other gate — that is why it is called "universal."
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">{gate} Gate</span>
            <span className="mono vizstage__statesub">{g.desc}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>Y</span>
            <span className="serif vizstage__id" style={{color: output ? 'var(--ok)' : 'var(--ink-mute)'}}>{output}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox="0 0 400 240" width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            {/* Input A */}
            <g onClick={() => setInputA(a => a ? 0 : 1)} style={{cursor:'pointer'}}>
              <rect x="30" y="60" width="60" height="36" rx="6" fill={inputA ? 'var(--accent)' : 'var(--surface)'} stroke={inputA ? 'var(--accent)' : 'var(--rule-strong)'} strokeWidth="1.5"/>
              <text x="60" y="83" textAnchor="middle" fontSize="14" fontFamily="JetBrains Mono" fill={inputA ? '#fff' : 'var(--ink)'}>{inputA}</text>
              <text x="60" y="52" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">A (click)</text>
            </g>

            {!g.single && (
              <g onClick={() => setInputB(b => b ? 0 : 1)} style={{cursor:'pointer'}}>
                <rect x="30" y="140" width="60" height="36" rx="6" fill={inputB ? 'var(--accent)' : 'var(--surface)'} stroke={inputB ? 'var(--accent)' : 'var(--rule-strong)'} strokeWidth="1.5"/>
                <text x="60" y="163" textAnchor="middle" fontSize="14" fontFamily="JetBrains Mono" fill={inputB ? '#fff' : 'var(--ink)'}>{inputB}</text>
                <text x="60" y="132" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">B (click)</text>
              </g>
            )}

            {/* Wires */}
            <line x1="90" y1="78" x2="150" y2="78" stroke={inputA ? 'var(--accent)' : 'var(--ink-faint)'} strokeWidth="2"/>
            {!g.single && <line x1="90" y1="158" x2="150" y2="158" stroke={inputB ? 'var(--accent)' : 'var(--ink-faint)'} strokeWidth="2"/>}

            {/* Gate body */}
            <rect x="150" y={g.single ? "58" : "68"} width="100" height={g.single ? "40" : "100"} rx="8"
                  fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="2"/>
            <text x="200" y={g.single ? "82" : "124"} textAnchor="middle" fontSize="16" fontFamily="JetBrains Mono" fontWeight="600" fill="var(--ink)">{gate}</text>

            {/* Bubble for NOT/NAND/NOR */}
            {(gate === 'NOT' || gate === 'NAND' || gate === 'NOR') && (
              <circle cx="256" cy={g.single ? "78" : "118"} r="6" fill="var(--paper)" stroke="var(--rule-strong)" strokeWidth="1.5"/>
            )}

            {/* Output wire */}
            <line x1={gate === 'NOT' || gate === 'NAND' || gate === 'NOR' ? "262" : "250"} y1={g.single ? "78" : "118"}
                  x2="320" y2={g.single ? "78" : "118"}
                  stroke={output ? 'var(--ok)' : 'var(--ink-faint)'} strokeWidth="2.5"/>

            {/* Output value */}
            <rect x="320" y={g.single ? "58" : "98"} width="50" height="40" rx="6"
                  fill={output ? 'rgba(76,175,80,0.15)' : 'var(--surface)'} stroke={output ? 'var(--ok)' : 'var(--rule)'} strokeWidth="1.5"/>
            <text x="345" y={g.single ? "83" : "123"} textAnchor="middle" fontSize="18" fontFamily="JetBrains Mono" fontWeight="700"
                  fill={output ? 'var(--ok)' : 'var(--ink-mute)'}>{output}</text>
            <text x="345" y={g.single ? "52" : "92"} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">Y</text>

            {/* Expression */}
            <text x="200" y="225" textAnchor="middle" fontSize="12" fontFamily="JetBrains Mono" fill="var(--ink-mute)">
              Y = {g.symbol} = {output}
            </text>
          </svg>
        </div>

        {/* Real-world analogy */}
        <div style={{marginTop:16, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
          <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:8}}>REAL-WORLD ANALOGY</div>
          <p style={{fontSize:14, color:'var(--ink)', lineHeight:1.6, margin:0}}>
            <strong style={{color:'var(--accent)'}}>{gate}:</strong> {g.analogy}
          </p>
          {!g.single ? (
            <p style={{fontSize:13, color:'var(--ink-mute)', lineHeight:1.5, marginTop:8, marginBottom:0}}>
              Right now: A = {inputA}, B = {inputB}.{' '}
              {gate === 'AND' && (inputA && inputB ? 'Both are ON, so current flows. Y = 1.' : 'Not both ON, so no current. Y = 0.')}
              {gate === 'OR' && (inputA || inputB ? 'At least one is ON, so current flows. Y = 1.' : 'Both are OFF, no current. Y = 0.')}
              {gate === 'NAND' && (inputA && inputB ? 'Both ON would make AND = 1, but NAND flips it. Y = 0.' : 'AND would be 0, NAND flips to 1. Y = 1.')}
              {gate === 'NOR' && (inputA || inputB ? 'OR would be 1, NOR flips to 0. Y = 0.' : 'OR is 0, NOR flips to 1. Y = 1.')}
              {gate === 'XOR' && (inputA !== inputB ? 'Inputs are different, so Y = 1.' : 'Inputs are the same, so Y = 0.')}
            </p>
          ) : (
            <p style={{fontSize:13, color:'var(--ink-mute)', lineHeight:1.5, marginTop:8, marginBottom:0}}>
              Right now: A = {inputA}. NOT flips it to {output}.
            </p>
          )}
        </div>

        {/* Truth table */}
        <div style={{marginTop:12, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
          <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:12}}>TRUTH TABLE</div>
          <div style={{display:'grid', gridTemplateColumns: g.single ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap:4, maxWidth:240}}>
            <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', fontWeight:600}}>A</div>
            {!g.single && <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', fontWeight:600}}>B</div>}
            <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', fontWeight:600}}>Y</div>
            {rows.map((r, i) => {
              const isActive = r.a === inputA && (g.single || r.b === inputB)
              return (
                <React.Fragment key={i}>
                  <div className="mono" style={{fontSize:12, color: isActive ? 'var(--accent)' : 'var(--ink-soft)', fontWeight: isActive ? 600 : 400, padding:'2px 0', background: isActive ? 'rgba(58,110,165,0.08)' : 'transparent', borderRadius:2}}>{r.a}</div>
                  {!g.single && <div className="mono" style={{fontSize:12, color: isActive ? 'var(--accent)' : 'var(--ink-soft)', fontWeight: isActive ? 600 : 400, padding:'2px 0', background: isActive ? 'rgba(58,110,165,0.08)' : 'transparent', borderRadius:2}}>{r.b}</div>}
                  <div className="mono" style={{fontSize:12, color: isActive ? (r.out ? 'var(--ok)' : 'var(--ink)') : 'var(--ink-soft)', fontWeight: isActive ? 600 : 400, padding:'2px 0', background: isActive ? 'rgba(58,110,165,0.08)' : 'transparent', borderRadius:2}}>{r.out}</div>
                </React.Fragment>
              )
            })}
          </div>
          <div className="mono" style={{fontSize:9, color:'var(--ink-faint)', marginTop:8}}>
            Highlighted row = current input combination
          </div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">pick a gate</span>
          <div className="vizctrl__quickbtns">
            {Object.keys(GATES).map(key => (
              <button key={key} className={`vizctrl__jumpbtn ${gate === key ? 'is-active' : ''}`}
                      onClick={() => setGate(key)}>
                <span className="serif vizctrl__jumpname">{key}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
