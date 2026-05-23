'use client'
import { useState } from 'react'
import { parseHtml } from '@/lib/html'
import AmpLabViz from './AmpLabViz'

export default function AmpLabTab({ m }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const userNum = parseFloat(val)
  const outcome = !submitted ? null
    : Math.abs(userNum - m.lab.correct) < 0.2 ? 'correct'
    : userNum < 3 ? 'too-low'
    : userNum > 15 ? 'too-high'
    : 'wrong-value'

  return (
    <article className="lab-tab">
      <div className="theory__rubric">
        <span className="rubric">Lab · Apple A19 Pro · audio codec amplifier</span>
        <span className="mono theory__progress">5 steps · context → solve → consequence</span>
      </div>

      <section className="lab-step">
        <div className="lab-step__num serif">01.</div>
        <div className="lab-step__head">
          <span className="pill pill--accent">Context</span>
          <h2 className="lab-step__h">You are an <em>Apple audio engineer</em>.</h2>
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
            <span>$ cat /spec/a19-pro/audio-cs-amp.yml</span>
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
          <h2 className="lab-step__h">Calculate <em>|A<sub>v</sub>|</em>.</h2>
        </div>
        <p className="lab-step__body">
          Find the magnitude of the voltage gain |A<sub>v</sub>|. This tells you
          how much the amplifier boosts the microphone signal before the ADC.
        </p>

        <div className="lab-solve">
          <div className="lab-solve__input">
            <span className="mono lab-solve__lbl">|A_v| =</span>
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
          <h2 className="lab-step__h">What <em>happens</em> to the signal.</h2>
        </div>

        <div className={`lab-consequence lab-consequence--${outcome || 'idle'}`}>
          <div className="lab-consequence__viz">
            <AmpLabViz outcome={outcome}/>
          </div>
          <div className="lab-consequence__copy">
            {outcome === 'correct' && (
              <>
                <div className="pill pill--ok" style={{marginBottom:10}}>✓ A19 Pro · audio gain set</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Correct.</em> |A_v| = 8.00.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The 50 μV microphone signal is amplified to 400 μV — well within the
                  ADC's input range. Clean amplification, no clipping.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="ok">✓</span> |A_v| = 8 → correct gain</li>
                  <li><span className="ok">✓</span> Signal within ADC range</li>
                  <li><span className="ok">✓</span> No clipping or distortion</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--ok">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--ok)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Voice calls are crystal clear. The microphone signal is amplified cleanly
                      before digitization. No distortion, no clipping, no noise.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'too-low' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ Gain too low · signal lost</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Too quiet.</em> Signal below noise floor.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The amplified signal is too small for the ADC to distinguish from noise.
                  The microphone effectively doesn't work.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> Gain too low → signal lost in noise</li>
                  <li><span className="bad">✗</span> ADC cannot resolve the signal</li>
                  <li><span className="dim">—</span> Microphone unusable</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Callers can barely hear you. Voice memos sound like static.
                      The signal is too weak after amplification — Siri can't understand you.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'too-high' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ Gain too high · clipping</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Distorted.</em> Output clips at rails.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The gain is so high that the output clips at V_DD and ground. The signal is
                  distorted beyond recognition — a square wave instead of the original audio.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> Gain too high → output clips</li>
                  <li><span className="bad">✗</span> Audio distortion, harsh sound</li>
                  <li><span className="warn">!</span> ADC saturates, data lost</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Audio sounds terrible — harsh, clipped, distorted. Voice calls are
                      unpleasant. Siri misinterprets everything. The codec needs redesign.
                    </p>
                  </div>
                </div>
              </>
            )}
            {outcome === 'wrong-value' && (
              <>
                <div className="pill pill--warn" style={{marginBottom:10}}>✗ Wrong gain</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Close</em> but miscalculated.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The gain is in the right ballpark but not correct. The signal level
                  at the ADC will be off — either slightly too loud or too quiet.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="warn">!</span> Gain incorrect → signal level off</li>
                  <li><span className="warn">!</span> ADC dynamic range not optimized</li>
                  <li><span className="dim">—</span> Would fail audio quality testing</li>
                </ul>
                <div className="lab-phone-ctx lab-phone-ctx--warn">
                  <span className="lab-phone-ctx__icon">📱</span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--amber)'}}>PHONE STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Audio quality is okay but not great. Volume is slightly off.
                      Apple's audio team catches it in testing — back to calculation.
                    </p>
                  </div>
                </div>
              </>
            )}
            {!outcome && (
              <>
                <div className="eyebrow">Awaiting your answer…</div>
                <p style={{color:'var(--ink-mute)', fontSize:14, marginTop:8}}>
                  Enter |A_v| above and submit. The circuit will animate —
                  you will see the signal path and what happens to the phone.
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
              |A<sub style={{fontSize:36}}>v</sub>| = <em>8.00</em>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
