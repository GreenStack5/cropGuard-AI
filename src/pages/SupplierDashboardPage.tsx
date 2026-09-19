import { useState } from 'react'
import {
  Package,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
  Bell,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  MessageSquare,
  BarChart2,
  Boxes,
  PhoneCall,
  Home,
  LogOut,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/hooks'
import logoImg from '../assets/images/cropguard_logo.png'

/* ── static demo data ─────────────────────────────────── */
const STATS = [
  {
    id: 'active-requests',
    label: 'Active Requests',
    value: '18',
    delta: '+5 today',
    positive: true,
    icon: Users,
    color: 'stat-card--green',
  },
  {
    id: 'products-listed',
    label: 'Products Listed',
    value: '43',
    delta: '3 low stock',
    positive: false,
    icon: Package,
    color: 'stat-card--amber',
  },
  {
    id: 'response-rate',
    label: 'Response Rate',
    value: '94%',
    delta: 'Top 5% of suppliers',
    positive: true,
    icon: Star,
    color: 'stat-card--teal',
  },
  {
    id: 'total-connections',
    label: 'Total Connections',
    value: '312',
    delta: '+27 this month',
    positive: true,
    icon: TrendingUp,
    color: 'stat-card--blue',
  },
]

type RequestStatus = 'new' | 'responded' | 'pending'

interface FarmerRequest {
  id: string
  farmerName: string
  location: string
  crop: string
  disease: string
  product: string
  time: string
  status: RequestStatus
  urgent: boolean
}

const FARMER_REQUESTS: FarmerRequest[] = [
  {
    id: 'req-1',
    farmerName: 'Adewale Okafor',
    location: 'Ibadan, Oyo',
    crop: 'Tomato',
    disease: 'Late Blight',
    product: 'Ridomil Gold MZ',
    time: '12 mins ago',
    status: 'new',
    urgent: true,
  },
  {
    id: 'req-2',
    farmerName: 'Ngozi Eze',
    location: 'Enugu, Enugu',
    crop: 'Cassava',
    disease: 'Mosaic Virus',
    product: 'Confidor 200 SL',
    time: '34 mins ago',
    status: 'new',
    urgent: false,
  },
  {
    id: 'req-3',
    farmerName: 'Musa Ibrahim',
    location: 'Kano, Kano',
    crop: 'Maize',
    disease: 'Northern Leaf Blight',
    product: 'Amistar Xtra',
    time: '1h ago',
    status: 'responded',
    urgent: false,
  },
  {
    id: 'req-4',
    farmerName: 'Funmi Adeyemi',
    location: 'Abeokuta, Ogun',
    crop: 'Pepper',
    disease: 'Bacterial Wilt',
    product: 'Kocide 3000',
    time: '2h ago',
    status: 'pending',
    urgent: true,
  },
  {
    id: 'req-5',
    farmerName: 'Chukwuemeka Nwosu',
    location: 'Awka, Anambra',
    crop: 'Yam',
    disease: 'Anthracnose',
    product: 'Score 250 EC',
    time: '3h ago',
    status: 'responded',
    urgent: false,
  },
]

interface InventoryItem {
  id: string
  name: string
  category: string
  stock: number
  unit: string
  reorderAt: number
  status: 'ok' | 'low' | 'out'
}

const INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Ridomil Gold MZ',
    category: 'Fungicide',
    stock: 142,
    unit: 'kg',
    reorderAt: 50,
    status: 'ok',
  },
  {
    id: 'inv-2',
    name: 'Confidor 200 SL',
    category: 'Insecticide',
    stock: 28,
    unit: 'L',
    reorderAt: 30,
    status: 'low',
  },
  {
    id: 'inv-3',
    name: 'Kocide 3000',
    category: 'Bactericide',
    stock: 0,
    unit: 'kg',
    reorderAt: 20,
    status: 'out',
  },
  {
    id: 'inv-4',
    name: 'Amistar Xtra',
    category: 'Fungicide',
    stock: 76,
    unit: 'L',
    reorderAt: 25,
    status: 'ok',
  },
  {
    id: 'inv-5',
    name: 'Score 250 EC',
    category: 'Fungicide',
    stock: 18,
    unit: 'L',
    reorderAt: 20,
    status: 'low',
  },
]

