// =================================================================
// MOSFET Cross-Section Viz — with moving electrons, annotation pointers,
// and auto-cycle mode for the landing hero.
// =================================================================
const { useState, useEffect, useMemo, useRef } = React;

function mosfetRegion(vgs, vds, vt = 0.3) {
  if (vgs < vt) return 'cutoff';
  if (Math.abs(vgs - vt) < 0.005) return 'threshold';
  if (vds < vgs - vt) return 'linear';
  return 'saturation';
}

function mosfetID(vgs, vds, vt = 0.3, k = 25) {
  if (vgs < vt) return 0;
  const ov = vgs - vt;
  if (vds < ov) return k * (ov * vds - (vds * vds) / 2);
  return (k / 2) * ov * ov;
}

const REGION_LABEL = {
  cutoff:     'Cutoff · transistor is OFF',
  threshold:  'Threshold · channel forming',
  linear:     'Linear · acts like a resistor',
  saturation: 'Saturation · channel pinched off',
};

const REGION_NOTE = {
  cutoff:     'Gate voltage is below V_t. No electrons in the channel. The transistor passes no current.',
  threshold:  'Gate voltage is exactly at V_t. The first electrons appear right under the oxide.',
  linear:     'Channel is full and uniform. Current grows almost linearly as V_DS rises. Used for analog switches.',
  saturation: 'Channel is full near source but pinched off near drain. Current is set by V_GS only. Used for amplifiers and digital switching.',
};

// Deterministic seeded dot grid
function seedDots(n, w, h, salt = 0) {
  const out = [];
  let s = salt + 9301;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const x = (s / 233280) * w;
    s = (s * 9301 + 49297) % 233280;
    const y = (s / 233280) * h;
    out.push([x, y]);
  }
  return out;
}

// Animated electron particles flowing through the channel
function useElectronFlow(active, count) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active || count === 0) return;
    let raf;
    const start = performance.now();
    const loop = (now) => {
      setT(((now - start) / 1500) % 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, count]);
  return t;
}

