'use client'

export default function CMOSCircuit({ region, showLabels = true }) {
  const isTransition = region === 'region2' || region === 'region3' || region === 'region4'
  const pmosOn = region === 'region1' || region === 'region2' || region === 'region3'
  const nmosOn = region === 'region3' || region === 'region4' || region === 'region5'
  const shortCircuit = region === 'region3'

  const pmosColor = pmosOn ? 'rgba(220,60,60,0.3)' : 'rgba(220,60,60,0.08)'
  const nmosColor = nmosOn ? 'rgba(60,60,220,0.3)' : 'rgba(60,60,220,0.08)'

  return (
    <svg viewBox="0 0 560 420" width="100%" style={{display:'block', maxWidth:'100%'}}>
      {/* V_DD rail */}
      <line x1="280" y1="20" x2="280" y2="50" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="250" y1="20" x2="310" y2="20" stroke="rgba(22,22,19,0.5)" strokeWidth="2"/>

      {/* PMOS body */}
      <rect x="250" y="60" width="60" height="80" fill={pmosColor} stroke="rgba(22,22,19,0.4)" rx="2"/>
      {/* PMOS gate */}
      <line x1="240" y1="70" x2="240" y2="130" stroke="rgba(22,22,19,0.6)" strokeWidth="2.5"/>
      <line x1="248" y1="70" x2="248" y2="130" stroke="rgba(22,22,19,0.5)" strokeWidth="1.5"/>
      {/* PMOS source to VDD */}
      <line x1="280" y1="50" x2="280" y2="60" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      {/* PMOS bubble (indicates PMOS) */}
      <circle cx="244" cy="100" r="4" fill="none" stroke="rgba(22,22,19,0.5)" strokeWidth="1"/>

      {/* Wire from PMOS drain to NMOS drain */}
      <line x1="280" y1="140" x2="280" y2="200" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>

      {/* NMOS body */}
      <rect x="250" y="200" width="60" height="80" fill={nmosColor} stroke="rgba(22,22,19,0.4)" rx="2"/>
      {/* NMOS gate */}
      <line x1="240" y1="210" x2="240" y2="270" stroke="rgba(22,22,19,0.6)" strokeWidth="2.5"/>
      <line x1="248" y1="210" x2="248" y2="270" stroke="rgba(22,22,19,0.5)" strokeWidth="1.5"/>

      {/* NMOS source to GND */}
      <line x1="280" y1="280" x2="280" y2="330" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>

      {/* Ground */}
      <line x1="255" y1="330" x2="305" y2="330" stroke="rgba(22,22,19,0.5)" strokeWidth="2"/>
      <line x1="262" y1="336" x2="298" y2="336" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="269" y1="342" x2="291" y2="342" stroke="rgba(22,22,19,0.3)" strokeWidth="1"/>

      {/* Input line to both gates */}
      <line x1="140" y1="170" x2="240" y2="170" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="240" y1="100" x2="240" y2="240" stroke="rgba(22,22,19,0.3)" strokeWidth="1" strokeDasharray="4,3"/>

      {/* Output node */}
      <line x1="280" y1="170" x2="400" y2="170" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <circle cx="280" cy="170" r="3" fill="rgba(22,22,19,0.5)"/>

      {/* Current flow: VDD to output (PMOS ON) */}
      {pmosOn && Array.from({length: 3}).map((_, i) => (
        <circle key={`p${i}`} r="2.5" fill="rgba(220,60,60,0.6)" opacity="0">
          <animate attributeName="cy" values="50;170"
                   dur="1.2s" repeatCount="indefinite" begin={`${i * 0.35}s`}/>
          <animate attributeName="cx" values="280;280"
                   dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;0.6;0.6;0"
                   dur="1.2s" repeatCount="indefinite" begin={`${i * 0.35}s`}/>
        </circle>
      ))}

      {/* Current flow: output to GND (NMOS ON) */}
      {nmosOn && Array.from({length: 3}).map((_, i) => (
        <circle key={`n${i}`} r="2.5" fill="rgba(60,60,220,0.6)" opacity="0">
          <animate attributeName="cy" values="170;330"
                   dur="1.2s" repeatCount="indefinite" begin={`${i * 0.35}s`}/>
          <animate attributeName="cx" values="280;280"
                   dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;0.6;0.6;0"
                   dur="1.2s" repeatCount="indefinite" begin={`${i * 0.35}s`}/>
        </circle>
      ))}

      {/* Short-circuit current glow (Region 3) */}
      {shortCircuit && (
        <g>
          <line x1="280" y1="50" x2="280" y2="330" stroke="var(--bad)" strokeWidth="2" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="0.6s" repeatCount="indefinite"/>
          </line>
        </g>
      )}

      {/* Labels */}
      {showLabels && (
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="280" y="14" textAnchor="middle" fontSize="11" fill="var(--ink-mute)">V_DD</text>
          <text x="320" y="105" fontSize="10" fill="rgba(220,60,60,0.7)">PMOS</text>
          <text x="320" y="245" fontSize="10" fill="rgba(60,60,220,0.7)">NMOS</text>
          <text x="130" y="165" textAnchor="end" fontSize="10" fill="var(--ink-mute)">V_in</text>
          <text x="410" y="165" fontSize="10" fill="var(--ink-mute)">V_out</text>
          <text x="280" y="356" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">GND</text>
        </g>
      )}

      {/* Status badge */}
      <g>
        <rect x="130" y="370" width="300" height="28" rx="3"
              fill={shortCircuit ? 'var(--bad)' : isTransition ? 'var(--amber)' : 'var(--accent)'}
              opacity="0.12"/>
        <text x="280" y="389" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
              fill={shortCircuit ? 'var(--bad)' : isTransition ? 'var(--amber)' : 'var(--accent)'}
              letterSpacing="0.06em">
          {region === 'region1' ? '▶ PMOS ON · V_out = V_DD' :
           region === 'region2' ? '◆ TRANSITION · V_out dropping' :
           region === 'region3' ? '✗ BOTH SAT · MAX SHORT-CIRCUIT' :
           region === 'region4' ? '◆ TRANSITION · V_out approaching 0' :
           '▶ NMOS ON · V_out = 0'}
        </text>
      </g>
    </svg>
  )
}
