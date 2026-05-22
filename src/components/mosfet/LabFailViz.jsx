'use client'

export default function LabFailViz({ outcome }) {
  const showElectrons = outcome === 'correct' || outcome === 'wrong-region'
  const channelColor = outcome === 'correct' ? 'var(--accent)' :
    outcome === 'breakdown' ? 'var(--bad)' :
    outcome === 'wrong-region' ? 'var(--amber)' : 'transparent'

  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 320" width="100%">
        <defs>
          <pattern id="gateHatch2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(22,22,19,0.55)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="oxidegrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.95"/>
            <stop offset="1" stopColor="#E6E2D6" stopOpacity="0.85"/>
          </linearGradient>
        </defs>

        {/* substrate */}
        <rect x="40" y="80" width="400" height="160" fill="#F0EBDE" stroke="rgba(22,22,19,0.55)"/>

        {/* substrate dopant dots */}
        <g opacity="0.4">
          {Array.from({length: 80}).map((_, i) => {
            const x = 56 + (i % 20) * 19
            const y = 170 + Math.floor(i/20) * 17
            return <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(22,22,19,0.55)"/>
          })}
        </g>

        {/* source & drain contacts */}
        <rect x="58" y="120" width="52" height="42" fill="#D9D2BF" stroke="rgba(22,22,19,0.7)"/>
        <rect x="370" y="120" width="52" height="42" fill="#D9D2BF" stroke="rgba(22,22,19,0.7)"/>

        {/* channel region */}
        <rect x="130" y="128" width="220" height="28" fill={
          showElectrons ? channelColor : 'rgba(22,22,19,0.04)'
        } opacity={showElectrons ? 0.15 : 1} stroke={showElectrons ? channelColor : 'transparent'} strokeOpacity="0.3"/>

        {/* animated electron flow — dots moving source → drain */}
        {showElectrons && (
          <g>
            {Array.from({length: 8}).map((_, i) => (
              <circle key={`e${i}`} r="3" fill={channelColor} opacity="0.7">
                <animate attributeName="cx" values="110;350" dur={outcome === 'correct' ? '1.2s' : '2s'}
                         repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                <animate attributeName="cy" values={`${136 + (i % 3) * 6};${140 + ((i+1) % 3) * 5};${136 + (i % 3) * 6}`}
                         dur="0.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;0.8;0.8;0" dur={outcome === 'correct' ? '1.2s' : '2s'}
                         repeatCount="indefinite" begin={`${i * 0.15}s`}/>
              </circle>
            ))}
          </g>
        )}

        {/* oxide layer */}
        <rect x="126" y="100" width="228" height="20" fill="url(#oxidegrad2)" stroke="rgba(22,22,19,0.5)"
              opacity={outcome === 'breakdown' ? 0.3 : 1}/>

        {/* oxide cracks for breakdown */}
        {outcome === 'breakdown' && (
          <g>
            <line x1="160" y1="100" x2="170" y2="120" stroke="var(--bad)" strokeWidth="1.5" strokeDasharray="3,2">
              <animate attributeName="opacity" values="0;1;0.5" dur="0.4s" fill="freeze"/>
            </line>
            <line x1="220" y1="100" x2="215" y2="120" stroke="var(--bad)" strokeWidth="1.5" strokeDasharray="3,2">
              <animate attributeName="opacity" values="0;1;0.5" dur="0.4s" begin="0.1s" fill="freeze"/>
            </line>
            <line x1="290" y1="100" x2="300" y2="120" stroke="var(--bad)" strokeWidth="1.5" strokeDasharray="3,2">
              <animate attributeName="opacity" values="0;1;0.5" dur="0.4s" begin="0.2s" fill="freeze"/>
            </line>
          </g>
        )}

        {/* gate metal */}
        <rect x="130" y="58" width="220" height="38" fill="url(#gateHatch2)" stroke="rgba(22,22,19,0.85)"/>

        {/* terminal labels */}
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="84" y="116" textAnchor="middle">S</text>
          <text x="396" y="116" textAnchor="middle">D</text>
          <text x="240" y="50" textAnchor="middle">G</text>
        </g>

        {/* BREAKDOWN: sparks, fire, damage */}
        {outcome === 'breakdown' && (
          <g>
            <path d="M 175 96 L 182 78 L 170 70 L 184 52" stroke="var(--bad)" strokeWidth="2" fill="none" strokeLinejoin="round">
              <animate attributeName="opacity" values="0;1;0.3;1;0.3" dur="0.8s" repeatCount="indefinite"/>
            </path>
            <path d="M 260 96 L 255 76 L 268 68 L 258 48" stroke="var(--bad)" strokeWidth="2" fill="none" strokeLinejoin="round">
              <animate attributeName="opacity" values="0.3;1;0;1;0.5" dur="0.7s" repeatCount="indefinite"/>
            </path>
            <circle cx="200" cy="110" r="8" fill="var(--bad)" opacity="0">
              <animate attributeName="r" values="4;20;8" dur="0.6s" fill="freeze"/>
              <animate attributeName="opacity" values="0;0.6;0.3" dur="0.6s" fill="freeze"/>
            </circle>
            <circle cx="280" cy="108" r="6" fill="var(--bad)" opacity="0">
              <animate attributeName="r" values="3;16;6" dur="0.6s" begin="0.15s" fill="freeze"/>
              <animate attributeName="opacity" values="0;0.5;0.25" dur="0.6s" begin="0.15s" fill="freeze"/>
            </circle>
          </g>
        )}

        {/* CUTOFF: still/dead indicator */}
        {outcome === 'cutoff' && (
          <g>
            <text x="240" y="148" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="var(--ink-mute)" letterSpacing="0.1em">
              NO CHANNEL
            </text>
            <line x1="130" y1="142" x2="350" y2="142" stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="4,4"/>
          </g>
        )}

        {/* CORRECT: clock signal + glow */}
        {outcome === 'correct' && (
          <g>
            <rect x="130" y="128" width="220" height="28" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.4">
              <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.4s" repeatCount="indefinite"/>
            </rect>
            <g transform="translate(380, 55)">
              <path d="M 0 14 L 0 0 L 10 0 L 10 14 L 20 14 L 20 0 L 30 0 L 30 14 L 40 14 L 40 0 L 50 0 L 50 14"
                    stroke="var(--ok)" strokeWidth="1.5" fill="none">
                <animate attributeName="stroke-dashoffset" values="0;-28" dur="0.5s" repeatCount="indefinite"/>
              </path>
              <text x="25" y="28" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ok)">3.78 GHz</text>
            </g>
          </g>
        )}

        {/* status badge */}
        {outcome && (
          <g>
            <rect x="130" y="258" width="220" height="28" rx="3"
                  fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong-region' ? 'var(--amber)' : 'var(--bad)'}
                  opacity="0.12"/>
            <text x="240" y="277" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                  fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong-region' ? 'var(--amber)' : 'var(--bad)'}
                  letterSpacing="0.06em">
              {outcome === 'correct' ? '✓ CHANNEL ACTIVE · 4.50 mA · SPEC MET' :
               outcome === 'cutoff' ? '✗ NO CHANNEL · I_D = 0 · CHIP DEAD' :
               outcome === 'breakdown' ? '⚡ OXIDE RUPTURED · GATE DESTROYED' :
               '✗ WRONG I_D · SPEC NOT MET'}
            </text>
          </g>
        )}

        {/* idle state */}
        {!outcome && (
          <g>
            <text x="240" y="277" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)"
                  letterSpacing="0.06em">
              AWAITING V_GS INPUT…
            </text>
            <rect x="130" y="128" width="220" height="28" fill="none" stroke="var(--rule)" strokeDasharray="6,4"/>
          </g>
        )}
      </svg>
    </div>
  )
}