window.MOSFETViz = function MOSFETViz(props) {
  const {
    size = 'lg',
    initialVGS = 0.50,
    initialVDS = 0.60,
    vt = 0.30,
    k = 25,
    forceRegion = null,
    showControls = true,
    showReadout = true,
    showAnnotations = false,        // when true, show all callouts permanently
    autoCycle = false,              // for hero — cycle through regions
    onChange,
  } = props;

  const [vgs, setVgs] = useState(initialVGS);
  const [vds, setVds] = useState(initialVDS);
  const [pulse, setPulse] = useState(0);
  const [annotateOn, setAnnotateOn] = useState(showAnnotations);
  const [hoveredPart, setHoveredPart] = useState(null);
  const prevRegion = useRef(mosfetRegion(initialVGS, initialVDS, vt));

  // ---- auto cycle for hero ----
  useEffect(() => {
    if (!autoCycle) return;
    const cycles = [
      { vgs: 0.15, vds: 0.60 }, // cutoff
      { vgs: 0.30, vds: 0.60 }, // threshold
      { vgs: 0.55, vds: 0.18 }, // linear
      { vgs: 0.85, vds: 0.70 }, // saturation
    ];
    let i = 0;
    const id = setInterval(() => {
      const c = cycles[i % cycles.length];
      setVgs(c.vgs); setVds(c.vds);
      i++;
    }, 2200);
    return () => clearInterval(id);
  }, [autoCycle]);

  // forced region from tweaks
  useEffect(() => {
    if (!forceRegion) return;
    if (forceRegion === 'cutoff')     { setVgs(0.15); setVds(0.40); }
    if (forceRegion === 'threshold')  { setVgs(0.30); setVds(0.40); }
    if (forceRegion === 'linear')     { setVgs(0.70); setVds(0.20); }
    if (forceRegion === 'saturation') { setVgs(0.90); setVds(0.80); }
  }, [forceRegion]);

  const region = mosfetRegion(vgs, vds, vt);
  const id_mA = mosfetID(vgs, vds, vt, k);

  useEffect(() => {
    if (prevRegion.current === 'cutoff' && region !== 'cutoff') {
      setPulse(p => p + 1);
    }
    prevRegion.current = region;
    onChange && onChange({ vgs, vds, region, id_mA });
  }, [region, vgs, vds]);

  // ---- geometry ----
  const W = 640, H = 420;
  const bodyX = 60, bodyY = 90, bodyW = 520, bodyH = 260;
  const channelY = 170, channelH = 40;
  const oxideY = 140, oxideH = 28;
  const gateY = 96,  gateH = 42;
  const sX = 78, sW = 70, dX = 492, dW = 70;
  const gateX = 200, gateW = 240;

  const channelOpacity =
    region === 'cutoff'     ? 0.05 :
    region === 'threshold'  ? 0.30 :
    region === 'linear'     ? 0.92 :
                              0.92;

  const pinch = region === 'saturation';
  const pinchPath = (() => {
    const x0 = gateX, x1 = gateX + gateW;
    const top = channelY, bot = channelY + channelH;
    if (!pinch) {
      return `M ${x0} ${top} L ${x1} ${top} L ${x1} ${bot} L ${x0} ${bot} Z`;
    }
    const taper = channelH - 4;
    return `M ${x0} ${top} L ${x1} ${top + taper * 0.78} L ${x1} ${bot - 4} L ${x0} ${bot} Z`;
  })();

  // electron count
  const electronCount = region === 'cutoff' ? 0
    : region === 'threshold' ? 14
    : region === 'linear' ? 70
    : 60;
  const staticElectrons = useMemo(() => seedDots(120, gateW, channelH, 7), []);

  // flowing electrons — move from drain to source when conducting
  const flow = useElectronFlow(region === 'linear' || region === 'saturation', 8);
  const flowingElectrons = useMemo(() => {
    return [0, 0.13, 0.27, 0.4, 0.55, 0.68, 0.82].map((phase, i) => ({
      phase,
      y: channelY + 12 + (i % 3) * 8,
    }));
  }, []);

  const showCurrent = region === 'linear' || region === 'saturation';

  const onVgs = (v) => setVgs(Math.max(0, Math.min(1.2, +v)));
  const onVds = (v) => setVds(Math.max(0, Math.min(1.5, +v)));

  // ---- annotation callouts (positioned) ----
  // each has: id, label, def, anchor point on svg, callout target offset
  const callouts = [
    { id: 'gate',    label: 'Gate (G)',   def: 'The control knob. Apply a voltage here to turn the channel on or off.', ax: gateX + gateW/2, ay: gateY + gateH/2, lx: 360, ly: 30 },
    { id: 'oxide',   label: 'Oxide',      def: 'Thin glass layer (SiO₂). Insulates the gate from the channel. Punctures if V_GS > 1.2 V.', ax: gateX + 40, ay: oxideY + 14, lx: 80, ly: 30 },
    { id: 'channel', label: 'Channel',    def: 'A thin sheet of electrons. Forms only when V_GS exceeds V_t. This is what carries the current.', ax: gateX + gateW/2, ay: channelY + channelH/2, lx: 230, ly: 320 },
    { id: 'source',  label: 'Source (S)', def: 'Where electrons come from. Heavily doped n-type silicon. Held at 0 V.', ax: sX + sW/2, ay: channelY + channelH/2, lx: 50, ly: 380 },
    { id: 'drain',   label: 'Drain (D)', def: 'Where electrons leave. Held at V_DS. Higher voltage pulls electrons across.', ax: dX + dW/2, ay: channelY + channelH/2, lx: 560, ly: 380 },
    { id: 'sub',     label: 'Substrate', def: 'The base silicon (p-type). Provides the body. Connects to ground in most circuits.', ax: bodyX + bodyW - 60, ay: bodyY + bodyH - 40, lx: 540, ly: 200 },
  ];

  return (
    <div className="mosfet-viz" data-size={size} data-region={region}>
      <div className="mosfet-viz__stage">
        <svg viewBox={`0 0 ${W} ${H + (annotateOn ? 40 : 0)}`} width="100%" preserveAspectRatio="xMidYMid meet" className="mosfet-svg">
          <defs>
            <linearGradient id="oxideGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95"/>
              <stop offset="1" stopColor="#E6E2D6" stopOpacity="0.85"/>
            </linearGradient>
            <pattern id="gateHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(22,22,19,0.55)" strokeWidth="1"/>
            </pattern>
            <radialGradient id="electronGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="var(--accent)" stopOpacity="0.85"/>
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
            </radialGradient>
            <filter id="thresholdGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6"/>
            </filter>
            <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink)"/>
            </marker>
          </defs>

          {/* measurement ticks */}
          <g opacity="0.18">
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <line key={i} x1={bodyX + i*65} y1={bodyY + bodyH + 16} x2={bodyX + i*65} y2={bodyY + bodyH + 22} stroke="var(--ink)" strokeWidth="1"/>
            ))}
            <line x1={bodyX} y1={bodyY + bodyH + 19} x2={bodyX + bodyW} y2={bodyY + bodyH + 19} stroke="var(--ink)" strokeWidth="0.5"/>
          </g>

          {/* substrate */}
          <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} fill="#F0EBDE" stroke="rgba(22,22,19,0.55)" strokeWidth="1"/>
          <g opacity="0.55">
            {Array.from({length: 110}).map((_, i) => {
              const x = bodyX + 14 + (i % 22) * 22;
              const y = channelY + channelH + 18 + Math.floor(i/22) * 22;
              if (y > bodyY + bodyH - 8) return null;
              return <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(22,22,19,0.55)"/>;
            })}
          </g>

          {/* source / drain */}
          <rect x={sX} y={channelY - 6} width={sW} height={channelH + 12} fill={hoveredPart === 'source' ? 'var(--accent-soft)' : '#D9D2BF'} stroke="rgba(22,22,19,0.7)" strokeWidth="1"/>
          <rect x={dX} y={channelY - 6} width={dW} height={channelH + 12} fill={hoveredPart === 'drain' ? 'var(--accent-soft)' : '#D9D2BF'} stroke="rgba(22,22,19,0.7)" strokeWidth="1"/>

          {/* depleted base */}
          <rect x={gateX} y={channelY} width={gateW} height={channelH} fill="rgba(22,22,19,0.04)"/>

          {/* channel inversion layer */}
          <g style={{ transition: 'opacity 250ms ease' }} opacity={channelOpacity}>
            <path d={pinchPath} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.5"/>
            <clipPath id="channelClip"><path d={pinchPath}/></clipPath>
            <g clipPath="url(#channelClip)">
              {staticElectrons.slice(0, electronCount).map(([x,y], i) => (
                <g key={i} transform={`translate(${gateX + x},${channelY + y})`}>
                  <circle r="3.5" fill="url(#electronGlow)"/>
                  <circle r="1.4" fill="var(--accent)"/>
                </g>
              ))}
            </g>
          </g>

          {/* FLOWING electrons — moving particles from drain to source */}
          {showCurrent && (
            <g clipPath="url(#channelClip)">
              {flowingElectrons.map((e, i) => {
                const p = (flow + e.phase) % 1;
                const x = (dX + dW/2) + (sX + sW/2 - dX - dW/2) * p;
                const opacity = p < 0.05 || p > 0.95 ? 0 : 1;
                return (
                  <g key={i} transform={`translate(${x},${e.y})`}>
                    <circle r="6" fill="var(--accent)" opacity={opacity * 0.25}/>
                    <circle r="2.5" fill="var(--accent)" opacity={opacity}/>
                  </g>
                );
              })}
              {/* big arrow showing current direction */}
              <g>
                <text x={(sX+dX+dW)/2} y={channelY + channelH/2 + 4} textAnchor="middle"
                      fontFamily="JetBrains Mono" fontSize="11" fill="var(--accent-ink)">
                  ← I_D  ({id_mA.toFixed(2)} mA)
                </text>
              </g>
            </g>
          )}

          {/* oxide layer */}
          <rect x={gateX - 4} y={oxideY} width={gateW + 8} height={oxideH}
                fill={hoveredPart === 'oxide' ? 'var(--accent-soft)' : 'url(#oxideGrad)'} stroke="rgba(22,22,19,0.5)" strokeWidth="1"/>
          <g opacity="0.35">
            {[0,1,2,3].map(i => (
              <line key={i} x1={gateX - 4} y1={oxideY + 5 + i*6} x2={gateX + gateW + 4} y2={oxideY + 5 + i*6} stroke="rgba(22,22,19,0.4)" strokeWidth="0.5"/>
            ))}
          </g>

          {/* gate */}
          <rect x={gateX} y={gateY} width={gateW} height={gateH}
                fill={hoveredPart === 'gate' ? 'var(--accent)' : 'url(#gateHatch)'} stroke="rgba(22,22,19,0.85)" strokeWidth="1.2"/>
          <rect x={gateX} y={gateY} width={gateW} height={gateH} fill="rgba(22,22,19,0.04)"/>

          {/* threshold pulse */}
          {pulse > 0 && (
            <rect key={pulse} x={gateX - 4} y={oxideY} width={gateW + 8} height={oxideH}
                  fill="var(--accent)" opacity="0.6" filter="url(#thresholdGlow)">
              <animate attributeName="opacity" from="0.7" to="0" dur="0.9s" fill="freeze"/>
            </rect>
          )}

          {/* base labels */}
          <g fontFamily="JetBrains Mono" fontSize="11" fill="var(--ink-soft)">
            <text x={sX + sW/2} y={channelY - 18} textAnchor="middle">S</text>
            <text x={dX + dW/2} y={channelY - 18} textAnchor="middle">D</text>
            <text x={gateX + gateW/2} y={gateY - 8} textAnchor="middle">G</text>
            <text x={bodyX + bodyW - 40} y={bodyY + bodyH - 12} textAnchor="end" fontSize="9" opacity="0.65">p-substrate (B)</text>
            <text x={sX + sW/2} y={channelY + channelH + 20} textAnchor="middle" fontSize="9" opacity="0.7">n+</text>
            <text x={dX + dW/2} y={channelY + channelH + 20} textAnchor="middle" fontSize="9" opacity="0.7">n+</text>
            <text x={gateX + gateW/2} y={oxideY + 18} textAnchor="middle" fontSize="9" opacity="0.7" fontStyle="italic">SiO₂</text>
          </g>

          {/* lead wires + terminal voltages */}
          <g stroke="rgba(22,22,19,0.75)" strokeWidth="1.2" fill="none">
            <path d={`M ${sX + sW/2} ${channelY - 6} L ${sX + sW/2} ${bodyY - 18}`}/>
            <path d={`M ${dX + dW/2} ${channelY - 6} L ${dX + dW/2} ${bodyY - 18}`}/>
            <path d={`M ${gateX + gateW/2} ${gateY} L ${gateX + gateW/2} ${bodyY - 38}`}/>
          </g>
          <g fontFamily="JetBrains Mono" fontSize="11" fill="var(--ink)">
            <text x={sX + sW/2 - 10} y={bodyY - 22} textAnchor="end">V_S = 0</text>
            <text x={dX + dW/2 + 10} y={bodyY - 22} textAnchor="start">V_DS = {vds.toFixed(2)}</text>
            <text x={gateX + gateW/2} y={bodyY - 44} textAnchor="middle">V_GS = {vgs.toFixed(2)}</text>
          </g>

          {/* V_GS marker bar */}
          <g transform={`translate(${bodyX}, ${bodyY + bodyH + 38})`}>
            <line x1="0" y1="0" x2={bodyW} y2="0" stroke="var(--rule-strong)" strokeWidth="1"/>
            <line x1={(vt/1.2) * bodyW} y1="-6" x2={(vt/1.2) * bodyW} y2="6" stroke="var(--accent)" strokeWidth="1.5"/>
            <text x={(vt/1.2) * bodyW} y="20" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--accent-ink)">V_t = {vt.toFixed(2)}</text>
            <circle cx={(vgs/1.2) * bodyW} cy="0" r="5" fill="var(--ink)"/>
            <text x={(vgs/1.2) * bodyW} y="-12" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink)">V_GS</text>
          </g>

          {/* ---- ANNOTATION CALLOUTS ---- */}
          {annotateOn && callouts.map((c, i) => (
            <g key={c.id} className="callout" onMouseEnter={() => setHoveredPart(c.id)} onMouseLeave={() => setHoveredPart(null)}>
              {/* leader line */}
              <line x1={c.ax} y1={c.ay} x2={c.lx} y2={c.ly} stroke="var(--ink)" strokeWidth="0.8" strokeDasharray="2 3"/>
              {/* dot at anchor */}
              <circle cx={c.ax} cy={c.ay} r="3" fill="var(--accent)" stroke="var(--paper)" strokeWidth="1.5"/>
              {/* label dot */}
              <circle cx={c.lx} cy={c.ly} r="9" fill="var(--ink)"/>
              <text x={c.lx} y={c.ly + 3.5} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="var(--paper)" fontWeight="500">{i+1}</text>
            </g>
          ))}
        </svg>

        {/* readout */}
        {showReadout && (
          <div className="mosfet-viz__readout">
            <div className="readout-row">
              <span className="eyebrow">Region</span>
              <span className={`pill pill--${region === 'cutoff' ? '' : region === 'saturation' ? 'accent' : region === 'threshold' ? 'warn' : 'ok'}`} style={{marginLeft:'auto'}}>
                {REGION_LABEL[region]}
              </span>
            </div>
            <div className="readout-row">
              <span className="eyebrow">I_D</span>
              <span className="mono readout-val">{id_mA.toFixed(2)} <span style={{color:'var(--ink-mute)'}}>mA</span></span>
            </div>
            <div className="readout-note">{REGION_NOTE[region]}</div>
          </div>
        )}
      </div>

      {/* annotation cards under stage */}
      {annotateOn && (
        <div className="callout-cards">
          {callouts.map((c, i) => (
            <div key={c.id} className={`callout-card ${hoveredPart === c.id ? 'is-hot' : ''}`}
                 onMouseEnter={() => setHoveredPart(c.id)} onMouseLeave={() => setHoveredPart(null)}>
              <div className="callout-card__num mono">{i+1}</div>
              <div className="callout-card__body">
                <div className="callout-card__label">{c.label}</div>
                <div className="callout-card__def">{c.def}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* controls */}
      {showControls && (
        <>
          <div className="mosfet-viz__toolbar">
            <button className={`viz-toolbtn ${annotateOn ? 'is-on' : ''}`} onClick={() => setAnnotateOn(a => !a)}>
              {annotateOn ? '✕ hide labels' : '+ show labels'}
            </button>
            <div className="viz-toolbar__quick">
              <span className="eyebrow">jump to →</span>
              <button className="viz-toolbtn-mini" onClick={() => { setVgs(0.15); setVds(0.40); }}>cutoff</button>
              <button className="viz-toolbtn-mini" onClick={() => { setVgs(0.30); setVds(0.40); }}>threshold</button>
              <button className="viz-toolbtn-mini" onClick={() => { setVgs(0.65); setVds(0.18); }}>linear</button>
              <button className="viz-toolbtn-mini" onClick={() => { setVgs(0.90); setVds(0.80); }}>saturation</button>
            </div>
          </div>

          <div className="mosfet-viz__controls">
            <div className="ctrl">
              <div className="ctrl__head">
                <span className="eyebrow">V_GS</span>
                <input className="mono ctrl__num" type="number" step="0.01" min="0" max="1.2"
                  value={vgs.toFixed(2)} onChange={e => onVgs(e.target.value)}/>
                <span className="mono" style={{color:'var(--ink-mute)', fontSize:11}}>V</span>
              </div>
              <input type="range" min="0" max="1.2" step="0.01" value={vgs} onChange={e => onVgs(e.target.value)} className="ctrl__slider"/>
              <div className="ctrl__scale mono">
                <span>0.0</span><span style={{color: 'var(--accent)'}}>V_t 0.30</span><span>1.2</span>
              </div>
            </div>
            <div className="ctrl">
              <div className="ctrl__head">
                <span className="eyebrow">V_DS</span>
                <input className="mono ctrl__num" type="number" step="0.01" min="0" max="1.5"
                  value={vds.toFixed(2)} onChange={e => onVds(e.target.value)}/>
                <span className="mono" style={{color:'var(--ink-mute)', fontSize:11}}>V</span>
              </div>
              <input type="range" min="0" max="1.5" step="0.01" value={vds} onChange={e => onVds(e.target.value)} className="ctrl__slider"/>
              <div className="ctrl__scale mono">
                <span>0.0</span><span>V_DS(sat) = {(vgs - vt).toFixed(2)}</span><span>1.5</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ----- I-V family curve (unchanged) -----
window.MosfetIVCurve = function MosfetIVCurve({ vgs, vds, vt = 0.3, k = 25, height = 220 }) {
  const W = 520, H = height;
  const pad = { l: 44, r: 18, t: 12, b: 28 };
  const xMax = 1.5, yMax = 7;
  const xToPx = (x) => pad.l + (x / xMax) * (W - pad.l - pad.r);
  const yToPx = (y) => H - pad.b - (y / yMax) * (H - pad.t - pad.b);

  const families = [0.3, 0.5, 0.7, 0.9, 1.1];
  const samples = (v) => {
    const pts = [];
    for (let x = 0; x <= xMax + 0.001; x += 0.02) pts.push([x, mosfetID(v, x, vt, k)]);
    return pts;
  };

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
        const pts = samples(v).map(([x,y]) => `${xToPx(x)},${yToPx(y)}`).join(' ');
        const isCurrent = Math.abs(v - Math.round(vgs * 10)/10) < 0.06;
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
        );
      })}
      <path d={(() => {
        const pts = [];
        for (let v = vt + 0.01; v <= 1.2; v += 0.02) {
          const x = v - vt;
          if (x <= xMax) pts.push(`${xToPx(x)},${yToPx(mosfetID(v, x, vt, k))}`);
        }
        return 'M ' + pts.join(' L ');
      })()} stroke="var(--ink)" strokeDasharray="3 3" strokeWidth="1" fill="none" opacity="0.5"/>
      <g>
        <line x1={xToPx(vds)} y1={pad.t} x2={xToPx(vds)} y2={H-pad.b} stroke="var(--ink)" strokeOpacity="0.15"/>
        <circle cx={xToPx(vds)} cy={yToPx(mosfetID(vgs, vds, vt, k))} r="5" fill="var(--ink)"/>
        <circle cx={xToPx(vds)} cy={yToPx(mosfetID(vgs, vds, vt, k))} r="11" fill="var(--accent)" fillOpacity="0.18"/>
      </g>
    </svg>
  );
};
