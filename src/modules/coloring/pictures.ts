// Raqam bo'yicha bo'yash: piksel-rasmlar va katak yozuvlari (sof mantiq, DOM yo'q).
// Har rasm — satrlar; '.' bo'sh katak, '1'..'9' — `colors` ro'yxatidagi rang tartib raqami.

export type ColorId =
  | 'red'
  | 'pink'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'blue'
  | 'brown'
  | 'gray'
  | 'dark'

/** hex — bo'yoq rangi; ink — shu rang ustidagi yozuv rangi */
export const COLORS: Record<ColorId, { hex: string; ink: string }> = {
  red: { hex: '#F2594B', ink: '#fff' },
  pink: { hex: '#FFA9BD', ink: '#2D3A4A' },
  orange: { hex: '#F58A2A', ink: '#fff' },
  yellow: { hex: '#FFC94A', ink: '#2D3A4A' },
  green: { hex: '#45B97C', ink: '#fff' },
  teal: { hex: '#2BB3A3', ink: '#fff' },
  sky: { hex: '#9FD4F7', ink: '#2D3A4A' },
  blue: { hex: '#4A8FE3', ink: '#fff' },
  brown: { hex: '#A86A3C', ink: '#fff' },
  gray: { hex: '#B4C0D0', ink: '#2D3A4A' },
  dark: { hex: '#2D3A4A', ink: '#fff' },
}

export interface Picture {
  id: string
  /** 1 — oson (kam rang, yirik), 2 — o'rta, 3 — murakkab */
  level: 1 | 2 | 3
  rows: string[]
  colors: ColorId[]
}

export const PICTURES: Picture[] = [
  {
    id: 'heart',
    level: 1,
    colors: ['red', 'pink'],
    rows: [
      '.11...11.',
      '121111111',
      '121111111',
      '111111111',
      '.1111111.',
      '..11111..',
      '...111...',
      '....1....',
    ],
  },
  {
    id: 'apple',
    level: 1,
    colors: ['red', 'green', 'brown', 'pink'],
    rows: [
      '....3....',
      '....322..',
      '..11311..',
      '.1411111.',
      '.1411111.',
      '.1111111.',
      '.1111111.',
      '..11111..',
      '...1.1...',
    ],
  },
  {
    id: 'fish',
    level: 2,
    colors: ['orange', 'yellow', 'dark', 'sky'],
    rows: [
      '.4.........4',
      '...1111....1',
      '..112111..11',
      '.1312111.111',
      '111121111111',
      '111121111111',
      '.1112111.111',
      '..112111..11',
      '...1111....1',
      '4.....4.....',
    ],
  },
  {
    id: 'rocket',
    level: 2,
    colors: ['red', 'gray', 'blue', 'orange', 'yellow'],
    rows: [
      '....1....',
      '...111...',
      '...222...',
      '..22222..',
      '..23332..',
      '..23332..',
      '..22222..',
      '..22222..',
      '.1222221.',
      '112222211',
      '11.454.11',
      '...454...',
      '....4....',
    ],
  },
  {
    id: 'robot',
    level: 3,
    colors: ['teal', 'yellow', 'red', 'dark', 'sky'],
    rows: [
      '.....3.....',
      '.....4.....',
      '..1111111..',
      '..1221221..',
      '..1221221..',
      '..1111111..',
      '..1333331..',
      '..1111111..',
      '4.5555555.4',
      '44555255544',
      '..5555555..',
      '..44...44..',
    ],
  },
  {
    id: 'computer',
    level: 3,
    colors: ['dark', 'sky', 'yellow', 'gray', 'green'],
    rows: [
      '111111111111',
      '122222222221',
      '122222223321',
      '122222223321',
      '122222222221',
      '125522255221',
      '155555555551',
      '111111111111',
      '....4444....',
      '....4444....',
      '..44444444..',
    ],
  },
]

/** Tayyorlov sinfiga murakkab rasmlar berilmaydi. */
export const picturesFor = (grade: number) => (grade <= 0 ? PICTURES.filter((p) => p.level < 3) : PICTURES)

export interface Cell {
  /** `colors` dagi tartib raqami (0 dan), bo'sh katak uchun -1 */
  color: number
  /** Katakdagi yozuv: raqam yoki misol */
  label: string
}

// Rang "javobi": kichik sinflarda 1,2,3…; yuqori sinflarda misol javobi bo'ladigan sonlar.
const TIMES = [6, 8, 9, 10, 12, 15, 16, 18, 20]

export function valueOf(grade: number, colorIndex: number): number {
  if (grade <= 1) return colorIndex + 1
  if (grade === 2) return colorIndex + 3
  if (grade === 3) return colorIndex + 5
  return TIMES[colorIndex]
}

const int = (rnd: () => number, min: number, max: number) => min + Math.floor(rnd() * (max - min + 1))

/** Javobi `v` bo'ladigan misol. 2-sinf: qo'shish; 3-sinf: + va −; 4-sinf: + − ×. */
export function expression(grade: number, v: number, rnd: () => number = Math.random): string {
  if (grade <= 1) return String(v)
  const plus = () => {
    const a = int(rnd, 1, v - 1)
    return `${a}+${v - a}`
  }
  const minus = () => {
    const b = int(rnd, 1, 5)
    return `${v + b}−${b}`
  }
  const times = () => {
    const pairs: [number, number][] = []
    for (let a = 2; a * a <= v; a++) if (v % a === 0) pairs.push([a, v / a], [v / a, a])
    if (!pairs.length) return plus()
    const [a, b] = pairs[int(rnd, 0, pairs.length - 1)]
    return `${a}×${b}`
  }
  if (grade === 2) return plus()
  if (grade === 3) return rnd() < 0.5 ? plus() : minus()
  const r = rnd()
  return r < 0.5 ? times() : r < 0.75 ? plus() : minus()
}

/** Misolni hisoblaydi (test va tekshiruv uchun). */
export function evaluate(label: string): number {
  const m = /^(\d+)([+−×])(\d+)$/.exec(label)
  if (!m) return Number(label)
  const a = Number(m[1])
  const b = Number(m[3])
  return m[2] === '+' ? a + b : m[2] === '−' ? a - b : a * b
}

export function buildCells(pic: Picture, grade: number, rnd: () => number = Math.random): Cell[] {
  return pic.rows.flatMap((row) =>
    [...row].map((ch) => {
      if (ch === '.') return { color: -1, label: '' }
      const color = Number(ch) - 1
      return { color, label: expression(grade, valueOf(grade, color), rnd) }
    }),
  )
}
