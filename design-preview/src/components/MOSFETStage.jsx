'use client'
import { useState, useEffect, useMemo } from 'react'
import { mosfetRegion, mosfetID } from '@/lib/physics'

function msDots(cols, rows, sx, sy, dx, dy) {
  const out = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out.push([sx + c * dx, sy + r * dy])
  return out
}

function useFlow(active, speed = 1) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const start = performance.now()
    const loop = (now) => {
      setT(((now - start) / (1800 / speed)) % 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active, speed])
  return t
}

function LabelCallout({ ax, ay, x, y, w, name, def, tone, compact }) {
  const h = compact ? 44 : 70
  const targetX = ax < x ? x : ax > x + w ? x + w : x + w / 2
  const targetY = ay < y ? y : ay > y + h ? y + h : y + h / 2
  return (
    <g className="msstage-callout" data-tone={tone || 'static'}>
      <line x1={ax} y1={ay} x2={targetX} y2={targetY}
            stroke="var(--ink)" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.45"/>
      <circle cx={ax} cy={ay} r="3" fill="var(--accent)" stroke="var(--paper)" strokeWidth="1.5"/>
      <rect x={x} y={y} width={w} height={h}
            fill="var(--paper)" stroke={tone === 'dynamic' ? 'var(--accent)' : 'var(--rule-strong)'}
            strokeWidth={tone === 'dynamic' ? 1.2 : 0.8}/>
      <text x={x + 10} y={y + 16} fontFamily="Instrument Serif" fontStyle="italic" fontSize="15" fill="var(--ink)">
        {name}
      </text>
      <foreignObject x={x + 10} y={y + 22} width={w - 20} height={h - 26}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, lineHeight: 1.45, color: 'var(--ink-mute)',
        }}>
          {def}
        </div>
      </foreignObject>
    </g>
  )
}

const CHANNEL_TEXT = {
  cutoff:     'No channel exists. V_GS is below threshold — the electric field cannot pull electrons to the surface. I_D = 0.',
  threshold:  'Inversion layer just forming. Minority-carrier electrons accumulate at the oxide surface for the first time.',
  linear:     'Full channel formed. Uniform width source-to-drain. Acts like a resistor — I_D grows linearly with V_DS.',
  saturation: 'Channel is pinched off near the drain. Tapered shape. I_D is constant for a given V_GS.',
}
const DEPLETION_TEXT = {
  cutoff:     'Wide depletion zone — no inversion yet.',
  threshold:  'Depletion at its maximum width — about to be capped by inversion.',
  linear:     'Pushed beneath the inversion layer.',
  saturation: 'Widens at the drain end where the channel disappears.',
}

export default function MOSFETStage({ vgs, vds, vt = 0.30, k = 25, showLabels = true, region: regionProp }) {
  const region = regionProp || mosfetRegion(vgs, vds, vt)
  const id_mA = mosfetID(vgs, vds, vt, k)

  const W = 1100, H = 580
  const bX = 200, bY = 180, bW = 700, bH = 320
  const gX = 360, gW = 380, gY = 96, gH = 38
  const oY = 142, oH = 18
  const chY = 168, chH = 32
  const sX = 220, sW = 110, sdY = 156, sdH = 60
  const dX = 770, dW = 110

  const showFullChannel = region === 'linear' || region === 'saturation'
  const showThinChannel = region === 'threshold'
  const pinched = region === 'saturation'
  const conducting = region === 'linear' || region === 'saturation'

  const deplBottom =
    region === 'cutoff' ? bY + 200 :
    region === 'threshold' ? bY + 250 :
    bY + 150
  const deplTop = chY + chH

  const channelPath = (() => {
    const x0 = gX, x1 = gX + gW
    const top = chY, bot = chY + chH
    if (pinched) {
      const px = x1 - 38
      return `M ${x0} ${top} L ${px} ${top + chH - 4} L ${px} ${bot} L ${x0} ${bot} Z`
    }
    return `M ${x0} ${top} L ${x1} ${top} L ${x1} ${bot} L ${x0} ${bot} Z`
  })()
  const pinchX = gX + gW - 38

  const flow = useFlow(conducting, pinched ? 1.2 : 1.0)
  const streamEndX = pinched ? pinchX : (gX + gW)
  const streamStartX = gX
  const streamY = chY + chH / 2
  const streamCount = region === 'linear' ? 11 : region === 'saturation' ? 9 : 0
  const streamLanes = [-6, 0, 6]

  const sweepCount = pinched ? 5 : 0
  const sweepFlow = useFlow(pinched, 1.6)

  const thresholdElectrons = useMemo(() => {
    const arr = []
    for (let i = 0; i < 8; i++) arr.push([gX + 40 + i * (gW - 80) / 7, chY + 5])
    return arr
  }, [])

  const atoms = useMemo(() =>
    msDots(28, 8, bX + 22, bY + 240, 24, 22).filter(([,y]) => y < bY + bH - 16), [])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet"
         className="msstage-svg" data-region={region} data-labels={showLabels ? 'on' : 'off'}>
      <defs>
        <linearGradient id="ms-oxide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95"/>
          <stop offset="1" stopColor="#E6E2D6" stopOpacity="0.85"/>
        </linearGradient>
        <pattern id="ms-gate-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(22,22,19,0.55)" strokeWidth="1"/>
        </pattern>
        <pattern id="ms-deplete-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(22,22,19,0.18)" strokeWidth="1"/>
        </pattern>
        <filter id="ms-thresh-glow" x="-40%" y="-100%" width="180%" height="300%">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <marker id="ms-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink)"/>
        </marker>
      </defs>

      {/* measurement frame */}
      <g opacity="0.18" stroke="var(--ink)" strokeWidth="0.5">
        <line x1={bX - 14} y1={bY} x2={bX - 14} y2={bY + bH}/>
        <line x1={bX - 18} y1={bY} x2={bX - 10} y2={bY}/>
        <line x1={bX - 18} y1={bY + bH} x2={bX - 10} y2={bY + bH}/>
      </g>
      <text x={bX - 22} y={bY + bH / 2} textAnchor="end" fontFamily="JetBrains Mono" fontSize="10"
            fill="var(--ink-mute)" transform={`rotate(-90 ${bX - 22} ${bY + bH/2})`}>
        ~ 3 nm channel · die thickness
      </text>

      {/* substrate */}
      <rect x={bX} y={bY} width={bW} height={bH} fill="#F0EBDE" stroke="rgba(22,22,19,0.55)" strokeWidth="1"/>
      <g opacity="0.5">
        {atoms.map(([x,y], i) => <circle key={i} cx={x} cy={y} r="1.4" fill="rgba(22,22,19,0.6)"/>)}
      </g>

      {/* depletion region */}
      <g style={{ transition: 'opacity 200ms ease-out' }}>
        <rect x={gX} y={deplTop} width={gW} height={Math.max(0, deplBottom - deplTop)}
              fill="url(#ms-deplete-hatch)" opacity="0.9"/>
        <rect x={gX} y={deplTop} width={gW} height={Math.max(0, deplBottom - deplTop)}
              fill="rgba(22,22,19,0.04)" stroke="rgba(22,22,19,0.18)" strokeDasharray="4 4" strokeWidth="0.8"/>
        {pinched && (
          <rect x={pinchX} y={chY} width={(gX + gW) - pinchX} height={chH + 12}
                fill="url(#ms-deplete-hatch)" opacity="0.9"/>
        )}
      </g>

      {/* source / drain */}
      <rect x={sX} y={sdY} width={sW} height={sdH} fill="#D9D2BF" stroke="rgba(22,22,19,0.7)" strokeWidth="1"/>
      <rect x={dX} y={sdY} width={dW} height={sdH} fill="#D9D2BF" stroke="rgba(22,22,19,0.7)" strokeWidth="1"/>
      <text x={sX + sW / 2} y={sdY + sdH - 8} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)">n+</text>
      <text x={dX + dW / 2} y={sdY + sdH - 8} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)">n+</text>

      {/* channel */}
      {showFullChannel && (
        <g style={{ transition: 'opacity 200ms ease-out' }}>
          <path d={channelPath} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.65"/>
        </g>
      )}

      {/* threshold glow */}
      {showThinChannel && (
        <g>
          <line x1={gX} y1={chY + 2} x2={gX + gW} y2={chY + 2}
                stroke="var(--amber-ink)" strokeWidth="3" filter="url(#ms-thresh-glow)" opacity="0.85"/>
          <line x1={gX} y1={chY + 2} x2={gX + gW} y2={chY + 2}
                stroke="var(--amber-ink)" strokeWidth="1.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite"/>
          </line>
          {thresholdElectrons.map(([x,y], i) => (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <circle r="2.5" fill="var(--amber-ink)" opacity="0.7"/>
            </g>
          ))}
        </g>
      )}

      {/* flowing electrons */}
      {streamCount > 0 && (
        <g>
          {Array.from({length: streamCount}).map((_, i) => {
            const phase = (flow + i / streamCount) % 1
            const x = streamStartX + (streamEndX - streamStartX) * phase
            const lane = streamLanes[i % streamLanes.length]
            const opacity = phase < 0.04 || phase > 0.96 ? 0 : 1
            return (
              <g key={i} transform={`translate(${x}, ${streamY + lane})`}>
                <circle r="5" fill="var(--accent)" opacity={0.22 * opacity}/>
                <circle r="2.4" fill="var(--accent)" opacity={opacity}/>
              </g>
            )
          })}
        </g>
      )}

      {/* post-pinch sweep */}
      {sweepCount > 0 && (
        <g>
          {Array.from({length: sweepCount}).map((_, i) => {
            const phase = (sweepFlow + i / sweepCount) % 1
            const x = pinchX + ((dX + dW/2) - pinchX) * phase
            const y = chY + chH/2 + (i % 2 === 0 ? -3 : 3)
            const opacity = phase < 0.05 || phase > 0.92 ? 0 : 1
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <circle r="6" fill="var(--amber-ink)" opacity={0.25 * opacity}/>
                <circle r="2.2" fill="var(--amber-ink)" opacity={opacity}/>
              </g>
            )
          })}
        </g>
      )}

      {/* oxide */}
      <rect x={gX - 4} y={oY} width={gW + 8} height={oH} fill="url(#ms-oxide)" stroke="rgba(22,22,19,0.5)" strokeWidth="1"/>
      <g opacity="0.35">
        {[0,1,2].map(i => (
          <line key={i} x1={gX - 4} y1={oY + 4 + i*5} x2={gX + gW + 4} y2={oY + 4 + i*5}
                stroke="rgba(22,22,19,0.4)" strokeWidth="0.5"/>
        ))}
      </g>

      {/* gate */}
      <rect x={gX} y={gY} width={gW} height={gH} fill="url(#ms-gate-hatch)" stroke="rgba(22,22,19,0.85)" strokeWidth="1.2"/>
      <rect x={gX} y={gY} width={gW} height={gH} fill="rgba(22,22,19,0.05)"/>

      {/* lead wires */}
      <g stroke="rgba(22,22,19,0.75)" strokeWidth="1.2" fill="none">
        <path d={`M ${sX + sW/2} ${sdY} L ${sX + sW/2} ${bY - 28}`}/>
        <path d={`M ${dX + dW/2} ${sdY} L ${dX + dW/2} ${bY - 28}`}/>
        <path d={`M ${gX + gW/2} ${gY} L ${gX + gW/2} ${bY - 60}`}/>
      </g>
      <g fontFamily="JetBrains Mono" fontSize="11" fill="var(--ink)">
        <text x={sX + sW/2} y={bY - 34} textAnchor="middle">V_S = 0</text>
        <text x={dX + dW/2} y={bY - 34} textAnchor="middle">V_DS = {vds.toFixed(2)} V</text>
        <text x={gX + gW/2} y={bY - 66} textAnchor="middle">V_GS = {vgs.toFixed(2)} V</text>
      </g>

      {/* electron flow arrow */}
      {conducting && (
        <g>
          <line x1={dX - 12} y1={chY - 28} x2={sX + sW + 12} y2={chY - 28}
                stroke="var(--ink)" strokeWidth="1.2" markerEnd="url(#ms-arrow)"/>
          <text x={(sX + sW + dX) / 2} y={chY - 34} textAnchor="middle"
                fontFamily="Instrument Serif" fontStyle="italic" fontSize="14" fill="var(--ink)">
            electron flow  ·  I_D = {id_mA.toFixed(2)} mA
          </text>
        </g>
      )}

      {/* pinch-off marker */}
      {pinched && (
        <g>
          <line x1={pinchX} y1={chY - 6} x2={pinchX} y2={chY + chH + 14}
                stroke="var(--amber-ink)" strokeWidth="1.5" strokeDasharray="3 3"/>
          <circle cx={pinchX} cy={chY + chH - 2} r="6" fill="none" stroke="var(--amber-ink)" strokeWidth="2"/>
          <line x1={pinchX} y1={chY + chH + 14} x2={W - 260} y2={310}
                stroke="var(--amber-ink)" strokeWidth="1"/>
          <g transform={`translate(${W - 260}, 300)`}>
            <rect x="0" y="0" width="240" height="56" fill="var(--amber-soft)" stroke="var(--amber-ink)" strokeWidth="1"/>
            <text x="10" y="18" fontFamily="JetBrains Mono" fontSize="10" fill="var(--amber-ink)" letterSpacing="0.06em">PINCH-OFF POINT</text>
            <text x="10" y="34" fontFamily="Instrument Serif" fontSize="12" fill="var(--ink)" fontStyle="italic">
              where local V_GC = V_t exactly
            </text>
            <text x="10" y="48" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)">
              channel ends · electrons swept by field
            </text>
          </g>
        </g>
      )}

      {/* threshold callout */}
      {showThinChannel && (
        <g>
          <line x1={gX + gW - 60} y1={chY + 2} x2={W - 220} y2={170}
                stroke="var(--amber-ink)" strokeWidth="1"/>
          <g transform={`translate(${W - 260}, 130)`}>
            <rect x="0" y="0" width="240" height="56" fill="var(--amber-soft)" stroke="var(--amber-ink)" strokeWidth="1"/>
            <text x="10" y="18" fontFamily="JetBrains Mono" fontSize="10" fill="var(--amber-ink)" letterSpacing="0.06em">CHANNEL IS BORN HERE</text>
            <text x="10" y="34" fontFamily="Instrument Serif" fontSize="12" fontStyle="italic" fill="var(--ink)">
              oxide–substrate interface
            </text>
            <text x="10" y="48" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)">
              never deeper · always this line
            </text>
          </g>
        </g>
      )}

      {/* labels */}
      {showLabels && (
        <g className="msstage-labels">
          <LabelCallout ax={gX + 30} ay={gY + gH/2} x={48} y={40} w={300}
            name="Gate" def="Metal/poly contact above the oxide. Applying V_GS here creates the field that forms or destroys the channel." />
          <LabelCallout ax={gX + gW - 30} ay={oY + oH/2} x={W - 348} y={40} w={310}
            name="SiO₂ oxide" def="Silicon dioxide insulator — separates gate from channel. Current never flows through it. Above V_BD it ruptures permanently." />
          <LabelCallout ax={gX + 40} ay={chY + chH/2} x={48} y={310} w={300}
            name="Channel" def={CHANNEL_TEXT[region]} tone="dynamic" />
          <LabelCallout ax={sX + sW/2} ay={sdY + sdH} x={48} y={H - 110} w={260}
            name="Source (n+)" def="Heavily doped n-type region. Electrons originate here. Held at 0 V. Width is constant — never changes with input." />
          <LabelCallout ax={dX + dW/2} ay={sdY + sdH} x={W - 308} y={H - 110} w={260}
            name="Drain (n+)" def="Heavily doped n-type region. Electrons are collected here. V_DS is applied here. Width is constant — never changes." />
          <LabelCallout ax={gX + gW - 80} ay={Math.min(deplBottom - 10, bY + bH - 30)} x={W - 308} y={210} w={260}
            name="Depletion region" def={`Carriers pushed away by the gate field — lives in the substrate. ${DEPLETION_TEXT[region]}`} tone="dynamic" />
          <LabelCallout ax={bX + bW - 100} ay={bY + bH - 16} x={W/2 - 150} y={H - 64} w={300} compact
            name="p-substrate" def="The base silicon body — lightly doped p-type. Provides physical structure. The depletion region lives here." />
        </g>
      )}
    </svg>
  )
}
