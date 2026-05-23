'use client'

export default function AmpLabViz({ outcome }) {
  const isActive = outcome === 'correct' || outcome === 'wrong-value'
  const signalColor = outcome === 'correct' ? 'var(--accent)' : 'var(--amber)'

  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 320" width="100%">
        {/* MOSFET body */}
        <rect x="180" y="100" width="120" height="120" fill="#E6E6F5" stroke="rgba(22,22,19,0.4)" rx="2"/>

        {/* Gate */}
        <rect x="160" y="140" width="20" height="40" fill="#C4BBAA" stroke="rgba(22,22,19,0.4)"/>
        <line x1="100" y1="160" x2="160" y2="160" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>

        {/* Drain wire up to R_D */}
        <line x1="240" y1="60" x2="240" y2="100" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
        <rect x="230" y="30" width="20" height="30" fill="none" stroke="rgba(22,22,19,0.5)" strokeWidth="1.5"/>

        {/* Source wire down */}
        <line x1="240" y1="220" x2="240" y2="260" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>

        {/* Output wire */}
        <line x1="240" y1="80" x2="380" y2="80" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
        <circle cx="240" cy="80" r="3" fill="rgba(22,22,19,0.5)"/>

        {/* Input signal */}
        {isActive && (
          <path d="M 60 160 Q 75 148 90 160 Q 105 172 120 160"
                stroke={signalColor} strokeWidth="1.5" fill="none" opacity="0.7">
            <animate attributeName="d"
                     values="M 60 160 Q 75 148 90 160 Q 105 172 120 160;M 60 160 Q 75 172 90 160 Q 105 148 120 160;M 60 160 Q 75 148 90 160 Q 105 172 120 160"
                     dur="1s" repeatCount="indefinite"/>
          </path>
        )}

        {/* Output signal (amplified) */}
        {isActive && (
          <path d={`M 360 80 Q 385 ${outcome === 'correct' ? 50 : 65} 410 80 Q 435 ${outcome === 'correct' ? 110 : 95} 460 80`}
                stroke={signalColor} strokeWidth="1.5" fill="none" opacity="0.7">
            <animate attributeName="d"
                     values={`M 360 80 Q 385 ${outcome === 'correct' ? 50 : 65} 410 80 Q 435 ${outcome === 'correct' ? 110 : 95} 460 80;M 360 80 Q 385 ${outcome === 'correct' ? 110 : 95} 410 80 Q 435 ${outcome === 'correct' ? 50 : 65} 460 80;M 360 80 Q 385 ${outcome === 'correct' ? 50 : 65} 410 80 Q 435 ${outcome === 'correct' ? 110 : 95} 460 80`}
                     dur="1s" repeatCount="indefinite"/>
          </path>
        )}

        {/* Cutoff: no signal */}
        {outcome === 'too-low' && (
          <g>
            <text x="240" y="170" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
              NO GAIN
            </text>
            <line x1="180" y1="160" x2="300" y2="160" stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="3,3"/>
          </g>
        )}

        {/* Clipping: distortion */}
        {outcome === 'too-high' && (
          <g>
            <rect x="180" y="100" width="120" height="120" fill="none"
                  stroke="var(--bad)" strokeWidth="2" opacity="0.4">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <text x="240" y="170" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--bad)" letterSpacing="0.08em">
              CLIPPING
            </text>
          </g>
        )}

        {/* Correct glow */}
        {outcome === 'correct' && (
          <rect x="180" y="100" width="120" height="120" fill="none"
                stroke="var(--accent)" strokeWidth="2" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.2s" repeatCount="indefinite"/>
          </rect>
        )}

        {/* Labels */}
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="240" y="24" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">V_DD</text>
          <text x="260" y="50" fontSize="9" fill="var(--ink-mute)">R_D</text>
          <text x="150" y="155" textAnchor="end" fontSize="9" fill="var(--ink-mute)">G</text>
          <text x="250" y="96" fontSize="9" fill="var(--ink-mute)">D</text>
          <text x="250" y="235" fontSize="9" fill="var(--ink-mute)">S</text>
          <text x="80" y="148" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">v_in</text>
          <text x="410" y="70" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">v_out</text>
        </g>

        {/* Status badge */}
        {outcome && (
          <g>
            <rect x="130" y="278" width="220" height="28" rx="3"
                  fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong-value' ? 'var(--amber)' : 'var(--bad)'}
                  opacity="0.12"/>
            <text x="240" y="297" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                  fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong-value' ? 'var(--amber)' : 'var(--bad)'}
                  letterSpacing="0.06em">
              {outcome === 'correct' ? '✓ |A_v| = 8.00 · GAIN CORRECT' :
               outcome === 'too-low' ? '✗ GAIN TOO LOW · WEAK SIGNAL' :
               outcome === 'too-high' ? '✗ GAIN TOO HIGH · CLIPPING' :
               '✗ WRONG VALUE · CHECK g_m'}
            </text>
          </g>
        )}

        {!outcome && (
          <text x="240" y="297" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                fill="var(--ink-mute)" letterSpacing="0.06em">
            AWAITING |A_v| INPUT…
          </text>
        )}
      </svg>
    </div>
  )
}
