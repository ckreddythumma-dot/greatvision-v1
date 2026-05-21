// =================================================================
// PYQ Bank — full questions list across subjects/years
// /pyqs        → bank (this page)
// /pyqs/viz    → analytics (PYQVizPage in analytics-focus.jsx)
// =================================================================
const { useState: pbUseState, useMemo: pbUseMemo } = React;

// build a synthetic question pool. Real data would come from a backend.
function buildPYQPool() {
  const m = window.GVP_DATA.mosfetConcept;
  const pool = [];
  // include real MOSFET PYQs
  m.pyqs.forEach(q => pool.push({ ...q, subject: 'Electronic Devices', topic: 'MOSFET I–V', conceptId: 'mosfet-iv' }));

  // synthesise additional PYQs for other subjects/topics so the bank feels full
  const stubs = [
    { subject: 'Engineering Mathematics', topic: 'Eigenvalues', concept: 'eigenvalues',
      q: 'Find the eigenvalues of A = [[4,1],[2,3]]. Enter the larger eigenvalue.', type: 'NAT', answer: 5, unit: '', stars: 4 },
    { subject: 'Engineering Mathematics', topic: 'Laplace Transform', concept: 'laplace',
      q: 'L{e^{−2t} · sin(3t)} =', type: 'MCQ', stars: 4,
      options: ['3/((s+2)²+9)', '3/(s²+9)', '(s+2)/((s+2)²+9)', '1/(s+2)'], answerIdx: 0 },
    { subject: 'Engineering Mathematics', topic: 'Probability', concept: 'probability',
      q: 'A fair die is rolled twice. The probability that the sum is exactly 8 is:', type: 'NAT', answer: 0.139, unit: '', stars: 3 },
    { subject: 'Digital Circuits', topic: 'K-Map', concept: 'kmap',
      q: 'Minimum SOP form of F(A,B,C,D) = Σm(0,1,2,5,8,9,10,13) has how many literals?', type: 'NAT', answer: 6, unit: '', stars: 5 },
    { subject: 'Digital Circuits', topic: 'D Flip-Flop', concept: 'dff',
      q: 'A positive-edge triggered D-FF has D=1 throughout. Q after 3 clock pulses (initially 0):', type: 'MCQ', stars: 3,
      options: ['0', '1', 'undetermined', 'oscillating'], answerIdx: 1 },
    { subject: 'Digital Circuits', topic: 'Counters', concept: 'counters',
      q: 'A mod-12 ripple counter with positive-edge triggered T-FFs needs how many flip-flops?', type: 'NAT', answer: 4, unit: '', stars: 4 },
    { subject: 'Electronic Devices', topic: 'PN Junction', concept: 'pn-junction',
      q: 'The built-in potential of a Si PN junction at 300 K with N_A = 10¹⁶, N_D = 10¹⁷ /cm³ is closest to (n_i = 1.5×10¹⁰):', type: 'MCQ', stars: 4,
      options: ['0.42 V', '0.55 V', '0.75 V', '0.92 V'], answerIdx: 2 },
    { subject: 'Electronic Devices', topic: 'BJT', concept: 'bjt-regions',
      q: 'A BJT has V_BE = 0.7 V, V_CE = 0.2 V. The transistor is in:', type: 'MCQ', stars: 3,
      options: ['Cutoff', 'Active', 'Saturation', 'Reverse-active'], answerIdx: 2 },
    { subject: 'Electronic Devices', topic: 'Band diagrams', concept: 'band-diagram',
      q: 'In intrinsic silicon at 0 K, the Fermi level lies:', type: 'MCQ', stars: 3,
      options: ['At the top of valence band', 'At the bottom of conduction band', 'Mid-gap', 'At trap states'], answerIdx: 2 },
  ];

  // distribute synthetic across years
  const years = [2020,2021,2022,2023,2024,2025,2026];
  const marksByType = { MCQ: 1, NAT: 2 };
  stubs.forEach((st, i) => {
    pool.push({
      id: `syn-${i}`,
      year: years[i % years.length],
      marks: marksByType[st.type] || 1,
      type: st.type,
      stars: st.stars,
      q: st.q,
      ...(st.type === 'MCQ' ? { options: st.options, answerIdx: st.answerIdx } : { answer: st.answer, unit: st.unit }),
      trap: 'Cross-check the boundary condition. Common error is using the wrong region formula.',
      sol: [{ tag: 'Approach', line: 'Apply the relevant formula for this region; verify the conditions hold.' }],
      subject: st.subject, topic: st.topic, conceptId: st.concept,
    });
  });
  return pool;
}

