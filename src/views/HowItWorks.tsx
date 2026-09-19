import {
  ArrowRight,
  Banknote,
  MapPin,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Store,
  Wheat,
} from 'lucide-react'
import { PageChrome } from '../components/Shell'

const STEPS = [
  {
    icon: ScanLine,
    step: '01',
    title: 'Scan',
    text: 'Take or upload a clear photo of the affected crop leaves. CropGuard AI processes it instantly.',
    detail: 'A well-lit close-up gives the best result.',
  },
  {
    icon: Wheat,
    step: '02',
    title: 'Identify',
    text: 'The scanner returns a possible problem with a confidence score — e.g. Tomato · Early Blight · 86% confidence.',
    detail: 'AI-assisted result — always confirm with a professional.',
  },
  {
    icon: ShieldCheck,
    step: '03',
    title: 'Recommend',
    text: 'See a recommended treatment category, a suggested product and an estimated price range.',
    detail: 'e.g. Fungicide · Mancozeb · ₦3,500 – ₦5,000',
  },
  {
    icon: Store,
    step: '04',
    title: 'Find nearby',
    text: 'Agro Suppliers are filtered by your state/area, the recommended product and current stock.',
    detail: 'Only shops that actually carry the product are shown.',
  },
  {
    icon: MessageCircle,
    step: '05',
    title: 'Connect',
    text: 'Compare price, distance and availability, then call the supplier or open WhatsApp with a ready-made message.',
    detail: 'One tap from scan to supplier contact.',
  },
]

const JOURNEY = [
  'CROP PROBLEM',
  'CROPGUARD AI SCANS IT',
  'AI IDENTIFIES POSSIBLE PROBLEM',
  'RECOMMENDED TREATMENT',
  'FIND NEARBY AGRO SUPPLIERS',
  'COMPARE PRICE + DISTANCE + STOCK',
  'CALL OR WHATSAPP SUPPLIER',
]

export function HowItWorks({
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
    <PageChrome active="how" onBack={onBack} onHow={onHow} onFeatures={onFeatures} onGetStarted={onGetStarted}>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-4 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-600/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-forest-700">
            <ScanLine size={14} />
            How it works
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-forest-950 sm:text-5xl">
            From crop problem
            <br />
            to connection —{' '}
            <span className="text-forest-600">in five steps.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-forest-800/70">
            CropGuard AI turns a simple photo into a clear next step: know the problem, know the
            treatment, and know exactly which Agro Supplier has the product near you.
          </p>
          <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-forest-700">
            <Banknote size={16} />
            No "best" rankings — just facts: price, distance and stock.
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="flex items-start gap-4 rounded-2xl border border-forest-100 bg-white p-4 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-600/10 text-forest-700">
                <s.icon size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-forest-400">STEP {s.step}</span>
                  <span className="text-sm font-extrabold uppercase tracking-wide text-forest-900">
                    {s.title}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-forest-800/75">{s.text}</p>
                <p className="mt-1 text-xs font-semibold text-forest-600">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-forest-700 to-forest-950 p-7 text-white shadow-lg shadow-forest-800/30 sm:p-9">
          <div className="text-xs font-bold uppercase tracking-widest text-forest-300">
            The CropGuard journey
          </div>
          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            From a sick crop to the right supplier
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {JOURNEY.map((j, i) => (
              <div key={j} className="flex items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur">
                  <span className="mr-1.5 text-forest-300">{String(i + 1).padStart(2, '0')}</span>
                  {j}
                </span>
                {i < JOURNEY.length - 1 && (
                  <ArrowRight size={14} className="text-forest-400" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-forest-800 shadow-lg transition hover:-translate-y-0.5"
            >
              <ScanLine size={18} />
              Try it now
            </button>
            <button
              onClick={onFeatures}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/20"
            >
              <MapPin size={18} />
              Explore features
            </button>
          </div>
        </div>
      </section>
    </PageChrome>
  )
}