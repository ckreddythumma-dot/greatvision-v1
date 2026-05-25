'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const RATING_LABELS = ['Not useful', 'Somewhat useful', 'Useful', 'Very useful', 'Must have']

const QUESTIONS = [
  { id: 'overall', label: 'How useful is this concept learning approach for GATE prep?', type: 'rating' },
  { id: 'viz', label: 'How helpful are the interactive visualizations (Viz tab)?', type: 'rating' },
  { id: 'lab', label: 'How engaging is the Lab problem format (Apple A19 Pro context)?', type: 'rating' },
  { id: 'theory', label: 'Is the Theory tab (ELI10 + physics + formulas) the right depth?', type: 'select', options: ['Too shallow', 'Just right', 'Too deep', 'Needs more examples'] },
  { id: 'wouldPay', label: 'Would you pay for a full version (all GATE ECE subjects)?', type: 'select', options: ['Yes, definitely', 'Maybe, depends on price', 'No, free alternatives exist', 'Need to see more first'] },
  { id: 'missing', label: 'What is missing or could be better?', type: 'text' },
  { id: 'bestPart', label: 'What did you like the most?', type: 'text' },
]

export default function FeedbackPage() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [preparing, setPreparing] = useState('')

  const setAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }))
  const filledCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="page-shell" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ maxWidth: 560, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24, color: 'var(--ok)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h1 className="serif" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, marginBottom: 16 }}>
              Thank you{name ? `, ${name.split(' ')[0]}` : ''}.
            </h1>
            <p style={{ fontSize: 16, color: 'var(--ink-mute)', lineHeight: 1.7, marginBottom: 32 }}>
              Your feedback shapes what this becomes. Every answer helps us decide whether to build the full version with all GATE ECE subjects.
            </p>
            <Link href="/" className="btn btn--primary" style={{ fontSize: 15, padding: '14px 28px' }}>
              Back to concepts
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="page-shell" style={{ minHeight: '100dvh', padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 12, letterSpacing: '0.04em' }}>
              <Link href="/" style={{ color: 'var(--ink-mute)', textDecoration: 'none' }}>Home</Link>
              {' > '}
              <span>Feedback</span>
            </div>
            <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--accent)' }}>
              HELP US BUILD THE RIGHT THING
            </div>
            <h1 className="serif" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
              Is this how GATE prep <em>should</em> feel?
            </h1>
            <p style={{ fontSize: 16, color: 'var(--ink-mute)', lineHeight: 1.7, maxWidth: '55ch' }}>
              You have explored our Electronic Devices concepts — interactive visualizations, real-world Apple A19 Pro context, GATE PYQs, and practice problems. We need your honest assessment to decide what comes next.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* About you */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 40px' }}>
              <legend className="eyebrow" style={{ color: 'var(--teal)', marginBottom: 20 }}>ABOUT YOU</legend>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>
                    NAME (optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="mono"
                    style={{
                      width: '100%', padding: '12px 16px', fontSize: 14,
                      background: 'var(--surface)', border: '1px solid var(--rule)',
                      borderRadius: 8, color: 'var(--ink)', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>
                    EMAIL (optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mono"
                    style={{
                      width: '100%', padding: '12px 16px', fontSize: 14,
                      background: 'var(--surface)', border: '1px solid var(--rule)',
                      borderRadius: 8, color: 'var(--ink)', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>
                    PREPARING FOR
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['GATE ECE 2027', 'GATE ECE 2028', 'ESE', 'Self-study', 'Teaching'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        className={`pill ${preparing === opt ? 'pill--teal' : ''}`}
                        onClick={() => setPreparing(opt)}
                        style={{ cursor: 'pointer', transition: 'all 160ms ease-out' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>

            <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '0 0 40px' }} />

            {/* Questions */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 24 }}>YOUR FEEDBACK</legend>

              <div style={{ display: 'grid', gap: 36 }}>
                {QUESTIONS.map((q, qi) => (
                  <div key={q.id}>
                    <label style={{ display: 'block', fontSize: 15, fontWeight: 500, marginBottom: 12, lineHeight: 1.5 }}>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginRight: 8 }}>
                        {String(qi + 1).padStart(2, '0')}
                      </span>
                      {q.label}
                    </label>

                    {q.type === 'rating' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setAnswer(q.id, n)}
                            style={{
                              flex: 1,
                              padding: '10px 4px',
                              fontSize: 12,
                              border: `1.5px solid ${answers[q.id] === n ? 'var(--accent)' : 'var(--rule)'}`,
                              borderRadius: 8,
                              background: answers[q.id] === n ? 'var(--accent-soft)' : 'var(--surface)',
                              color: answers[q.id] === n ? 'var(--accent)' : 'var(--ink-mute)',
                              cursor: 'pointer',
                              transition: 'all 160ms ease-out',
                              fontFamily: 'inherit',
                              lineHeight: 1.3,
                            }}
                          >
                            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>{n}</div>
                            <div className="mono" style={{ fontSize: 8, letterSpacing: '0.02em' }}>{RATING_LABELS[n - 1]}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === 'select' && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {q.options.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswer(q.id, opt)}
                            className={`pill ${answers[q.id] === opt ? 'pill--accent' : ''}`}
                            style={{
                              cursor: 'pointer',
                              padding: '8px 16px',
                              fontSize: 13,
                              transition: 'all 160ms ease-out',
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === 'text' && (
                      <textarea
                        value={answers[q.id] || ''}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        placeholder="Type your thoughts..."
                        rows={3}
                        style={{
                          width: '100%', padding: '12px 16px', fontSize: 14,
                          background: 'var(--surface)', border: '1px solid var(--rule)',
                          borderRadius: 8, color: 'var(--ink)', outline: 'none',
                          fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '40px 0' }} />

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <p className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                {filledCount}/{QUESTIONS.length} questions answered
              </p>
              <button
                type="submit"
                className="btn btn--primary"
                style={{ fontSize: 15, padding: '14px 32px' }}
                disabled={filledCount < 3}
              >
                Submit feedback
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            {filledCount < 3 && (
              <p className="mono" style={{ fontSize: 11, color: 'var(--warn)', marginTop: 12, textAlign: 'right' }}>
                Please answer at least 3 questions to submit.
              </p>
            )}
          </form>

          {/* Privacy note */}
          <div style={{ marginTop: 48, padding: '20px 24px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--rule)' }}>
            <p className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
              YOUR FEEDBACK IS ANONYMOUS UNLESS YOU SHARE YOUR NAME/EMAIL. WE USE IT ONLY TO IMPROVE THIS PRODUCT. NO DATA IS SOLD OR SHARED WITH THIRD PARTIES.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
