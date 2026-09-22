import type { Ymd } from '@/lib/jalali'
import { formatJalaliYmd } from '@/lib/jalali'

export function buildQrFileBase(name: string, jalaliDate: Ymd | null): string {
  const stamp = jalaliDate ? formatJalaliYmd(jalaliDate).replaceAll('/', '-') : 'invite'
  const safeName = name.trim() || 'guest'
  return `birthday-qr-${safeName}-${stamp}`
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(href)
}

export function downloadSvgElement(svg: SVGElement, fileName: string): void {
  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' })
  downloadBlob(blob, fileName)
}

export async function downloadPngFromSvg(
  svg: SVGElement,
  fileName: string,
  size = 1024,
): Promise<void> {
  const cloned = svg.cloneNode(true) as SVGElement
  cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  cloned.setAttribute('width', String(size))
  cloned.setAttribute('height', String(size))
  const svgText = new XMLSerializer().serializeToString(cloned)
  const svgUrl = URL.createObjectURL(
    new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }),
  )
  try {
    const image = await loadImage(svgUrl)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) {
      return
    }
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, size, size)
    context.drawImage(image, 0, 0, size, size)
    const blob = await canvasToPngBlob(canvas)
    if (!blob) {
      return
    }
    downloadBlob(blob, fileName)
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('failed to load qr image'))
    image.src = src
  })
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}
