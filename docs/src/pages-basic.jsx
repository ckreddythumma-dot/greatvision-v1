// =================================================================
// Auth page + Auth gate modal
// =================================================================
window.AuthPage = function AuthPage({ navigate, onSignIn }) {
  const handleGoogle = () => {
    onSignIn();
    navigate('/subjects');
  };
  return (
    <div className="page page-fade auth-page">
      <div className="auth-card">
        <div className="auth-card__top">
          <span className="serif" style={{fontSize:36, fontStyle:'italic'}}>GateVisionPrep</span>
          <div className="eyebrow" style={{marginTop:6}}>V1 · BETA · GATE ECE 2027</div>
        </div>

        <hr className="rule" style={{margin:'28px 0'}}/>

        <div className="rubric">Sign in</div>
        <h1 style={{fontSize:42, lineHeight:1.05, margin:'10px 0 14px'}}>
          Unlock <em>Labs</em> & <em>PYQs</em>.
        </h1>
        <p style={{color:'var(--ink-soft)', fontSize:15, margin:'0 0 28px', textWrap:'pretty'}}>
          Theory and Viz are always free. Sign in with Google to access Labs, PYQs and the
          mastery score. No payment. No email forms. No catch.
        </p>

        <button className="auth-google" onClick={handleGoogle}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.9 6.1 29.7 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.9 7.1 29.7 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.4C29.6 34.5 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.5 39.7 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.7 35.8 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button className="auth-email" disabled>
          <span style={{flex:1, textAlign:'left'}}>Continue with email</span>
          <span className="mono" style={{fontSize:10, color:'var(--ink-mute)'}}>SOON</span>
        </button>

        <div style={{marginTop:24, fontSize:11, color:'var(--ink-mute)', textAlign:'center'}}>
          By signing in, you agree to our <a href="#" style={{textDecoration:'underline'}}>Terms</a> &
          <a href="#" style={{textDecoration:'underline'}}> Privacy Policy</a>.
        </div>

        <hr className="rule" style={{margin:'28px 0 18px'}}/>
        <div style={{fontSize:12, color:'var(--ink-mute)', textAlign:'center'}}>
          Already part of the beta? Your progress is saved automatically.
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-side__quote serif">
          "I have been trying to internalise <em>pinch-off</em> for two years. I got it in four minutes
          in the Viz tab."
        </div>
        <div className="mono" style={{fontSize:11, color:'var(--ink-mute)', letterSpacing:'0.06em', marginTop:18}}>
          — A. SHARMA · BETA #007 · NIT WARANGAL
        </div>

        <div className="auth-side__stats">
          <div>
            <div className="serif" style={{fontSize:48, lineHeight:1}}>15</div>
            <div className="mono auth-side__statk">Concepts in V1</div>
          </div>
          <div>
            <div className="serif" style={{fontSize:48, lineHeight:1}}>50</div>
            <div className="mono auth-side__statk">Beta seats</div>
          </div>
          <div>
            <div className="serif" style={{fontSize:48, lineHeight:1}}>₹0</div>
            <div className="mono auth-side__statk">Forever, in V1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// Auth gate modal — shown when a logged-out user hits Lab/PYQs/Practice
// -----------------------------------------------------------------
window.AuthGateModal = function AuthGateModal({ tabName, onSignIn, onDismiss }) {
  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <div className="auth-gate" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onDismiss}>×</button>
        <div className="rubric">Sign-in required</div>
        <h2 style={{fontSize:42, lineHeight:1.05, margin:'10px 0 12px'}}>
          Unlock <em>{tabName}</em>.<br/> Free, forever in V1.
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:15, margin:'0 0 24px'}}>
          Theory and Viz are always free. Sign in with Google to unlock Labs, PYQs and Practice
          across all 15 concepts. We need a way to save your mastery score — that's it.
        </p>
        <button className="auth-google" onClick={onSignIn} style={{width:'100%'}}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.9 6.1 29.7 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.9 7.1 29.7 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.4C29.6 34.5 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.5 39.7 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.7 35.8 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
        <button onClick={onDismiss} className="auth-gate__skip">
          No thanks · keep exploring Theory
        </button>
        <hr className="rule" style={{margin:'24px 0 0'}}/>
        <div className="auth-gate__meta mono">
          <span>{tabName} · gated</span>
          <span>Theory · open</span>
          <span>Viz · open</span>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// Subjects list page
