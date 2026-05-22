'use client'
import { useState } from 'react'

const STATES = [
  { id: 'reverse',  label: 'Sealed shut',     knobAngle: -60, valveOpen: 0,   flowRate: 0,   color: 'var(--ink-mute)',  region: 'Reverse bias' },
  { id: 'zero',     label: 'At rest',          knobAngle: 0,   valveOpen: 0,   flowRate: 0,   color: 'var(--ink-soft)',  region: 'Zero bias' },
  { id: 'weak',     label: 'Cracking open',    knobAngle: 30,  valveOpen: 0.3, flowRate: 0.2, color: 'var(--amber)',     region: 'Forward (weak)' },
  { id: 'strong',   label: 'Wide open',        knobAngle: 70,  valveOpen: 1,   flowRate: 1,   color: 'var(--accent)',    region: 'Forward (strong)' },
]

export default function CheckValveAnalogy() {
  const [idx, setIdx] = useState(0)
  const s = STATES[idx]

  return (
    <div className="valve-analogy" style={{gridColumn:2}}>
      <svg viewBox="0 0 440 260" width="100%" style={{maxWidth:440, display:'block', margin:'0 auto'}}>
        <defs>
          <linearGradient id="pipeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D9D2BF"/>
            <stop offset="1" stopColor="#C4BBAA"/>
          </linearGradient>
        </defs>

        {/* pipe */}
        <rect x="20" y="100" width="400" height="60" rx="4" fill="url(#pipeGrad)" stroke="rgba(22,22,19,0.4)"/>

        {/* water fill */}
        <rect x="22" y="102" width={s.flowRate > 0 ? 396 : 180} height="56" rx="3"
              fill={s.flowRate > 0 ? 'rgba(66,133,244,0.25)' : 'rgba(66,133,244,0.08)'}/>

        {/* valve flap */}
        <g transform={`translate(220, 130)`}>
          <rect x="-4" y="-30" width="8" height="60" rx="2"
                fill={s.valveOpen > 0 ? s.color : 'var(--ink)'}
                opacity={s.valveOpen > 0 ? 0.7 : 0.9}
                transform={`rotate(${s.valveOpen * 70})`}/>
          {s.valveOpen === 0 && (
            <line x1="-20" y1="0" x2="20" y2="0" stroke="var(--bad)" strokeWidth="2" strokeDasharray="4,3" opacity="0.6"/>
          )}
        </g>

        {/* valve housing */}
        <rect x="210" y="85" width="20" height="15" fill="#B0A890" stroke="rgba(22,22,19,0.5)"/>
        <circle cx="220" cy="78" r="12" fill="none" stroke="rgba(22,22,19,0.5)" strokeWidth="1.5"/>
        <line x1="220" y1="78" x2={220 + 10 * Math.cos((s.knobAngle - 90) * Math.PI / 180)}
              y2={78 + 10 * Math.sin((s.knobAngle - 90) * Math.PI / 180)}
              stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"/>

        {/* water drops */}
        {s.flowRate > 0 && Array.from({length: 6}).map((_, i) => (
          <circle key={i} r={2 + s.flowRate * 2} fill="rgba(66,133,244,0.5)" opacity="0.7">
            <animate attributeName="cx" values={`${230};${400}`}
                     dur={`${1.5 - s.flowRate * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.2}s`}/>
            <animate attributeName="cy" values={`${120 + (i % 3) * 8};${125 + ((i+1) % 3) * 6};${120 + (i % 3) * 8}`}
                     dur="0.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.7;0.7;0"
                     dur={`${1.5 - s.flowRate * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.2}s`}/>
          </circle>
        ))}

        {/* labels */}
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)">
          <text x="60" y="95">p-side (holes)</text>
          <text x="310" y="95">n-side (electrons)</text>
          <text x="220" y="58" textAnchor="middle" fontSize="9" letterSpacing="0.06em">BIAS KNOB</text>
        </g>

        {/* state label */}
        <g transform="translate(220, 200)">
          <rect x="-80" y="0" width="160" height="28" rx="3" fill={s.color} opacity="0.12"/>
          <text x="0" y="19" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10"
                fill={s.color} letterSpacing="0.06em">{s.label.toUpperCase()}</text>
        </g>

        {/* reverse: X mark */}
        {s.id === 'reverse' && (
          <g>
            <path d="M 280 115 L 350 145 M 280 145 L 350 115" stroke="var(--bad)" strokeWidth="1.5" opacity="0.5"/>
            <text x="315" y="155" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--bad)">BLOCKED</text>
          </g>
        )}
      </svg>

      <div style={{display:'flex', justifyContent:'center', gap:0, border:'1px solid var(--rule-strong)', maxWidth:440, margin:'12px auto 0'}}>
        {STATES.map((st, i) => (
          <button key={st.id}
                  onClick={() => setIdx(i)}
                  style={{
                    flex:1, padding:'10px 8px', border:'none', borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
                    background: idx === i ? 'var(--ink)' : 'var(--paper)',
                    color: idx === i ? 'var(--paper)' : 'var(--ink-soft)',
                    fontFamily:"'JetBrains Mono', monospace", fontSize:10, letterSpacing:'0.04em',
                    cursor:'pointer', textAlign:'center',
                  }}>
            <div style={{fontSize:8, opacity:0.6, marginBottom:2}}>{st.region}</div>
            {st.label}
          </button>
        ))}
      </div>
    </div>
  )
}
