// =================================================================
// Landing page — hero with embedded live MOSFET Viz
// =================================================================
window.LandingPage = function LandingPage({ navigate }) {
  const data = window.GVP_DATA;

  return (
    <div className="page page--landing page-fade">
      {/* HERO */}
      <section className="hero">
        <div className="hero__topbar">
          <div className="eyebrow">GateVisionPrep · V1 Beta · GATE ECE 2027</div>
          <div className="hero__topbar-right mono" style={{fontSize:11, color:'var(--ink-mute)'}}>
            <span>05 · 2026</span>
            <span style={{margin:'0 8px'}}>·</span>
            <span>{data.user.cohort}</span>
          </div>
        </div>
        <hr className="rule"/>
        <div className="hero__grid">
          <div className="hero__copy">
            <div className="rubric">01 · Mission</div>
            <h1 className="hero__h1">
              Understand <em>GATE</em>.<br/>
              Don't just <span className="hero__strike">memorise</span> it.
            </h1>
            <p className="hero__lead">
              Five layers per concept: a 10-year-old explanation, the physics, a live
              animation you push around, an Apple-A19-Pro engineering problem you might fail,
              and the GATE questions that have asked the same thing for seven years running.
            </p>
            <div className="hero__cta">
              <button className="btn btn--primary btn--lg" onClick={() => navigate('/subjects/electronic-devices/mosfet-iv')}>
                Start with MOSFET — free
                <span style={{marginLeft:8}}>→</span>
              </button>
              <button className="btn btn--ghost btn--lg" onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({behavior:'smooth', block:'start'});
              }}>
                See how it works ↓
              </button>
            </div>
            <div className="hero__proof">
              <div className="mono" style={{fontSize:11, letterSpacing:'0.06em', color:'var(--ink-mute)'}}>
                JOINED · BETA #001 → #050
              </div>
              <div className="hero__proof-avatars">
                {['AS','PR','MK','NV','RK','+45'].map((s,i) => (
                  <div key={i} className="hero__proof-av" style={{zIndex: 6-i}}>{s}</div>
                ))}
              </div>
              <div style={{fontSize:13, color:'var(--ink-soft)'}}>
                50 GATE ECE 2027 aspirants in the feedback cohort.
              </div>
            </div>
          </div>

          <div className="hero__demo">
            <div className="hero__demo-label">
              <span className="eyebrow">Live · Try it</span>
              <span className="mono" style={{fontSize:10, color:'var(--ink-mute)'}}>Embedded from /subjects/electronic-devices/mosfet-iv · Viz</span>
            </div>
            <MOSFETViz size="md" initialVGS={0.50} initialVDS={0.60} autoCycle={true} showControls={false}/>
            <div className="hero__demo-hint mono">
              <span>↺ auto-demo · cycling regions</span>
              <span>open MOSFET to control it →</span>
            </div>
          </div>
        </div>
        <hr className="rule"/>
        <div className="hero__footnotes mono">
          <div>↓ scroll · five layers</div>
          <div>theory · viz · lab · pyqs · practice</div>
          <div>15 concepts shipped · 565 in queue</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section">
        <div className="section__head">
          <div className="rubric">02 · How it works</div>
          <h2 className="section__h2">One concept. <em>Five layers</em> of understanding.</h2>
          <p className="section__lead">
            We refuse to ship a concept until it works at every layer. Skim the layer you need,
            stay for the one you didn't know you needed.
          </p>
        </div>

        <ol className="layers">
          {[
            { i:'I',   t:'Theory · ELI10',     d:'A 10-year-old reading would get it. No jargon. No formulas. Just a story you remember.', a:'A water tap.' },
            { i:'II',  t:'Theory · Technical', d:'Now the physics, the equations, and the GATE depth — what is actually tested and how deep.', a:'I_D = (k/2)(V_GS − V_t)²' },
            { i:'III', t:'Viz',                d:'Type a voltage, watch the channel form. Move past threshold, see pinch-off. Mechanism, not graphs.', a:'live · interactive' },
            { i:'IV',  t:'Lab',                d:'You are an Apple chip engineer. Calculate V_GS. Get it wrong and the gate oxide cracks.', a:'real consequences' },
            { i:'V',   t:'PYQs · Practice',    d:'Every GATE question on this concept since 2020, with traps called out. Then five more to drill it in.', a:'2020 → 2026' },
          ].map((l, idx) => (
            <li key={idx} className="layer">
              <div className="layer__num serif">{l.i}.</div>
              <div className="layer__body">
                <div className="layer__t">{l.t}</div>
                <div className="layer__d">{l.d}</div>
              </div>
              <div className="layer__a mono">{l.a}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* REAL WORLD */}
      <section className="section section--anchor">
        <div className="section__head">
          <div className="rubric">03 · Real-world anchor</div>
          <h2 className="section__h2">The transistor in <em>your pocket</em>, in numbers.</h2>
        </div>
        <div className="anchor">
          <div className="anchor__chip">
            <div className="chip-frame">
              <div className="chip-die">
                {/* die grid */}
                <div className="chip-die__grid"></div>
                <div className="chip-die__label mono">
                  <div>A19 PRO · 3 nm</div>
                  <div>~19,000,000,000 MOSFETs</div>
                </div>
                <div className="chip-die__pin"/>
                <div className="chip-die__zoomline"/>
                <div className="chip-die__zoombox">
                  <div className="mono" style={{fontSize:9, color:'var(--accent-ink)'}}>1 transistor</div>
                </div>
              </div>
              <div className="chip-frame__caption mono">SOURCE · TSMC / APPLE PUBLISHED SPECS · MAY 2026</div>
            </div>
          </div>

          <div className="anchor__story">
            <p className="anchor__line"><span className="anchor__k">Process</span> TSMC <em>N3E</em>. 3-nanometre class.</p>
            <p className="anchor__line"><span className="anchor__k">Die</span> Apple <em>A19 Pro</em>. ~19 billion transistors on a fingernail of silicon.</p>
            <p className="anchor__line"><span className="anchor__k">Clock</span> Each one flips <em>3.78 billion</em> times every second.</p>
            <p className="anchor__line"><span className="anchor__k">V<sub>t</sub></span> ~0.3 V. Threshold. Below it, dead silent.</p>
            <p className="anchor__line"><span className="anchor__k">V<sub>BD</sub></span> ~1.2 V. Oxide breakdown. Above it, dead permanently.</p>
            <p className="anchor__line anchor__line--big serif">
              <em>This is the MOSFET you're about to simulate.</em>
            </p>
            <button className="btn btn--accent" onClick={() => navigate('/subjects/electronic-devices/mosfet-iv?tab=lab')}>
              Open the MOSFET Lab →
            </button>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="section">
        <div className="section__head">
          <div className="rubric">04 · V1 Catalogue</div>
          <h2 className="section__h2">Three subjects. <em>Fifteen</em> gold-standard concepts.</h2>
          <p className="section__lead">
            We refuse to scale into mediocrity. Quality at fifteen before quantity at five-eighty.
          </p>
        </div>
        <div className="subjects-grid">
          {data.subjects.map(s => (
            <article key={s.id} className="subj-card" onClick={() => navigate(`/subjects/${s.id}`)}>
              <div className="subj-card__top">
                <div className="serif subj-card__glyph">{s.glyph}</div>
                <div>
                  <div className="eyebrow">{`~${s.gateMarks} marks · GATE ECE`}</div>
                  <h3 className="subj-card__title">{s.name}</h3>
                </div>
              </div>
              <p className="subj-card__blurb">{s.blurb}</p>
              <ul className="subj-card__pills">
                {s.concepts.map(c => (
                  <li key={c.id} className={`subj-pill ${c.hero ? 'is-hero' : ''}`}>
                    {c.hero && <span className="mono" style={{fontSize:9, color:'var(--accent)'}}>★ HERO</span>}
                    <span>{c.name.replace(/^[^·]+· /, '')}</span>
                  </li>
                ))}
              </ul>
              <div className="subj-card__foot">
                <div className="mono" style={{fontSize:11, color:'var(--ink-mute)'}}>
                  {s.conceptCount} concepts · v1
                </div>
                <span className="subj-card__arrow">Explore →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <hr className="rule"/>
        <div className="footer__row">
          <div className="footer__left">
            <span className="serif" style={{fontSize:24, fontStyle:'italic'}}>GateVisionPrep</span>
            <span className="mono" style={{fontSize:11, color:'var(--ink-mute)', marginLeft:8}}>V 1.0 · BETA</span>
          </div>
          <div className="footer__nav mono">
            <a href="#">Feedback</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer__fine mono">
          AI-assisted content · reviewed for accuracy by a GATE ECE subject matter expert.
          Apple, A19 Pro and TSMC N3E are referenced as published engineering benchmarks for educational illustration.
        </div>
      </footer>
    </div>
  );
};
