const SITE_NAME = 'جشن تولد کهکشانی'
const DEFAULT_TITLE = 'زادروزت خجسته باد ✨ | جشن تولد کهکشانی'
const DEFAULT_DESCRIPTION =
  'دعوت‌نامه اختصاصی جشن تولد کهکشانی؛ صفحه شخصی‌سازی‌شده با ستاره، صورت فلکی و پیام تبریک ویژه برای روز تولد شما.'

type DocumentSeoInput = {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function getPublicSiteOrigin(): string {
  const fromEnv = String(import.meta.env.VITE_PUBLIC_SITE_URL ?? '')
    .trim()
    .replace(/\/+$/, '')
  if (fromEnv) {
    return fromEnv
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }
  return 'https://happy-birthday-two-inky-96.vercel.app'
}

export function applyDocumentSeo(input: DocumentSeoInput = {}): void {
  const origin = getPublicSiteOrigin()
  const path = input.path ?? '/'
  const url = `${origin}${path.startsWith('/') ? path : `/${path}`}`
  const title = input.title ?? DEFAULT_TITLE
  const description = input.description ?? DEFAULT_DESCRIPTION
  const image = input.image ?? `${origin}/og-image.jpg`
  const robots = input.noIndex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

  document.title = title
  setMeta('name', 'description', description)
  setMeta('name', 'robots', robots)
  setMeta('name', 'googlebot', input.noIndex ? 'noindex, nofollow' : 'index, follow')
  setLink('canonical', url)

  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', image)
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:locale', 'fa_IR')
  setMeta('property', 'og:type', 'website')

  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', image)
}

export function buildInviteSeo(name: string, nick: string): DocumentSeoInput {
  return {
    title: `زادروزت مبارک ${nick} جان ✨ | ${SITE_NAME}`,
    description: `دعوت‌نامه اختصاصی جشن تولد ${name}؛ یک صفحه کهکشانی با پیام تبریک ویژه، صورت فلکی و حال‌وهوای جشن.`,
    path: `${window.location.pathname}${window.location.search}`,
  }
}

function setMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  )
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function setLink(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }
  element.href = href
}
