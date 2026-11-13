// Tezkor tugmalar moduli rasmlari (lokal SVG, o'lcham font-size bilan: 1em).
import type { ReactNode } from 'react'
import './shortcuts.css'

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

const cap = { fill: '#fff', stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' } as const
const glyph = { fill: INK, fontWeight: 900, textAnchor: 'middle', fontFamily: 'inherit' } as const
const line = { fill: 'none', stroke: INK, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

// ---------- Xaritadagi belgilar ----------

/** Mavzu belgisi: Ctrl tugmasi. */
export const KeysIcon = (p: P) => (
  <S {...p}>
    <rect x="8" y="30" width="84" height="52" rx="14" fill="#5CC98B" stroke={INK} strokeWidth="5" />
    <rect x="8" y="20" width="84" height="52" rx="14" {...cap} />
    <text x="50" y="56" fontSize="28" {...glyph}>
      Ctrl
    </text>
  </S>
)

export const CopyIcon = (p: P) => (
  <S {...p}>
    <rect x="14" y="12" width="50" height="60" rx="8" fill="#DCE8FA" stroke={INK} strokeWidth="5" />
    <rect x="36" y="30" width="50" height="60" rx="8" {...cap} />
    <path d="M48 50 H74 M48 64 H74 M48 78 H64" fill="none" stroke="#6CB8F0" strokeWidth="6" strokeLinecap="round" />
  </S>
)

export const CutIcon = (p: P) => (
  <S {...p}>
    <path d="M30 14 L62 62 M70 14 L38 62" {...line} strokeWidth="7" />
    <circle cx="30" cy="76" r="13" fill="#FF7A6B" stroke={INK} strokeWidth="5" />
    <circle cx="70" cy="76" r="13" fill="#FF7A6B" stroke={INK} strokeWidth="5" />
    <circle cx="50" cy="44" r="4" fill={INK} />
  </S>
)

export const UndoIcon = (p: P) => (
  <S {...p}>
    <path d="M30 40 H60 A22 22 0 0 1 60 84 H36" fill="none" stroke="#9B8AE6" strokeWidth="12" strokeLinecap="round" />
    <path d="M40 18 L16 40 L40 62Z" fill="#9B8AE6" stroke="#9B8AE6" strokeWidth="6" strokeLinejoin="round" />
  </S>
)

export const Disk = (p: P) => (
  <S {...p}>
    <path d="M12 12 H74 L88 26 V88 H12Z" fill="#6CB8F0" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <rect x="28" y="12" width="38" height="24" fill="#fff" stroke={INK} strokeWidth="4" />
    <rect x="52" y="16" width="8" height="15" fill={INK} />
    <rect x="24" y="52" width="52" height="36" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
    <path d="M34 64 H66 M34 76 H58" fill="none" stroke="#B9C4D8" strokeWidth="5" strokeLinecap="round" />
  </S>
)

export function SaveIcon(p: P) {
  return <Disk {...p} />
}

// ---------- O'yin rasmlari ----------

export const Flower = (p: P) => (
  <S {...p}>
    <path d="M50 58 V94 M50 80 q-16 -2 -18 -16 M50 86 q16 -2 18 -14" fill="none" stroke="#2F9460" strokeWidth="6" strokeLinecap="round" />
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="50" cy="20" rx="12" ry="16" fill="#FF7A6B" stroke={INK} strokeWidth="3" transform={`rotate(${a} 50 40)`} />
    ))}
    <circle cx="50" cy="40" r="11" fill="#FFC94A" stroke={INK} strokeWidth="3" />
  </S>
)

export const Butterfly = (p: P) => (
  <S {...p}>
    <path d="M50 50 C30 10 4 22 12 46 C16 58 34 56 50 50Z" fill="#9B8AE6" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 50 C70 10 96 22 88 46 C84 58 66 56 50 50Z" fill="#9B8AE6" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 52 C34 58 20 70 30 82 C40 92 48 70 50 56Z" fill="#6CB8F0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 52 C66 58 80 70 70 82 C60 92 52 70 50 56Z" fill="#6CB8F0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <ellipse cx="50" cy="54" rx="5" ry="22" fill={INK} />
    <path d="M48 34 Q42 20 36 20 M52 34 Q58 20 64 20" {...line} strokeWidth="3" />
  </S>
)

export const Fish = (p: P) => (
  <S {...p}>
    <path d="M70 50 L94 30 V70Z" fill="#F5AB1F" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <ellipse cx="44" cy="50" rx="36" ry="24" fill="#FFC94A" stroke={INK} strokeWidth="4" />
    <path d="M44 28 q8 -14 20 -6" fill="#F5AB1F" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="26" cy="44" r="5" fill={INK} />
    <path d="M16 58 q6 5 12 0" {...line} strokeWidth="3" />
    <path d="M50 40 q8 10 0 20" {...line} strokeWidth="3" />
  </S>
)

export const Bird = (p: P) => (
  <S {...p}>
    <ellipse cx="50" cy="58" rx="32" ry="26" fill="#6CB8F0" stroke={INK} strokeWidth="4" />
    <circle cx="34" cy="34" r="19" fill="#6CB8F0" stroke={INK} strokeWidth="4" />
    <polygon points="16,32 2,38 17,42" fill="#F5AB1F" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="30" cy="30" r="4.5" fill={INK} />
    <path d="M48 56 q18 -10 26 8 q-16 10 -26 -8Z" fill="#4AA3E3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <path d="M44 84 V94 M58 84 V94" {...line} strokeWidth="4" />
  </S>
)

