import { Camera, TrendingUp, Smartphone, Users } from 'lucide-react'

interface Stat {
  num: string
  text: string
  icon: typeof Smartphone
}

const STATS: Stat[] = [
  {
    num: '40%',
    text: 'of global crops are lost to pests and diseases annually.',
    icon: Smartphone,
  },
  {
    num: 'Up to 30%',
    text: 'Increase in crop yield with early detection.',
    icon: TrendingUp,
  },
  {
    num: 'Millions',
    text: 'of smallholder farmers depends on crop for their livelihood',
    icon: Users,
  },
  {
    num: '1 photo',
    text: 'can help farmer prevent bigger losses',
    icon: Camera,
  },
]

function Stats() {
  return (
    <section className="stats" aria-label="Why early detection matters">
      <div className="stats__inner">
        <h2 className="stats__heading">A small symptom can become a big loss</h2>
        <ul className="stats__grid" role="list">
          {STATS.map((stat) => (
            <li key={stat.num} className="stat">
              <span className="stat__icon" aria-hidden="true">
                <stat.icon size={24} strokeWidth={2} />
              </span>
              <span className="stat__num">{stat.num}</span>
              <span className="stat__desc">{stat.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Stats