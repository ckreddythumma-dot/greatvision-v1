'use client'
import { useState } from 'react'
import { parseHtml } from '@/lib/html'
import BJTLabViz from './BJTLabViz'

export default function BJTLabTab({ m }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const userNum = parseFloat(val)
  const outcome = !submitted ? null
    : Math.abs(userNum - m.lab.correct) < 0.05 ? 'correct'
    : userNum < 0.5 ? 'too-low'
    : userNum > 2.0 ? 'too-high'
    : 'wrong-value'

  return (
    <article className="lab-tab">
      <div className="theory__rubric">
        <span className="rubric">Lab · Apple A19 Pro · bandgap reference</span>
        <span className="mono theory__progress">5 steps · context → solve → consequence</span>
      </div>

      <section className="lab-step">
        <div className="lab-step__num serif">01.</div>
        <div className="lab-step__head">
          <span className="pill pill--accent">Context</span>
          <h2 className="lab-step__h">You are an <em>Apple analog designer</em>.</h2>
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
            <span>$ cat /spec/a19-pro/bandgap-bjt.yml</span>
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
          <h2 className="lab-step__h">Calculate <em>I<sub>C</sub></em>.</h2>
        </div>
        <p className="lab-step__body">
          Find the collector current I<sub>C</sub> at the Q-point. This tells you
          whether the BJT is in the active region — essential for the bandgap
          reference to produce a stable 1.2V output.
        </p>

        <div className="lab-solve">
          <div className="lab-solve__input">
            <span className="mono lab-solve__lbl">I_C =</span>
            <input className="mono lab-solve__num" type="number" step="0.01" placeholder="?"
                   value={val} onChange={e => setVal(e.target.value)} disabled={submitted}/>
            <span className="mono" style={{color:'var(--ink-mute)'}}>mA</span>
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
            <BJTLabViz outcome={outcome}/>
          </div>
          <div className="lab-consequence__copy">
            {outcome === 'correct' && (
              <>
                <div className="pill pill--ok" style={{marginBottom:10}}>✓ A19 Pro · bandgap active</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Correct.</em> I_C = 1.00 mA.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The BJT operates at I_C = 1.00 mA in the active region. V_CE = 3.0 V
                  provides ample headroom. The bandgap reference generates a stable 1.2V.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="ok">✓</span> I_C = 1.00 mA → active region confirmed</li>
                  <li><span className="ok">✓</span> V_CE = 3.0 V → large headroom</li>
                  <li><span className="ok">✓</span> Bandgap reference stable at 1.2V</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--ok">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--ok)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      The PMIC produces rock-solid voltage rails. Every subsystem — CPU, GPU,
                      modem, display — gets precisely regulated power. Battery life is optimized.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'too-low' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ I_C too low · weak bias</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Weak bias.</em> Reference drifts.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  I_C is too low — the BJT is barely in the active region. The bandgap
                  reference voltage drifts with temperature. Power regulation becomes unreliable.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> I_C too low → barely active</li>
                  <li><span className="bad">✗</span> Reference voltage drifts with temperature</li>
                  <li><span className="dim">—</span> Power rails fluctuate</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Voltage rails drift when the phone heats up under load. The CPU throttles
                      unexpectedly. Apps crash during intensive tasks. Users report instability.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'too-high' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ I_C too high · saturated</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Saturated.</em> No amplification.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  I_C is too high — the voltage drop across R_C pushes V_CE below V_CE(sat).
                  The BJT is in saturation — it can no longer amplify. The reference fails.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> I_C too high → V_CE &lt; 0.2V</li>
                  <li><span className="bad">✗</span> BJT in saturation → no amplification</li>
                  <li><span className="warn">!</span> Bandgap reference output collapses</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      The reference voltage drops below 1.2V. Voltage regulators lose their
                      setpoint. The CPU receives wrong supply voltage and malfunctions.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'wrong-value' && (
              <>
                <div className="pill pill--warn" style={{marginBottom:10}}>✗ Wrong I_C</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Close</em> but miscalculated.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The Q-point calculation has an error. The BJT may still be in the active region
                  but the current is wrong — the reference voltage will be off-target.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="warn">!</span> I_C incorrect → reference voltage off</li>
                  <li><span className="warn">!</span> Power regulation may drift under load</li>
                  <li><span className="dim">—</span> Would fail silicon validation</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--warn">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--amber)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      The phone works but voltage rails are slightly off. Battery life suffers.
                      The design team catches it in silicon validation — back to the drawing board.
                    </p>
                  </div>
                </div>
              </>
            )}
            {!outcome && (
              <>
                <div className="eyebrow">Awaiting your answer…</div>
                <p style={{color:'var(--ink-mute)', fontSize:14, marginTop:8}}>
                  Enter I_C above and submit. The BJT cross-section will animate —
                  you will see carrier flow and what happens to the phone.
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
              I<sub style={{fontSize:36}}>C</sub> = <em>1.00 mA</em>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