window.PYQBankPage = function PYQBankPage({ navigate }) {
  const pool = pbUseMemo(buildPYQPool, []);
  const subjects = ['all', 'Engineering Mathematics', 'Electronic Devices', 'Digital Circuits'];
  const years = ['all', 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  const [subj, setSubj] = pbUseState('all');
  const [year, setYear] = pbUseState('all');
  const [type, setType] = pbUseState('all');
  const [search, setSearch] = pbUseState('');

  const filtered = pool.filter(p =>
    (subj === 'all' || p.subject === subj) &&
    (year === 'all' || p.year == year) &&
    (type === 'all' || p.type === type) &&
    (!search || (p.q + ' ' + p.topic).toLowerCase().includes(search.toLowerCase()))
  );

  // group by subject for display
  const grouped = filtered.reduce((acc, q) => {
    (acc[q.subject] = acc[q.subject] || []).push(q);
    return acc;
  }, {});

  return (
    <div className="page page-fade pad-x pyq-bank">
      <div className="breadcrumb mono">
        <a onClick={() => navigate('/')}>Home</a><span>›</span><span>PYQ Bank</span>
      </div>

      <header className="page-header">
        <div className="rubric">PYQ Bank · GATE ECE</div>
        <h1 className="page-title">Seven years of GATE.<br/><em>All in one place.</em></h1>
        <p style={{maxWidth:'60ch', color:'var(--ink-soft)', fontSize:16}}>
          Every past GATE ECE question (2020 → 2026), tagged by subject and topic. Each one has the
          full solution, the formula tags, and the common examiner trap called out.
        </p>
        <div className="page-header__meta mono">
          <span>{pool.length} questions indexed</span>
          <span>·</span><span>7 years</span>
          <span>·</span><span>3 subjects in V1</span>
          <span>·</span>
          <button className="mono" style={{color:'var(--accent)', textDecoration:'underline'}}
                  onClick={() => navigate('/pyqs/viz')}>open analytics →</button>
        </div>
      </header>
      <hr className="rule"/>

      {/* Filters */}
      <div className="pyq-bank__filters">
        <div className="pyq-bank__filter">
          <span className="eyebrow">Subject</span>
          <div className="pyq-bank__chips">
            {subjects.map(s => (
              <button key={s} className={`pyq-chip ${subj === s ? 'is-on' : ''}`} onClick={() => setSubj(s)}>
                {s === 'all' ? 'All subjects' : s}
              </button>
            ))}
          </div>
        </div>
        <div className="pyq-bank__filter">
          <span className="eyebrow">Year</span>
          <div className="pyq-bank__chips">
            {years.map(y => (
              <button key={y} className={`pyq-chip ${year == y ? 'is-on' : ''}`} onClick={() => setYear(y)}>{y === 'all' ? 'All' : y}</button>
            ))}
          </div>
        </div>
        <div className="pyq-bank__filter">
          <span className="eyebrow">Type</span>
          <div className="pyq-bank__chips">
            {['all', 'MCQ', 'NAT'].map(t => (
              <button key={t} className={`pyq-chip ${type === t ? 'is-on' : ''}`} onClick={() => setType(t)}>{t === 'all' ? 'All' : t}</button>
            ))}
          </div>
        </div>
        <div className="pyq-bank__filter pyq-bank__filter--search">
          <span className="eyebrow">Search</span>
          <input className="pyq-bank__search mono" placeholder="topic or keyword..."
                 value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="pyq-bank__summary mono">
        Showing <b>{filtered.length}</b> of {pool.length}
        {subj !== 'all' && ` · ${subj}`}
        {year !== 'all' && ` · ${year}`}
        {type !== 'all' && ` · ${type}`}
        {search && ` · "${search}"`}
      </div>

      {/* Grouped list */}
      <div className="pyq-bank__groups">
        {Object.entries(grouped).map(([subjName, items]) => (
          <section key={subjName} className="pyq-bank__group">
            <header className="pyq-bank__group-head">
              <h2 className="serif" style={{fontSize:28, lineHeight:1.1, fontStyle:'italic'}}>{subjName}</h2>
              <div className="mono" style={{fontSize:11, color:'var(--ink-mute)'}}>
                {items.length} question{items.length !== 1 ? 's' : ''}
              </div>
            </header>
            <div className="pyq-list">
              {items.map((q, i) => <PYQBankCard key={q.id} q={q} idx={i} navigate={navigate}/>)}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <div className="pyq-bank__empty">
            <div className="serif" style={{fontSize:48, fontStyle:'italic', color:'var(--ink-mute)'}}>nothing.</div>
            <p style={{color:'var(--ink-mute)', fontSize:13}}>Try widening the filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function PYQBankCard({ q, idx, navigate }) {
  const [open, setOpen] = pbUseState(false);
  const [val, setVal] = pbUseState('');
  const [picked, setPicked] = pbUseState(null);
  const [submitted, setSubmitted] = pbUseState(false);

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
          <span className="pill pill--accent">{q.topic}</span>
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
            {correct ? '✓ Correct' : `✗ Answer · ${q.type === 'MCQ' ? String.fromCharCode(65+q.answerIdx) : q.answer + ' ' + (q.unit || '')}`}
          </div>
        )}
        {q.conceptId && (
          <button className="pyq__more mono" onClick={() => navigate(`/subjects/${q.subject === 'Engineering Mathematics' ? 'engineering-maths' : q.subject === 'Digital Circuits' ? 'digital-circuits' : 'electronic-devices'}/${q.conceptId}`)}>
            open concept page →
          </button>
        )}
        <button className="pyq__more mono" onClick={() => setOpen(o => !o)} style={{marginLeft: q.conceptId ? 0 : 'auto'}}>{open ? 'Hide' : 'Show'} solution & trap</button>
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
