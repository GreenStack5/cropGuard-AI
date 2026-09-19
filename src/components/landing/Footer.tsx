import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGatedNavigate } from '../../auth/hooks'
import logoImg from '../../assets/images/cropguard_logo.png'

type FooterLink =
  | { label: string; scan: true }
  | { label: string; to: string }
  | { label: string; anchor: string }
  | { label: string; none: true }

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Scan Crop', scan: true },
      { label: 'Disease Library', to: '/library' },
      { label: 'How It Works', anchor: 'how' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', none: true },
      { label: 'Guides', none: true },
      { label: 'Help Center', none: true },
      { label: 'Contact Us', none: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', anchor: 'about' },
      { label: 'Privacy Policy', none: true },
      { label: 'Terms of Service', none: true },
    ],
  },
]

function scrollToSection(anchor: string) {
  let tries = 12
  const attempt = () => {
    const element = document.getElementById(anchor)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (tries > 0) {
      tries -= 1
      requestAnimationFrame(attempt)
    }
  }
  requestAnimationFrame(attempt)
}

function Footer() {
  const [email, setEmail] = useState('')
  const gatedNavigate = useGatedNavigate()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const goHomeAndScroll = (event: FormEvent, anchor: string) => {
    event.preventDefault()
    if (pathname !== '/') {
      navigate('/')
      requestAnimationFrame(() => scrollToSection(anchor))
      return
    }
    scrollToSection(anchor)
  }

  const handleLink = (event: FormEvent, link: FooterLink) => {
    event.preventDefault()
    if ('scan' in link) {
      gatedNavigate('/scan')
      return
    }
    if ('to' in link) {
      navigate(link.to)
      return
    }
    if ('anchor' in link) {
      goHomeAndScroll(event, link.anchor)
    }
  }

  const subscribe = (event: FormEvent) => {
    event.preventDefault()
    setEmail('')
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__brand-name">
              <img className="footer__brand-logo" src={logoImg} alt="CropGuard AI" />
              CropGuard <span className="brand__ai">AI</span>
            </span>
            <p className="footer__tagline">
              Helping farmers detect earlier,
              <br />
              treat smarter, and protect
              <br />
              what they grow
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} className="footer-col" aria-label={column.title}>
              <h3 className="footer-col__title">{column.title}</h3>
              <ul role="list">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href="#"
                      className="footer-col__link"
                      onClick={(event) => handleLink(event, link)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="newsletter">
            <h3 className="newsletter__title">Subscribe to our newsletter</h3>
            <p className="newsletter__text">
              Get tips, crop care guides, and product updates.
            </p>
            <form className="newsletter__form" onSubmit={subscribe}>
              <label htmlFor="newsletter-email" className="visually-hidden">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                className="newsletter__input"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" className="newsletter__btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <span>&copy; 2026 CropGuard AI. All Rights Reserved</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer