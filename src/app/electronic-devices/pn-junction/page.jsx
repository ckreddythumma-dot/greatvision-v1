import ConceptPage from '@/components/concept/ConceptPage'
import pnData from '@/data/concepts/pn-junction.json'
import PNTheoryTab from '@/components/pn-junction/PNTheoryTab'
import PNVizTab from '@/components/pn-junction/PNVizTab'
import PNLabTab from '@/components/pn-junction/PNLabTab'
import PNVizSidebar from './PNVizSidebar'
import PNLabSidebar from './PNLabSidebar'
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
    { id: 'bjt',              shortName: 'BJT Characteristics',        stars: 4 },
    { id: 'mosfet-amplifier', shortName: 'MOSFET Amplifier',           stars: 4 },
    { id: 'cmos-inverter',    shortName: 'CMOS Inverter',              stars: 5 },
  ],
}

const concept = {
  id: 'pn-junction',
  name: 'PN Junction Diode',
  shortName: 'PN Junction',
  stars: 4,
}

export const metadata = {
  title: 'PN Junction Diode · Electronic Devices · GreatVision',
  description: 'Interactive PN Junction concept page with theory, live visualization, lab simulation, PYQs, and practice problems for GATE ECE.',
}

export default function PNJunctionPage() {
  return (
    <ConceptPage
      subject={subject}
      concept={concept}
      conceptData={pnData}
      tags={pnData.tags}
      TheoryTab={PNTheoryTab}
      VizTab={PNVizTab}
      LabTab={PNLabTab}
      VizSidebar={PNVizSidebar}
      LabSidebar={PNLabSidebar}
    />
  )
}
