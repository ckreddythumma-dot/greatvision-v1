'use client'

export default function AmpLabSidebar() {
  return (
    <aside className="lab-sidebar">
      <div className="cside__head">
        <div className="rubric">Lab · steps</div>
        <div className="cside__head-title serif">A19 Pro · audio codec</div>
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
        <div className="lab-ref__row mono"><span>V_GS</span><span>0.8 V</span></div>
        <div className="lab-ref__row mono"><span>V_t</span><span>0.4 V</span></div>
        <div className="lab-ref__row mono"><span>k_n</span><span>4 mA/V²</span></div>
        <div className="lab-ref__row mono"><span>R_D</span><span>5 kΩ</span></div>
        <div className="lab-ref__row mono"><span>λ</span><span>0</span></div>
      </div>
      <hr className="rule" style={{margin:'18px 0'}}/>
      <div className="lab-ref">
        <div className="rubric">Formulas</div>
        <div className="mono" style={{fontSize:11, color:'var(--ink-soft)', lineHeight:1.7}}>
          g_m = k_n(V_GS − V_t)<br/>
          |A_v| = g_m × R_D
        </div>
      </div>
    </aside>
  )
}
