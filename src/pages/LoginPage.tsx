import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getRedirectTarget } from '../auth/contexts'
import { useAuth } from '../auth/hooks'
import GoogleGlyph from '../components/GoogleGlyph'
import logoImg from '../assets/images/cropguard_logo.png'

function LoginPage() {
  const { user, initialized, configured, signInWithPassword, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryNext = searchParams.get('next')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (initialized && user) {
      navigate(getRedirectTarget(queryNext ?? '/dashboard'), { replace: true })
    }
  }, [initialized, user, navigate, queryNext])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!configured) {
      navigate(getRedirectTarget(queryNext ?? '/dashboard'), { replace: true })
      return
    }
    setBusy(true)
    try {
      await signInWithPassword(email.trim(), password)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    if (!configured) {
      navigate(getRedirectTarget(queryNext ?? '/dashboard'), { replace: true })
      return
    }
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in with Google. Please try again.')
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
          <h1 className="auth-card__title">Welcome back!!</h1>
          <p className="auth-card__sub">Sign in to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email Address</label>
            <input
              className="auth-input"
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <input
              className="auth-input"
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="auth-divider">
            <span className="auth-divider__line" aria-hidden="true" />
            <span className="auth-divider__label">Or</span>
            <span className="auth-divider__line" aria-hidden="true" />
          </div>

          <button className="auth-google" type="button" onClick={handleGoogle} disabled={busy}>
            <GoogleGlyph />
            Sign in with Google
          </button>

          <p className="auth-switch">
            Don&rsquo;t have an account yet?{' '}
            <Link to={`/signup${queryNext ? `?next=${encodeURIComponent(queryNext)}` : ''}`}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

export default LoginPage