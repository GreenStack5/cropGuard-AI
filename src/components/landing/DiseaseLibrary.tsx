import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGatedNavigate } from '../../auth/hooks'
import DiseaseCard from '../DiseaseCard'
import type { Disease } from '../../data/diseases'
import { diseases } from '../../data/diseases'
import pepperCard from '../../assets/images/card-pepper.png'
import tomatoCard from '../../assets/images/card-tomato.png'
import cassavaCard from '../../assets/images/card-cassava.png'
import maizeCard from '../../assets/images/card-maize.png'

interface PreviewCard {
  disease: Disease
  image: string
  crop?: string
  onLearnMore: () => void
}

const PREVIEW: PreviewCard[] = [
  {
    disease: diseases.find((d) => d.id === 'pepper-bacterial-spot')!,
    image: pepperCard,
    crop: 'Maize',
    onLearnMore: () => undefined,
  },
  {
    disease: diseases.find((d) => d.id === 'tomato-early-blight')!,
    image: tomatoCard,
    onLearnMore: () => undefined,
  },
  {
    disease: diseases.find((d) => d.id === 'cassava-mosaic-disease')!,
    image: cassavaCard,
    onLearnMore: () => undefined,
  },
  {
    disease: diseases.find((d) => d.id === 'maize-leaf-blight')!,
    image: maizeCard,
    onLearnMore: () => undefined,
  },
]

function DiseaseLibrary() {
  const gatedNavigate = useGatedNavigate()

  const handleLearnMore = (diseaseId: string) => () => {
    gatedNavigate(`/library/${diseaseId}`)
  }

  return (
    <section className="library" id="library">
      <div className="library__inner">
        <div className="library__header">
          <p className="library__label">
            DISEASE LIBRARY
            <span className="library__label-line" aria-hidden="true" />
          </p>
          <h2 className="library__title">Know what you&rsquo;re looking at.</h2>
          <p className="library__text">
            Explore our library of common crop diseases and learn how to
            identify them early.
          </p>
          <Link to="/library" className="library__link">
            Explore Disease Library
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
        <ul className="library__grid" role="list">
          {PREVIEW.map((card) => (
            <li key={card.disease.id} className="disease-card">
              <DiseaseCard
                disease={card.disease}
                imageOverride={card.image}
                cropOverride={card.crop}
                onLearnMore={handleLearnMore(card.disease.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default DiseaseLibrary