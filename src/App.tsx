import { useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { RouterProvider } from './lib/router'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import {
  readPreferences,
  subscribePreferences,
  type AppPreferences,
} from './lib/preferences'

function App() {
  const [preferences, setPreferences] = useState<AppPreferences>(() => readPreferences())

  useEffect(() => subscribePreferences(setPreferences), [])

  return (
    <MotionConfig reducedMotion={preferences.reduceMotion ? 'always' : 'user'}>
      <RouterProvider>
        <DashboardLayout />
      </RouterProvider>
    </MotionConfig>
  )
}

export default App