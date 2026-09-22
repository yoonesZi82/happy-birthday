import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const MUSIC_SRC = '/music/happy-birthday.mp3'

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  async function startMusic() {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    try {
      await audio.play()
    } catch {
      // browser may still block; toggle button remains as fallback
    }
  }

  async function handleStartCelebration() {
    setIsWelcomeOpen(false)
    await startMusic()
  }

  async function toggleMusic() {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    if (!audio.paused) {
      audio.pause()
      return
    }
    await startMusic()
  }

  return (
    <>
      <Dialog
        open={isWelcomeOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsWelcomeOpen(true)
          }
        }}
        disablePointerDismissal
      >
        <DialogContent
          showCloseButton={false}
          className="border border-primary/30 bg-[#0c1022] text-slate-100 ring-primary/20"
        >
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-lg text-amber-200">
              آماده‌ای جشن شروع بشه؟
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              برای شنیدن آهنگ جشن تولد، روی دکمه زیر کلیک کن.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-t-white/10 bg-transparent sm:justify-center">
            <Button
              type="button"
              size="lg"
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
              onClick={() => void handleStartCelebration()}
            >
              <Music2 className="size-4" />
              شروع جشن و پخش آهنگ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <button
        type="button"
        onClick={() => void toggleMusic()}
        className={cn(
          'glass-panel group flex cursor-pointer items-center gap-3 rounded-full border border-primary/30 px-4 py-2 transition hover:border-primary',
        )}
      >
        <div className="flex h-6 items-end gap-1 px-1">
          {[1, 2, 3, 4].map((bar) => (
            <span
              key={bar}
              className={cn(
                'w-1 rounded-full bg-primary',
                isPlaying ? `sound-bar sound-bar-${bar}` : 'h-1.5',
              )}
            />
          ))}
        </div>
        <div className="text-right">
          <p className="flex items-center gap-1 text-xs font-semibold text-primary">
            آهنگ جشن تولد
            <Music2 className="size-3.5" />
          </p>
          <p className="text-[10px] text-muted-foreground">
            {isPlaying ? 'در حال پخش جشن' : 'برای پخش لمس کنید'}
          </p>
        </div>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </span>
      </button>
    </>
  )
}
