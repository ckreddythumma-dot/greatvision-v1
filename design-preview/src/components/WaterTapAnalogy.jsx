'use client'
import { useState } from 'react'

const STATES = [
  { id: 'cutoff', knob: 0, flow: 0, label: 'Closed', color: 'var(--ink-mute)',
    caption: 'Knob shut tight. Zero flow. Like V_GS < V_t — no channel, no current.' },
  { id: 'threshold', knob: 45, flow: 0.15, label: 'Just cracked open', color: 'var(--amber)',
    caption: 'Knob barely turned. A trickle begins. V_GS = V_t — the channel just forms.' },
  { id: 'linear', knob: 90, flow: 0.5, label: 'Half open', color: 'var(--accent)',
    caption: 'Water flows freely, more pressure = more flow. V_DS controls current alongside V_GS.' },
  { id: 'saturation', knob: 135, flow: 1, label: 'Wide open', color: 'var(--ok)',
    caption: 'Full blast — but pipe capacity limits flow. Turning on more doesn\'t help. Current set by V_GS only.' },
]

export default function WaterTapAnalogy() {
  const [idx, setIdx] = useState(0)
  const s = STATES[idx]

  return (
    <div className="watertap">
      <div className="watertap__stage">
        <svg viewBox="0 0 400 320" className="watertap__svg">
          {/* pipe from left (source) */}
          <rect x="0" y="120" width="130" height="24" rx="4" fill="var(--surface-2)" stroke="var(--rule-strong)"/>
          <text x="60" y="115" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">SOURCE</text>

          {/* tap body */}
          <rect x="130" y="105" width="60" height="54" rx="6" fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="1.5"/>
          <rect x="140" y="115" width="40" height="34" rx="3" fill="var(--paper)" stroke="var(--rule)"/>

          {/* knob (gate) */}
          <g transform={`translate(160, 80)`}>
            <line x1="0" y1="0" x2="0" y2="25" stroke="var(--rule-strong)" strokeWidth="2"/>
            <g transform={`rotate(${s.knob})`} style={{transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1)'}}>
              <line x1="-20" y1="0" x2="20" y2="0" stroke={s.color} strokeWidth="3" strokeLinecap="round"/>
              <circle cx="-20" cy="0" r="4" fill={s.color}/>
              <circle cx="20" cy="0" r="4" fill={s.color}/>
            </g>
            <circle cx="0" cy="0" r="6" fill="var(--paper)" stroke={s.color} strokeWidth="2"/>
          </g>
          <text x="160" y="55" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill={s.color} letterSpacing="0.08em" fontWeight="600">GATE</text>
          <text x="160" y="67" textAnchor="middle" fontFamily="Instrument Serif" fontSize="11" fill="var(--ink-mute)" fontStyle="italic">(the knob)</text>

          {/* pipe to right (drain) */}
          <rect x="190" y="120" width="90" height="24" rx="4" fill="var(--surface-2)" stroke="var(--rule-strong)"/>

          {/* downspout */}
          <rect x="270" y="120" width="24" height="80" rx="4" fill="var(--surface-2)" stroke="var(--rule-strong)"/>
          <text x="330" y="135" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">DRAIN</text>

          {/* water drops / flow */}
          {s.flow > 0 && (
            <g>
              {/* flow inside pipe */}
              <rect x="192" y="126" width={Math.floor(76 * s.flow)} height="12" rx="2" fill={s.color} opacity="0.2">
                <animate attributeName="width" values={`0;${Math.floor(76 * s.flow)}`} dur="0.6s" fill="freeze"/>
              </rect>

              {/* water drops falling from spout */}
              {Array.from({ length: Math.ceil(s.flow * 5) }).map((_, i) => (
                <g key={i}>
                  <ellipse cx={282} cy={210 + i * 18} rx={3 + s.flow * 2} ry={4 + s.flow * 2} fill={s.color} opacity={0.3 - i * 0.04}>
                    <animate attributeName="cy" values={`${200};${310}`} dur={`${0.8 + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.12}s`}/>
                    <animate attributeName="opacity" values={`${0.5 * s.flow};0`} dur={`${0.8 + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.12}s`}/>
                  </ellipse>
                </g>
              ))}

              {/* splash at bottom */}
              {s.flow > 0.3 && (
                <g>
                  <ellipse cx="282" cy="306" rx={20 * s.flow} ry="4" fill={s.color} opacity="0.15">
                    <animate attributeName="rx" values={`${14 * s.flow};${24 * s.flow};${14 * s.flow}`} dur="1s" repeatCount="indefinite"/>
                  </ellipse>
                </g>
              )}
            </g>
          )}

          {/* no-flow indicator */}
          {s.flow === 0 && (
            <text x="230" y="138" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.12em">
              BLOCKED
            </text>
          )}

          {/* current label */}
          <text x="160" y="175" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)">
            I_D = {s.flow === 0 ? '0' : s.flow < 0.3 ? '≈ 0' : s.flow < 0.6 ? 'rising' : 'max'}
          </text>

          {/* bucket (load) */}
          <path d="M 262 300 L 262 315 L 302 315 L 302 300" fill="none" stroke="var(--rule-strong)" strokeWidth="1.5"/>
          <text x="282" y="312" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-mute)">LOAD</text>
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
