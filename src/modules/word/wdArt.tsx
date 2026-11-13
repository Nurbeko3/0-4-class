// Matn muharriri moduli rasmlari (lokal SVG, o'lcham font-size bilan: 1em).
import type { ReactNode } from 'react'
import './word.css'

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

const sheet = { fill: '#fff', stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' } as const
const rule = { fill: 'none', stroke: '#B9C4D8', strokeWidth: 6, strokeLinecap: 'round' } as const
const glyph = { fill: INK, fontWeight: 900, textAnchor: 'middle', fontFamily: 'inherit' } as const

/** Mavzu belgisi: «A» harfli varaq. */
export const WordIcon = (p: P) => (
  <S {...p}>
    <path d="M22 8 H64 L82 26 V92 H22Z" {...sheet} />
    <path d="M64 8 V26 H82" fill="#DCE8FA" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <text x="46" y="58" fontSize="40" {...glyph} fill="#4AA3E3">
      A
    </text>
    <path d="M34 70 H70 M34 82 H58" {...rule} />
  </S>
)

/** Daraja belgisi: qalin harf va rang chizig'i. */
export const FormatIcon = (p: P) => (
  <S {...p}>
    <rect x="12" y="12" width="76" height="76" rx="16" {...sheet} />
    <text x="50" y="62" fontSize="54" {...glyph}>
      A
    </text>
    <rect x="26" y="70" width="48" height="10" rx="5" fill="#FF7A6B" />
  </S>
)

/** Daraja belgisi: o'rtaga tekislangan qatorlar. */
export const AlignIcon = (p: P) => (
  <S {...p}>
    <rect x="12" y="12" width="76" height="76" rx="16" {...sheet} />
    <path d="M30 32 H70 M38 46 H62 M26 60 H74 M40 74 H60" fill="none" stroke="#9B8AE6" strokeWidth="7" strokeLinecap="round" />
  </S>
)

/** Daraja belgisi: bezatilgan taklifnoma. */
export const PosterIcon = (p: P) => (
  <S {...p}>
    <rect x="16" y="8" width="68" height="84" rx="8" {...sheet} />
    <polygon points="50,18 55,29 67,30 58,38 61,50 50,43 39,50 42,38 33,30 45,29" fill="#FFC94A" stroke="#E9A91F" strokeWidth="3" strokeLinejoin="round" />
    <path d="M30 62 H70" fill="none" stroke="#FF7A6B" strokeWidth="7" strokeLinecap="round" />
    <path d="M36 76 H64" {...rule} />
  </S>
)

/** Bajarilgan qator belgisi. */
export const Tick = (p: P) => (
  <S {...p}>
    <circle cx="50" cy="50" r="44" fill="#5CC98B" stroke="#2F9460" strokeWidth="5" />
    <path d="M30 52 L45 66 L71 36" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
  </S>
)

/** Tekislash tugmasi belgisi. */
export const AlignGlyph = ({ align, ...p }: P & { align: 'left' | 'center' | 'right' }) => {
  const x = (w: number) => (align === 'left' ? 16 : align === 'right' ? 84 - w : 50 - w / 2)
  return (
    <S {...p}>
      {[68, 44, 68, 36].map((w, i) => (
        <rect key={i} x={x(w)} y={16 + i * 19} width={w} height="10" rx="5" fill={INK} />
      ))}
    </S>
  )
}

/** Yo'riqnoma yonidagi animatsiya: harf bezaladi. */
export function WordDemo() {
  return (
    <div className="wd-demo" aria-hidden="true">
      <span className="wd-demo-a">A</span>
    </div>
  )
}
