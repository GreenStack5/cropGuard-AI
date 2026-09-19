import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'

const AUTH_NEXT_KEY = 'cropguard:auth-next'

export function setRedirectTarget(path: string): void {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(AUTH_NEXT_KEY, path)
}

export function getRedirectTarget(fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const pending = window.sessionStorage.getItem(AUTH_NEXT_KEY)
  if (pending) window.sessionStorage.removeItem(AUTH_NEXT_KEY)
  return pending ?? fallback
}

export interface AuthContextValue {
  user: User | null
  initialized: boolean
  configured: boolean
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    metadata: { full_name?: string; phone_number?: string },
  ) => Promise<{ needsEmailConfirmation: boolean }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export interface AuthPromptContextValue {
  requireAuth: (path: string) => void
}

export const AuthPromptContext = createContext<AuthPromptContextValue | null>(null)