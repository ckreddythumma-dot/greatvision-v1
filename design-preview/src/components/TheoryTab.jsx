'use client'

import { MOSFET_THEORY } from '@/data/mosfet'
import WaterTapAnalogy from '@/components/WaterTapAnalogy'
import { parseHtml } from '@/lib/html'

export default function TheoryTab({ theory, showWaterTap = false, Analogy = null }) {
  const t = theory || MOSFET_THEORY
  const isArrayFormat = Array.isArray(t.technical)

  return (
    <div className="tab-content" style={{ maxWidth: 720, padding: '48px 0' }}>
      {/* -- ELI10 -- */}
      <div className="theory-section">
        <div className="theory-section__label">
          <span className="pill pill--sienna">ELI10 &middot; start here</span>
          <span className="mono" style={{ marginLeft: 12, fontSize: 11, color: 'var(--ink-faint)' }}>
            01 &rarr; 04 sections &middot; 8 min read
          </span>
        </div>

        <h2 className="serif" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontStyle: 'italic', fontWeight: 400, marginBottom: 32, lineHeight: 1.15 }}>
          {t.eli10.headline}
        </h2>

        <div className="theory-body">
          {t.eli10.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="pull-quote">{t.pullQuote}</div>

        {showWaterTap && <WaterTapAnalogy />}
        {Analogy && <Analogy />}
      </div>

      {/* -- Technical -- */}
      <div className="theory-section">
        <div className="theory-section__label">
          <span className="pill pill--accent">Technical &middot; physics &amp; equations</span>
        </div>

        {isArrayFormat ? (
          t.technical.map((section, i) => (
            <div key={i} style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>{section.h}</h3>
              <div className="theory-body" style={{ lineHeight: 1.75 }}>
                {parseHtml(section.body)}
              </div>
            </div>
          ))
        ) : (
          <>
            <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Structure</h3>
            <p className="theory-body" style={{ marginBottom: 40 }}>{t.technical.structure}</p>

            <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Key Parameters</h3>
            <div className="params-grid" style={{ display: 'grid', gap: 8, marginBottom: 40 }}>
              {t.technical.parameters.map(p => (
                <div key={p.sym} style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 16, padding: '10px 16px',
                  background: 'var(--surface)', borderRadius: 6, fontSize: 13,
                }}>
                  <span className="mono" style={{ fontWeight: 600 }}>{p.sym}</span>
                  <span>{p.name}</span>
                  <span style={{ color: 'var(--ink-mute)' }}>{p.desc}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Three Regions of Operation</h3>
            <div className="regions-table-wrap" style={{ border: '1px solid var(--rule)', borderRadius: 10, overflow: 'hidden', marginBottom: 40 }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 2fr', gap: 0,
                padding: '10px 16px', background: 'var(--accent-soft)', fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em', color: 'var(--accent)',
              }}>
                <span>REGION</span><span>CONDITION</span><span>I_D</span><span>BEHAVIOR</span>
              </div>
              {t.technical.regions.map((r, i) => (
                <div key={r.name} style={{
                  display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 2fr', gap: 0,
                  padding: '14px 16px', borderTop: '1px solid var(--rule)', fontSize: 13,
                }}>
                  <span style={{ fontWeight: 500 }}>{r.name}</span>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{r.condition}</span>
                  <span className="mono" style={{ fontSize: 12 }}>{r.current}</span>
                  <span style={{ color: 'var(--ink-mute)' }}>{r.behavior}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* -- Real-world -- */}
      <div className="theory-section">
        <div className="theory-section__label">
          <span className="pill pill--warn">Real-world &middot; TSMC N3E + Apple A19 Pro</span>
        </div>

        <div style={{
          padding: '32px 36px', background: 'var(--surface)', borderRadius: 10,
          border: '1px solid var(--rule)',
        }}>
          {Array.isArray(t.realWorld) && t.realWorld.length > 0 && typeof t.realWorld[0] === 'object' && t.realWorld[0].k ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {t.realWorld.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, fontSize: 14, lineHeight: 1.55 }}>
                  <span className="mono" style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 12 }}>{item.k}</span>
                  <span style={{ color: 'var(--ink-soft)' }}>{item.v}</span>
                </div>
              ))}
            </div>
          ) : (
            t.realWorld.map((line, i) => (
              <p key={i} className="serif" style={{
                fontSize: i === t.realWorld.length - 1 ? 16 : 18,
                fontStyle: i === t.realWorld.length - 1 ? 'italic' : 'normal',
                color: i === t.realWorld.length - 1 ? 'var(--accent)' : 'var(--ink)',
                lineHeight: 1.55,
                marginBottom: i === t.realWorld.length - 1 ? 0 : 8,
              }}>
                {line}
              </p>
            ))
          )}
        </div>
      </div>

      {/* -- Formulas -- */}
      <div className="theory-section">
        <div className="theory-section__label">
          <span className="pill pill--teal">Formula sheet &middot; GATE ready</span>
        </div>

        <div className="formula-grid">
          {t.formulas.map((f, i) => (
            <div key={i} className="formula-card">
              <div>
                {f.name && (
                  <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.04em', marginBottom: 4 }}>
                    {f.name}
                  </div>
                )}
                <div className="formula-card__eq">{f.eq}</div>
                <div className="formula-card__meta" style={{ marginTop: 6 }}>{f.when || f.condition}</div>
              </div>
              <span className="csidebar__stars" style={{ fontSize: 11 }}>{'*'.repeat(f.stars || f.tier || 3)}</span>
            </div>
          ))}
        </div>

        <p className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 24, letterSpacing: '0.04em' }}>
          AI-ASSISTED CONTENT, REVIEWED FOR ACCURACY
        </p>
      </div>
    </div>
  )
}
