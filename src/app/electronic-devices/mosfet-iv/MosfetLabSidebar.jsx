'use client'

export default function MosfetLabSidebar() {
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
  )
}
