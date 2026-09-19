import { useState, type MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks'
import logoImg from '../../assets/images/cropguard_logo.png'

interface NavLink {
  label: string
  to?: string
  anchor?: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About', anchor: 'about' },
  { label: 'How It Works', anchor: 'how' },
  { label: 'Disease Library', anchor: 'library' },
  { label: 'FAQ', anchor: 'faq' },
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

function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const closeMenu = () => setOpen(false)

  const handleLogout = async () => {
    closeMenu()
    setSigningOut(true)
    try {
      await signOut()
      navigate('/')
    } finally {
      setSigningOut(false)
    }
  }

  const goHomeAndScroll = (event: MouseEvent, anchor: string) => {
    event.preventDefault()
    closeMenu()
    if (pathname !== '/') {
      navigate('/')
      requestAnimationFrame(() => scrollToSection(anchor))
      return
    }
    scrollToSection(anchor)
  }

  const goHome = (event: MouseEvent) => {
    event.preventDefault()
    closeMenu()
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" onClick={goHome}>
          <img className="brand__logo" src={logoImg} alt="CropGuard AI" />
          <span className="brand__name">
            CropGuard <span className="brand__ai">AI</span>
          </span>
        </Link>

        <nav
          className={`site-nav${open ? ' site-nav--open' : ''}`}
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="site-nav__link"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={`#${link.anchor}`}
                className="site-nav__link"
                onClick={(event) => goHomeAndScroll(event, link.anchor ?? '')}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className={`auth${open ? ' auth--open' : ''}`}>
          {user ? (
            <>
              <button
                type="button"
                className="auth__logout"
                onClick={handleLogout}
                disabled={signingOut}
              >
                {signingOut ? 'Logging out…' : 'Log Out'}
              </button>
              <Link to="/dashboard" className="auth__dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="auth__login" onClick={closeMenu}>
                Log In
              </Link>
              <Link to="/signup" className="auth__signup" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  )
}

export default Navbar