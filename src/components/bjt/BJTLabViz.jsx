'use client'

export default function BJTLabViz({ outcome }) {
  const showFlow = outcome === 'correct' || outcome === 'wrong-value'
  const flowColor = outcome === 'correct' ? 'var(--accent)' : 'var(--amber)'

  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 320" width="100%">
        {/* Emitter (n+) */}
        <rect x="40" y="80" width="120" height="160" fill="#D8D8F5" stroke="rgba(22,22,19,0.4)"/>
        <rect x="40" y="80" width="120" height="160" fill="rgba(60,60,220,0.06)"/>

        {/* Base (p, thin) */}
        <rect x="160" y="80" width="60" height="160" fill="#F5D8D8" stroke="rgba(22,22,19,0.4)"/>
        <rect x="160" y="80" width="60" height="160" fill="rgba(220,60,60,0.06)"/>

        {/* Collector (n) */}
        <rect x="220" y="80" width="220" height="160" fill="#D8D8F5" stroke="rgba(22,22,19,0.4)"/>
        <rect x="220" y="80" width="220" height="160" fill="rgba(60,60,220,0.06)"/>

        {/* Carrier flow E→C */}
        {showFlow && Array.from({length: 6}).map((_, i) => (
          <circle key={`e${i}`} r="3" fill={flowColor} opacity="0">
            <animate attributeName="cx" values="100;190;350"
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

        {/* too-low: weak flow */}
        {outcome === 'too-low' && (
          <g>
            <text x="240" y="165" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
              WEAK BIAS
            </text>
            <line x1="100" y1="160" x2="350" y2="160" stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="3,3"/>
          </g>
        )}

        {/* too-high: saturation warning */}
        {outcome === 'too-high' && (
          <g>
            <rect x="40" y="80" width="400" height="160" fill="none"
                  stroke="var(--bad)" strokeWidth="2" opacity="0.4">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.8s" repeatCount="indefinite"/>
            </rect>
            <text x="240" y="165" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--bad)" letterSpacing="0.08em">
              SATURATED — β LOST
            </text>
          </g>
        )}

        {/* correct glow */}
        {outcome === 'correct' && (
          <rect x="160" y="80" width="60" height="160" fill="none"
                stroke="var(--accent)" strokeWidth="2" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.2s" repeatCount="indefinite"/>
          </rect>
        )}

        {/* labels */}
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="100" y="75" textAnchor="middle">n+ (E)</text>
          <text x="190" y="75" textAnchor="middle">p (B)</text>
          <text x="330" y="75" textAnchor="middle">n (C)</text>
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
              {outcome === 'correct' ? '✓ I_C = 1.00 mA · ACTIVE REGION' :
               outcome === 'too-low' ? '✗ I_C TOO LOW · WEAK BIAS' :
               outcome === 'too-high' ? '✗ I_C TOO HIGH · SATURATED' :
               '✗ WRONG VALUE · CHECK CALCULATION'}
            </text>
          </g>
        )}

        {!outcome && (
          <g>
            <text x="240" y="297" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                  fill="var(--ink-mute)" letterSpacing="0.06em">
              AWAITING I_C INPUT…
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
