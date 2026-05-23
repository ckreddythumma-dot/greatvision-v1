import ConceptPage from '@/components/concept/ConceptPage'
import bjtData from '@/data/concepts/bjt.json'
import BJTTheoryTab from '@/components/bjt/BJTTheoryTab'
import BJTVizTab from '@/components/bjt/BJTVizTab'
import BJTLabTab from '@/components/bjt/BJTLabTab'
import BJTVizSidebar from './BJTVizSidebar'
import BJTLabSidebar from './BJTLabSidebar'
import '../mosfet-iv/styles.css'
import './styles.css'

const subject = {
  id: 'electronic-devices',
  name: 'Electronic Devices',
  shortName: 'ED',
  conceptCount: 5,
  concepts: [
    { id: 'mosfet-iv',     shortName: 'MOSFET I–V Characteristics', stars: 5 },
    { id: 'pn-junction',   shortName: 'PN Junction Diode',          stars: 4 },
    { id: 'bjt',           shortName: 'BJT Characteristics',        stars: 4 },
    { id: 'mosfet-amplifier', shortName: 'MOSFET Amplifier',        stars: 4 },
    { id: 'cmos-inverter', shortName: 'CMOS Inverter',              stars: 5 },
  ],
}

const concept = {
  id: 'bjt',
  name: 'BJT Characteristics',
  shortName: 'BJT',
  stars: 4,
}

export const metadata = {
  title: 'BJT Characteristics · Electronic Devices · GreatVision',
  description: 'Interactive BJT concept page with theory, live visualization, lab simulation, PYQs, and practice problems for GATE ECE.',
}

export default function BJTPage() {
  return (
    <ConceptPage
      subject={subject}
      concept={concept}
      conceptData={bjtData}
      tags={bjtData.tags}
      TheoryTab={BJTTheoryTab}
      VizTab={BJTVizTab}
      LabTab={BJTLabTab}
      VizSidebar={BJTVizSidebar}
      LabSidebar={BJTLabSidebar}
    />
  )
}
