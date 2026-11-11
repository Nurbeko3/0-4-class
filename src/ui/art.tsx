// Barcha rasmlar lokal SVG (emoji yo'q — eski Windows'da har xil chiqadi).
// O'lcham font-size bilan boshqariladi: width/height = 1em.
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

// ---------- O'yin rasmlari ----------

export const Star = (p: P) => (
  <S {...p}>
    <polygon
      points="50,6 62,36 94,38 69,58 77,90 50,72 23,90 31,58 6,38 38,36"
      fill="#FFC94A"
      stroke="#E9A91F"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </S>
)

export const Cloud = (p: P) => (
  <S {...p}>
    <g fill="#fff" stroke="#BCD6EC" strokeWidth="3">
      <circle cx="32" cy="58" r="20" />
      <circle cx="54" cy="46" r="26" />
      <circle cx="74" cy="60" r="17" />
    </g>
    <rect x="30" y="54" width="46" height="23" fill="#fff" />
    <path d="M30 78 H76" stroke="#BCD6EC" strokeWidth="3" strokeLinecap="round" />
    <path d="M40 58 q5 5 10 0 M58 58 q5 5 10 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </S>
)

export const Balloon = ({ color = '#FF7A6B', ...p }: P & { color?: string }) => (
  <S {...p}>
    <path d="M50 84 q-7 8 0 15" fill="none" stroke="#8A97A6" strokeWidth="2.5" strokeLinecap="round" />
    <polygon points="50,74 43,85 57,85" fill={color} />
    <ellipse cx="50" cy="40" rx="30" ry="36" fill={color} />
    <ellipse cx="39" cy="26" rx="7" ry="11" fill="#fff" opacity="0.45" />
  </S>
)

export const Gift = ({ color = '#9B8AE6', ...p }: P & { color?: string }) => (
  <S {...p}>
    <rect x="18" y="46" width="64" height="46" rx="5" fill={color} />
    <rect x="12" y="30" width="76" height="19" rx="5" fill={color} stroke="#fff" strokeWidth="2" />
    <rect x="43" y="30" width="14" height="62" fill="#FFC94A" />
    <ellipse cx="38" cy="22" rx="12" ry="8" fill="#FFC94A" transform="rotate(-20 38 22)" />
    <ellipse cx="62" cy="22" rx="12" ry="8" fill="#FFC94A" transform="rotate(20 62 22)" />
    <circle cx="50" cy="27" r="6" fill="#E9A91F" />
  </S>
)

export const Lamp = ({ on = false, ...p }: P & { on?: boolean }) => (
  <S {...p}>
    {on && (
      <g stroke="#FFC94A" strokeWidth="5" strokeLinecap="round">
        <path d="M50 2 V9 M14 14 l5 5 M86 14 l-5 5 M3 44 H10 M90 44 H97" />
      </g>
    )}
    <path
      d="M50 14 a28 28 0 0 1 17 50 v6 H33 v-6 A28 28 0 0 1 50 14Z"
      fill={on ? '#FFD84A' : '#E6EBF0'}
      stroke={on ? '#E9A91F' : '#B4BFCA'}
      strokeWidth="3"
    />
    <rect x="35" y="72" width="30" height="8" rx="3" fill="#8A97A6" />
    <rect x="39" y="82" width="22" height="8" rx="4" fill="#6B7886" />
  </S>
)

export const Dog = (p: P) => (
  <S {...p}>
    <ellipse cx="20" cy="46" rx="11" ry="22" fill="#8A5A32" transform="rotate(12 20 46)" />
    <ellipse cx="80" cy="46" rx="11" ry="22" fill="#8A5A32" transform="rotate(-12 80 46)" />
    <circle cx="50" cy="52" r="32" fill="#C98B53" />
    <ellipse cx="50" cy="65" rx="17" ry="13" fill="#F0D5B3" />
    <circle cx="38" cy="46" r="4.5" fill={INK} />
    <circle cx="62" cy="46" r="4.5" fill={INK} />
    <ellipse cx="50" cy="59" rx="6" ry="4.5" fill={INK} />
    <path d="M43 68 q7 7 14 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </S>
)

