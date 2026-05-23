'use client'
import { parseHtml } from '@/lib/html'

export default function BJTTheoryTab({ m }) {
  return (
    <article className="theory">
      <div className="theory__rubric">
        <span className="rubric">Theory · build genuine understanding</span>
        <span className="mono theory__progress">01 → 04 sections · 6 min read</span>
      </div>

      <section className="theory__section theory__section--eli10">
        <div className="theory__num serif">I.</div>
        <div className="theory__head">
          <span className="pill pill--accent">ELI10 — start here</span>
          <h2 className="theory__h2">A <em>current amplifier</em><br/> inside every chip.</h2>
        </div>
        <div className="theory__body theory__body--eli10">
          <p>
            A BJT is a current amplifier — a tiny current in, a big current out.
          </p>
          <p>
            Imagine a lever. You press one end with your finger — a small force.
            The other end lifts a heavy weight — a large force. The multiplication
            factor depends on where the fulcrum sits.
          </p>
          <p>
            A BJT works the same way with current. A small base current I<sub>B</sub> controls
            a large collector current I<sub>C</sub>. The factor is β (beta), typically 50–300.
            Push 10 μA into the base, get 1 mA out of the collector.
          </p>
          <p>
            Three things can happen: the transistor is OFF (cutoff), it is amplifying
            (active — I<sub>C</sub> = β × I<sub>B</sub>), or it is fully ON like a
            closed switch (saturation — V<sub>CE</sub> ≈ 0.2V).
          </p>
        </div>
        <blockquote className="theory__pull serif">
          <span className="theory__pull-mark">&ldquo;</span>
          Small current in, big current out. That is amplification.
        </blockquote>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

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
                  <span key={j}>{j > 0 && <br/>}{parseHtml(line)}</span>
                ))}
              </div>
            </div>
          ))}
          <div className="theory__regions">
            <div className="theory__regions-head mono">
              <span>Region</span><span>BE Junction</span><span>BC Junction</span><span>Behaviour</span>
            </div>
            {[
              { r: 'Cutoff',     be: 'Reverse', bc: 'Reverse', b: 'I_C = 0 · transistor OFF' },
              { r: 'Active',     be: 'Forward', bc: 'Reverse', b: 'I_C = β·I_B · amplification' },
              { r: 'Saturation', be: 'Forward', bc: 'Forward', b: 'V_CE ≈ 0.2V · switch ON' },
            ].map((row, i) => (
              <div key={i} className="theory__regions-row">
                <span className="serif" style={{fontSize:20}}>{row.r}</span>
                <span className="mono">{row.be}</span>
                <span className="mono">{row.bc}</span>
                <span>{row.b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

      <section className="theory__section theory__section--anchor">
        <div className="theory__num serif">III.</div>
        <div className="theory__head">
          <span className="pill pill--warn">Real-world — Apple A19 Pro</span>
          <h2 className="theory__h2">The <em>analog backbone</em><br/> of every chip.</h2>
        </div>
        <div className="theory__anchor">
          {m.theory.realWorld.map((row, i) => (
            <div key={i} className="theory__anchor-row">
              <span className="mono theory__anchor-k">{parseHtml(row.k)}</span>
              <span className="serif theory__anchor-v">{parseHtml(row.v)}</span>
            </div>
          ))}
          <div className="theory__anchor-closer serif">
            <em>The same BJT physics powers the bandgap reference you will design in the Lab tab.</em>
          </div>
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

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
