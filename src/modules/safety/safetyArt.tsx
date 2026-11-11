// Internet xavfsizligi rasmlari: har vaziyat — "ekran" ichidagi oddiy sahna (lokal SVG).
import type { ReactNode } from 'react'
import type { ScenarioId } from './scenarios'

const INK = '#2D3A4A'
const ln = { fill: 'none', stroke: INK, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

// Bolaning yuzi (xotirjam yoki charchagan)
const Kid = ({ x, y, tired = false }: { x: number; y: number; tired?: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r="20" fill="#FFD9B8" stroke={INK} strokeWidth="4" />
    <path d="M-20 -4 Q-16 -24 0 -22 Q16 -24 20 -4 Q8 -12 0 -10 Q-8 -12 -20 -4Z" fill="#8A5A3C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    {tired ? (
      <path d="M-11 2 H-4 M4 2 H11 M-7 12 Q0 8 7 12" {...ln} strokeWidth="3" />
    ) : (
      <>
        <circle cx="-7" cy="2" r="2.6" fill={INK} />
        <circle cx="7" cy="2" r="2.6" fill={INK} />
        <path d="M-6 10 Q0 15 6 10" {...ln} strokeWidth="3" />
      </>
    )}
  </g>
)

// Notanish odam: yuzi ko'rinmaydigan soya
const Shade = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-26 34 Q-26 6 0 6 Q26 6 26 34Z" fill="#66758A" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <circle cy="-10" r="18" fill="#66758A" stroke={INK} strokeWidth="4" />
    <text y="-3" fontSize="22" fontWeight="900" textAnchor="middle" fill="#fff">
      ?
    </text>
  </g>
)

