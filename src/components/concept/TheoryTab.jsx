'use client'
import { parseHtml } from '@/lib/html'
import WaterTapAnalogy from '@/components/mosfet/WaterTapAnalogy'

export default function TheoryTab({ m }) {
  return (
    <article className="theory">
      <div className="theory__rubric">
        <span className="rubric">Theory · build genuine understanding</span>
        <span className="mono theory__progress">01 → 04 sections · 8 min read</span>
      </div>

      {/* Section 1 — ELI10 */}
      <section className="theory__section theory__section--eli10">
        <div className="theory__num serif">I.</div>
        <div className="theory__head">
          <span className="pill pill--accent">ELI10 — start here</span>
          <h2 className="theory__h2">A <em>tiny electric tap</em><br/> inside your phone.</h2>
        </div>
        <div className="theory__body theory__body--eli10">
          <p>
            Imagine a water tap. You turn the knob — water flows. Turn it off — water stops.
            A MOSFET is exactly that, but for electricity. The <em>gate voltage</em> is the knob.
            The <em>current</em> is the water. Source is the inlet, drain is the outlet.
          </p>
          <p>
            Below a certain knob position (threshold voltage, V_t), the tap is fully shut — zero flow.
            Turn it past V_t and water begins to trickle. Keep turning and you get full flow.
            But there is a limit: even with the knob wide open, the pipe itself caps the maximum flow.
            That is saturation — current set by the knob position, not the pressure downstream.
          </p>
          <p>
            Your phone has 19 billion of these taps on a chip the size of your fingernail.
            Every time you tap the screen, billions of knobs turn simultaneously.
          </p>
        </div>
        <WaterTapAnalogy/>
        <blockquote className="theory__pull serif">
          <span className="theory__pull-mark">&ldquo;</span>
          Gate voltage is the knob. Current is the water. Threshold is the point where the first drop appears.
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
              <span>Region</span><span>Condition on V_GS</span><span>Condition on V_DS</span><span>Behaviour</span>
            </div>
            {[
              { r: 'Cutoff',     g: 'V_GS < V_t',  d: '—',                 b: 'I_D ≈ 0 — channel does not exist' },
              { r: 'Linear',     g: 'V_GS > V_t',  d: 'V_DS < V_GS − V_t', b: 'Voltage-controlled resistor' },
              { r: 'Saturation', g: 'V_GS > V_t',  d: 'V_DS ≥ V_GS − V_t', b: 'Pinch-off; I_D ≈ const w.r.t. V_DS' },
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
          <span className="pill pill--warn">Real-world — TSMC N3E · Apple A19 Pro</span>
          <h2 className="theory__h2">A <em>chain of facts</em><br/> that ends in your pocket.</h2>
        </div>
        <div className="theory__anchor">
          {m.theory.realWorld.map((row, i) => (
            <div key={i} className="theory__anchor-row">
              <span className="mono theory__anchor-k">{parseHtml(row.k)}</span>
              <span className="serif theory__anchor-v">{parseHtml(row.v)}</span>
            </div>
          ))}
          <div className="theory__anchor-closer serif">
            <em>This is the same MOSFET you are about to simulate in the Viz tab.</em>
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
