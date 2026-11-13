import { describe, expect, it } from 'vitest'
import { GRADES } from '../../core/curriculum'
import { strings } from '../../i18n/strings'
import { memoryCols, memoryDeck, oddRound, oddRounds, patternRounds, same, type Item, type OddKind } from './logic'

const key = (it: Item) => `${it.shape}/${it.hue}/${it.small ? 's' : 'L'}`
const times = (n: number, fn: () => void) => {
  for (let i = 0; i < n; i++) fn()
}

/** Shu belgi bo'yicha qatorda yagona bo'lgan shakllar indeksi */
function singletons(items: Item[]): Set<number> {
  const out = new Set<number>()
  for (const attr of [(it: Item) => it.shape, (it: Item) => it.hue, (it: Item) => !!it.small] as const)
    items.forEach((it, i) => {
      if (items.filter((o) => attr(o) === attr(it)).length === 1) out.add(i)
    })
  return out
}

describe('mantiq: qatorni davom ettir', () => {
  it('har sinfda 5 ta savol, javob variantlar ichida va yagona', () => {
    for (const g of GRADES)
      times(40, () => {
        const rounds = patternRounds(g)
        expect(rounds).toHaveLength(5)
        for (const r of rounds) {
          expect(new Set(r.options.map(key)).size, 'variantlar takrorlanmaydi').toBe(r.options.length)
          expect(r.options.length).toBe(g <= 1 ? 3 : 4)
          expect(same(r.options[r.answer], r.row[r.gap])).toBe(true)
        }
      })
  })

  it('bo’sh joydagi shaklni qatorning ko’rinib turgan qismidan aniqlasa bo’ladi', () => {
    for (const g of GRADES)
      times(40, () => {
        for (const r of patternRounds(g)) {
          // Qator davriy: eng kichik davrni topamiz va bo'sh joydan bir davr oldingi shakl ko'rinishini tekshiramiz
          const period = [2, 3, 4, 6].find((p) => r.row.every((it, i) => i < p || same(it, r.row[i - p])))!
          expect(period, r.row.map(key).join(' ')).toBeTruthy()
          expect(r.gap).toBeGreaterThanOrEqual(period)
          if (g <= 2) expect(r.gap).toBe(r.row.length - 1)
        }
      })
  })
})

describe('mantiq: ortiqchasini top', () => {
  it('faqat bitta shakl qaysidir belgisi bilan yagona — o’sha ortiqcha', () => {
    for (const g of GRADES)
      for (const kind of ['shape', 'hue', 'size'] as OddKind[])
        times(40, () => {
          const r = oddRound(g, kind)
          expect([...singletons(r.items)], `${g}-sinf ${kind}: ${r.items.map(key).join(' ')}`).toEqual([r.odd])
        })
  })

  it('kichik sinflarda shakllar kam, kattalarda ko’p', () => {
    expect(oddRounds(0)).toHaveLength(6)
    expect(oddRound(0).items).toHaveLength(4)
    expect(oddRound(4).items).toHaveLength(8)
    // 0-sinfda o'lcham bo'yicha savol yo'q
    times(20, () => expect(oddRounds(0).some((r) => r.items.some((it) => it.small))).toBe(false))
  })
})

describe('mantiq: juftini top', () => {
  it('har rasm aynan ikki marta uchraydi; kartochkalar soni sinfga qarab o’sadi', () => {
    const sizes = GRADES.map((g) => {
      const deck = memoryDeck(g)
      const count = new Map<string, number>()
      for (const c of deck) count.set(key(c), (count.get(key(c)) ?? 0) + 1)
      expect([...count.values()].every((n) => n === 2)).toBe(true)
      expect(Math.ceil(deck.length / memoryCols(deck.length))).toBeLessThanOrEqual(3)
      return deck.length
    })
    expect(sizes).toEqual([6, 8, 12, 16, 20])
  })
})

describe('mantiq: matnlar', () => {
  it('yo’riqnoma va dars rejasi ikkala tilda bor', () => {
    const keys = ['topic.logic', 'say.logic.odd', 'say.logic.pattern', 'say.logic.memory', 'lesson.logic.goal', 'lesson.logic.tip']
    for (const lang of ['uz', 'ru'] as const)
      for (const k of keys) expect((strings[lang] as Record<string, string>)[k], `${lang} ${k}`).toBeTruthy()
  })
})
