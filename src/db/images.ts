import aquarius from '@/assets/constellations/aquarius.png'
import taurus from '@/assets/constellations/taurus.png'
import gemini from '@/assets/constellations/gemini.png'
import leo from '@/assets/constellations/leo.png'
import scorpius from '@/assets/constellations/scorpius.png'
import sagittarius from '@/assets/constellations/sagittarius.png'

export const zodiacImageMap = {
  aquarius,
  taurus,
  gemini,
  leo,
  scorpius,
  sagittarius,
} as const

export type ZodiacImageKey = keyof typeof zodiacImageMap
