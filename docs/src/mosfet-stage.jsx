// =================================================================
// MOSFETStage — biology-textbook style cross-section for the Viz tab.
//   • Always-visible labels with two-line definitions
//   • Per-state visual rewrites: cutoff / threshold / linear / saturation
//   • Source/drain widths NEVER change; only the channel and depletion morph
//   • Pinch-off explicitly marked in saturation
//   • Thin glowing inversion line shown at threshold
// =================================================================
const { useState: msUseState, useEffect: msUseEffect, useMemo: msUseMemo, useRef: msUseRef } = React;

// --- physics helpers (kept in sync with mosfet-viz.jsx) ---
function msRegion(vgs, vds, vt = 0.3) {
  if (vgs < vt - 0.005) return 'cutoff';
  if (Math.abs(vgs - vt) < 0.02) return 'threshold';
  if (vds < vgs - vt) return 'linear';
  return 'saturation';
}
function msID(vgs, vds, vt = 0.3, k = 25) {
  if (vgs < vt) return 0;
  const ov = vgs - vt;
  if (vds < ov) return k * (ov * vds - (vds * vds) / 2);
  return (k / 2) * ov * ov;
}

// deterministic dot grid for substrate atoms
function msDots(cols, rows, sx, sy, dx, dy) {
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push([sx + c * dx, sy + r * dy]);
    }
  }
  return out;
}

// flow timer
function msFlow(active, speed = 1) {
  const [t, setT] = msUseState(0);
  msUseEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const loop = (now) => {
      setT(((now - start) / (1800 / speed)) % 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, speed]);
  return t;
}

