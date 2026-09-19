import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react'
import type { Route } from '../types'
import { RouterContext } from './router-context'

const PATH_TO_ROUTE: Record<string, Route> = {
  '/': 'home',
  '/scan': 'scan',
  '/disease-library': 'disease',
  '/alerts': 'alerts',
  '/prevention-tips': 'tips',
  '/history': 'history',
  '/profile': 'profile',
  '/settings': 'settings',
  '/supplier': 'supplier',
  '/supplier/products': 'supplier-products',
  '/supplier/orders': 'supplier-orders',
  '/supplier/notifications': 'supplier-notifications',
  '/supplier/profile': 'supplier-profile',
  '/supplier/settings': 'supplier-settings',
}

const ROUTE_TO_PATH: Record<Route, string> = {
  home: '/',
  scan: '/scan',
  disease: '/disease-library',
  alerts: '/alerts',
  tips: '/prevention-tips',
  history: '/history',
  profile: '/profile',
  settings: '/settings',
  supplier: '/supplier',
  'supplier-products': '/supplier/products',
  'supplier-orders': '/supplier/orders',
  'supplier-notifications': '/supplier/notifications',
  'supplier-profile': '/supplier/profile',
  'supplier-settings': '/supplier/settings',
}

const ROUTE_TO_TITLE: Record<Route, string> = {
  home: 'Home',
  scan: 'Scan Crop',
  disease: 'Disease Library',
  alerts: 'Alerts',
  tips: 'Prevention Tips',
  history: 'History',
  profile: 'Profile',
  settings: 'Settings',
  supplier: 'Supplier Dashboard',
  'supplier-products': 'Supplier Products',
  'supplier-orders': 'Supplier Orders',
  'supplier-notifications': 'Supplier Notifications',
  'supplier-profile': 'Supplier Profile',
  'supplier-settings': 'Supplier Settings',
}

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '')
  const path = hash === '' ? '/' : hash
  return PATH_TO_ROUTE[path] ?? 'home'
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.title = `${ROUTE_TO_TITLE[route] || 'Dashboard'} · CropGuard AI`
  }, [route])

  const navigate = useCallback((next: Route) => {
    window.location.hash = ROUTE_TO_PATH[next]
  }, [])

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: Route
}

export function Link({ to, children, ...rest }: LinkProps) {
  const { navigate } = useContext(RouterContext) ?? { navigate: () => {} }

  return (
    <a
      {...rest}
      href={`#${ROUTE_TO_PATH[to]}`}
      onClick={(event) => {
        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}