const RECENT_ACTIVITY = [
  {
    id: 'act-1',
    text: "You responded to Adewale Okafor's request for Ridomil Gold MZ.",
    time: '10 min ago',
    icon: MessageSquare,
    type: 'info',
  },
  {
    id: 'act-2',
    text: 'New farmer request matched: Late Blight treatment needed in Ibadan.',
    time: '25 min ago',
    icon: Bell,
    type: 'warning',
  },
  {
    id: 'act-3',
    text: 'Confidor 200 SL stock is running low — reorder recommended.',
    time: '1h ago',
    icon: AlertCircle,
    type: 'warning',
  },
  {
    id: 'act-4',
    text: 'Connection with Funmi Adeyemi marked complete.',
    time: '2h ago',
    icon: CheckCircle2,
    type: 'success',
  },
]

const STATUS_MAP: Record<RequestStatus, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'scan-badge--high' },
  responded: { label: 'Responded', cls: 'scan-badge--healthy' },
  pending: { label: 'Pending', cls: 'scan-badge--medium' },
}

const STOCK_MAP: Record<string, { label: string; cls: string }> = {
  ok: { label: 'In Stock', cls: 'scan-badge--healthy' },
  low: { label: 'Low Stock', cls: 'scan-badge--medium' },
  out: { label: 'Out of Stock', cls: 'scan-badge--high' },
}