export const Bird = (p: P) => (
  <S {...p}>
    <path d="M48 22 q-2 -12 6 -14 q-2 8 2 13" fill="#F5B82E" />
    <circle cx="50" cy="55" r="32" fill="#FFD34D" />
    <ellipse cx="26" cy="62" rx="10" ry="16" fill="#F5B82E" transform="rotate(20 26 62)" />
    <ellipse cx="74" cy="62" rx="10" ry="16" fill="#F5B82E" transform="rotate(-20 74 62)" />
    <circle cx="39" cy="46" r="4.5" fill={INK} />
    <circle cx="61" cy="46" r="4.5" fill={INK} />
    <polygon points="41,54 59,54 50,67" fill="#FF8A3D" />
  </S>
)

export const Fish = (p: P) => (
  <S {...p}>
    <polygon points="68,50 96,28 96,72" fill="#F26B3A" />
    <ellipse cx="44" cy="50" rx="34" ry="23" fill="#FF8A5B" />
    <path d="M44 28 q10 -14 22 -4 q-10 2 -12 8Z" fill="#F26B3A" />
    <circle cx="26" cy="44" r="6" fill="#fff" />
    <circle cx="25" cy="44" r="3" fill={INK} />
    <path d="M46 40 q8 10 0 20" fill="none" stroke="#F26B3A" strokeWidth="3" strokeLinecap="round" />
  </S>
)

export const Bee = (p: P) => (
  <S {...p}>
    <ellipse cx="38" cy="28" rx="13" ry="17" fill="#EAF6FF" stroke="#BCD6EC" strokeWidth="2" transform="rotate(-20 38 28)" />
    <ellipse cx="62" cy="28" rx="13" ry="17" fill="#EAF6FF" stroke="#BCD6EC" strokeWidth="2" transform="rotate(20 62 28)" />
    <ellipse cx="50" cy="58" rx="32" ry="23" fill="#FFD34D" />
    <path d="M48 37 V79 M64 40 V76" stroke="#4A3B2A" strokeWidth="8" strokeLinecap="round" />
    <circle cx="28" cy="54" r="4" fill={INK} />
    <path d="M24 64 q5 4 9 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
  </S>
)

export const Kennel = (p: P) => (
  <S {...p}>
    <rect x="16" y="44" width="68" height="48" fill="#EBC084" />
    <polygon points="50,8 94,46 6,46" fill="#E5604F" />
    <path d="M35 92 V68 a15 15 0 0 1 30 0 V92Z" fill="#6B4A2E" />
    <path d="M42 30 h16 M42 30 a3 3 0 1 1 0 -0.1 M58 30 a3 3 0 1 0 0 -0.1" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
  </S>
)

export const Nest = (p: P) => (
  <S {...p}>
    <ellipse cx="36" cy="46" rx="10" ry="13" fill="#DFF1FB" stroke="#A9CDE4" strokeWidth="2" />
    <ellipse cx="54" cy="42" rx="10" ry="13" fill="#DFF1FB" stroke="#A9CDE4" strokeWidth="2" />
    <ellipse cx="68" cy="48" rx="9" ry="12" fill="#DFF1FB" stroke="#A9CDE4" strokeWidth="2" />
    <path d="M6 50 Q50 104 94 50 Q50 64 6 50Z" fill="#A8743F" />
    <path d="M16 60 q20 10 34 6 M40 78 q20 2 36 -14 M28 70 q10 4 22 2" fill="none" stroke="#7A5128" strokeWidth="3" strokeLinecap="round" />
  </S>
)

