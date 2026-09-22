import type { ZodiacImageKey } from './images'

export type ZodiacId =
  | 'capricorn'
  | 'aquarius'
  | 'pisces'
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'

export type ZodiacDateRange = {
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
}

export type ZodiacDbRecord = {
  id: ZodiacId
  nameFa: string
  nameEn: string
  subtitle: string
  symbol: string
  element: string
  stones: string
  luckyColors: string
  abbreviation: string
  mainStars: string
  brightestStar: string
  area: string
  bestTime: string
  location: string
  description: string
  legend: string
  poem: string
  imageKey: ZodiacImageKey | null
  range: ZodiacDateRange
}

export type ZodiacSign = Omit<ZodiacDbRecord, 'imageKey' | 'range'> & {
  image: string | null
}

export type LifeStats = {
  age: number
  daysLived: number
  hoursLived: number
  moonCycles: number
}

export type BirthdayProfile = {
  name: string
  birthDate: Date
  zodiac: ZodiacSign
  chips: Array<{ label: string; value: string }>
  stats: Array<{ label: string; value: string }>
  age: number
  daysLived: number
  hoursLived: number
  moonCycles: number
}
