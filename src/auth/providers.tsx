import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext, AuthPromptContext, setRedirectTarget, type AuthContextValue } from './contexts'
import { useAuth } from './hooks'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [initialized, setInitialized] = useState(() => !isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    let active = true
    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setUser(data.session?.user ?? null)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setInitialized(true)
      })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Authentication is not configured.')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      metadata: { full_name?: string; phone_number?: string },
    ) => {
      if (!supabase) throw new Error('Authentication is not configured.')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })
      if (error) throw error
      return { needsEmailConfirmation: !data.session }
    },
    [],
  )

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Authentication is not configured.')
    const redirectTo = `${window.location.origin}/login`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initialized,
      configured: isSupabaseConfigured,
      signInWithPassword,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [user, initialized, signInWithPassword, signUp, signInWithGoogle, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthPromptProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [target, setTarget] = useState<string | null>(null)

  const requireAuth = useCallback((path: string) => {
    setRedirectTarget(path)
    setTarget(path)
  }, [])

  const close = useCallback(() => setTarget(null), [])

  const goToAuth = useCallback(
    (route: 'login' | 'signup') => {
      const next = target ?? '/'
      close()
      navigate(`/${route}?next=${encodeURIComponent(next)}`)
    },
    [target, close, navigate],
  )

  const value = useMemo(() => ({ requireAuth }), [requireAuth])

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
      {target !== null && (
        <div
          className="auth-prompt"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-prompt-title"
        >
          <button
            className="auth-prompt__backdrop"
            type="button"
            aria-label="Close"
            onClick={close}
          />
          <div className="auth-prompt__card" role="document">
            <button
              className="auth-prompt__close"
              type="button"
              aria-label="Close"
              onClick={close}
            >
              &times;
            </button>
            <h3 id="auth-prompt-title" className="auth-prompt__title">
              Create a free account
            </h3>
            <p className="auth-prompt__text">
              Sign up to scan your crops and unlock full disease treatments.
            </p>
            <div className="auth-prompt__actions">
              <button
                type="button"
                className="auth-btn auth-btn--primary"
                onClick={() => goToAuth('signup')}
              >
                Sign Up
              </button>
              <button
                type="button"
                className="auth-btn auth-btn--outline"
                onClick={() => goToAuth('login')}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthPromptContext.Provider>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth()
  const location = useLocation()

  if (!initialized) {
    return <div className="page-loader" role="status">Loading&hellip;</div>
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  return children
}