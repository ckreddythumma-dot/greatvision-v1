'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { SUBJECTS } from '@/data/mosfet'

export default function SubjectsPage() {
  return (
    <>
      <Navbar />
      <div className="page-shell section-responsive" style={{ padding: '80px 80px' }}>
        <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--accent)' }}>GATE ECE 2027 &middot; V1 BETA</div>
        <h1 className="serif" style={{ fontSize: 48, fontWeight: 400, marginBottom: 8 }}>Subjects</h1>
        <p style={{ fontSize: 15, color: 'var(--ink-mute)', marginBottom: 72, maxWidth: '50ch' }}>
          3 subjects, 15 concepts. Each concept built to gold standard with all 5 tabs.
        </p>

        <div style={{ display: 'grid', gap: 32 }}>
          {SUBJECTS.map((s, si) => (
            <div key={s.id} className="subjects-row" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: 48,
              padding: '48px 0',
              borderTop: si === 0 ? '1px solid var(--rule-strong)' : '1px solid var(--rule)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span className="serif" style={{ fontSize: 28, fontStyle: 'italic', color: ['var(--teal)', 'var(--sienna)', 'var(--accent)'][si], lineHeight: 1 }}>
                    {String(si + 1).padStart(2, '0')}
                  </span>
                  <span className="pill" style={{ borderColor: ['var(--teal)', 'var(--sienna)', 'var(--accent)'][si], color: ['var(--teal)', 'var(--sienna)', 'var(--accent)'][si], background: ['var(--teal-soft)', 'var(--sienna-soft)', 'var(--accent-soft)'][si] }}>
                    {s.weight}
                  </span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>{s.title}</h2>
                <p style={{ fontSize: 14, color: 'var(--ink-mute)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>

              <div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {s.concepts.map((c, ci) => (
                    <Link
                      key={c.id}
                      href={c.hero ? '/concept/mosfet-iv' : '#'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 20px',
                        border: '1px solid var(--rule)',
                        borderRadius: 8,
                        textDecoration: 'none',
                        color: 'var(--ink)',
                        transition: 'border-color 120ms ease-out, background 120ms ease-out',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rule-strong)'; e.currentTarget.style.background = 'var(--surface)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', width: 20 }}>
                          {String(ci + 1).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: 14 }}>{c.title}</span>
                        {c.hero && <span className="pill pill--accent" style={{ fontSize: 9 }}>HERO</span>}
                      </div>
                      <span className="csidebar__stars">{'*'.repeat(c.stars)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
