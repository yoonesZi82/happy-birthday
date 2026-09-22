import { useState } from 'react'
import { Button } from '@/components/ui/button'

type FooterActionsProps = {
  onOpenGift: () => void
}

export function FooterActions({ onOpenGift }: FooterActionsProps) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="glass-panel mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border-primary/20 p-6 md:flex-row">
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-xl bg-white p-1 shadow-lg">
          <QrMark />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">بارکد یادگاری برای دسترسی سریع</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            این لینک ماندگار است؛ هر زمان بارکد کارت هدیه را اسکن کنید، این صفحه برایتان باز خواهد شد.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => void copyLink()}
          className="h-auto rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
        >
          {copied ? '✓ کپی شد' : '📋 کپی لینک اختصاصی'}
        </Button>
        <Button
          type="button"
          onClick={onOpenGift}
          className="h-auto rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-black shadow-md hover:from-amber-400 hover:to-amber-500"
        >
          🎁 مشاهده هدیه ویژه
        </Button>
      </div>
    </div>
  )
}

function QrMark() {
  return (
    <svg className="size-full text-black" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm8-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v4h-2v-4zm2-2h2v2h-2v-2zm-6 4h4v2h-4v-2zm8-2h2v4h-2v-4z" />
    </svg>
  )
}