export const Car = (p: P) => (
  <S {...p}>
    <path d="M10 66 V50 q0 -6 8 -7 l10 -3 q10 -18 26 -18 h10 q14 0 22 20 q8 2 8 10 v12Z" fill="#FF7A6B" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M36 40 q6 -10 16 -10 v10Z M58 30 h6 q8 0 13 10 h-19Z" fill="#DCF0FF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="30" cy="68" r="11" fill={INK} />
    <circle cx="30" cy="68" r="4" fill="#fff" />
    <circle cx="72" cy="68" r="11" fill={INK} />
    <circle cx="72" cy="68" r="4" fill="#fff" />
  </S>
)

export const Pond = (p: P) => (
  <S {...p}>
    <ellipse cx="50" cy="62" rx="46" ry="28" fill="#8FD0F7" stroke="#4AA3E3" strokeWidth="4" />
    <path d="M22 60 q6 -5 12 0 t12 0 M54 72 q6 -5 12 0 t12 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    <path d="M84 50 V20 M92 54 V30" fill="none" stroke="#2F9460" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="84" cy="18" rx="4" ry="9" fill="#B5764A" />
    <ellipse cx="92" cy="28" rx="4" ry="9" fill="#B5764A" />
  </S>
)

export const Nest = (p: P) => (
  <S {...p}>
    <path d="M4 74 H96" fill="none" stroke="#8A5A36" strokeWidth="9" strokeLinecap="round" />
    <path d="M80 74 q8 -16 14 -20" fill="none" stroke="#8A5A36" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="90" cy="50" rx="8" ry="5" fill="#5CC98B" stroke="#2F9460" strokeWidth="3" transform="rotate(-30 90 50)" />
    <path d="M14 46 H80 q-2 30 -33 30 q-31 0 -33 -30Z" fill="#C98B5C" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M22 56 q12 6 24 0 M48 62 q12 6 24 -2 M30 68 q10 4 20 0" fill="none" stroke="#8A5A36" strokeWidth="3" strokeLinecap="round" />
  </S>
)

export const Garage = (p: P) => (
  <S {...p}>
    <path d="M8 46 L50 16 L92 46 V90 H8Z" fill="#DCE1EA" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M4 48 L50 14 L96 48" fill="none" stroke="#9B8AE6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="24" y="54" width="52" height="36" fill="#66758A" stroke={INK} strokeWidth="4" />
    <path d="M24 66 H76 M24 78 H76" fill="none" stroke="#8A97A6" strokeWidth="3" />
  </S>
)

/** Siyoh dog'i. */
export const Blot = ({ color = '#2D3A4A', ...p }: P & { color?: string }) => (
  <S {...p}>
    <path
      d="M50 10 q10 14 22 8 q14 -2 10 14 q-2 10 10 16 q8 12 -8 16 q-10 4 -6 14 q0 14 -16 8 q-10 -4 -16 6 q-12 8 -16 -6 q-2 -10 -14 -10 q-12 -6 -2 -18 q6 -8 -2 -16 q-4 -14 12 -12 q12 0 14 -12 q6 -12 12 -8Z"
      fill={color}
    />
    <ellipse cx="38" cy="36" rx="7" ry="4" fill="#fff" opacity="0.35" transform="rotate(-30 38 36)" />
  </S>
)

/** «Ortga qaytar» darajasidagi rasm: uy, quyosh va daraxt. */
export const Picture = ({ className }: P) => (
  <svg className={className} viewBox="0 0 200 130" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect width="200" height="130" fill="#DDF1FF" />
    <rect y="96" width="200" height="34" fill="#9BDDB2" />
    <circle cx="166" cy="28" r="15" fill="#FFC94A" stroke="#E9A91F" strokeWidth="3" />
    <g fill="#fff">
      <ellipse cx="46" cy="26" rx="20" ry="9" />
      <ellipse cx="60" cy="20" rx="13" ry="8" />
    </g>
    <rect x="70" y="60" width="60" height="44" fill="#FFF3CF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <path d="M62 62 L100 32 L138 62Z" fill="#FF7A6B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <rect x="92" y="78" width="16" height="26" fill="#C98B5C" stroke={INK} strokeWidth="3" />
    <rect x="76" y="68" width="12" height="12" fill="#8FD0F7" stroke={INK} strokeWidth="2.5" />
    <rect x="112" y="68" width="12" height="12" fill="#8FD0F7" stroke={INK} strokeWidth="2.5" />
    <rect x="28" y="78" width="7" height="26" fill="#8A5A36" />
    <circle cx="31" cy="68" r="17" fill="#5CC98B" stroke="#2F9460" strokeWidth="3" />
  </svg>
)

// ---------- Yo'riqnoma yonidagi animatsiya: Ctrl + harf ----------

function Demo({ letter }: { letter: string }) {
  return (
    <div className="ks-demo" aria-hidden="true">
      <span className="ks-demo-cap ks-demo-ctrl">Ctrl</span>
      <span className="ks-demo-cap ks-demo-letter">{letter}</span>
    </div>
  )
}

export function CopyDemo() {
  return <Demo letter="C" />
}

export function CutDemo() {
  return <Demo letter="X" />
}

export function UndoDemo() {
  return <Demo letter="Z" />
}

export function SaveDemo() {
  return <Demo letter="S" />
}
