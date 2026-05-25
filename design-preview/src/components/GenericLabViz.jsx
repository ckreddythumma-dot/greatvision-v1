'use client'

export default function GenericLabViz({ outcome, concept }) {
  const isCorrect = outcome === 'correct'
  const isWrong = outcome === 'wrong'
  const isIdle = !outcome

  if (concept === 'pn-junction') return <PNLabViz outcome={outcome}/>
  if (concept === 'bjt') return <BJTLabViz outcome={outcome}/>
  if (concept === 'mosfet-amp') return <AmpLabViz outcome={outcome}/>
  if (concept === 'cmos-inv') return <CMOSLabViz outcome={outcome}/>
  return null
}

function PNLabViz({ outcome }) {
  const showFlow = outcome === 'correct'
  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 280" width="100%">
        {/* P region */}
        <rect x="40" y="60" width="180" height="160" fill="rgba(199,75,80,0.08)" stroke="rgba(199,75,80,0.3)"/>
        <text x="130" y="50" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#C74B50" letterSpacing="0.08em">P-TYPE</text>
        {/* N region */}
        <rect x="260" y="60" width="180" height="160" fill="rgba(58,110,165,0.08)" stroke="rgba(58,110,165,0.3)"/>
        <text x="350" y="50" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#3A6EA5" letterSpacing="0.08em">N-TYPE</text>
        {/* Depletion region */}
        <rect x="220" y="60" width={showFlow ? 10 : 40} height="160" fill="var(--surface-2)" stroke="var(--rule)" strokeDasharray="3,3"
              style={{transition:'width 500ms ease-out', x: showFlow ? 235 : 220}}/>

        {/* Carrier flow */}
        {showFlow && (
          <g>
            {Array.from({length:6}).map((_,i)=>(
              <circle key={i} r="3" fill="#3A6EA5" opacity="0.6">
                <animate attributeName="cx" values="350;100" dur="1.2s" repeatCount="indefinite" begin={`${i*0.2}s`}/>
                <animate attributeName="cy" values={`${100+i*20};${110+(i%3)*15}`} dur="1.2s" repeatCount="indefinite" begin={`${i*0.2}s`}/>
                <animate attributeName="opacity" values="0;0.7;0" dur="1.2s" repeatCount="indefinite" begin={`${i*0.2}s`}/>
              </circle>
            ))}
          </g>
        )}

        {/* Status */}
        <rect x="130" y="240" width="220" height="24" rx="3"
              fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong' ? 'var(--bad)' : 'var(--ink-mute)'}
              opacity="0.1"/>
        <text x="240" y="256" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9"
              fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong' ? 'var(--bad)' : 'var(--ink-mute)'}
              letterSpacing="0.06em">
          {outcome === 'correct' ? 'V_bi CORRECT · JUNCTION BIASED' :
           outcome === 'wrong' ? 'V_bi INCORRECT · CHECK CALCULATION' :
           'AWAITING ANSWER...'}
        </text>
      </svg>
    </div>
  )
}

function BJTLabViz({ outcome }) {
  const showFlow = outcome === 'correct'
  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 280" width="100%">
        <rect x="60" y="80" width="120" height="120" fill="rgba(58,110,165,0.08)" stroke="rgba(58,110,165,0.3)"/>
        <text x="120" y="70" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#3A6EA5">EMITTER</text>
        <rect x="190" y="60" width="60" height="160" fill="rgba(199,75,80,0.08)" stroke="rgba(199,75,80,0.3)"/>
        <text x="220" y="50" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#C74B50">BASE</text>
        <rect x="260" y="80" width="160" height="120" fill="rgba(58,110,165,0.08)" stroke="rgba(58,110,165,0.3)"/>
        <text x="340" y="70" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#3A6EA5">COLLECTOR</text>

        {showFlow && (
          <g>
            {Array.from({length:8}).map((_,i)=>(
              <circle key={i} r="3" fill="var(--accent)" opacity="0.6">
                <animate attributeName="cx" values="120;220;380" dur="1.4s" repeatCount="indefinite" begin={`${i*0.17}s`}/>
                <animate attributeName="cy" values={`${110+i*10};${130+(i%3)*10};${120+((i+1)%3)*12}`} dur="1.4s" repeatCount="indefinite" begin={`${i*0.17}s`}/>
                <animate attributeName="opacity" values="0;0.7;0.6;0" dur="1.4s" repeatCount="indefinite" begin={`${i*0.17}s`}/>
              </circle>
            ))}
          </g>
        )}

        {outcome === 'correct' && (
          <g transform="translate(420,100)">
            <text x="0" y="0" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ok)">I_C</text>
            <text x="0" y="16" fontFamily="Instrument Serif" fontSize="16" fill="var(--ok)">1.00 mA</text>
          </g>
        )}

        <rect x="130" y="240" width="220" height="24" rx="3"
              fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong' ? 'var(--bad)' : 'var(--ink-mute)'}
              opacity="0.1"/>
        <text x="240" y="256" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9"
              fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong' ? 'var(--bad)' : 'var(--ink-mute)'}
              letterSpacing="0.06em">
          {outcome === 'correct' ? 'I_C CORRECT · BIAS POINT SET' :
           outcome === 'wrong' ? 'I_C INCORRECT · CHECK BIAS' :
           'AWAITING ANSWER...'}
        </text>
      </svg>
    </div>
  )
}

