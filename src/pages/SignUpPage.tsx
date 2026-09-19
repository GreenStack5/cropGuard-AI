import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getRedirectTarget } from '../auth/contexts'
import { useAuth } from '../auth/hooks'
import GoogleGlyph from '../components/GoogleGlyph'
import logoImg from '../assets/images/cropguard_logo.png'

function SignUpPage() {
  const { user, initialized, configured, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryNext = searchParams.get('next')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (initialized && user) {
      navigate(getRedirectTarget(queryNext ?? '/dashboard'), { replace: true })
    }
  }, [initialized, user, navigate, queryNext])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setNotice('')
    if (!configured) {
      navigate(getRedirectTarget(queryNext ?? '/dashboard'), { replace: true })
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    setBusy(true)
    try {
      const { needsEmailConfirmation } = await signUp(email.trim(), password, {
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
      })
      if (needsEmailConfirmation) {
        setNotice('Check your inbox to confirm your email, then sign in to continue.')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create your account. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setNotice('')
    if (!configured) {
      navigate(getRedirectTarget(queryNext ?? '/dashboard'), { replace: true })
      return
    }
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign up with Google. Please try again.')
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-heading">
        <Link to="/" className="auth-heading__brand">
          <img className="auth-heading__logo" src={logoImg} alt="" />
          <span>CropGuard AI</span>
        </Link>
      </div>

      <div className="auth-card">
        <div className="auth-card__intro">
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__sub">Join thousands of smart farmers today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-name">Fullname</label>
            <input
              className="auth-input"
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Enter your fullname"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-phone">Phone Number</label>
            <input
              className="auth-input"
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Email Address</label>
            <input
              className="auth-input"
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-password">Password</label>
            <input
              className="auth-input"
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-confirm">Confirm Password</label>
            <input
              className="auth-input"
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}
          {notice && <p className="auth-notice" role="status">{notice}</p>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Create Account'}
          </button>

          <div className="auth-divider">
            <span className="auth-divider__line" aria-hidden="true" />
            <span className="auth-divider__label">Or</span>
            <span className="auth-divider__line" aria-hidden="true" />
          </div>

          <button className="auth-google" type="button" onClick={handleGoogle} disabled={busy}>
            <GoogleGlyph />
            Sign up with Google
          </button>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to={`/login${queryNext ? `?next=${encodeURIComponent(queryNext)}` : ''}`}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

export default SignUpPage