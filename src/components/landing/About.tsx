import type { JSX } from 'react'
import { Scan, Search, ShieldCheck, Sprout } from 'lucide-react'
import clusterImg from '../../assets/images/about-cluster.png'

interface Feature {
  title: string
  text: string
  icon: () => JSX.Element
}

const FEATURES: Feature[] = [
  {
    title: 'See It',
    text: 'Capture the symptoms in seconds',
    icon: () => <Scan size={20} strokeWidth={1.8} />,
  },
  {
    title: 'Understand It',
    text: 'Know what you might be dealing with',
    icon: () => <Search size={20} strokeWidth={1.8} />,
  },
  {
    title: 'Treat It',
    text: 'Get practical treatment guidance',
    icon: () => <ShieldCheck size={20} strokeWidth={1.8} />,
  },
  {
    title: 'Prevent It',
    text: 'Learn how to protect your future crops',
    icon: () => <Sprout size={20} strokeWidth={1.8} />,
  },
]

function About() {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        <div className="about__content">
          <div className="about__intro">
            <span className="about__label">
              ABOUT CROPGUARD AI
            </span>
            <h2 className="about__title">
              Built for the people<br />who grow what we eat.
            </h2>
            <p className="about__text">
              CropGuard AI is designed to help smallholder farmers and everyday
              growers quickly identify crop diseases and take the right actions.
            </p>
          </div>
          <ul className="about__grid" role="list">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="feature">
                <span className="feature__icon" aria-hidden="true">
                  <feature.icon />
                </span>
                <div className="feature__body">
                  <h3 className="feature__title">{feature.title}</h3>
                  <p className="feature__text">{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="about__media">
          <img
            className="about__cluster"
            src={clusterImg}
            alt="Farmers inspecting crops and healthy plants"
          />
        </div>
      </div>
    </section>
  )
}

export default About