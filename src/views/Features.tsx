import {
  Banknote,
  Clock,
  History,
  MapPin,
  MessageCircle,
  PackagePlus,
  ScanLine,
  ShieldCheck,
  Store,
  Wheat,
} from 'lucide-react'
import { PageChrome } from '../components/Shell'

const FARMER_FEATURES = [
  {
    icon: ScanLine,
    title: 'AI-assisted crop scan',
    text: 'Upload a photo of your crop and get a possible problem, a confidence score, a recommended treatment and a suggested product.',
  },
  {
    icon: MapPin,
    title: 'Location-based supplier matching',
    text: 'Pick your State and LGA — suppliers are filtered by location, the recommended product and live stock availability.',
  },
  {
    icon: Banknote,
    title: 'Compare price, distance & stock',
    text: 'See every matching Agro Supplier side by side with nearest and lowest-price highlights — no "best" rankings, just facts.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Agro Suppliers',
    text: 'Badged Verified Supplier on trusted demo shops so farmers know who they are contacting.',
  },
  {
    icon: MessageCircle,
    title: 'Call or WhatsApp in one tap',
    text: 'Call directly or open WhatsApp with a pre-filled message asking if the product is available.',
  },
  {
    icon: History,
    title: 'Scan history',
    text: 'Every scan is saved with a thumbnail and result so you can revisit past issues and re-find suppliers anytime.',
  },
]

const SUPPLIER_FEATURES = [
  {
    icon: Store,
    title: 'Supplier registration',
    text: 'Register your shop with location and owner details to appear in farmer search results.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified status',
    text: 'Demo suppliers are marked Verified; newly registered shops show "Pending verification".',
  },
  {
    icon: PackagePlus,
    title: 'Manage products & prices',
    text: 'Add products, set your price and update it anytime — changes appear for farmers instantly.',
  },
  {
    icon: Clock,
    title: 'Live stock control',
    text: 'Mark stock update from In Stock to Low Stock or Out of Stock, keeping farmer matches accurate.',
  },
]

export function Features({
  onBack,
  onHow,
  onFeatures,
  onGetStarted,
}: {
  onBack: () => void
  onHow: () => void
  onFeatures: () => void
  onGetStarted: () => void
}) {
  return (
    <PageChrome active="features" onBack={onBack} onHow={onHow} onFeatures={onFeatures} onGetStarted={onGetStarted}>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-4 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-600/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
            <Wheat size={14} />
            Features
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-forest-950 sm:text-5xl">
            Everything you need
            <br />
            to protect your crops{' '}
            <span className="text-forest-600">and grow your shop.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-forest-800/70">
            Built for both sides of the farm supply chain — farmers who need answers fast, and Agro
            Suppliers who want to be found by the right customers.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[...FARMER_FEATURES, ...SUPPLIER_FEATURES].slice(0, 4).map((f) => (
            <div key={f.title} className="rounded-2xl border border-forest-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600 text-white">
                <f.icon size={20} />
              </div>
              <div className="mt-3 text-sm font-extrabold text-forest-900">{f.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-forest-800/70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-forest-800/50">
          For farmers
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FARMER_FEATURES.map((f) => (
            <div key={f.title} className="rounded-3xl border border-forest-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-600/10 text-forest-700">
                <f.icon size={22} />
              </div>
              <div className="mt-4 text-sm font-extrabold text-forest-900">{f.title}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-forest-800/70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-4">
        <div className="rounded-3xl bg-gradient-to-br from-forest-800 to-forest-950 p-7 text-white shadow-lg shadow-forest-800/30 sm:p-9">
          <div className="text-xs font-bold uppercase tracking-widest text-forest-300">
            For Agro Suppliers
          </div>
          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            Reach farmers who need what you sell
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {SUPPLIER_FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <f.icon size={18} />
                </div>
                <div className="mt-3 text-sm font-extrabold text-white">{f.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-white/75">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-forest-800 shadow-lg transition hover:-translate-y-0.5"
            >
              <Store size={18} />
              Get started
            </button>
            <button
              onClick={onHow}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/20"
            >
              <ScanLine size={18} />
              See how it works
            </button>
          </div>
        </div>
      </section>
    </PageChrome>
  )
}