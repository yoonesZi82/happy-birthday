import { useEffect, useState } from 'react'
import {
  buildBirthdayPerson,
  firstName,
  parseBirthdayQuery,
  type BirthdayPerson,
} from '@/lib/birthday'
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
      setPerson(buildBirthdayPerson(parsed.name, parsed.birthDate))
    }
  }, [])

  if (!person) {
    return <MissingQueryHint />
  }

  const nick = firstName(person.name)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060814] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Starfield />
      <Balloons burstKey={burstKey} />

      <header className="relative z-30 mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 pt-6">
        <div className="glass-panel flex items-center gap-3 justify-self-start rounded-full border border-primary/30 px-4 py-2">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-amber-500" />
          </span>
          <span className="text-xs font-medium tracking-wide text-amber-200 md:text-sm">
            دعوت‌نامه اختصاصی متولد {person.zodiac.nameFa} ✨
          </span>
        </div>
        <div className="glass-panel flex items-center justify-center rounded-2xl border border-white/10 px-2 py-1.5">
          <img
            src={logoLotus}
            alt="لوگوی موسسه"
            className="size-10 rounded-xl object-cover drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]"
          />
        </div>
        <div className="justify-self-end">
          <MusicPlayer />
        </div>
      </header>

      <main className="relative z-20 mx-auto max-w-6xl px-6 py-8 md:py-12">
        <div className="mb-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-amber-500/20 px-5 py-1.5 text-sm font-semibold tracking-wider text-primary shadow-lg">
            🎉 خوش آمدید • اسکن شده از کیو‌آر کد اختصاصی
          </div>
          <h1 className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-4xl leading-tight font-extrabold text-transparent md:text-6xl">
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
        <h1 className="mb-3 text-2xl font-bold text-amber-200">لینک ناقص است</h1>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          نام و تاریخ تولد باید از طریق کوئری URL بیاید.
        </p>
        <code className="block rounded-xl bg-black/50 p-3 text-left text-xs text-amber-200" dir="ltr">
          ?name=آریا رادمنش&date=1377-11-15
          <br />
          ?name=آریا رادمنش&date=1999-02-04
          <br />
          ?name=آریا&jdate=۱۳۷۷/۱۱/۱۵
        </code>
      </div>
    </div>
  )
}
