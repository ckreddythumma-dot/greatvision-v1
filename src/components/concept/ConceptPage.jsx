'use client'
import { useState, useEffect } from 'react'
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

function ConceptTopbar({ subject, concept, tabs, activeTab, onTab, tags = [] }) {
  return (
    <header className="concept-top">
      <div className="concept-top__inner">
        <div className="concept-top__row">
          <div className="breadcrumb mono">
            <span>Subjects</span>
            <span>&rsaquo;</span>
            <span>{subject.shortName}</span>
            <span>&rsaquo;</span>
            <span>{concept.shortName}</span>
          </div>
          <div className="concept-top__meta">
            <span className="stars">
              {'★'.repeat(concept.stars)}
              <span className="empty">{'★'.repeat(5 - concept.stars)}</span>
            </span>
            <span className="mono" style={{fontSize:11, color:'var(--ink-mute)', marginLeft:8}}>GATE frequency</span>
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
              <div className="cside__item-num mono">{String(i+1).padStart(2,'0')}</div>
              <div className="cside__item-name">{c.shortName}</div>
              <div className="cside__item-stars mono">{'★'.repeat(c.stars)}</div>
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
  }

  const m = conceptData

  return (
    <div className="concept-page">
      <ConceptTopbar subject={subject} concept={concept}
                     tabs={tabDefs} activeTab={activeTab} onTab={handleTab} tags={tags}/>

      <div className={`concept-layout ${activeTab === 'lab' ? 'concept-layout--lab' : ''}`}>
        {(activeTab === 'theory' || activeTab === 'pyqs' || activeTab === 'practice') && (
          <ConceptSidebar subject={subject} concept={concept}/>
        )}
        {activeTab === 'viz' && VizSidebar && <VizSidebar subject={subject}/>}

        <main className="concept-main" role="main">
          {activeTab === 'theory'   && TheoryTab && <TheoryTab m={m}/>}
          {activeTab === 'viz'      && VizTab && <VizTab/>}
          {activeTab === 'lab'      && LabTab && <LabTab m={m}/>}
          {activeTab === 'pyqs'     && <PYQsTab m={m}/>}
          {activeTab === 'practice' && <PracticeTab m={m}/>}
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
