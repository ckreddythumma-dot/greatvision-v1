'use client'

import { useState } from 'react'
import { MOSFET_PYQS } from '@/data/mosfet'

function PYQCard({ pyq }) {
  const [answer, setAnswer] = useState('')
  const [picked, setPicked] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [showWhy, setShowWhy] = useState(false)

  const correct = pyq.type === 'MCQ'
    ? picked === pyq.answerIdx
    : Math.abs(parseFloat(answer) - pyq.answer) < 0.05

  const submit = () => {
    if (pyq.type === 'MCQ' && picked == null) return
    if (pyq.type === 'NAT' && answer === '') return
    setSubmitted(true)
  }

  return (
    <div className="pyq-card">
      <div className="pyq-card__head">
        <span className="pill pill--warn">GATE {pyq.year}</span>
        <span className="pill">{pyq.marks} mark{pyq.marks > 1 ? 's' : ''}</span>
        <span className="pill pill--teal">{pyq.type}</span>
      </div>

      <p className="serif" style={{ fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>{pyq.q}</p>

      {pyq.type === 'MCQ' ? (
        <ol className="opt-list">
          {pyq.options.map((o, oi) => (
            <li key={oi}>
              <button
                className={`opt-btn ${picked === oi ? 'is-picked' : ''} ${submitted && oi === pyq.answerIdx ? 'is-correct' : ''}`}
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
            type="number" step="0.01" value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="viz-input mono" style={{ width: 140 }}
            placeholder="answer" disabled={submitted}
          />
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{pyq.unit}</span>
        </div>
      )}

      {!submitted ? (
        <button className="btn btn--primary" onClick={submit} style={{ fontSize: 13 }}>Submit</button>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 6,
            background: correct ? 'var(--ok-soft)' : 'var(--bad-soft)',
            color: correct ? 'var(--ok)' : 'var(--bad)',
            fontSize: 13, fontWeight: 500,
          }}>
            {correct ? 'Correct' : 'Incorrect'}
          </div>

          {pyq.trap && (
            <p className="mono" style={{ fontSize: 11, color: 'var(--warn)', marginTop: 12, lineHeight: 1.5, maxWidth: '55ch' }}>
              EXAMINER TRAP: {pyq.trap}
            </p>
          )}

          <button
            className="btn btn--ghost mono"
            style={{ fontSize: 11, marginTop: 12 }}
            onClick={() => setShowWhy(w => !w)}
          >
            {showWhy ? 'Hide' : 'Show'} solution
          </button>

          {showWhy && (
            <div style={{
              marginTop: 12, padding: '16px 20px',
              background: 'var(--surface)', borderRadius: 8,
              fontSize: 13, lineHeight: 1.7, color: 'var(--ink-mute)',
            }}>
              {pyq.why}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PYQsTab({ pyqs, insight, conceptTitle }) {
  const data = pyqs || MOSFET_PYQS
  const title = conceptTitle || 'MOSFET I-V'
  const insightData = insight || {
    frequency: '6 of 7',
    body: `${title} appeared in 6 of the last 7 GATE ECE papers. The most common trap: students skip the region check and jump straight to the saturation formula.`,
  }

  const [yearFilter, setYearFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const years = ['All', ...new Set(data.map(p => p.year))]
  const types = ['All', 'MCQ', 'NAT']

  const filtered = data.filter(p => {
    if (yearFilter !== 'All' && p.year !== parseInt(yearFilter)) return false
    if (typeFilter !== 'All' && p.type !== typeFilter) return false
    return true
  })

  return (
    <div className="tab-content" style={{ maxWidth: 720, padding: '48px 0' }}>
      <div className="pyq-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4, color: 'var(--warn)' }}>PYQ BANK &middot; {title.toUpperCase()}</div>
          <p className="mono" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            {data.length} questions &middot; GATE 2020 to 2025
          </p>
        </div>
        <div className="pyq-filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {years.map(y => (
            <button key={y}
              className={`pill ${yearFilter === String(y) ? 'pill--warn' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setYearFilter(String(y))}
            >
              {y}
            </button>
          ))}
          <span style={{ width: 1, background: 'var(--rule)', margin: '0 4px' }} />
          {types.map(t => (
            <button key={t}
              className={`pill ${typeFilter === t ? 'pill--teal' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.map(pyq => (
        <PYQCard key={pyq.id} pyq={pyq} />
      ))}

      {/* -- Insight -- */}
      <div style={{
        marginTop: 48, padding: '24px 28px',
        background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--rule)',
      }}>
        <div className="eyebrow" style={{ marginBottom: 8, color: 'var(--sienna)' }}>PATTERN INSIGHT</div>
        <p className="serif" style={{ fontSize: 17, lineHeight: 1.55 }}>
          {title} appeared in {insightData.frequency} GATE ECE papers. {insightData.body}
        </p>
      </div>
    </div>
  )
}
