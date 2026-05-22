'use client'
import { useState } from 'react'

function PracticeCard({ p, idx, onResult }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')
  const [picked, setPicked] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [flash, setFlash] = useState(null)

  const correct = p.kind === 'mcq'
    ? picked === p.answerIdx
    : Math.abs(parseFloat(val) - p.answer) < 0.02

  const submit = () => {
    if ((p.kind === 'mcq' && picked == null) || (p.kind === 'nat' && val === '')) return
    setSubmitted(true)
    setFlash(correct ? 'ok' : 'bad')
    setTimeout(() => setFlash(null), 700)
    onResult && onResult({ correct, hintUsed: showHint })
  }

  return (
    <article className={`pcard pcard--${flash || (submitted ? (correct ? 'ok' : 'bad') : '')}`}>
      <header className="pcard__head">
        <div className="pcard__num serif">P{idx+1}.</div>
        <span className="pill">{p.kind === 'mcq' ? 'MCQ · concept-check' : 'NAT · numerical'}</span>
        <span className="mono pcard__pts">+5 / −2</span>
      </header>
      <p className="pcard__q serif">{p.q}</p>

      {p.kind === 'mcq' ? (
        <ol className="pyq__opts">
          {p.options.map((o, oi) => (
            <li key={oi}>
              <button className={`pyq__opt ${picked === oi ? 'is-picked' : ''} ${submitted && oi === p.answerIdx ? 'is-correct' : ''}`}
                      onClick={() => !submitted && setPicked(oi)}>
                <span className="pyq__opt-letter mono">{String.fromCharCode(65+oi)}</span>
                <span>{o}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div className="pyq__nat">
          <input className="mono pyq__nat-input" type="number" step="0.01" value={val}
                 onChange={e => setVal(e.target.value)} placeholder="answer" disabled={submitted}/>
          <span className="mono" style={{color:'var(--ink-mute)'}}>{p.unit}</span>
        </div>
      )}

      <div className="pcard__actions">
        {!submitted ? (
          <>
            <button className="btn btn--primary" onClick={submit}>Submit</button>
            <button className="pcard__hint mono" onClick={() => setShowHint(h => !h)}>
              {showHint ? '−' : '+'} hint <span style={{color:'var(--warn)'}}>−2</span>
            </button>
          </>
        ) : (
          <>
            <div className={`pyq__verdict ${correct ? 'is-ok' : 'is-bad'}`}>
              {correct ? '✓ Correct · +5' : '✗ Wrong · −2'}
              {showHint && <span className="mono" style={{marginLeft:8, color:'var(--warn)'}}>hint used · −2</span>}
            </div>
            <button className="pcard__hint mono" onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Show'} why</button>
          </>
        )}
      </div>

      {showHint && !submitted && (
        <div className="pcard__hintbox">
          <span className="mono" style={{color:'var(--warn)', fontSize:11, letterSpacing:'0.06em'}}>HINT · −2 pts on submit</span>
          <p>Think mechanism, not just formula. Which region are you in?</p>
        </div>
      )}

      {open && submitted && (
        <div className="pcard__why">
          <span className="mono" style={{fontSize:11, color:'var(--ink-mute)'}}>WHY</span>
          <p>{p.why}</p>
        </div>
      )}
    </article>
  )
}

export default function PracticeTab({ m }) {
  const [results, setResults] = useState({})
  const total = m.practice.length * 5
  const score = Object.values(results).reduce((a, r) => a + (r.correct ? 5 : -2) + (r.hintUsed ? -2 : 0), 0)
  const attempted = Object.keys(results).length

  return (
    <article className="practice">
      <div className="theory__rubric">
        <span className="rubric">Practice · concept-check problems</span>
        <span className="mono theory__progress">{attempted} / {m.practice.length} attempted</span>
      </div>

      <div className="mastery">
        <div className="mastery__top">
          <div>
            <div className="eyebrow">Mastery score · MOSFET I-V</div>
            <div className="mastery__score">
              <span className="serif" style={{fontSize:64, lineHeight:1}}>{score}</span>
              <span className="mono" style={{fontSize:14, color:'var(--ink-mute)'}}>/ {total} pts</span>
            </div>
          </div>
          <div className="mastery__legend mono">
            <div><b className="dot dot--ok"/>+5 correct</div>
            <div><b className="dot dot--bad"/>−2 wrong</div>
            <div><b className="dot dot--warn"/>−2 hint used</div>
          </div>
        </div>
        <div className="mastery__bar">
          <div style={{width: Math.max(0, Math.min(100, (score/total)*100))+'%'}}/>
        </div>
      </div>

      <div className="practice-list">
        {m.practice.map((p, i) => (
          <PracticeCard key={p.id} p={p} idx={i}
                        onResult={(r) => setResults(prev => ({...prev, [p.id]: r}))}/>
        ))}
      </div>
    </article>
  )
}
