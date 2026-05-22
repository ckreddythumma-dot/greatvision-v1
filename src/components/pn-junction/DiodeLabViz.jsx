'use client'

export default function DiodeLabViz({ outcome }) {
  const showFlow = outcome === 'correct' || outcome === 'wrong-value'
  const flowColor = outcome === 'correct' ? 'var(--accent)' : 'var(--amber)'

  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 320" width="100%">
        {/* p-type region */}
        <rect x="40" y="80" width="170" height="160" fill="#F5E6E6" stroke="rgba(22,22,19,0.4)"/>
        <rect x="40" y="80" width="170" height="160" fill="rgba(220,60,60,0.06)"/>

        {/* n-type region */}
        <rect x="270" y="80" width="170" height="160" fill="#E6E6F5" stroke="rgba(22,22,19,0.4)"/>
        <rect x="270" y="80" width="170" height="160" fill="rgba(60,60,220,0.06)"/>

        {/* depletion region */}
        <rect x="210" y="80" width="60" height="160"
              fill={outcome === 'correct' ? 'rgba(22,22,19,0.03)' : outcome === 'too-high' ? 'rgba(220,60,60,0.1)' : 'rgba(22,22,19,0.06)'}
              stroke="rgba(22,22,19,0.3)" strokeDasharray="4,3"/>

        {/* fixed charges */}
        {[0,1,2].map(i => (
          <g key={i}>
            <text x={215 + i * 8} y={140 + i * 20} fontSize="12" fill="rgba(220,60,60,0.5)" fontWeight="bold">−</text>
            <text x={245 + i * 8} y={130 + i * 22} fontSize="12" fill="rgba(60,60,220,0.5)" fontWeight="bold">+</text>
          </g>
        ))}

        {/* carrier flow for correct/wrong-value */}
        {showFlow && (
          <g>
            {Array.from({length: 6}).map((_, i) => (
              <circle key={`e${i}`} r="3" fill={flowColor} opacity="0">
                <animate attributeName="cx" values="350;130"
                         dur={outcome === 'correct' ? '1.2s' : '2s'}
                         repeatCount="indefinite" begin={`${i * 0.18}s`}/>
                <animate attributeName="cy"
                         values={`${130 + (i % 3) * 18};${140 + ((i+1) % 3) * 14};${130 + (i % 3) * 18}`}
                         dur="0.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;0.7;0.7;0"
                         dur={outcome === 'correct' ? '1.2s' : '2s'}
                         repeatCount="indefinite" begin={`${i * 0.18}s`}/>
              </circle>
            ))}
          </g>
        )}

        {/* too-low: wide depletion, no flow */}
        {outcome === 'too-low' && (
          <g>
            <text x="240" y="165" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
              LEAKING
            </text>
            <line x1="210" y1="160" x2="270" y2="160" stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="3,3"/>
          </g>
        )}

        {/* too-high: sparks, breakdown */}
        {outcome === 'too-high' && (
          <g>
            <path d="M 225 90 L 235 130 L 220 150 L 240 190 L 225 220"
                  stroke="var(--bad)" strokeWidth="2" fill="none">
              <animate attributeName="opacity" values="0;1;0.3;1" dur="0.5s" repeatCount="indefinite"/>
            </path>
            <path d="M 255 95 L 248 135 L 260 160 L 245 200 L 258 225"
                  stroke="var(--bad)" strokeWidth="2" fill="none">
              <animate attributeName="opacity" values="0.3;1;0;1" dur="0.4s" repeatCount="indefinite"/>
            </path>
            <circle cx="240" cy="155" r="8" fill="var(--bad)" opacity="0">
              <animate attributeName="r" values="4;22;8" dur="0.6s" fill="freeze"/>
              <animate attributeName="opacity" values="0;0.5;0.2" dur="0.6s" fill="freeze"/>
            </circle>
          </g>
        )}

        {/* correct: glow */}
        {outcome === 'correct' && (
          <rect x="210" y="80" width="60" height="160" fill="none"
                stroke="var(--accent)" strokeWidth="2" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.2s" repeatCount="indefinite"/>
          </rect>
        )}

        {/* terminal labels */}
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="120" y="75" textAnchor="middle">p-type</text>
          <text x="360" y="75" textAnchor="middle">n-type</text>
          <text x="240" y="270" textAnchor="middle" fontSize="9" fill="var(--ink-mute)">DEPLETION REGION</text>
        </g>

        {/* status badge */}
        {outcome && (
          <g>
            <rect x="130" y="278" width="220" height="28" rx="3"
                  fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong-value' ? 'var(--amber)' : 'var(--bad)'}
                  opacity="0.12"/>
            <text x="240" y="297" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                  fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong-value' ? 'var(--amber)' : 'var(--bad)'}
                  letterSpacing="0.06em">
              {outcome === 'correct' ? '✓ V_bi = 0.80 V · ESD CLAMP READY' :
               outcome === 'too-low' ? '✗ V_bi TOO LOW · DIODE LEAKS' :
               outcome === 'too-high' ? '✗ V_bi TOO HIGH · LATE ACTIVATION' :
               '✗ WRONG VALUE · MISCALIBRATED'}
            </text>
          </g>
        )}

        {/* idle state */}
        {!outcome && (
          <g>
            <text x="240" y="297" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                  fill="var(--ink-mute)" letterSpacing="0.06em">
              AWAITING V_bi INPUT…
            </text>
            <rect x="210" y="80" width="60" height="160" fill="none" stroke="var(--rule)" strokeDasharray="6,4"/>
          </g>
        )}
      </svg>
    </div>
  )
}
