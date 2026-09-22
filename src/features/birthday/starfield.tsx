import { useEffect, useRef } from 'react'

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    const surface = canvas
    const brush = ctx
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.8 + 0.4,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.008,
    }))
    let frame = 0
    let raf = 0

    function resize() {
      surface.width = window.innerWidth
      surface.height = window.innerHeight
    }

    function draw() {
      frame += 1
      brush.clearRect(0, 0, surface.width, surface.height)
      const gradient = brush.createRadialGradient(
        surface.width * 0.5,
        surface.height * 0.2,
        40,
        surface.width * 0.5,
        surface.height * 0.5,
        surface.width * 0.8,
      )
      gradient.addColorStop(0, 'rgba(88, 28, 135, 0.18)')
      gradient.addColorStop(0.45, 'rgba(30, 58, 138, 0.12)')
      gradient.addColorStop(1, 'rgba(6, 8, 20, 0)')
      brush.fillStyle = gradient
      brush.fillRect(0, 0, surface.width, surface.height)
      for (const star of stars) {
        const alpha = 0.35 + Math.sin(frame * star.speed + star.twinkle) * 0.35
        brush.beginPath()
        brush.fillStyle = `rgba(255, 230, 160, ${alpha})`
        brush.arc(star.x * surface.width, star.y * surface.height, star.size, 0, Math.PI * 2)
        brush.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />
}
