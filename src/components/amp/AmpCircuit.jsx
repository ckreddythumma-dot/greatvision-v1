'use client'

export default function AmpCircuit({ region, showLabels = true }) {
  const isActive = region !== 'cutoff'
  const gainLevel = region === 'high-gain' ? 3 : region === 'mid-gain' ? 2 : region === 'low-gain' ? 1 : 0
  const signalColor = isActive ? 'var(--accent)' : 'var(--ink-mute)'

  return (
    <svg viewBox="0 0 560 380" width="100%" style={{display:'block', maxWidth:'100%'}}>
      <defs>
        <marker id="amp-arrow" viewBox="0 0 10 10" refX="10" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(22,22,19,0.4)"/>
        </marker>
      </defs>

      {/* V_DD rail */}
      <line x1="280" y1="20" x2="280" y2="60" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="250" y1="20" x2="310" y2="20" stroke="rgba(22,22,19,0.5)" strokeWidth="2"/>

      {/* R_D */}
      <rect x="270" y="60" width="20" height="70" fill="none" stroke="rgba(22,22,19,0.5)" strokeWidth="1.5"/>
      <line x1="275" y1="70" x2="285" y2="80" stroke="rgba(22,22,19,0.3)" strokeWidth="1"/>
      <line x1="275" y1="85" x2="285" y2="95" stroke="rgba(22,22,19,0.3)" strokeWidth="1"/>
      <line x1="275" y1="100" x2="285" y2="110" stroke="rgba(22,22,19,0.3)" strokeWidth="1"/>

      {/* Wire from R_D to drain */}
      <line x1="280" y1="130" x2="280" y2="170" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>

      {/* MOSFET symbol */}
      {/* Gate line */}
      <line x1="180" y1="210" x2="240" y2="210" stroke="rgba(22,22,19,0.5)" strokeWidth="1.5"/>
      {/* Gate plate */}
      <line x1="245" y1="175" x2="245" y2="245" stroke="rgba(22,22,19,0.6)" strokeWidth="2.5"/>
      {/* Channel */}
      <line x1="255" y1="175" x2="255" y2="245" stroke="rgba(22,22,19,0.5)" strokeWidth="1.5"/>
      {/* Drain connection */}
      <line x1="255" y1="180" x2="280" y2="180" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="280" y1="170" x2="280" y2="180" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      {/* Source connection */}
      <line x1="255" y1="240" x2="280" y2="240" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="280" y1="240" x2="280" y2="290" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      {/* Arrow (NMOS) */}
      <line x1="255" y1="210" x2="270" y2="210" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"
            markerEnd="url(#amp-arrow)"/>

      {/* Ground */}
      <line x1="255" y1="290" x2="305" y2="290" stroke="rgba(22,22,19,0.5)" strokeWidth="2"/>
      <line x1="262" y1="296" x2="298" y2="296" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <line x1="269" y1="302" x2="291" y2="302" stroke="rgba(22,22,19,0.3)" strokeWidth="1"/>

      {/* Output node (V_out) */}
      <line x1="280" y1="150" x2="380" y2="150" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
      <circle cx="280" cy="150" r="3" fill="rgba(22,22,19,0.5)"/>

      {/* Input signal (AC wave) */}
      {isActive && (
        <g>
          <path d={`M 100 210 Q 120 ${210 - 8} 140 210 Q 160 ${210 + 8} 180 210`}
                stroke={signalColor} strokeWidth="1.5" fill="none" opacity="0.7">
            <animate attributeName="d"
                     values={`M 100 210 Q 120 ${210 - 8} 140 210 Q 160 ${210 + 8} 180 210;M 100 210 Q 120 ${210 + 8} 140 210 Q 160 ${210 - 8} 180 210;M 100 210 Q 120 ${210 - 8} 140 210 Q 160 ${210 + 8} 180 210`}
                     dur="1s" repeatCount="indefinite"/>
          </path>
        </g>
      )}

      {/* Output signal (amplified, inverted) */}
      {isActive && (
        <g>
          <path d={`M 380 150 Q 400 ${150 + gainLevel * 10} 420 150 Q 440 ${150 - gainLevel * 10} 460 150`}
                stroke={signalColor} strokeWidth="1.5" fill="none" opacity="0.7">
            <animate attributeName="d"
                     values={`M 380 150 Q 400 ${150 + gainLevel * 10} 420 150 Q 440 ${150 - gainLevel * 10} 460 150;M 380 150 Q 400 ${150 - gainLevel * 10} 420 150 Q 440 ${150 + gainLevel * 10} 460 150;M 380 150 Q 400 ${150 + gainLevel * 10} 420 150 Q 440 ${150 - gainLevel * 10} 460 150`}
                     dur="1s" repeatCount="indefinite"/>
          </path>
        </g>
      )}

      {/* Current flow indicator */}
      {isActive && Array.from({length: 4}).map((_, i) => (
        <circle key={`id${i}`} r="2.5" fill={signalColor} opacity="0">
          <animate attributeName="cy" values="130;250"
                   dur="1.4s" repeatCount="indefinite" begin={`${i * 0.3}s`}/>
          <animate attributeName="cx" values="280;280"
                   dur="1.4s" repeatCount="indefinite" begin={`${i * 0.3}s`}/>
          <animate attributeName="opacity" values="0;0.6;0.6;0"
                   dur="1.4s" repeatCount="indefinite" begin={`${i * 0.3}s`}/>
        </circle>
      ))}

      {/* Labels */}
      {showLabels && (
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="280" y="14" textAnchor="middle" fontSize="11" fill="var(--ink-mute)">V_DD</text>
          <text x="300" y="100" fontSize="10" fill="var(--ink-mute)">R_D</text>
          <text x="220" y="205" textAnchor="end" fontSize="10" fill="var(--ink-mute)">G</text>
          <text x="290" y="175" fontSize="10" fill="var(--ink-mute)">D</text>
          <text x="290" y="255" fontSize="10" fill="var(--ink-mute)">S</text>
          <text x="100" y="200" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">v_in (AC)</text>
          <text x="420" y="140" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">v_out</text>
          <text x="280" y="310" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">GND</text>
        </g>
      )}

      {/* Status badge */}
      <g>
        <rect x="130" y="330" width="300" height="28" rx="3"
              fill={isActive ? 'var(--accent)' : 'var(--ink-mute)'}
              opacity="0.12"/>
        <text x="280" y="349" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
              fill={isActive ? 'var(--accent)' : 'var(--ink-mute)'}
              letterSpacing="0.06em">
          {region === 'cutoff' ? '— CUTOFF · A_v = 0' :
           region === 'low-gain' ? '▶ LOW GAIN · A_v = −g_m·R_D (small)' :
           region === 'mid-gain' ? '▶ MID GAIN · A_v = −g_m·R_D (moderate)' :
           '▶ HIGH GAIN · A_v = −g_m·R_D (large)'}
        </text>
      </g>
    </svg>
  )
}
