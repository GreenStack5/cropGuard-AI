function StepPhoneIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#2B5B24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="4" width="24" height="40" rx="4" />
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="9" r="1" fill="#2B5B24" />
      <path d="M19 24h10" />
      <path d="M24 19v10" />
    </svg>
  )
}

function StepScanIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#2B5B24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="21" cy="21" r="13" />
      <path d="M31 31l9 9" />
      <path d="M16 26c0-6 4-10 10-10" strokeWidth="1.4" />
      <path d="M18 24c2-4 5-6 8-6" strokeWidth="1.2" />
      <path d="M16 26l8-8" strokeWidth="1.2" />
    </svg>
  )
}

function StepReportIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#2B5B24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8h16a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
      <path d="M20 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H20V6z" />
      <path d="M20 18h8" />
      <path d="M20 24h6" />
      <circle cx="24" cy="32" r="3" />
      <path d="M23 32l1 1 2-2" />
    </svg>
  )
}

const STEPS = [
  {
    badge: '01',
    title: 'Take a photo',
    text: 'Snap a clear picture of the affected crop or leaf.',
    icon: StepPhoneIcon,
  },
  {
    badge: '02',
    title: 'AI analyzes it',
    text: 'CropGuard AI scans the image and compares it with known disease.',
    icon: StepScanIcon,
  },
  {
    badge: '03',
    title: 'Get your next step',
    text: 'Receive a possible diagnosis, treatment guidance, and preventive tips.',
    icon: StepReportIcon,
  },
]

function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="how__inner">
        <h2 className="how__title">From leaf to answer in 3 simple steps</h2>
        <div className="how__grid" role="list">
          {STEPS.map((step) => (
            <div key={step.badge} className="how-step">
              <span className="how-step__badge" aria-hidden="true">
                {step.badge}
              </span>
              <span className="how-step__icon" aria-hidden="true">
                <step.icon />
              </span>
              <h3 className="how-step__title">{step.title}</h3>
              <p className="how-step__text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks