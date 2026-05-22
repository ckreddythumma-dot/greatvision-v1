'use client'
import { mosfetID } from '@/lib/physics'

export default function MosfetIVCurve({ vgs, vds, vt = 0.3, k = 25, height = 220 }) {
  const W = 520, H = height
  const pad = { l: 44, r: 18, t: 12, b: 28 }
  const xMax = 1.5, yMax = 7
  const xToPx = (x) => pad.l + (x / xMax) * (W - pad.l - pad.r)
  const yToPx = (y) => H - pad.b - (y / yMax) * (H - pad.t - pad.b)

  const families = [0.3, 0.5, 0.7, 0.9, 1.1]
  const samples = (v) => {
    const pts = []
    for (let x = 0; x <= xMax + 0.001; x += 0.02) pts.push([x, mosfetID(v, x, vt, k)])
    return pts
  }

  const boundaryPath = (() => {
    const pts = []
    for (let v = vt + 0.01; v <= 1.2; v += 0.02) {
      const x = v - vt
      if (x <= xMax) pts.push(`${xToPx(x)},${yToPx(mosfetID(v, x, vt, k))}`)
    }
    return 'M ' + pts.join(' L ')
  })()

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%">
      <g stroke="var(--rule)" strokeWidth="0.5">
        {[0,1,2,3,4,5,6,7].map(y => (
          <line key={y} x1={pad.l} y1={yToPx(y)} x2={W-pad.r} y2={yToPx(y)}/>
        ))}
        {[0,0.3,0.6,0.9,1.2,1.5].map((x,i) => (
          <line key={i} x1={xToPx(x)} y1={pad.t} x2={xToPx(x)} y2={H-pad.b}/>
        ))}
      </g>
      <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-mute)">
        <text x={W/2} y={H-6} textAnchor="middle">V_DS (V)</text>
        <text x={12} y={pad.t + 8}>I_D (mA)</text>
        {[0,2,4,6].map(y => <text key={y} x={pad.l-6} y={yToPx(y)+3} textAnchor="end">{y}</text>)}
        {[0,0.5,1.0,1.5].map((x,i) => <text key={i} x={xToPx(x)} y={H-pad.b+14} textAnchor="middle">{x.toFixed(1)}</text>)}
      </g>
      {families.map((v, i) => {
        const pts = samples(v).map(([x,y]) => `${xToPx(x)},${yToPx(y)}`).join(' ')
        const isCurrent = Math.abs(v - Math.round(vgs * 10)/10) < 0.06
        return (
          <g key={i}>
            <polyline points={pts} fill="none"
              stroke={isCurrent ? 'var(--accent)' : 'var(--ink-mute)'}
              strokeOpacity={isCurrent ? 1 : 0.35}
              strokeWidth={isCurrent ? 2 : 1}/>
            <text x={W-pad.r-2} y={yToPx(mosfetID(v, xMax, vt, k))+3} textAnchor="end"
              fontFamily="JetBrains Mono" fontSize="10"
              fill={isCurrent ? 'var(--accent-ink)' : 'var(--ink-mute)'}>
              V_GS={v.toFixed(1)}
            </text>
          </g>
        )
      })}
      <path d={boundaryPath} stroke="var(--ink)" strokeDasharray="3 3" strokeWidth="1" fill="none" opacity="0.5"/>
      <g>
        <line x1={xToPx(vds)} y1={pad.t} x2={xToPx(vds)} y2={H-pad.b} stroke="var(--ink)" strokeOpacity="0.15"/>
        <circle cx={xToPx(vds)} cy={yToPx(mosfetID(vgs, vds, vt, k))} r="5" fill="var(--ink)"/>
        <circle cx={xToPx(vds)} cy={yToPx(mosfetID(vgs, vds, vt, k))} r="11" fill="var(--accent)" fillOpacity="0.18"/>
      </g>
    </svg>
  )
}
