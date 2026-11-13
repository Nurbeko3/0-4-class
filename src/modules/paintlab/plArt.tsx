// «Paint asboblari» moduli rasmlari: lokal SVG, emoji yo'q. O'lcham font-size bilan (1em).
import type { ReactNode } from 'react'
type P = { className?: string }

const svg = (className: string | undefined, children: ReactNode) => (
  <svg className={className} viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
    {children}
  </svg>
)

/** Chelak (bo'yoq quyish) */
export const FillIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <path d="M22 44 L52 14 L84 46 L54 76 Z" fill="#fff" stroke="#2D3A4A" strokeWidth="6" strokeLinejoin="round" />
      <path d="M27 46 H80 L54 72 Z" fill="#3FA9F5" />
      <path d="M40 26 L30 16" stroke="#2D3A4A" strokeWidth="6" strokeLinecap="round" />
      <path d="M18 62 c-7 10 -9 16 -9 20 a9 9 0 0 0 18 0 c0 -4 -2 -10 -9 -20z" fill="#3FA9F5" stroke="#2D3A4A" strokeWidth="5" />
    </>,
  )

export const ShapesIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <rect x="10" y="44" width="44" height="44" rx="6" fill="#FFC94A" stroke="#2D3A4A" strokeWidth="6" />
      <circle cx="66" cy="34" r="22" fill="#FF7A6B" stroke="#2D3A4A" strokeWidth="6" />
      <path d="M60 90 L92 62" stroke="#2D3A4A" strokeWidth="7" strokeLinecap="round" />
    </>,
  )

export const EraserIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <path d="M14 62 L52 24 a8 8 0 0 1 11 0 L84 45 a8 8 0 0 1 0 11 L58 82 H30 Z" fill="#F58FB7" stroke="#2D3A4A" strokeWidth="6" strokeLinejoin="round" />
      <path d="M14 62 L34 42 L66 74 L58 82 H30 Z" fill="#fff" stroke="#2D3A4A" strokeWidth="6" strokeLinejoin="round" />
      <path d="M12 90 H90" stroke="#2D3A4A" strokeWidth="6" strokeLinecap="round" />
    </>,
  )

/** Simmetriya: kapalak */
export const MirrorIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <path d="M48 50 C30 14 6 22 10 46 C12 60 30 58 48 50 C34 66 20 76 28 86 C38 94 46 74 48 50Z" fill="#9B8AE6" stroke="#2D3A4A" strokeWidth="5" strokeLinejoin="round" />
      <path d="M52 50 C70 14 94 22 90 46 C88 60 70 58 52 50 C66 66 80 76 72 86 C62 94 54 74 52 50Z" fill="#fff" stroke="#2D3A4A" strokeWidth="5" strokeLinejoin="round" strokeDasharray="7 6" />
      <path d="M50 12 V92" stroke="#2D3A4A" strokeWidth="5" strokeLinecap="round" />
    </>,
  )
