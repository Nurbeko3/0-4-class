// Mantiq o'yinlari uchun savollar generatori. Sof funksiyalar — testlanadi.
import { shuffle } from '../../core/util'

export const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'] as const
export const HUES = ['coral', 'sky', 'sun', 'leaf', 'violet'] as const
export type Shape = (typeof SHAPES)[number]
export type Hue = (typeof HUES)[number]

export interface Item {
  shape: Shape
  hue: Hue
  small?: boolean
}

export const same = (a: Item, b: Item) => a.shape === b.shape && a.hue === b.hue && !!a.small === !!b.small

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
const take = <T>(arr: readonly T[], n: number): T[] => shuffle(arr).slice(0, n)

// both — shakli ham, rangi ham har xil; shape — rangi bir xil; hue — shakli bir xil;
// mixed — juftlik har xil, lekin shakl yoki rang takrorlanishi mumkin (qiyinroq).
type Mode = 'both' | 'shape' | 'hue' | 'mixed'

export function distinctItems(n: number, mode: Mode): Item[] {
  if (mode === 'both') {
    const hues = take(HUES, n)
    return take(SHAPES, n).map((shape, i) => ({ shape, hue: hues[i] }))
  }
  if (mode === 'shape') {
    const hue = pick(HUES)
    return take(SHAPES, n).map((shape) => ({ shape, hue }))
  }
  if (mode === 'hue') {
    const shape = pick(SHAPES)
    return take(HUES, n).map((hue) => ({ shape, hue }))
  }
  return take(
    SHAPES.flatMap((shape) => HUES.map((hue) => ({ shape, hue }))),
    n,
  )
}

// ---------- Qatorni davom ettir ----------

export interface PatternRound {
  /** To'liq qator (bo'sh joydagi to'g'ri shakl bilan birga) */
  row: Item[]
  /** So'roq belgisi turadigan o'rin */
  gap: number
  options: Item[]
  /** options ichidagi to'g'ri javob */
  answer: number
}

interface PatternCfg {
  /** Takrorlanuvchi bo'lak: 'AAB' — ikki bir xil, keyin boshqa */
  forms: string[]
  modes: Mode[]
  options: number
  /** So'roq qator o'rtasida ham kelishi mumkin */
  midGap: boolean
}

const PATTERNS: PatternCfg[] = [
  { forms: ['AB', 'AB', 'AAB'], modes: ['both'], options: 3, midGap: false },
  { forms: ['AB', 'AAB', 'ABB'], modes: ['both', 'shape', 'hue'], options: 3, midGap: false },
  { forms: ['ABC', 'AABB', 'AAB', 'ABB'], modes: ['both', 'shape', 'hue'], options: 4, midGap: false },
  { forms: ['ABC', 'ABAC', 'AABC', 'ABBC'], modes: ['shape', 'hue', 'mixed'], options: 4, midGap: true },
  { forms: ['ABCD', 'ABAC', 'ABCB', 'AABC'], modes: ['mixed'], options: 4, midGap: true },
]

const cfgOf = <T>(table: T[], grade: number): T => table[Math.max(0, Math.min(table.length - 1, grade))]

function withOptions(row: Item[], gap: number, count: number): PatternRound {
  const answer = row[gap]
  const pool: Item[] = []
  const add = (it: Item) => {
    if (!same(it, answer) && !pool.some((p) => same(p, it))) pool.push(it)
  }
  // Avval qatordagi boshqa shakllar, yetmasa — javobga o'xshash (shakli yoki rangi bir xil) chalg'ituvchilar
  shuffle(row).forEach(add)
  shuffle([
    ...SHAPES.map((shape) => ({ shape, hue: answer.hue })),
    ...HUES.map((hue) => ({ shape: answer.shape, hue })),
  ]).forEach(add)
  const options = shuffle([answer, ...pool.slice(0, count - 1)])
  return { row, gap, options, answer: options.findIndex((o) => same(o, answer)) }
}

/** So'roq o'rni: undan bir davr oldingi shakl doim ko'rinib turadi, shuning uchun javob aniq. */
const gapAt = (period: number, len: number, mid: boolean) => (mid ? period + Math.floor(Math.random() * (len - period)) : len - 1)

