'use client'

import { useState } from 'react'
import { MOSFET_PRACTICE } from '@/data/mosfet'

function PracticeCard({ p, idx, onResult }) {
  const [val, setVal] = useState('')
  const [picked, setPicked] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [flash, setFlash] = useState(null)

  const correct = p.kind === 'mcq'
    ? picked === p.answerIdx
    : Math.abs(parseFloat(val) - p.answer) < 0.05

  const submit = () => {
    if (p.kind === 'mcq' && picked == null) return
    if (p.kind === 'nat' && val === '') return
    setSubmitted(true)
    setFlash(correct ? 'ok' : 'bad')
    setTimeout(() => setFlash(null), 600)
    onResult && onResult({ correct, hintUsed: showHint })
  }

  return (
    <div className={`pcard ${flash ? `pcard--${flash}` : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span className="serif" style={{ fontSize: 20, fontWeight: 400, color: 'var(--sienna)' }}>P{idx + 1}.</span>
        <span className={`pill ${p.kind === 'mcq' ? 'pill--teal' : 'pill--accent'}`}>{p.kind === 'mcq' ? 'MCQ' : 'NAT'}</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginLeft: 'auto' }}>+5 / -2</span>
      </div>

      <p className="serif" style={{ fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>{p.q}</p>

      {p.kind === 'mcq' ? (
        <ol className="opt-list">
          {p.options.map((o, oi) => (
            <li key={oi}>
              <button
                className={`opt-btn ${picked === oi ? 'is-picked' : ''} ${submitted && oi === p.answerIdx ? 'is-correct' : ''}`}
                onClick={() => !submitted && setPicked(oi)}
              >
                <span className="opt-letter mono">{String.fromCharCode(65 + oi)}</span>
                <span>{o}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <input
            type="number" step="0.01" value={val}
            onChange={e => setVal(e.target.value)}
            className="viz-input mono" style={{ width: 140 }}
            placeholder="answer" disabled={submitted}
          />
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{p.unit}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!submitted ? (
          <>
            <button className="btn btn--primary" onClick={submit} style={{ fontSize: 13 }}>Submit</button>
            <button
              className="btn btn--ghost mono"
              style={{ fontSize: 11 }}
              onClick={() => setShowHint(h => !h)}
            >
              {showHint ? 'Hide' : 'Show'} hint
              <span style={{ color: 'var(--warn)', marginLeft: 4 }}>-2</span>
            </button>
          </>
        ) : (
          <>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 6,
              background: correct ? 'var(--ok-soft)' : 'var(--bad-soft)',
              color: correct ? 'var(--ok)' : 'var(--bad)',
              fontSize: 13, fontWeight: 500,
            }}>
              {correct ? '+5' : '-2'}
              {showHint && <span className="mono" style={{ fontSize: 10, color: 'var(--warn)' }}>hint -2</span>}
            </div>
            <button
              className="btn btn--ghost mono"
              style={{ fontSize: 11 }}
              onClick={() => setShowWhy(w => !w)}
            >
              {showWhy ? 'Hide' : 'Show'} why
            </button>
          </>
        )}
      </div>

      {showHint && !submitted && (
        <div style={{
          marginTop: 16, padding: '12px 16px',
          background: 'var(--sienna-soft)', borderRadius: 6, border: '1px solid var(--sienna)',
          fontSize: 13, color: 'var(--sienna)',
        }}>
          Think mechanism, not formula. Which region are you in?
        </div>
      )}

      {showWhy && submitted && (
        <div style={{
          marginTop: 16, padding: '16px 20px',
          background: 'var(--surface)', borderRadius: 8,
          fontSize: 13, lineHeight: 1.7, color: 'var(--ink-mute)',
        }}>
          {p.why}
        </div>
      )}
    </div>
  )
}

export default function PracticeTab({ practice, conceptTitle }) {
  const data = practice || MOSFET_PRACTICE
  const title = conceptTitle || 'MOSFET I-V'

  const [results, setResults] = useState({})
  const total = data.length * 5
  const score = Object.values(results).reduce(
    (a, r) => a + (r.correct ? 5 : -2) + (r.hintUsed ? -2 : 0), 0
  )
  const attempted = Object.keys(results).length

  return (
    <div className="tab-content" style={{ maxWidth: 720, padding: '48px 0' }}>
      {/* -- Mastery header -- */}
      <div style={{ marginBottom: 48 }}>
        <div className="mastery-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 16 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8, color: 'var(--ok)' }}>MASTERY SCORE &middot; {title.toUpperCase()}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="serif" style={{ fontSize: 48, lineHeight: 1 }}>{score}</span>
              <span className="mono" style={{ fontSize: 13, color: 'var(--ink-mute)' }}>/ {total} pts</span>
            </div>
          </div>

          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', textAlign: 'right' }}>
            <div>{attempted} / {data.length} attempted</div>
            <div style={{ marginTop: 4 }}>
              <span style={{ color: 'var(--ok)' }}>+5 correct</span>
              {' '}<span style={{ color: 'var(--bad)' }}>-2 wrong</span>
              {' '}<span style={{ color: 'var(--warn)' }}>-2 hint</span>
            </div>
          </div>
        </div>

        <div className="mastery-bar">
          <div
            className="mastery-bar__fill"
            style={{ width: `${Math.max(0, Math.min(100, (score / total) * 100))}%` }}
          />
        </div>
      </div>

      {/* -- Problems -- */}
      {data.map((p, i) => (
        <PracticeCard
          key={p.id}
          p={p}
          idx={i}
          onResult={r => setResults(prev => ({ ...prev, [p.id]: r }))}
        />
      ))}
    </div>
  )
}
