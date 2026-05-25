'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TheoryTab from '@/components/TheoryTab'
import BJTViz from '@/components/BJTViz'
import GenericLabTab from '@/components/GenericLabTab'
import PYQsTab from '@/components/PYQsTab'
import PracticeTab from '@/components/PracticeTab'
import BJTAnalogy from '@/components/BJTAnalogy'
import { BJT_THEORY, BJT_LAB, BJT_PYQS, BJT_PRACTICE, BJT_INSIGHT } from '@/data/bjt'
import { SUBJECTS } from '@/data/mosfet'

const TABS = ['Theory', 'Viz', 'Lab', 'PYQs', 'Practice']
const concepts = SUBJECTS[0].concepts

const conceptRoutes = {
  'mosfet-iv': '/concept/mosfet-iv',
  'pn-junction': '/concept/pn-junction',
  'bjt': '/concept/bjt',
  'mosfet-amp': '/concept/mosfet-amp',
  'cmos-inv': '/concept/cmos-inv',
}

export default function BJTPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <Navbar />
      <div className="page-shell" style={{ display: 'flex', minHeight: '100dvh' }}>
        <aside className="csidebar">
          <div className="csidebar__head">
            <div className="eyebrow" style={{ marginBottom: 4 }}>Devices</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>5 concepts</div>
          </div>

          {concepts.map((c, i) => (
            <Link key={c.id} href={conceptRoutes[c.id] || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`csidebar__item ${c.id === 'bjt' ? 'is-active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', width: 16 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{c.title}</span>
                </div>
                <span className="csidebar__stars">{'*'.repeat(c.stars)}</span>
              </div>
            </Link>
          ))}

          <div style={{ marginTop: 48, paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.06em', marginBottom: 4 }}>
              SME REVIEWED
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Dr. K. Iyer</div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>IISc Bangalore</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>v 1.0 &middot; 12 May 2026</div>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="concept-header" style={{ padding: '32px 48px 0', borderBottom: '1px solid var(--rule)' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 12, letterSpacing: '0.04em' }}>
              <Link href="/subjects" style={{ color: 'var(--ink-mute)', textDecoration: 'none' }}>Subjects</Link>
              {' > '}
              <span style={{ color: 'var(--ink-mute)' }}>Devices</span>
              {' > '}
              <span>BJT Characteristics</span>
            </div>

            <div className="concept-title-area" style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8, color: 'var(--accent)' }}>
                  ELECTRONIC DEVICES &middot; CORE CONCEPT
                </div>
                <h1 className="serif" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, lineHeight: 1.1 }}>
                  BJT Characteristics
                </h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8 }}>
                <span className="csidebar__stars" style={{ fontSize: 13 }}>****</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>GATE frequency</span>
              </div>
            </div>

            <div className="concept-tags" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              <span className="pill pill--teal">ECE Core</span>
              <span className="pill">1-2 marks</span>
              <span className="pill pill--accent">NAT + MCQ</span>
              <span className="pill pill--warn">Appears in 5/7 GATE papers</span>
            </div>

            <div className="tabs">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  className={`tab ${i === activeTab ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                  {i >= 2 && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                         style={{ marginLeft: 4, opacity: 0.4 }}>
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="concept-main" style={{ padding: '0 48px 80px' }} key={activeTab}>
            {activeTab === 0 && <TheoryTab theory={BJT_THEORY} Analogy={BJTAnalogy} />}
            {activeTab === 1 && <BJTViz />}
            {activeTab === 2 && <GenericLabTab lab={BJT_LAB} concept="bjt" />}
            {activeTab === 3 && <PYQsTab pyqs={BJT_PYQS} insight={BJT_INSIGHT} conceptTitle="BJT" />}
            {activeTab === 4 && <PracticeTab practice={BJT_PRACTICE} conceptTitle="BJT" />}
          </div>
        </main>
      </div>
    </>
  )
}
