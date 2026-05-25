'use client'
import { useState } from 'react'
import { parseHtml } from '@/lib/html'
import GenericLabViz from '@/components/GenericLabViz'

export default function GenericLabTab({ lab, concept }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const userNum = parseFloat(val)
  const correct = !submitted ? null
    : Math.abs(userNum - lab.correctAnswer) < lab.tolerance

  return (
    <article className="lab-tab">
      <div className="theory__rubric">
        <span className="rubric">Lab · Apple A19 Pro</span>
        <span className="mono theory__progress">{'5 steps · context → solve → verify'}</span>
      </div>

      {/* Step 1 -- Context */}
      <section className="lab-step">
        <div className="lab-step__num serif">01.</div>
        <div className="lab-step__head">
          <span className="pill pill--accent">Context</span>
          <h2 className="lab-step__h">You are an <em>Apple chip engineer</em>.</h2>
        </div>
        <p className="lab-step__body">{lab.narrative}</p>
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      {/* Step 2 -- Parameters */}
      <section className="lab-step">
        <div className="lab-step__num serif">02.</div>
        <div className="lab-step__head">
          <span className="pill">Given parameters</span>
          <h2 className="lab-step__h">The <em>spec sheet</em>.</h2>
        </div>
        <div className="speccard">
          <div className="speccard__head mono">
            <span>$ cat /spec/a19-pro/device.yml</span>
            <span style={{color:'var(--ok)'}}>* live</span>
          </div>
          {lab.params.map((p, i) => (
            <div key={i} className="speccard__row mono">
              <span className="speccard__k">{p.label}:</span>
              <span className="speccard__dots">..............................................</span>
              <span className="speccard__v">{p.value}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      {/* Step 3 -- Problem */}
      <section className="lab-step">
        <div className="lab-step__num serif">03.</div>
        <div className="lab-step__head">
          <span className="pill">Your problem</span>
          <h2 className="lab-step__h">Calculate <em>{lab.answerLabel}</em>.</h2>
        </div>

        <div className="lab-solve">
          <div className="lab-solve__input">
            <span className="mono lab-solve__lbl">{lab.answerLabel} =</span>
            <input className="mono lab-solve__num" type="number" step="0.01" placeholder="?"
                   value={val} onChange={e => setVal(e.target.value)} disabled={submitted}/>
            {lab.unit && <span className="mono" style={{color:'var(--ink-mute)'}}>{lab.unit}</span>}
          </div>
          <div className="lab-solve__cta">
            {!submitted ? (
              <>
                <button className="btn btn--primary btn--lg" onClick={() => { if (val !== '') setSubmitted(true) }}>
                  Submit answer
                </button>
                <button className="pcard__hint mono" onClick={() => setShowHint(h => !h)}>
                  {showHint ? '-' : '+'} hint
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
            <p>{lab.hint}</p>
          </div>
        )}
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      {/* Step 4 -- Result */}
      <section className="lab-step">
        <div className="lab-step__num serif">04.</div>
        <div className="lab-step__head">
          <span className="pill pill--warn">Result</span>
          <h2 className="lab-step__h">What <em>happens</em>.</h2>
        </div>

        <div className={`lab-consequence lab-consequence--${correct === null ? 'idle' : correct ? 'correct' : 'wrong-region'}`}>
          {concept && (
            <div className="lab-consequence__viz">
              <GenericLabViz outcome={correct === null ? null : correct ? 'correct' : 'wrong'} concept={concept}/>
            </div>
          )}
          <div className="lab-consequence__copy">
            {correct === true && (
              <>
                <div className="pill pill--ok" style={{marginBottom:10}}>Correct</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Correct.</em> {lab.answerLabel} = {lab.correctAnswer.toFixed(2)}{lab.unit ? ` ${lab.unit}` : ''}
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  Your calculation matches the design specification. The circuit operates as intended.
                </p>
                <div className="lab-phone-ctx lab-phone-ctx--ok">
                  <span className="lab-phone-ctx__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="2" width="14" height="20" rx="3"/>
                      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--ok)'}}>CHIP STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Design verified. The circuit meets all specifications for the A19 Pro.
                    </p>
                  </div>
                </div>
              </>
            )}
            {correct === false && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>Incorrect</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Not quite.</em> Check your calculation.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  Your answer of {userNum.toFixed(2)}{lab.unit ? ` ${lab.unit}` : ''} does not match the expected value.
                  Review the solution walkthrough below.
                </p>
                <div className="lab-phone-ctx lab-phone-ctx--bad">
                  <span className="lab-phone-ctx__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="2" width="14" height="20" rx="3"/>
                      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <div>
                    <div className="mono" style={{fontSize:10, letterSpacing:'0.08em', color:'var(--bad)'}}>CHIP STATUS</div>
                    <p style={{margin:'4px 0 0', fontSize:14}}>
                      Design parameter mismatch. The circuit would not meet specification with this value.
                    </p>
                  </div>
                </div>
              </>
            )}
            {correct === null && (
              <>
                <div className="eyebrow">Awaiting your answer...</div>
                <p style={{color:'var(--ink-mute)', fontSize:14, marginTop:8}}>
                  Enter {lab.answerLabel} above and submit. You will see whether the design meets spec.
                </p>
              </>
            )}
          </div>
        </div>

        {submitted && (
          <button className="lab-solution-toggle mono" onClick={() => setShowSolution(s => !s)}>
            {showSolution ? '- Hide' : '+ Show'} the full solution walkthrough
          </button>
        )}
      </section>

      {/* Step 5 -- Solution */}
      {submitted && showSolution && (
        <section className="lab-step">
          <div className="lab-step__num serif">05.</div>
          <div className="lab-step__head">
            <span className="pill pill--accent">Solution</span>
            <h2 className="lab-step__h">The <em>walkthrough</em>.</h2>
          </div>
          <ol className="lab-solution">
            {lab.solution.map((s, i) => (
              <li key={i} className="lab-solution__step">
                <span className="mono lab-solution__tag">{s.tag}</span>
                <span className="serif lab-solution__line" style={{fontSize:18}}>{parseHtml(s.line)}</span>
              </li>
            ))}
          </ol>
          <div className="lab-solution__answer">
            <div className="rubric">Answer</div>
            <div className="serif" style={{fontSize:64, lineHeight:1}}>
              {lab.answerLabel} = <em>{lab.correctAnswer.toFixed(2)}{lab.unit ? ` ${lab.unit}` : ''}</em>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
