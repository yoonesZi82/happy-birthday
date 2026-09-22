/** Minimal Jalali ↔ Gregorian helpers (no external deps). */

export type Ymd = { year: number; month: number; day: number }

const GREGORIAN_EPOCH = 1721425.5
const JALALI_EPOCH = 1948320.5

function div(a: number, b: number): number {
  return Math.floor(a / b)
}

function mod(a: number, b: number): number {
  return a - b * Math.floor(a / b)
}

function gregorianToJd(year: number, month: number, day: number): number {
  return (
    GREGORIAN_EPOCH -
    1 +
    365 * (year - 1) +
    div(year - 1, 4) -
    div(year - 1, 100) +
    div(year - 1, 400) +
    div(367 * month - 362, 12) +
    (month <= 2 ? 0 : isGregorianLeap(year) ? -1 : -2) +
    day
  )
}

function isGregorianLeap(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

function jdToGregorian(jd: number): Ymd {
  const wjd = Math.floor(jd - 0.5) + 0.5
  const depoch = wjd - GREGORIAN_EPOCH
  const quadricent = div(depoch, 146097)
  const dqc = mod(depoch, 146097)
  const cent = div(dqc, 36524)
  const dcent = mod(dqc, 36524)
  const quad = div(dcent, 1461)
  const dquad = mod(dcent, 1461)
  const yindex = div(dquad, 365)
  let year = quadricent * 400 + cent * 100 + quad * 4 + yindex
  if (!(cent === 4 || yindex === 4)) {
    year += 1
  }
  const yearday = wjd - gregorianToJd(year, 1, 1)
  const leapadj = wjd < gregorianToJd(year, 3, 1) ? 0 : isGregorianLeap(year) ? 1 : 2
  const month = div((yearday + leapadj) * 12 + 373, 367)
  const day = wjd - gregorianToJd(year, month, 1) + 1
  return { year, month, day }
}

function jalaliToJd(year: number, month: number, day: number): number {
  const epbase = year - (year >= 0 ? 474 : 473)
  const epyear = 474 + mod(epbase, 2820)
  return (
    day +
    (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6) +
    div(epyear * 682 - 110, 2816) +
    (epyear - 1) * 365 +
    div(epbase, 2820) * 1029983 +
    (JALALI_EPOCH - 1)
  )
}

export function jalaliToGregorian(year: number, month: number, day: number): Ymd {
  return jdToGregorian(jalaliToJd(year, month, day))
}

export function gregorianToJalali(year: number, month: number, day: number): Ymd {
  return jdToJalali(gregorianToJd(year, month, day))
}

function jdToJalali(jd: number): Ymd {
  const depoch = jd - jalaliToJd(475, 1, 1)
  const cycle = div(depoch, 1029983)
  const cyear = mod(depoch, 1029983)
  let ycycle: number
  if (cyear === 1029982) {
    ycycle = 2820
  } else {
    const aux1 = div(cyear, 366)
    const aux2 = mod(cyear, 366)
    ycycle = div(2134 * aux1 + 2816 * aux2 + 2816, 1028522) + aux1 + 1
  }
  const year = ycycle + 2820 * cycle + 474
  const yday = jd - jalaliToJd(year, 1, 1) + 1
  const month = yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30)
  const day = jd - jalaliToJd(year, month, 1) + 1
  return { year, month, day }
}

export function daysInJalaliMonth(year: number, month: number): number {
  if (month <= 6) {
    return 31
  }
  if (month <= 11) {
    return 30
  }
  return isJalaliLeap(year) ? 30 : 29
}

export function isValidJalaliDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) {
    return false
  }
  return day <= daysInJalaliMonth(year, month) && year >= 1200 && year <= 1500
}

export const JALALI_MONTHS_FA = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const

export function formatJalaliYmd(ymd: Ymd): string {
  const month = String(ymd.month).padStart(2, '0')
  const day = String(ymd.day).padStart(2, '0')
  return `${ymd.year}/${month}/${day}`
}

export function dateToJalali(date: Date): Ymd {
  return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function jalaliToDate(ymd: Ymd): Date {
  const g = jalaliToGregorian(ymd.year, ymd.month, ymd.day)
  return new Date(g.year, g.month - 1, g.day, 12, 0, 0)
}

function isJalaliLeap(year: number): boolean {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324,
    2394, 2456, 3178,
  ]
  const bl = breaks.length
  let jp = breaks[0] ?? -61
  let jump = 0
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i] ?? jp
    jump = jm - jp
    if (year < jm) {
      break
    }
    jp = jm
  }
  let n = year - jp
  if (jump - n < 6) {
    n = n - jump + div(jump + 4, 33) * 33
  }
  let leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) {
    leap = 4
  }
  return leap === 0
}
