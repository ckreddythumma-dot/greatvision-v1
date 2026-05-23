'use client'

export default function AmpVizSidebar({ subject }) {
  const groups = [
    { name: 'MOSFET', items: [
      { id: 'mosfet-iv', label: 'I–V Characteristics' },
    ] },
    { name: 'PN Junction Diode', items: [
      { id: 'pn-junction', label: 'I–V & depletion' },
    ] },
    { name: 'BJT', items: [
      { id: 'bjt', label: 'Operating regions' },
    ] },
    { name: 'MOSFET Amplifier', open: true, items: [
      { id: 'mosfet-amplifier', label: 'CS amp gain', active: true },
    ] },
    { name: 'CMOS Inverter', items: [
      { id: 'cmos-inverter', label: 'VTC & switching' },
    ] },
  ]
  return (
    <aside className="cside cside--viz">
      <div className="cside__head">
        <div className="rubric">Viz · tree</div>
        <div className="cside__head-title serif">{subject.name}</div>
      </div>
      {groups.map((g, gi) => (
        <div key={gi} className="viz-tree">
          <button className="viz-tree__head">
            <span className="viz-tree__caret">{g.open ? '▾' : '▸'}</span>
            <span>{g.name}</span>
          </button>
          {g.open && (
            <ul className="viz-tree__list">
              {g.items.map(it => (
                <li key={it.id} className={`viz-tree__item ${it.active ? 'is-active' : ''}`}>
                  <span className="viz-tree__bullet"/>
                  {it.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  )
}