export const Bowl = (p: P) => (
  <S {...p}>
    <circle cx="50" cy="56" r="38" fill="#DDF2FC" stroke="#8CC9EA" strokeWidth="4" />
    <path d="M15 44 q17 -8 35 0 t35 0 A38 38 0 0 1 15 44Z" fill="#8FD0F2" />
    <path d="M36 92 q-4 -14 2 -24 M44 93 q4 -10 0 -18" fill="none" stroke="#4FB07A" strokeWidth="4" strokeLinecap="round" />
    <rect x="30" y="12" width="40" height="9" rx="4.5" fill="#8CC9EA" />
  </S>
)

export const Hive = (p: P) => (
  <S {...p}>
    <g fill="#F2B544" stroke="#C98A1B" strokeWidth="3">
      <ellipse cx="50" cy="22" rx="17" ry="11" />
      <ellipse cx="50" cy="39" rx="28" ry="12" />
      <ellipse cx="50" cy="57" rx="35" ry="13" />
      <ellipse cx="50" cy="76" rx="31" ry="13" />
    </g>
    <circle cx="50" cy="72" r="9" fill="#5A3E1B" />
  </S>
)

export const Chest = ({ open = false, ...p }: P & { open?: boolean }) => (
  <S {...p}>
    {open && (
      <g fill="#FFC94A" stroke="#E9A91F" strokeWidth="2">
        <circle cx="34" cy="42" r="9" />
        <circle cx="50" cy="36" r="10" />
        <circle cx="66" cy="42" r="9" />
      </g>
    )}
    <path
      d="M14 48 Q14 22 50 22 Q86 22 86 48Z"
      fill="#D08A45"
      stroke="#8A5A2B"
      strokeWidth="3"
      transform={open ? 'translate(0 -22) rotate(-12 50 30)' : undefined}
    />
    <rect x="14" y="48" width="72" height="40" rx="5" fill="#B9763A" stroke="#8A5A2B" strokeWidth="3" />
    <rect x="43" y="48" width="14" height="18" rx="3" fill="#FFC94A" stroke="#E9A91F" strokeWidth="2" />
  </S>
)

export const Sun = (p: P) => (
  <S {...p}>
    <g stroke="#FFC94A" strokeWidth="7" strokeLinecap="round">
      <path d="M50 4 V16 M50 84 V96 M4 50 H16 M84 50 H96 M17 17 l9 9 M74 74 l9 9 M83 17 l-9 9 M26 74 l-9 9" />
    </g>
    <circle cx="50" cy="50" r="26" fill="#FFD84A" stroke="#E9A91F" strokeWidth="3" />
    <circle cx="41" cy="46" r="3.5" fill={INK} />
    <circle cx="59" cy="46" r="3.5" fill={INK} />
    <path d="M40 56 q10 9 20 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </S>
)

// ---------- Mavzu ikonkalari ----------

