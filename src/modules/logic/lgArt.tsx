// Mantiq moduli rasmlari: lokal SVG (emoji yo'q). O'lcham font-size bilan: 1em.
import type { ReactNode } from 'react'
import type { Hue, Item, Shape } from './logic'

const INK = '#2D3A4A'

const FILL: Record<Hue, [string, string]> = {
  coral: ['#FF7A6B', '#D9584A'],
  sky: ['#6CB8F0', '#3F8FCC'],
  sun: ['#FFC94A', '#E9A91F'],
  leaf: ['#5CC98B', '#2F9460'],
  violet: ['#9B8AE6', '#7462C9'],
}

const PATHS: Record<Shape, ReactNode> = {
  circle: <circle cx="50" cy="50" r="40" />,
  square: <rect x="13" y="13" width="74" height="74" rx="10" />,
  triangle: <polygon points="50,11 92,86 8,86" />,
  star: <polygon points="50,6 62,36 94,38 69,58 77,90 50,72 23,90 31,58 6,38 38,36" />,
  heart: <path d="M50 88 C8 60 6 30 27 19 C40 13 48 22 50 31 C52 22 60 13 73 19 C94 30 92 60 50 88Z" />,
  diamond: <polygon points="50,5 88,50 50,95 12,50" />,
}

interface P {
  className?: string
}

export function ShapeArt({ item, className }: P & { item: Item }) {
  const [fill, edge] = FILL[item.hue]
  return (
    <svg className={className} viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
      <g fill={fill} stroke={edge} strokeWidth="5" strokeLinejoin="round" transform={item.small ? 'translate(50 50) scale(0.55) translate(-50 -50)' : undefined}>
        {PATHS[item.shape]}
      </g>
    </svg>
  )
}

function Icon({ className, children }: P & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
      {children}
    </svg>
  )
}

/** Mavzu belgisi: uchta shakl */
export const LogicIcon = (p: P) => (
  <Icon {...p}>
    <polygon points="50,8 74,46 26,46" fill="#FFC94A" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <rect x="9" y="54" width="36" height="36" rx="7" fill="#fff" stroke={INK} strokeWidth="5" />
    <circle cx="73" cy="72" r="19" fill="#9B8AE6" stroke={INK} strokeWidth="5" />
  </Icon>
)

/** «Ortiqchasini top»: uchta doira va bitta yulduz */
export const OddIcon = (p: P) => (
  <Icon {...p}>
    <g fill="#6CB8F0" stroke="#3F8FCC" strokeWidth="4">
      <circle cx="27" cy="27" r="19" />
      <circle cx="73" cy="27" r="19" />
      <circle cx="27" cy="73" r="19" />
    </g>
    <polygon
      points="73,50 79,65 95,66 83,76 87,92 73,83 59,92 63,76 51,66 67,65"
      fill="#FFC94A"
      stroke="#E9A91F"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </Icon>
)

/** «Qatorni davom ettir»: doira, kvadrat, doira, so'roq */
export const PatternIcon = (p: P) => (
  <Icon {...p}>
    <circle cx="27" cy="27" r="18" fill="#FF7A6B" stroke="#D9584A" strokeWidth="4" />
    <rect x="56" y="10" width="34" height="34" rx="6" fill="#5CC98B" stroke="#2F9460" strokeWidth="4" />
    <circle cx="27" cy="73" r="18" fill="#FF7A6B" stroke="#D9584A" strokeWidth="4" />
    <rect x="56" y="56" width="34" height="34" rx="6" fill="#fff" stroke={INK} strokeWidth="4" strokeDasharray="7 6" />
    <path d="M67 68 a6.5 6.5 0 1 1 9.5 5.5 q-3.5 2 -3.5 5" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="73" cy="84.5" r="2.6" fill={INK} />
  </Icon>
)

/** «Juftini top»: ikki kartochka */
export const MemoryIcon = (p: P) => (
  <Icon {...p}>
    <rect x="8" y="20" width="44" height="60" rx="9" fill="#9B8AE6" stroke={INK} strokeWidth="5" transform="rotate(-8 30 50)" />
    <rect x="48" y="20" width="44" height="60" rx="9" fill="#fff" stroke={INK} strokeWidth="5" transform="rotate(8 70 50)" />
    <path d="M70 62 C56 52 56 42 63 39 C67 37 70 40 70 43 C70 40 73 37 77 39 C84 42 84 52 70 62Z" fill="#FF7A6B" transform="rotate(8 70 50)" />
    <path d="M24 43 a7 7 0 1 1 10 6 q-4 2 -4 6" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" transform="rotate(-8 30 50)" />
    <circle cx="30" cy="65" r="3" fill="#fff" transform="rotate(-8 30 50)" />
  </Icon>
)

/** Kartochka orqasidagi so'roq belgisi */
export const Question = (p: P) => (
  <Icon {...p}>
    <path d="M34 38 a16 16 0 1 1 24 14 q-8 5 -8 13" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
    <circle cx="50" cy="82" r="6.5" fill="currentColor" />
  </Icon>
)