const Bubble = ({ x, y, w, fill = '#fff', children }: { x: number; y: number; w: number; fill?: string; children?: ReactNode }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M0 0 H${w} Q${w + 8} 0 ${w + 8} 8 V26 Q${w + 8} 34 ${w} 34 H18 L6 46 L8 34 H0 Q-8 34 -8 26 V8 Q-8 0 0 0Z`} fill={fill} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    {children}
  </g>
)

const SCENES: Record<ScenarioId, ReactNode> = {
  // Notanish odam ism va manzil so'rayapti
  stranger: (
    <>
      <Shade x={62} y={78} />
      <Bubble x={104} y={34} w={96}>
        <path d="M22 17 L34 8 L46 17 V28 H22Z" {...ln} fill="#FFC94A" />
        <text x="74" y="26" fontSize="26" fontWeight="900" textAnchor="middle" fill={INK}>
          ?
        </text>
      </Bubble>
      <Kid x={196} y={112} />
    </>
  ),
  // Parol so'ralmoqda
  password: (
    <>
      <rect x="40" y="86" width="160" height="34" rx="10" fill="#fff" stroke={INK} strokeWidth="4" />
      {[62, 88, 114, 140, 166].map((x) => (
        <circle key={x} cx={x} cy="103" r="6" fill={INK} />
      ))}
      <path d="M100 50 V38 A20 20 0 0 1 140 38 V50" {...ln} strokeWidth="7" />
      <rect x="88" y="48" width="64" height="30" rx="8" fill="#FFC94A" stroke={INK} strokeWidth="4" />
      <circle cx="120" cy="63" r="5" fill={INK} />
    </>
  ),
  // "Yutdingiz!" havolasi
  prize: (
    <>
      <path d="M120 14 L132 34 L156 30 L146 52 L164 68 L140 72 L134 96 L120 78 L106 96 L100 72 L76 68 L94 52 L84 30 L108 34Z" fill="#FFC94A" stroke="#E9A91F" strokeWidth="4" strokeLinejoin="round" />
      <rect x="100" y="46" width="40" height="30" rx="5" fill="#FF7A6B" stroke={INK} strokeWidth="4" />
      <path d="M120 46 V76 M100 58 H140 M120 46 Q108 34 104 44 M120 46 Q132 34 136 44" {...ln} />
      <rect x="70" y="104" width="100" height="26" rx="13" fill="#5CC98B" stroke={INK} strokeWidth="4" />
      <path d="M146 110 L160 132 L163 122 L173 121Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </>
  ),
  // Notanish fayl
  file: (
    <>
      <Shade x={56} y={78} />
      <path d="M118 26 H166 L188 48 V120 H118Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M166 26 V48 H188" {...ln} />
      <ellipse cx="153" cy="88" rx="15" ry="18" fill="#FF7A6B" stroke={INK} strokeWidth="4" />
      <path d="M138 80 L128 74 M138 90 H126 M138 100 L128 106 M168 80 L178 74 M168 90 H180 M168 100 L178 106 M146 70 L142 62 M160 70 L164 62" {...ln} strokeWidth="3" />
      <circle cx="148" cy="84" r="2.5" fill={INK} />
      <circle cx="158" cy="84" r="2.5" fill={INK} />
    </>
  ),
  // Xafa qiladigan xabar
  bully: (
    <>
      <Bubble x={34} y={28} w={104} fill="#FFE1DC">
        <path d="M12 12 L24 22 L36 10 L48 24 L60 10 L72 22 L84 12" {...ln} stroke="#D9594B" />
        <path d="M94 6 L86 18 H96 L88 30" {...ln} stroke="#D9594B" strokeWidth="3" />
      </Bubble>
      <g transform="translate(184 100)">
        <circle r="20" fill="#FFD9B8" stroke={INK} strokeWidth="4" />
        <path d="M-20 -4 Q-16 -24 0 -22 Q16 -24 20 -4 Q8 -12 0 -10 Q-8 -12 -20 -4Z" fill="#8A5A3C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="-7" cy="2" r="2.6" fill={INK} />
        <circle cx="7" cy="2" r="2.6" fill={INK} />
        <path d="M-6 13 Q0 8 6 13" {...ln} strokeWidth="3" />
        <path d="M10 8 Q13 14 10 16 Q7 14 10 8Z" fill="#6CB8F0" />
      </g>
    </>
  ),
  // Yolg'iz uchrashuvga chaqiriq
  meet: (
    <>
      <path d="M20 118 Q70 96 120 118 T220 118" {...ln} stroke="#5CC98B" strokeWidth="8" />
      <path d="M120 22 A26 26 0 0 1 146 48 Q146 66 120 96 Q94 66 94 48 A26 26 0 0 1 120 22Z" fill="#FF7A6B" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="120" cy="48" r="10" fill="#fff" stroke={INK} strokeWidth="4" />
      <Shade x={196} y={76} />
      <Kid x={44} y={84} />
    </>
  ),
  // Do'stning rasmini internetga qo'yish
  photo: (
    <>
      <rect x="40" y="26" width="104" height="100" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
      <rect x="50" y="36" width="84" height="66" rx="4" fill="#CFEAFC" />
      <Kid x={92} y={72} />
      <path d="M160 76 H204 M186 58 L204 76 L186 94" {...ln} strokeWidth="8" stroke="#2BB3A3" />
    </>
  ),
  // Uzoq o'ynash, ko'z charchashi
  time: (
    <>
      <circle cx="74" cy="76" r="44" fill="#fff" stroke={INK} strokeWidth="5" />
      <path d="M74 46 V76 L96 90" {...ln} strokeWidth="6" />
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M74 38 V44" {...ln} transform={`rotate(${a} 74 76)`} />
      ))}
      <Kid x={178} y={78} tired />
      <text x="204" y="44" fontSize="22" fontWeight="900" fill="#66758A">
        z
      </text>
      <text x="216" y="30" fontSize="16" fontWeight="900" fill="#66758A">
        z
      </text>
    </>
  ),
}

/** Vaziyat rasmi: monitor ichidagi sahna. */
export function Scene({ id }: { id: ScenarioId }) {
  return (
    <svg className="sf-scene" viewBox="0 0 260 190" aria-hidden="true">
      <rect x="6" y="6" width="248" height="150" rx="16" fill="#EAF6FF" stroke={INK} strokeWidth="6" />
      <path d="M104 156 L96 180 H164 L156 156" fill="#CFD9E6" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <g transform="translate(10 6)">{SCENES[id]}</g>
    </svg>
  )
}

/** Xaritadagi daraja belgisi: qalqon va tasdiq belgisi. */
export const QuizIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
    <path d="M50 8 L86 20 V48 Q86 76 50 92 Q14 76 14 48 V20Z" fill="#2BB3A3" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <path d="M32 50 L46 64 L70 36" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
