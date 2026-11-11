// Rasm chizish moduli ikonkalari (lokal SVG, 1em).
import type { ReactNode } from 'react'

interface P {
  className?: string
}

function S({ className, children }: P & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
      {children}
    </svg>
  )
}

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 9, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const BrushTool = (p: P) => (
  <S {...p}>
    <path d="M86 12 L46 54" stroke="#B9763A" strokeWidth="10" strokeLinecap="round" />
    <path d="M48 50 q12 2 10 14 q-8 22 -42 20 q14 -8 14 -20 q2 -14 18 -14Z" fill="currentColor" />
  </S>
)

export const EraserTool = (p: P) => (
  <S {...p}>
    <path d="M58 14 L88 44 L48 84 H30 L14 68Z" fill="#F58FB7" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
    <path d="M36 36 L66 66" stroke="currentColor" strokeWidth="6" />
    <path d="M24 90 H84" {...line} strokeWidth={6} />
  </S>
)

export const RectTool = (p: P) => (
  <S {...p}>
    <rect x="14" y="22" width="72" height="56" rx="6" {...line} />
  </S>
)

export const CircleTool = (p: P) => (
  <S {...p}>
    <circle cx="50" cy="50" r="34" {...line} />
  </S>
)

export const LineTool = (p: P) => (
  <S {...p}>
    <path d="M18 82 L82 18" {...line} />
  </S>
)

export const UndoIcon = (p: P) => (
  <S {...p}>
    <path d="M34 22 L14 42 L34 62 M14 42 H62 a22 22 0 0 1 0 44 H40" {...line} />
  </S>
)

export const ClearIcon = (p: P) => (
  <S {...p}>
    <path d="M22 30 H78 L72 88 H28Z M14 30 H86 M40 30 V18 H60 V30 M42 46 V72 M58 46 V72" {...line} strokeWidth={7} />
  </S>
)

export const SaveIcon = (p: P) => (
  <S {...p}>
    <path d="M50 12 V60 M30 42 L50 62 L70 42 M16 72 V86 H84 V72" {...line} />
  </S>
)

export const CheckIcon = (p: P) => (
  <S {...p}>
    <path d="M18 52 L42 76 L84 26" {...line} strokeWidth={13} />
  </S>
)

/** Xaritadagi daraja belgisi: palitra */
export const PaletteIcon = (p: P) => (
  <S {...p}>
    <path d="M50 10 C24 10 8 28 8 50 c0 22 18 40 40 40 c10 0 12 -8 8 -14 c-5 -8 2 -16 12 -14 c14 2 24 -6 24 -18 C92 26 74 10 50 10Z" fill="#F4E3C3" stroke="#2D3A4A" strokeWidth="5" strokeLinejoin="round" />
    <circle cx="30" cy="42" r="8" fill="#FF7A6B" />
    <circle cx="48" cy="28" r="8" fill="#FFC94A" />
    <circle cx="70" cy="34" r="8" fill="#5CC98B" />
    <circle cx="30" cy="64" r="8" fill="#6CB8F0" />
  </S>
)
