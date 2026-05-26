'use client'
import { useState, useEffect, useRef } from 'react'

const COUNTER_TYPES = {
  mod8:  { n: 3, mod: 8, label: '3-bit (mod-8)', sub: 'Counts 0 to 7, then wraps' },
  mod10: { n: 4, mod: 10, label: 'BCD (mod-10)', sub: 'Counts 0 to 9, resets at 10' },
  mod16: { n: 4, mod: 16, label: '4-bit (mod-16)', sub: 'Counts 0 to 15, full range' },
}

export default function CounterViz() {
  const [preset, setPreset] = useState('mod8')
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState([0])
  const [prevCount, setPrevCount] = useState(-1)
  const intervalRef = useRef(null)

  const ctr = COUNTER_TYPES[preset]

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setCount(prev => {
          setPrevCount(prev)
          const next = (prev + 1) % ctr.mod
          setHistory(h => [...h.slice(-15), next])
          return next
        })
      }, 600)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, ctr.mod])

  const reset = () => { setCount(0); setPrevCount(-1); setHistory([0]); setRunning(false) }
  const step = () => {
    setPrevCount(count)
    const next = (count + 1) % ctr.mod
    setCount(next)
    setHistory(h => [...h.slice(-15), next])
  }

  const binary = count.toString(2).padStart(ctr.n, '0')
  const bits = binary.split('')
  const prevBinary = prevCount >= 0 ? prevCount.toString(2).padStart(ctr.n, '0') : null

  const selectPreset = (key) => {
    setPreset(key)
    setCount(0)
    setPrevCount(-1)
    setHistory([0])
    setRunning(false)
  }

  return (
    <article className="viz-tab">
      <div className="theory__rubric">
        <span className="rubric">Viz · count the pulses</span>
        <span className="mono theory__progress">step or run · watch flip-flops toggle</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(36px,4vw,56px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'22ch'}}>
          Click. Count. Wrap. <em>Repeat forever.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Like a car odometer but in binary. Each clock pulse adds 1. When it reaches the maximum,
          it wraps back to zero. Press Step to go one pulse at a time, or Run to watch it count.
        </p>
      </header>

      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="serif vizstage__statename">{ctr.label}</span>
            <span className="mono vizstage__statesub">{ctr.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>Count</span>
            <span className="serif vizstage__id">{count}</span>
          </div>
        </div>

        <div className="vizstage__stage">
          <svg viewBox="0 0 400 200" width="100%" style={{background:'var(--paper)', borderRadius:8}}>
            {/* Flip-flop boxes */}
            {bits.map((bit, i) => {
              const x = 40 + i * 90
              const changed = prevBinary && prevBinary[i] !== bit
              return (
                <g key={i}>
                  <rect x={x} y="40" width="70" height="80" rx="8"
                        fill={changed ? 'rgba(76,175,80,0.15)' : (bit === '1' ? 'rgba(58,110,165,0.15)' : 'var(--surface)')}
                        stroke={changed ? 'var(--ok)' : (bit === '1' ? 'var(--accent)' : 'var(--rule-strong)')} strokeWidth={changed ? 3 : 2}/>
                  <text x={x+35} y="75" textAnchor="middle" fontSize="28" fontFamily="JetBrains Mono" fontWeight="700"
                        fill={changed ? 'var(--ok)' : (bit === '1' ? 'var(--accent)' : 'var(--ink-mute)')}>{bit}</text>
                  <text x={x+35} y="108" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">
                    Q{ctr.n - 1 - i}
                  </text>
                  <text x={x+35} y="32" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono"
                        fill={i === bits.length-1 ? 'var(--sienna)' : (i === 0 ? 'var(--accent)' : 'var(--ink-faint)')}>
                    {i === bits.length-1 ? 'LSB' : i === 0 ? 'MSB' : ''}
                  </text>

                  {/* Toggle frequency label */}
                  <text x={x+35} y="132" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono" fill="var(--ink-faint)">
                    flips every {Math.pow(2, bits.length - 1 - i)} pulse{Math.pow(2, bits.length - 1 - i) > 1 ? 's' : ''}
                  </text>

                  {/* Connection lines */}
                  {i < bits.length - 1 && (
                    <line x1={x+70} y1="80" x2={x+90} y2="80" stroke="var(--rule-strong)" strokeWidth="1.5"/>
                  )}
                </g>
              )
            })}

            {/* Decimal display */}
            <rect x="150" y="148" width="100" height="40" rx="8" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"/>
            <text x="200" y="174" textAnchor="middle" fontSize="20" fontFamily="JetBrains Mono" fontWeight="700" fill="var(--accent)">{count}</text>
            <text x="200" y="144" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="var(--ink-faint)">DECIMAL</text>

            {/* Binary display */}
            <text x="280" y="174" fontSize="11" fontFamily="JetBrains Mono" fill="var(--ink-mute)">= {binary}b</text>

            {/* Wrap indicator */}
            {count === 0 && history.length > 1 && (
              <text x="200" y="198" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="var(--ok)" letterSpacing="0.06em">
                WRAPPED TO ZERO
              </text>
            )}
          </svg>

          {/* How it works */}
          <div style={{marginTop:16, padding:'16px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
            <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:12}}>HOW BINARY COUNTING WORKS</div>
            <div style={{display:'grid', gap:8}}>
              <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:16}}>1.</span>
                <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                  <strong>LSB (rightmost bit)</strong> flips on every single clock pulse. It toggles: 0, 1, 0, 1, 0, 1...
                </span>
              </div>
              <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:16}}>2.</span>
                <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                  <strong>Next bit</strong> flips only when the bit to its right goes from 1 back to 0 (carries over). Just like decimal: 09 becomes 10 because 9 wraps to 0 and carries.
                </span>
              </div>
              <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                <span className="mono" style={{fontSize:11, color:'var(--accent)', fontWeight:700, minWidth:16}}>3.</span>
                <span style={{fontSize:13, color:'var(--ink)', lineHeight:1.5}}>
                  {ctr.n} flip-flops can count up to <strong>2^{ctr.n} = {Math.pow(2, ctr.n)}</strong> states.
                  {ctr.mod < Math.pow(2, ctr.n)
                    ? ` This mod-${ctr.mod} counter resets early at ${ctr.mod} (uses only ${ctr.mod} of ${Math.pow(2, ctr.n)} states).`
                    : ` This counter uses all ${ctr.mod} states (0 to ${ctr.mod - 1}).`}
                </span>
              </div>
            </div>
          </div>

          {/* Count sequence */}
          <div style={{marginTop:12, padding:'12px 20px', border:'1px solid var(--rule)', borderRadius:8, background:'var(--surface)'}}>
            <div className="mono" style={{fontSize:10, color:'var(--ink-faint)', letterSpacing:'0.06em', marginBottom:8}}>COUNT SEQUENCE</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {history.map((h, i) => (
                <span key={i} className="mono" style={{
                  fontSize:13, fontWeight: i === history.length-1 ? 700 : 400,
                  color: i === history.length-1 ? 'var(--accent)' : h === 0 && i > 0 ? 'var(--ok)' : 'var(--ink-mute)',
                  padding:'2px 6px', borderRadius:4,
                  background: i === history.length-1 ? 'rgba(58,110,165,0.1)' : 'transparent',
                }}>{h}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">Counter state</div>
            <h3 className="serif vizexplain__head"><em>{count} of {ctr.mod - 1}</em></h3>
          </div>
          <p className="vizexplain__body">
            {ctr.n} flip-flops can represent 2^{ctr.n} = {Math.pow(2, ctr.n)} different values.
            {ctr.mod < Math.pow(2, ctr.n) ? ` Mod-${ctr.mod}: uses ${ctr.mod} states, resets at ${ctr.mod}.` : ` Uses all ${ctr.mod} states.`}
            {' '}Minimum flip-flops needed = ceil(log2({ctr.mod})) = {ctr.n}.
          </p>
          <div className="vizexplain__formula mono">n = ceil(log2(mod)) = {ctr.n} flip-flops</div>
        </div>
      </section>

      <section className="vizctrl">
        <div className="vizctrl__row" style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center'}}>
          <button className="vizctrl__jumpbtn is-active" onClick={step} style={{padding:'8px 20px'}}>
            <span className="serif vizctrl__jumpname">Step</span>
          </button>
          <button className={`vizctrl__jumpbtn ${running ? 'is-active' : ''}`} onClick={() => setRunning(r => !r)} style={{padding:'8px 20px'}}>
            <span className="serif vizctrl__jumpname">{running ? 'Pause' : 'Run'}</span>
          </button>
          <button className="vizctrl__jumpbtn" onClick={reset} style={{padding:'8px 20px'}}>
            <span className="serif vizctrl__jumpname">Reset</span>
          </button>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">counter type</span>
          <div className="vizctrl__quickbtns">
            {Object.entries(COUNTER_TYPES).map(([key, val]) => (
              <button key={key} className={`vizctrl__jumpbtn ${preset === key ? 'is-active' : ''}`}
                      onClick={() => selectPreset(key)}>
                <span className="serif vizctrl__jumpname">{val.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
