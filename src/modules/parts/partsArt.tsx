// Kompyuter qismlari rasmlari (lokal SVG). Hammasi 120x100 ramkada — kartalarda bir xil turadi.
import type { ReactNode } from 'react'

const INK = '#2D3A4A'

interface P {
  className?: string
}

function S({ className, children }: P & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 120 100" aria-hidden="true">
      {children}
    </svg>
  )
}

export const MonitorArt = (p: P) => (
  <S {...p}>
    <rect x="54" y="62" width="12" height="18" fill="#8A97A6" />
    <rect x="36" y="80" width="48" height="8" rx="4" fill="#6B7886" />
    <rect x="16" y="6" width="88" height="60" rx="7" fill="#3A4A5E" />
    <rect x="22" y="12" width="76" height="48" rx="3" fill="#BFE6FA" />
    <circle cx="82" cy="26" r="7" fill="#FFC94A" />
    <path d="M22 60 V48 q14 -16 30 -4 q12 -12 24 -2 q12 -6 22 4 V57 a3 3 0 0 1 -3 3Z" fill="#5CC98B" />
  </S>
)

export const UnitArt = (p: P) => (
  <S {...p}>
    <rect x="38" y="4" width="44" height="92" rx="7" fill="#5B6B80" />
    <rect x="44" y="11" width="32" height="9" rx="2" fill="#8E9DB1" />
    <rect x="44" y="24" width="32" height="9" rx="2" fill="#8E9DB1" />
    <circle cx="60" cy="50" r="8" fill="#3A4A5E" />
    <circle cx="60" cy="50" r="4.5" fill="#2BB3A3" />
    <circle cx="48" cy="66" r="2.5" fill="#FFC94A" />
    <circle cx="56" cy="66" r="2.5" fill="#5CC98B" />
    <path d="M46 78 H74 M46 84 H74 M46 90 H74" stroke="#3A4A5E" strokeWidth="3" strokeLinecap="round" />
  </S>
)

export const KeyboardArt = (p: P) => (
  <S {...p}>
    <rect x="4" y="28" width="112" height="48" rx="8" fill="#DDE3EA" stroke="#8A97A6" strokeWidth="3" />
    <g fill="#fff" stroke="#A9B4C0" strokeWidth="1.2">
      {[0, 1, 2].flatMap((row) =>
        Array.from({ length: 11 - row }, (_, i) => (
          <rect key={`${row}-${i}`} x={10 + row * 4.5 + i * 9.2} y={34 + row * 10} width="7.4" height="7.6" rx="1.6" />
        )),
      )}
      <rect x="34" y="64" width="52" height="7" rx="2" />
    </g>
  </S>
)

export const MouseArt = (p: P) => (
  <S {...p}>
    <path d="M60 18 q0 -12 16 -12 h18" fill="none" stroke="#8A97A6" strokeWidth="3.5" strokeLinecap="round" />
    <rect x="40" y="18" width="40" height="72" rx="20" fill="#fff" stroke={INK} strokeWidth="4" />
    <path d="M40 46 H80 M60 18 V46" stroke={INK} strokeWidth="4" />
    <rect x="55.5" y="26" width="9" height="14" rx="4.5" fill="#2BB3A3" />
  </S>
)

export const SpeakerArt = (p: P) => (
  <S {...p}>
    <rect x="36" y="6" width="48" height="88" rx="9" fill="#4A586B" />
    <circle cx="60" cy="30" r="10" fill="#8E9DB1" />
    <circle cx="60" cy="30" r="4" fill="#3A4A5E" />
    <circle cx="60" cy="66" r="18" fill="#8E9DB1" />
    <circle cx="60" cy="66" r="8" fill="#3A4A5E" />
    <path d="M92 20 q8 10 0 20 M100 12 q14 18 0 36" fill="none" stroke="#FFC94A" strokeWidth="4" strokeLinecap="round" />
  </S>
)

export const PrinterArt = (p: P) => (
  <S {...p}>
    <rect x="36" y="4" width="48" height="34" rx="3" fill="#fff" stroke="#A9B4C0" strokeWidth="3" />
    <rect x="12" y="32" width="96" height="40" rx="9" fill="#8A97A6" />
    <circle cx="96" cy="44" r="3.5" fill="#5CC98B" />
    <rect x="28" y="58" width="64" height="36" rx="3" fill="#fff" stroke="#A9B4C0" strokeWidth="3" />
    <path d="M38 70 H82 M38 78 H82 M38 86 H66" stroke="#6CB8F0" strokeWidth="3.5" strokeLinecap="round" />
  </S>
)

/** Xaritadagi "nomlar" darajasi belgisi: yorliq */
export const TagIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
    <path d="M10 34 a8 8 0 0 1 8 -8 h44 l28 24 l-28 24 h-44 a8 8 0 0 1 -8 -8Z" fill="#9B8AE6" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <path d="M24 44 H52 M24 56 H44" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    <circle cx="68" cy="50" r="5" fill="#fff" />
  </svg>
)

/** Xaritadagi "vazifasi" darajasi belgisi: savol belgisi */
export const UseIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
    <circle cx="50" cy="50" r="40" fill="#FFC94A" stroke={INK} strokeWidth="5" />
    <path d="M38 40 a12 12 0 1 1 18 10 q-6 4 -6 10" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
    <circle cx="50" cy="72" r="4.5" fill={INK} />
  </svg>
)

/** Xaritadagi "rasmini top" darajasi belgisi */
export const MatchIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 120 100" width="1em" height="1em" aria-hidden="true">
    <rect x="54" y="62" width="12" height="18" fill="#8A97A6" />
    <rect x="36" y="80" width="48" height="8" rx="4" fill="#6B7886" />
    <rect x="16" y="6" width="88" height="60" rx="7" fill="#3A4A5E" />
    <rect x="22" y="12" width="76" height="48" rx="3" fill="#BFE6FA" />
    <polygon points="60,20 64,31 76,31 66,38 70,50 60,43 50,50 54,38 44,31 56,31" fill="#FFC94A" />
  </svg>
)
