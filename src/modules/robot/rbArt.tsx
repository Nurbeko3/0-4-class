// Robot moduli rasmlari (lokal SVG, o'lcham font-size bilan: 1em).
import type { ReactNode } from 'react'
import type { Dir } from './interpreter'
import './robot.css'

const INK = '#2D3A4A'

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

const stroke = { fill: 'none', stroke: INK, strokeWidth: 9, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const TURN: Record<Dir, number> = { up: 0, right: 90, down: 180, left: 270 }

export const Arrow = ({ dir, ...p }: P & { dir: Dir }) => (
  <S {...p}>
    <g transform={`rotate(${TURN[dir]} 50 50)`}>
      <path d="M50 82 V22 M24 46 L50 20 L76 46" {...stroke} stroke="currentColor" strokeWidth="13" />
    </g>
  </S>
)

export const Robot = (p: P) => (
  <S {...p}>
    <path d="M50 8 V20" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <circle cx="50" cy="8" r="6" fill="#FF7A6B" stroke={INK} strokeWidth="4" />
    <rect x="20" y="20" width="60" height="46" rx="14" fill="#6CB8F0" stroke={INK} strokeWidth="5" />
    <rect x="29" y="30" width="42" height="24" rx="10" fill="#fff" stroke={INK} strokeWidth="4" />
    <circle cx="41" cy="42" r="5" fill={INK} />
    <circle cx="59" cy="42" r="5" fill={INK} />
    <rect x="32" y="66" width="36" height="22" rx="8" fill="#FFC94A" stroke={INK} strokeWidth="5" />
    <path d="M14 36 V52 M86 36 V52" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    <path d="M40 90 V96 M60 90 V96" stroke={INK} strokeWidth="7" strokeLinecap="round" />
  </S>
)

export const Bush = (p: P) => (
  <S {...p}>
    <path
      d="M14 78 Q2 60 20 50 Q14 28 38 30 Q46 10 66 26 Q90 22 84 48 Q100 62 86 78Z"
      fill="#45B97C"
      stroke="#2F9460"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path d="M34 54 Q40 46 48 52 M58 44 Q66 38 72 46" fill="none" stroke="#2F9460" strokeWidth="4" strokeLinecap="round" />
    <rect x="10" y="76" width="80" height="12" rx="6" fill="#B5764A" stroke={INK} strokeWidth="4" />
  </S>
)

export const PlayIcon = (p: P) => (
  <S {...p}>
    <path d="M32 18 L82 50 L32 82Z" fill="currentColor" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" />
  </S>
)

export const LoopIcon = (p: P) => (
  <S {...p}>
    <path d="M78 50 A28 28 0 1 1 64 26" {...stroke} stroke="currentColor" strokeWidth="11" />
    <path d="M58 8 L70 28 L48 34" {...stroke} stroke="currentColor" strokeWidth="11" />
  </S>
)

export const CloseBlockIcon = (p: P) => (
  <S {...p}>
    <path d="M22 52 L42 72 L80 28" {...stroke} stroke="currentColor" strokeWidth="13" />
  </S>
)

export const UndoIcon = (p: P) => (
  <S {...p}>
    <path d="M36 26 H88 V74 H36 L10 50Z" {...stroke} stroke="currentColor" strokeWidth="8" />
    <path d="M50 40 L70 60 M70 40 L50 60" {...stroke} stroke="currentColor" strokeWidth="8" />
  </S>
)

export const TrashIcon = (p: P) => (
  <S {...p}>
    <path d="M18 28 H82 M40 28 V16 H60 V28 M26 28 L32 86 H68 L74 28 M42 44 V70 M58 44 V70" {...stroke} stroke="currentColor" strokeWidth="8" />
  </S>
)

// ---------- Xaritadagi daraja belgilari ----------

const tile = { fill: '#fff', stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' } as const

export const ArrowsIcon = (p: P) => (
  <S {...p}>
    <rect x="12" y="12" width="76" height="76" rx="18" {...tile} fill="#5CC98B" />
    <path d="M30 50 H68 M52 32 L70 50 L52 68" {...stroke} stroke="#fff" strokeWidth="11" />
  </S>
)

export const RepeatIcon = (p: P) => (
  <S {...p}>
    <rect x="12" y="12" width="76" height="76" rx="18" {...tile} fill="#FFC94A" />
    <path d="M70 50 A20 20 0 1 1 60 33" {...stroke} strokeWidth="9" />
    <path d="M55 20 L64 35 L48 39" {...stroke} strokeWidth="9" />
  </S>
)

export const NestedIcon = (p: P) => (
  <S {...p}>
    <rect x="8" y="8" width="84" height="84" rx="20" {...tile} fill="#9B8AE6" />
    <rect x="24" y="24" width="52" height="52" rx="13" {...tile} fill="#FFC94A" />
    <rect x="38" y="38" width="24" height="24" rx="7" {...tile} />
  </S>
)

/** Yo'riqnoma yonidagi animatsiya: strelkalar ketma-ket yonadi. */
export function RobotDemo() {
  return (
    <div className="rb-demo" aria-hidden="true">
      {(['right', 'right', 'down'] as const).map((d, i) => (
        <span key={i} className="rb-demo-chip" style={{ animationDelay: `${i * 0.4}s` }}>
          <Arrow dir={d} />
        </span>
      ))}
    </div>
  )
}