// -----------------------------------------------------------------
window.SubjectsPage = function SubjectsPage({ navigate }) {
  const data = window.GVP_DATA;
  return (
    <div className="page page-fade pad-x">
      <header className="page-header">
        <div className="rubric">/ Subjects</div>
        <h1 className="page-title">
          Your <em>three</em> subjects.<br/> Built for the GATE ECE 2027 cohort.
        </h1>
        <div className="page-header__meta mono">
          <span>15 concepts shipped · gold-standard</span>
          <span>·</span>
          <span>{data.user.cohort}</span>
          <span>·</span>
          <span>updated 18 May 2026</span>
        </div>
      </header>
      <hr className="rule"/>

      <div className="subj-list">
        {data.subjects.map((s, i) => (
          <article key={s.id} className="subj-row" onClick={() => navigate(`/subjects/${s.id}`)}>
            <div className="subj-row__rubric mono">{String(i+1).padStart(2,'0')}</div>
            <div className="subj-row__main">
              <div className="subj-row__head">
                <h2 className="subj-row__title">{s.name}</h2>
                <span className="pill">~{s.gateMarks} marks · ECE</span>
                {s.isHero && <span className="pill pill--accent">★ Hero subject</span>}
              </div>
              <p className="subj-row__blurb">{s.blurb}</p>
              <ul className="subj-row__concepts">
                {s.concepts.map(c => (
                  <li key={c.id} className={`subj-row__concept ${c.hero ? 'is-hero' : ''} status-${c.status}`}
                      onClick={(e) => { e.stopPropagation(); navigate(`/subjects/${s.id}/${c.id}`); }}>
                    <span className="subj-row__concept-stars mono">{'★'.repeat(c.stars)}</span>
                    <span className="subj-row__concept-name">{c.name.replace(/^[^·]+· /, '')}</span>
                    {c.hero && <span className="mono" style={{fontSize:9, color:'var(--accent)'}}>HERO</span>}
                    {c.status === 'mastered' && <span className="pill pill--ok" style={{marginLeft:'auto', fontSize:9}}>✓ Mastered</span>}
                    {c.status === 'attempted' && <span className="pill" style={{marginLeft:'auto', fontSize:9}}>· in-progress</span>}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="subj-row__aside">
              <div className="subj-row__progress">
                <div className="serif" style={{fontSize:52, lineHeight:1}}>{s.progress}<span style={{fontSize:22}}>%</span></div>
                <div className="mono" style={{fontSize:10, color:'var(--ink-mute)', letterSpacing:'0.06em'}}>YOUR PROGRESS</div>
                <div className="progress-bar"><div style={{width: s.progress+'%'}}/></div>
              </div>
              <button className="btn btn--ghost" style={{marginTop:18}}>Explore →</button>
            </aside>
          </article>
        ))}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------
// Subject detail page
// -----------------------------------------------------------------
window.SubjectDetailPage = function SubjectDetailPage({ navigate, subjectId }) {
  const data = window.GVP_DATA;
  const subject = data.subjects.find(s => s.id === subjectId) || data.subjects[1];

  return (
    <div className="page page-fade pad-x">
      <div className="breadcrumb mono">
        <a onClick={() => navigate('/subjects')}>Subjects</a>
        <span>›</span>
        <span>{subject.name}</span>
      </div>
      <header className="page-header">
        <div className="rubric">Subject</div>
        <h1 className="page-title">{subject.name}</h1>
        <p style={{maxWidth:'62ch', color:'var(--ink-soft)', fontSize:17}}>{subject.blurb}</p>
        <div className="page-header__meta mono">
          <span>~{subject.gateMarks} marks · GATE ECE</span>
          <span>·</span>
          <span>{subject.conceptCount} concepts in V1</span>
          <span>·</span>
          <span>your progress · {subject.progress}%</span>
        </div>
      </header>
      <hr className="rule"/>

      <div className="concept-grid">
        {subject.concepts.map((c, i) => (
          <article key={c.id} className={`concept-card ${c.hero ? 'is-hero' : ''}`}
                   onClick={() => navigate(`/subjects/${subject.id}/${c.id}`)}>
            <div className="concept-card__top">
              <div className="mono concept-card__num">{String(i+1).padStart(2,'0')}</div>
              <div className="concept-card__stars mono" title={`GATE frequency: ${c.stars}/5`}>
                {'★'.repeat(c.stars)}<span style={{color:'var(--ink-faint)'}}>{'★'.repeat(5-c.stars)}</span>
              </div>
            </div>
            <h3 className="concept-card__name">{c.name.replace(/^[^·]+· /, '')}</h3>
            {c.hero && <div className="pill pill--accent" style={{marginTop:6}}>★ Hero concept · benchmark</div>}
            <div className="concept-card__foot mono">
              <span>{c.status === 'mastered' ? '✓ Mastered' : c.status === 'attempted' ? '· in-progress' : '· not started'}</span>
              <span>5 tabs ›</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