// =================================================================
window.MOSFETStage = function MOSFETStage({
  vgs, vds, vt = 0.30, k = 25,
  showLabels = true,
  region: regionProp,
}) {
  const region = regionProp || msRegion(vgs, vds, vt);
  const id_mA = msID(vgs, vds, vt, k);

  // --- canvas geometry ---
  const W = 1100, H = 580;

  // substrate body
  const bX = 200, bY = 180, bW = 700, bH = 320;

  // gate / oxide / channel band (constant geometry)
  const gX = 360, gW = 380;
  const gY = 96, gH = 38;
  const oY = 142, oH = 18;
  const chY = 168;          // top of channel band (oxide-substrate interface)
  const chH = 32;           // channel band thickness

  // source / drain (WIDTHS NEVER CHANGE)
  const sX = 220, sW = 110, sdY = 156, sdH = 60;
  const dX = 770, dW = 110;

  // --- per-state appearance ---
  const showFullChannel  = region === 'linear' || region === 'saturation';
  const showThinChannel  = region === 'threshold';
  const pinched          = region === 'saturation';
  const conducting       = region === 'linear' || region === 'saturation';

  // depletion region — widens as VGS approaches Vt, then "lives under" the inversion layer
  // visual depth (px): cutoff narrow→ threshold maximum → linear/sat shrinks behind channel
  const deplBottom =
    region === 'cutoff'     ? bY + 200 :
    region === 'threshold'  ? bY + 250 :
    region === 'linear'     ? bY + 150 :
                              bY + 150;
  const deplTop = chY + chH;

  // channel shape: rectangular vs tapered (saturation)
  const channelPath = (() => {
    const x0 = gX, x1 = gX + gW;
    const top = chY, bot = chY + chH;
    if (pinched) {
      // tapered: full at source-side, narrowing to ~0 a touch before drain
      const pinchX = x1 - 38;          // pinch-off point
      const innerTop = top + chH - 4;  // narrow strip at pinch
      return `M ${x0} ${top}
              L ${pinchX} ${innerTop}
              L ${pinchX} ${bot}
              L ${x0} ${bot} Z`;
    }
    return `M ${x0} ${top} L ${x1} ${top} L ${x1} ${bot} L ${x0} ${bot} Z`;
  })();
  const pinchX = gX + gW - 38;

  // --- electrons ---
  const flow = msFlow(conducting, pinched ? 1.2 : 1.0);

  // particle stream from source-end to drain-end (or to pinch point in saturation)
  const streamEndX = pinched ? pinchX : (gX + gW);
  const streamStartX = gX;
  const streamY = chY + chH / 2;

  const streamCount = region === 'linear' ? 11 : region === 'saturation' ? 9 : 0;
  const streamLanes = [-6, 0, 6];

  // post-pinch sweep across depletion
  const sweepCount = pinched ? 5 : 0;
  const sweepFlow = msFlow(pinched, 1.6);

  // threshold sparse electrons (just barely there)
  const thresholdElectrons = msUseMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      arr.push([gX + 40 + i * (gW - 80) / 7, chY + 5]);
    }
    return arr;
  }, []);

  // substrate atoms
  const atoms = msUseMemo(() => msDots(28, 8, bX + 22, bY + 240, 24, 22).filter(([x,y]) => y < bY + bH - 16), []);

  // --- per-state TEXT (the "labels rewrite" requirement) ---
  const channelText = {
    cutoff:     'No channel exists. V_GS is below threshold — the electric field cannot pull electrons to the surface. I_D = 0.',
    threshold:  'Inversion layer just forming. Minority-carrier electrons accumulate at the oxide surface for the first time.',
    linear:     'Full channel formed. Uniform width source-to-drain. Acts like a resistor — I_D grows linearly with V_DS.',
    saturation: 'Channel is pinched off near the drain. Tapered shape. I_D is constant for a given V_GS.',
  }[region];

  const depletionText = {
    cutoff:     'Wide depletion zone — no inversion yet.',
    threshold:  'Depletion at its maximum width — about to be capped by inversion.',
    linear:     'Pushed beneath the inversion layer.',
    saturation: 'Widens at the drain end where the channel disappears.',
  }[region];

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
        <radialGradient id="ms-electron" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.9"/>
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
        </radialGradient>
        <filter id="ms-thresh-glow" x="-40%" y="-100%" width="180%" height="300%">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <marker id="ms-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink)"/>
        </marker>
        <marker id="ms-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--amber-ink)"/>
        </marker>
      </defs>

      {/* === measurement frame === */}
      <g opacity="0.18" stroke="var(--ink)" strokeWidth="0.5">
        <line x1={bX - 14} y1={bY} x2={bX - 14} y2={bY + bH}/>
        <line x1={bX - 18} y1={bY} x2={bX - 10} y2={bY}/>
        <line x1={bX - 18} y1={bY + bH} x2={bX - 10} y2={bY + bH}/>
      </g>
      <text x={bX - 22} y={bY + bH / 2} textAnchor="end" fontFamily="JetBrains Mono" fontSize="10"
            fill="var(--ink-mute)" transform={`rotate(-90 ${bX - 22} ${bY + bH/2})`}>
        ~ 3 nm channel · die thickness
      </text>

      {/* === substrate === */}
      <rect x={bX} y={bY} width={bW} height={bH} fill="#F0EBDE" stroke="rgba(22,22,19,0.55)" strokeWidth="1"/>

      {/* substrate atoms */}
      <g opacity="0.5">
        {atoms.map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="1.4" fill="rgba(22,22,19,0.6)"/>
        ))}
      </g>

      {/* === depletion region === */}
      <g style={{ transition: 'all 240ms ease' }}>
        <rect x={gX} y={deplTop} width={gW} height={Math.max(0, deplBottom - deplTop)}
              fill="url(#ms-deplete-hatch)" opacity="0.9"/>
        <rect x={gX} y={deplTop} width={gW} height={Math.max(0, deplBottom - deplTop)}
              fill="rgba(22,22,19,0.04)" stroke="rgba(22,22,19,0.18)" strokeDasharray="4 4" strokeWidth="0.8"/>
        {pinched && (
          // extra depletion at drain end where channel disappears
          <rect x={pinchX} y={chY} width={(gX + gW) - pinchX} height={chH + 12}
                fill="url(#ms-deplete-hatch)" opacity="0.9"/>
        )}
      </g>

      {/* === source / drain (CONSTANT WIDTHS) === */}
      <rect x={sX} y={sdY} width={sW} height={sdH} fill="#D9D2BF" stroke="rgba(22,22,19,0.7)" strokeWidth="1"/>
      <rect x={dX} y={sdY} width={dW} height={sdH} fill="#D9D2BF" stroke="rgba(22,22,19,0.7)" strokeWidth="1"/>
      <text x={sX + sW / 2} y={sdY + sdH - 8} textAnchor="middle"
            fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">n+</text>
      <text x={dX + dW / 2} y={sdY + sdH - 8} textAnchor="middle"
            fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">n+</text>

      {/* === CHANNEL (varies per state) === */}
      {showFullChannel && (
        <g style={{ transition: 'opacity 240ms ease' }}>
          <path d={channelPath} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.65"/>
          <clipPath id="ms-channel-clip"><path d={channelPath}/></clipPath>
        </g>
      )}

      {/* threshold: thin glowing line at the oxide-substrate interface */}
      {showThinChannel && (
        <g>
          <line x1={gX} y1={chY + 2} x2={gX + gW} y2={chY + 2}
                stroke="var(--amber-ink)" strokeWidth="3" filter="url(#ms-thresh-glow)" opacity="0.85"/>
          <line x1={gX} y1={chY + 2} x2={gX + gW} y2={chY + 2}
                stroke="var(--amber-ink)" strokeWidth="1.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite"/>
          </line>
          {/* sparse electrons just on the line */}
          {thresholdElectrons.map(([x,y], i) => (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <circle r="2.5" fill="var(--amber-ink)" opacity="0.7"/>
            </g>
          ))}
        </g>
      )}

      {/* flowing electron stream */}
      {streamCount > 0 && (
        <g>
          {Array.from({length: streamCount}).map((_, i) => {
            const phase = (flow + i / streamCount) % 1;
            const x = streamStartX + (streamEndX - streamStartX) * phase;
            const lane = streamLanes[i % streamLanes.length];
            const opacity = phase < 0.04 || phase > 0.96 ? 0 : 1;
            return (
              <g key={i} transform={`translate(${x}, ${streamY + lane})`}>
                <circle r="5" fill="var(--accent)" opacity={0.22 * opacity}/>
                <circle r="2.4" fill="var(--accent)" opacity={opacity}/>
              </g>
            );
          })}
        </g>
      )}

      {/* post-pinch field-driven sweep (amber, faster) */}
      {sweepCount > 0 && (
        <g>
          {Array.from({length: sweepCount}).map((_, i) => {
            const phase = (sweepFlow + i / sweepCount) % 1;
            const x = pinchX + ((dX + dW/2) - pinchX) * phase;
            const y = chY + chH/2 + (i % 2 === 0 ? -3 : 3);
            const opacity = phase < 0.05 || phase > 0.92 ? 0 : 1;
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <circle r="6" fill="var(--amber-ink)" opacity={0.25 * opacity}/>
                <circle r="2.2" fill="var(--amber-ink)" opacity={opacity}/>
              </g>
            );
          })}
        </g>
      )}

      {/* === oxide === */}
      <rect x={gX - 4} y={oY} width={gW + 8} height={oH} fill="url(#ms-oxide)" stroke="rgba(22,22,19,0.5)" strokeWidth="1"/>
      <g opacity="0.35">
        {[0,1,2].map(i => (
          <line key={i} x1={gX - 4} y1={oY + 4 + i*5} x2={gX + gW + 4} y2={oY + 4 + i*5}
                stroke="rgba(22,22,19,0.4)" strokeWidth="0.5"/>
        ))}
      </g>

      {/* === gate === */}
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

      {/* electron-flow direction arrow (in conducting states) */}
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

      {/* === PINCH-OFF MARKER (saturation only) === */}
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
            <text x="10" y="48" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-soft)">
              channel ends · electrons swept by field
            </text>
          </g>
        </g>
      )}

      {/* === THRESHOLD CALLOUT (threshold only) === */}
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
            <text x="10" y="48" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-soft)">
              never deeper · always this line
            </text>
          </g>
        </g>
      )}

      {/* === ALWAYS-VISIBLE LABEL CALLOUTS === */}
      {showLabels && (
        <g className="msstage-labels">
          {/* GATE — top-left */}
          <LabelCallout
            ax={gX + 30} ay={gY + gH/2}
            x={48} y={40} w={300}
            name="Gate"
            def="Metal/poly contact above the oxide. Applying V_GS here creates the field that forms or destroys the channel." />

          {/* OXIDE — top-right */}
          <LabelCallout
            ax={gX + gW - 30} ay={oY + oH/2}
            x={W - 348} y={40} w={310}
            name="SiO₂ oxide"
            def="Silicon dioxide insulator — separates gate from channel. Current never flows through it. Above V_BD it ruptures permanently." />

          {/* CHANNEL — middle-left, dynamic text */}
          <LabelCallout
            ax={gX + 40} ay={chY + chH/2}
            x={48} y={310} w={300}
            name="Channel"
            def={channelText}
            tone="dynamic" />

          {/* SOURCE — bottom-left */}
          <LabelCallout
            ax={sX + sW/2} ay={sdY + sdH}
            x={48} y={H - 110} w={260}
            name="Source (n+)"
            def="Heavily doped n-type region. Electrons originate here. Held at 0 V. Width is constant — never changes with input." />

          {/* DRAIN — bottom-right */}
          <LabelCallout
            ax={dX + dW/2} ay={sdY + sdH}
            x={W - 308} y={H - 110} w={260}
            name="Drain (n+)"
            def="Heavily doped n-type region. Electrons are collected here. V_DS is applied here. Width is constant — never changes." />

          {/* DEPLETION — right side, dynamic */}
          <LabelCallout
            ax={gX + gW - 80} ay={Math.min(deplBottom - 10, bY + bH - 30)}
            x={W - 308} y={210} w={260}
            name="Depletion region"
            def={`Carriers pushed away by the gate field — lives in the substrate. ${depletionText}`}
            tone="dynamic" />

          {/* SUBSTRATE — bottom center */}
          <LabelCallout
            ax={bX + bW - 100} ay={bY + bH - 16}
            x={W/2 - 150} y={H - 64} w={300} compact
            name="p-substrate"
            def="The base silicon body — lightly doped p-type. Provides physical structure. The depletion region lives here." />
        </g>
      )}
    </svg>
  );
};

