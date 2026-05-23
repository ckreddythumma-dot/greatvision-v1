'use client'
import { parseHtml } from '@/lib/html'

export default function AmpTheoryTab({ m }) {
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
          <h2 className="theory__h2">A <em>volume knob</em><br/> for electrical signals.</h2>
        </div>
        <div className="theory__body theory__body--eli10">
          <p>
            A MOSFET amplifier is a volume knob for electrical signals.
          </p>
          <p>
            Imagine a stereo. You speak into a microphone — a tiny electrical signal.
            The amplifier boosts it, and the speaker blasts it out at full volume. The
            amplifier itself does not create energy — it uses power from the wall outlet
            to make a larger copy of your signal.
          </p>
          <p>
            A MOSFET amplifier does the same thing. A small AC signal on the gate produces
            a much larger AC signal at the drain. The amplification factor is called voltage
            gain A<sub>v</sub>. It depends on two things: how sensitive the MOSFET is to gate
            voltage (transconductance g<sub>m</sub>) and how much load resistance
            (R<sub>D</sub>) converts the amplified current back to voltage.
          </p>
          <p>
            More g<sub>m</sub> or more R<sub>D</sub> = more gain. But push too far and the
            output clips — like turning the volume knob past the speaker's limit.
          </p>
        </div>
        <blockquote className="theory__pull serif">
          <span className="theory__pull-mark">&ldquo;</span>
          Small signal in, big signal out. That is the amplifier.
        </blockquote>
      </section>

      <hr className="rule-strong" style={{margin:'56px 0'}}/>

      <section className="theory__section">
        <div className="theory__num serif">II.</div>
        <div className="theory__head">
          <span className="pill">Technical — physics & equations</span>
          <h2 className="theory__h2">Now the <em>circuit</em>.</h2>
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
          <h2 className="theory__h2">The <em>signal chain</em><br/> inside the chip.</h2>
        </div>
        <div className="theory__anchor">
          {m.theory.realWorld.map((row, i) => (
            <div key={i} className="theory__anchor-row">
              <span className="mono theory__anchor-k">{parseHtml(row.k)}</span>
              <span className="serif theory__anchor-v">{parseHtml(row.v)}</span>
            </div>
          ))}
          <div className="theory__anchor-closer serif">
            <em>The same CS amplifier topology powers the audio codec you will design in the Lab tab.</em>
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