/* ── component ────────────────────────────────────────── */
function SupplierDashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  const fullName = user?.user_metadata?.full_name as string | undefined
  const firstName = fullName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Supplier'

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

        <nav className="db-sidebar__nav" aria-label="Supplier dashboard navigation">
          <a href="#overview" className="db-sidebar__link db-sidebar__link--active">
            <BarChart2 size={18} aria-hidden="true" />
            Overview
          </a>
          <a href="#requests" className="db-sidebar__link">
            <Users size={18} aria-hidden="true" />
            Farmer Requests
            <span className="db-sidebar__badge">18</span>
          </a>
          <a href="#inventory" className="db-sidebar__link">
            <Boxes size={18} aria-hidden="true" />
            Inventory
          </a>
          <a href="#activity" className="db-sidebar__link">
            <Bell size={18} aria-hidden="true" />
            Activity
          </a>
          <Link to="/" className="db-sidebar__link">
            <Home size={18} aria-hidden="true" />
            Home
          </Link>
        </nav>

        <div className="db-sidebar__footer">
          <div className="db-sidebar__user">
            <div className="db-sidebar__avatar db-sidebar__avatar--supplier" aria-hidden="true">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="db-sidebar__user-name">{firstName}</p>
              <p className="db-sidebar__user-role">Agro Supplier</p>
            </div>
          </div>
          <button
            type="button"
            className="db-sidebar__logout"
            onClick={handleLogout}
            disabled={signingOut}
          >
            <LogOut size={14} aria-hidden="true" />
            {signingOut ? 'Logging out\u2026' : 'Log Out'}
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────── */}
      <main className="db-main">
        {/* Top bar */}
        <div className="db-topbar">
          <div>
            <h1 className="db-topbar__title">Welcome back, {firstName} 👋</h1>
            <p className="db-topbar__sub">Here's your supply hub — farmers are waiting.</p>
          </div>
          <button type="button" className="db-topbar__cta" onClick={() => navigate('/')}>
            <ShoppingBag size={18} aria-hidden="true" />
            Add Product
          </button>
        </div>

        {/* Stat cards */}
        <section className="db-stats" id="overview" aria-label="Supplier statistics">
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

        {/* Farmer Requests */}
        <div className="db-row" id="requests">
          <section className="db-card db-card--scans db-card--wide">
            <div className="db-card__head">
              <h2 className="db-card__title">Incoming Farmer Requests</h2>
              <span className="db-card__see-all">
                {FARMER_REQUESTS.filter((r) => r.status === 'new').length} new
                <ChevronRight size={14} aria-hidden="true" />
              </span>
            </div>
            <ul className="scan-list" role="list">
              {FARMER_REQUESTS.map((req) => {
                const badge = STATUS_MAP[req.status]
                return (
                  <li key={req.id} className={`scan-item${req.urgent ? ' scan-item--urgent' : ''}`}>
                    <div
                      className="scan-item__crop-icon scan-item__crop-icon--farmer"
                      aria-hidden="true"
                    >
                      {req.farmerName.charAt(0)}
                    </div>
                    <div className="scan-item__info">
                      <p className="scan-item__name">
                        {req.farmerName}
                        {req.urgent && (
                          <span className="urgent-tag" aria-label="Urgent">
                            {'\u{1F534}'} Urgent
                          </span>
                        )}
                      </p>
                      <p className="scan-item__disease">
                        {req.crop} &middot; {req.disease} &nbsp;&middot;&nbsp;
                        <span className="req-product">
                          Needs: <strong>{req.product}</strong>
                        </span>
                      </p>
                      <p className="scan-item__date req-location">{'\u{1F4CD}'} {req.location}</p>
                    </div>
                    <div className="scan-item__meta">
                      <span className={`scan-badge ${badge.cls}`}>{badge.label}</span>
                      <span className="scan-item__date">
                        <Clock size={11} aria-hidden="true" /> {req.time}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="scan-item__link req-respond-btn"
                      aria-label={`Respond to ${req.farmerName}`}
                    >
                      <PhoneCall size={14} aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        {/* Inventory + Activity row */}
        <div className="db-row">
          {/* Inventory */}
          <section className="db-card db-card--scans" id="inventory">
            <div className="db-card__head">
              <h2 className="db-card__title">Inventory Overview</h2>
              <button type="button" className="db-card__see-all">
                Manage <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
            <ul className="scan-list" role="list">
              {INVENTORY.map((item) => {
                const badge = STOCK_MAP[item.status]
                return (
                  <li key={item.id} className="scan-item">
                    <div
                      className="scan-item__crop-icon"
                      style={{ background: 'var(--color-primary-soft)' }}
                      aria-hidden="true"
                    >
                      <Package size={16} />
                    </div>
                    <div className="scan-item__info">
                      <p className="scan-item__name">{item.name}</p>
                      <p className="scan-item__disease">{item.category}</p>
                    </div>
                    <div className="scan-item__meta">
                      <span className={`scan-badge ${badge.cls}`}>{badge.label}</span>
                      <span className="scan-item__date">
                        {item.stock} {item.unit}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="scan-item__link"
                      aria-label={`Restock ${item.name}`}
                    >
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* Recent Activity */}
          <section className="db-card db-card--alerts" id="activity">
            <div className="db-card__head">
              <h2 className="db-card__title">Recent Activity</h2>
              <Bell size={16} className="db-card__head-icon" aria-hidden="true" />
            </div>
            <ul className="alert-list" role="list">
              {RECENT_ACTIVITY.map((act) => (
                <li key={act.id} className={`alert-item alert-item--${act.type}`}>
                  <span className="alert-item__icon" aria-hidden="true">
                    <act.icon size={16} />
                  </span>
                  <div>
                    <p className="alert-item__text">{act.text}</p>
                    <p className="alert-item__time">{act.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Bottom row */}
        <div className="db-row db-row--bottom">
          {/* Supplier insight tip */}
          <section className="db-card db-card--tip">
            <h2 className="db-card__title">💡 Supplier Insight</h2>
            <blockquote className="tip-quote">
              Farmers who receive a response within 30 minutes are 3× more likely to complete a
              purchase. Keep your response rate high to stay top-listed.
            </blockquote>
            <Link to="/" className="tip-link">
              View your profile <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </section>

          {/* Revenue snapshot */}
          <section className="db-card db-card--weather">
            <h2 className="db-card__title">Revenue Snapshot</h2>
            <p className="weather-location">September 2026</p>
            <div className="revenue-bars">
              {[
                { label: 'Fungicides', pct: 75, value: '\u20A6187k' },
                { label: 'Insecticides', pct: 48, value: '\u20A6120k' },
                { label: 'Bactericides', pct: 28, value: '\u20A670k' },
                { label: 'Herbicides', pct: 20, value: '\u20A650k' },
              ].map((bar) => (
                <div key={bar.label} className="revenue-bar-row">
                  <span className="revenue-bar-label">{bar.label}</span>
                  <div className="revenue-bar-track">
                    <div className="revenue-bar-fill" style={{ width: `${bar.pct}%` }} />
                  </div>
                  <span className="revenue-bar-value">{bar.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="db-card db-card--actions">
            <h2 className="db-card__title">Quick Actions</h2>
            <div className="quick-actions">
              <button type="button" className="quick-action" onClick={() => navigate('/')}>
                <ShoppingBag size={20} aria-hidden="true" />
                <span>Add Product</span>
              </button>
              <a href="#requests" className="quick-action">
                <Users size={20} aria-hidden="true" />
                <span>Requests</span>
              </a>
              <a href="#inventory" className="quick-action">
                <Boxes size={20} aria-hidden="true" />
                <span>Inventory</span>
              </a>
              <Link to="/" className="quick-action">
                <Home size={20} aria-hidden="true" />
                <span>Home</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SupplierDashboardPage
