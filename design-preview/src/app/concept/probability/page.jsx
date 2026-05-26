'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TheoryTab from '@/components/TheoryTab'
import ProbabilityViz from '@/components/ProbabilityViz'
import GenericLabTab from '@/components/GenericLabTab'
import PYQsTab from '@/components/PYQsTab'
import PracticeTab from '@/components/PracticeTab'
import { PROB_THEORY, PROB_LAB, PROB_PYQS, PROB_PRACTICE, PROB_INSIGHT } from '@/data/probability'
import { SUBJECTS } from '@/data/mosfet'

const TABS = ['Theory', 'Viz', 'Lab', 'PYQs', 'Practice']
const concepts = SUBJECTS[1].concepts

const conceptRoutes = {
  'linear-algebra': '/concept/linear-algebra',
  'calculus': '/concept/calculus',
  'diff-eq': '/concept/diff-eq',
  'laplace': '/concept/laplace',
  'probability': '/concept/probability',
}

export default function ProbabilityPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [hasNavigated, setHasNavigated] = useState(false)

  return (
    <>
      <Navbar />
      <div className="page-shell" style={{ display: 'flex', minHeight: '100dvh' }}>
        <aside className="csidebar">
          <div className="csidebar__head">
            <div className="eyebrow" style={{ marginBottom: 4 }}>Eng. Mathematics</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>5 concepts</div>
          </div>
          {concepts.map((c, i) => (
            <Link key={c.id} href={conceptRoutes[c.id] || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`csidebar__item ${c.id === 'probability' ? 'is-active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', width: 16 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{c.title}</span>
                </div>
                <span className="csidebar__stars">{'*'.repeat(c.stars)}</span>
              </div>
            </Link>
          ))}
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="concept-header" style={{ padding: '32px 48px 0', borderBottom: '1px solid var(--rule)' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 12, letterSpacing: '0.04em' }}>
              <Link href="/subjects" style={{ color: 'var(--ink-mute)', textDecoration: 'none' }}>Subjects</Link>{' > '}<span style={{ color: 'var(--ink-mute)' }}>Mathematics</span>{' > '}<span>Probability & Statistics</span>
            </div>
            <div className="concept-title-area" style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8, color: 'var(--sienna)' }}>ENGINEERING MATHEMATICS &middot; CORE CONCEPT</div>
                <h1 className="serif" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, lineHeight: 1.1 }}>Probability & Statistics</h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8 }}>
                <span className="csidebar__stars" style={{ fontSize: 13 }}>****</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>GATE frequency</span>
              </div>
            </div>
            <div className="concept-tags" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <span className="pill pill--teal">ECE Core</span><span className="pill">2 marks</span><span className="pill pill--accent">NAT + MCQ</span><span className="pill pill--warn">Appears in 5/7 GATE papers</span>
            </div>
            <div className="tabs">
              {TABS.map((tab, i) => (
                <button key={tab} className={`tab ${i === activeTab ? 'is-active' : ''} ${i === 1 && !hasNavigated ? 'tab--attention' : ''}`} onClick={() => { setActiveTab(i); if (i > 0) setHasNavigated(true) }}>
                  {tab}
                  {i >= 2 && (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4, opacity: 0.4 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>)}
                </button>
              ))}
            </div>
          </div>
          {!hasNavigated && activeTab === 0 && (
            <div className="tab-hint-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Click the <strong>Viz</strong> tab above for interactive demos, or explore <strong>Lab</strong>, <strong>PYQs</strong>, and <strong>Practice</strong></span>
              <button className="tab-hint-dismiss" onClick={() => setHasNavigated(true)}>got it</button>
            </div>
          )}
          <div className="concept-main" style={{ padding: '0 48px 80px' }} key={activeTab}>
            {activeTab === 0 && <TheoryTab theory={PROB_THEORY} />}
            {activeTab === 1 && <ProbabilityViz />}
            {activeTab === 2 && <GenericLabTab lab={PROB_LAB} concept="probability" />}
            {activeTab === 3 && <PYQsTab pyqs={PROB_PYQS} insight={PROB_INSIGHT} conceptTitle="Probability & Statistics" />}
            {activeTab === 4 && <PracticeTab practice={PROB_PRACTICE} conceptTitle="Probability & Statistics" />}
          </div>
        </main>
      </div>
    </>
  )
}
