import Hero from '../components/landing/Hero'
import Stats from '../components/landing/Stats'
import About from '../components/landing/About'
import HowItWorks from '../components/landing/HowItWorks'
import DiseaseLibrary from '../components/landing/DiseaseLibrary'
import Faq from '../components/landing/Faq'
import Cta from '../components/landing/Cta'

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <HowItWorks />
      <DiseaseLibrary />
      <Faq />
      <Cta />
    </>
  )
}

export default HomePage