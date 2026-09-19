import {
  Bell,
  BookOpen,
  History,
  Home,
  ScanSearch,
  Settings,
  ShieldCheck,
  User,
  type LucideIcon,
} from 'lucide-react'
import type { Route } from '../../types'

export interface NavItem {
  route: Route
  label: string
  icon: LucideIcon
  badgeKey?: 'alerts'
}

export const primaryNav: NavItem[] = [
  { route: 'home', label: 'Home', icon: Home },
  { route: 'scan', label: 'Scan Crop', icon: ScanSearch },
  { route: 'disease', label: 'Disease Library', icon: BookOpen },
  { route: 'alerts', label: 'Alerts', icon: Bell, badgeKey: 'alerts' },
  { route: 'tips', label: 'Prevention Tips', icon: ShieldCheck },
  { route: 'history', label: 'History', icon: History },
]

export const accountNav: NavItem[] = [
  { route: 'profile', label: 'Profile', icon: User },
  { route: 'settings', label: 'Settings', icon: Settings },
]

export const navLabel: Record<Route, string> = {
  home: 'Home',
  scan: 'Scan Crop',
  disease: 'Disease Library',
  alerts: 'Alerts',
  tips: 'Prevention Tips',
  history: 'Scan History',
  profile: 'Profile',
  settings: 'Settings',
  supplier: 'Supplier Dashboard',
  'supplier-products': 'Supplier Products',
  'supplier-orders': 'Supplier Orders',
  'supplier-notifications': 'Supplier Notifications',
  'supplier-profile': 'Supplier Profile',
  'supplier-settings': 'Supplier Settings',
};