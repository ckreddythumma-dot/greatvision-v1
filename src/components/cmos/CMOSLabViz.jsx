'use client'

export default function CMOSLabViz({ outcome }) {
  const isCorrect = outcome === 'correct'
  const showCircuit = outcome === 'correct' || outcome === 'wrong-value'

  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 320" width="100%">
        {/* PMOS */}
        <rect x="190" y="50" width="100" height="60" fill={isCorrect ? 'rgba(220,60,60,0.2)' : 'rgba(220,60,60,0.08)'}
              stroke="rgba(22,22,19,0.4)" rx="2"/>
        {/* NMOS */}
        <rect x="190" y="170" width="100" height="60" fill={isCorrect ? 'rgba(60,60,220,0.2)' : 'rgba(60,60,220,0.08)'}
              stroke="rgba(22,22,19,0.4)" rx="2"/>

        {/* Wire between */}
        <line x1="240" y1="110" x2="240" y2="170" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
        {/* Output */}
        <line x1="240" y1="140" x2="370" y2="140" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
        <circle cx="240" cy="140" r="3" fill="rgba(22,22,19,0.5)"/>

        {/* VDD */}
        <line x1="240" y1="20" x2="240" y2="50" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
        <line x1="210" y1="20" x2="270" y2="20" stroke="rgba(22,22,19,0.5)" strokeWidth="2"/>

        {/* GND */}
        <line x1="240" y1="230" x2="240" y2="260" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>
        <line x1="215" y1="260" x2="265" y2="260" stroke="rgba(22,22,19,0.5)" strokeWidth="2"/>
        <line x1="222" y1="266" x2="258" y2="266" stroke="rgba(22,22,19,0.4)" strokeWidth="1.5"/>

        {/* Symmetric indicator */}
        {isCorrect && (
          <g>
            <line x1="310" y1="80" x2="310" y2="200" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>
            <text x="320" y="145" fontFamily="JetBrains Mono" fontSize="9" fill="var(--accent)">symmetric</text>
          </g>
        )}

        {/* Asymmetric indicator */}
        {outcome === 'too-low' && (
          <g>
            <rect x="190" y="50" width="100" height="60" fill="none" stroke="var(--bad)" strokeWidth="1.5" opacity="0.5"/>
            <text x="240" y="145" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
              PMOS WEAK
            </text>
          </g>
        )}

        {outcome === 'too-high' && (
          <g>
            <rect x="190" y="170" width="100" height="60" fill="none" stroke="var(--bad)" strokeWidth="1.5" opacity="0.5"/>
            <text x="240" y="145" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--bad)" letterSpacing="0.08em">
              PMOS TOO STRONG
            </text>
          </g>
        )}

        {/* Correct glow */}
        {isCorrect && (
          <g>
            <rect x="185" y="45" width="110" height="195" fill="none"
                  stroke="var(--accent)" strokeWidth="2" opacity="0.4" rx="4">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.2s" repeatCount="indefinite"/>
            </rect>
          </g>
        )}

        {/* Labels */}
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="240" y="14" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">V_DD</text>
          <text x="300" y="85" fontSize="10" fill="rgba(220,60,60,0.6)">PMOS</text>
          <text x="300" y="205" fontSize="10" fill="rgba(60,60,220,0.6)">NMOS</text>
          <text x="380" y="135" fontSize="9" fill="var(--ink-mute)">V_out</text>
          <text x="240" y="278" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">GND</text>
        </g>

        {/* Status badge */}
        {outcome && (
          <g>
            <rect x="110" y="278" width="260" height="28" rx="3"
                  fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong-value' ? 'var(--amber)' : 'var(--bad)'}
                  opacity="0.12"/>
            <text x="240" y="297" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                  fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong-value' ? 'var(--amber)' : 'var(--bad)'}
                  letterSpacing="0.06em">
              {outcome === 'correct' ? '✓ (W/L)_p = 5.00 · SYMMETRIC' :
               outcome === 'too-low' ? '✗ TOO SMALL · PMOS WEAK' :
               outcome === 'too-high' ? '✗ TOO LARGE · PMOS TOO STRONG' :
               '✗ WRONG VALUE · CHECK RATIO'}
            </text>
          </g>
        )}

        {!outcome && (
          <text x="240" y="297" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                fill="var(--ink-mute)" letterSpacing="0.06em">
            AWAITING (W/L)_p INPUT…
          </text>
        )}
      </svg>
    </div>
  )
}
