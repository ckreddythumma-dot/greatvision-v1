'use client'
import { useState } from 'react'

const STATES = [
  { id: 'blocked', doorAngle: 0, flow: 0, label: 'Blocked', color: 'var(--ink-mute)',
    caption: 'Pushing from the wrong side. The door won\'t budge. Like reverse bias — no current flows, the depletion region widens.' },
  { id: 'cracking', doorAngle: 15, flow: 0.15, label: 'Just cracking open', color: 'var(--amber)',
    caption: 'You push from the right side with just enough force. The door starts to move. Like V_A approaching V_bi — carriers begin to cross.' },
  { id: 'open', doorAngle: 70, flow: 0.7, label: 'Swinging open', color: 'var(--accent)',
    caption: 'The door swings freely. People pour through. Like forward bias — current flows exponentially as voltage increases.' },
  { id: 'broken', doorAngle: 110, flow: 1, label: 'Forced from wrong side', color: 'var(--bad)',
    caption: 'Too much reverse pressure. The door breaks off its hinges. Like avalanche breakdown — current floods in reverse, junction may be destroyed.' },
]

export default function PNJunctionAnalogy() {
  const [idx, setIdx] = useState(0)
  const s = STATES[idx]

  return (
    <div className="watertap">
      <div className="watertap__stage">
        <svg viewBox="0 0 400 320" className="watertap__svg">
          {/* Wall */}
          <rect x="180" y="40" width="20" height="240" fill="var(--surface-2)" stroke="var(--rule-strong)" strokeWidth="1.5"/>

          {/* Labels */}
          <text x="90" y="35" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#C74B50" letterSpacing="0.08em">P-SIDE</text>
          <text x="300" y="35" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#3A6EA5" letterSpacing="0.08em">N-SIDE</text>

          {/* Door (hinged at top of wall) */}
          <g transform={`translate(200, 100)`}>
            <g transform={`rotate(${s.doorAngle})`} style={{transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1)', transformOrigin: '0 0'}}>
              <rect x="0" y="0" width="80" height="10" rx="2" fill={s.color} opacity="0.7" stroke={s.color}/>
              <circle cx="80" cy="5" r="4" fill={s.color} opacity="0.5"/>
            </g>
            <circle cx="0" cy="5" r="5" fill="var(--paper)" stroke={s.color} strokeWidth="2"/>
          </g>

          {/* Door label */}
          <text x="260" y="90" fontFamily="Instrument Serif" fontSize="12" fill="var(--ink-mute)" fontStyle="italic">(the junction)</text>
          <text x="190" y="90" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill={s.color} fontWeight="600">JUNCTION</text>

          {/* People/carriers flowing through */}
          {s.flow > 0 && s.id !== 'broken' && (
            <g>
              {Array.from({ length: Math.ceil(s.flow * 6) }).map((_, i) => (
                <g key={i}>
                  <circle cx={200} cy={130 + i * 20} r={4} fill={s.color} opacity={0.5 - i * 0.06}>
                    <animate attributeName="cx" values="100;320" dur={`${1.2 - s.flow * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                    <animate attributeName="opacity" values={`0;${0.7 * s.flow};0`} dur={`${1.2 - s.flow * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                  </circle>
                </g>
              ))}
            </g>
          )}

          {/* Breakdown: people flooding in reverse */}
          {s.id === 'broken' && (
            <g>
              {Array.from({ length: 8 }).map((_, i) => (
                <circle key={`r${i}`} cx={300} cy={120 + i * 18} r={4} fill="var(--bad)" opacity="0.6">
                  <animate attributeName="cx" values="340;80" dur="0.8s" repeatCount="indefinite" begin={`${i * 0.1}s`}/>
                  <animate attributeName="opacity" values="0;0.8;0" dur="0.8s" repeatCount="indefinite" begin={`${i * 0.1}s`}/>
                </circle>
              ))}
              {/* Crack marks on wall */}
              <line x1="185" y1="130" x2="195" y2="160" stroke="var(--bad)" strokeWidth="2">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="0.5s" repeatCount="indefinite"/>
              </line>
              <line x1="188" y1="200" x2="198" y2="230" stroke="var(--bad)" strokeWidth="2">
                <animate attributeName="opacity" values="1;0.5;1" dur="0.6s" repeatCount="indefinite"/>
              </line>
            </g>
          )}

          {/* Blocked indicator */}
          {s.flow === 0 && (
            <text x="280" y="170" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.1em">
              BLOCKED
            </text>
          )}

          {/* Current label */}
          <text x="190" y="300" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)">
            I = {s.flow === 0 ? '0' : s.flow < 0.3 ? 'trickle' : s.flow < 0.8 ? 'flowing' : 'flood'}
          </text>

          {/* Arrow showing push direction */}
          {s.id === 'blocked' && (
            <g>
              <line x1="300" y1="160" x2="220" y2="160" stroke="var(--ink-faint)" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
              <text x="260" y="150" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-faint)">push</text>
            </g>
          )}
        </svg>
      </div>

      <div className="watertap__controls">
        <div className="watertap__label">
          <span className="serif" style={{ fontSize: 22, color: s.color }}>{s.label}</span>
          <span className="pill" style={{ marginLeft: 8 }}>{s.id}</span>
        </div>
        <p className="watertap__caption">{s.caption}</p>
        <div className="watertap__btns">
          {STATES.map((st, i) => (
            <button key={st.id} className={`watertap__btn ${i === idx ? 'is-active' : ''}`}
                    onClick={() => setIdx(i)} style={i === idx ? { borderColor: st.color, color: st.color } : {}}>
              <span className="mono" style={{ fontSize: 9 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 13 }}>{st.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
