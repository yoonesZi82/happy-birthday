import type { ZodiacSign } from '@/db/types'

type ConstellationCardProps = {
  zodiac: ZodiacSign
}

export function ConstellationCard({ zodiac }: ConstellationCardProps) {
  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl border border-primary/40 p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between border-b border-primary/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            🌌
          </span>
          <div>
            <h3 className="text-sm font-bold text-amber-200">طالع و صورت فلکی تولد شما</h3>
            <p className="text-[10px] text-muted-foreground">شناسنامه نجومی آسمان در لحظه تولد</p>
          </div>
        </div>
        <span className="rounded border border-primary/30 bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
          {zodiac.nameFa}
        </span>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-black">
        {zodiac.image ? (
          <img
            src={zodiac.image}
            alt={`صورت فلکی ${zodiac.nameFa} - ${zodiac.subtitle}`}
            className="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 bg-gradient-to-b from-indigo-950 to-slate-950 p-6 text-center">
            <span className="text-5xl">{zodiac.symbol}</span>
            <p className="text-2xl font-bold text-primary">{zodiac.nameFa}</p>
            <p className="text-sm text-muted-foreground">{zodiac.subtitle}</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060814] via-transparent to-transparent opacity-60" />
        <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-xl border border-primary/30 bg-black/70 px-3 py-1.5 text-xs text-amber-200 backdrop-blur-md">
          <span>
            صورت فلکی {zodiac.nameFa} ({zodiac.subtitle})
          </span>
          <span className="font-mono text-[11px] text-primary">
            {zodiac.abbreviation} • {zodiac.mainStars}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-xs text-slate-300">
        <div className="space-y-1.5 rounded-xl border border-primary/20 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between font-semibold text-primary">
            <span>نماد و اسطوره {zodiac.nameFa}:</span>
            <span className="text-[11px] text-muted-foreground">{zodiac.subtitle}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">{zodiac.legend}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <Fact label="ستاره شاخص" value={zodiac.brightestStar} />
          <Fact label="مساحت در آسمان" value={zodiac.area} />
          <Fact label="بهترین زمان رؤیت" value={zodiac.bestTime} />
          <Fact label="مکان مشاهده" value={zodiac.location} />
        </div>

        <p className="pt-2 text-center font-serif text-[11px] text-primary/80 italic">
          «{zodiac.poem}»
        </p>
      </div>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-amber-200">{value}</span>
    </div>
  )
}
