'use client'

export default function DiodeCrossSection({ voltage, region, showLabels = true }) {
  const Vbi = 0.8
  const baseW = 80
  const depW = region === 'breakdown' ? baseW * 2.5
    : region === 'reverse' ? baseW * (1 + Math.min(Math.abs(voltage), 5) * 0.3)
    : region === 'zero-bias' ? baseW
    : baseW * Math.max(0.15, 1 - voltage / Vbi)

  const showCarriers = region === 'forward-weak' || region === 'forward-strong'
  const carrierSpeed = region === 'forward-strong' ? '1s' : '2.2s'
  const carrierColor = region === 'forward-strong' ? 'var(--accent)' : 'var(--amber)'

  const cx = 280
  const depLeft = cx - depW / 2
  const depRight = cx + depW / 2

  return (
    <svg viewBox="0 0 560 340" width="100%" className="diode-stage-svg">
      <defs>
        <pattern id="pDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2" fill="rgba(220,60,60,0.3)"/>
        </pattern>
        <pattern id="nDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2" fill="rgba(60,60,220,0.3)"/>
        </pattern>
      </defs>

      {/* p-type region */}
      <rect x="40" y="60" width={depLeft - 40} height="180" fill="#F5E6E6" stroke="rgba(22,22,19,0.4)"/>
      <rect x="40" y="60" width={depLeft - 40} height="180" fill="url(#pDots)"/>

      {/* n-type region */}
      <rect x={depRight} y="60" width={520 - depRight} height="180" fill="#E6E6F5" stroke="rgba(22,22,19,0.4)"/>
      <rect x={depRight} y="60" width={520 - depRight} height="180" fill="url(#nDots)"/>

      {/* depletion region */}
      <rect x={depLeft} y="60" width={depW} height="180" fill="rgba(22,22,19,0.06)"
            stroke="rgba(22,22,19,0.3)" strokeDasharray="4,3"/>

      {/* fixed charges in depletion */}
      {Array.from({length: Math.min(6, Math.round(depW / 14))}).map((_, i) => {
        const xNeg = depLeft + 6 + i * (depW / 2 / 6)
        const xPos = cx + 4 + i * (depW / 2 / 6)
        return (
          <g key={i}>
            <text x={xNeg} y={140 + (i % 3) * 20} fontSize="14" fill="rgba(220,60,60,0.6)" fontWeight="bold">−</text>
            <text x={xPos} y={130 + (i % 3) * 22} fontSize="14" fill="rgba(60,60,220,0.6)" fontWeight="bold">+</text>
          </g>
        )
      })}

      {/* electric field arrows */}
      {depW > 20 && (
        <g>
          {[0.25, 0.5, 0.75].map((frac, i) => {
            const ax = depLeft + depW * frac
            return (
              <line key={i} x1={ax + 8} y1="150" x2={ax - 8} y2="150"
                    stroke="var(--amber)" strokeWidth="1.5" markerEnd="url(#arrowE)" opacity="0.5"/>
            )
          })}
          <defs>
            <marker id="arrowE" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <path d="M0,0 L6,2 L0,4" fill="var(--amber)" opacity="0.7"/>
            </marker>
          </defs>
        </g>
      )}

      {/* carrier flow animation */}
      {showCarriers && (
        <g>
          {Array.from({length: 8}).map((_, i) => (
            <g key={`carrier-${i}`}>
              {/* electrons flowing right to left (n→p) */}
              <circle r="3" fill={carrierColor} opacity="0">
                <animate attributeName="cx" values={`${depRight + 40};${depLeft - 40}`}
                         dur={carrierSpeed} repeatCount="indefinite" begin={`${i * 0.12}s`}/>
                <animate attributeName="cy"
                         values={`${120 + (i % 4) * 18};${125 + ((i+1) % 4) * 16};${120 + (i % 4) * 18}`}
                         dur="0.7s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;0.7;0.7;0"
                         dur={carrierSpeed} repeatCount="indefinite" begin={`${i * 0.12}s`}/>
              </circle>
              {/* holes flowing left to right (p→n) */}
              <circle r="3" fill="rgba(220,60,60,0.6)" opacity="0">
                <animate attributeName="cx" values={`${depLeft - 40};${depRight + 40}`}
                         dur={carrierSpeed} repeatCount="indefinite" begin={`${i * 0.12 + 0.06}s`}/>
                <animate attributeName="cy"
                         values={`${160 + (i % 3) * 14};${155 + ((i+2) % 3) * 12};${160 + (i % 3) * 14}`}
                         dur="0.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;0.5;0.5;0"
                         dur={carrierSpeed} repeatCount="indefinite" begin={`${i * 0.12 + 0.06}s`}/>
              </circle>
            </g>
          ))}
        </g>
      )}

      {/* breakdown: sparks */}
      {region === 'breakdown' && (
        <g>
          <path d={`M ${cx-10} 70 L ${cx-5} 110 L ${cx-15} 140 L ${cx-3} 180 L ${cx-12} 220`}
                stroke="var(--bad)" strokeWidth="2" fill="none">
            <animate attributeName="opacity" values="0;1;0.3;1;0.3" dur="0.6s" repeatCount="indefinite"/>
          </path>
          <path d={`M ${cx+10} 80 L ${cx+5} 120 L ${cx+16} 155 L ${cx+4} 195 L ${cx+14} 230`}
                stroke="var(--bad)" strokeWidth="2" fill="none">
            <animate attributeName="opacity" values="0.3;1;0;1;0.5" dur="0.5s" repeatCount="indefinite"/>
          </path>
          {[0,1,2].map(i => (
            <circle key={i} cx={cx + (i-1)*20} cy={150} r="4" fill="var(--bad)" opacity="0">
              <animate attributeName="r" values="3;18;6" dur="0.6s" begin={`${i*0.15}s`} fill="freeze"/>
              <animate attributeName="opacity" values="0;0.5;0.2" dur="0.6s" begin={`${i*0.15}s`} fill="freeze"/>
            </circle>
          ))}
        </g>
      )}

      {/* channel glow for forward */}
      {region === 'forward-strong' && (
        <rect x={depLeft} y="60" width={depW} height="180" fill="none"
              stroke="var(--accent)" strokeWidth="2" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.2s" repeatCount="indefinite"/>
        </rect>
      )}

      {/* contacts */}
      <rect x="20" y="110" width="20" height="80" fill="#C4BBAA" stroke="rgba(22,22,19,0.5)"/>
      <rect x="520" y="110" width="20" height="80" fill="#C4BBAA" stroke="rgba(22,22,19,0.5)"/>

      {/* labels */}
      {showLabels && (
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x={depLeft / 2 + 20} y="55" textAnchor="middle" letterSpacing="0.06em">p-type (N_A)</text>
          <text x={(depRight + 520) / 2} y="55" textAnchor="middle" letterSpacing="0.06em">n-type (N_D)</text>
          <text x={cx} y="270" textAnchor="middle" fontSize="9" letterSpacing="0.08em" fill="var(--ink-mute)">
            DEPLETION REGION · W = {depW > 200 ? 'very wide' : depW < 20 ? 'nearly gone' : 'normal'}
          </text>
          <text x="30" y="100" fontSize="9" fill="var(--ink-mute)">Anode</text>
          <text x="510" y="100" fontSize="9" fill="var(--ink-mute)">Cathode</text>

          {/* E-field label */}
          {depW > 30 && (
            <text x={cx} y="175" textAnchor="middle" fontSize="8" fill="var(--amber)" letterSpacing="0.06em">
              E-field →
            </text>
          )}
        </g>
      )}

      {/* status badge */}
      <g>
        <rect x={cx - 110} y="290" width="220" height="28" rx="3"
              fill={region === 'forward-strong' ? 'var(--ok)' : region === 'breakdown' ? 'var(--bad)' : region === 'forward-weak' ? 'var(--amber)' : 'var(--ink-mute)'}
              opacity="0.12"/>
        <text x={cx} y="309" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
              fill={region === 'forward-strong' ? 'var(--ok)' : region === 'breakdown' ? 'var(--bad)' : region === 'forward-weak' ? 'var(--amber)' : 'var(--ink-mute)'}
              letterSpacing="0.06em">
          {region === 'forward-strong' ? '✓ FORWARD BIAS · CONDUCTING' :
           region === 'forward-weak' ? '~ FORWARD · LOW CURRENT' :
           region === 'reverse' ? '✗ REVERSE BIAS · BLOCKED' :
           region === 'breakdown' ? '⚡ BREAKDOWN · REVERSE FLOOD' :
           '— ZERO BIAS · EQUILIBRIUM'}
        </text>
      </g>
    </svg>
  )
}
