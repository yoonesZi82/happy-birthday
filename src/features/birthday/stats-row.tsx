import type { BirthdayPerson } from '@/lib/birthday'

type StatsRowProps = {
  person: BirthdayPerson
}

export function StatsRow({ person }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {person.stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-panel rounded-2xl border-primary/20 p-4 text-center"
        >
          <div className="text-2xl font-black text-amber-300">{stat.value}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
