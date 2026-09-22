import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BirthdayPerson } from '@/lib/birthday'
import { firstName, formatBirthDateFa, toPersianDigits } from '@/lib/birthday'

type ProfileCardProps = {
  person: BirthdayPerson
  onRelaunch: () => void
}

export function ProfileCard({ person, onRelaunch }: ProfileCardProps) {
  const nick = firstName(person.name)

  return (
    <div className="glass-panel glass-gold-glow relative overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="pointer-events-none absolute -top-24 -left-24 size-60 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 size-60 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-6 border-b border-slate-700/60 pb-6 sm:flex-row sm:items-start">
        <div className="relative">
          <div className="size-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-200 to-indigo-600 p-1 shadow-xl shadow-primary/20 sm:size-28">
            <div className="flex size-full items-center justify-center overflow-hidden rounded-[14px] bg-[#0c1222] text-4xl">
              👑
            </div>
          </div>
          <span className="absolute -bottom-2 -left-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-2.5 py-0.5 text-[11px] font-extrabold text-black shadow">
            {toPersianDigits(person.age)} سالگی
          </span>
        </div>

        <div className="flex-1 text-center sm:text-right">
          <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h2 className="text-2xl font-bold text-white">{person.name}</h2>
            <span className="rounded-md border border-primary/30 bg-primary/20 px-2.5 py-0.5 text-xs text-primary">
              متولد {person.zodiac.nameFa}
            </span>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            تاریخ تولد:{' '}
            <span className="font-semibold text-amber-200">
              {formatBirthDateFa(person.birthDate)}
            </span>
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs sm:justify-start">
            {person.chips.map((chip) => (
              <Chip key={chip.label} label={chip.label} value={chip.value} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-amber-200">
          <Heart className="size-5 fill-current text-primary" />
          پیام تبریک صمیمانه به تو:
        </h3>
        <p className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-justify text-sm leading-relaxed font-light text-slate-200 md:text-base">
          «{nick} عزیز، ورودت به سال جدید زندگی پر از نور، سلامتی، خنده‌های بی‌وقفه و فتح قله‌های
          بلند باد. امیدواریم مثل صورت فلکی‌ات ({person.zodiac.nameFa}) که نماد{' '}
          {person.zodiac.subtitle} است، همیشه سیراب از مهر و سرشار از شوق زیستن باشی.»
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
        <p className="text-xs text-muted-foreground">میخوای دوباره جشن بگیریم؟</p>
        <Button
          onClick={onRelaunch}
          className="h-auto rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-primary/25 hover:from-amber-400 hover:to-yellow-500"
        >
          🎈 پرتاب مجدد بادکنک‌ها و نورافشانی
        </Button>
      </div>
    </div>
  )
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-slate-300">
      {label}: <strong className="text-amber-300">{value}</strong>
    </span>
  )
}
