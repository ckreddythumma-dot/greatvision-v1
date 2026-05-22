import ConceptPage from '@/components/concept/ConceptPage'
import mosfetData from '@/data/concepts/mosfet-iv.json'
import TheoryTab from '@/components/concept/TheoryTab'
import VizTab from '@/components/concept/VizTab'
import LabTab from '@/components/concept/LabTab'
import MosfetVizSidebar from './MosfetVizSidebar'
import MosfetLabSidebar from './MosfetLabSidebar'
import './styles.css'

const subject = {
  id: 'electronic-devices',
  name: 'Electronic Devices',
  shortName: 'ED',
  conceptCount: 5,
  concepts: [
    { id: 'mosfet-iv',     shortName: 'MOSFET I–V Characteristics', stars: 5 },
    { id: 'pn-junction',   shortName: 'PN Junction Diode',          stars: 4 },
    { id: 'bjt-regions',   shortName: 'BJT Operating Regions',      stars: 4 },
    { id: 'band-diagrams', shortName: 'Energy Band Diagrams',       stars: 3 },
    { id: 'hall-effect',   shortName: 'Hall Effect & Mobility',     stars: 3 },
  ],
}

const concept = {
  id: 'mosfet-iv',
  name: 'MOSFET I–V Characteristics',
  shortName: 'MOSFET I–V',
  stars: 5,
}

export const metadata = {
  title: 'MOSFET I–V Characteristics · Electronic Devices · GreatVision',
  description: 'Interactive MOSFET I–V concept page with theory, live visualization, lab simulation, PYQs, and practice problems for GATE ECE.',
}

export default function MosfetIVPage() {
  return (
    <ConceptPage
      subject={subject}
      concept={concept}
      conceptData={mosfetData}
      tags={mosfetData.tags}
      TheoryTab={TheoryTab}
      VizTab={VizTab}
      LabTab={LabTab}
      VizSidebar={MosfetVizSidebar}
      LabSidebar={MosfetLabSidebar}
    />
  )
}
