import { ArrowRight } from 'lucide-react'
import type { Disease } from '../data/diseases'

interface DiseaseCardProps {
  disease: Disease
  onLearnMore: () => void
  imageOverride?: string
  cropOverride?: string
}

function DiseaseCard({
  disease,
  onLearnMore,
  imageOverride,
  cropOverride,
}: DiseaseCardProps) {
  const image = imageOverride ?? disease.img
  const crop = cropOverride ?? disease.crop
  return (
    <>
      <img
        className="disease-card__img"
        src={image}
        alt={`${disease.name} symptoms on ${disease.crop}`}
        loading="lazy"
      />
      <div className="disease-card__body">
        <div className="disease-card__row">
          <span className="disease-card__title">{disease.name}</span>
          <span className="disease-card__crop">{crop}</span>
        </div>
        <button type="button" className="disease-card__link" onClick={onLearnMore}>
          Learn More
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

export default DiseaseCard