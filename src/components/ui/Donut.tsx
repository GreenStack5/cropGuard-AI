import { motion } from 'motion/react'

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) }
}

export function Donut({
  value,
  size = 132,
  stroke = 14,
  label,
  sublabel,
}: {
  value: number
  size?: number
  stroke?: number
  label: string
  sublabel?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const start = polar(cx, cy, radius, 0)

  const largeArc = clamped <= 50 ? 0 : 1
  const ep = polar(cx, cy, radius, (clamped / 100) * 360)

  const arcPath =
    clamped >= 100
      ? `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`
      : `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${ep.x} ${ep.y}`

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#eef1ea"
            strokeWidth={stroke}
          />
          <motion.path
            d={arcPath}
            fill="none"
            stroke="var(--color-brand-700)"
            strokeLinecap="round"
            strokeWidth={stroke}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: clamped / 100 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-extrabold tracking-tight text-ink">
            {clamped}%
          </p>
          <p className="text-xs font-semibold text-stone-400">{sublabel}</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-ink">{label}</p>
    </div>
  )
}