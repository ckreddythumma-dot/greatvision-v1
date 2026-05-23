import Link from 'next/link'

const concepts = [
  {
    id: 'mosfet-iv',
    title: 'MOSFET I-V Characteristics',
    sub: 'The transistor that runs your phone',
    status: 'live',
  },
  {
    id: 'pn-junction',
    title: 'PN Junction Diode',
    sub: 'Where current learns to flow one way',
    status: 'live',
  },
  {
    id: 'bjt',
    title: 'BJT Characteristics',
    sub: 'The original amplifier',
    status: 'live',
  },
  {
    id: 'mosfet-amplifier',
    title: 'MOSFET Amplifier',
    sub: 'From switch to signal',
    status: 'live',
  },
  {
    id: 'cmos-inverter',
    title: 'CMOS Inverter',
    sub: 'The building block of all digital logic',
    status: 'live',
  },
]

export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Great<em>Vision</em>
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '1.125rem', maxWidth: '42ch' }}>
          Interactive Electronic Devices concepts for GATE, anchored to the Apple A19 Pro chip.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1px', background: 'var(--rule)' }}>
        {concepts.map(c => (
          <div key={c.id} style={{ background: 'var(--paper)', padding: '24px 20px' }}>
            {c.status === 'live' ? (
              <Link href={`/electronic-devices/${c.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                  <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>{c.title}</h2>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ok)', letterSpacing: '0.08em' }}>LIVE</span>
                </div>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: 0 }}>{c.sub}</p>
              </Link>
            ) : (
              <div style={{ opacity: 0.45 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                  <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>{c.title}</h2>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '0.08em' }}>COMING</span>
                </div>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: 0 }}>{c.sub}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mono" style={{ color: 'var(--ink-mute)', fontSize: 11, marginTop: 32, letterSpacing: '0.04em' }}>
        5 concepts · theory + visualization + lab + practice + PYQs
      </p>
    </main>
  )
}
