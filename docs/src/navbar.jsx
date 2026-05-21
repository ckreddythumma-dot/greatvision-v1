// =================================================================
// Right-side persistent navbar — vertical, with bottom user
// =================================================================
const { useState: useStateNav } = React;

window.RightNavbar = function RightNavbar({ route, navigate, user, isLoggedIn, onSignOut, density }) {
  const items = [
    { id: 'home',     label: 'Home',     to: '/',         icon: 'home' },
    { id: 'subjects', label: 'Subjects', to: '/subjects', icon: 'book' },
    { id: 'progress', label: 'Progress', to: '/progress', icon: 'chart',  soon: true },
    { id: 'pyqs',     label: 'PYQ Bank', to: '/pyqs', icon: 'file' },
    { id: 'practice', label: 'Practice', to: '/practice/lab', icon: 'lab' },
  ];

  const isActive = (to) => {
    if (to === '/') return route === '/';
    return route.startsWith(to);
  };

  const [openMenu, setOpenMenu] = useStateNav(false);

  return (
    <aside className="rnav">
      <div className="rnav__brand" title="GateVisionPrep" onClick={() => navigate('/')}>
        <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
          <rect x="2" y="2" width="28" height="28" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <text x="16" y="22" textAnchor="middle" fontFamily="Instrument Serif" fontSize="20" fontStyle="italic" fill="currentColor">G</text>
          <circle cx="24" cy="8" r="2" fill="var(--accent)"/>
        </svg>
      </div>

      <nav className="rnav__list">
        {items.map(it => (
          <button
            key={it.id}
            className={`rnav__item ${isActive(it.to) ? 'is-active' : ''} ${it.soon ? 'is-soon' : ''}`}
            onClick={() => !it.soon && navigate(it.to)}
            title={it.soon ? `${it.label} · coming soon` : it.label}
          >
            <NavIcon name={it.icon}/>
            <span className="rnav__label">{it.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }}/>

      <div className="rnav__user">
        {isLoggedIn ? (
          <>
            <button className="rnav__avatar" onClick={() => setOpenMenu(o => !o)} title={user.handle}>
              <span className="rnav__avatar-initials">{user.initials}</span>
              <span className="rnav__avatar-dot"/>
            </button>
            {openMenu && (
              <div className="rnav__menu">
                <div className="rnav__menu-header">
                  <div className="serif" style={{fontSize: 18}}>{user.handle}</div>
                  <div className="mono" style={{fontSize: 11, color:'var(--ink-mute)'}}>{user.email}</div>
                  <div className="mono" style={{fontSize: 10, color:'var(--ink-mute)', marginTop:4}}>{user.cohort}</div>
                </div>
                <hr className="rule"/>
                <button className="rnav__menu-item" onClick={() => { setOpenMenu(false); navigate('/subjects'); }}>My subjects</button>
                <button className="rnav__menu-item" onClick={() => { setOpenMenu(false); onSignOut(); }}>Sign out</button>
              </div>
            )}
          </>
        ) : (
          <button className="rnav__signin" onClick={() => navigate('/auth')} title="Sign in">
            <NavIcon name="login"/>
            <span className="rnav__label">Sign in</span>
          </button>
        )}
      </div>
    </aside>
  );
};

function NavIcon({ name }) {
  const common = { width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':  return <svg viewBox="0 0 24 24" {...common}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>;
    case 'book':  return <svg viewBox="0 0 24 24" {...common}><path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4z"/><path d="M20 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/></svg>;
    case 'chart': return <svg viewBox="0 0 24 24" {...common}><path d="M4 20V8"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>;
    case 'file':  return <svg viewBox="0 0 24 24" {...common}><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>;
    case 'lab':   return <svg viewBox="0 0 24 24" {...common}><path d="M9 3v6L4 19a2 2 0 002 2h12a2 2 0 002-2L15 9V3"/><path d="M8 3h8"/><path d="M7 14h10"/></svg>;
    case 'login': return <svg viewBox="0 0 24 24" {...common}><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 00-2-2h-7"/></svg>;
    default: return null;
  }
}