// =================================================================
function LabelCallout({ ax, ay, x, y, w, name, def, tone, compact }) {
  const h = compact ? 44 : 70;
  // attach leader to the nearest edge of the label box
  const cx = x + w / 2;
  const targetX = ax < x ? x : ax > x + w ? x + w : cx;
  const targetY = ay < y ? y : ay > y + h ? y + h : (y + h/2);
  return (
    <g className="msstage-callout" data-tone={tone || 'static'}>
      {/* leader */}
      <line x1={ax} y1={ay} x2={targetX} y2={targetY}
            stroke="var(--ink)" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.45"/>
      <circle cx={ax} cy={ay} r="3" fill="var(--accent)" stroke="var(--paper)" strokeWidth="1.5"/>
      {/* card */}
      <rect x={x} y={y} width={w} height={h}
            fill="var(--paper)" stroke={tone === 'dynamic' ? 'var(--accent)' : 'var(--rule-strong)'}
            strokeWidth={tone === 'dynamic' ? 1.2 : 0.8}/>
      <text x={x + 10} y={y + 16} fontFamily="Instrument Serif" fontStyle="italic" fontSize="15" fill="var(--ink)">
        {name}
      </text>
      <foreignObject x={x + 10} y={y + 22} width={w - 20} height={h - 26}>
        <div xmlns="http://www.w3.org/1999/xhtml"
             style={{
               fontFamily: "'JetBrains Mono', monospace",
               fontSize: 10, lineHeight: 1.45, color: 'var(--ink-soft)',
             }}>
          {def}
        </div>
      </foreignObject>
    </g>
  );
}
