'use client'

export default function PNLabSidebar() {
  return (
    <aside className="lab-sidebar">
      <div className="cside__head">
        <div className="rubric">Lab · steps</div>
        <div className="cside__head-title serif">A19 Pro · ESD diode</div>
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
        <div className="lab-ref__row mono"><span>N_A</span><span>5×10^17 /cm³</span></div>
        <div className="lab-ref__row mono"><span>N_D</span><span>10^16 /cm³</span></div>
        <div className="lab-ref__row mono"><span>n_i</span><span>1.5×10^10 /cm³</span></div>
        <div className="lab-ref__row mono"><span>T</span><span>300 K</span></div>
        <div className="lab-ref__row mono"><span>V_T</span><span>0.026 V</span></div>
      </div>
      <hr className="rule" style={{margin:'18px 0'}}/>
      <div className="lab-ref">
        <div className="rubric">Formula</div>
        <div className="mono" style={{fontSize:11, color:'var(--ink-soft)', lineHeight:1.7}}>
          V_bi = V_T · ln(N_A·N_D / n_i²)
        </div>
      </div>
    </aside>
  )
}
