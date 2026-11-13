import { describe, expect, it } from 'vitest'
import { strings } from '../../i18n/strings'
import {
  ALIGN_PAGES,
  FORMAT_WANT,
  PLAIN,
  POSTERS,
  alignPages,
  apply,
  formatTasks,
  hintFor,
  parseSentence,
  posterTarget,
  sameStyle,
  type Cmd,
  type FormatId,
  type Style,
} from './model'

const LANGS = ['uz', 'ru'] as const

/** hintFor bo'yicha yurib, nechta buyruqda maqsadga yetishini sanaydi. */
function solve(from: Style, want: Style): number {
  let cur = from
  for (let n = 0; n < 12; n++) {
    const c = hintFor(cur, want)
    if (!c) return n
    cur = apply(cur, c)
  }
  return Infinity
}

describe('matn muharriri: bezak buyruqlari', () => {
  it('Q/Y/T almashtirgich: ikki marta bosilsa asliga qaytadi', () => {
    for (const t of ['b', 'i', 'u'] as const) {
      const once = apply(PLAIN, { t })
      expect(once[t]).toBe(true)
      expect(sameStyle(apply(once, { t }), PLAIN)).toBe(true)
    }
  })

  it('kattalik 0..2 oralig’idan chiqmaydi', () => {
    let s = PLAIN
    for (let n = 0; n < 5; n++) s = apply(s, { t: 'bigger' })
    expect(s.size).toBe(2)
    for (let n = 0; n < 5; n++) s = apply(s, { t: 'smaller' })
    expect(s.size).toBe(0)
  })

  it('rang va tekislash boshqa xossalarga tegmaydi', () => {
    const s = apply(apply({ ...PLAIN, b: true }, { t: 'color', c: 'red' }), { t: 'align', a: 'right' })
    expect(s).toEqual({ ...PLAIN, b: true, color: 'red', align: 'right' })
  })

  it('hintFor har doim maqsadga olib boradi, hatto ortiqcha bezakdan ham', () => {
    const messy: Style = { b: true, i: true, u: true, color: 'green', size: 0, align: 'right' }
    const want: Style = { ...PLAIN, b: true, color: 'red', size: 2, align: 'center' }
    expect(solve(messy, want)).toBe(6)
    expect(hintFor(want, want)).toBeNull()
    const cmds: Cmd[] = [{ t: 'i' }, { t: 'u' }]
    expect(sameStyle(cmds.reduce(apply, { ...PLAIN, i: true, u: true }), PLAIN)).toBe(true)
  })
})

describe('matn muharriri: topshiriqlar', () => {
  it('har sinfda raundlar soni va takrorlanmasligi', () => {
    expect(formatTasks(2)).toHaveLength(5)
    expect(formatTasks(3)).toHaveLength(6)
    expect(formatTasks(4)).toHaveLength(Object.keys(FORMAT_WANT).length)
    for (const g of [2, 3, 4]) expect(new Set(formatTasks(g)).size).toBe(formatTasks(g).length)
  })

  it('har gapda ikkala tilda aynan bitta belgilangan so’z va yo’riqnoma bor', () => {
    for (const id of Object.keys(FORMAT_WANT) as FormatId[])
      for (const lang of LANGS) {
        const text = strings[lang][`word.s.${id}`]
        expect(text.match(/\[/g), `${lang} ${id}`).toHaveLength(1)
        const { words, target } = parseSentence(text)
        expect(target, `${lang} ${id}`).toBeGreaterThanOrEqual(0)
        expect(words.join(' ')).not.toMatch(/[[\]]/)
        expect(strings[lang][`say.word.format.${id}`]).toBeTruthy()
      }
  })

  it('har bezak bitta-ikkita bosishda bajariladi', () => {
    for (const id of Object.keys(FORMAT_WANT) as FormatId[]) {
      const n = solve(PLAIN, { ...PLAIN, ...FORMAT_WANT[id] })
      expect(n, id).toBeGreaterThanOrEqual(1)
      expect(n, id).toBeLessThanOrEqual(1)
    }
  })

  it('tekislash: har sahifada kamida bitta qator joyida emas, matnlar ikki tilda bor', () => {
    expect(alignPages(2)).toHaveLength(2)
    expect(alignPages(4)).toHaveLength(ALIGN_PAGES.length)
    for (const page of ALIGN_PAGES) {
      expect(page.some((l) => l.from !== l.want)).toBe(true)
      for (const l of page) for (const lang of LANGS) expect(strings[lang][l.text], `${lang} ${l.text}`).toBeTruthy()
    }
  })

  it('namuna: har qatorda ish bor, 4-sinfda ko’proq', () => {
    for (const poster of POSTERS)
      for (const l of poster) {
        const g3 = solve(PLAIN, posterTarget(l, 3))
        const g4 = solve(PLAIN, posterTarget(l, 4))
        expect(g3, l.text).toBeGreaterThanOrEqual(1)
        expect(g4, l.text).toBeGreaterThan(g3)
        for (const lang of LANGS) expect(strings[lang][l.text], `${lang} ${l.text}`).toBeTruthy()
      }
  })
})
