import { createContext } from 'react'
import type { Route } from '../types'

export interface RouterContextValue {
  route: Route
  navigate: (route: Route) => void
}

export const RouterContext = createContext<RouterContextValue | null>(null)