import { ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import scanImg from '../assets/images/scan.png'

function ScanPage() {
  return (
    <section className="scan-page">
      <div className="scan-page__card">
        <img
          className="scan-page__img"
          src={scanImg}
          alt="CropGuard AI scanning a crop leaf on a phone"
        />
        <span className="scan-page__icon" aria-hidden="true">
          <ScanLine size={36} strokeWidth={1.7} />
        </span>
        <h2 className="scan-page__title">Scan Your Crop</h2>
        <p className="scan-page__text">
          The photo upload and AI diagnosis flow arrives in the next build step.
        </p>
        <Link className="scan-page__btn" to="/">
          Back to Home
        </Link>
      </div>
    </section>
  )
}

export default ScanPage