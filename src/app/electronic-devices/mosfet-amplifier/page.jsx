import ConceptPage from '@/components/concept/ConceptPage'
import ampData from '@/data/concepts/mosfet-amplifier.json'
import AmpTheoryTab from '@/components/amp/AmpTheoryTab'
import AmpVizTab from '@/components/amp/AmpVizTab'
import AmpLabTab from '@/components/amp/AmpLabTab'
import AmpVizSidebar from './AmpVizSidebar'
import AmpLabSidebar from './AmpLabSidebar'
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
  id: 'mosfet-amplifier',
  name: 'MOSFET Amplifier',
  shortName: 'MOSFET Amp',
  stars: 4,
}

export const metadata = {
  title: 'MOSFET Amplifier · Electronic Devices · GreatVision',
  description: 'Interactive MOSFET Amplifier concept page with theory, live visualization, lab simulation, PYQs, and practice problems for GATE ECE.',
}

export default function MOSFETAmplifierPage() {
  return (
    <ConceptPage
      subject={subject}
      concept={concept}
      conceptData={ampData}
      tags={ampData.tags}
      TheoryTab={AmpTheoryTab}
      VizTab={AmpVizTab}
      LabTab={AmpLabTab}
      VizSidebar={AmpVizSidebar}
      LabSidebar={AmpLabSidebar}
    />
  )
}