export function patternRound(grade: number, form?: string): PatternRound {
  const cfg = cfgOf(PATTERNS, grade)
  const f = form ?? pick(cfg.forms)
  const letters = [...new Set(f)]
  const items = distinctItems(letters.length, pick(cfg.modes))
  const len = f.length <= 2 ? 6 : f.length === 3 ? 7 : 9
  const row = Array.from({ length: len }, (_, i) => items[letters.indexOf(f[i % f.length])])
  return withOptions(row, gapAt(f.length, len, cfg.midGap), cfg.options)
}

/** 4-sinf uchun: shakl ikki qadamda, rang uch qadamda takrorlanadi — ikkalasini alohida kuzatish kerak. */
export function crossRound(): PatternRound {
  const shapes = take(SHAPES, 2)
  const hues = take(HUES, 3)
  const row = Array.from({ length: 9 }, (_, i) => ({ shape: shapes[i % 2], hue: hues[i % 3] }))
  return withOptions(row, gapAt(6, 9, true), 4)
}

export function patternRounds(grade: number, n = 5): PatternRound[] {
  const forms = shuffle(cfgOf(PATTERNS, grade).forms)
  return Array.from({ length: n }, (_, i) => (grade >= 4 && i === n - 1 ? crossRound() : patternRound(grade, forms[i % forms.length])))
}

// ---------- Ortiqchasini top ----------

export interface OddRound {
  items: Item[]
  odd: number
}

export type OddKind = 'shape' | 'hue' | 'size'

interface OddCfg {
  n: number
  kinds: OddKind[]
  /** Farq qilmaydigan belgilar ham har xil bo'ladi (chalg'itadi) */
  noise: boolean
}

const ODD: OddCfg[] = [
  { n: 4, kinds: ['shape', 'hue'], noise: false },
  { n: 4, kinds: ['shape', 'hue', 'size'], noise: false },
  { n: 5, kinds: ['shape', 'hue', 'size'], noise: false },
  { n: 6, kinds: ['shape', 'hue', 'size'], noise: true },
  { n: 8, kinds: ['shape', 'hue', 'size'], noise: true },
]

/** n ta o'ringa 2–3 xil qiymat, har biri kamida ikki marta — hech biri "yagona" bo'lib qolmaydi. */
function spread<T>(values: readonly T[], n: number): T[] {
  const k = n >= 6 ? 3 : 2
  const vals = take(values, k)
  return shuffle(Array.from({ length: n }, (_, i) => vals[i % k]))
}

export function oddRound(grade: number, kind?: OddKind): OddRound {
  const cfg = cfgOf(ODD, grade)
  const k = kind ?? pick(cfg.kinds)
  const [s1, s2] = take(SHAPES, 2)
  const [h1, h2] = take(HUES, 2)
  const baseSmall = Math.random() < 0.5
  const shapes = cfg.noise && k !== 'shape' ? spread(SHAPES, cfg.n) : null
  const hues = cfg.noise && k !== 'hue' ? spread(HUES, cfg.n) : null
  const tagged = shuffle(
    Array.from({ length: cfg.n }, (_, i) => {
      const odd = i === 0
      const item: Item = {
        shape: k === 'shape' ? (odd ? s2 : s1) : (shapes?.[i] ?? s1),
        hue: k === 'hue' ? (odd ? h2 : h1) : (hues?.[i] ?? h1),
      }
      if (k === 'size' && odd !== baseSmall) item.small = true
      return { item, odd }
    }),
  )
  return { items: tagged.map((t) => t.item), odd: tagged.findIndex((t) => t.odd) }
}

export function oddRounds(grade: number, n = 6): OddRound[] {
  const kinds = shuffle(cfgOf(ODD, grade).kinds)
  return Array.from({ length: n }, (_, i) => oddRound(grade, kinds[i % kinds.length]))
}

/** Maydon ustunlari soni: 6 tagacha bir qator, undan ko'pi ikki qator. */
export const oddCols = (n: number) => (n <= 5 ? n : Math.ceil(n / 2))

// ---------- Juftini top ----------

const PAIRS = [3, 4, 6, 8, 10]

export function memoryDeck(grade: number): Item[] {
  const pairs = cfgOf(PAIRS, grade)
  const items = distinctItems(pairs, pairs <= 5 ? 'both' : 'mixed')
  return shuffle([...items, ...items])
}

export const memoryCols = (cards: number) => (cards <= 6 ? 3 : cards <= 8 ? 4 : cards <= 16 ? 6 : 7)
