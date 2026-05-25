'use client'
import { useState } from 'react'

const STATES = [
  { id: 'cutoff', leverAngle: 0, flow: 0, label: 'Valve closed', color: 'var(--ink-mute)',
    caption: 'No pressure on the small lever. The big valve stays shut. Zero flow. Like I_B = 0 — no base current means no collector current.' },
  { id: 'active', leverAngle: 45, flow: 0.5, label: 'Proportional control', color: 'var(--accent)',
    caption: 'A small push on the lever opens the big valve proportionally. Tiny force, big flow. Like active mode — small I_B controls large I_C = beta * I_B.' },
  { id: 'saturation', leverAngle: 90, flow: 1, label: 'Wide open', color: 'var(--ok)',
    caption: 'Lever pushed all the way. Valve fully open. More lever force won\'t increase flow — the pipe is at max capacity. Like saturation — V_CE drops to 0.2V.' },
]

export default function BJTAnalogy() {
  const [idx, setIdx] = useState(0)
  const s = STATES[idx]

  return (
    <div className="watertap">
      <div className="watertap__stage">
        <svg viewBox="0 0 400 320" className="watertap__svg">
          {/* Main pipe (collector to emitter) */}
          <rect x="170" y="20" width="30" height="100" rx="4" fill="var(--surface-2)" stroke="var(--rule-strong)"/>
          <text x="245" y="50" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">COLLECTOR</text>

          {/* Valve body */}
          <rect x="145" y="120" width="80" height="60" rx="6" fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="1.5"/>
          <rect x="155" y="130" width="60" height="40" rx="3" fill="var(--paper)" stroke="var(--rule)"/>

          {/* Valve opening (proportional to flow) */}
          <rect x="170" y={150 - s.flow * 15} width="30" height={s.flow * 30 + 2} rx="2"
                fill={s.color} opacity="0.2"
                style={{transition: 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)'}}/>

          {/* Small lever (base input) */}
          <g transform="translate(145, 150)">
            <g transform={`rotate(${-s.leverAngle})`} style={{transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1)', transformOrigin: '0 0'}}>
              <line x1="0" y1="0" x2="-60" y2="0" stroke={s.color} strokeWidth="3" strokeLinecap="round"/>
              <circle cx="-60" cy="0" r="5" fill={s.color} opacity="0.6"/>
            </g>
            <circle cx="0" cy="0" r="4" fill="var(--paper)" stroke={s.color} strokeWidth="2"/>
          </g>
          <text x="50" y="140" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill={s.color} fontWeight="600" letterSpacing="0.06em">BASE</text>
          <text x="50" y="155" textAnchor="middle" fontFamily="Instrument Serif" fontSize="11" fill="var(--ink-mute)" fontStyle="italic">(the lever)</text>

          {/* Output pipe (emitter) */}
          <rect x="170" y="180" width="30" height="100" rx="4" fill="var(--surface-2)" stroke="var(--rule-strong)"/>
          <text x="245" y="250" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">EMITTER</text>

          {/* Flow through pipe */}
          {s.flow > 0 && (
            <g>
              {Array.from({ length: Math.ceil(s.flow * 6) }).map((_, i) => (
                <circle key={i} cx={185} r={3 + s.flow * 2} fill={s.color} opacity={0.5}>
                  <animate attributeName="cy" values="40;270" dur={`${1.4 - s.flow * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                  <animate attributeName="opacity" values={`0;${0.6 * s.flow};0`} dur={`${1.4 - s.flow * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.15}s`}/>
                </circle>
              ))}
            </g>
          )}

          {/* Small input arrow (base current) */}
          {s.flow > 0 && (
            <g>
              <circle cx={100} cy={150} r={2} fill={s.color} opacity="0.5">
                <animate attributeName="cx" values="30;140" dur="1.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;0.7;0" dur="1.2s" repeatCount="indefinite"/>
              </circle>
            </g>
          )}

          {/* No flow indicator */}
          {s.flow === 0 && (
            <text x="185" y="155" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.1em">
              SHUT
            </text>
          )}

          {/* Gain indicator */}
          {s.id === 'active' && (
            <g transform="translate(300, 130)">
              <text x="0" y="0" fontFamily="JetBrains Mono" fontSize="9" fill="var(--accent)" letterSpacing="0.04em">GAIN</text>
              <text x="0" y="20" fontFamily="Instrument Serif" fontSize="22" fill="var(--accent)">x150</text>
              <text x="0" y="34" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-mute)">small push</text>
              <text x="0" y="44" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-mute)">= big flow</text>
            </g>
          )}

          {/* Current label */}
          <text x="185" y="305" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)">
            I_C = {s.flow === 0 ? '0' : s.flow < 0.3 ? 'small' : s.flow < 0.8 ? 'beta x I_B' : 'max'}
          </text>
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
