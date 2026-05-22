'use client'
import { useState } from 'react'
import { parseHtml } from '@/lib/html'
import ChipZoom from '@/components/mosfet/ChipZoom'
import LabFailViz from '@/components/mosfet/LabFailViz'

export default function LabTab({ m }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const userNum = parseFloat(val)
  const outcome = !submitted ? null
    : Math.abs(userNum - m.lab.correct) < 0.02 ? 'correct'
    : userNum < 0.3 ? 'cutoff'
    : userNum > 1.2 ? 'breakdown'
    : 'wrong-region'

  return (
    <article className="lab-tab">
      <div className="theory__rubric">
        <span className="rubric">Lab · Apple A19 Pro · single MOSFET</span>
        <span className="mono theory__progress">5 steps · context → solve → consequence</span>
      </div>

      {/* Step 1 — Context */}
      <section className="lab-step">
        <div className="lab-step__num serif">01.</div>
        <div className="lab-step__head">
          <span className="pill pill--accent">Context</span>
          <h2 className="lab-step__h">You are an <em>Apple chip engineer</em>.</h2>
        </div>
        <p className="lab-step__body">{m.lab.brief}</p>
        <ChipZoom/>
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
            <span>$ cat /spec/a19-pro/transistor.yml</span>
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
          <h2 className="lab-step__h">Calculate <em>V<sub>GS</sub></em>.</h2>
        </div>
        <p className="lab-step__body">
          Find V<sub>GS</sub> such that all three hold simultaneously: <strong>(1)</strong> the MOSFET is in
          saturation, <strong>(2)</strong> V<sub>GS</sub> stays under the oxide breakdown V<sub>BD</sub> = 1.20 V,
          and <strong>(3)</strong> the drain current hits the required 4.50 mA.
        </p>

        <div className="lab-solve">
          <div className="lab-solve__input">
            <span className="mono lab-solve__lbl">V_GS =</span>
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
          <h2 className="lab-step__h">What <em>happens</em> in the chip.</h2>
        </div>

        <div className={`lab-consequence lab-consequence--${outcome || 'idle'}`}>
          <div className="lab-consequence__viz">
            <LabFailViz outcome={outcome}/>
          </div>
          <div className="lab-consequence__copy">
            {outcome === 'correct' && (
              <>
                <div className="pill pill--ok" style={{marginBottom:10}}>✓ A19 Pro · stays alive</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Correct.</em> V_GS = 0.90 V.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  Channel forms cleanly. 4.50 mA across the channel. Clock locked at 3.78 GHz.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="ok">✓</span> V_DS ≥ V_GS − V_t → saturated</li>
                  <li><span className="ok">✓</span> V_GS &lt; V_BD → oxide safe</li>
                  <li><span className="ok">✓</span> I_D = 4.50 mA → spec met</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--ok">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--ok)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Clock running at 3.78 GHz. Apps launch instantly. Camera captures 4K at 60fps.
                      Every tap responds in under 8ms. The chip is alive and performing to spec.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'cutoff' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ Cutoff · the chip is dead</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>No channel.</em> No current.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  V_GS &lt; V_t. The inversion layer never formed. The tap is shut. Zero water.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> V_GS &lt; V_t → no channel</li>
                  <li><span className="dim">—</span> I_D ≈ 0 (sub-threshold leakage only)</li>
                  <li><span className="dim">—</span> chip cannot meet 3.78 GHz timing</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Black screen. No boot. The transistor cannot switch — like a tap that never opens.
                      The processor never starts its first clock cycle. Phone is a paperweight.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'breakdown' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ Oxide breakdown · permanent</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Oxide ruptured.</em> Gate destroyed.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  V_GS &gt; 1.20 V exceeded the oxide breakdown. The thin SiO₂ layer punctured —
                  like forcing the tap knob so hard the valve cracks open permanently.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> V_GS &gt; V_BD → dielectric failure</li>
                  <li><span className="bad">✗</span> gate ↔ channel shorted (permanent)</li>
                  <li><span className="warn">!</span> 1 of 19B transistors lost → die is scrap</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Permanent hardware damage. This transistor can never switch again — current leaks
                      through the ruptured oxide continuously. The chip fails quality testing.
                      This $200 die goes to the scrap bin. The phone never ships.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'wrong-region' && (
              <>
                <div className="pill pill--warn" style={{marginBottom:10}}>✗ Wrong I_D</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Survives.</em> But misses spec.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The transistor works — tap opens, water flows — but the flow rate is wrong.
                  I_D ≠ 4.50 mA. The clock can't maintain 3.78 GHz.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="warn">!</span> Transistor ON but I_D ≠ 4.50 mA</li>
                  <li><span className="warn">!</span> Timing margin violated</li>
                  <li><span className="dim">—</span> Phone would run but miss performance target</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--warn">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--amber)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Phone boots, but stutters. Apps take longer to open. Games drop frames.
                      The clock has to slow down because switching current doesn't meet spec.
                      Apple would have to bin this chip as a lower-tier product.
                    </p>
                  </div>
                </div>
              </>
            )}
            {!outcome && (
              <>
                <div className="eyebrow">Awaiting your answer…</div>
                <p style={{color:'var(--ink-mute)', fontSize:14, marginTop:8}}>
                  Enter a V_GS above and submit. The MOSFET will animate — you'll see electrons flow
                  (or not), the channel form (or rupture), and what happens to the phone.
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
              V<sub style={{fontSize:36}}>GS</sub> = <em>0.90 V</em>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
