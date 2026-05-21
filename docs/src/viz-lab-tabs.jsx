// =================================================================
// Viz Tab, Lab Tab, Lab Sidebar
// =================================================================
const { useState: vlUseState, useEffect: vlUseEffect, useRef: vlUseRef } = React;

// =================================================================
// VIZ TAB
// =================================================================
const VIZ_PRESETS = {
  cutoff:     { vgs: 0.15, vds: 0.60 },
  threshold:  { vgs: 0.30, vds: 0.60 },
  linear:     { vgs: 0.65, vds: 0.18 },
  saturation: { vgs: 0.90, vds: 0.70 },
};

function vizRegion(vgs, vds, vt = 0.3) {
  if (vgs < vt - 0.005) return 'cutoff';
  if (Math.abs(vgs - vt) < 0.02) return 'threshold';
  if (vds < vgs - vt) return 'linear';
  return 'saturation';
}
function vizID(vgs, vds, vt = 0.3, k = 25) {
  if (vgs < vt) return 0;
  const ov = vgs - vt;
  if (vds < ov) return k * (ov * vds - (vds * vds) / 2);
  return (k / 2) * ov * ov;
}

const STATE_COPY = {
  cutoff: {
    label:   'Cutoff',
    sub:     'V_GS < V_t',
    headline: 'The transistor is fully OFF.',
    explain: 'V_GS < V_t. The gate voltage is too weak to form an inversion layer. No path for electrons from source to drain. I_D = 0 regardless of V_DS.',
    formula: 'I_D = 0',
    chip:    'Transistor OFF · no current · stores binary 0',
    phone:   'Screen off, idle, near-zero power draw',
    real:    'Every transistor in cutoff is a binary 0. When your phone screen is off and the device is idle, most transistors are held in cutoff — this is why standby barely drains the battery. Power consumption is near zero.',
  },
  threshold: {
    label:   'Threshold',
    sub:     'V_GS = V_t',
    headline: 'The switching moment. ON-OFF boundary.',
    explain: 'V_GS = V_t exactly. The surface potential is just sufficient to invert the p-type substrate to n-type at the interface. I_D is effectively zero but the channel is on the verge of forming.',
    formula: 'I_D ≈ 0  ·  channel just appears',
    chip:    'Switching · crossing 0→1 or 1→0',
    phone:   'One clock cycle · one instruction processed',
    real:    'Every time your phone unlocks, processes a tap, or executes a clock cycle — billions of transistors cross this threshold. A 3.78 GHz processor means each transistor crosses threshold roughly 3.78 billion times per second. The sharpness of this transition defines how clean the logic signal is.',
  },
  linear: {
    label:   'Linear',
    sub:     'V_GS > V_t · V_DS < V_GS − V_t',
    headline: 'Channel is full. Behaves like a resistor.',
    explain: 'The channel is fully open and uniform. I_D = k_n[(V_GS−V_t)·V_DS − ½V_DS²]. Both V_GS and V_DS control current here. The transistor is ON and conducting.',
    formula: 'I_D = kₙ[(V_GS − V_t)·V_DS − ½V_DS²]',
    chip:    'Transistor ON · conducting · stores binary 1',
    phone:   'Active compute · app running, frame rendering, GPS solving',
    real:    'Transistors in linear region are fully ON — binary 1 in digital logic. When the processor runs an app, executes code, renders a frame — transistors are switching between cutoff and linear billions of times per second. Each switch = one bit of computation.',
  },
  saturation: {
    label:   'Saturation',
    sub:     'V_GS > V_t · V_DS ≥ V_GS − V_t',
    headline: 'Channel pinched off. I_D set by V_GS only.',
    explain: 'V_DS ≥ V_GS−V_t — pinch-off has occurred. I_D = ½kₙ(V_GS−V_t)². V_GS controls the current; increasing V_DS just shifts the pinch point. This independence is what makes saturation useful for amplifiers.',
    formula: 'I_D = ½kₙ(V_GS − V_t)²',
    chip:    'Analog amplification · current ∝ V_GS',
    phone:   'Audio amp, 5G RF front-end, camera sensor readout',
    real:    'Audio amplifiers, the RF front-end receiving your 5G signal, op-amps inside the camera sensor — all operate MOSFETs in saturation. A small variation in V_GS produces a large, proportional variation in I_D. That is amplification.',
  },
};

