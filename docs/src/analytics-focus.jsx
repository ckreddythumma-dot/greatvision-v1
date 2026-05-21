// =================================================================
// PYQ Analytics page + Practice Lab focused mode
// =================================================================
const { useState: paUseState, useMemo: paUseMemo } = React;

window.PYQVizPage = function PYQVizPage({ navigate }) {
  const [yearRange, setYearRange] = paUseState('2020-2026');
  const [subjFilter, setSubjFilter] = paUseState('all');

  const years = [2020,2021,2022,2023,2024,2025,2026];
  // synthesized matrix: subject × year → count
  const matrix = {
    'Engineering Mathematics': [4, 5, 3, 5, 4, 6, 5],
    'Electronic Devices':      [6, 5, 7, 6, 8, 7, 6],
    'Digital Circuits':        [7, 6, 7, 5, 8, 7, 9],
    'Signals & Systems':       [4, 5, 4, 6, 5, 5, 4],
    'Control Systems':         [3, 4, 4, 3, 4, 3, 5],
    'Communications':          [5, 4, 5, 4, 6, 5, 5],
    'EMF':                     [3, 3, 4, 4, 3, 4, 3],
    'Networks':                [4, 5, 4, 4, 5, 4, 5],
    'Analog Circuits':         [4, 5, 5, 4, 6, 5, 5],
  };
  const subjects = Object.keys(matrix);
  const maxCount = Math.max(...Object.values(matrix).flat());

  const totals = subjects.map(s => ({ s, n: matrix[s].reduce((a,b) => a+b, 0) }));

  // top topics
  const topics = [
    { s: 'Electronic Devices', t: 'MOSFET I–V',         n: 38, trend: '↑' },
    { s: 'Digital Circuits',   t: 'K-Map / Boolean',    n: 34, trend: '→' },
    { s: 'Eng. Maths',         t: 'Eigenvalues',        n: 28, trend: '↑' },
    { s: 'Signals',            t: 'Z-Transform',        n: 24, trend: '↓' },
    { s: 'Networks',           t: 'Mesh & nodal',       n: 22, trend: '→' },
    { s: 'Analog',             t: 'Op-amp · golden rules', n: 20, trend: '↑' },
  ];

  return (
    <div className="page page-fade pad-x pyqviz-page">
      <div className="breadcrumb mono">
        <a onClick={() => navigate('/')}>Home</a><span>›</span><span>PYQ analytics</span>
      </div>

      <header className="page-header">
        <div className="rubric">PYQ Bank · analytics</div>
        <h1 className="page-title">
          Seven years of <em>GATE ECE</em><br/>at a glance.
        </h1>
        <p style={{maxWidth:'60ch', color:'var(--ink-soft)', fontSize:17}}>
          Every published GATE ECE question (2020 → 2026) tagged to subject and topic. Read the heatmap
          to see where the examiner returns most often. Read the topic table to know what to drill first.
        </p>
        <div className="page-header__meta mono">
          <span>317 questions indexed</span><span>·</span>
          <span>7 years</span><span>·</span>
          <span>9 subjects · 86 topics</span><span>·</span>
          <span>updated 18 May 2026</span>
        </div>
      </header>
      <hr className="rule"/>

      {/* filter bar */}
      <div className="analytics-toolbar mono">
        <div className="analytics-toolbar__group">
          <span className="eyebrow">Range</span>
          {['2020-2026','2023-2026','2024-2026'].map(r => (
            <button key={r} className={`pyq-chip ${yearRange === r ? 'is-on' : ''}`} onClick={() => setYearRange(r)}>{r}</button>
          ))}
        </div>
        <div className="analytics-toolbar__group">
          <span className="eyebrow">Subject</span>
          <select className="mono analytics-select" value={subjFilter} onChange={e => setSubjFilter(e.target.value)}>
            <option value="all">All 9 subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{flex:1}}/>
        <div className="analytics-toolbar__group">
          <span className="mono" style={{fontSize:11, color:'var(--ink-mute)'}}>317 q · 1.0 GB indexed</span>
        </div>
      </div>

      <div className="analytics-grid">
        {/* === HEATMAP === */}
        <section className="analytics-card analytics-card--big">
          <header className="analytics-card__head">
            <div>
              <div className="rubric">Heatmap · subject × year</div>
              <h2 className="serif" style={{fontSize:24, lineHeight:1.1, margin:'6px 0 0'}}>Where does GATE return?</h2>
            </div>
            <div className="mono analytics-card__legend">
              {[1,2,3,4,5,6,7,8].map(i => (
                <span key={i} className="heat-key" style={{background: heatColor(i, 8)}}/>
              ))}
              <span style={{marginLeft:6}}>0 → {maxCount}</span>
            </div>
          </header>

          <div className="heatmap">
            <div className="heatmap__years mono">
              <span/>{years.map(y => <span key={y}>{y}</span>)}<span>Σ</span>
            </div>
            {subjects.map(s => {
              const row = matrix[s];
              const tot = row.reduce((a,b) => a+b, 0);
              const muted = subjFilter !== 'all' && subjFilter !== s;
              return (
                <div key={s} className="heatmap__row" style={{opacity: muted ? 0.3 : 1}}>
                  <div className="heatmap__label">{s}</div>
                  {row.map((n, i) => (
                    <div key={i} className="heat-cell" style={{background: heatColor(n, maxCount)}}>
                      <span className="mono">{n}</span>
                    </div>
                  ))}
                  <div className="heatmap__total mono">{tot}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* === SUBJECT TOTALS === */}
        <section className="analytics-card">
          <header className="analytics-card__head">
            <div>
              <div className="rubric">Subjects · totals</div>
              <h2 className="serif" style={{fontSize:22, lineHeight:1.1, margin:'6px 0 0'}}>Volume</h2>
            </div>
          </header>
          <div className="bars">
            {totals.sort((a,b) => b.n - a.n).map((row, i) => {
              const w = (row.n / 60) * 100;
              return (
                <div key={i} className="bar-row" onClick={() => setSubjFilter(row.s)}>
                  <div className="bar-row__label">{row.s}</div>
                  <div className="bar-row__bar">
                    <div className="bar-row__fill" style={{width: w+'%', background: heatColor(row.n, 60)}}/>
                  </div>
                  <div className="bar-row__n mono">{row.n}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* === TOPICS === */}
        <section className="analytics-card">
          <header className="analytics-card__head">
            <div>
              <div className="rubric">Topics · most-frequent</div>
              <h2 className="serif" style={{fontSize:22, lineHeight:1.1, margin:'6px 0 0'}}>Drill these first</h2>
            </div>
          </header>
          <table className="topic-table">
            <thead>
              <tr><th>#</th><th>Topic</th><th>Subject</th><th>n</th><th>5y trend</th></tr>
            </thead>
            <tbody>
              {topics.map((t, i) => (
                <tr key={i}>
                  <td className="mono">{String(i+1).padStart(2,'0')}</td>
                  <td className="serif" style={{fontSize:16}}>{t.t}</td>
                  <td className="mono" style={{color:'var(--ink-mute)'}}>{t.s}</td>
                  <td className="mono">{t.n}</td>
                  <td className="mono" style={{color: t.trend==='↑'?'var(--ok)':t.trend==='↓'?'var(--bad)':'var(--ink-mute)'}}>{t.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* === BIG NUMBER === */}
        <section className="analytics-card analytics-card--num">
          <div className="rubric">Insight</div>
          <div className="serif analytics-num">38</div>
          <div className="mono" style={{fontSize:11, color:'var(--ink-mute)', letterSpacing:'0.06em'}}>
            APPEARANCES · MOSFET I–V · 2020–2026
          </div>
          <hr className="rule" style={{margin:'18px 0'}}/>
          <div className="serif" style={{fontSize:20, lineHeight:1.2}}>
            The single most-tested topic in Electronic Devices. <em>Six</em> of the last <em>seven</em>
            GATE ECE papers asked an I–V numerical.
          </div>
          <button className="btn btn--accent" style={{marginTop:16}}
                  onClick={() => navigate('/subjects/electronic-devices/mosfet-iv?tab=pyqs')}>
            See MOSFET PYQs →
          </button>
        </section>

        {/* === MARK SPLIT === */}
        <section className="analytics-card">
          <header className="analytics-card__head">
            <div>
              <div className="rubric">Marks · split</div>
              <h2 className="serif" style={{fontSize:22, lineHeight:1.1, margin:'6px 0 0'}}>1 vs 2 mark</h2>
            </div>
          </header>
          <div className="marksplit">
            {years.map(y => {
              const total = Math.round(40 + Math.sin(y)*8);
              const two = Math.round(total * 0.58);
              const one = total - two;
              return (
                <div key={y} className="marksplit__col">
                  <div className="marksplit__bar">
                    <div className="marksplit__seg marksplit__seg--two" style={{height: (two/40)*100+'%'}}><span className="mono">{two}</span></div>
                    <div className="marksplit__seg marksplit__seg--one" style={{height: (one/40)*100+'%'}}><span className="mono">{one}</span></div>
                  </div>
                  <div className="mono" style={{fontSize:10, color:'var(--ink-mute)'}}>{y}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

function heatColor(n, max) {
  if (n === 0) return 'var(--surface-2)';
  const t = Math.min(1, n/max);
  // accent-tinted: lower=light, higher=accent
  return `color-mix(in oklch, var(--accent) ${Math.round(t*85)}%, var(--paper))`;
}

// =================================================================
// Practice Lab — focused mode (full-bleed, single problem, timer)
// =================================================================
window.PracticeLabPage = function PracticeLabPage({ navigate, isLoggedIn, onSignIn }) {
  const data = window.GVP_DATA;
  const problems = data.mosfetConcept.practice;
  const [idx, setIdx] = paUseState(0);
  const [showSolution, setShowSolution] = paUseState(false);
  const [val, setVal] = paUseState('');
  const [picked, setPicked] = paUseState(null);
  const [submitted, setSubmitted] = paUseState(false);
  const [time, setTime] = paUseState(240);

  React.useEffect(() => {
    if (time <= 0) return;
    const t = setTimeout(() => setTime(t => t-1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  const p = problems[idx];
  const correct = p.kind === 'mcq' ? picked === p.answerIdx : Math.abs(parseFloat(val) - p.answer) < 0.02;

  const next = () => {
    setIdx(i => (i+1) % problems.length);
    setSubmitted(false); setVal(''); setPicked(null); setShowSolution(false); setTime(240);
  };

  const mins = Math.floor(time/60), secs = time % 60;

  return (
    <div className="page page-fade focus-mode">
      <header className="focus-top">
        <div className="focus-top__left mono">
          <span className="rubric">FOCUS · LAB MODE</span>
          <span style={{color:'var(--ink-mute)', marginLeft:12}}>P{idx+1} of {problems.length}</span>
        </div>
        <div className="focus-timer mono">
          <span style={{fontFamily:'Instrument Serif', fontStyle:'italic', fontSize:32, lineHeight:1, color: time < 60 ? 'var(--bad)' : 'var(--ink)'}}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </span>
          <span className="eyebrow" style={{marginLeft:8}}>TIME</span>
        </div>
        <button className="btn btn--ghost" onClick={() => navigate('/subjects/electronic-devices/mosfet-iv?tab=practice')}>
          ← Exit focus mode
        </button>
      </header>

      <main className="focus-main">
        <div className="focus-card">
          <div className="rubric">{p.kind === 'mcq' ? 'MCQ · concept-check' : 'NAT · numerical'}</div>
          <h1 className="serif focus-q">{p.q}</h1>

          {p.kind === 'mcq' ? (
            <ol className="pyq__opts focus-opts">
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
            <div className="pyq__nat focus-nat">
              <input className="mono pyq__nat-input" type="number" step="0.01" value={val}
                     onChange={e => setVal(e.target.value)} placeholder="answer" disabled={submitted}/>
              <span className="mono" style={{color:'var(--ink-mute)'}}>{p.unit}</span>
            </div>
          )}

          <div className="focus-actions">
            {!submitted ? (
              <button className="btn btn--primary btn--lg" onClick={() => setSubmitted(true)}>Submit</button>
            ) : (
              <>
                <div className={`pyq__verdict ${correct ? 'is-ok' : 'is-bad'}`} style={{fontSize:18}}>
                  {correct ? '✓ Correct · +5 pts' : '✗ Wrong · −2 pts'}
                </div>
                <button className="btn btn--ghost" onClick={() => setShowSolution(s => !s)}>
                  {showSolution ? '− Hide' : '+ Show'} why
                </button>
                <button className="btn btn--accent" onClick={next}>Next problem →</button>
              </>
            )}
          </div>

          {showSolution && (
            <div className="focus-why">
              <span className="mono" style={{color:'var(--ink-mute)', fontSize:11, letterSpacing:'0.06em'}}>EXPLANATION</span>
              <p className="serif" style={{fontSize:18, lineHeight:1.5}}>{p.why}</p>
            </div>
          )}
        </div>

        <aside className="focus-side">
          <div className="rubric">Mastery · live</div>
          <div className="serif" style={{fontSize:64, lineHeight:1, marginTop:10}}>+{idx*5}</div>
          <div className="mono" style={{fontSize:11, color:'var(--ink-mute)'}}>pts this session</div>
          <hr className="rule" style={{margin:'18px 0'}}/>
          <ol className="focus-dots">
            {problems.map((_, i) => (
              <li key={i} className={`focus-dot ${i === idx ? 'is-current' : ''} ${i < idx ? 'is-done' : ''}`}>
                <span className="mono">P{i+1}</span>
              </li>
            ))}
          </ol>
        </aside>
      </main>
    </div>
  );
};
