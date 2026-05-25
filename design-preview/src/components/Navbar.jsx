'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )},
  { href: '/subjects', label: 'Subjects', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      <line x1="9" y1="7" x2="16" y2="7"/>
      <line x1="9" y1="11" x2="14" y2="11"/>
    </svg>
  )},
  { href: '/feedback', label: 'Feedback', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )},
]

export default function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav className="rnav">
        <Link href="/" className="rnav__logo" style={{ textDecoration: 'none' }}>
          Gv
        </Link>

        <div className="rnav__links">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`rnav__link ${pathname === item.href ? 'is-active' : ''}`}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </div>

        <div className="rnav__user" title="Rahul K">RK</div>
      </nav>

      <button
        className="mobile-nav-toggle"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div
        className={`mobile-nav-drawer ${drawerOpen ? 'is-open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          className="mobile-nav-drawer__panel"
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span className="eyebrow" style={{ color: 'var(--accent)' }}>NAVIGATION</span>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--ink-mute)' }}
              aria-label="Close navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-drawer__link ${pathname === item.href ? 'is-active' : ''}`}
              onClick={() => setDrawerOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="rnav__user" style={{ width: 32, height: 32, fontSize: 10 }}>RK</div>
            <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>Rahul K</span>
          </div>
        </div>
      </div>
    </>
  )
}
