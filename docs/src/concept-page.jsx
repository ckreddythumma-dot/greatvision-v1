// =================================================================
// Concept page — 5 tabs shell + Theory + PYQs + Practice
// (Viz + Lab in separate files for clarity)
// =================================================================
const { useState: cpUseState, useEffect: cpUseEffect, useMemo: cpUseMemo } = React;

window.ConceptPage = function ConceptPage({ navigate, subjectId, conceptId, initialTab, isLoggedIn, onSignIn, labOutcome, vizForceRegion }) {
  const data = window.GVP_DATA;
  const subject = data.subjects.find(s => s.id === subjectId) || data.subjects[1];
  const concept = subject.concepts.find(c => c.id === conceptId) || subject.concepts[0];
  const isMOSFET = conceptId === 'mosfet-iv' || (!conceptId && true);
  const m = data.mosfetConcept;

  const [activeTab, setActiveTab] = cpUseState(initialTab || 'theory');
  const [authGateFor, setAuthGateFor] = cpUseState(null);

  cpUseEffect(() => { setActiveTab(initialTab || 'theory'); }, [conceptId, initialTab]);

  const tabs = [
    { id: 'theory',   label: 'Theory',   locked: false },
    { id: 'viz',      label: 'Viz',      locked: false },
    { id: 'lab',      label: 'Lab',      locked: !isLoggedIn },
    { id: 'pyqs',     label: 'PYQs',     locked: !isLoggedIn },
    { id: 'practice', label: 'Practice', locked: !isLoggedIn },
  ];

  const handleTab = (t) => {
    if (t.locked) { setAuthGateFor(t.label); return; }
    setActiveTab(t.id);
    window.history.replaceState(null, '', `#/subjects/${subjectId}/${conceptId || 'mosfet-iv'}?tab=${t.id}`);
  };

  // ---- For non-MOSFET concepts, show a "placeholder" state but still demo the shell
  if (!isMOSFET) {
    return (
      <div className="page page-fade concept-page">
        <ConceptTopbar navigate={navigate} subject={subject} concept={concept} />
        <div className="concept-empty pad-x">
          <div className="rubric">Concept · scaffolded</div>
          <h1 className="page-title">{concept.name.replace(/^[^·]+· /, '')}</h1>
          <p style={{maxWidth:'56ch', color:'var(--ink-soft)', fontSize:16}}>
            This concept page exists in the V1 shell but full content has not been authored yet.
            The MOSFET I-V page is the gold-standard reference — every other concept will be built
            to match before V1 ships.
          </p>
          <button className="btn btn--accent" style={{marginTop:20}} onClick={() => navigate('/subjects/electronic-devices/mosfet-iv')}>
            See the MOSFET reference →
          </button>
          <hr className="rule" style={{margin:'48px 0 32px'}}/>
          <div className="placeholder-stripes" style={{height:280, display:'grid', placeItems:'center'}}>
            <span className="mono" style={{color:'var(--ink-mute)', fontSize:12, letterSpacing:'0.08em'}}>
              CONTENT · TBD · author + SME pending
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-fade concept-page">
      <ConceptTopbar navigate={navigate} subject={subject} concept={concept}
                     tabs={tabs} activeTab={activeTab} onTab={handleTab}/>

      <div className="concept-layout">
        {/* Left sidebar — visible for theory / pyqs / practice */}
        {(activeTab === 'theory' || activeTab === 'pyqs' || activeTab === 'practice') && (
          <ConceptSidebar subject={subject} concept={concept} navigate={navigate}/>
        )}
        {activeTab === 'viz' && <VizSidebar subject={subject} concept={concept} navigate={navigate}/>}

        <main className="concept-main">
          {activeTab === 'theory'   && <TheoryTab m={m}/>}
          {activeTab === 'viz'      && <VizTab m={m} forceRegion={vizForceRegion}/>}
          {activeTab === 'lab'      && <LabTab m={m} labOutcome={labOutcome}/>}
          {activeTab === 'pyqs'     && <PYQsTab m={m} navigate={navigate}/>}
          {activeTab === 'practice' && <PracticeTab m={m} navigate={navigate}/>}
        </main>

        {/* Right sidebar appears for Lab tab */}
        {activeTab === 'lab' && <LabSidebar m={m}/>}
      </div>

      {authGateFor && (
        <AuthGateModal tabName={authGateFor}
                       onDismiss={() => setAuthGateFor(null)}
                       onSignIn={() => { onSignIn(); setAuthGateFor(null); }}/>
      )}

      {/* Floating feedback */}
      <div className="feedback-pop">
        <span className="mono" style={{fontSize:10, color:'var(--ink-mute)', letterSpacing:'0.08em'}}>WAS THIS HELPFUL?</span>
        <button className="feedback-pop__btn">👍</button>
        <button className="feedback-pop__btn">👎</button>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
function ConceptTopbar({ navigate, subject, concept, tabs, activeTab, onTab }) {
  return (
    <header className="concept-top">
      <div className="concept-top__row">
        <div className="breadcrumb mono">
          <a onClick={() => navigate('/subjects')}>Subjects</a>
          <span>›</span>
          <a onClick={() => navigate(`/subjects/${subject.id}`)}>{subject.shortName}</a>
          <span>›</span>
          <span>{concept.name.replace(/^[^·]+· /, '')}</span>
        </div>
        <div className="concept-top__meta">
          <span className="stars">{'★'.repeat(concept.stars)}<span className="empty">{'★'.repeat(5-concept.stars)}</span></span>
          <span className="mono" style={{fontSize:11, color:'var(--ink-mute)', marginLeft:8}}>GATE frequency</span>
        </div>
      </div>
      <div className="concept-top__title">
        <div>
          <div className="eyebrow">{subject.name} · {concept.hero ? 'Hero concept' : 'Concept'}</div>
          <h1 className="concept-top__h1">{concept.name.replace(/^[^·]+· /, '')}</h1>
          <div className="concept-top__tags">
            <span className="pill">ECE Core</span>
            <span className="pill">2 marks</span>
            <span className="pill">NAT + MCQ</span>
            <span className="pill pill--accent">Appears in 6 / 7 GATE papers</span>
          </div>
        </div>
      </div>
      {tabs && (
        <nav className="concept-tabs">
          {tabs.map(t => (
            <button key={t.id}
                    className={`concept-tab ${activeTab === t.id ? 'is-active' : ''} ${t.locked ? 'is-locked' : ''}`}
                    onClick={() => onTab(t)}>
              <span>{t.label}</span>
              {t.locked && <LockIcon/>}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function LockIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft:6}}><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>;
}

// -----------------------------------------------------------------
function ConceptSidebar({ subject, concept, navigate }) {
  return (
    <aside className="cside">
      <div className="cside__head">
        <div className="rubric">{subject.shortName}</div>
        <div className="cside__head-title serif">{subject.conceptCount} concepts</div>
      </div>
      <ul className="cside__list">
        {subject.concepts.map((c, i) => {
          const active = c.id === concept.id;
          return (
            <li key={c.id} className={`cside__item ${active ? 'is-active' : ''}`}
                onClick={() => navigate(`/subjects/${subject.id}/${c.id}`)}>
              <div className="cside__item-num mono">{String(i+1).padStart(2,'0')}</div>
              <div className="cside__item-name">{c.name.replace(/^[^·]+· /, '')}</div>
              <div className="cside__item-stars mono">{'★'.repeat(c.stars)}</div>
              {c.status === 'mastered' && <span className="cside__check">✓</span>}
            </li>
          );
        })}
      </ul>
      <hr className="rule" style={{margin:'18px 0'}}/>
      <div className="cside__sme">
        <div className="mono" style={{fontSize:10, letterSpacing:'0.06em', color:'var(--ink-mute)'}}>SME REVIEWED</div>
        <div className="serif" style={{fontSize:14, marginTop:4}}>Dr. K. Iyer · IISc Bangalore</div>
        <div className="mono" style={{fontSize:10, color:'var(--ink-mute)', marginTop:2}}>v 1.0 · 12 May 2026</div>
      </div>
    </aside>
  );
}

function VizSidebar({ subject, concept, navigate }) {
  const groups = [
    { name: 'MOSFET', open: true, items: [
      { id: 'mosfet-iv', label: 'I–V Characteristics', active: true },
      { id: 'mosfet-regions', label: 'Regions of Operation' },
    ] },
    { name: 'PN Junction Diode', items: [{ id: 'pn-junction', label: 'I–V & depletion' }] },
    { name: 'BJT', items: [{ id: 'bjt-regions', label: 'Operating regions' }] },
    { name: 'Energy Band Diagrams', items: [{ id: 'band-diagram', label: 'Bands & Fermi level' }] },
  ];
  return (
    <aside className="cside cside--viz">
      <div className="cside__head">
        <div className="rubric">Viz · tree</div>
        <div className="cside__head-title serif">{subject.name}</div>
      </div>
      {groups.map((g, gi) => (
        <div key={gi} className="viz-tree">
          <button className="viz-tree__head">
            <span className="viz-tree__caret">{g.open ? '▾' : '▸'}</span>
            <span>{g.name}</span>
          </button>
          {g.open && (
            <ul className="viz-tree__list">
              {g.items.map(it => (
                <li key={it.id} className={`viz-tree__item ${it.active ? 'is-active' : ''}`}
                    onClick={() => navigate(`/subjects/${subject.id}/${it.id}?tab=viz`)}>
                  <span className="viz-tree__bullet"/>
                  {it.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}

// =================================================================
// TAB 1 — Theory
// =================================================================
function TheoryTab({ m }) {
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
          <h2 className="theory__h2">An <em>electronic stomp</em><br/> on a garden hose.</h2>
        </div>
        <div className="theory__body theory__body--eli10">
          {m.theory.eli10.body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <blockquote className="theory__pull serif">
          <span className="theory__pull-mark">"</span>
          {m.theory.eli10.pullquote}
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
              <div className="theory__tech-body" dangerouslySetInnerHTML={{__html: b.body.replace(/\n/g, '<br/>')}}/>
            </div>
          ))}

          {/* regions table */}
          <div className="theory__regions">
            <div className="theory__regions-head mono">
              <span>Region</span><span>Condition on V_GS</span><span>Condition on V_DS</span><span>Behaviour</span>
            </div>
            {[
              { r: 'Cutoff',     g: 'V_GS < V_t',  d: '—',                       b: 'I_D ≈ 0 — channel does not exist' },
              { r: 'Linear',     g: 'V_GS > V_t',  d: 'V_DS < V_GS − V_t',        b: 'Voltage-controlled resistor' },
              { r: 'Saturation', g: 'V_GS > V_t',  d: 'V_DS ≥ V_GS − V_t',        b: 'Pinch-off; I_D ≈ const w.r.t. V_DS' },
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
              <span className="mono theory__anchor-k" dangerouslySetInnerHTML={{__html: row.k}}/>
              <span className="serif theory__anchor-v" dangerouslySetInnerHTML={{__html: row.v}}/>
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
                <div><span className="mono formula__k">when</span> <span dangerouslySetInnerHTML={{__html: f.when}}/></div>
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
  );
}

// VizTab, LabTab, PYQsTab, PracticeTab, LabSidebar are defined in other files
// (placeholders below — overridden when their files load)
window.__defer = window.__defer || {};

// =================================================================
// TAB 4 — PYQs
// =================================================================
function PYQsTab({ m, navigate }) {
  const [year, setYear] = cpUseState('all');
  const [type, setType] = cpUseState('all');

  const filtered = m.pyqs.filter(p =>
    (year === 'all' || p.year === +year) &&
    (type === 'all' || p.type === type)
  );

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

      {/* PYQ analytics insight */}
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
          <button className="btn btn--ghost" style={{marginTop:16}} onClick={() => navigate('/pyqs/viz')}>
            Open full PYQ analytics →
          </button>
        </div>
        <div className="pyq-spark">
          <PYQSparkChart pyqs={m.pyqs}/>
        </div>
      </div>
    </article>
  );
}

function PYQSparkChart({ pyqs }) {
  // bar chart by year
  const years = [2020,2021,2022,2023,2024,2025,2026];
  const counts = years.map(y => ({
    y,
    one: pyqs.filter(p => p.year === y && p.marks === 1).length,
    two: pyqs.filter(p => p.year === y && p.marks === 2).length,
  }));
  const max = 3;
  const W = 360, H = 200, pad = 28;
  const bw = (W - pad*2) / years.length - 6;

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
        const x = pad + i*((W-pad*2)/years.length) + 3;
        const total = c.one + c.two;
        const h1 = (c.one/max)*(H-pad*2);
        const h2 = (c.two/max)*(H-pad*2);
        return (
          <g key={i}>
            <rect x={x} y={H-pad - h1} width={bw} height={h1} fill="var(--ink-mute)" opacity="0.6"/>
            <rect x={x} y={H-pad - h1 - h2} width={bw} height={h2} fill="var(--accent)"/>
            <text x={x + bw/2} y={H-8} fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)" textAnchor="middle">{c.y}</text>
            {total > 0 && <text x={x+bw/2} y={H-pad - h1 - h2 - 4} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink)">{total}</text>}
          </g>
        );
      })}
      <g fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)">
        <rect x={W-pad-110} y={6} width="10" height="6" fill="var(--accent)"/>
        <text x={W-pad-96} y={12}>2 mark</text>
        <rect x={W-pad-50} y={6} width="10" height="6" fill="var(--ink-mute)" opacity="0.6"/>
        <text x={W-pad-36} y={12}>1 mark</text>
      </g>
    </svg>
  );
}

function PYQCard({ q, idx }) {
  const [open, setOpen] = cpUseState(false);
  const [val, setVal] = cpUseState('');
  const [picked, setPicked] = cpUseState(null);
  const [submitted, setSubmitted] = cpUseState(false);

  const correct = q.type === 'MCQ'
    ? picked === q.answerIdx
    : Math.abs(parseFloat(val) - q.answer) < 0.02;

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
                 onChange={e => setVal(e.target.value)} placeholder="answer"
                 disabled={submitted}/>
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
  );
}

// =================================================================
// TAB 5 — Practice
// =================================================================
function PracticeTab({ m, navigate }) {
  const [results, setResults] = cpUseState({}); // id -> { correct, hintUsed }
  const total = m.practice.length * 5;
  const score = Object.values(results).reduce((a, r) => a + (r.correct ? 5 : -2) + (r.hintUsed ? -2 : 0), 0);
  const attempted = Object.keys(results).length;

  return (
    <article className="practice">
      <div className="theory__rubric">
        <span className="rubric">Practice · concept-check problems</span>
        <span className="mono theory__progress">{attempted} / {m.practice.length} attempted</span>
      </div>

      <div className="mastery">
        <div className="mastery__top">
          <div>
            <div className="eyebrow">Mastery score · MOSFET I-V</div>
            <div className="mastery__score">
              <span className="serif" style={{fontSize:64, lineHeight:1}}>{score}</span>
              <span className="mono" style={{fontSize:14, color:'var(--ink-mute)'}}>/ {total} pts</span>
            </div>
          </div>
          <div className="mastery__legend mono">
            <div><b className="dot dot--ok"/>+5 correct</div>
            <div><b className="dot dot--bad"/>−2 wrong</div>
            <div><b className="dot dot--warn"/>−2 hint used</div>
          </div>
          <button className="btn btn--ghost" onClick={() => navigate('/practice/lab')}>Focus mode →</button>
        </div>
        <div className="mastery__bar">
          <div style={{width: Math.max(0, Math.min(100, (score/total)*100))+'%'}}/>
        </div>
      </div>

      <div className="practice-list">
        {m.practice.map((p, i) => (
          <PracticeCard key={p.id} p={p} idx={i}
                        onResult={(r) => setResults(prev => ({...prev, [p.id]: r}))}/>
        ))}
      </div>
    </article>
  );
}

function PracticeCard({ p, idx, onResult }) {
  const [open, setOpen] = cpUseState(false);
  const [val, setVal] = cpUseState('');
  const [picked, setPicked] = cpUseState(null);
  const [showHint, setShowHint] = cpUseState(false);
  const [submitted, setSubmitted] = cpUseState(false);
  const [flash, setFlash] = cpUseState(null);

  const correct = p.kind === 'mcq'
    ? picked === p.answerIdx
    : Math.abs(parseFloat(val) - p.answer) < 0.02;

  const submit = () => {
    if ((p.kind === 'mcq' && picked == null) || (p.kind === 'nat' && val === '')) return;
    setSubmitted(true);
    setFlash(correct ? 'ok' : 'bad');
    setTimeout(() => setFlash(null), 700);
    onResult && onResult({ correct, hintUsed: showHint });
  };

  return (
    <article className={`pcard pcard--${flash || (submitted ? (correct ? 'ok' : 'bad') : '')}`}>
      <header className="pcard__head">
        <div className="pcard__num serif">P{idx+1}.</div>
        <span className="pill">{p.kind === 'mcq' ? 'MCQ · concept-check' : p.id === 'p3' ? 'NAT · boundary' : 'NAT · numerical'}</span>
        <span className="mono pcard__pts">+5 / −2</span>
      </header>
      <p className="pcard__q serif">{p.q}</p>

      {p.kind === 'mcq' ? (
        <ol className="pyq__opts">
          {p.options.map((o, oi) => (
            <li key={oi}>
              <button className={`pyq__opt ${picked === oi ? 'is-picked' : ''} ${submitted && oi === p.answerIdx ? 'is-correct' : ''}`}
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
          <span className="mono" style={{color:'var(--ink-mute)'}}>{p.unit}</span>
        </div>
      )}

      <div className="pcard__actions">
        {!submitted ? (
          <>
            <button className="btn btn--primary" onClick={submit}>Submit</button>
            <button className="pcard__hint mono" onClick={() => setShowHint(h => !h)}>
              {showHint ? '−' : '+'} hint <span style={{color:'var(--warn)'}}>−2</span>
            </button>
          </>
        ) : (
          <>
            <div className={`pyq__verdict ${correct ? 'is-ok' : 'is-bad'}`}>
              {correct ? `✓ Correct · +5` : `✗ Wrong · −2`}
              {showHint && <span className="mono" style={{marginLeft:8, color:'var(--warn)'}}>hint used · −2</span>}
            </div>
            <button className="pcard__hint mono" onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Show'} why</button>
          </>
        )}
      </div>

      {showHint && !submitted && (
        <div className="pcard__hintbox">
          <span className="mono" style={{color:'var(--warn)', fontSize:11, letterSpacing:'0.06em'}}>HINT · −2 pts on submit</span>
          <p>Think mechanism, not just formula. Which region are you in? What does the formula give you when V_DS just equals V_GS − V_t?</p>
        </div>
      )}

      {(open || submitted) && submitted && open && (
        <div className="pcard__why">
          <span className="mono" style={{fontSize:11, color:'var(--ink-mute)'}}>WHY</span>
          <p>{p.why}</p>
        </div>
      )}
    </article>
  );
}
