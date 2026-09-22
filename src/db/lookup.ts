import database from './zodiac-database.json'
import { zodiacImageMap } from './images'
import type {
  BirthdayProfile,
  LifeStats,
  ZodiacDbRecord,
  ZodiacId,
  ZodiacSign,
} from './types'
import { formatNumberFa } from '@/lib/format'

const signs = database.signs as ZodiacDbRecord[]

function isInRange(
  month: number,
  day: number,
  range: ZodiacDbRecord['range'],
): boolean {
  const value = month * 100 + day
  const start = range.startMonth * 100 + range.startDay
  const end = range.endMonth * 100 + range.endDay
  if (start > end) {
    return value >= start || value <= end
  }
  return value >= start && value <= end
}

function toZodiacSign(record: ZodiacDbRecord): ZodiacSign {
  const { imageKey, range: _range, ...rest } = record
  return {
    ...rest,
    image: imageKey ? zodiacImageMap[imageKey] : null,
  }
}

export function getZodiacIdByDate(date: Date): ZodiacId {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const found = signs.find((sign) => isInRange(month, day, sign.range))
  return found?.id ?? 'aquarius'
}

export function getZodiacById(id: ZodiacId): ZodiacSign {
  const record = signs.find((sign) => sign.id === id)
  if (!record) {
    throw new Error(`Zodiac id not found in database: ${id}`)
  }
  return toZodiacSign(record)
}

export function getZodiacByBirthDate(date: Date): ZodiacSign {
  return getZodiacById(getZodiacIdByDate(date))
}

export function computeLifeStats(birthDate: Date, now = new Date()): LifeStats {
  const msLived = Math.max(0, now.getTime() - birthDate.getTime())
  const daysLived = Math.floor(msLived / (1000 * 60 * 60 * 24))
  let age = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return {
    age: Math.max(0, age),
    daysLived,
    hoursLived: daysLived * 24,
    moonCycles: Math.floor(daysLived / 29.53),
  }
}

/** Single entry: all Profile / Stats / Constellation data from birth date. */
export function buildBirthdayProfile(name: string, birthDate: Date, now = new Date()): BirthdayProfile {
  const zodiac = getZodiacByBirthDate(birthDate)
  const life = computeLifeStats(birthDate, now)
  return {
    name,
    birthDate,
    zodiac,
    chips: [
      { label: 'عنصر وجودی', value: zodiac.element },
      { label: 'سنگ خوش‌یمن', value: zodiac.stones },
      { label: 'رنگ شانس', value: zodiac.luckyColors },
    ],
    stats: [
      { label: 'روز شاد زیستن', value: `${formatNumberFa(life.daysLived)}+` },
      { label: 'ساعت خاطره‌سازی', value: `${formatNumberFa(life.hoursLived)}+` },
      { label: 'گردش کامل ماه', value: formatNumberFa(life.moonCycles) },
      { label: 'آرزوهای قشنگ', value: '∞' },
    ],
    ...life,
  }
}

export function listZodiacDatabase(): ZodiacSign[] {
  return signs.map(toZodiacSign)
}
