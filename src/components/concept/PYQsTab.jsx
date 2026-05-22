'use client'
import { useState } from 'react'

function PYQSparkChart({ pyqs }) {
  const years = [2020,2021,2022,2023,2024,2025,2026]
  const counts = years.map(y => ({
    y,
    one: pyqs.filter(p => p.year === y && p.marks === 1).length,
    two: pyqs.filter(p => p.year === y && p.marks === 2).length,
  }))
  const max = 3
  const W = 360, H = 200, pad = 28
  const bw = (W - pad*2) / years.length - 6

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%">
      <g fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)">
        {[0,1,2,3].map(t => (
          <g key={t}>
            <line x1={pad} y1={H-pad - (t/max)*(H-pad*2)} x2={W-pad} y2={H-pad - (t/max)*(H-pad*2)} stroke="var(--rule)" strokeWidth="0.5"/>
            <text x={pad-4} y={H-pad - (t/max)*(H-pad*2)+3} textAnchor="end">{t}</text>
          </g>
        ))}
      </g>
      {counts.map((c, i) => {
        const x = pad + i*((W-pad*2)/years.length) + 3
        const h1 = (c.one/max)*(H-pad*2)
        const h2 = (c.two/max)*(H-pad*2)
        return (
          <g key={i}>
            <rect x={x} y={H-pad - h1} width={bw} height={h1} fill="var(--ink-mute)" opacity="0.6"/>
            <rect x={x} y={H-pad - h1 - h2} width={bw} height={h2} fill="var(--accent)"/>
            <text x={x + bw/2} y={H-8} fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)" textAnchor="middle">{c.y}</text>
            {(c.one + c.two) > 0 && <text x={x+bw/2} y={H-pad - h1 - h2 - 4} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink)">{c.one + c.two}</text>}
          </g>
        )
      })}
      <g fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)">
        <rect x={W-pad-110} y={6} width="10" height="6" fill="var(--accent)"/>
        <text x={W-pad-96} y={12}>2 mark</text>
        <rect x={W-pad-50} y={6} width="10" height="6" fill="var(--ink-mute)" opacity="0.6"/>
        <text x={W-pad-36} y={12}>1 mark</text>
      </g>
    </svg>
  )
}

function PYQCard({ q, idx }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')
  const [picked, setPicked] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const correct = q.type === 'MCQ'
    ? picked === q.answerIdx
    : Math.abs(parseFloat(val) - q.answer) < 0.02

  return (
    <article className={`pyq ${submitted ? (correct ? 'is-correct' : 'is-wrong') : ''}`}>
      <header className="pyq__head">
        <div className="pyq__num mono">Q.{String(idx+1).padStart(2,'0')}</div>
        <div className="pyq__meta">
          <span className="pill">GATE {q.year}</span>
          <span className="pill">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
          <span className="pill">{q.type}</span>
          <span className="mono pyq__stars">{'★'.repeat(q.stars)}<span style={{color:'var(--ink-faint)'}}>{'★'.repeat(5-q.stars)}</span></span>
        </div>
      </header>
      <p className="pyq__q serif">{q.q}</p>

      {q.type === 'MCQ' ? (
        <ol className="pyq__opts">
          {q.options.map((o, oi) => (
            <li key={oi}>
              <button className={`pyq__opt ${picked === oi ? 'is-picked' : ''} ${submitted && oi === q.answerIdx ? 'is-correct' : ''}`}
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
          <span className="mono" style={{color:'var(--ink-mute)'}}>{q.unit}</span>
        </div>
      )}

      <div className="pyq__actions">
        {!submitted ? (
          <button className="btn btn--primary" onClick={() => setSubmitted(true)}>Submit</button>
        ) : (
          <div className={`pyq__verdict ${correct ? 'is-ok' : 'is-bad'}`}>
            {correct ? '✓ Correct' : `✗ Answer · ${q.type === 'MCQ' ? String.fromCharCode(65+q.answerIdx) : q.answer + ' ' + q.unit}`}
          </div>
        )}
        <button className="pyq__more mono" onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Show'} solution & trap</button>
      </div>

      {open && (
        <div className="pyq__solution">
          <div className="pyq__trap">
            <span className="mono">⚠ Examiner trap</span>
            <p>{q.trap}</p>
          </div>
          <div className="pyq__steps">
            {q.sol.map((s, si) => (
              <div key={si} className="pyq__step">
                <span className="pyq__step-tag mono">{s.tag}</span>
                <span>{s.line}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

export default function PYQsTab({ m }) {
  const [year, setYear] = useState('all')
  const [type, setType] = useState('all')

  const filtered = m.pyqs.filter(p =>
    (year === 'all' || p.year === +year) &&
    (type === 'all' || p.type === type)
  )

  return (
    <article className="pyqs">
      <div className="theory__rubric">
        <span className="rubric">PYQs · 2020 → 2026 · MOSFET I–V</span>
        <span className="mono theory__progress">{m.pyqs.length} questions · 4 of 6 attempted</span>
      </div>

      <div className="pyq-filters">
        <div className="pyq-filter">
          <span className="eyebrow">Year</span>
          {['all',2020,2021,2022,2023,2024,2025,2026].map(y => (
            <button key={y} className={`pyq-chip ${year == y ? 'is-on' : ''}`} onClick={() => setYear(y)}>{y === 'all' ? 'All' : y}</button>
          ))}
        </div>
        <div className="pyq-filter">
          <span className="eyebrow">Type</span>
          {['all','MCQ','NAT'].map(t => (
            <button key={t} className={`pyq-chip ${type === t ? 'is-on' : ''}`} onClick={() => setType(t)}>{t === 'all' ? 'All' : t}</button>
          ))}
        </div>
        <div className="pyq-filter pyq-filter--summary mono">
          showing {filtered.length} of {m.pyqs.length}
        </div>
      </div>

      <div className="pyq-list">
        {filtered.map((q, i) => <PYQCard key={q.id} q={q} idx={i}/>)}
      </div>

      <hr className="rule-strong" style={{margin:'48px 0 28px'}}/>

      <div className="pyq-insight">
        <div>
          <div className="rubric">Pattern · MOSFET I-V</div>
          <h3 className="serif" style={{fontSize:32, margin:'8px 0 12px', lineHeight:1.1}}>
            <em>6 of 7</em> recent GATE ECE papers tested this concept.
          </h3>
          <p style={{color:'var(--ink-soft)', maxWidth:'48ch', fontSize:14}}>
            MOSFET I–V is among the highest-frequency concepts in Electronic Devices.
            Saturation-region numerical questions appear almost every year.
          </p>
        </div>
        <div className="pyq-spark">
          <PYQSparkChart pyqs={m.pyqs}/>
        </div>
      </div>
    </article>
  )
}
