import { useState } from 'react'
import {
  Camera,
  Leaf,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Droplets,
  ThermometerSun,
  Wind,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useGatedNavigate } from '../auth/hooks'
import logoImg from '../assets/images/cropguard_logo.png'

/* ── static demo data ─────────────────────────────────── */
const STATS = [
  {
    id: 'total-scans',
    label: 'Total Scans',
    value: '24',
    delta: '+3 this week',
    positive: true,
    icon: Camera,
    color: 'stat-card--green',
  },
  {
    id: 'diseases-detected',
    label: 'Diseases Detected',
    value: '7',
    delta: '2 active threats',
    positive: false,
    icon: AlertTriangle,
    color: 'stat-card--amber',
  },
  {
    id: 'crops-monitored',
    label: 'Crops Monitored',
    value: '5',
    delta: 'Tomato, Cassava +3',
    positive: true,
    icon: Leaf,
    color: 'stat-card--teal',
  },
  {
    id: 'health-score',
    label: 'Farm Health Score',
    value: '82%',
    delta: '+6% vs last month',
    positive: true,
    icon: TrendingUp,
    color: 'stat-card--blue',
  },
]

const RECENT_SCANS = [
  {
    id: 'scan-1',
    crop: 'Tomato',
    disease: 'Late Blight',
    date: 'Today, 9:12 AM',
    severity: 'high',
    diseaseId: 'tomato-late-blight',
  },
  {
    id: 'scan-2',
    crop: 'Cassava',
    disease: 'Mosaic Virus',
    date: 'Yesterday, 3:45 PM',
    severity: 'medium',
    diseaseId: 'cassava-mosaic-disease',
  },
  {
    id: 'scan-3',
    crop: 'Pepper',
    disease: 'Healthy',
    date: 'Sep 17, 10:30 AM',
    severity: 'none',
    diseaseId: null,
  },
  {
    id: 'scan-4',
    crop: 'Maize',
    disease: 'Northern Leaf Blight',
    date: 'Sep 16, 8:00 AM',
    severity: 'medium',
    diseaseId: 'maize-northern-blight',
  },
]

const ALERTS = [
  {
    id: 'alert-1',
    title: 'High humidity detected',
    text: 'Risk of fungal infection in tomato plots. Consider fungicide application.',
    time: '2h ago',
    icon: Droplets,
    type: 'warning',
  },
  {
    id: 'alert-2',
    title: 'Treatment reminder',
    text: 'Cassava Mosaic Virus — Day 3 of copper spray treatment.',
    time: '5h ago',
    icon: CheckCircle2,
    type: 'info',
  },
  {
    id: 'alert-3',
    title: 'Weather alert',
    text: 'High temperatures forecast this week. Irrigate early morning.',
    time: '1d ago',
    icon: ThermometerSun,
    type: 'warning',
  },
]

const TIPS = [
  'Rotate crops between seasons to break disease cycles.',
  'Inspect leaves from underside first — that is where most pests hide.',
  'Water at root level to avoid fungal spread from wet foliage.',
  'Remove and burn infected plant material; never compost it.',
]

const WEATHER = [
  { day: 'Mon', icon: ThermometerSun, high: 31, low: 22, label: 'Sunny' },
  { day: 'Tue', icon: Wind, high: 29, low: 21, label: 'Windy' },
  { day: 'Wed', icon: Droplets, high: 26, low: 20, label: 'Rainy' },
  { day: 'Thu', icon: ThermometerSun, high: 30, low: 22, label: 'Sunny' },
  { day: 'Fri', icon: ThermometerSun, high: 32, low: 23, label: 'Sunny' },
]

const SEVERITY_MAP: Record<string, { label: string; cls: string }> = {
  high: { label: 'High', cls: 'scan-badge--high' },
  medium: { label: 'Medium', cls: 'scan-badge--medium' },
  none: { label: 'Healthy', cls: 'scan-badge--healthy' },
}

/* ── component ────────────────────────────────────────── */
function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const gatedNavigate = useGatedNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [tipIndex] = useState(0)

  const fullName = user?.user_metadata?.full_name as string | undefined
  const firstName = fullName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Farmer'

  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="db-shell">
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="db-sidebar">
        <div className="db-sidebar__brand">
          <img src={logoImg} alt="CropGuard AI" className="db-sidebar__logo" />
          <span className="db-sidebar__brand-name">
            CropGuard <span className="db-sidebar__ai">AI</span>
          </span>
        </div>

        <nav className="db-sidebar__nav" aria-label="Dashboard navigation">
          <a href="#overview" className="db-sidebar__link db-sidebar__link--active">
            <TrendingUp size={18} aria-hidden="true" />
            Overview
          </a>
          <button
            type="button"
            className="db-sidebar__link"
            onClick={() => gatedNavigate('/scan')}
          >
            <Camera size={18} aria-hidden="true" />
            Scan Crop
          </button>
          <Link to="/library" className="db-sidebar__link">
            <Leaf size={18} aria-hidden="true" />
            Disease Library
          </Link>
          <a href="#alerts" className="db-sidebar__link">
            <Bell size={18} aria-hidden="true" />
            Alerts
            <span className="db-sidebar__badge">3</span>
          </a>
        </nav>

        <div className="db-sidebar__footer">
          <div className="db-sidebar__user">
            <div className="db-sidebar__avatar" aria-hidden="true">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="db-sidebar__user-name">{firstName}</p>
              <p className="db-sidebar__user-role">Farmer</p>
            </div>
          </div>
          <button
            type="button"
            className="db-sidebar__logout"
            onClick={handleLogout}
            disabled={signingOut}
          >
            {signingOut ? 'Logging out…' : 'Log Out'}
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────── */}
      <main className="db-main">
        {/* Top bar */}
        <div className="db-topbar">
          <div>
            <h1 className="db-topbar__title">Good morning, {firstName} 👋</h1>
            <p className="db-topbar__sub">Here's what's happening on your farm today.</p>
          </div>
          <button
            type="button"
            className="db-topbar__cta"
            onClick={() => gatedNavigate('/scan')}
          >
            <Camera size={18} aria-hidden="true" />
            Scan Now
          </button>
        </div>

        {/* Stat cards */}
        <section className="db-stats" id="overview" aria-label="Farm statistics">
          {STATS.map((stat) => (
            <div key={stat.id} className={`stat-card ${stat.color}`}>
              <div className="stat-card__header">
                <span className="stat-card__icon-wrap" aria-hidden="true">
                  <stat.icon size={20} strokeWidth={1.8} />
                </span>
                <span className="stat-card__label">{stat.label}</span>
              </div>
              <p className="stat-card__value">{stat.value}</p>
              <p className={`stat-card__delta ${stat.positive ? 'delta--pos' : 'delta--neg'}`}>
                {stat.delta}
              </p>
            </div>
          ))}
        </section>

        {/* Two-column row */}
        <div className="db-row">
          {/* Recent scans */}
          <section className="db-card db-card--scans">
            <div className="db-card__head">
              <h2 className="db-card__title">Recent Scans</h2>
              <Link to="/library" className="db-card__see-all">
                See all <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <ul className="scan-list" role="list">
              {RECENT_SCANS.map((scan) => {
                const badge = SEVERITY_MAP[scan.severity]
                return (
                  <li key={scan.id} className="scan-item">
                    <div className="scan-item__crop-icon" aria-hidden="true">
                      <Leaf size={16} />
                    </div>
                    <div className="scan-item__info">
                      <p className="scan-item__name">{scan.crop}</p>
                      <p className="scan-item__disease">{scan.disease}</p>
                    </div>
                    <div className="scan-item__meta">
                      <span className={`scan-badge ${badge.cls}`}>{badge.label}</span>
                      <span className="scan-item__date">
                        <Clock size={11} aria-hidden="true" /> {scan.date}
                      </span>
                    </div>
                    {scan.diseaseId && (
                      <Link
                        to={`/library/${scan.diseaseId}`}
                        className="scan-item__link"
                        aria-label={`View details for ${scan.disease}`}
                      >
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>

          {/* Alerts panel */}
          <section className="db-card db-card--alerts" id="alerts">
            <div className="db-card__head">
              <h2 className="db-card__title">Alerts & Reminders</h2>
              <Bell size={16} className="db-card__head-icon" aria-hidden="true" />
            </div>
            <ul className="alert-list" role="list">
              {ALERTS.map((alert) => (
                <li key={alert.id} className={`alert-item alert-item--${alert.type}`}>
                  <span className="alert-item__icon" aria-hidden="true">
                    <alert.icon size={16} />
                  </span>
                  <div>
                    <p className="alert-item__title">{alert.title}</p>
                    <p className="alert-item__text">{alert.text}</p>
                    <p className="alert-item__time">{alert.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Bottom row: Tip + Weather + Quick Actions */}
        <div className="db-row db-row--bottom">
          {/* Crop tip */}
          <section className="db-card db-card--tip">
            <h2 className="db-card__title">💡 Today's Crop Tip</h2>
            <blockquote className="tip-quote">{TIPS[tipIndex % TIPS.length]}</blockquote>
            <Link to="/library" className="tip-link">
              Browse Disease Library <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </section>

          {/* Weather mini */}
          <section className="db-card db-card--weather">
            <h2 className="db-card__title">5-Day Forecast</h2>
            <p className="weather-location">Ibadan, Oyo State</p>
            <div className="weather-row">
              {WEATHER.map((w) => (
                <div key={w.day} className="weather-day">
                  <span className="weather-day__name">{w.day}</span>
                  <w.icon size={20} className="weather-day__icon" aria-hidden="true" />
                  <span className="weather-day__temp">{w.high}°</span>
                  <span className="weather-day__low">{w.low}°</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="db-card db-card--actions">
            <h2 className="db-card__title">Quick Actions</h2>
            <div className="quick-actions">
              <button
                type="button"
                className="quick-action"
                onClick={() => gatedNavigate('/scan')}
              >
                <Camera size={20} aria-hidden="true" />
                <span>New Scan</span>
              </button>
              <Link to="/library" className="quick-action">
                <Leaf size={20} aria-hidden="true" />
                <span>Library</span>
              </Link>
              <Link to="/" className="quick-action">
                <TrendingUp size={20} aria-hidden="true" />
                <span>Home</span>
              </Link>
              <a href="#alerts" className="quick-action">
                <Bell size={20} aria-hidden="true" />
                <span>Alerts</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage