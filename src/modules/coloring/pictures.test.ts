import { describe, expect, it } from 'vitest'
import { buildCells, COLORS, evaluate, expression, PICTURES, picturesFor, valueOf } from './pictures'

describe('coloring pictures', () => {
  it('har rasm to‘g‘ri to‘rtburchak va ranglari mavjud', () => {
    for (const p of PICTURES) {
      const w = p.rows[0].length
      expect(p.rows.every((r) => r.length === w), p.id).toBe(true)
      const used = new Set(p.rows.join('').replace(/\./g, ''))
      for (const ch of used) expect(COLORS[p.colors[Number(ch) - 1]], `${p.id}:${ch}`).toBeDefined()
      // palitradagi har rang rasmda ishlatilgan
      expect(used.size, p.id).toBe(p.colors.length)
    }
  })

  it('tayyorlov sinfiga murakkab rasm berilmaydi', () => {
    expect(picturesFor(0).every((p) => p.level < 3)).toBe(true)
    expect(picturesFor(3)).toHaveLength(PICTURES.length)
  })

  it('misol javobi doim rang soniga teng', () => {
    for (let grade = 0; grade <= 4; grade++) {
      for (let c = 0; c < 5; c++) {
        const v = valueOf(grade, c)
        for (let i = 0; i < 40; i++) expect(evaluate(expression(grade, v)), `g${grade} v${v}`).toBe(v)
      }
    }
  })

  it('bir sinf ichida ranglarning javoblari har xil', () => {
    for (let grade = 0; grade <= 4; grade++) {
      const vs = [0, 1, 2, 3, 4].map((c) => valueOf(grade, c))
      expect(new Set(vs).size).toBe(5)
    }
  })

  it('kataklar soni rasm o‘lchamiga teng', () => {
    const p = PICTURES[0]
    expect(buildCells(p, 2)).toHaveLength(p.rows.length * p.rows[0].length)
  })
})
