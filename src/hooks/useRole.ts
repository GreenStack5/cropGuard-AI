import { useEffect, useState } from 'react'
import type { UserRole } from '../types'
import { getActiveRole, setActiveRole as setStorageRole } from '../lib/storage'
import { useRoute } from './useRoute'

export function useRole() {
  const [role, setRole] = useState<UserRole>(getActiveRole)
  const { navigate } = useRoute()

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(getActiveRole())
    }
    window.addEventListener('cropguard_storage_change', handleStorageChange)
    return () => window.removeEventListener('cropguard_storage_change', handleStorageChange)
  }, [])

  const switchRole = (newRole: UserRole) => {
    setStorageRole(newRole)
    setRole(newRole)
    if (newRole === 'supplier') {
      navigate('supplier')
    } else {
      navigate('home')
    }
  }

  return { role, switchRole }
}
