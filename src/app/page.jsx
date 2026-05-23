'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const concepts = [
  {
    id: 'mosfet-iv',
    num: '01',
    title: 'MOSFET I–V Characteristics',
    sub: 'The transistor that runs your phone',
    stars: 5,
    chip: '19 billion on one die',
    tags: ['Hero', '5★ GATE'],
    accent: '#3F3DBE',
  },
  {
    id: 'pn-junction',
    num: '02',
    title: 'PN Junction Diode',
    sub: 'Where current learns to flow one way',
    stars: 4,
    chip: 'Rectification · ESD protection',
    tags: ['Core', '4★ GATE'],
    accent: '#0F7B4F',
  },
  {
    id: 'bjt',
    num: '03',
    title: 'BJT Characteristics',
    sub: 'The original amplifier',
    stars: 4,
    chip: 'Analog front-ends · BiCMOS',
    tags: ['Core', '4★ GATE'],
    accent: '#B0792C',
  },
  {
    id: 'mosfet-amplifier',
    num: '04',
    title: 'MOSFET Amplifier',
    sub: 'From switch to signal',
    stars: 4,
    chip: 'CS/CG/CD · small-signal models',
    tags: ['Core', '4★ GATE'],
    accent: '#6E3EBA',
  },
  {
    id: 'cmos-inverter',
    num: '05',
    title: 'CMOS Inverter',
    sub: 'The building block of all digital logic',
    stars: 5,
    chip: 'VTC · noise margins · power',
    tags: ['Hero', '5★ GATE'],
    accent: '#3F3DBE',
  },
]

const stats = [
  { num: '5', label: 'Concepts', sub: 'Electronic Devices' },
  { num: '25', label: 'Tabs', sub: 'Theory · Viz · Lab · PYQs · Practice' },
  { num: '19B', label: 'Transistors', sub: 'Anchored to Apple A19 Pro' },
  { num: '7y', label: 'GATE Coverage', sub: '2020 → 2026 PYQs' },
]

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

function ConceptCard({ c, index, visible }) {
  return (
    <Link href={`/electronic-devices/${c.id}`} className="concept-card" style={{
      animationDelay: visible ? `${index * 80}ms` : '0ms',
    }}>
      <div className="concept-card__inner" data-visible={visible}>
        <div className="concept-card__num-col">
          <span className="concept-card__num mono">{c.num}</span>
          <span className="concept-card__stars">{'★'.repeat(c.stars)}<span className="empty">{'★'.repeat(5 - c.stars)}</span></span>
        </div>

        <div className="concept-card__body">
          <div className="concept-card__tags">
            {c.tags.map((t, i) => (
              <span key={i} className={`pill ${i === 0 && t === 'Hero' ? 'pill--accent' : ''}`}>{t}</span>
            ))}
          </div>
          <h3 className="concept-card__title serif">{c.title}</h3>
          <p className="concept-card__sub">{c.sub}</p>
        </div>

        <div className="concept-card__meta">
          <span className="mono concept-card__chip">{c.chip}</span>
          <span className="concept-card__arrow">&rarr;</span>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const conceptsRef = useRef(null)
  const ctaRef = useRef(null)

  const heroVisible = useInView(heroRef, 0.1)
  const statsVisible = useInView(statsRef)
  const conceptsVisible = useInView(conceptsRef)
  const ctaVisible = useInView(ctaRef)

  return (
    <main className="landing">
      {/* ─── Hero ─── */}
      <section className="hero" ref={heroRef} data-visible={heroVisible}>
        <div className="hero__grid-bg"/>
        <div className="hero__inner">
          <div className="hero__text">
            <div className="hero__badge mono">
              <span className="hero__badge-dot"/>
              Electronic Devices · GATE ECE 2026
            </div>
            <h1 className="hero__h1 serif">
              Great<em>Vision</em>
            </h1>
            <p className="hero__sub">
              Five Electronic Devices concepts, explained through the lens of the
              Apple&nbsp;A19&nbsp;Pro chip. Interactive theory, live cross-section
              visualizations, lab simulations, and 7&nbsp;years of GATE&nbsp;PYQs.
            </p>
            <div className="hero__actions">
              <Link href="/electronic-devices/mosfet-iv" className="btn btn--primary btn--lg">
                Start with MOSFET I–V &rarr;
              </Link>
              <a href="#concepts" className="btn btn--ghost btn--lg">Browse concepts</a>
            </div>
          </div>
          <div className="hero__chip-col">
            <ChipDieSVG/>
            <div className="hero__chip-label mono">
              <span>Apple A19 Pro · TSMC N3E</span>
              <span>19 billion transistors · 3 nm</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats strip ─── */}
      <section className="stats-strip" ref={statsRef}>
        {stats.map((s, i) => (
          <div key={i} className="stat" data-visible={statsVisible} style={{ animationDelay: `${i * 100}ms` }}>
            <div className="stat__num serif">{s.num}</div>
            <div className="stat__label">{s.label}</div>
            <div className="stat__sub mono">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ─── What's inside ─── */}
      <section className="features-strip">
        <div className="features-strip__inner">
          <div className="eyebrow">What each concept page includes</div>
          <div className="features-grid">
            {[
              { icon: 'I.', label: 'Theory', desc: 'ELI10 + physics + formula sheet. Magazine-style editorial layout.' },
              { icon: 'II.', label: 'Viz', desc: 'Live SVG cross-sections. Drag sliders, watch the device respond.' },
              { icon: 'III.', label: 'Lab', desc: 'Guided problem with spec card, solve interaction, chip-zoom.' },
              { icon: 'IV.', label: 'PYQs', desc: '2020–2026 GATE questions with traps, solutions, frequency chart.' },
              { icon: 'V.', label: 'Practice', desc: 'Concept-check problems with hints, scoring, and explanations.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card__icon serif">{f.icon}</div>
                <div>
                  <div className="feature-card__label">{f.label}</div>
                  <div className="feature-card__desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Concept index ─── */}
      <section className="concepts-section" id="concepts" ref={conceptsRef}>
        <div className="concepts-section__inner">
          <div className="concepts-section__head">
            <div className="eyebrow">Electronic Devices · 5 concepts</div>
            <h2 className="serif concepts-section__h2">
              Every concept a GATE topper needs.
            </h2>
          </div>
          <div className="concept-list">
            {concepts.map((c, i) => (
              <ConceptCard key={c.id} c={c} index={i} visible={conceptsVisible}/>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section" ref={ctaRef} data-visible={ctaVisible}>
        <div className="cta-section__inner">
          <div className="cta-section__text">
            <div className="eyebrow">Start learning</div>
            <h2 className="serif cta-section__h2">
              Begin with the transistor that powers <em>everything</em>.
            </h2>
            <p className="cta-section__sub">
              The MOSFET I–V page is the flagship concept. Five tabs. One chip.
              Understand this, and the rest of Electronic Devices falls into place.
            </p>
          </div>
          <Link href="/electronic-devices/mosfet-iv" className="btn btn--primary btn--lg">
            Open MOSFET I–V &rarr;
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <span className="serif" style={{ fontSize: 22 }}>Great<em>Vision</em></span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }}>
              Interactive concepts for GATE ECE
            </span>
          </div>
          <div className="landing-footer__links mono">
            <span>v1.0</span>
            <span>·</span>
            <span>5 concepts live</span>
            <span>·</span>
            <span>SME reviewed</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
