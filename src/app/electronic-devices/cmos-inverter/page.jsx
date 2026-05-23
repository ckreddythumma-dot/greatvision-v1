import ConceptPage from '@/components/concept/ConceptPage'
import cmosData from '@/data/concepts/cmos-inverter.json'
import CMOSTheoryTab from '@/components/cmos/CMOSTheoryTab'
import CMOSVizTab from '@/components/cmos/CMOSVizTab'
import CMOSLabTab from '@/components/cmos/CMOSLabTab'
import CMOSVizSidebar from './CMOSVizSidebar'
import CMOSLabSidebar from './CMOSLabSidebar'
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
  id: 'cmos-inverter',
  name: 'CMOS Inverter',
  shortName: 'CMOS Inverter',
  stars: 5,
}

export const metadata = {
  title: 'CMOS Inverter · Electronic Devices · GreatVision',
  description: 'Interactive CMOS Inverter concept page with theory, live visualization, lab simulation, PYQs, and practice problems for GATE ECE.',
}

export default function CMOSInverterPage() {
  return (
    <ConceptPage
      subject={subject}
      concept={concept}
      conceptData={cmosData}
      tags={cmosData.tags}
      TheoryTab={CMOSTheoryTab}
      VizTab={CMOSVizTab}
      LabTab={CMOSLabTab}
      VizSidebar={CMOSVizSidebar}
      LabSidebar={CMOSLabSidebar}
    />
  )
}
