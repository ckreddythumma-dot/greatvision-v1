'use client'

export default function ChipZoom() {
  return (
    <div className="chipzoom">
      <div className="chipzoom__stage">
        <div className="chipzoom__die">
          <div className="chipzoom__die-grid"/>
          <div className="chipzoom__die-label mono">A19 PRO · TSMC N3E · 3 nm</div>
          <div className="chipzoom__die-marker"/>
        </div>
        <svg className="chipzoom__line" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="50" x2="100" y2="50" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="2 2"/>
        </svg>
        <div className="chipzoom__close">
          <svg viewBox="0 0 200 140" width="100%">
            <rect x="20" y="30" width="160" height="80" fill="#F0EBDE" stroke="var(--ink-mute)" strokeWidth="1"/>
            <rect x="32" y="62" width="22" height="16" fill="#D9D2BF" stroke="var(--ink-mute)"/>
            <rect x="146" y="62" width="22" height="16" fill="#D9D2BF" stroke="var(--ink-mute)"/>
            <rect x="70" y="52" width="60" height="10" fill="white" stroke="var(--ink-mute)"/>
            <rect x="70" y="36" width="60" height="14" fill="url(#gh)" stroke="var(--ink)"/>
            <defs>
              <pattern id="gh" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="var(--ink)" strokeWidth="1"/>
              </pattern>
            </defs>
            <text x="100" y="22" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)">1 of 19,000,000,000</text>
            <text x="100" y="128" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="16" fill="var(--ink)">— a single MOSFET —</text>
          </svg>
        </div>
        <div className="chipzoom__captions">
          <span className="mono">DIE · 110 mm²</span>
          <span className="mono" style={{color:'var(--accent)'}}>&#x2193; ZOOM ~ 10⁷×</span>
          <span className="mono">CHANNEL · ~3 nm</span>
        </div>
      </div>
    </div>
  )
}
