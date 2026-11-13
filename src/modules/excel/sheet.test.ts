import { describe, expect, it } from 'vitest'
import { BACKSPACE, addr, addrOptions, chartValues, numbers, pickCells, same, total, typeInput, typeTasks } from './sheet'

// Takrorlanadigan "tasodif"
function seeded(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

describe('excel: manzil', () => {
  it('manzil — harf va raqam', () => {
    expect(addr({ col: 0, row: 0 })).toBe('A1')
    expect(addr({ col: 1, row: 2 })).toBe('B3')
    expect(addr({ col: 6, row: 4 })).toBe('G5')
  })

  it('pickCells har xil va chegara ichidagi kataklarni beradi', () => {
    const cells = pickCells(5, 4, 8, seeded(3))
    expect(cells).toHaveLength(8)
    expect(new Set(cells.map(addr)).size).toBe(8)
    for (const c of cells) {
      expect(c.col).toBeGreaterThanOrEqual(0)
      expect(c.col).toBeLessThan(5)
      expect(c.row).toBeLessThan(4)
    }
    expect(pickCells(3, 4, 6, seeded(5), 1).every((c) => c.col >= 1)).toBe(true)
  })

  it('addrOptions: uchta har xil variant, biri to’g’ri', () => {
    for (let seed = 1; seed < 30; seed++) {
      const c = { col: seed % 5, row: seed % 4 }
      const opts = addrOptions(c, 5, 4, seeded(seed))
      expect(new Set(opts).size).toBe(3)
      expect(opts).toContain(addr(c))
    }
  })

  it('same', () => {
    expect(same({ col: 1, row: 1 }, { col: 1, row: 1 })).toBe(true)
    expect(same({ col: 1, row: 1 }, { col: 1, row: 2 })).toBe(false)
    expect(same(null, { col: 1, row: 2 })).toBe(false)
  })
})

describe('excel: sonlar', () => {
  it('numbers oraliqda, total yig’indi', () => {
    const n = numbers(20, 2, 9, seeded(7))
    expect(n.every((x) => x >= 2 && x <= 9)).toBe(true)
    expect(total([3, 4, 2])).toBe(9)
    expect(total([])).toBe(0)
  })

  it('chartValues har xil — eng kattasi bitta', () => {
    for (let seed = 1; seed < 20; seed++) {
      const v = chartValues(4, 8, seeded(seed))
      expect(new Set(v).size).toBe(4)
      expect(v.every((x) => x >= 1 && x <= 8)).toBe(true)
    }
  })

  it('typeTasks: sinfga qarab kataklar va sonlar', () => {
    const t3 = typeTasks(3, 4, seeded(2))
    expect(t3).toHaveLength(4)
    expect(t3.every((t) => t.cell.col === 1 && t.value >= 1 && t.value <= 9)).toBe(true)
    expect(new Set(t3.map((t) => addr(t.cell))).size).toBe(4)
    const t4 = typeTasks(4, 4, seeded(2))
    expect(t4).toHaveLength(5)
    expect(t4.every((t) => t.cell.col >= 1 && t.value >= 10 && t.value <= 99)).toBe(true)
  })

  it('typeInput: raqam qo’shish, chegarasi va o’chirish', () => {
    expect(typeInput('', '5')).toBe('5')
    expect(typeInput('5', '2')).toBe('52')
    expect(typeInput('52', '7')).toBe('52')
    expect(typeInput('52', BACKSPACE)).toBe('5')
    expect(typeInput('', BACKSPACE)).toBe('')
    expect(typeInput('0', '4')).toBe('4')
    expect(typeInput('1', 'a')).toBe('1')
  })
})
