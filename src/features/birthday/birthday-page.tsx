import { useEffect, useState } from 'react'
import {
  buildBirthdayPerson,
  firstName,
  parseBirthdayQuery,
  type BirthdayPerson,
} from '@/lib/birthday'
import { applyDocumentSeo, buildInviteSeo } from '@/lib/seo'
import './birthday.css'
import { Balloons } from './balloons'
import { ConstellationCard } from './constellation-card'
import { FooterActions } from './footer-actions'
import { GiftModal } from './gift-modal'
import logoLotus from '@/assets/logo-lotus.jpg'
import { MusicPlayer } from './music-player'
import { ProfileCard } from './profile-card'
import { Starfield } from './starfield'
import { StatsRow } from './stats-row'

export function BirthdayPage() {
  const [person, setPerson] = useState<BirthdayPerson | null>(null)
  const [burstKey, setBurstKey] = useState(1)
  const [isGiftOpen, setIsGiftOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.documentElement.lang = 'fa'
    document.documentElement.dir = 'rtl'
    const parsed = parseBirthdayQuery(window.location.search)
    if (parsed) {
      const nextPerson = buildBirthdayPerson(parsed.name, parsed.birthDate)
      setPerson(nextPerson)
      applyDocumentSeo(buildInviteSeo(nextPerson.name, firstName(nextPerson.name)))
      return
    }
    applyDocumentSeo({ path: '/' })
  }, [])

  if (!person) {
    return <MissingQueryHint />
  }

  const nick = firstName(person.name)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060814] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Starfield />
      <Balloons burstKey={burstKey} />

      <header className="relative z-30 mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-4 sm:px-6 sm:pt-6 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex items-center gap-2 md:contents">
          <div className="glass-panel flex shrink-0 items-center justify-center rounded-2xl border border-white/10 px-2 py-1.5 md:col-start-2 md:justify-self-center">
            <img
              src={logoLotus}
              alt="لوگوی موسسه"
              className="size-10 rounded-xl object-cover drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]"
            />
          </div>
          <div className="min-w-0 flex-1 md:col-start-3 md:justify-self-end">
            <MusicPlayer className="w-full md:w-auto" />
          </div>
        </div>
        <div className="glass-panel flex w-full items-center justify-center gap-3 rounded-full border border-primary/30 px-4 py-2 md:col-start-1 md:row-start-1 md:w-auto md:justify-self-start">
          <span className="relative flex size-3 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-amber-500" />
          </span>
          <span className="text-center text-xs font-medium tracking-wide text-amber-200 md:text-sm">
            دعوت‌نامه اختصاصی متولد {person.zodiac.nameFa} ✨
          </span>
        </div>
      </header>

      <main className="relative z-20 mx-auto max-w-6xl px-6 py-8 md:py-12">
        <div className="mb-10 space-y-4 text-center">
          <h1 className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-[clamp(1.35rem,5.8vw,3.75rem)] leading-tight font-extrabold whitespace-nowrap text-transparent">
            زادروزت مبارک،{' '}
            <span className="text-white underline decoration-primary/50 decoration-wavy">
              {nick} جان
            </span>{' '}
            عزیز!
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed font-light text-slate-300 md:text-lg">
            امروز روزی است که جهان یکی از زیباترین ستاره‌هایش را به زمین هدیه داد. این صفحه آسمانی
            تقدیم به نگاه پرمهرت تا بدانی چقدر درخشان و ارزشمندی.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <ProfileCard person={person} onRelaunch={() => setBurstKey((key) => key + 1)} />
            <StatsRow person={person} />
          </div>
          <div className="space-y-5 lg:col-span-5">
            <ConstellationCard zodiac={person.zodiac} />
          </div>
        </div>

        <FooterActions onOpenGift={() => setIsGiftOpen(true)} />
      </main>

      <GiftModal
        isOpen={isGiftOpen}
        onClose={() => setIsGiftOpen(false)}
        name={nick}
      />
    </div>
  )
}

function MissingQueryHint() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060814] px-6 text-center text-slate-100">
      <div className="glass-panel max-w-lg rounded-3xl border border-primary/30 p-8">
        <h1 className="mb-3 text-2xl font-bold text-amber-200">دعوت‌نامه پیدا نشد</h1>
        <p className="mb-3 text-sm leading-relaxed text-slate-300">
          این صفحه مخصوص دعوت‌نامه شخصی جشن تولد است. برای دیدن صفحه، باید لینک کامل دعوت‌نامه را باز کنید؛
          لینکی که معمولاً با اسکن QR Code یا از پیام دوستتان می‌آید.
        </p>
        <p className="text-sm leading-relaxed text-slate-400">
          اگر لینک را خودتان باز کرده‌اید، لطفاً دوباره QR Code را اسکن کنید یا از فرستنده لینک کامل را بخواهید.
        </p>
      </div>
    </div>
  )
}
