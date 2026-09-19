import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext, AuthPromptContext } from './contexts'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export function useAuthPrompt() {
  const context = useContext(AuthPromptContext)
  if (!context) throw new Error('useAuthPrompt must be used within an AuthPromptProvider')
  return context
}

export function useGatedNavigate(): (path: string) => void {
  const { user } = useAuth()
  const { requireAuth } = useAuthPrompt()
  const navigate = useNavigate()
  return useCallback(
    (path: string) => {
      if (user) navigate(path)
      else requireAuth(path)
    },
    [user, requireAuth, navigate],
  )
}