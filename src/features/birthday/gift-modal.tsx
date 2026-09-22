import { Button } from '@/components/ui/button'

type GiftModalProps = {
  isOpen: boolean
  onClose: () => void
  name: string
}

export function GiftModal({ isOpen, onClose, name }: GiftModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="glass-panel relative w-full max-w-md rounded-3xl border-primary/50 p-6 text-center md:p-8">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/20 text-3xl">
          🎉
        </div>
        <h3 className="mb-2 text-xl font-bold text-amber-200">هدیه ویژه تولد!</h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-300">
          {name} عزیز، به مناسبت زادروز زیبایت یک لحظه کهکشانی برایت رزرو شده تا آسمان را از نزدیک به
          تماشا بنشینی! 🔭✨
        </p>
        <Button
          onClick={onClose}
          className="h-auto w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-amber-400"
        >
          متشکرم! بازگشت به جشن
        </Button>
      </div>
    </div>
  )
}
