// Klaviatura moduli rasmlari (lokal SVG, o'lcham font-size bilan: 1em).
import type { ReactNode } from 'react'
import './keyboard.css'

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

/** Xaritadagi daraja belgisi: bitta harfli tugma. */
export const keyIcon = (label: string, color = '#6CB8F0') =>
  function KeyIcon(p: P) {
    return (
      <S {...p}>
        <rect x="14" y="20" width="72" height="68" rx="14" fill={color} stroke={INK} strokeWidth="5" />
        <rect x="14" y="12" width="72" height="64" rx="14" {...cap} />
        <text x="50" y="60" fontSize="44" {...glyph}>
          {label}
        </text>
      </S>
    )
  }

/** Xaritadagi daraja belgisi: uchta kichik tugma — so'z. */
export const wordIcon = (abc: string) =>
  function WordIcon(p: P) {
    return (
      <S {...p}>
        {[...abc].slice(0, 3).map((ch, i) => (
          <g key={i} transform={`translate(${4 + i * 31} ${i === 1 ? 26 : 36})`}>
            <rect width="30" height="34" rx="7" fill={['#FFC94A', '#5CC98B', '#FF7A6B'][i]} stroke={INK} strokeWidth="4" />
            <text x="15" y="25" fontSize="22" {...glyph}>
              {ch}
            </text>
          </g>
        ))}
      </S>
    )
  }

/** Xaritadagi daraja belgisi: Enter tugmasi. */
export const EnterIcon = (p: P) => (
  <S {...p}>
    <path d="M40 20 H86 V84 H14 V52 H40Z" fill="#9B8AE6" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <path d="M40 12 H86 V74 H14 V44 H40Z" {...cap} />
    <path d="M70 28 V52 H36 M46 42 L36 52 L46 62" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </S>
)

export const Frog = (p: P) => (
  <S {...p}>
    <ellipse cx="50" cy="64" rx="34" ry="26" fill="#5CC98B" stroke={INK} strokeWidth="4" />
    <circle cx="32" cy="34" r="14" fill="#5CC98B" stroke={INK} strokeWidth="4" />
    <circle cx="68" cy="34" r="14" fill="#5CC98B" stroke={INK} strokeWidth="4" />
    <circle cx="32" cy="34" r="6" fill={INK} />
    <circle cx="68" cy="34" r="6" fill={INK} />
    <path d="M36 66 Q50 78 64 66" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="50" cy="74" rx="16" ry="9" fill="#DFF6E6" opacity="0.7" />
  </S>
)

export const Pad = (p: P) => (
  <S {...p}>
    <path d="M50 50 L92 38 A44 22 0 1 1 78 26Z" fill="#45B97C" stroke="#2F9460" strokeWidth="4" strokeLinejoin="round" />
  </S>
)

export const Door = ({ open = false, ...p }: P & { open?: boolean }) => (
  <S {...p}>
    <rect x="20" y="8" width="60" height="86" rx="8" fill={open ? '#FFF3CF' : '#C98B5C'} stroke={INK} strokeWidth="5" />
    {open ? (
      <polygon points="50,24 57,42 76,43 61,55 66,74 50,63 34,74 39,55 24,43 43,42" fill="#FFC94A" stroke="#E9A91F" strokeWidth="3" strokeLinejoin="round" />
    ) : (
      <>
        <rect x="30" y="18" width="40" height="28" rx="5" fill="#B5764A" />
        <rect x="30" y="54" width="40" height="30" rx="5" fill="#B5764A" />
        <circle cx="68" cy="50" r="5" fill="#FFC94A" stroke={INK} strokeWidth="3" />
      </>
    )}
  </S>
)

/** Yo'riqnoma yonidagi animatsiya: bosilayotgan tugma. */
export const keyDemo = (label: string, wide = false) =>
  function KeyDemo() {
    return (
      <div className="kbd-demo" aria-hidden="true">
        <span className={`kbd-demo-cap ${wide ? 'kbd-demo-wide' : ''}`}>{label}</span>
      </div>
    )
  }
