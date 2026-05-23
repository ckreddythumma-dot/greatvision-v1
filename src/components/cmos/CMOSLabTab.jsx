'use client'
import { useState } from 'react'
import { parseHtml } from '@/lib/html'
import CMOSLabViz from './CMOSLabViz'

export default function CMOSLabTab({ m }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const userNum = parseFloat(val)
  const outcome = !submitted ? null
    : Math.abs(userNum - m.lab.correct) < 0.2 ? 'correct'
    : userNum < 3 ? 'too-low'
    : userNum > 8 ? 'too-high'
    : 'wrong-value'

  return (
    <article className="lab-tab">
      <div className="theory__rubric">
        <span className="rubric">Lab · Apple A19 Pro · logic gate sizing</span>
        <span className="mono theory__progress">5 steps · context → solve → consequence</span>
      </div>

      <section className="lab-step">
        <div className="lab-step__num serif">01.</div>
        <div className="lab-step__head">
          <span className="pill pill--accent">Context</span>
          <h2 className="lab-step__h">You are an <em>Apple digital designer</em>.</h2>
        </div>
        <p className="lab-step__body">{m.lab.brief}</p>
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      <section className="lab-step">
        <div className="lab-step__num serif">02.</div>
        <div className="lab-step__head">
          <span className="pill">Given parameters</span>
          <h2 className="lab-step__h">The <em>spec sheet</em>.</h2>
        </div>
        <div className="speccard">
          <div className="speccard__head mono">
            <span>$ cat /spec/a19-pro/std-cell-inv.yml</span>
            <span style={{color:'var(--ok)'}}>● live</span>
          </div>
          {m.lab.params.map((p, i) => (
            <div key={i} className="speccard__row mono">
              <span className="speccard__k">{p.k}:</span>
              <span className="speccard__dots">..............................................</span>
              <span className="speccard__v">{p.v}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      <section className="lab-step">
        <div className="lab-step__num serif">03.</div>
        <div className="lab-step__head">
          <span className="pill">Your problem</span>
          <h2 className="lab-step__h">Find <em>(W/L)<sub>p</sub></em>.</h2>
        </div>
        <p className="lab-step__body">
          Calculate the PMOS width-to-length ratio (W/L)<sub>p</sub> for symmetric switching.
          This ensures V<sub>M</sub> = V<sub>DD</sub>/2 and equal noise margins.
        </p>

        <div className="lab-solve">
          <div className="lab-solve__input">
            <span className="mono lab-solve__lbl">(W/L)_p =</span>
            <input className="mono lab-solve__num" type="number" step="0.01" placeholder="?"
                   value={val} onChange={e => setVal(e.target.value)} disabled={submitted}/>
            <span className="mono" style={{color:'var(--ink-mute)'}}>(dimensionless)</span>
          </div>
          <div className="lab-solve__cta">
            {!submitted ? (
              <>
                <button className="btn btn--primary btn--lg" onClick={() => { if (val !== '') setSubmitted(true) }}>
                  Submit answer
                </button>
                <button className="pcard__hint mono" onClick={() => setShowHint(h => !h)}>
                  {showHint ? '−' : '+'} hint
                </button>
              </>
            ) : (
              <button className="btn btn--ghost" onClick={() => { setSubmitted(false); setVal(''); setShowSolution(false) }}>
                Try again
              </button>
            )}
          </div>
        </div>
        {showHint && !submitted && (
          <div className="lab-hint">
            <span className="mono" style={{color:'var(--warn)'}}>HINT</span>
            <p>{m.lab.hint}</p>
          </div>
        )}
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      <section className="lab-step">
        <div className="lab-step__num serif">04.</div>
        <div className="lab-step__head">
          <span className="pill pill--warn">Consequence</span>
          <h2 className="lab-step__h">What <em>happens</em> to the chip.</h2>
        </div>

        <div className={`lab-consequence lab-consequence--${outcome || 'idle'}`}>
          <div className="lab-consequence__viz">
            <CMOSLabViz outcome={outcome}/>
          </div>
          <div className="lab-consequence__copy">
            {outcome === 'correct' && (
              <>
                <div className="pill pill--ok" style={{marginBottom:10}}>✓ A19 Pro · symmetric inverter</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Correct.</em> (W/L)_p = 5.00.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The PMOS is 2.5× wider than the NMOS, compensating for lower hole mobility.
                  V_M = V_DD/2 = 0.50 V. Equal rise and fall times. Maximum noise margin.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="ok">✓</span> (W/L)_p = 5 → k_n = k_p</li>
                  <li><span className="ok">✓</span> V_M = 0.50 V → symmetric switching</li>
                  <li><span className="ok">✓</span> Equal noise margins, maximum robustness</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--ok">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--ok)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Every logic gate switches symmetrically. Clock edges are clean. The CPU
                      runs at full 4 GHz. Battery life is optimized — equal rise/fall means
                      minimum dynamic power.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'too-low' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ PMOS too narrow · slow pull-up</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Asymmetric.</em> Slow rise time.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The PMOS is too weak. Pull-up is slower than pull-down. V_M shifts below V_DD/2.
                  Rise time is longer than fall time. Noise margin HIGH is degraded.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> PMOS too narrow → weak pull-up</li>
                  <li><span className="bad">✗</span> V_M &lt; V_DD/2 → asymmetric switching</li>
                  <li><span className="dim">—</span> Reduced noise margin on HIGH side</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      The CPU can't hit its target clock speed. Rise edges are slow, causing
                      setup-time violations. The chip must run at a lower frequency. Performance drops.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'too-high' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ PMOS too wide · wasted area</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Oversized.</em> Area and power waste.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The PMOS is too wide. V_M shifts above V_DD/2. The pull-up is faster than
                  needed, wasting silicon area and increasing parasitic capacitance.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> PMOS too wide → wasted area</li>
                  <li><span className="bad">✗</span> V_M &gt; V_DD/2 → asymmetric</li>
                  <li><span className="warn">!</span> Higher capacitance → more dynamic power</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      The chip is bigger than necessary. More silicon area = higher cost.
                      Extra capacitance drains battery faster. Apple's design team sends it
                      back for resizing.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'wrong-value' && (
              <>
                <div className="pill pill--warn" style={{marginBottom:10}}>✗ Wrong (W/L)_p</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Close</em> but not symmetric.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The sizing is in the right range but V_M won't be exactly V_DD/2.
                  The inverter works but switching is slightly asymmetric.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="warn">!</span> (W/L)_p incorrect → V_M ≠ V_DD/2</li>
                  <li><span className="warn">!</span> Unequal noise margins</li>
                  <li><span className="dim">—</span> Would need adjustment before tapeout</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--warn">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--amber)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      The chip works but doesn't hit optimal performance. Noise margins
                      are slightly unequal. The design team catches it in simulation.
                    </p>
                  </div>
                </div>
              </>
            )}
            {!outcome && (
              <>
                <div className="eyebrow">Awaiting your answer…</div>
                <p style={{color:'var(--ink-mute)', fontSize:14, marginTop:8}}>
                  Enter (W/L)_p above and submit. The inverter will show whether
                  PMOS and NMOS are balanced.
                </p>
              </>
            )}
          </div>
        </div>

        {submitted && (
          <button className="lab-solution-toggle mono" onClick={() => setShowSolution(s => !s)}>
            {showSolution ? '− Hide' : '+ Show'} the full solution walkthrough
          </button>
        )}
      </section>

      {submitted && showSolution && (
        <section className="lab-step">
          <div className="lab-step__num serif">05.</div>
          <div className="lab-step__head">
            <span className="pill pill--accent">Solution</span>
            <h2 className="lab-step__h">The <em>walkthrough</em>.</h2>
          </div>
          <ol className="lab-solution">
            {m.lab.solution.map((s, i) => (
              <li key={i} className="lab-solution__step">
                <span className="mono lab-solution__tag">{s.tag}</span>
                <span className="serif lab-solution__line" style={{fontSize:18}}>{parseHtml(s.line)}</span>
              </li>
            ))}
          </ol>
          <div className="lab-solution__answer">
            <div className="rubric">Answer</div>
            <div className="serif" style={{fontSize:64, lineHeight:1}}>
              (W/L)<sub style={{fontSize:36}}>p</sub> = <em>5.00</em>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
