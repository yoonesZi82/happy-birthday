import { buildBirthdayProfile } from '@/db/lookup'
import type { BirthdayProfile } from '@/db/types'
import { isValidJalaliDate, jalaliToGregorian } from '@/lib/jalali'

export type { BirthdayProfile as BirthdayPerson }

const LATIN_DIGITS = '0123456789'
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

export { formatNumberFa, toPersianDigits } from '@/lib/format'

export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (digit) => {
    const index = PERSIAN_DIGITS.indexOf(digit)
    return index >= 0 ? (LATIN_DIGITS[index] ?? digit) : digit
  })
}

export function parseBirthdayQuery(search: string): { name: string; birthDate: Date } | null {
  const params = new URLSearchParams(search)
  const name = (params.get('name') ?? params.get('n') ?? '').trim()
  if (!name) {
    return null
  }
  const calendarHint = (params.get('calendar') ?? params.get('cal') ?? '').trim().toLowerCase()
  const rawDate = (
    params.get('date') ??
    params.get('birthDate') ??
    params.get('dob') ??
    params.get('jdate') ??
    params.get('shamsi') ??
    ''
  ).trim()
  if (!rawDate) {
    return null
  }
  const birthDate = parseFlexibleDate(
    rawDate,
    calendarHint,
    params.has('jdate') || params.has('shamsi'),
  )
  if (!birthDate) {
    return null
  }
  return { name, birthDate }
}

export function parseFlexibleDate(
  raw: string,
  calendarHint = '',
  forceJalali = false,
): Date | null {
  const cleaned = toLatinDigits(raw).trim()
  const forceFromPrefix = /^j:/i.test(cleaned)
  const normalized = cleaned.replace(/^j:/i, '')
  const parts = normalized.match(/^(\d{1,4})[/.-](\d{1,2})[/.-](\d{1,4})$/)
  if (!parts) {
    return null
  }
  const a = Number(parts[1])
  const b = Number(parts[2])
  const c = Number(parts[3])
  if (!a || !b || !c) {
    return null
  }

  // Support both Y-M-D and D-M-Y
  let year: number
  let month: number
  let day: number
  if (String(parts[1]).length >= 3) {
    year = a
    month = b
    day = c
  } else if (String(parts[3]).length >= 3) {
    day = a
    month = b
    year = c
  } else {
    return null
  }

  const preferJalali =
    forceJalali ||
    forceFromPrefix ||
    isJalaliHint(calendarHint) ||
    (year >= 1200 && year <= 1500 && !isGregorianHint(calendarHint))

  if (preferJalali) {
    if (!isValidJalaliDate(year, month, day)) {
      return null
    }
    const g = jalaliToGregorian(year, month, day)
    return localNoonDate(g.year, g.month, g.day)
  }
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null
  }
  const date = localNoonDate(year, month, day)
  return Number.isNaN(date.getTime()) ? null : date
}

function isJalaliHint(hint: string): boolean {
  return ['jalali', 'shamsi', 'persian', 'fa', 'j', 'شمسی', 'جلالی'].includes(hint)
}

function isGregorianHint(hint: string): boolean {
  return ['gregorian', 'miladi', 'en', 'g', 'میلادی'].includes(hint)
}

function localNoonDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0)
}

export function buildBirthdayPerson(
  name: string,
  birthDate: Date,
  now = new Date(),
): BirthdayProfile {
  return buildBirthdayProfile(name, birthDate, now)
}

export function formatBirthDateFa(date: Date): string {
  const jalali = date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const gregorian = date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return `${jalali} (${gregorian})`
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}