const line = { fill: 'none', stroke: INK, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const MouseIcon = (p: P) => (
  <S {...p}>
    <rect x="28" y="10" width="44" height="80" rx="22" {...line} fill="#fff" />
    <path d="M28 44 H72 M50 10 V44" {...line} />
    <rect x="45" y="20" width="10" height="16" rx="5" fill="#2BB3A3" />
  </S>
)

export const KeyboardIcon = (p: P) => (
  <S {...p}>
    <rect x="6" y="26" width="88" height="50" rx="9" {...line} fill="#fff" />
    <g fill="#6CB8F0">
      {[18, 34, 50, 66].map((x) => (
        <rect key={x} x={x} y="36" width="12" height="10" rx="2.5" />
      ))}
      {[26, 42, 58].map((x) => (
        <rect key={x} x={x} y="50" width="12" height="10" rx="2.5" />
      ))}
    </g>
    <rect x="28" y="63" width="44" height="7" rx="3" fill="#FFC94A" />
  </S>
)

export const MonitorIcon = (p: P) => (
  <S {...p}>
    <rect x="10" y="14" width="80" height="56" rx="7" {...line} fill="#fff" />
    <rect x="18" y="22" width="64" height="40" rx="3" fill="#BFE6FA" />
    <path d="M50 70 V84 M30 86 H70" {...line} />
  </S>
)

export const FolderIcon = (p: P) => (
  <S {...p}>
    <path d="M8 28 a6 6 0 0 1 6 -6 h22 l9 10 h41 a6 6 0 0 1 6 6 v38 a6 6 0 0 1 -6 6 H14 a6 6 0 0 1 -6 -6Z" fill="#FFC94A" stroke="#E9A91F" strokeWidth="4" strokeLinejoin="round" />
  </S>
)

export const BrushIcon = (p: P) => (
  <S {...p}>
    <path d="M86 12 L44 56" stroke="#B9763A" strokeWidth="9" strokeLinecap="round" />
    <path d="M46 52 q12 2 10 14 q-8 22 -42 20 q14 -8 14 -20 q2 -14 18 -14Z" fill="#FF7A6B" />
  </S>
)

export const RobotIcon = (p: P) => (
  <S {...p}>
    <path d="M50 8 V22" {...line} />
    <circle cx="50" cy="8" r="5" fill="#FF7A6B" />
    <rect x="16" y="22" width="68" height="52" rx="12" {...line} fill="#fff" />
    <circle cx="36" cy="44" r="7" fill="#2BB3A3" />
    <circle cx="64" cy="44" r="7" fill="#2BB3A3" />
    <path d="M36 60 H64 M30 74 V90 M70 74 V90" {...line} />
  </S>
)

export const ShieldIcon = (p: P) => (
  <S {...p}>
    <path d="M50 8 L86 20 V48 Q86 78 50 92 Q14 78 14 48 V20Z" fill="#BFEBD9" stroke="#2BB3A3" strokeWidth="5" strokeLinejoin="round" />
    <path d="M34 50 L46 62 L68 38" fill="none" stroke="#2BB3A3" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </S>
)

// ---------- Interfeys ikonkalari (rangi currentColor) ----------

const ui = { fill: 'none', stroke: 'currentColor', strokeWidth: 11, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const BackIcon = (p: P) => (
  <S {...p}>
    <path d="M58 20 L28 50 L58 80" {...ui} />
  </S>
)

export const NextIcon = (p: P) => (
  <S {...p}>
    <path d="M42 20 L72 50 L42 80" {...ui} />
  </S>
)

export const HomeIcon = (p: P) => (
  <S {...p}>
    <path d="M14 50 L50 16 L86 50 M24 44 V84 H76 V44" {...ui} strokeWidth={9} />
  </S>
)

export const ReplayIcon = (p: P) => (
  <S {...p}>
    <path d="M78 50 a28 28 0 1 1 -9 -20 M70 12 V32 H50" {...ui} strokeWidth={9} />
  </S>
)

export const SpeakerIcon = (p: P) => (
  <S {...p}>
    <path d="M14 40 H30 L50 22 V78 L30 60 H14Z" fill="currentColor" />
    <path d="M62 36 q10 14 0 28 M72 24 q20 26 0 52" {...ui} strokeWidth={7} />
  </S>
)

export const LockIcon = (p: P) => (
  <S {...p}>
    <path d="M32 46 V32 a18 18 0 0 1 36 0 V46" {...ui} strokeWidth={9} />
    <rect x="20" y="46" width="60" height="44" rx="9" fill="currentColor" />
  </S>
)

export const GridIcon = (p: P) => (
  <S {...p}>
    <g fill="currentColor">
      <rect x="14" y="14" width="30" height="30" rx="7" />
      <rect x="56" y="14" width="30" height="30" rx="7" />
      <rect x="14" y="56" width="30" height="30" rx="7" />
      <rect x="56" y="56" width="30" height="30" rx="7" />
    </g>
  </S>
)
