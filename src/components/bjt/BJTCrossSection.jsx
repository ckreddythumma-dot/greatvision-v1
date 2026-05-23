'use client'

export default function BJTCrossSection({ region, showLabels = true }) {
  const showCarriers = region === 'active' || region === 'saturation'
  const carrierSpeed = region === 'active' ? '1.2s' : '0.8s'
  const carrierColor = region === 'active' ? 'var(--accent)' : 'var(--ok)'

  return (
    <svg viewBox="0 0 560 340" width="100%" style={{display:'block', maxWidth:'100%'}}>
      <defs>
        <pattern id="bjt-nDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2" fill="rgba(60,60,220,0.25)"/>
        </pattern>
        <pattern id="bjt-pDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2" fill="rgba(220,60,60,0.25)"/>
        </pattern>
      </defs>

      {/* Emitter (n+) */}
      <rect x="40" y="60" width="150" height="180" fill="#D8D8F5" stroke="rgba(22,22,19,0.4)"/>
      <rect x="40" y="60" width="150" height="180" fill="url(#bjt-nDots)"/>

      {/* Base (p, thin) */}
      <rect x="190" y="60" width="80" height="180" fill="#F5D8D8" stroke="rgba(22,22,19,0.4)"/>
      <rect x="190" y="60" width="80" height="180" fill="url(#bjt-pDots)"/>

      {/* Collector (n) */}
      <rect x="270" y="60" width="250" height="180" fill="#D8D8F5" stroke="rgba(22,22,19,0.4)"/>
      <rect x="270" y="60" width="250" height="180" fill="url(#bjt-nDots)"/>

      {/* BE junction depletion */}
      <rect x="182" y="60" width="16" height="180" fill="rgba(22,22,19,0.06)" stroke="rgba(22,22,19,0.2)" strokeDasharray="3,3"/>

      {/* BC junction depletion */}
      <rect x="262" y="60" width={region === 'active' ? 16 : 8} height="180"
            fill="rgba(22,22,19,0.06)" stroke="rgba(22,22,19,0.2)" strokeDasharray="3,3"/>

      {/* Carrier flow: electrons E→B→C */}
      {showCarriers && Array.from({length: 8}).map((_, i) => (
        <circle key={`e${i}`} r="3" fill={carrierColor} opacity="0">
          <animate attributeName="cx" values="130;230;400"
                   dur={carrierSpeed} repeatCount="indefinite" begin={`${i * 0.14}s`}/>
          <animate attributeName="cy"
                   values={`${120 + (i % 4) * 16};${130 + ((i+1) % 4) * 12};${125 + (i % 3) * 18}`}
                   dur="0.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;0.7;0.7;0.7;0"
                   dur={carrierSpeed} repeatCount="indefinite" begin={`${i * 0.14}s`}/>
        </circle>
      ))}

      {/* Base recombination (small fraction) */}
      {region === 'active' && [0,1].map(i => (
        <circle key={`r${i}`} cx={210 + i * 30} cy={140 + i * 30} r="4"
                fill="var(--amber)" opacity="0.3">
          <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite" begin={`${i * 0.8}s`}/>
          <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" begin={`${i * 0.8}s`}/>
        </circle>
      ))}

      {/* Saturation glow */}
      {region === 'saturation' && (
        <g>
          <rect x="40" y="60" width="480" height="180" fill="none"
                stroke="var(--ok)" strokeWidth="2" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.2s" repeatCount="indefinite"/>
          </rect>
        </g>
      )}

      {/* Contacts */}
      <rect x="20" y="120" width="20" height="60" fill="#C4BBAA" stroke="rgba(22,22,19,0.5)"/>
      <rect x="215" y="30" width="30" height="30" fill="#C4BBAA" stroke="rgba(22,22,19,0.5)"/>
      <rect x="520" y="120" width="20" height="60" fill="#C4BBAA" stroke="rgba(22,22,19,0.5)"/>

      {/* Contact wires */}
      <line x1="30" y1="120" x2="30" y2="100" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="230" y1="60" x2="230" y2="30" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="530" y1="120" x2="530" y2="100" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>

      {/* Labels */}
      {showLabels && (
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="115" y="55" textAnchor="middle" letterSpacing="0.06em">n+ (Emitter)</text>
          <text x="230" y="55" textAnchor="middle" letterSpacing="0.06em">p (Base)</text>
          <text x="395" y="55" textAnchor="middle" letterSpacing="0.06em">n (Collector)</text>
          <text x="30" y="95" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">E</text>
          <text x="230" y="22" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">B</text>
          <text x="530" y="95" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">C</text>
          <text x="190" y="270" textAnchor="middle" fontSize="8" fill="var(--ink-mute)" letterSpacing="0.08em">
            BE JUNCTION
          </text>
          <text x="270" y="270" textAnchor="middle" fontSize="8" fill="var(--ink-mute)" letterSpacing="0.08em">
            BC JUNCTION
          </text>
        </g>
      )}

      {/* Status badge */}
      <g>
        <rect x="170" y="290" width="220" height="28" rx="3"
              fill={region === 'active' ? 'var(--accent)' : region === 'saturation' ? 'var(--ok)' : 'var(--ink-mute)'}
              opacity="0.12"/>
        <text x="280" y="309" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
              fill={region === 'active' ? 'var(--accent)' : region === 'saturation' ? 'var(--ok)' : 'var(--ink-mute)'}
              letterSpacing="0.06em">
          {region === 'active' ? '▶ ACTIVE · I_C = β × I_B' :
           region === 'saturation' ? '✓ SATURATION · V_CE ≈ 0.2V' :
           '— CUTOFF · I_C = 0'}
        </text>
      </g>
    </svg>
  )
}
