// Ish stoli simulyatori rasmlari (lokal SVG, o'lcham font-size bilan: 1em).
import type { ReactNode } from 'react'

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

export const FolderArt = (p: P) => (
  <S {...p}>
    <path d="M8 26 a6 6 0 0 1 6 -6 h22 l9 10 h41 a6 6 0 0 1 6 6 v6 H8Z" fill="#E9A91F" />
    <rect x="8" y="34" width="84" height="50" rx="7" fill="#FFC94A" />
  </S>
)

export const FileArt = (p: P) => (
  <S {...p}>
    <path d="M24 8 H60 L78 26 V88 a4 4 0 0 1 -4 4 H24 a4 4 0 0 1 -4 -4 V12 a4 4 0 0 1 4 -4Z" fill="#fff" stroke="#8A97A6" strokeWidth="4" strokeLinejoin="round" />
    <path d="M60 8 V26 H78" fill="#DDE3EA" stroke="#8A97A6" strokeWidth="4" strokeLinejoin="round" />
    <path d="M32 44 H66 M32 56 H66 M32 68 H54" stroke="#6CB8F0" strokeWidth="5" strokeLinecap="round" />
  </S>
)

export const PicArt = (p: P) => (
  <S {...p}>
    <rect x="12" y="16" width="76" height="68" rx="7" fill="#fff" stroke="#8A97A6" strokeWidth="4" />
    <rect x="20" y="24" width="60" height="52" rx="3" fill="#BFE6FA" />
    <circle cx="66" cy="38" r="7" fill="#FFC94A" />
    <path d="M20 76 V62 q12 -14 24 -2 q10 -10 20 0 q8 -6 16 2 V73 a3 3 0 0 1 -3 3Z" fill="#5CC98B" />
  </S>
)

/** Keraksiz g'ijimlangan qog'oz */
export const JunkArt = (p: P) => (
  <S {...p}>
    <path d="M30 20 L52 12 L74 22 L86 44 L78 70 L56 86 L30 80 L14 58 L18 34Z" fill="#E6EBF0" stroke="#8A97A6" strokeWidth="4" strokeLinejoin="round" />
    <path d="M30 20 L44 44 L18 34 M44 44 L74 22 M44 44 L56 86 M44 44 L78 70 M44 44 L14 58" fill="none" stroke="#A9B4C0" strokeWidth="3" strokeLinejoin="round" />
  </S>
)

export const TrashArt = ({ full = false, ...p }: P & { full?: boolean }) => (
  <S {...p}>
    {full && <path d="M30 30 L40 14 L52 22 L62 12 L72 30Z" fill="#E6EBF0" stroke="#8A97A6" strokeWidth="3" strokeLinejoin="round" />}
    <path d="M24 34 H76 L70 88 a5 5 0 0 1 -5 4 H35 a5 5 0 0 1 -5 -4Z" fill="#8FD0F2" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M40 46 L42 80 M50 46 V80 M60 46 L58 80" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <rect x="16" y="26" width="68" height="10" rx="5" fill="#6CB8F0" stroke={INK} strokeWidth="4" />
  </S>
)

/** Xaritadagi "oyna" darajasi belgisi */
export const WindowIcon = (p: P) => (
  <S {...p}>
    <rect x="8" y="16" width="84" height="68" rx="8" fill="#fff" stroke={INK} strokeWidth="5" />
    <path d="M8 34 H92" stroke={INK} strokeWidth="5" />
    <path d="M10.5 24 a5.5 5.5 0 0 1 5.5 -5.5 h68 a5.5 5.5 0 0 1 5.5 5.5 v7.5 h-79Z" fill="#6CB8F0" />
    <circle cx="80" cy="25" r="4" fill="#FF7A6B" />
    <circle cx="68" cy="25" r="4" fill="#FFC94A" />
    <path d="M20 48 a3 3 0 0 1 3 -3 h10 l4 5 h18 a3 3 0 0 1 3 3 v17 a3 3 0 0 1 -3 3 H23 a3 3 0 0 1 -3 -3Z" fill="#FFC94A" />
  </S>
)