window.VizTab = function VizTab({ m, forceRegion }) {
  const VT = 0.30, KN = 25;

  // initial state matches a representative "linear" demo
  const [vgs, setVgs] = vlUseState(0.65);
  const [vds, setVds] = vlUseState(0.18);
  const [showLabels, setShowLabels] = vlUseState(true);
  const [showRWB, setShowRWB] = vlUseState(true);

  // forced region from tweaks
  vlUseEffect(() => {
    if (!forceRegion) return;
    const p = VIZ_PRESETS[forceRegion];
    if (p) { setVgs(p.vgs); setVds(p.vds); }
  }, [forceRegion]);

  const region = vizRegion(vgs, vds, VT);
  const id_mA = vizID(vgs, vds, VT, KN);
  const copy = STATE_COPY[region];

  const jumpTo = (key) => { const p = VIZ_PRESETS[key]; setVgs(p.vgs); setVds(p.vds); };

  const onVgs = (v) => setVgs(Math.max(0, Math.min(1.2, +v)));
  const onVds = (v) => setVds(Math.max(0, Math.min(1.5, +v)));

  return (
    <article className="viz-tab" data-region={region}>
      <div className="theory__rubric">
        <span className="rubric">Viz · the diagram <em>is</em> the explanation</span>
        <span className="mono theory__progress">always labelled · always live</span>
      </div>

      <header className="viz-tab__intro">
        <h2 className="serif" style={{fontSize:'clamp(40px,4.4vw,64px)', lineHeight:1.0, letterSpacing:'-0.02em', maxWidth:'18ch'}}>
          A MOSFET cross-section. <em>Alive.</em>
        </h2>
        <p style={{color:'var(--ink-soft)', fontSize:16, maxWidth:'52ch', textWrap:'pretty'}}>
          Biology-textbook style. Every part is labelled with a one-line definition that never disappears.
          Change V<sub>GS</sub> or V<sub>DS</sub> and the diagram rewrites itself — the channel forms,
          pinches, vanishes; the explanation panel changes in place.
        </p>
      </header>

      {/* === main stage === */}
      <section className="vizstage">
        <div className="vizstage__statebar">
          <div className="vizstage__statebar-l">
            <span className="mono vizstage__statenum">{ {cutoff:'01', threshold:'02', linear:'03', saturation:'04'}[region] }</span>
            <span className="serif vizstage__statename">{copy.label}</span>
            <span className="mono vizstage__statesub">{copy.sub}</span>
          </div>
          <div className="vizstage__statebar-r">
            <span className="eyebrow" style={{marginRight:8}}>I_D</span>
            <span className="serif vizstage__id">{id_mA.toFixed(2)}<span className="mono vizstage__idunit">mA</span></span>
          </div>
        </div>

        <div className="vizstage__stage">
          <MOSFETStage vgs={vgs} vds={vds} vt={VT} k={KN} showLabels={showLabels} region={region}/>
        </div>

        {/* dynamic explanation panel — rewrites on state change */}
        <div className="vizstage__explain">
          <div className="vizexplain__lead">
            <div className="rubric">What is happening now</div>
            <h3 className="serif vizexplain__head"><em>{copy.headline}</em></h3>
          </div>
          <p className="vizexplain__body">{copy.explain}</p>
          <div className="vizexplain__formula mono">{copy.formula}</div>
        </div>
      </section>

      {/* === controls === */}
      <section className="vizctrl">
        <div className="vizctrl__row">
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_GS</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="1.2"
                value={vgs.toFixed(2)} onChange={e => onVgs(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="1.2" step="0.01" value={vgs}
                   onChange={e => onVgs(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--amber-ink)'}}>V_t = 0.30</span>
              <span>1.20</span>
            </div>
          </div>
          <div className="vizctrl__slot">
            <div className="vizctrl__head">
              <span className="eyebrow">V_DS</span>
              <input className="mono vizctrl__num" type="number" step="0.01" min="0" max="1.5"
                value={vds.toFixed(2)} onChange={e => onVds(e.target.value)}/>
              <span className="mono vizctrl__unit">V</span>
            </div>
            <input type="range" min="0" max="1.5" step="0.01" value={vds}
                   onChange={e => onVds(e.target.value)} className="ctrl__slider vizctrl__slider"/>
            <div className="ctrl__scale mono">
              <span>0.00</span>
              <span style={{color:'var(--amber-ink)'}}>V_DS(sat) = {Math.max(0, vgs - VT).toFixed(2)}</span>
              <span>1.50</span>
            </div>
          </div>
        </div>
        <div className="vizctrl__row vizctrl__row--quick">
          <span className="eyebrow vizctrl__quicklbl">jump to region →</span>
          <div className="vizctrl__quickbtns">
            {['cutoff','threshold','linear','saturation'].map(r => (
              <button key={r} className={`vizctrl__jumpbtn ${region === r ? 'is-active' : ''}`}
                      onClick={() => jumpTo(r)}>
                <span className="mono vizctrl__jumpnum">{ {cutoff:'01', threshold:'02', linear:'03', saturation:'04'}[r] }</span>
                <span className="serif vizctrl__jumpname">{ r.charAt(0).toUpperCase() + r.slice(1) }</span>
              </button>
            ))}
          </div>
          <button className={`viz-toolbtn ${showLabels ? 'is-on' : ''}`} onClick={() => setShowLabels(s => !s)}>
            {showLabels ? '✕ hide labels' : '+ show labels'}
          </button>
        </div>
      </section>

      {/* === real-world consequence === */}
      <section className="vizrw">
        <div className="theory__rubric" style={{marginBottom:16}}>
          <span className="rubric">Consequence in the world</span>
          <button className="mono vizrw__toggle" onClick={() => setShowRWB(v => !v)}>
            {showRWB ? '− collapse' : '+ expand'}
          </button>
        </div>
        {showRWB && (
          <div className="vizrw__body">
            <h3 className="serif vizrw__head">
              One <em>{copy.label.toLowerCase()}</em> transistor at this instant —
            </h3>
            <p className="vizrw__copy">{copy.real}</p>
          </div>
        )}
      </section>

      <hr className="rule-strong" style={{margin:'48px 0 32px'}}/>

      {/* === chip-scale impact === */}
      <section className="chipscale">
        <div className="rubric">Chip-scale impact</div>
        <h2 className="serif chipscale__head">
          One transistor <span className="chipscale__x">×</span> <em>19,000,000,000</em>
        </h2>
        <p className="chipscale__sub">
          A flagship mobile SoC packs ~19 billion MOSFETs on one die. Every state you just saw
          plays out simultaneously across the die, every clock cycle.
        </p>

        <div className="chipscale__table">
          <div className="chipscale__row chipscale__row--head">
            <div className="mono">State</div>
            <div className="mono">What the chip is doing</div>
            <div className="mono">What the phone is doing</div>
          </div>
          {['cutoff','threshold','linear','saturation'].map((r, i) => {
            const c = STATE_COPY[r];
            const active = region === r;
            return (
              <div key={r} className={`chipscale__row ${active ? 'is-active' : ''}`} onClick={() => jumpTo(r)}>
                <div className="chipscale__state">
                  <span className="mono chipscale__statenum">{ {cutoff:'01', threshold:'02', linear:'03', saturation:'04'}[r] }</span>
                  <span className="serif chipscale__statename">{c.label}</span>
                  <span className="mono chipscale__statesub">{c.sub}</span>
                </div>
                <div className="chipscale__cell"><span className="serif" style={{fontSize:18}}>{c.chip}</span></div>
                <div className="chipscale__cell"><span className="serif" style={{fontSize:18, fontStyle:'italic'}}>{c.phone}</span></div>
                {active && <div className="chipscale__tag mono">you are here</div>}
              </div>
            );
          })}
        </div>

        <div className="chipscale__narration">
          <p className="serif chipscale__nartext">
            Clock speed is how many times per second each transistor <em>crosses threshold</em>.
            At 3.78 GHz, each of the 19 billion transistors switches 3,780,000,000 times per
            second. Every switch is one bit. Every billion bits per second is what makes
            real-time video, instant face unlock, and simultaneous apps possible.
          </p>
          <div className="chipscale__bignum">
            <div className="eyebrow">switches per second · whole die</div>
            <div className="serif chipscale__bigval">7.18 × 10<sup>19</sup></div>
            <div className="mono chipscale__bigsub">19 × 10⁹ transistors × 3.78 × 10⁹ Hz</div>
          </div>
        </div>
      </section>
    </article>
  );
};

// =================================================================
// LAB TAB
// =================================================================
window.LabTab = function LabTab({ m, labOutcome }) {
  const [val, setVal] = vlUseState('');
  const [submitted, setSubmitted] = vlUseState(false);
  const [showHint, setShowHint] = vlUseState(false);
  const [showSolution, setShowSolution] = vlUseState(false);

  // labOutcome from tweaks: 'auto' | 'correct' | 'cutoff' | 'breakdown'
  const userNum = parseFloat(val);
  const computedOutcome = !submitted ? null
    : Math.abs(userNum - m.lab.correct) < 0.02 ? 'correct'
    : userNum < 0.3 ? 'cutoff'
    : userNum > 1.2 ? 'breakdown'
    : Math.abs(userNum - m.lab.correct) >= 0.02 ? 'wrong-region'
    : 'correct';
  const outcome = (labOutcome && labOutcome !== 'auto') ? labOutcome : computedOutcome;

  // visual snapshot voltages per outcome (drives the inline viz)
  const vizState = outcome === 'correct'   ? { vgs: 0.90, vds: 0.60, broken: false }
                 : outcome === 'cutoff'    ? { vgs: 0.20, vds: 0.60, broken: false }
                 : outcome === 'breakdown' ? { vgs: 1.35, vds: 0.60, broken: true }
                 : { vgs: 0.50, vds: 0.60, broken: false };

  return (
    <article className="lab-tab">
      <div className="theory__rubric">
        <span className="rubric">Lab · Apple A19 Pro · single MOSFET</span>
        <span className="mono theory__progress">5 steps · context → solve → consequence</span>
      </div>

      {/* Step 1 — Context */}
      <section className="lab-step">
        <div className="lab-step__num serif">01.</div>
        <div className="lab-step__head">
          <span className="pill pill--accent">Context</span>
          <h2 className="lab-step__h">You are an <em>Apple chip engineer</em>.</h2>
        </div>
        <p className="lab-step__body">
          {m.lab.brief}
        </p>

        <ChipZoom/>
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      {/* Step 2 — Parameters */}
      <section className="lab-step">
        <div className="lab-step__num serif">02.</div>
        <div className="lab-step__head">
          <span className="pill">Given parameters</span>
          <h2 className="lab-step__h">The <em>spec sheet</em>.</h2>
        </div>
        <div className="speccard">
          <div className="speccard__head mono">
            <span>$ cat /spec/a19-pro/transistor.yml</span>
            <span style={{color:'var(--ok)'}}>● live</span>
          </div>
          {m.lab.params.map((p, i) => (
            <div key={i} className="speccard__row mono">
              <span className="speccard__k">{p.k}:</span>
              <span className="speccard__dots">..............................................</span>
              <span className="speccard__v">{p.v}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      {/* Step 3 — Problem */}
      <section className="lab-step">
        <div className="lab-step__num serif">03.</div>
        <div className="lab-step__head">
          <span className="pill">Your problem</span>
          <h2 className="lab-step__h">Calculate <em>V<sub>GS</sub></em>.</h2>
        </div>
        <p className="lab-step__body">
          Find V<sub>GS</sub> such that all three hold simultaneously: <strong>(1)</strong> the MOSFET is in
          saturation, <strong>(2)</strong> V<sub>GS</sub> stays under the oxide breakdown V<sub>BD</sub> = 1.20 V,
          and <strong>(3)</strong> the drain current hits the required 4.50 mA.
        </p>

        <div className="lab-solve">
          <div className="lab-solve__input">
            <span className="mono lab-solve__lbl">V_GS =</span>
            <input className="mono lab-solve__num" type="number" step="0.01" placeholder="?"
                   value={val} onChange={e => setVal(e.target.value)} disabled={submitted}/>
            <span className="mono" style={{color:'var(--ink-mute)'}}>V</span>
          </div>
          <div className="lab-solve__cta">
            {!submitted ? (
              <>
                <button className="btn btn--primary btn--lg" onClick={() => { if (val !== '') setSubmitted(true); }}>
                  Submit answer
                </button>
                <button className="pcard__hint mono" onClick={() => setShowHint(h => !h)}>
                  {showHint ? '−' : '+'} hint
                </button>
              </>
            ) : (
              <button className="btn btn--ghost" onClick={() => { setSubmitted(false); setVal(''); setShowSolution(false); }}>
                Try again
              </button>
            )}
          </div>
        </div>
        {showHint && !submitted && (
          <div className="lab-hint">
            <span className="mono" style={{color:'var(--warn)'}}>HINT</span>
            <p>{m.lab.hint}</p>
          </div>
        )}
      </section>

      <hr className="rule-strong" style={{margin:'48px 0'}}/>

      {/* Step 4 — Feedback */}
      <section className="lab-step">
        <div className="lab-step__num serif">04.</div>
        <div className="lab-step__head">
          <span className="pill pill--warn">Consequence</span>
          <h2 className="lab-step__h">What <em>happens</em> in the chip.</h2>
        </div>

        <div className={`lab-consequence lab-consequence--${outcome || 'idle'}`}>
          <div className="lab-consequence__viz">
            <LabFailViz outcome={outcome} vizState={vizState}/>
          </div>
          <div className="lab-consequence__copy">
            {outcome === 'correct' && (
              <>
                <div className="pill pill--ok" style={{marginBottom:10}}>✓ A19 Pro · stays alive</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Correct.</em> V_GS = 0.90 V.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  Channel forms cleanly. 4.50 mA across the channel. Clock locked at 3.78 GHz.
                  Nineteen billion MOSFETs on the die · all switching correctly.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="ok">✓</span> V_DS ≥ V_GS − V_t → saturated</li>
                  <li><span className="ok">✓</span> V_GS &lt; V_BD → oxide safe</li>
                  <li><span className="ok">✓</span> I_D = 4.50 mA → spec met</li>
                </ul>
              </>
            )}
            {outcome === 'cutoff' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ Cutoff · the chip is dead</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>No channel.</em> No current.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  V_GS &lt; V_t. The inversion layer never formed. The transistor is off — the chip
                  cannot clock. From this single dead switch, ~19 billion others are equally idle.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> V_GS &lt; V_t → no channel</li>
                  <li><span className="dim">—</span> I_D ≈ 0 (sub-threshold leakage only)</li>
                  <li><span className="dim">—</span> chip cannot meet 3.78 GHz timing</li>
                </ul>
              </>
            )}
            {outcome === 'breakdown' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ Oxide breakdown · permanent</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Oxide ruptured.</em> Gate destroyed.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  V_GS &gt; 1.20 V exceeded the oxide breakdown. The thin SiO₂ layer punctured.
                  Gate-to-channel short. You just killed a $1,000 chip — and you can never un-kill it.
                </p>
                <ul className="lab-checks mono">
                  <li><span className="bad">✗</span> V_GS &gt; V_BD → dielectric failure</li>
                  <li><span className="bad">✗</span> gate ↔ channel shorted (permanent)</li>
                  <li><span className="warn">!</span> 1 of 19,000,000,000 transistors lost → die is scrap</li>
                </ul>
              </>
            )}
            {outcome === 'wrong-region' && (
              <>
                <div className="pill pill--bad" style={{marginBottom:10}}>✗ Wrong I_D</div>
                <h3 className="serif" style={{fontSize:36, lineHeight:1.05, margin:'0 0 12px'}}>
                  <em>Survives.</em> But misses spec.
                </h3>
                <p style={{color:'var(--ink-soft)', fontSize:15}}>
                  The transistor neither cuts off nor breaks down, but I_D ≠ 4.50 mA. The chip
                  cannot hit the timing target. Recompute V_GS from I_D directly.
                </p>
              </>
            )}
            {!outcome && (
              <>
                <div className="eyebrow">Awaiting your answer…</div>
                <p style={{color:'var(--ink-mute)', fontSize:14, marginTop:8}}>
                  Enter a V_GS above and submit. The chip will react. Hint: there is exactly one
                  V_GS that satisfies all three constraints.
                </p>
              </>
            )}
          </div>
        </div>

        {submitted && (
          <button className="lab-solution-toggle mono" onClick={() => setShowSolution(s => !s)}>
            {showSolution ? '− Hide' : '+ Show'} the full solution walkthrough
          </button>
        )}
      </section>

      {/* Step 5 — Solution */}
      {submitted && showSolution && (
        <section className="lab-step">
          <div className="lab-step__num serif">05.</div>
          <div className="lab-step__head">
            <span className="pill pill--accent">Solution</span>
            <h2 className="lab-step__h">The <em>walkthrough</em>.</h2>
          </div>
          <ol className="lab-solution">
            {m.lab.solution.map((s, i) => (
              <li key={i} className="lab-solution__step">
                <span className="mono lab-solution__tag">{s.tag}</span>
                <span className="serif lab-solution__line" style={{fontSize:18}} dangerouslySetInnerHTML={{__html: s.line}}/>
              </li>
            ))}
          </ol>
          <div className="lab-solution__answer">
            <div className="rubric">Answer</div>
            <div className="serif" style={{fontSize:64, lineHeight:1}}>
              V<sub style={{fontSize:36}}>GS</sub> = <em>0.90 V</em>
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

// -----------------------------------------------------------------
// Lab Sidebar — right side, lab steps + parameter reference
// -----------------------------------------------------------------
window.LabSidebar = function LabSidebar({ m }) {
  return (
    <aside className="lab-sidebar">
      <div className="cside__head">
        <div className="rubric">Lab · steps</div>
        <div className="cside__head-title serif">A19 Pro · single MOSFET</div>
      </div>
      <ol className="lab-steps-mini">
        {['Context', 'Parameters', 'Problem', 'Consequence', 'Solution'].map((s, i) => (
          <li key={i} className="lab-step-mini">
            <span className="mono">{String(i+1).padStart(2,'0')}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <hr className="rule" style={{margin:'18px 0'}}/>
      <div className="lab-ref">
        <div className="rubric">Quick ref</div>
        <div className="lab-ref__row mono"><span>V_DD</span><span>0.75 V</span></div>
        <div className="lab-ref__row mono"><span>V_t</span><span>0.30 V</span></div>
        <div className="lab-ref__row mono"><span>V_BD</span><span>1.20 V</span></div>
        <div className="lab-ref__row mono"><span>V_DS</span><span>0.60 V</span></div>
        <div className="lab-ref__row mono"><span>I_D (req)</span><span>4.50 mA</span></div>
        <div className="lab-ref__row mono"><span>k</span><span>25 mA/V²</span></div>
      </div>
      <hr className="rule" style={{margin:'18px 0'}}/>
      <div className="lab-ref">
        <div className="rubric">Formulas</div>
        <div className="mono" style={{fontSize:11, color:'var(--ink-soft)', lineHeight:1.7}}>
          sat: I_D = (k/2)(V_GS−V_t)²<br/>
          boundary: V_DS = V_GS − V_t
        </div>
      </div>
    </aside>
  );
};

// -----------------------------------------------------------------
// Chip zoom-in visualization (Step 1)
// -----------------------------------------------------------------
function ChipZoom() {
  return (
    <div className="chipzoom">
      <div className="chipzoom__stage">
        {/* big die */}
        <div className="chipzoom__die">
          <div className="chipzoom__die-grid"/>
          <div className="chipzoom__die-label mono">A19 PRO · TSMC N3E · 3 nm</div>
          <div className="chipzoom__die-marker"/>
        </div>
        {/* zoom line */}
        <svg className="chipzoom__line" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="50" x2="100" y2="50" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="2 2"/>
        </svg>
        {/* zoomed transistor */}
        <div className="chipzoom__close">
          <svg viewBox="0 0 200 140" width="100%">
            <rect x="20" y="30" width="160" height="80" fill="#F0EBDE" stroke="var(--ink-soft)" strokeWidth="1"/>
            <rect x="32" y="62" width="22" height="16" fill="#D9D2BF" stroke="var(--ink-soft)"/>
            <rect x="146" y="62" width="22" height="16" fill="#D9D2BF" stroke="var(--ink-soft)"/>
            <rect x="70" y="52" width="60" height="10" fill="white" stroke="var(--ink-soft)"/>
            <rect x="70" y="36" width="60" height="14" fill="url(#gh)" stroke="var(--ink)"/>
            <defs>
              <pattern id="gh" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="var(--ink)" strokeWidth="1"/>
              </pattern>
            </defs>
            <text x="100" y="22" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-mute)">1 of 19,000,000,000</text>
            <text x="100" y="128" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="16" fill="var(--ink)">— a single MOSFET —</text>
          </svg>
        </div>
        <div className="chipzoom__captions">
          <span className="mono">DIE · 110 mm²</span>
          <span className="mono" style={{color:'var(--accent-ink)'}}>↓ ZOOM ~ 10⁷×</span>
          <span className="mono">CHANNEL · ~3 nm</span>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// Lab consequence visualization
// -----------------------------------------------------------------
function LabFailViz({ outcome, vizState }) {
  return (
    <div className={`labviz labviz--${outcome || 'idle'}`}>
      <svg viewBox="0 0 480 280" width="100%">
        <defs>
          <pattern id="gateHatch2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(22,22,19,0.55)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="oxidegrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.95"/>
            <stop offset="1" stopColor="#E6E2D6" stopOpacity="0.85"/>
          </linearGradient>
        </defs>

        {/* substrate */}
        <rect x="40" y="80" width="400" height="160" fill="#F0EBDE" stroke="rgba(22,22,19,0.55)"/>

        {/* atoms */}
        <g opacity="0.55">
          {Array.from({length: 80}).map((_, i) => {
            const x = 56 + (i % 20) * 19;
            const y = 170 + Math.floor(i/20) * 17;
            return <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(22,22,19,0.55)"/>;
          })}
        </g>

        {/* source / drain */}
        <rect x="58" y="120" width="52" height="42" fill="#D9D2BF" stroke="rgba(22,22,19,0.7)"/>
        <rect x="370" y="120" width="52" height="42" fill="#D9D2BF" stroke="rgba(22,22,19,0.7)"/>

        {/* channel */}
        <rect x="130" y="128" width="220" height="28" fill={
          outcome === 'correct' ? 'var(--accent-soft)' :
          outcome === 'breakdown' ? '#F7E5E2' :
          'rgba(22,22,19,0.04)'
        } stroke={outcome === 'correct' ? 'var(--accent)' : 'transparent'} strokeOpacity="0.5"/>

        {/* electrons in channel — only correct */}
        {outcome === 'correct' && (
          <g>
            {Array.from({length: 36}).map((_, i) => {
              const x = 134 + (i % 18) * 12;
              const y = 134 + Math.floor(i/18) * 14;
              return (<g key={i}><circle cx={x} cy={y} r="3.5" fill="var(--accent)" opacity="0.3"/><circle cx={x} cy={y} r="1.4" fill="var(--accent)"/></g>);
            })}
            {[0,1,2].map(i => (
              <path key={i} d="M 396 142 L 110 142" stroke="var(--accent)" strokeWidth="1.5" fill="none"
                    strokeDasharray="6 110" strokeDashoffset={i*40} opacity="0.85"
                    style={{ animation: 'flow 1.6s linear infinite', animationDelay: `${i*0.5}s` }}/>
            ))}
          </g>
        )}

        {/* oxide */}
        <rect x="126" y="100" width="228" height="20" fill="url(#oxidegrad2)" stroke="rgba(22,22,19,0.5)"
              opacity={outcome === 'breakdown' ? 0.4 : 1}/>

        {/* gate */}
        <rect x="130" y="58" width="220" height="38" fill="url(#gateHatch2)" stroke="rgba(22,22,19,0.85)"/>

        {/* labels */}
        <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--ink-soft)">
          <text x="84" y="116" textAnchor="middle">S</text>
          <text x="396" y="116" textAnchor="middle">D</text>
          <text x="240" y="50" textAnchor="middle">G</text>
        </g>

        {/* === FAILURE OVERLAYS === */}
        {outcome === 'breakdown' && (
          <g className="breakdown-fx">
            {/* crack lines */}
            <path d="M 160 100 L 168 120 L 158 140 L 172 152" stroke="var(--bad)" strokeWidth="1.6" fill="none">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze"/>
            </path>
            <path d="M 220 100 L 232 116 L 218 138" stroke="var(--bad)" strokeWidth="1.6" fill="none">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.1s" fill="freeze"/>
            </path>
            <path d="M 290 100 L 282 122 L 296 138 L 286 150" stroke="var(--bad)" strokeWidth="1.6" fill="none">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.2s" fill="freeze"/>
            </path>
            <path d="M 330 100 L 322 124 L 336 142" stroke="var(--bad)" strokeWidth="1.6" fill="none">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.3s" fill="freeze"/>
            </path>
            {/* spark glow */}
            <circle cx="200" cy="110" r="14" fill="var(--bad)" opacity="0.6">
              <animate attributeName="r" values="0;28;14" dur="0.5s" fill="freeze"/>
              <animate attributeName="opacity" values="0;0.8;0.4" dur="0.5s" fill="freeze"/>
            </circle>
            <circle cx="280" cy="110" r="14" fill="#FF6A00" opacity="0.5">
              <animate attributeName="r" values="0;24;12" dur="0.6s" begin="0.15s" fill="freeze"/>
              <animate attributeName="opacity" values="0;0.7;0.3" dur="0.6s" begin="0.15s" fill="freeze"/>
            </circle>
            {/* smoke */}
            <text x="240" y="38" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="22" fill="var(--bad)">
              ⚡ breakdown
              <animate attributeName="opacity" from="0" to="1" dur="0.6s" fill="freeze"/>
            </text>
          </g>
        )}

        {outcome === 'cutoff' && (
          <g>
            <text x="240" y="148" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="var(--ink-mute)" letterSpacing="0.1em">
              · NO CHANNEL ·
            </text>
            <text x="240" y="38" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="22" fill="var(--ink-mute)">
              silent
            </text>
          </g>
        )}

        {outcome === 'correct' && (
          <g>
            {/* glowing channel pulse */}
            <rect x="130" y="128" width="220" height="28" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.4s" repeatCount="indefinite"/>
            </rect>
            <text x="240" y="38" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="22" fill="var(--ok)" className="ghz-pulse">
              3.78 GHz ✓
            </text>
            {/* clock pulse indicator on the gate */}
            <g transform="translate(390, 50)">
              <path d="M 0 12 L 0 0 L 8 0 L 8 12 L 16 12 L 16 0 L 24 0 L 24 12 L 32 12 L 32 0 L 40 0 L 40 12"
                    stroke="var(--ok)" strokeWidth="1.5" fill="none"/>
              <text x="20" y="26" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ok)">clock</text>
            </g>
            {/* "tick" check at terminals */}
            <circle cx="84" cy="80" r="10" fill="var(--ok)" opacity="0.2"/>
            <text x="84" y="84" textAnchor="middle" fontFamily="Instrument Serif" fontSize="14" fill="var(--ok)">✓</text>
          </g>
        )}
      </svg>
    </div>
  );
}
