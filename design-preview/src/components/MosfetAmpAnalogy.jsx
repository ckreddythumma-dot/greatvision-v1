'use client'
import { useState } from 'react'

const STATES = [
  { id: 'whisper', coneSize: 0.2, waveCount: 1, label: 'Whisper in', color: 'var(--ink-mute)',
    caption: 'A tiny sound into the microphone. The speaker reproduces it faithfully, just louder. Like a small-signal amplifier — clean gain, no distortion.' },
  { id: 'normal', coneSize: 0.6, waveCount: 3, label: 'Normal voice', color: 'var(--accent)',
    caption: 'Normal speech level. The speaker amplifies clearly. The output is an inverted, scaled copy of the input. Linear region — this is where amplifiers are designed to operate.' },
  { id: 'shout', coneSize: 1.0, waveCount: 5, label: 'Shouting', color: 'var(--bad)',
    caption: 'Screaming into the mic. The speaker distorts — peaks are flattened, crackle appears. Like clipping — the output hits V_DD or ground and cannot go further. Information is lost.' },
]

export default function MosfetAmpAnalogy() {
  const [idx, setIdx] = useState(0)
  const s = STATES[idx]

  return (
    <div className="watertap">
      <div className="watertap__stage">
        <svg viewBox="0 0 400 300" className="watertap__svg">
          {/* Microphone (input) */}
          <g transform="translate(60, 120)">
            <rect x="-8" y="20" width="16" height="40" rx="3" fill="var(--surface-2)" stroke="var(--rule-strong)"/>
            <rect x="-12" y="0" width="24" height="24" rx="12" fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="1.5"/>
            <line x1="-3" y1="8" x2="3" y2="8" stroke="var(--ink-mute)" strokeWidth="1"/>
            <line x1="-3" y1="12" x2="3" y2="12" stroke="var(--ink-mute)" strokeWidth="1"/>
            <line x1="-3" y1="16" x2="3" y2="16" stroke="var(--ink-mute)" strokeWidth="1"/>
          </g>
          <text x="60" y="105" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.06em">INPUT</text>
          <text x="60" y="185" textAnchor="middle" fontFamily="Instrument Serif" fontSize="11" fill="var(--ink-mute)" fontStyle="italic">(microphone)</text>

          {/* Input sound waves */}
          {Array.from({ length: s.waveCount }).map((_, i) => (
            <path key={`iw${i}`}
              d={`M ${30 - i * 10} ${110 + i * 5} Q ${30 - i * 10 - 8} ${130} ${30 - i * 10} ${150 - i * 5}`}
              fill="none" stroke={s.color} strokeWidth="1.5" opacity={0.4 - i * 0.08}>
              <animate attributeName="opacity" values={`${0.6 - i * 0.1};${0.2};${0.6 - i * 0.1}`}
                       dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite"/>
            </path>
          ))}

          {/* Amplifier box */}
          <g transform="translate(155, 105)">
            <polygon points="0,0 90,30 0,60" fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="1.5"/>
            <text x="28" y="35" fontFamily="JetBrains Mono" fontSize="10" fill="var(--accent)" letterSpacing="0.04em">A_v</text>
          </g>
          <text x="200" y="95" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--accent)" letterSpacing="0.06em">AMPLIFIER</text>

          {/* Connection lines */}
          <line x1="72" y1="135" x2="155" y2="135" stroke="var(--ink-mute)" strokeWidth="1.5"/>
          <line x1="245" y1="135" x2="280" y2="135" stroke="var(--ink-mute)" strokeWidth="1.5"/>

          {/* Speaker (output) */}
          <g transform="translate(310, 110)">
            <rect x="0" y="10" width="20" height="30" rx="2" fill="var(--surface-2)" stroke="var(--rule-strong)"/>
            <path d={`M 20 ${10 - s.coneSize * 8} L ${45 + s.coneSize * 15} ${-5 - s.coneSize * 12} L ${45 + s.coneSize * 15} ${55 + s.coneSize * 12} L 20 ${40 + s.coneSize * 8} Z`}
                  fill="var(--surface)" stroke="var(--rule-strong)" strokeWidth="1.5"
                  style={{transition: 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)'}}/>
          </g>
          <text x="335" y="100" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)" letterSpacing="0.06em">OUTPUT</text>
          <text x="335" y="185" textAnchor="middle" fontFamily="Instrument Serif" fontSize="11" fill="var(--ink-mute)" fontStyle="italic">(speaker)</text>

          {/* Output sound waves */}
          {Array.from({ length: Math.ceil(s.waveCount * 1.5) }).map((_, i) => (
            <path key={`ow${i}`}
              d={`M ${375 + i * 8} ${105 - s.coneSize * i * 3} Q ${380 + i * 8} ${135} ${375 + i * 8} ${165 + s.coneSize * i * 3}`}
              fill="none" stroke={s.color} strokeWidth={2 - i * 0.2} opacity={0.5 - i * 0.06}>
              <animate attributeName="opacity" values={`${0.7 - i * 0.08};${0.2};${0.7 - i * 0.08}`}
                       dur={`${0.6 + i * 0.15}s`} repeatCount="indefinite"/>
            </path>
          ))}

          {/* Distortion crackle for clipping */}
          {s.id === 'shout' && (
            <g>
              <path d="M 370 120 L 378 115 L 372 125 L 382 118" stroke="var(--bad)" strokeWidth="1.5" fill="none">
                <animate attributeName="opacity" values="0;1;0" dur="0.3s" repeatCount="indefinite"/>
              </path>
              <path d="M 375 145 L 383 140 L 377 150 L 387 143" stroke="var(--bad)" strokeWidth="1.5" fill="none">
                <animate attributeName="opacity" values="0.5;1;0" dur="0.4s" repeatCount="indefinite"/>
              </path>
              <text x="385" y="170" fontFamily="JetBrains Mono" fontSize="8" fill="var(--bad)" letterSpacing="0.06em">
                CLIPPING
              </text>
            </g>
          )}

          {/* Gain indicator */}
          <g transform="translate(190, 200)">
            <text x="0" y="0" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-faint)">GAIN</text>
            <text x="0" y="20" textAnchor="middle" fontFamily="Instrument Serif" fontSize="20" fill={s.color}>
              {s.id === 'whisper' ? 'x10 (clean)' : s.id === 'normal' ? 'x10 (linear)' : 'x10 (clipped)'}
            </text>
          </g>

          {/* Signal quality indicator */}
          <text x="200" y="265" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)">
            THD = {s.id === 'whisper' ? '< 0.01%' : s.id === 'normal' ? '< 1%' : '> 10%'}
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
