import { ArrowRight, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGatedNavigate } from '../../auth/hooks'
import heroImg from '../../assets/images/hero-blob.png'

function Hero() {
  const navigate = useNavigate()
  const gatedNavigate = useGatedNavigate()

  return (
    <section className="hero" id="home">
      <div className="hero__text">
        <h1 className="hero__title">
          Protect Your Crops
          <br />
          Boost Your Harvest
        </h1>
        <p className="hero__sub">
          CropGuard AI helps you detect crop disease early, get expert treatment
          advice and stay alert with real time alerts and proven prevention tips.
        </p>
        <div className="hero__actions">
          <button type="button" className="btn-scan" onClick={() => gatedNavigate('/scan')}>
            Scan Your Crop
            <ArrowRight size={24} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn-library"
            onClick={() => navigate('/library')}
          >
            Explore Disease Library
          </button>
        </div>
        <p className="hero__chip">
          <Globe className="hero__chip-icon" size={18} strokeWidth={2} aria-hidden="true" />
          Available in English, Yoruba, Igbo &amp; pidgin
        </p>
      </div>
      <div className="hero__media">
        <img
          className="hero__img"
          src={heroImg}
          alt="Farmer inspecting a healthy crop leaf held up to the light"
        />
      </div>
    </section>
  )
}

export default Hero