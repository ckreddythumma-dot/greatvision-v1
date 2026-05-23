'use client'

export default function CMOSLabSidebar() {
  return (
    <aside className="lab-sidebar">
      <div className="cside__head">
        <div className="rubric">Lab · steps</div>
        <div className="cside__head-title serif">A19 Pro · std-cell sizing</div>
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
        <div className="lab-ref__row mono"><span>V_DD</span><span>1.0 V</span></div>
        <div className="lab-ref__row mono"><span>V_tn</span><span>0.3 V</span></div>
        <div className="lab-ref__row mono"><span>|V_tp|</span><span>0.3 V</span></div>
        <div className="lab-ref__row mono"><span>(W/L)_n</span><span>2</span></div>
        <div className="lab-ref__row mono"><span>μ_n/μ_p</span><span>2.5</span></div>
      </div>
      <hr className="rule" style={{margin:'18px 0'}}/>
      <div className="lab-ref">
        <div className="rubric">Formula</div>
        <div className="mono" style={{fontSize:11, color:'var(--ink-soft)', lineHeight:1.7}}>
          (W/L)_p = (μ_n/μ_p) × (W/L)_n
        </div>
      </div>
    </aside>
  )
}