function AmpLabViz({ outcome }) {
  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 280" width="100%">
        {/* Input wave */}
        <g transform="translate(20, 60)">
          <text x="90" y="0" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-faint)">INPUT</text>
          <path d="M 10 70 Q 50 10 90 70 Q 130 130 170 70" fill="none" stroke="var(--ink-mute)" strokeWidth="1.5"/>
        </g>

        {/* Amplifier triangle */}
        <polygon points="200,60 280,110 200,160" fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="1.5"/>
        <text x="228" y="115" fontFamily="JetBrains Mono" fontSize="10" fill="var(--accent)">A_v</text>

        {/* Output wave */}
        <g transform="translate(290, 40)">
          <text x="80" y="0" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-faint)">OUTPUT</text>
          {outcome === 'correct' ? (
            <path d="M 10 100 Q 50 160 90 100 Q 130 40 170 100" fill="none" stroke="var(--ok)" strokeWidth="2"/>
          ) : (
            <path d="M 10 100 Q 50 160 90 100 Q 130 40 170 100" fill="none" stroke="var(--ink-mute)" strokeWidth="1.5" strokeDasharray="5,5"/>
          )}
        </g>

        {outcome === 'correct' && (
          <g>
            <text x="380" y="180" textAnchor="middle" fontFamily="Instrument Serif" fontSize="20" fill="var(--ok)">|A_v| = 8.00</text>
            <rect x="290" y="60" width="170" height="110" fill="none" stroke="var(--ok)" strokeWidth="1" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite"/>
            </rect>
          </g>
        )}

        <rect x="130" y="240" width="220" height="24" rx="3"
              fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong' ? 'var(--bad)' : 'var(--ink-mute)'}
              opacity="0.1"/>
        <text x="240" y="256" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9"
              fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong' ? 'var(--bad)' : 'var(--ink-mute)'}
              letterSpacing="0.06em">
          {outcome === 'correct' ? 'GAIN CORRECT · SIGNAL AMPLIFIED' :
           outcome === 'wrong' ? 'GAIN INCORRECT · CHECK g_m * R_D' :
           'AWAITING ANSWER...'}
        </text>
      </svg>
    </div>
  )
}

function CMOSLabViz({ outcome }) {
  const pmosOn = outcome === 'correct'
  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 280" width="100%">
        {/* V_DD */}
        <line x1="200" y1="20" x2="280" y2="20" stroke="var(--ok)" strokeWidth="2"/>
        <text x="240" y="14" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ok)">V_DD</text>

        {/* PMOS */}
        <rect x="210" y="40" width="60" height="45" rx="4" fill={pmosOn ? 'rgba(43,122,75,0.1)' : 'var(--surface)'} stroke={pmosOn ? 'var(--ok)' : 'var(--rule)'}/>
        <text x="240" y="67" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={pmosOn ? 'var(--ok)' : 'var(--ink-mute)'}>PMOS</text>
        <line x1="240" y1="20" x2="240" y2="40" stroke="var(--ink)" strokeWidth="1.5"/>

        {/* NMOS */}
        <rect x="210" y="115" width="60" height="45" rx="4" fill={!pmosOn && outcome ? 'rgba(58,110,165,0.1)' : 'var(--surface)'} stroke={!pmosOn && outcome ? 'var(--accent)' : 'var(--rule)'}/>
        <text x="240" y="142" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={!pmosOn && outcome ? 'var(--accent)' : 'var(--ink-mute)'}>NMOS</text>
        <line x1="240" y1="85" x2="240" y2="115" stroke="var(--ink)" strokeWidth="1.5"/>
        <line x1="240" y1="160" x2="240" y2="190" stroke="var(--ink)" strokeWidth="1.5"/>

        {/* GND */}
        <line x1="200" y1="190" x2="280" y2="190" stroke="var(--ink-mute)" strokeWidth="2"/>
        <text x="240" y="206" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)">GND</text>

        {/* Output */}
        <circle cx="240" cy="100" r="4" fill={outcome === 'correct' ? 'var(--ok)' : 'var(--ink-mute)'}/>
        <line x1="244" y1="100" x2="340" y2="100" stroke="var(--ink)" strokeWidth="1.5"/>
        <text x="350" y="96" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-soft)">V_out</text>

        {/* Sizing spec */}
        <g transform="translate(350, 40)">
          <text x="0" y="0" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-faint)">(W/L)_p spec:</text>
          {outcome === 'correct' ? (
            <text x="0" y="18" fontFamily="Instrument Serif" fontSize="20" fill="var(--ok)">5.00</text>
          ) : (
            <text x="0" y="18" fontFamily="JetBrains Mono" fontSize="14" fill="var(--ink-mute)">?</text>
          )}
        </g>

        <rect x="130" y="240" width="220" height="24" rx="3"
              fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong' ? 'var(--bad)' : 'var(--ink-mute)'}
              opacity="0.1"/>
        <text x="240" y="256" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9"
              fill={outcome === 'correct' ? 'var(--ok)' : outcome === 'wrong' ? 'var(--bad)' : 'var(--ink-mute)'}
              letterSpacing="0.06em">
          {outcome === 'correct' ? 'SIZING CORRECT · SYMMETRIC VTC' :
           outcome === 'wrong' ? 'SIZING INCORRECT · VTC SKEWED' :
           'AWAITING ANSWER...'}
        </text>
      </svg>
    </div>
  )
}
