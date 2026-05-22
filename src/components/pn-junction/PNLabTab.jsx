'use client'
import { useState } from 'react'
import { parseHtml } from '@/lib/html'
import DiodeLabViz from './DiodeLabViz'

export default function PNLabTab({ m }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const userNum = parseFloat(val)
  const outcome = !submitted ? null
    : Math.abs(userNum - m.lab.correct) < 0.02 ? 'correct'
    : userNum < 0.5 ? 'too-low'
    : userNum > 1.0 ? 'too-high'
    : 'wrong-value'

  return (
    <article className="lab-tab">
      <div className="theory__rubric">
        <span className="rubric">Lab · Apple A19 Pro · ESD protection diode</span>
        <span className="mono theory__progress">5 steps · context → solve → consequence</span>
      </div>

      {/* Step 1 — Context */}
      <section className="lab-step">
        <div className="lab-step__num serif">01.</div>
        <div className="lab-step__head">
          <span className="pill pill--accent">Context</span>
          <h2 className="lab-step__h">You are an <em>Apple ESD engineer</em>.</h2>
        </div>
        <p className="lab-step__body">{m.lab.brief}</p>
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      {/* Step 2 — Parameters */}
      <section className="lab-step">
        <div className="lab-step__num serif">02.</div>
        <div className="lab-step__head">
          <span className="pill">Given parameters</span>
          <h2 className="lab-step__h">The <em>spec sheet</em>.</h2>
        </div>
        <div className="speccard">
          <div className="speccard__head mono">
            <span>$ cat /spec/a19-pro/esd-diode.yml</span>
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

      {/* Step 3 — Problem */}
      <section className="lab-step">
        <div className="lab-step__num serif">03.</div>
        <div className="lab-step__head">
          <span className="pill">Your problem</span>
          <h2 className="lab-step__h">Calculate <em>V<sub>bi</sub></em>.</h2>
        </div>
        <p className="lab-step__body">
          Find the built-in potential V<sub>bi</sub> of this ESD protection diode.
          This tells you the minimum voltage at which the diode begins to conduct
          and clamp dangerous voltage spikes away from the internal gates.
        </p>

        <div className="lab-solve">
          <div className="lab-solve__input">
            <span className="mono lab-solve__lbl">V_bi =</span>
            <input className="mono lab-solve__num" type="number" step="0.01" placeholder="?"
                   value={val} onChange={e => setVal(e.target.value)} disabled={submitted}/>
            <span className="mono" style={{color:'var(--ink-mute)'}}>V</span>
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

      {/* Step 4 — Consequence */}
      <section className="lab-step">
        <div className="lab-step__num serif">04.</div>
        <div className="lab-step__head">
          <span className="pill pill--warn">Consequence</span>
          <h2 className="lab-step__h">What <em>happens</em> to the chip.</h2>
        </div>

        <div className={`lab-consequence lab-consequence--${outcome || 'idle'}`}>
          <div className="lab-consequence__viz">
            <DiodeLabViz outcome={outcome}/>
          </div>
          <div className="lab-consequence__copy">
            {outcome === 'correct' && (
              <>
                <div className="pill pill--ok" style={{marginBottom:10}}>✓ A19 Pro · ESD protected</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Correct.</em> V_bi = 0.80 V.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The ESD diode activates at 0.80 V — well before any spike can reach
                  the internal MOSFET gates (oxide breakdown at ~1.2 V).
                </p>
                <ul className="lab-checks mono">
                  <li><span className="ok">✓</span> V_bi = 0.80 V → correct barrier height</li>
                  <li><span className="ok">✓</span> Diode clamps before oxide damage</li>
                  <li><span className="ok">✓</span> Normal operation: diode reverse-biased, no leakage</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--ok">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--ok)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      USB-C port is protected. Static discharges from cable insertion are clamped
                      safely. The chip survives millions of plug-unplug cycles over the phone's lifetime.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'too-low' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ V_bi too low · diode leaks</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Leakage.</em> Wrong doping.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  A V_bi this low means the doping is wrong — the barrier is too small.
                  The diode would conduct during normal operation, wasting power constantly.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> V_bi too low → diode leaks in normal use</li>
                  <li><span className="bad">✗</span> Continuous leakage current drains battery</li>
                  <li><span className="dim">—</span> ESD protection works but at a cost</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Battery drains faster than expected. Every I/O pin leaks current through
                      its ESD diode. Users report 20% less battery life. The chip fails power testing.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'too-high' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ V_bi too high · late activation</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Too late.</em> Spike gets through.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  A V_bi this high means the ESD diode activates too late. The voltage spike
                  reaches the internal gates before the clamp engages — oxide rupture.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> V_bi too high → slow clamp activation</li>
                  <li><span className="bad">✗</span> Spike exceeds gate oxide limit</li>
                  <li><span className="warn">!</span> Internal MOSFET gates destroyed</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      A static discharge from a charging cable punches through to the CPU.
                      Internal gates rupture. The USB-C port stops working. Phone needs repair.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'wrong-value' && (
              <>
                <div className="pill pill--warn" style={{marginBottom:10}}>✗ Wrong V_bi</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Close</em> but miscalibrated.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The diode works but the barrier height is wrong. ESD protection is unreliable —
                  sometimes it clamps in time, sometimes it does not.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="warn">!</span> V_bi incorrect → unreliable clamp timing</li>
                  <li><span className="warn">!</span> Some ESD events may get through</li>
                  <li><span className="dim">—</span> Phone would fail reliability testing</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--warn">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--amber)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Phone works most of the time. But occasionally, a USB-C connection
                      causes a glitch. Apple's reliability team catches it in testing.
                      The chip is sent back for redesign.
                    </p>
                  </div>
                </div>
              </>
            )}
            {!outcome && (
              <>
                <div className="eyebrow">Awaiting your answer…</div>
                <p style={{color:'var(--ink-mute)', fontSize:14, marginTop:8}}>
                  Enter V_bi above and submit. The PN junction will animate — you will see
                  the depletion region, carrier flow, and what happens to the phone.
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

      {/* Step 5 — Solution */}
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
              V<sub style={{fontSize:36}}>bi</sub> = <em>0.80 V</em>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
