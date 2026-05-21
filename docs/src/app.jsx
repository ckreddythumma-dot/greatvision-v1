// =================================================================
// App — router + auth state + tweaks
// =================================================================
const { useState: aUseState, useEffect: aUseEffect, useMemo: aUseMemo } = React;

// ---- hash router ----
function parseHash() {
  const h = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, qs] = h.split('?');
  const params = Object.fromEntries(new URLSearchParams(qs || ''));
  const segs = pathPart.split('/').filter(Boolean);
  return { path: '/' + segs.join('/'), segs, params };
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "indigo",
  "density": "comfortable",
  "loggedIn": true,
  "labOutcome": "auto",
  "vizRegion": "free"
}/*EDITMODE-END*/;

// map accent name <-> hex (used for TweakColor swatches)
const ACCENT_HEX = {
  indigo:  '#3F3DBE',
  emerald: '#0F6B47',
  amber:   '#A35A00',
  violet:  '#6B2BC9',
};
const HEX_TO_ACCENT = Object.fromEntries(Object.entries(ACCENT_HEX).map(([k,v]) => [v.toLowerCase(), k]));

function App() {
  // ----- router state -----
  const [hash, setHash] = aUseState(parseHash());
  aUseEffect(() => {
    const onHash = () => setHash(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (to) => {
    window.location.hash = to.startsWith('#') ? to : ('#' + to);
  };

  // ----- tweaks state -----
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply tweaks to document
  aUseEffect(() => {
    document.documentElement.dataset.accent = t.accent;
    document.documentElement.dataset.density = t.density;
  }, [t.accent, t.density]);

  // logged-in is derived from tweak
  const isLoggedIn = !!t.loggedIn;

  const onSignIn = () => setTweak('loggedIn', true);
  const onSignOut = () => setTweak('loggedIn', false);

  // ----- dispatch route -----
  const { segs, params } = hash;
  let page;

  if (segs.length === 0) {
    page = <LandingPage navigate={navigate}/>;
  } else if (segs[0] === 'auth') {
    page = <AuthPage navigate={navigate} onSignIn={onSignIn}/>;
  } else if (segs[0] === 'subjects' && segs.length === 1) {
    page = <SubjectsPage navigate={navigate}/>;
  } else if (segs[0] === 'subjects' && segs.length === 2) {
    page = <SubjectDetailPage navigate={navigate} subjectId={segs[1]}/>;
  } else if (segs[0] === 'subjects' && segs.length >= 3) {
    page = <ConceptPage
      navigate={navigate}
      subjectId={segs[1]}
      conceptId={segs[2]}
      initialTab={params.tab}
      isLoggedIn={isLoggedIn}
      onSignIn={onSignIn}
      labOutcome={t.labOutcome}
      vizForceRegion={t.vizRegion === 'free' ? null : t.vizRegion}
    />;
  } else if (segs[0] === 'pyqs' && segs[1] === 'viz') {
    page = <PYQVizPage navigate={navigate}/>;
  } else if (segs[0] === 'pyqs') {
    page = <PYQBankPage navigate={navigate}/>;
  } else if (segs[0] === 'practice') {
    page = <PracticeLabPage navigate={navigate} isLoggedIn={isLoggedIn} onSignIn={onSignIn}/>;
  } else {
    page = <NotFound navigate={navigate}/>;
  }

  // ----- chrome -----
  const showNav = segs[0] !== 'auth';

  // current accent hex for the color picker
  const currentHex = ACCENT_HEX[t.accent] || ACCENT_HEX.indigo;
  const onAccentHex = (hex) => {
    const name = HEX_TO_ACCENT[String(hex).toLowerCase()] || 'indigo';
    setTweak('accent', name);
  };

  return (
    <div className="app-shell" style={{ gridTemplateColumns: showNav ? `1fr var(--nav-w)` : '1fr' }}>
      <main className="app-main">
        {page}
      </main>
      {showNav && (
        <RightNavbar
          route={hash.path}
          navigate={navigate}
          user={window.GVP_DATA.user}
          isLoggedIn={isLoggedIn}
          onSignOut={onSignOut}
          density={t.density}
        />
      )}

      {/* Tweaks panel — uses the starter */}
      <TweaksPanel title="Tweaks · GateVisionPrep">
        <TweakSection label="Aesthetic">
          <TweakColor
            label="Accent"
            value={currentHex}
            options={[ACCENT_HEX.indigo, ACCENT_HEX.emerald, ACCENT_HEX.amber, ACCENT_HEX.violet]}
            onChange={onAccentHex}
          />
          <TweakRadio
            label="Density"
            value={t.density}
            options={[
              { value: 'comfortable', label: 'Roomy' },
              { value: 'compact',     label: 'Compact' },
            ]}
            onChange={v => setTweak('density', v)}
          />
        </TweakSection>

        <TweakSection label="State">
          <TweakRadio
            label="Auth"
            value={t.loggedIn ? 'in' : 'out'}
            options={[
              { value: 'in',  label: 'Signed in' },
              { value: 'out', label: 'Logged out' },
            ]}
            onChange={v => setTweak('loggedIn', v === 'in')}
          />
        </TweakSection>

        <TweakSection label="MOSFET demo">
          <TweakSelect
            label="Viz region"
            value={t.vizRegion}
            options={[
              { value: 'free',       label: 'Free interaction' },
              { value: 'cutoff',     label: 'Force · Cutoff' },
              { value: 'threshold',  label: 'Force · Threshold' },
              { value: 'linear',     label: 'Force · Linear' },
              { value: 'saturation', label: 'Force · Saturation' },
            ]}
            onChange={v => setTweak('vizRegion', v)}
          />
          <TweakSelect
            label="Lab outcome"
            value={t.labOutcome}
            options={[
              { value: 'auto',       label: 'Use my answer' },
              { value: 'correct',    label: 'Force · Correct' },
              { value: 'cutoff',     label: 'Force · Cutoff (dead)' },
              { value: 'breakdown',  label: 'Force · Oxide breakdown' },
            ]}
            onChange={v => setTweak('labOutcome', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function NotFound({ navigate }) {
  return (
    <div className="page pad-x page-fade" style={{minHeight: '60vh', display: 'grid', placeItems: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <div className="serif" style={{fontSize: 120, lineHeight: 1, fontStyle: 'italic', color: 'var(--accent)'}}>404</div>
        <p className="serif" style={{fontSize: 28, maxWidth: '28ch'}}>This page <em>does not exist</em> — yet.</p>
        <button className="btn btn--primary" style={{marginTop: 24}} onClick={() => navigate('/')}>Back home</button>
      </div>
    </div>
  );
}

// ---- mount ----
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
