import { ArrowRight } from 'lucide-react'
import { useGatedNavigate } from '../../auth/hooks'

function LeafCircleIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#A3D99E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <path d="M17 31c0-7 6-13 14-13" />
      <path d="M31 18c0 8-6 13-14 13" />
      <path d="M17 31c3-3 8-7 14-13" />
    </svg>
  )
}

function Cta() {
  const gatedNavigate = useGatedNavigate()

  return (
    <section className="cta-section">
      <div className="cta">
        <div className="cta__left">
          <div className="cta__icon-wrap" aria-hidden="true">
            <LeafCircleIcon />
          </div>
          <div className="cta__content">
            <h2 className="cta__title">Stop guessing. Get answers.</h2>
            <p className="cta__text">
              A strange spot on your leaf should not mean guessing what went wrong.
              Take a photo and let CropGuard AI help you protect your harvest.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="cta__btn"
          onClick={() => gatedNavigate('/scan')}
        >
          Scan Your Crop
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

export default Cta