'use client'
import { useState } from 'react'

const STATES = [
  { id: 'off', seesawAngle: -20, topOn: true, bottomOn: false, label: 'Switch OFF (input LOW)', color: 'var(--ok)',
    caption: 'Input is LOW. The top person (PMOS) sits down — their side drops, connecting output to V_DD. Bottom person (NMOS) is up — disconnected from ground. Output = HIGH. The seesaw inverts.' },
  { id: 'tipping', seesawAngle: 0, topOn: true, bottomOn: true, label: 'Tipping point (transition)', color: 'var(--bad)',
    caption: 'Both people are touching the ground at the same moment. For a brief instant, there is a path from V_DD through both to ground — crowbar current! The seesaw must pass through this dangerous state quickly.' },
  { id: 'on', seesawAngle: 20, topOn: false, bottomOn: true, label: 'Switch ON (input HIGH)', color: 'var(--accent)',
    caption: 'Input is HIGH. Bottom person (NMOS) sits down — connecting output to ground. Top person (PMOS) is up — disconnected from V_DD. Output = LOW. The seesaw has inverted the input.' },
]

export default function CMOSInvAnalogy() {
  const [idx, setIdx] = useState(0)
  const s = STATES[idx]

  return (
    <div className="watertap">
      <div className="watertap__stage">
        <svg viewBox="0 0 400 300" className="watertap__svg">
          {/* V_DD label at top */}
          <line x1="140" y1="30" x2="260" y2="30" stroke="var(--ok)" strokeWidth="2"/>
          <text x="200" y="22" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ok)" letterSpacing="0.06em">V_DD</text>

          {/* GND label at bottom */}
          <line x1="140" y1="270" x2="260" y2="270" stroke="var(--ink-mute)" strokeWidth="2"/>
          <text x="200" y="288" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.06em">GND</text>

          {/* Seesaw pivot */}
          <polygon points="195,195 205,195 200,185" fill="var(--surface-2)" stroke="var(--rule-strong)"/>

          {/* Seesaw beam */}
          <g transform={`translate(200, 185)`}>
            <g transform={`rotate(${s.seesawAngle})`} style={{transition: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1)', transformOrigin: '0 0'}}>
              <rect x="-100" y="-4" width="200" height="8" rx="2" fill="var(--surface-2)" stroke="var(--rule-strong)"/>

              {/* PMOS person (left side) */}
              <g transform="translate(-80, -30)">
                <circle cx="0" cy="-12" r="8" fill={s.topOn ? 'var(--ok)' : 'var(--surface)'} stroke={s.topOn ? 'var(--ok)' : 'var(--rule)'} strokeWidth="1.5"
                        style={{transition: 'all 400ms ease-out'}}/>
                <line x1="0" y1="-4" x2="0" y2="0" stroke={s.topOn ? 'var(--ok)' : 'var(--ink-mute)'} strokeWidth="2"/>
                <text x="0" y="-24" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill={s.topOn ? 'var(--ok)' : 'var(--ink-faint)'}>PMOS</text>
              </g>

              {/* NMOS person (right side) */}
              <g transform="translate(80, -30)">
                <circle cx="0" cy="-12" r="8" fill={s.bottomOn ? 'var(--accent)' : 'var(--surface)'} stroke={s.bottomOn ? 'var(--accent)' : 'var(--rule)'} strokeWidth="1.5"
                        style={{transition: 'all 400ms ease-out'}}/>
                <line x1="0" y1="-4" x2="0" y2="0" stroke={s.bottomOn ? 'var(--accent)' : 'var(--ink-mute)'} strokeWidth="2"/>
                <text x="0" y="-24" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill={s.bottomOn ? 'var(--accent)' : 'var(--ink-faint)'}>NMOS</text>
              </g>
            </g>
          </g>

          {/* Connection to V_DD (from PMOS) */}
          {s.topOn && (
            <line x1="120" y1="30" x2="120" y2="140" stroke="var(--ok)" strokeWidth="2" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.2s" repeatCount="indefinite"/>
            </line>
          )}

          {/* Connection to GND (from NMOS) */}
          {s.bottomOn && (
            <line x1="280" y1="200" x2="280" y2="270" stroke="var(--accent)" strokeWidth="2" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.2s" repeatCount="indefinite"/>
            </line>
          )}

          {/* Output node */}
          <circle cx="200" cy="145" r="6" fill={s.color} stroke={s.color} strokeWidth="1.5"/>
          <line x1="206" y1="145" x2="310" y2="145" stroke="var(--ink)" strokeWidth="1.5"/>
          <text x="320" y="140" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">V_out</text>
          <text x="320" y="158" fontFamily="Instrument Serif" fontSize="18" fill={s.color} fontStyle="italic">
            {s.id === 'off' ? 'HIGH' : s.id === 'on' ? 'LOW' : '???'}
          </text>

          {/* Input indicator */}
          <g transform="translate(40, 130)">
            <text x="0" y="0" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">V_in</text>
            <text x="0" y="20" fontFamily="Instrument Serif" fontSize="18" fill={s.color} fontStyle="italic">
              {s.id === 'off' ? 'LOW' : s.id === 'on' ? 'HIGH' : 'MID'}
            </text>
          </g>

          {/* Crowbar current warning */}
          {s.id === 'tipping' && (
            <g>
              <rect x="145" y="95" width="110" height="24" rx="4" fill="var(--bad)" opacity="0.1"/>
              <text x="200" y="111" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--bad)" letterSpacing="0.04em">
                CROWBAR CURRENT
              </text>
              {Array.from({length: 4}).map((_, i) => (
                <circle key={i} cx="200" r="2" fill="var(--bad)" opacity="0.5">
                  <animate attributeName="cy" values="30;270" dur="0.6s" repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                  <animate attributeName="opacity" values="0;0.6;0" dur="0.6s" repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                </circle>
              ))}
            </g>
          )}

          {/* Inversion arrows */}
          <g transform="translate(200, 230)">
            <text x="0" y="0" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-faint)">
              {s.id === 'off' ? 'IN: 0 → OUT: 1' : s.id === 'on' ? 'IN: 1 → OUT: 0' : 'IN: ½ → OUT: ½'}
            </text>
          </g>
        </svg>
      </div>

      <div className="watertap__controls">
        <div className="watertap__label">
          <span className="serif" style={{ fontSize: 22, color: s.color }}>{s.label}</span>
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
