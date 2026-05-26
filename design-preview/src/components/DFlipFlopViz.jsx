'use client'
import { useState } from 'react'

export default function DFlipFlopViz() {
  const [d, setD] = useState(0)
  const [q, setQ] = useState(0)
  const [history, setHistory] = useState([
    { clk: 0, d: 0, q: 0 }, { clk: 1, d: 0, q: 0 },
    { clk: 0, d: 1, q: 0 }, { clk: 1, d: 1, q: 1 },
    { clk: 0, d: 1, q: 1 }, { clk: 1, d: 1, q: 1 },
    { clk: 0, d: 0, q: 1 }, { clk: 1, d: 0, q: 0 },
  ])
  const [flashEdge, setFlashEdge] = useState(false)
  const [edgeCount, setEdgeCount] = useState(4)

  const triggerClock = () => {
    const prevQ = q
    const newQ = d
    setQ(newQ)
    setEdgeCount(c => c + 1)
    setHistory(prev => [...prev.slice(-11),
      { clk: 0, d, q: prevQ },
      { clk: 1, d, q: newQ },
    ])
    setFlashEdge(true)
    setTimeout(() => setFlashEdge(false), 400)
  }

  const W = 400, H = 160
  const stepW = W / history.length

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · capture one bit</span>
        <span className="mono theory__progress">set D · hit the clock · watch Q update</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          Set. Clock. Captured. <em>That is memory.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Like a camera: D is the scene you are looking at. The clock is the shutter button.
          Press the shutter and Q captures whatever D is at that instant. Between clicks, Q stays frozen.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">D Flip-Flop</span>
            <span className="mono vizstage__statesub">positive edge-triggered · {edgeCount} edges so far</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>Q</span>
            <span className="serif vizstage__id" style={{color: q ? 'var(--ok)' : 'var(--ink-mute)'}}>{q}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          {/* FF diagram */}
          <svg viewBox="0 0 400 180" width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            {/* D input */}
            <g onClick={() => setD(v => v ? 0 : 1)} style={{cursor:'pointer'}}>
              <rect x="30" y="50" width="50" height="36" rx="6"
                    fill={d ? 'var(--accent)' : 'var(--surface)'} stroke={d ? 'var(--accent)' : 'var(--rule-strong)'} strokeWidth="1.5"/>
              <text x="55" y="73" textAnchor="middle" fontSize="16" fontFamily="JetBrains Mono" fill={d ? '#fff' : 'var(--ink)'}>{d}</text>
              <text x="55" y="42" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">D (click)</text>
            </g>

            {/* Wire D to FF */}
            <line x1="80" y1="68" x2="140" y2="68" stroke={d ? 'var(--accent)' : 'var(--ink-faint)'} strokeWidth="2"/>
            <text x="110" y="60" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono" fill="var(--ink-faint)">data in</text>

            {/* FF body */}
            <rect x="140" y="30" width="120" height="110" rx="8"
                  fill="var(--surface)" stroke={flashEdge ? 'var(--ok)' : 'var(--rule-strong)'} strokeWidth={flashEdge ? 3 : 2}/>
            <text x="200" y="65" textAnchor="middle" fontSize="14" fontFamily="JetBrains Mono" fontWeight="600" fill="var(--ink)">D FF</text>
            <text x="152" y="72" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">D</text>
            <text x="248" y="72" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)" textAnchor="end">Q</text>

            {/* What happens inside */}
            {flashEdge ? (
              <text x="200" y="88" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ok)">Q = D = {d}</text>
            ) : (
              <text x="200" y="88" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">Q holds {q}</text>
            )}

            {/* Clock triangle */}
            <polygon points="140,110 152,105 140,100" fill="none" stroke="var(--ink-mute)" strokeWidth="1"/>
            <text x="156" y="112" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">CLK</text>

            {/* Clock button */}
            <g onClick={triggerClock} style={{cursor:'pointer'}}>
              <rect x="50" y="120" width="80" height="32" rx="6"
                    fill={flashEdge ? 'var(--ok)' : 'var(--surface)'} stroke={flashEdge ? 'var(--ok)' : 'var(--sienna)'} strokeWidth="1.5"/>
              <text x="90" y="140" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600"
                    fill={flashEdge ? '#fff' : 'var(--sienna)'}>CLK edge</text>
            </g>
            <line x1="130" y1="106" x2="140" y2="106" stroke="var(--sienna)" strokeWidth="1.5"/>

            {/* Wire FF to Q */}
            <line x1="260" y1="68" x2="320" y2="68" stroke={q ? 'var(--ok)' : 'var(--ink-faint)'} strokeWidth="2.5"/>
            <text x="290" y="60" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono" fill="var(--ink-faint)">data out</text>

            {/* Q output */}
            <rect x="320" y="48" width="50" height="40" rx="8"
                  fill={q ? 'rgba(76,175,80,0.15)' : 'var(--surface)'} stroke={q ? 'var(--ok)' : 'var(--rule)'} strokeWidth="2"/>
            <text x="345" y="73" textAnchor="middle" fontSize="20" fontFamily="JetBrains Mono" fontWeight="700"
                  fill={q ? 'var(--ok)' : 'var(--ink-mute)'}>{q}</text>
            <text x="345" y="42" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ink-faint)">Q</text>

            {flashEdge && (
              <text x="200" y="165" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono" fill="var(--ok)" letterSpacing="0.06em">
                RISING EDGE — Q captured D = {d}
              </text>
            )}
          </svg>

          {/* What just happened */}
          <div style={{marginTop:16, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
            <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:12}}>HOW IT WORKS</div>
            <div style={{display:'grid', gap:8}}>
              <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:16}}>1.</span>
                <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                  <strong>Set D</strong> — click the D box to toggle between 0 and 1. This is the data you want to store. Right now D = <strong style={{color:'var(--accent)'}}>{d}</strong>.
                </span>
              </div>
              <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:16}}>2.</span>
                <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                  <strong>Wait</strong> — notice that Q does NOT change when you toggle D. Q is still holding its old value: <strong style={{color: q ? 'var(--ok)' : 'var(--ink-mute)'}}>{q}</strong>. The flip-flop ignores D between clock edges.
                </span>
              </div>
              <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:16}}>3.</span>
                <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                  <strong>Clock it</strong> — press "CLK edge." At that instant, Q captures D. {d === q ? 'Right now D = Q, so nothing would change.' : `D = ${d} but Q = ${q}, so pressing clock will change Q to ${d}.`}
                </span>
              </div>
            </div>
          </div>

          {/* Timing diagram */}
          <div style={{marginTop:16}}>
            <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:8}}>TIMING DIAGRAM</div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{background:'var(--paper)', borderRadius:8, padding:8}}>
              {/* CLK */}
              <text x="0" y="20" fontSize="9" fontFamily="JetBrains Mono" fill="var(--sienna)" fontWeight="600">CLK</text>
              {history.map((h, i) => {
                const x = 30 + i * stepW
                const y1 = h.clk ? 8 : 28
                const y2 = i < history.length-1 ? (history[i+1].clk ? 8 : 28) : y1
                return <g key={`c${i}`}>
                  <line x1={x} y1={y1} x2={x+stepW} y2={y1} stroke="var(--sienna)" strokeWidth="1.5"/>
                  {i < history.length-1 && y1 !== y2 && <line x1={x+stepW} y1={y1} x2={x+stepW} y2={y2} stroke="var(--sienna)" strokeWidth="1.5"/>}
                </g>
              })}

              {/* D */}
              <text x="0" y="68" fontSize="9" fontFamily="JetBrains Mono" fill="var(--accent)" fontWeight="600">D</text>
              {history.map((h, i) => {
                const x = 30 + i * stepW
                const y1 = h.d ? 48 : 75
                const y2 = i < history.length-1 ? (history[i+1].d ? 48 : 75) : y1
                return <g key={`d${i}`}>
                  <line x1={x} y1={y1} x2={x+stepW} y2={y1} stroke="var(--accent)" strokeWidth="1.5"/>
                  {i < history.length-1 && y1 !== y2 && <line x1={x+stepW} y1={y1} x2={x+stepW} y2={y2} stroke="var(--accent)" strokeWidth="1.5"/>}
                </g>
              })}

              {/* Q */}
              <text x="0" y="118" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ok)" fontWeight="600">Q</text>
              {history.map((h, i) => {
                const x = 30 + i * stepW
                const y1 = h.q ? 98 : 125
                const y2 = i < history.length-1 ? (history[i+1].q ? 98 : 125) : y1
                return <g key={`q${i}`}>
                  <line x1={x} y1={y1} x2={x+stepW} y2={y1} stroke="var(--ok)" strokeWidth="2"/>
                  {i < history.length-1 && y1 !== y2 && <line x1={x+stepW} y1={y1} x2={x+stepW} y2={y2} stroke="var(--ok)" strokeWidth="2"/>}
                </g>
              })}

              {/* Rising edge markers */}
              {history.map((h, i) => {
                if (i > 0 && history[i-1].clk === 0 && h.clk === 1) {
                  const x = 30 + i * stepW
                  return <line key={`re${i}`} x1={x} y1={0} x2={x} y2={H} stroke="var(--ok)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4"/>
                }
                return null
              })}
            </svg>
            <div className="mono" style={{fontSize:9, color:'var(--ink-faint)', marginTop:4, textAlign:'center'}}>
              Dashed lines mark rising edges — Q only changes at these moments
            </div>
          </div>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">The rule</div>
            <h3 className="serif vizexplain__head"><em>Q(next) = D</em></h3>
          </div>
          <p className="vizexplain__body">
            On the rising edge of the clock (0 to 1 transition), whatever value is on D gets stored in Q.
            Between clock edges, Q holds steady — even if D changes. That is what makes it memory.
          </p>
          <div className="vizexplain__formula mono">Q captures D at CLK rising edge only</div>
        </div>
      </section>
    </article>
  )
}
