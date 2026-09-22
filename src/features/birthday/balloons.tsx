import { useEffect, useState } from 'react'

type Balloon = {
  id: number
  left: number
  delay: number
  duration: number
  hue: number
  size: number
}

type BalloonsProps = {
  burstKey: number
}

export function Balloons({ burstKey }: BalloonsProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([])

  useEffect(() => {
    const next = Array.from({ length: 16 }, (_, index) => ({
      id: burstKey * 100 + index,
      left: Math.random() * 90 + 5,
      delay: Math.random() * 0.8,
      duration: 5.5 + Math.random() * 3.5,
      hue: [0, 40, 120, 200, 280, 320][index % 6] ?? 0,
      size: 36 + Math.random() * 28,
    }))
    setBalloons(next)
    const timer = window.setTimeout(() => setBalloons([]), 10000)
    return () => window.clearTimeout(timer)
  }, [burstKey])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {balloons.map((balloon) => (
        <span
          key={balloon.id}
          className="balloon absolute"
          style={{
            left: `${balloon.left}%`,
            animationDelay: `${balloon.delay}s`,
            animationDuration: `${balloon.duration}s`,
            fontSize: `${balloon.size}px`,
            filter: `hue-rotate(${balloon.hue}deg)`,
          }}
        >
          🎈
        </span>
      ))}
    </div>
  )
}
