import { useGatedNavigate } from '../auth/hooks'
import DiseaseCard from '../components/DiseaseCard'
import { diseases } from '../data/diseases'

function LibraryPage() {
  const gatedNavigate = useGatedNavigate()

  const handleLearnMore = (id: string) => {
    gatedNavigate(`/library/${id}`)
  }

  return (
    <main className="library-page">
      <div className="library-page__inner">
        <header className="library-page__header">
          <p className="library__label">Disease Library</p>
          <h1 className="library-page__title">Know what you&rsquo;re looking at.</h1>
          <p className="library-page__text">
            Explore our library of common crop diseases affecting farmers across
            Nigeria — what they look like and what to do about them. Sign in to
            unlock full treatment and prevention guidance.
          </p>
        </header>
        <ul className="library__grid" role="list">
          {diseases.map((disease) => (
            <li key={disease.id} className="disease-card">
              <DiseaseCard disease={disease} onLearnMore={() => handleLearnMore(disease.id)} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default LibraryPage