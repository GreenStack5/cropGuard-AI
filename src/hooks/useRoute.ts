import { useContext } from 'react'
import { RouterContext } from '../lib/router-context'

export function useRoute() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRoute must be used within RouterProvider')
  return value
}