import { useState } from 'react'
import { CheckCheck, Inbox } from 'lucide-react'
import { alerts as initialAlerts } from '../../data/mock'
import type { Alert, AlertType } from '../../types'
import { AlertItem } from '../../components/alerts/AlertItem'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'

type Filter = 'all' | 'unread' | AlertType

const filters: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'disease', label: 'Disease alerts' },
  { key: 'crop-warning', label: 'Crop warnings' },
  { key: 'weather', label: 'Weather' },
  { key: 'reminder', label: 'Reminders' },
  { key: 'system', label: 'System' },
]

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [filter, setFilter] = useState<Filter>('all')

  const unreadCount = alerts.filter((a) => !a.read).length

  const toggleRead = (id: string) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id ? { ...alert, read: !alert.read } : alert,
      ),
    )
  }

  const markAllRead = () => {
    setAlerts((current) => current.map((alert) => ({ ...alert, read: true })))
  }

  const filtered = alerts.filter((alert) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !alert.read
    return alert.type === filter
  })

  const filteredCount = (key: Filter) => {
    if (key === 'all') return alerts.length
    if (key === 'unread') return unreadCount
    return alerts.filter((a) => a.type === key).length
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        subtitle={`You have ${unreadCount} unread ${unreadCount === 1 ? 'alert' : 'alerts'} about your crops and account.`}
        action={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              onClick={markAllRead}
              leadingIcon={<CheckCheck className="size-4" />}
            >
              Mark all as read
            </Button>
          ) : null
        }
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            count={filteredCount(item.key)}
            active={filter === item.key}
            onClick={() => setFilter(item.key)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]">
          <EmptyState
            icon={Inbox}
            title={
              filter === 'unread'
                ? "You're all caught up"
                : 'No alerts in this category'
            }
            message={
              filter === 'unread'
                ? 'There are no unread alerts right now. Keep checking on your crops regularly.'
                : 'There are no alerts in this category at the moment. Check back after your next crop scan.'
            }
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((alert, index) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onToggleRead={toggleRead}
              index={index}
            />
          ))}
        </ul>
      )}

      <p className="text-center text-xs text-stone-400">
        You can manage notification preferences in{' '}
        <a
          href="#/settings"
          className="font-bold text-brand-700 hover:text-brand-800"
        >
          Settings
        </a>
        .
      </p>
    </div>
  )
}