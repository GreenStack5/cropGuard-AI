import { useState } from 'react'
import {
  Bell,
  Download,
  Globe,
  KeyRound,
  Lock,
  Moon,
  ShieldCheck,
  Smartphone,
  User as UserIcon,
} from 'lucide-react'
import { Toggle } from '../../components/ui/Toggle'
import { Card, CardHeader } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import {
  readPreferences,
  savePreferences,
} from '../../lib/preferences'

export function Settings() {
  const [notifications, setNotifications] = useState({
    cropAlerts: true,
    weather: true,
    reminders: true,
    system: false,
    email: true,
    sms: false,
  })

  const [preferences, setPreferences] = useState(() => readPreferences())

  const [security, setSecurity] = useState({
    twoFactor: false,
    dataSharing: true,
  })

  const [account, setAccount] = useState({
    name: preferences.name,
    email: 'amara.okafor@farm.com',
  })

  const updatePreferences = (
    updater: (current: ReturnType<typeof readPreferences>) => ReturnType<typeof readPreferences>,
  ) => {
    setPreferences((current) => {
      const next = updater(current)
      savePreferences(next)
      return next
    })
  }

  const updateAccount = (
    updater: (current: typeof account) => typeof account,
  ) => {
    setAccount((current) => {
      const next = updater(current)
      if (next.name !== account.name) {
        updatePreferences((prefs) => ({ ...prefs, name: next.name }))
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account, notifications, and app preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Account"
            subtitle="Your basic account information"
          />
          <div className="grid gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <UserIcon className="size-4" />
              </span>
              <p className="text-sm font-semibold text-ink">
                Signed in as <span className="text-brand-700">{account.email}</span>
              </p>
            </div>
            <Input
              label="Display name"
              value={account.name}
              onChange={(event) =>
                updateAccount((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Input
              label="Email address"
              type="email"
              value={account.email}
              onChange={(event) =>
                setAccount((current) => ({ ...current, email: event.target.value }))
              }
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Notifications"
            subtitle="Which alerts you receive about your crops"
          />
          <div className="divide-y divide-stone-100">
            {[
              {
                key: 'cropAlerts' as const,
                label: 'Disease & crop alerts',
                description: 'Alerts when a scan finds a problem',
              },
              {
                key: 'weather' as const,
                label: 'Weather warnings',
                description: 'Heavy rain, frost, or drought forecasts',
              },
              {
                key: 'reminders' as const,
                label: 'Care reminders',
                description: 'Fertilising, watering and pruning reminders',
              },
              {
                key: 'system' as const,
                label: 'System updates',
                description: 'Model upgrades and new features',
              },
            ].map((item) => (
              <div key={item.key} className="p-5">
                <Toggle
                  checked={notifications[item.key]}
                  onChange={(value) =>
                    setNotifications((current) => ({ ...current, [item.key]: value }))
                  }
                  label={item.label}
                  description={item.description}
                />
              </div>
            ))}
            <div className="border-t border-stone-100 bg-stone-50/50 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Bell className="size-4 text-brand-700" />
                Delivery channels
              </p>
              <div className="mt-4 space-y-5">
                <Toggle
                  checked={notifications.email}
                  onChange={(value) =>
                    setNotifications((current) => ({ ...current, email: value }))
                  }
                  label="Email"
                  description="Daily digest to your inbox"
                />
                <Toggle
                  checked={notifications.sms}
                  onChange={(value) =>
                    setNotifications((current) => ({ ...current, sms: value }))
                  }
                  label="SMS"
                  description="Urgent alerts by text message"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Preferences" subtitle="How the dashboard works for you" />
          <div className="divide-y divide-stone-100">
            <div className="p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Globe className="size-4 text-brand-700" />
                Language & region
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink">
                    Language
                  </span>
                  <select
                    value={preferences.language}
                    onChange={(event) =>
                      updatePreferences((current) => ({
                        ...current,
                        language: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option>English</option>
                    <option>Hausa</option>
                    <option>Yoruba</option>
                    <option>Igbo</option>
                    <option>Swahili</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink">
                    Units
                  </span>
                  <select className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                    <option>Metric (hectares, mm)</option>
                    <option>Imperial (acres, inches)</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="p-5">
              <Toggle
                checked={preferences.reduceMotion}
                onChange={(value) =>
                  updatePreferences((current) => ({ ...current, reduceMotion: value }))
                }
                label="Reduce motion"
                description="Fade page changes instead of sliding"
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Privacy & security"
            subtitle="Control your data and account security"
          />
          <div className="divide-y divide-stone-100">
            <div className="p-5">
              <Toggle
                checked={security.twoFactor}
                onChange={(value) =>
                  setSecurity((current) => ({ ...current, twoFactor: value }))
                }
                label="Two-factor authentication"
                description="Extra code required at sign-in"
              />
            </div>
            <div className="p-5">
              <Toggle
                checked={security.dataSharing}
                onChange={(value) =>
                  setSecurity((current) => ({ ...current, dataSharing: value }))
                }
                label="Share anonymised scan data"
                description="Helps improve disease detection for everyone"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <KeyRound className="size-4 text-brand-700" />
                    Password & device
                  </p>
                  <p className="mt-0.5 text-sm text-stone-500">
                    Change your password or manage signed-in devices.
                  </p>
                </div>
                <Button variant="outline" size="sm" leadingIcon={<Lock className="size-4" />}>
                  Manage
                </Button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Download className="size-4 text-brand-700" />
                    Your data
                  </p>
                  <p className="mt-0.5 text-sm text-stone-500">
                    Export a copy of your scans and profile.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-stone-200/70 bg-white p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Changes saved instantly</p>
            <p className="text-sm text-stone-500">
              Your preferences update automatically as you change them.
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" leadingIcon={<Moon className="size-4" />}>
          Dark mode soon
        </Button>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-stone-400">
        <Smartphone className="size-3.5" />
        App version 1.0.0 · Last updated September 2026
      </p>
    </div>
  )
}