import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { Check, Copy, Download, ImageDown, Link2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toPersianDigits } from '@/lib/format'
import type { Ymd } from '@/lib/jalali'
import { formatJalaliYmd } from '@/lib/jalali'
import { applyDocumentSeo } from '@/lib/seo'
import { buildInviteUrl, resolveInviteOrigin } from './build-invite-url'
import {
  buildQrFileBase,
  downloadPngFromSvg,
  downloadSvgElement,
} from './download-qr'
import { JalaliDatePicker } from './jalali-date-picker'

export function BarcodeMakerPage() {
  const [name, setName] = useState('')
  const [jalaliDate, setJalaliDate] = useState<Ymd | null>(null)
  const [siteOrigin, setSiteOrigin] = useState(() => resolveInviteOrigin())
  const [copied, setCopied] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.documentElement.lang = 'fa'
    document.documentElement.dir = 'rtl'
    applyDocumentSeo({
      title: 'ساخت QR Code جشن تولد | کارگاه دعوت‌نامه',
      description: 'ساخت QR Code اختصاصی دعوت‌نامه جشن تولد با نام و تاریخ شمسی.',
      path: '/make',
      noIndex: true,
    })
  }, [])

  const trimmedName = name.trim()
  const inviteOrigin = resolveInviteOrigin(siteOrigin)
  const inviteUrl = useMemo(() => {
    if (!trimmedName || !jalaliDate || !inviteOrigin) {
      return ''
    }
    return buildInviteUrl(trimmedName, jalaliDate, inviteOrigin)
  }, [inviteOrigin, jalaliDate, trimmedName])

  function getQrSvg(): SVGElement | null {
    return printRef.current?.querySelector('svg') ?? null
  }

  async function copyLink() {
    if (!inviteUrl) {
      return
    }
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function downloadSvg() {
    const svg = getQrSvg()
    if (!svg) {
      return
    }
    downloadSvgElement(svg, `${buildQrFileBase(trimmedName, jalaliDate)}.svg`)
  }

  async function downloadPng() {
    const svg = getQrSvg()
    if (!svg) {
      return
    }
    await downloadPngFromSvg(svg, `${buildQrFileBase(trimmedName, jalaliDate)}.png`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060814] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.16),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(79,70,229,0.18),transparent_50%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-10 sm:px-6">
        <header className="mb-8 space-y-3 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-amber-200">
            <Sparkles className="size-3.5" />
            کارگاه ساخت دعوت‌نامه
          </p>
          <h1 className="bg-gradient-to-l from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
            ساخت QR Code جشن تولد
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            نام و تاریخ شمسی را وارد کنید تا لینک اختصاصی و QR Code آماده تحویل ساخته شود.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="site-origin" className="text-amber-100">
                  دامنه سایت (برای لینک داخل QR)
                </Label>
                <Input
                  id="site-origin"
                  value={siteOrigin}
                  onChange={(event) => setSiteOrigin(event.target.value)}
                  placeholder="https://your-domain.com"
                  className="h-11 border-primary/25 bg-background/40 text-base"
                  dir="ltr"
                  autoComplete="url"
                />
                <p className="text-[11px] text-slate-400">
                  روی سرور واقعی، دامنه به‌صورت خودکار پر می‌شود. روی localhost باید دامنه نهایی را وارد کنید.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-name" className="text-amber-100">
                  نام مهمان
                </Label>
                <Input
                  id="guest-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="مثلاً سارا محمدی"
                  className="h-11 border-primary/25 bg-background/40 text-base"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-amber-100">تاریخ تولد (جلالی)</Label>
                <JalaliDatePicker value={jalaliDate} onChange={setJalaliDate} />
              </div>
              {inviteUrl ? (
                <div className="space-y-2 rounded-2xl border border-primary/20 bg-black/20 p-3">
                  <p className="flex items-center gap-2 text-xs text-slate-400">
                    <Link2 className="size-3.5" />
                    لینک دعوت‌نامه
                  </p>
                  <p className="break-all text-xs leading-relaxed text-slate-200" dir="ltr">
                    {inviteUrl}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button type="button" size="sm" onClick={() => void copyLink()}>
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      {copied ? 'کپی شد' : 'کپی لینک'}
                    </Button>
                    <Button type="button" size="sm" onClick={() => void downloadPng()}>
                      <ImageDown className="size-4" />
                      دانلود عکس PNG
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={downloadSvg}>
                      <Download className="size-4" />
                      دانلود SVG
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-primary/25 bg-gradient-to-b from-amber-500/10 via-transparent to-indigo-500/10 p-5 sm:p-6">
            <div
              ref={printRef}
              className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl bg-white px-4 py-6 text-slate-900 shadow-inner"
            >
              {inviteUrl && jalaliDate ? (
                <>
                  <div className="text-center">
                    <p className="text-lg font-bold">{trimmedName}</p>
                    <p className="text-sm text-slate-500">
                      {toPersianDigits(formatJalaliYmd(jalaliDate))}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <QRCode value={inviteUrl} size={200} level="M" bgColor="#ffffff" fgColor="#0b1020" />
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">پیش‌نمایش QR Code اینجا ظاهر می‌شود</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
