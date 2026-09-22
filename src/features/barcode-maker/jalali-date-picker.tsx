import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toPersianDigits } from '@/lib/format'
import {
  JALALI_MONTHS_FA,
  type Ymd,
  daysInJalaliMonth,
  formatJalaliYmd,
  jalaliToDate,
} from '@/lib/jalali'
import { cn } from '@/lib/utils'

type JalaliDatePickerProps = {
  value: Ymd | null
  onChange: (next: Ymd) => void
  className?: string
}

const WEEKDAYS_FA = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const

export function JalaliDatePicker({ value, onChange, className }: JalaliDatePickerProps) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<Ymd>(() => value ?? { year: 1380, month: 1, day: 1 })

  const days = useMemo(() => {
    const count = daysInJalaliMonth(view.year, view.month)
    return Array.from({ length: count }, (_, index) => index + 1)
  }, [view.month, view.year])

  const startOffset = useMemo(() => {
    const first = jalaliToDate({ year: view.year, month: view.month, day: 1 })
    // شنبه اول هفته: JS Sunday=0 → Saturday=0
    return (first.getDay() + 1) % 7
  }, [view.month, view.year])

  const label = value
    ? toPersianDigits(
        `${value.day} ${JALALI_MONTHS_FA[value.month - 1]} ${value.year}`,
      )
    : 'تاریخ تولد شمسی را انتخاب کنید'

  function shiftMonth(delta: number) {
    let month = view.month + delta
    let year = view.year
    if (month < 1) {
      month = 12
      year -= 1
    } else if (month > 12) {
      month = 1
      year += 1
    }
    setView({ year, month, day: 1 })
  }

  function shiftYear(delta: number) {
    setView((current) => ({ ...current, year: current.year + delta, day: 1 }))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              'h-11 w-full justify-between border-primary/25 bg-background/40 px-3 text-sm font-normal',
              !value && 'text-muted-foreground',
              className,
            )}
          />
        }
      >
        <span>{label}</span>
        <CalendarDays className="size-4 text-primary" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(100vw-2rem,20rem)] border border-primary/20 bg-[#0b1020] p-3 text-slate-100"
      >
        <div className="mb-3 flex items-center justify-between gap-1">
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => shiftYear(1)}
              aria-label="سال بعد"
            >
              <ChevronRight className="size-4" />
              <ChevronRight className="-ms-2 size-4 opacity-70" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => shiftMonth(1)}
              aria-label="ماه بعد"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <p className="text-sm font-semibold text-amber-200">
            {toPersianDigits(`${JALALI_MONTHS_FA[view.month - 1]} ${view.year}`)}
          </p>
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => shiftMonth(-1)}
              aria-label="ماه قبل"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => shiftYear(-1)}
              aria-label="سال قبل"
            >
              <ChevronLeft className="-me-2 size-4 opacity-70" />
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
          {WEEKDAYS_FA.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }, (_, index) => (
            <span key={`pad-${index}`} className="size-8" />
          ))}
          {days.map((day) => {
            const selected =
              value?.year === view.year && value.month === view.month && value.day === day
            return (
              <button
                key={day}
                type="button"
                className={cn(
                  'flex size-8 items-center justify-center rounded-md text-sm transition',
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-primary/15 hover:text-amber-100',
                )}
                onClick={() => {
                  const next = { year: view.year, month: view.month, day }
                  onChange(next)
                  setOpen(false)
                }}
              >
                {toPersianDigits(day)}
              </button>
            )
          })}
        </div>
        {value ? (
          <p className="mt-3 text-center text-[11px] text-slate-400">
            {toPersianDigits(formatJalaliYmd(value))}
          </p>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
