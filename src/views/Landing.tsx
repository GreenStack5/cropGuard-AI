import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Clock,
  History,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Quote,
  ScanLine,
  ShieldCheck,
  Store,
  TrendingUp,
} from 'lucide-react'
import { Logo, VerifiedBadge } from '../components/Shell'

const STATS = [
  { icon: Store, value: '6', label: 'Demo Agro Suppliers' },
  { icon: MapPin, value: '3', label: 'States covered', sub: 'Lagos · Ogun · Oyo' },
  { icon: ScanLine, value: '5', label: 'Steps to connect' },
  { icon: MessageCircle, value: '1', label: 'Tap to call / WhatsApp' },
]

const SUMMARY_STEPS = [
  { label: 'SCAN', sub: 'Photo of the crop' },
  { label: 'IDENTIFY', sub: 'Possible problem' },
  { label: 'RECOMMEND', sub: 'Treatment + product' },
  { label: 'FIND NEARBY', sub: 'Agro Suppliers' },
  { label: 'CONNECT', sub: 'Call / WhatsApp' },
]

const FEATURES = [
  {
    icon: ScanLine,
    title: 'AI-assisted crop scan',
    text: 'A photo of the crop returns a possible problem, confidence score and recommended treatment.',
  },
  {
    icon: MapPin,
    title: 'Location-based matching',
    text: 'Pick your State and LGA — only suppliers with the product and stock near you are shown.',
  },
  {
    icon: Banknote,
    title: 'Compare price, distance & stock',
    text: 'Side-by-side supplier cards with nearest and lowest-price highlights. No rankings, just facts.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Agro Suppliers',
    text: 'Badged, verified demo shops so farmers know exactly who they are contacting.',
  },
  {
    icon: MessageCircle,
    title: 'One-tap call or WhatsApp',
    text: 'Call directly or open WhatsApp with a pre-filled "is this available?" message.',
  },
  {
    icon: History,
    title: 'Scan history',
    text: 'Every scan is saved with a thumbnail and result so you can revisit issues and suppliers.',
  },
]

const TESTIMONIALS = [
  {
    quote:
      'Scanned my tomato leaves, it suggested Early Blight and Mancozeb — then showed the right shop in my area.',
    name: 'Adebayo O.',
    role: 'Tomato farmer · Ikeja',
  },
  {
    quote:
      'I compared three suppliers on price and distance, then messaged the nearest one on WhatsApp. Found what I needed in minutes.',
    name: 'Favour E.',
    role: 'Maize farmer · Ogun',
  },
  {
    quote:
      'Listed my shop, added my products and prices. Farmers started finding me when I had stock they needed.',
    name: 'GreenFarm Agro',
    role: 'Agro Supplier · Lagos',
  },
]

