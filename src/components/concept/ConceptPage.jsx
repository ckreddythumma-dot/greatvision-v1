'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import DefaultPYQsTab from './PYQsTab'
import DefaultPracticeTab from './PracticeTab'

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft:6}}>
      <rect x="5" y="11" width="14" height="10" rx="1"/>
      <path d="M8 11V8a4 4 0 018 0v3"/>
    </svg>
  )
}

function MobileConceptNav({ subject, concept, open, onClose }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className={`mobile-nav-overlay ${open ? 'is-open' : ''}`} onClick={onClose}/>
      <nav className={`mobile-nav-drawer ${open ? 'is-open' : ''}`}>
        <div className="mobile-nav-drawer__head">
          <div className="rubric">{subject.shortName}</div>
          <div className="serif" style={{fontSize:18, marginTop:4}}>{subject.conceptCount} concepts</div>
          <button className="mobile-nav-drawer__close" onClick={onClose} aria-label="Close navigation">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <ul className="mobile-nav-drawer__list">
          {subject.concepts.map((c, i) => {
            const active = c.id === concept.id
            return (
              <li key={c.id}>
                <Link href={`/electronic-devices/${c.id}`}
                      className={`mobile-nav-drawer__item ${active ? 'is-active' : ''}`}
                      onClick={onClose}>
                  <span className="mono" style={{fontSize:11, color:'var(--ink-mute)', minWidth:24}}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{flex:1}}>{c.shortName}</span>
                  <span className="stars" style={{fontSize:9}}>{'★'.repeat(c.stars)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <div style={{padding:'16px 20px', borderTop:'1px solid var(--rule)'}}>
          <Link href="/" className="btn btn--ghost" style={{width:'100%', textAlign:'center', fontSize:12}} onClick={onClose}>
            &larr; Back to home
          </Link>
        </div>
      </nav>
    </>
  )
}

function ConceptTopbar({ subject, concept, tabs, activeTab, onTab, tags = [], onOpenNav }) {
  return (
    <header className="concept-top">
      <div className="concept-top__inner">
        <div className="concept-top__row">
          <div className="breadcrumb mono">
            <Link href="/" style={{color:'inherit'}}>Home</Link>
            <span>&rsaquo;</span>
            <span>{subject.shortName}</span>
            <span>&rsaquo;</span>
            <span>{concept.shortName}</span>
          </div>
          <div className="concept-top__meta">
            <button className="mobile-nav-toggle" onClick={onOpenNav} aria-label="Open concept navigation">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
              <span className="mono" style={{fontSize:10}}>Concepts</span>
            </button>
            <span className="stars">
              {'★'.repeat(concept.stars)}
              <span className="empty">{'★'.repeat(5 - concept.stars)}</span>
            </span>
            <span className="mono concept-top__freq-label" style={{fontSize:11, color:'var(--ink-mute)', marginLeft:8}}>GATE frequency</span>
          </div>
        </div>
        <div className="concept-top__title">
          <div>
            <div className="eyebrow">{subject.name} · Hero concept</div>
            <h1 className="concept-top__h1">{concept.name}</h1>
            <div className="concept-top__tags">
              {tags.map((t, i) => (
                <span key={i} className={`pill ${i === tags.length - 1 ? 'pill--accent' : ''}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        {tabs && (
          <nav className="concept-tabs" role="tablist">
            {tabs.map(t => (
              <button key={t.id} role="tab" aria-selected={activeTab === t.id}
                      className={`concept-tab ${activeTab === t.id ? 'is-active' : ''} ${t.locked ? 'is-locked' : ''}`}
                      onClick={() => onTab(t)}>
                <span>{t.label}</span>
                {t.locked && <LockIcon/>}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function ConceptSidebar({ subject, concept }) {
  return (
    <aside className="cside">
      <div className="cside__head">
        <div className="rubric">{subject.shortName}</div>
        <div className="cside__head-title serif">{subject.conceptCount} concepts</div>
      </div>
      <ul className="cside__list">
        {subject.concepts.map((c, i) => {
          const active = c.id === concept.id
          return (
            <li key={c.id} className={`cside__item ${active ? 'is-active' : ''}`}>
              <Link href={`/electronic-devices/${c.id}`} className="cside__item-link">
                <div className="cside__item-num mono">{String(i+1).padStart(2,'0')}</div>
                <div className="cside__item-name">{c.shortName}</div>
                <div className="cside__item-stars mono">{'★'.repeat(c.stars)}</div>
              </Link>
            </li>
          )
        })}
      </ul>
      <hr className="rule" style={{margin:'18px 0'}}/>
      <div className="cside__sme">
        <div className="mono" style={{fontSize:10, letterSpacing:'0.06em', color:'var(--ink-mute)'}}>SME REVIEWED</div>
        <div className="serif" style={{fontSize:14, marginTop:4}}>Dr. K. Iyer · IISc Bangalore</div>
        <div className="mono" style={{fontSize:10, color:'var(--ink-mute)', marginTop:2}}>v 1.0 · 12 May 2026</div>
      </div>
    </aside>
  )
}

function AuthGateModal({ tabName, onDismiss }) {
  return (
    <div className="auth-overlay" onClick={onDismiss}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="eyebrow">Sign in required</div>
        <h2 className="serif" style={{fontSize:28, margin:'8px 0 12px'}}>
          Unlock <em>{tabName}</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:14, maxWidth:'36ch'}}>
          Create a free account to access Labs, PYQs, and Practice problems.
        </p>
        <div style={{display:'flex', gap:12, marginTop:20}}>
          <button className="btn btn--primary">Sign in with Google</button>
          <button className="btn btn--ghost" onClick={onDismiss}>Maybe later</button>
        </div>
      </div>
    </div>
  )
}

export default function ConceptPage({
  subject, concept, conceptData,
  TheoryTab, VizTab, LabTab,
  PYQsTab = DefaultPYQsTab, PracticeTab = DefaultPracticeTab,
  VizSidebar, LabSidebar,
  tags,
}) {
  const [activeTab, setActiveTab] = useState('theory')
  const [authGateFor, setAuthGateFor] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [tabKey, setTabKey] = useState(0)
  const mainRef = useRef(null)

  const isLoggedIn = true

  const tabDefs = [
    { id: 'theory',   label: 'Theory',   locked: false },
    { id: 'viz',      label: 'Viz',      locked: false },
    { id: 'lab',      label: 'Lab',      locked: !isLoggedIn },
    { id: 'pyqs',     label: 'PYQs',     locked: !isLoggedIn },
    { id: 'practice', label: 'Practice', locked: !isLoggedIn },
  ]

  const handleTab = (t) => {
    if (t.locked) { setAuthGateFor(t.label); return }
    setActiveTab(t.id)
    setTabKey(k => k + 1)
  }

  const m = conceptData

  return (
    <div className="concept-page">
      <ConceptTopbar subject={subject} concept={concept}
                     tabs={tabDefs} activeTab={activeTab} onTab={handleTab} tags={tags}
                     onOpenNav={() => setMobileNavOpen(true)}/>

      <MobileConceptNav subject={subject} concept={concept}
                        open={mobileNavOpen} onClose={() => setMobileNavOpen(false)}/>

      <div className={`concept-layout ${activeTab === 'lab' ? 'concept-layout--lab' : ''}`}>
        {(activeTab === 'theory' || activeTab === 'pyqs' || activeTab === 'practice') && (
          <ConceptSidebar subject={subject} concept={concept}/>
        )}
        {activeTab === 'viz' && VizSidebar && <VizSidebar subject={subject}/>}

        <main className="concept-main" role="main" ref={mainRef}>
          <div key={tabKey} className="concept-main__content">
            {activeTab === 'theory'   && TheoryTab && <TheoryTab m={m}/>}
            {activeTab === 'viz'      && VizTab && <VizTab/>}
            {activeTab === 'lab'      && LabTab && <LabTab m={m}/>}
            {activeTab === 'pyqs'     && <PYQsTab m={m}/>}
            {activeTab === 'practice' && <PracticeTab m={m}/>}
          </div>
        </main>

        {activeTab === 'lab' && LabSidebar && <LabSidebar/>}
      </div>

      {authGateFor && (
        <AuthGateModal tabName={authGateFor}
                       onDismiss={() => setAuthGateFor(null)}/>
      )}
    </div>
  )
}
