import type { Ymd } from '@/lib/jalali'
import { formatJalaliYmd } from '@/lib/jalali'

export function isLocalOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname
    return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.endsWith('.local')
  } catch {
    return true
  }
}

/** Public site origin for invite QR links — never defaults to localhost. */
export function resolveInviteOrigin(override = ''): string {
  const fromOverride = normalizeOrigin(override)
  if (fromOverride) {
    return fromOverride
  }
  const fromEnv = normalizeOrigin(String(import.meta.env.VITE_PUBLIC_SITE_URL ?? ''))
  if (fromEnv) {
    return fromEnv
  }
  const fromWindow = normalizeOrigin(window.location.origin)
  if (fromWindow && !isLocalOrigin(fromWindow)) {
    return fromWindow
  }
  return ''
}

export function buildInviteUrl(name: string, jalaliDate: Ymd, origin: string): string {
  const base = normalizeOrigin(origin)
  if (!base) {
    return ''
  }
  const params = new URLSearchParams()
  params.set('name', name.trim())
  params.set('jdate', formatJalaliYmd(jalaliDate))
  params.set('calendar', 'jalali')
  return `${base}/?${params.toString()}`
}

function normalizeOrigin(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, '')
  if (!trimmed) {
    return ''
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}
