'use client'
import { parseHtml } from '@/lib/html'

export default function CMOSTheoryTab({ m }) {
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
          <h2 className="theory__h2">A <em>perfect switch</em><br/> that uses zero power.</h2>
        </div>
        <div className="theory__body theory__body--eli10">
          <p>
            A CMOS inverter is a light switch that uses zero power when it is ON or OFF.
          </p>
          <p>
            Imagine two workers on a seesaw. Worker N sits on the ground side.
            Worker P sits on the power-supply side. When the input says HIGH,
            Worker N pulls the output to ground while Worker P lifts off. When the input
            says LOW, Worker P pulls the output to power while Worker N lifts off.
          </p>
          <p>
            At any stable moment, exactly one worker is active and the other is resting.
            No current flows through the seesaw. Power is only spent during the brief
            instant when both workers are in motion — the switching transition.
          </p>
          <p>
            This is why CMOS is king. 19 billion inverters on the A19 Pro, and they
            consume almost zero power when not switching. Without this property, your
            phone battery would last minutes, not hours.
          </p>
        </div>
        <blockquote className="theory__pull serif">
          <span className="theory__pull-mark">&ldquo;</span>
          Two transistors, zero static power. That is the CMOS trick.
        </blockquote>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

      <section className="theory__section">
        <div className="theory__num serif">II.</div>
        <div className="theory__head">
          <span className="pill">Technical — physics & equations</span>
          <h2 className="theory__h2">Now the <em>VTC</em>.</h2>
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
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

      <section className="theory__section theory__section--anchor">
        <div className="theory__num serif">III.</div>
        <div className="theory__head">
          <span className="pill pill--warn">Real-world — Apple A19 Pro</span>
          <h2 className="theory__h2">The <em>building block</em><br/> of 19 billion gates.</h2>
        </div>
        <div className="theory__anchor">
          {m.theory.realWorld.map((row, i) => (
            <div key={i} className="theory__anchor-row">
              <span className="mono theory__anchor-k">{parseHtml(row.k)}</span>
              <span className="serif theory__anchor-v">{parseHtml(row.v)}</span>
            </div>
          ))}
          <div className="theory__anchor-closer serif">
            <em>The same sizing ratio you will calculate in the Lab tab determines the speed of every gate on the chip.</em>
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
