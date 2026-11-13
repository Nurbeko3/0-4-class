// Matn muharriri: sof mantiq (bezak holati, buyruqlar, topshiriqlar). React'ga bog'liq emas.
import type { CSSProperties } from 'react'
import type { StrKey } from '../../i18n/strings'

export type ColorId = 'ink' | 'red' | 'blue' | 'green' | 'orange'
export type Align = 'left' | 'center' | 'right'

export interface Style {
  b: boolean
  i: boolean
  u: boolean
  color: ColorId
  /** 0 — kichik, 1 — oddiy, 2 — katta */
  size: number
  align: Align
}

export const PLAIN: Style = { b: false, i: false, u: false, color: 'ink', size: 1, align: 'left' }
export const MAX_SIZE = 2
export const COLORS: ColorId[] = ['ink', 'red', 'orange', 'green', 'blue']
export const ALIGNS: Align[] = ['left', 'center', 'right']

export const COLOR_HEX: Record<ColorId, string> = {
  ink: '#2d3a4a',
  red: '#e5484d',
  blue: '#2f80ed',
  green: '#2f9e5b',
  orange: '#f0a000',
}

const SIZE_EM = [0.72, 1, 1.45]

/** Bezak holatini matn uslubiga aylantiradi (tekislashdan tashqari). */
export function textCss(s: Style): CSSProperties {
  return {
    fontWeight: s.b ? 900 : 600,
    fontStyle: s.i ? 'italic' : 'normal',
    textDecoration: s.u ? 'underline' : 'none',
    color: COLOR_HEX[s.color],
    fontSize: `${SIZE_EM[s.size]}em`,
  }
}

export type Cmd =
  | { t: 'b' }
  | { t: 'i' }
  | { t: 'u' }
  | { t: 'color'; c: ColorId }
  | { t: 'bigger' }
  | { t: 'smaller' }
  | { t: 'align'; a: Align }

/** Tugmaning nomi: hint va aria uchun. */
export function cmdId(c: Cmd): string {
  if (c.t === 'color') return `color:${c.c}`
  if (c.t === 'align') return `align:${c.a}`
  return c.t
}

/** Haqiqiy muharrirdagidek: Q/Y/T — almashtirgich, kattalik chegaralangan. */
export function apply(s: Style, c: Cmd): Style {
  switch (c.t) {
    case 'b':
      return { ...s, b: !s.b }
    case 'i':
      return { ...s, i: !s.i }
    case 'u':
      return { ...s, u: !s.u }
    case 'color':
      return { ...s, color: c.c }
    case 'bigger':
      return { ...s, size: Math.min(MAX_SIZE, s.size + 1) }
    case 'smaller':
      return { ...s, size: Math.max(0, s.size - 1) }
    case 'align':
      return { ...s, align: c.a }
  }
}

export function sameStyle(a: Style, b: Style): boolean {
  return a.b === b.b && a.i === b.i && a.u === b.u && a.color === b.color && a.size === b.size && a.align === b.align
}

/** `cur` ni `want` ga yaqinlashtiradigan birinchi buyruq (yordam uchun); mos bo'lsa — null. */
export function hintFor(cur: Style, want: Style): Cmd | null {
  if (cur.b !== want.b) return { t: 'b' }
  if (cur.i !== want.i) return { t: 'i' }
  if (cur.u !== want.u) return { t: 'u' }
  if (cur.color !== want.color) return { t: 'color', c: want.color }
  if (cur.size !== want.size) return { t: cur.size < want.size ? 'bigger' : 'smaller' }
  if (cur.align !== want.align) return { t: 'align', a: want.align }
  return null
}

// ---------- 1-daraja: so'zni bezash ----------

export type FormatId = 'heavy' | 'wind' | 'road' | 'red' | 'green' | 'blue' | 'big' | 'small'

/** Bezak so'zning ma'nosiga mos: og'ir — qalin, egildi — yotiq, yo'l — tagiga chiziq. */
export const FORMAT_WANT: Record<FormatId, Partial<Style>> = {
  heavy: { b: true },
  wind: { i: true },
  road: { u: true },
  red: { color: 'red' },
  green: { color: 'green' },
  blue: { color: 'blue' },
  big: { size: 2 },
  small: { size: 0 },
}

export function formatTasks(grade: number): FormatId[] {
  if (grade <= 2) return ['heavy', 'red', 'wind', 'green', 'big']
  if (grade === 3) return ['heavy', 'wind', 'road', 'blue', 'big', 'small']
  return ['heavy', 'wind', 'road', 'red', 'green', 'blue', 'big', 'small']
}

/** «Tosh juda [og’ir].» -> so'zlar va bezatiladigan so'z o'rni (qavs bo'lmasa -1). */
export function parseSentence(text: string): { words: string[]; target: number } {
  const raw = text.split(' ').filter(Boolean)
  return {
    words: raw.map((w) => w.replace(/[[\]]/g, '')),
    target: raw.findIndex((w) => w.includes('[')),
  }
}

// ---------- 2-daraja: tekislash ----------

export interface AlignLine {
  text: StrKey
  from: Align
  want: Align
  title?: boolean
}

export const ALIGN_PAGES: AlignLine[][] = [
  [
    { text: 'word.a.family.1', from: 'left', want: 'center', title: true },
    { text: 'word.a.family.2', from: 'left', want: 'left' },
  ],
  [
    { text: 'word.a.letter.1', from: 'left', want: 'center', title: true },
    { text: 'word.a.letter.2', from: 'right', want: 'left' },
    { text: 'word.a.letter.3', from: 'left', want: 'right' },
  ],
  [
    { text: 'word.a.poem.1', from: 'right', want: 'center', title: true },
    { text: 'word.a.poem.2', from: 'center', want: 'left' },
    { text: 'word.a.poem.3', from: 'left', want: 'left' },
    { text: 'word.a.poem.4', from: 'left', want: 'right' },
  ],
]

export const alignPages = (grade: number): AlignLine[][] => ALIGN_PAGES.slice(0, grade <= 2 ? 2 : 3)

// ---------- 3-daraja: namunadagidek bezash ----------

export interface PosterLine {
  text: StrKey
  want: Partial<Style>
  /** 4-sinfda qo'shiladigan bezak */
  more?: Partial<Style>
}

export const POSTERS: PosterLine[][] = [
  [
    { text: 'word.p.invite.1', want: { align: 'center', b: true, color: 'red' }, more: { size: 2 } },
    { text: 'word.p.invite.2', want: { align: 'center' }, more: { i: true } },
    { text: 'word.p.invite.3', want: { color: 'blue' }, more: { u: true } },
    { text: 'word.p.invite.4', want: { align: 'right' }, more: { b: true } },
  ],
  [
    { text: 'word.p.notice.1', want: { align: 'center', b: true, color: 'orange' }, more: { size: 2 } },
    { text: 'word.p.notice.2', want: { align: 'center', color: 'red' }, more: { b: true } },
    { text: 'word.p.notice.3', want: { i: true }, more: { color: 'blue' } },
    { text: 'word.p.notice.4', want: { align: 'right' }, more: { u: true } },
  ],
]

export function posterTarget(line: PosterLine, grade: number): Style {
  return { ...PLAIN, ...line.want, ...(grade >= 4 ? line.more : null) }
}
