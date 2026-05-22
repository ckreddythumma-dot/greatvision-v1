'use client'
import { parseHtml } from '@/lib/html'
import CheckValveAnalogy from './CheckValveAnalogy'

export default function PNTheoryTab({ m }) {
  return (
    <article className="theory">
      <div className="theory__rubric">
        <span className="rubric">Theory · build genuine understanding</span>
        <span className="mono theory__progress">01 → 04 sections · 7 min read</span>
      </div>

      {/* Section 1 — ELI10 */}
      <section className="theory__section theory__section--eli10">
        <div className="theory__num serif">I.</div>
        <div className="theory__head">
          <span className="pill pill--accent">ELI10 — start here</span>
          <h2 className="theory__h2">A <em>one-way valve</em><br/> inside every wire.</h2>
        </div>
        <div className="theory__body theory__body--eli10">
          <p>
            Imagine a one-way valve in a water pipe. Push water from the right side —
            the valve opens and water flows through. Push from the other side —
            the valve seals shut. Nothing gets through.
          </p>
          <p>
            A PN junction is exactly that for electricity. Join p-type silicon (full of positive
            holes) with n-type silicon (full of negative electrons), and a natural barrier forms
            at the boundary — the <em>depletion region</em>. No carriers, no current.
          </p>
          <p>
            Forward bias shrinks the barrier — the valve opens. Current rises exponentially.
            Reverse bias widens it — the valve shuts tighter. Push too hard in reverse,
            and the valve breaks. That is breakdown.
          </p>
        </div>
        <CheckValveAnalogy/>
        <blockquote className="theory__pull serif">
          <span className="theory__pull-mark">&ldquo;</span>
          One junction. One barrier. Current flows one way.
        </blockquote>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

      {/* Section 2 — Technical */}
      <section className="theory__section">
        <div className="theory__num serif">II.</div>
        <div className="theory__head">
          <span className="pill">Technical — physics & equations</span>
          <h2 className="theory__h2">Now the <em>physics</em>.</h2>
        </div>
        <div className="theory__tech">
          {m.theory.technical.map((b, i) => (
            <div key={i} className="theory__tech-block">
              <h3 className="theory__h3">{b.h}</h3>
              <div className="theory__tech-body">
                {b.body.split('\n').map((line, j) => (
                  <span key={j}>
                    {j > 0 && <br/>}
                    {parseHtml(line)}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="theory__regions">
            <div className="theory__regions-head mono">
              <span>Mode</span><span>Bias</span><span>Depletion</span><span>Behaviour</span>
            </div>
            {[
              { r: 'Forward',   g: 'V > 0',     d: 'Shrinks',                b: 'Exponential current · I = I_s·e^(V/nV_T)' },
              { r: 'Reverse',   g: 'V < 0',     d: 'Widens',                 b: 'Tiny leakage · I ≈ −I_s' },
              { r: 'Breakdown', g: 'V < −V_BR',  d: 'Collapses',             b: 'Large reverse current · Zener or Avalanche' },
            ].map((row, i) => (
              <div key={i} className="theory__regions-row">
                <span className="serif" style={{fontSize:20}}>{row.r}</span>
                <span className="mono">{row.g}</span>
                <span className="mono">{row.d}</span>
                <span>{row.b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

      {/* Section 3 — Real World */}
      <section className="theory__section theory__section--anchor">
        <div className="theory__num serif">III.</div>
        <div className="theory__head">
          <span className="pill pill--warn">Real-world — Apple A19 Pro</span>
          <h2 className="theory__h2">Every <em>I/O pin</em><br/> has one.</h2>
        </div>
        <div className="theory__anchor">
          {m.theory.realWorld.map((row, i) => (
            <div key={i} className="theory__anchor-row">
              <span className="mono theory__anchor-k">{parseHtml(row.k)}</span>
              <span className="serif theory__anchor-v">{parseHtml(row.v)}</span>
            </div>
          ))}
          <div className="theory__anchor-closer serif">
            <em>This is the same PN junction you are about to simulate in the Viz tab.</em>
          </div>
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

      {/* Section 4 — Formula sheet */}
      <section className="theory__section">
        <div className="theory__num serif">IV.</div>
        <div className="theory__head">
          <span className="pill">Formula sheet — GATE ready</span>
          <h2 className="theory__h2">The <em>six</em> formulas you need.</h2>
        </div>
        <div className="formula-list">
          {m.theory.formulas.map(f => (
            <div key={f.id} className="formula">
              <div className="formula__top">
                <div className="formula__name">{f.name}</div>
                <div className="formula__freq mono">
                  {'★'.repeat(f.tier)}<span style={{color:'var(--ink-faint)'}}>{'★'.repeat(5-f.tier)}</span>
                </div>
              </div>
              <div className="formula__eq mono">{f.eq}</div>
              <div className="formula__meta">
                <div><span className="mono formula__k">when</span> {parseHtml(f.when)}</div>
                <div><span className="mono formula__k">vars</span> {f.vars}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="theory__disclaimer mono">
          AI-assisted content · reviewed for accuracy · Dr. K. Iyer (IISc) · 12 May 2026
        </div>
      </section>
    </article>
  )
}
