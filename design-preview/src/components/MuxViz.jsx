'use client'
import { useState } from 'react'

export default function MuxViz() {
  const [selectBits, setSelectBits] = useState([0, 0])
  const [inputs, setInputs] = useState([1, 0, 1, 0])

  const selectVal = selectBits[0] * 2 + selectBits[1]
  const output = inputs[selectVal]

  const toggleInput = (i) => setInputs(prev => { const n = [...prev]; n[i] = n[i] ? 0 : 1; return n })
  const toggleSelect = (i) => setSelectBits(prev => { const n = [...prev]; n[i] = n[i] ? 0 : 1; return n })

  const eqTerms = ['S1\'S0\'','S1\'S0','S1.S0\'','S1.S0']

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · route the data</span>
        <span className="mono theory__progress">flip select lines and inputs · watch the path change</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          Four cameras. One screen. <em>Pick one.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          A 4:1 MUX has 4 inputs but only 1 output. The 2 select lines form a binary number
          that picks which input reaches the output. Click to change inputs and select bits.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">4:1 MUX</span>
            <span className="mono vizstage__statesub">S1S0 = {selectBits[0]}{selectBits[1]} = input {selectVal} selected</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>Y</span>
            <span className="serif vizstage__id" style={{color: output ? 'var(--ok)' : 'var(--ink-mute)'}}>{output}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox="0 0 440 340" width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            {/* Inputs */}
            {inputs.map((val, i) => {
              const y = 40 + i * 60
              const isSelected = i === selectVal
              return (
                <g key={i} onClick={() => toggleInput(i)} style={{cursor:'pointer'}}>
                  <rect x="20" y={y-16} width="50" height="32" rx="6"
                        fill={val ? (isSelected ? 'var(--accent)' : 'rgba(58,110,165,0.3)') : 'var(--surface)'}
                        stroke={isSelected ? 'var(--accent)' : 'var(--rule)'} strokeWidth={isSelected ? 2 : 1}/>
                  <text x="45" y={y+5} textAnchor="middle" fontSize="14" fontFamily="JetBrains Mono"
                        fill={val && isSelected ? '#fff' : 'var(--ink)'}>{val}</text>
                  <text x="10" y={y+5} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">I{i}</text>

                  {/* Wire from input to MUX */}
                  <line x1="70" y1={y} x2="160" y2={y}
                        stroke={isSelected ? (val ? 'var(--accent)' : 'var(--ink-mute)') : 'var(--rule)'}
                        strokeWidth={isSelected ? 2.5 : 1} opacity={isSelected ? 1 : 0.4}
                        strokeDasharray={isSelected ? 'none' : '4,4'}/>

                  {/* Active indicator */}
                  {isSelected && (
                    <circle cx="115" cy={y} r="3" fill={val ? 'var(--accent)' : 'var(--ink-mute)'}/>
                  )}
                </g>
              )
            })}

            {/* MUX body */}
            <path d="M160,10 L250,40 L250,260 L160,290 Z" fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="2"/>
            <text x="205" y="150" textAnchor="middle" fontSize="16" fontFamily="JetBrains Mono" fontWeight="600" fill="var(--ink)">MUX</text>
            <text x="205" y="167" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">4:1</text>

            {/* Internal routing indicator */}
            {(() => {
              const srcY = 40 + selectVal * 60
              return (
                <line x1="160" y1={srcY} x2="250" y2="150"
                      stroke={output ? 'var(--accent)' : 'var(--ink-mute)'}
                      strokeWidth="2" strokeDasharray="6,3" opacity="0.5"/>
              )
            })()}

            {/* Output wire */}
            <line x1="250" y1="150" x2="350" y2="150" stroke={output ? 'var(--ok)' : 'var(--ink-mute)'} strokeWidth="3"/>

            {/* Output */}
            <rect x="350" y="130" width="60" height="40" rx="8"
                  fill={output ? 'rgba(76,175,80,0.15)' : 'var(--surface)'} stroke={output ? 'var(--ok)' : 'var(--rule)'} strokeWidth="2"/>
            <text x="380" y="155" textAnchor="middle" fontSize="20" fontFamily="JetBrains Mono" fontWeight="700"
                  fill={output ? 'var(--ok)' : 'var(--ink-mute)'}>{output}</text>
            <text x="380" y="120" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">Y (output)</text>

            {/* Select lines */}
            {selectBits.map((val, i) => {
              const x = 185 + i * 40
              return (
                <g key={`s${i}`} onClick={() => toggleSelect(i)} style={{cursor:'pointer'}}>
                  <line x1={x} y1="260" x2={x} y2="300" stroke="var(--sienna)" strokeWidth="1.5"/>
                  <rect x={x-18} y="300" width="36" height="28" rx="5"
                        fill={val ? 'var(--sienna)' : 'var(--surface)'} stroke="var(--sienna)" strokeWidth="1.5"/>
                  <text x={x} y="319" textAnchor="middle" fontSize="13" fontFamily="JetBrains Mono"
                        fill={val ? '#fff' : 'var(--sienna)'}>{val}</text>
                  <text x={x} y="340" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">S{i}</text>
                </g>
              )
            })}
            <text x="205" y="292" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">SELECT</text>
          </svg>
        </div>

        {/* Step-by-step how it works */}
        <div style={{marginTop:16, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
          <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:12}}>HOW IT WORKS &mdash; STEP BY STEP</div>
          <div style={{display:'grid', gap:10}}>
            <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--sienna)', fontWeight:700, minWidth:16}}>1.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                Read the select lines: S1 = <strong>{selectBits[0]}</strong>, S0 = <strong>{selectBits[1]}</strong>.
                In binary, S1S0 = <strong>{selectBits[0]}{selectBits[1]}</strong>.
              </span>
            </div>
            <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--sienna)', fontWeight:700, minWidth:16}}>2.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                Convert to decimal: {selectBits[0]}{selectBits[1]} in binary = <strong>{selectVal}</strong> in decimal.
                So we select input <strong>I{selectVal}</strong>.
              </span>
            </div>
            <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--sienna)', fontWeight:700, minWidth:16}}>3.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                Look at I{selectVal}: its value is <strong>{inputs[selectVal]}</strong>.
                The MUX connects this input to the output wire.
              </span>
            </div>
            <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
              <span className="mono" style={{fontSize:11, color:'var(--sienna)', fontWeight:700, minWidth:16}}>4.</span>
              <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                Output Y = I{selectVal} = <strong style={{color: output ? 'var(--ok)' : 'var(--ink-mute)'}}>{output}</strong>.
                The other 3 inputs ({[0,1,2,3].filter(i => i !== selectVal).map(i => `I${i}`).join(', ')}) are blocked.
              </span>
            </div>
          </div>
        </div>

        {/* Boolean equation breakdown */}
        <div style={{marginTop:12, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
          <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:8}}>BOOLEAN EQUATION</div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
            <span className="mono" style={{fontSize:12, color:'var(--ink-mute)'}}>Y =</span>
            {eqTerms.map((term, i) => (
              <span key={i} className="mono" style={{
                fontSize:12, padding:'3px 8px', borderRadius:4,
                background: i === selectVal ? 'rgba(58,110,165,0.15)' : 'transparent',
                color: i === selectVal ? 'var(--accent)' : 'var(--ink-faint)',
                fontWeight: i === selectVal ? 700 : 400,
                border: i === selectVal ? '1px solid var(--accent)' : '1px solid transparent',
              }}>
                {term}.I{i}{i < 3 ? ' +' : ''}
              </span>
            ))}
          </div>
          <p className="mono" style={{fontSize:11, color:'var(--ink-mute)', marginTop:8}}>
            Only the <strong style={{color:'var(--accent)'}}>{eqTerms[selectVal]}</strong> term is active (= 1).
            All other terms are 0 because their select combination does not match.
          </p>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">Current selection</div>
            <h3 className="serif vizexplain__head"><em>Y = I{selectVal} = {output}</em></h3>
          </div>
          <p className="vizexplain__body">
            S1S0 = {selectBits[0]}{selectBits[1]} (binary) = {selectVal} (decimal).
            The MUX connects input I{selectVal} to the output.
            {output ? ' Selected input is HIGH (1), so output is HIGH.' : ' Selected input is LOW (0), so output is LOW.'}
          </p>
          <div className="vizexplain__formula mono">Y = S1'S0'I0 + S1'S0.I1 + S1.S0'I2 + S1.S0.I3</div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">click inputs and select bits above to interact</span>
        </div>
      </section>
    </article>
  )
}
