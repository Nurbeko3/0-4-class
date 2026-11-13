// «Jadval» moduli rasmlari: lokal SVG, emoji yo'q. O'lcham font-size bilan (1em).
import type { ReactNode } from 'react'
import { FRUIT_COLOR, type FruitId } from './fruits'
type P = { className?: string }

const svg = (className: string | undefined, children: ReactNode) => (
  <svg className={className} viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
    {children}
  </svg>
)

const Sheet = ({ fill = '#fff' }: { fill?: string }) => (
  <>
    <rect x="8" y="12" width="84" height="76" rx="12" fill={fill} stroke="#2D3A4A" strokeWidth="5" />
    <path d="M8 34 H92 M8 61 H92 M36 12 V88 M64 12 V88" stroke="#2D3A4A" strokeWidth="4" opacity="0.35" />
  </>
)

/** Mavzu ikonkasi */
export const ExcelIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <rect x="8" y="12" width="84" height="76" rx="12" fill="#fff" stroke="currentColor" strokeWidth="6" />
      <rect x="11" y="15" width="78" height="19" rx="8" fill="currentColor" opacity="0.3" />
      <path d="M8 34 H92 M8 61 H92 M36 12 V88 M64 12 V88" stroke="currentColor" strokeWidth="5" />
    </>,
  )

export const CellIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <Sheet />
      <rect x="36" y="34" width="28" height="27" fill="#FFC94A" stroke="#2D3A4A" strokeWidth="5" />
      <path d="M50 39 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#fff" />
    </>,
  )

export const TypeIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <rect x="8" y="26" width="84" height="48" rx="10" fill="#fff" stroke="#2BB3A3" strokeWidth="7" />
      <text x="20" y="63" fontSize="36" fontWeight="900" fill="#2D3A4A" fontFamily="inherit">
        12
      </text>
      <rect x="68" y="36" width="6" height="28" rx="3" fill="#FF7A6B" />
    </>,
  )

export const SumIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <rect x="10" y="10" width="80" height="80" rx="18" fill="#5CC98B" stroke="#2D3A4A" strokeWidth="5" />
      <path d="M50 28 V72 M28 50 H72" stroke="#fff" strokeWidth="13" strokeLinecap="round" />
    </>,
  )

export const ChartIcon = ({ className }: P) =>
  svg(
    className,
    <>
      <rect x="14" y="52" width="18" height="34" rx="5" fill="#FF7A6B" stroke="#2D3A4A" strokeWidth="4" />
      <rect x="41" y="22" width="18" height="64" rx="5" fill="#FFC94A" stroke="#2D3A4A" strokeWidth="4" />
      <rect x="68" y="38" width="18" height="48" rx="5" fill="#6CB8F0" stroke="#2D3A4A" strokeWidth="4" />
      <path d="M6 90 H94" stroke="#2D3A4A" strokeWidth="5" strokeLinecap="round" />
    </>,
  )

// ---------- O'yin ichidagi rasmlar ----------

/** Topilgan xazina */
export const Gem = () =>
  svg(
    undefined,
    <>
      <path d="M50 90 L10 40 L28 16 H72 L90 40 Z" fill="#6CB8F0" stroke="#2D3A4A" strokeWidth="6" strokeLinejoin="round" />
      <path d="M10 40 H90 M28 16 L40 40 L50 90 L60 40 L72 16" fill="none" stroke="#2D3A4A" strokeWidth="4" strokeLinejoin="round" opacity="0.55" />
      <path d="M32 22 H50 L42 36 H24 Z" fill="#fff" opacity="0.75" />
    </>,
  )

/** Meva: rangi bilan farqlanadi (jadvalning A ustuni va diagramma osti). */
export const Fruit = ({ id }: { id: FruitId }) =>
  svg(
    undefined,
    <>
      <path d="M50 30 C52 18 58 12 66 10" fill="none" stroke="#8A5A32" strokeWidth="6" strokeLinecap="round" />
      <path d="M56 22 C66 10 82 12 86 22 C76 30 64 30 56 22Z" fill="#45B97C" stroke="#2D3A4A" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="50" cy="60" r="32" fill={FRUIT_COLOR[id]} stroke="#2D3A4A" strokeWidth="6" />
      <path d="M30 52 C32 42 40 36 48 36" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
    </>,
  )

export const BackKeyIcon = () =>
  svg(
    undefined,
    <>
      <path d="M36 22 H86 V78 H36 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" />
      <path d="M50 38 L72 62 M72 38 L50 62" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    </>,
  )

export const EnterKeyIcon = () =>
  svg(
    undefined,
    <path d="M82 18 V56 H24 M42 36 L22 56 L42 76" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />,
  )

export const CheckIcon = () =>
  svg(
    undefined,
    <path d="M20 54 L42 74 L82 28" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />,
  )
