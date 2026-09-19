import { motion } from 'motion/react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  Camera,
  Clock,
  History,
  Leaf,
  ScanSearch,
  ShieldCheck,
  Sprout,
  Stethoscope,
} from 'lucide-react'

import { Link } from '../../lib/router'
import { useRoute } from '../../hooks/useRoute'
import { useScans } from '../../hooks/useScans'
import { alerts } from '../../data/mock'
import type { ScanRecord } from '../../types'
import { readPreferences } from '../../lib/preferences'
import { greetingForHour } from '../../lib/utils'
import { statusMeta } from '../../lib/status'
import { Button } from '../../components/ui/Button'
import { Donut } from '../../components/ui/Donut'
import { StatCard } from '../../components/ui/indicators'
import type { BadgeTone } from '../../components/ui/Badge'
import { Badge } from '../../components/ui/Badge'

function formatScanTime(scan: ScanRecord): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const scanDate = new Date(`${scan.date}T${scan.time || '00:00'}`)
  const isToday = scanDate >= today
  const time12 = scan.time
    ? new Date(`${scan.date}T${scan.time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''
  return isToday && time12 ? `Today, ${time12}` : `${scan.date}, ${time12}`.replace(', ', ', ')
}

export function Home() {
  const { navigate } = useRoute()
  const scans = useScans()
  const firstName = readPreferences().name.split(' ')[0] || 'Farmer'

  const scansThisMonth = scans.filter((scan) => {
    const now = new Date()
    return scan.date.slice(0, 7) === now.toISOString().slice(0, 7)
  }).length

  const diseasesDetected = scans.filter(
    (scan) => scan.status !== 'healthy',
  ).length

  const healthyCount = scans.filter((scan) => scan.status === 'healthy').length
  const healthyPercent = scans.length
    ? Math.round((healthyCount / scans.length) * 100)
    : 0
  const requiresAttention = scans.filter(
    (scan) => scan.status === 'affected',
  ).length

  const unreadAlerts = alerts.filter((a) => !a.read)
  const recentScans = [...scans].slice(0, 3)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">
            {greetingForHour()}, {firstName}!
          </h1>
          <p className="mt-1 text-sm text-stone-500 sm:text-base">
            Here&apos;s what&apos;s happening at your farm today.
          </p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          icon={ScanSearch}
          label="Scans This Month"
          value={scansThisMonth}
          hint="+20% from last month"
        />
        <StatCard
          icon={Stethoscope}
          label="Diseases Detected"
          value={diseasesDetected}
          tone="danger"
        />
        <StatCard
          icon={Leaf}
          label="Healthy"
          value={healthyCount}
          tone="success"
        />
        <StatCard
          icon={Bell}
          label="Requires attention"
          value={requiresAttention}
          tone="warning"
          hint={`${unreadAlerts.length} alerts`}
        />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 p-6 text-white shadow-lg sm:p-8"
      >
        <div className="absolute -right-10 -top-10 size-52 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 right-24 size-40 rounded-full bg-white/5" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="max-w-lg text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              Scan Crop Now
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-100 sm:text-base">
              Detect diseases instantly with AI technology.
            </p>
            <Button
              onClick={() => navigate('scan')}
              leadingIcon={<Camera className="size-5 text-brand-900" />}
              variant="outline"
              className="mt-6 rounded-2xl border-none bg-white px-6 font-bold text-brand-900 shadow-md hover:bg-stone-100"
              style={{ color: '#14532d', backgroundColor: '#ffffff' }}
            >
              <span className="font-bold text-brand-900" style={{ color: '#14532d' }}>
                Scan Your Crop
              </span>
            </Button>
          </div>
          <div className="hidden justify-end md:flex">
            <span className="flex size-32 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Leaf className="size-14 text-green-100" />
            </span>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-ink">Recents Scans</h2>
              <p className="mt-0.5 text-sm text-stone-500">
                Your latest crop health checks
              </p>
            </div>
            <Link
              to="history"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800"
            >
              View All
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="divide-y divide-stone-100">
            {recentScans.length === 0 ? (
              <li className="flex flex-col items-center px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <ScanSearch className="size-6" />
                </span>
                <p className="mt-4 text-sm font-bold text-ink">No scans yet</p>
                <p className="mt-1 text-sm text-stone-500">
                  Scan your first crop to see results here.
                </p>
                <Button
                  className="mt-5"
                  onClick={() => navigate('scan')}
                  leadingIcon={<Camera className="size-4" />}
                >
                  Scan your crop
                </Button>
              </li>
            ) : (
              recentScans.map((scan) => {
                const meta = statusMeta[scan.status]
                return (
                  <li key={scan.id} className="flex items-center gap-4 px-6 py-4">
                    {scan.thumbnail ? (
                      <img
                        src={scan.thumbnail}
                        alt={scan.cropName}
                        className="size-14 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                        {scan.cropEmoji}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-sm font-bold text-ink">{scan.cropName}</p>
                        {scan.diseaseName ? (
                          <span className="hidden text-sm text-stone-400 sm:inline">
                            · {scan.diseaseName}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-400">
                        <Clock className="size-3.5" />
                        {formatScanTime(scan)}
                      </p>
                    </div>
                    <Badge tone={meta.tone as BadgeTone} dot>
                      {meta.label}
                    </Badge>
                  </li>
                )
              })
            )}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-base font-bold text-ink">Health Overview</h2>
            <div className="mt-5 flex items-center justify-center">
              <Donut
                value={healthyPercent}
                label="Healthy crops"
                sublabel="Healthy"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-base font-bold text-ink">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                {
                  icon: Camera,
                  label: 'Scan Crop',
                  to: 'scan' as const,
                  tone: 'bg-brand-700 text-white',
                },
                {
                  icon: BookOpen,
                  label: 'Disease Library',
                  to: 'disease' as const,
                  tone: 'bg-brand-50 text-brand-700',
                },
                {
                  icon: ShieldCheck,
                  label: 'Prevention Tips',
                  to: 'tips' as const,
                  tone: 'bg-green-50 text-green-700',
                },
                {
                  icon: History,
                  label: 'History',
                  to: 'history' as const,
                  tone: 'bg-amber-50 text-amber-700',
                },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  onClick={() => navigate(action.to)}
                  className="flex flex-col items-start gap-2.5 rounded-2xl border border-stone-100 bg-surface/60 p-4 text-left transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-xl ${action.tone}`}
                  >
                    <action.icon className="size-5" />
                  </span>
                  <span className="text-sm font-bold text-ink">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
            <h2 className="text-base font-bold text-ink">Important alerts</h2>
            <Link to="alerts" className="text-sm font-bold text-brand-700 hover:text-brand-800">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-stone-100">
            {unreadAlerts.slice(0, 2).map((alert) => (
              <li key={alert.id} className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Badge tone="danger" dot>
                    {alert.type === 'weather' ? 'Weather' : 'Action needed'}
                  </Badge>
                </div>
                <p className="mt-2 text-sm font-bold text-ink">{alert.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">
                  {alert.message}
                </p>
              </li>
            ))}
            {unreadAlerts.length === 0 ? (
              <li className="flex items-center gap-3 px-6 py-6 text-sm text-stone-500">
                <Sprout className="size-5 text-brand-700" />
                You&apos;re all caught up.
              </li>
            ) : null}
          </ul>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="grid items-center gap-6 rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
        >
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">
              Featured in the disease library
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
              Browse symptoms, causes, treatments, and prevention steps for the
              most common crop diseases in your region.
            </p>
            <Button
              className="mt-5"
              onClick={() => navigate('disease')}
              variant="secondary"
              leadingIcon={<BookOpen className="size-4" />}
            >
              Open disease library
            </Button>
          </div>
        </motion.section>
      </section>
    </div>
  )
}