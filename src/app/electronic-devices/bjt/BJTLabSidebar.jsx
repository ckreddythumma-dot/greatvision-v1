'use client'

export default function BJTLabSidebar() {
  return (
    <aside className="lab-sidebar">
      <div className="cside__head">
        <div className="rubric">Lab · steps</div>
        <div className="cside__head-title serif">A19 Pro · bandgap BJT</div>
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
        <div className="lab-ref__row mono"><span>V_CC</span><span>5 V</span></div>
        <div className="lab-ref__row mono"><span>R_C</span><span>2 kΩ</span></div>
        <div className="lab-ref__row mono"><span>R_B</span><span>430 kΩ</span></div>
        <div className="lab-ref__row mono"><span>β</span><span>100</span></div>
        <div className="lab-ref__row mono"><span>V_BE</span><span>0.7 V</span></div>
      </div>
      <hr className="rule" style={{margin:'18px 0'}}/>
      <div className="lab-ref">
        <div className="rubric">Formula</div>
        <div className="mono" style={{fontSize:11, color:'var(--ink-soft)', lineHeight:1.7}}>
          I_B = (V_CC − V_BE) / R_B<br/>
          I_C = β × I_B
        </div>
      </div>
    </aside>
  )
}