export function Landing({
  onGetStarted,
  onFarmer,
  onSupplier,
  onHowWorks,
  onFeatures,
}: {
  onGetStarted: () => void
  onFarmer: () => void
  onSupplier: () => void
  onHowWorks: () => void
  onFeatures: () => void
}) {
  const scrollToIds = () => {
    const suppliers = document.getElementById('suppliers')
    if (suppliers) suppliers.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-crop-grid min-h-screen">
      <header className="sticky top-0 z-30 border-b border-forest-100/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Logo size={36} />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-forest-800/70 md:flex">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="transition hover:text-forest-700">
              Home
            </button>
            <button onClick={onHowWorks} className="transition hover:text-forest-700">
              How it works
            </button>
            <button onClick={onFeatures} className="transition hover:text-forest-700">
              Features
            </button>
            <button onClick={scrollToIds} className="transition hover:text-forest-700">
              For Suppliers
            </button>
          </nav>
          <button
            onClick={onGetStarted}
            className="rounded-full bg-forest-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-forest-600/20 transition hover:bg-forest-700"
          >
            Get started
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-12 pt-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-forest-600/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
              <ShieldCheck size={14} />
              For farmers &amp; Agro Suppliers
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-forest-950 sm:text-5xl">
              Spot the problem.
              <br />
              Find the right solution.
              <br />
              <span className="text-forest-600">Near you.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-forest-800/70">
              CropGuard AI scans your crop, identifies a possible disease or problem, recommends a
              treatment product and connects you with nearby Agro Suppliers — compare price,
              distance and stock, then call or WhatsApp directly.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={onFarmer}
                className="inline-flex items-center gap-2 rounded-2xl bg-forest-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-forest-600/25 transition hover:-translate-y-0.5 hover:bg-forest-700"
              >
                <ScanLine size={18} />
                Scan My Crop — I'm a Farmer
                <ArrowRight size={16} />
              </button>
              <button
                onClick={onSupplier}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-forest-200 bg-white px-6 py-3.5 text-sm font-extrabold text-forest-800 shadow-sm transition hover:-translate-y-0.5 hover:border-forest-800"
              >
                <Store size={18} />
                I'm an Agro Supplier
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-forest-800/60">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} />
                Seconds from scan to solution
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone size={15} />
                Phone + WhatsApp contact
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-forest-100 bg-white p-3.5 shadow-sm"
                >
                  <s.icon size={18} className="text-forest-600" />
                  <div className="mt-2 text-2xl font-extrabold text-forest-900">{s.value}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-forest-800/60">
                    {s.label}
                  </div>
                  {s.sub && <div className="text-[11px] text-forest-800/40">{s.sub}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-forest-200/60 to-forest-600/20 blur-xl" />
            <div className="relative rounded-3xl bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-forest-800/50">
                  Scan result
                </span>
                <span className="rounded-full bg-forest-600/10 px-2.5 py-1 text-xs font-extrabold text-forest-700">
                  Tomato
                </span>
              </div>
              <div className="mt-3 text-lg font-extrabold text-forest-900">Early Blight</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-forest-100">
                  <div className="h-full w-[86%] rounded-full bg-forest-600" />
                </div>
                <span className="text-xs font-extrabold text-forest-700">86%</span>
              </div>

              <div className="mt-4 rounded-2xl bg-forest-50/70 p-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wide text-forest-800/50">
                  Recommended treatment
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-forest-900">Fungicide</div>
                    <div className="text-xs font-semibold text-forest-700">Mancozeb</div>
                  </div>
                  <div className="text-lg font-extrabold text-forest-600">₦4,000</div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-forest-100 p-3">
                <div className="text-sm font-extrabold uppercase tracking-wide text-forest-900">
                  GreenFarm Agro Services
                </div>
                <VerifiedBadge />
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-forest-800/60">
                  <MapPin size={12} />
                  Ikeja, Lagos · 2.1 km · 23 units
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-600 px-3 py-2.5 text-xs font-bold text-white">
                  <Phone size={14} />
                  CALL
                </span>
                <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white">
                  <MessageCircle size={14} />
                  WHATSAPP
                </span>
              </div>
            </div>

            <div className="relative mt-4 flex items-center justify-center gap-2 rounded-2xl border border-forest-100 bg-white/80 px-4 py-2.5 text-xs font-semibold text-forest-800/70 shadow-sm backdrop-blur">
              <ShieldCheck size={14} className="text-forest-500" />
              SCAN → IDENTIFY → RECOMMEND → FIND NEARBY → CONNECT
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-forest-700">
                How it works
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-forest-950 sm:text-3xl">
                Five steps from problem to connection
              </h2>
            </div>
            <button
              onClick={onHowWorks}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-700 transition hover:text-forest-900"
            >
              See the full story
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SUMMARY_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="rounded-2xl border border-forest-100 bg-white p-4 shadow-sm"
              >
                <div className="inline-flex items-center justify-center rounded-lg bg-forest-600 px-2 py-1 text-[11px] font-extrabold text-white">
                  0{i + 1}
                </div>
                <div className="mt-2 text-sm font-extrabold text-forest-900">{step.label}</div>
                <div className="text-xs text-forest-800/60">{step.sub}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-forest-100 bg-forest-50/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-forest-700">
                  Features
                </div>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-forest-950 sm:text-3xl">
                  Built for farmers and Agro Suppliers
                </h2>
              </div>
              <button
                onClick={onFeatures}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-700 transition hover:text-forest-900"
              >
                Explore all features
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-3xl border border-forest-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-600/10 text-forest-700">
                    <f.icon size={22} />
                  </div>
                  <div className="mt-4 text-sm font-extrabold text-forest-900">{f.title}</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-forest-800/70">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="suppliers" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-14">
          <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-800 to-forest-950 p-8 text-white shadow-lg shadow-forest-800/30 sm:p-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-200">
                <Store size={14} />
                Agro Suppliers
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Turn your stock into more customers.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-forest-200/80">
                Register your shop, add your products and prices, and keep stock up to date. When a
                farmer in your area scans a crop, your shop appears right in front of them — with
                Call and WhatsApp one tap away.
              </p>
              <button
                onClick={onSupplier}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-forest-800 shadow-lg transition hover:-translate-y-0.5"
              >
                <Store size={18} />
                Register my Agro Supply shop
              </button>
            </div>
            <div className="grid gap-3">
              {[
                { icon: Package, title: 'Your shop in farmer search', text: 'Matched by location and stock.' },
                { icon: BadgeCheck, title: 'Verified status', text: 'Badged demo shops build trust.' },
                { icon: TrendingUp, title: 'Live price & stock control', text: 'Changes appear instantly.' },
              ].map((c) => (
                <div
                  key={c.title}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <c.icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white">{c.title}</div>
                    <div className="text-xs text-forest-200/75">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-forest-100 bg-forest-50/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-forest-700">
                Demo feedback
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-forest-950 sm:text-3xl">
                What farmers and suppliers say
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col rounded-3xl border border-forest-100 bg-white p-5 shadow-sm"
                >
                  <Quote size={20} className="text-forest-200" />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-forest-800/80">
                    "{t.quote}"
                  </p>
                  <div className="mt-4 border-t border-forest-100 pt-3">
                    <div className="text-sm font-extrabold text-forest-900">{t.name}</div>
                    <div className="text-xs text-forest-800/60">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-600 via-forest-700 to-forest-950 p-8 text-center text-white shadow-lg shadow-forest-800/30 sm:p-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="text-xs font-bold uppercase tracking-widest text-forest-200">
              Ready when your crop is
            </div>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Your crops have a story.
              <br />
              Let's find the solution together.
            </h2>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-extrabold text-forest-800 shadow-lg transition hover:-translate-y-0.5"
              >
                <ScanLine size={18} />
                Get started
              </button>
              <button
                onClick={onFarmer}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Scan a crop
              </button>
              <button
                onClick={onSupplier}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <Store size={17} />
                List my shop
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-forest-100 bg-white/80">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Logo size={38} />
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-forest-800/60">
              AI-assisted crop diagnosis and supplier matching for Nigerian farmers. Scan, identify,
              recommend, find nearby and connect — all in one place.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-forest-800/50">
              Product
            </div>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm font-semibold text-forest-800/70">
              <button onClick={onHowWorks} className="transition hover:text-forest-700">
                How it works
              </button>
              <button onClick={onFeatures} className="transition hover:text-forest-700">
                Features
              </button>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-forest-800/50">
              Get started
            </div>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm font-semibold text-forest-800/70">
              <button onClick={onFarmer} className="transition hover:text-forest-700">
                I'm a farmer
              </button>
              <button onClick={onSupplier} className="transition hover:text-forest-700">
                I'm an Agro Supplier
              </button>
              <button onClick={onGetStarted} className="transition hover:text-forest-700">
                Create account
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-forest-100 py-5 text-center">
          <p className="px-4 text-xs leading-relaxed text-forest-800/60">
            AI-assisted result. Confirm diagnosis with a qualified agricultural professional before
            treatment.
          </p>
          <p className="mt-1 px-4 text-[11px] text-forest-800/40">
            CropGuard AI — Hackathon MVP · Demo data stored locally in your browser · Lagos · Ogun ·
            Oyo
          </p>
        </div>
      </footer>
    </div>
  )
}