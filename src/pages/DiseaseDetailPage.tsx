import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getDisease } from '../data/diseases'

function DiseaseDetailPage() {
  const { diseaseId } = useParams<string>()
  const disease = getDisease(diseaseId)

  if (!disease) {
    return (
      <main className="detail-page">
        <div className="detail-page__inner">
          <h1 className="detail-page__title">Disease not found</h1>
          <p className="detail-page__text">
            We could not find the disease you are looking for.
          </p>
          <Link className="auth-btn auth-btn--primary" to="/library">
            Back to library
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="detail-page">
      <div className="detail-page__inner">
        <Link to="/library" className="detail-page__back">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to library
        </Link>

        <div className="detail-page__head">
          <img
            className="detail-page__img"
            src={disease.img}
            alt={`${disease.name} symptoms on ${disease.crop}`}
          />
          <div className="detail-page__head-text">
            <span className="disease-card__crop">{disease.crop}</span>
            <h1 className="detail-page__title">{disease.name}</h1>
            <p className="detail-page__text">{disease.summary}</p>
          </div>
        </div>

        <section className="detail-block">
          <h2 className="detail-block__title">Symptoms</h2>
          <ul className="detail-block__list">
            {disease.symptoms.map((item) => (
              <li key={item} className="detail-block__item">{item}</li>
            ))}
          </ul>
        </section>

        <section className="detail-block">
          <h2 className="detail-block__title">Treatment</h2>
          <ul className="detail-block__list">
            {disease.treatment.map((item) => (
              <li key={item} className="detail-block__item">{item}</li>
            ))}
          </ul>
        </section>

        <section className="detail-block">
          <h2 className="detail-block__title">Prevention</h2>
          <ul className="detail-block__list">
            {disease.prevention.map((item) => (
              <li key={item} className="detail-block__item">{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default DiseaseDetailPage