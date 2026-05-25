'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import WaterTapAnalogy from '@/components/WaterTapAnalogy'
import ChipZoom from '@/components/ChipZoom'
import { SUBJECTS } from '@/data/mosfet'

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('is-visible'); obs.unobserve(el) } },
      { threshold: 0.15, rootMargin: '-40px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function RevealDiv({ children, className = '', style, delay = 0 }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return visible
}

function ChipDieSVG() {
  return (
    <svg viewBox="0 0 280 280" className="hero-chip" aria-label="Chip die illustration">
      <defs>
        <linearGradient id="die-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16161a"/>
          <stop offset="0.5" stopColor="#2a2a2f"/>
          <stop offset="1" stopColor="#1a1a1e"/>
        </linearGradient>
        <pattern id="die-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
        </pattern>
        <filter id="die-glow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* die body */}
      <rect x="20" y="20" width="240" height="240" rx="4" fill="url(#die-bg)" stroke="rgba(255,255,255,0.1)"/>
      <rect x="20" y="20" width="240" height="240" rx="4" fill="url(#die-grid)"/>

      {/* bond pads */}
      {[0,1,2,3,4,5,6].map(i => (
        <g key={`t${i}`}>
          <rect x={50 + i * 28} y="8" width="12" height="16" rx="1" fill="rgba(255,255,255,0.12)"/>
          <rect x={50 + i * 28} y="256" width="12" height="16" rx="1" fill="rgba(255,255,255,0.12)"/>
          <rect x="8" y={50 + i * 28} width="16" height="12" rx="1" fill="rgba(255,255,255,0.12)"/>
          <rect x="256" y={50 + i * 28} width="16" height="12" rx="1" fill="rgba(255,255,255,0.12)"/>
        </g>
      ))}

      {/* logic blocks */}
      <rect x="40" y="40" width="80" height="50" rx="2" fill="rgba(63,61,190,0.15)" stroke="rgba(63,61,190,0.3)"/>
      <text x="80" y="70" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(63,61,190,0.7)" letterSpacing="0.1em">CPU CORE</text>

      <rect x="130" y="40" width="110" height="50" rx="2" fill="rgba(15,123,79,0.15)" stroke="rgba(15,123,79,0.3)"/>
      <text x="185" y="70" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(15,123,79,0.7)" letterSpacing="0.1em">GPU</text>

      <rect x="40" y="100" width="200" height="40" rx="2" fill="rgba(176,121,44,0.12)" stroke="rgba(176,121,44,0.25)"/>
      <text x="140" y="125" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(176,121,44,0.7)" letterSpacing="0.1em">NEURAL ENGINE · 16-CORE</text>

      <rect x="40" y="150" width="95" height="90" rx="2" fill="rgba(110,62,186,0.12)" stroke="rgba(110,62,186,0.25)"/>
      <text x="88" y="200" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(110,62,186,0.6)" letterSpacing="0.1em">SRAM</text>

      <rect x="145" y="150" width="95" height="42" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
      <text x="192" y="175" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(255,255,255,0.3)" letterSpacing="0.1em">ISP</text>

      <rect x="145" y="200" width="95" height="40" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
      <text x="192" y="225" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="rgba(255,255,255,0.3)" letterSpacing="0.1em">5G MODEM</text>

      {/* scanning line */}
      <line x1="20" y1="0" x2="20" y2="280" stroke="var(--accent)" strokeWidth="1" opacity="0.3">
        <animate attributeName="x1" values="20;260;20" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="x2" values="20;260;20" dur="4s" repeatCount="indefinite"/>
      </line>

      {/* pulse markers */}
      <circle cx="80" cy="65" r="4" fill="none" stroke="var(--accent)" strokeWidth="1">
        <animate attributeName="r" values="2;8;2" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

const stats = [
  { num: '5', label: 'Concepts', sub: 'Electronic Devices' },
  { num: '25', label: 'Tabs', sub: 'Theory · Viz · Lab · PYQs · Practice' },
  { num: '19B', label: 'Transistors', sub: 'Anchored to Apple A19 Pro' },
  { num: '7y', label: 'GATE Coverage', sub: '2020 → 2026 PYQs' },
]

export default function LandingPage() {
  const statsRef = useRef(null)
  const statsVisible = useInView(statsRef)

  return (
    <>
      <Navbar />
      <div className="page-shell">
        {/* ── Hero ── */}
        <section className="hero-section" style={{ minHeight: '100dvh', display: 'grid', gap: 40, alignItems: 'center', padding: '0 80px 0 80px' }}>
          <div>
            <RevealDiv>
              <div className="eyebrow" style={{ marginBottom: 32, color: 'var(--accent)' }}>
                GATEVISIONPREP · V1 BETA · GATE ECE 2027
              </div>
            </RevealDiv>

            <RevealDiv delay={80}>
              <h1 className="serif" style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 400, lineHeight: 1.05, marginBottom: 32 }}>
                Understand{' '}
                <span style={{ fontStyle: 'italic' }}>GATE.</span>
                <br />
                Don't just memorise it.
              </h1>
            </RevealDiv>

            <RevealDiv delay={160}>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink-mute)', maxWidth: '50ch', marginBottom: 40 }}>
                Five layers per concept: a 10-year-old explanation, the physics, a live animation
                you push around, an Apple A19 Pro engineering problem you might fail, and the
                GATE questions that have asked the same thing for seven years running.
              </p>
            </RevealDiv>

            <RevealDiv delay={240}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Link href="/concept/mosfet-iv" className="btn btn--primary" style={{ fontSize: 15, padding: '14px 28px' }}>
                  Start with MOSFET
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <a href="#how" className="btn btn--ghost" style={{ fontSize: 15, padding: '14px 28px' }}>
                  See how it works
                </a>
              </div>
            </RevealDiv>

            <RevealDiv delay={320}>
              <p className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 40, letterSpacing: '0.04em' }}>
                50 GATE ECE 2027 aspirants in the feedback cohort.
              </p>
            </RevealDiv>
          </div>

          <RevealDiv delay={200}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <ChipDieSVG />
              <div>
                <p className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.06em', marginBottom: 8 }}>APPLE A19 PRO · TSMC N3E</p>
                <p className="serif" style={{ fontSize: 20, fontStyle: 'italic', color: 'var(--ink-mute)', lineHeight: 1.4 }}>
                  19 billion transistors.<br/>
                  Each one a MOSFET you can simulate.
                </p>
              </div>
            </div>
          </RevealDiv>
        </section>

        {/* ── Stats Strip ── */}
        <section className="stats-strip" ref={statsRef}>
          {stats.map((s, i) => (
            <div key={i} className={`stat ${statsVisible ? 'is-visible' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="stat__num">{s.num}</div>
              <div className="stat__label">{s.label}</div>
              <div className="stat__sub mono">{s.sub}</div>
            </div>
          ))}
        </section>

        {/* ── How it works ── */}
        <section id="how" className="section-gap section-responsive" style={{ padding: '64px 80px' }}>
          <RevealDiv>
            <p className="eyebrow" style={{ marginBottom: 16, color: 'var(--teal)' }}>02 · THE FLOW</p>
            <h2 className="serif" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', maxWidth: '20ch', marginBottom: 40 }}>
              One concept.<br />Five layers of understanding.
            </h2>
          </RevealDiv>

          <div className="flow-grid" style={{ display: 'grid', gap: 1, background: 'var(--rule)' }}>
            {[
              { num: '01', name: 'Theory', desc: 'Build intuition from scratch. ELI10 first, then physics, then formulas.', color: 'var(--sienna)' },
              { num: '02', name: 'Viz', desc: 'See parameters change the device in real time. Drag, type, watch.', color: 'var(--teal)' },
              { num: '03', name: 'Lab', desc: 'Solve a real Apple A19 Pro engineering problem. Fail visibly.', color: 'var(--accent)' },
              { num: '04', name: 'PYQs', desc: 'GATE 2020 to 2026 questions. Full solutions. Traps called out.', color: 'var(--warn)' },
              { num: '05', name: 'Practice', desc: '5 problems per concept. Mastery score tracked. Hints cost points.', color: 'var(--ok)' },
            ].map((step, i) => (
              <RevealDiv key={step.num} delay={i * 80} style={{ background: 'var(--paper)', padding: '40px 28px' }}>
                <span className="serif" style={{ fontSize: 32, fontStyle: 'italic', color: step.color, lineHeight: 1 }}>{step.num}</span>
                <h3 style={{ fontSize: 18, fontWeight: 500, margin: '16px 0 12px' }}>{step.name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink-mute)' }}>{step.desc}</p>
              </RevealDiv>
            ))}
          </div>
        </section>

        {/* ── Features: What each tab includes ── */}
        <section className="features-strip">
          <RevealDiv>
            <div className="eyebrow" style={{ color: 'var(--sienna)' }}>WHAT EACH CONCEPT PAGE INCLUDES</div>
          </RevealDiv>
          <div className="features-grid">
            {[
              { icon: 'I.', label: 'Theory', desc: 'ELI10 + physics + formula sheet. Magazine-style editorial layout.' },
              { icon: 'II.', label: 'Viz', desc: 'Live SVG cross-sections. Drag sliders, watch the device respond.' },
              { icon: 'III.', label: 'Lab', desc: 'Guided problem with spec card, solve interaction, chip-zoom.' },
              { icon: 'IV.', label: 'PYQs', desc: '2020-2026 GATE questions with traps, solutions, frequency chart.' },
              { icon: 'V.', label: 'Practice', desc: 'Concept-check problems with hints, scoring, and explanations.' },
            ].map((f, i) => (
              <RevealDiv key={i} delay={i * 60}>
                <div className="feature-card">
                  <div className="feature-card__icon">{f.icon}</div>
                  <div>
                    <div className="feature-card__label">{f.label}</div>
                    <div className="feature-card__desc">{f.desc}</div>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </section>

        {/* ── Water Tap Analogy Preview ── */}
        <section className="section-gap section-responsive" style={{ padding: '64px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'start' }} className="anchor-grid">
            <RevealDiv>
              <p className="eyebrow" style={{ marginBottom: 16, color: 'var(--sienna)' }}>03 · THE ANALOGY</p>
              <h2 className="serif" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: 24 }}>
                A MOSFET is a tiny electric tap.
              </h2>
              <div style={{ maxWidth: '45ch' }}>
                <p className="serif" style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--ink-mute)', marginBottom: 16 }}>
                  The gate is the knob. Turn it past the threshold voltage and water (current) starts flowing from source to drain.
                </p>
                <p className="serif" style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--ink-mute)', marginBottom: 16 }}>
                  Turn it more and flow increases. But at some point, the pipe itself limits the flow. That is saturation.
                </p>
                <p className="serif" style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--sienna)', marginTop: 24 }}>
                  Click the buttons below the tap to see each region.
                </p>
              </div>
            </RevealDiv>
            <RevealDiv delay={120}>
              <WaterTapAnalogy />
            </RevealDiv>
          </div>
        </section>

        {/* ── Chip Zoom: Die to Transistor ── */}
        <section className="section-gap section-responsive" style={{ padding: '64px 80px' }}>
          <div className="anchor-grid" style={{ display: 'grid', gap: 80, alignItems: 'center' }}>
            <RevealDiv>
              <p className="eyebrow" style={{ marginBottom: 16, color: 'var(--teal)' }}>04 · REAL-WORLD ANCHOR</p>
              <h2 className="serif" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: 24 }}>
                From die to transistor.
              </h2>
              <div style={{ maxWidth: '55ch' }}>
                {[
                  'TSMC\'s N3E process. 3nm gate length.',
                  'Apple\'s A19 Pro: 19 billion transistors.',
                  'Each one switching 3.78 billion times per second.',
                  'Threshold voltage: ~0.3V. Oxide breakdown: 1.2V.',
                ].map((line, i) => (
                  <p key={i} className="serif" style={{
                    fontSize: 24 - i * 1.5,
                    lineHeight: 1.45,
                    marginBottom: 16,
                    color: i === 0 ? 'var(--ink)' : 'var(--ink-mute)',
                  }}>
                    {line}
                  </p>
                ))}
                <p className="serif" style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--sienna)', marginTop: 32 }}>
                  This is the MOSFET you are about to simulate.
                </p>
              </div>
            </RevealDiv>
            <RevealDiv delay={120}>
              <ChipZoom />
            </RevealDiv>
          </div>
        </section>

        {/* ── Subjects ── */}
        <section className="section-gap section-responsive" style={{ padding: '64px 80px' }}>
          <RevealDiv>
            <p className="eyebrow" style={{ marginBottom: 16, color: 'var(--accent)' }}>05 · V1 SCOPE</p>
            <h2 className="serif" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: 40 }}>
              3 subjects. 15 gold-standard concepts.
            </h2>
          </RevealDiv>

          <div className="subjects-grid" style={{ display: 'grid', gap: 24 }}>
            {SUBJECTS.map((s, i) => {
              const accents = ['var(--teal)', 'var(--sienna)', 'var(--accent)']
              const accentSofts = ['var(--teal-soft)', 'var(--sienna-soft)', 'var(--accent-soft)']
              return (
                <RevealDiv key={s.id} delay={i * 100}>
                  <div style={{
                    padding: '36px 32px',
                    border: '1px solid var(--rule)',
                    borderRadius: 10,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 500 }}>{s.title}</h3>
                      <span className="pill" style={{ borderColor: accents[i], color: accents[i], background: accentSofts[i] }}>{s.weight}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--ink-mute)', lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                      {s.concepts.map(c => (
                        <span key={c.id} className={c.hero ? 'pill pill--teal' : 'pill'}>
                          {c.title.split('(')[0].trim()}
                          {c.hero && ' *'}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <Link href="/subjects" className="btn btn--ghost" style={{ fontSize: 13, padding: '8px 16px' }}>
                        Explore
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </RevealDiv>
              )
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section section-responsive">
          <RevealDiv>
            <div className="cta-section__text">
              <p className="eyebrow" style={{ marginBottom: 16, color: 'var(--teal)' }}>START LEARNING</p>
              <h2 className="serif" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', marginBottom: 20 }}>
                Begin with the transistor that powers <span style={{ fontStyle: 'italic' }}>everything</span>.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-mute)', maxWidth: '50ch' }}>
                The MOSFET I-V page is the flagship concept. Five tabs. One chip.
                Understand this, and the rest of Electronic Devices falls into place.
              </p>
            </div>
          </RevealDiv>
          <RevealDiv delay={120}>
            <Link href="/concept/mosfet-iv" className="btn btn--primary" style={{ fontSize: 15, padding: '14px 28px' }}>
              Open MOSFET I-V
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </RevealDiv>
        </section>

        {/* ── Footer ── */}
        <footer className="footer-responsive" style={{ padding: '64px 80px', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.04em' }}>
            GATEVISIONPREP V1 · GATE ECE 2027 · AI-ASSISTED CONTENT, REVIEWED FOR ACCURACY
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms'].map(l => (
              <a key={l} href="#" className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', textDecoration: 'none', letterSpacing: '0.04em' }}>{l}</a>
            ))}
            <Link href="/feedback" className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', textDecoration: 'none', letterSpacing: '0.04em' }}>Feedback</Link>
          </div>
        </footer>
      </div>
    </>
  )
}
