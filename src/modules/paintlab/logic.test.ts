import { describe, expect, it } from 'vitest'
import { cellKey, distToSegment, eraseAlong, fits, matchShape, mirrorCount, mirrorDone, mirrorWant, scribble, tooSmall } from './logic'
import { COLORS, FILL_PICTURES, MIRROR_PICTURES, SHAPE_PICTURES, VIEW_H, VIEW_W, type Shape } from './pictures'

const rect: Shape = { type: 'rect', a: { x: 50, y: 70 }, b: { x: 140, y: 130 }, color: 'yellow' }
const line: Shape = { type: 'line', a: { x: 50, y: 70 }, b: { x: 100, y: 30 }, color: 'red' }

describe('paintlab: shakllar', () => {
  it('to’rtburchak istalgan burchakdan tortilsa ham mos keladi', () => {
    expect(fits({ x: 52, y: 68 }, { x: 138, y: 133 }, rect, 10)).toBe(true)
    expect(fits({ x: 138, y: 133 }, { x: 52, y: 68 }, rect, 10)).toBe(true)
    expect(fits({ x: 52, y: 68 }, { x: 100, y: 100 }, rect, 10)).toBe(false)
  })

  it('chiziq ikkala yo’nalishda mos keladi', () => {
    expect(fits({ x: 98, y: 33 }, { x: 53, y: 72 }, line, 10)).toBe(true)
    expect(fits({ x: 53, y: 72 }, { x: 98, y: 33 }, line, 10)).toBe(true)
    expect(fits({ x: 53, y: 72 }, { x: 140, y: 33 }, line, 10)).toBe(false)
  })

  it('matchShape: asbob to’g’ri, noto’g’ri va chizilgan shakl', () => {
    const ghosts = [rect, line]
    const a = { x: 50, y: 70 }
    const b = { x: 140, y: 130 }
    expect(matchShape('rect', a, b, ghosts, [false, false], 10)).toEqual({ index: 0, wrongTool: false })
    expect(matchShape('circle', a, b, ghosts, [false, false], 10)).toEqual({ index: -1, wrongTool: true })
    expect(matchShape('rect', a, b, ghosts, [true, false], 10)).toEqual({ index: -1, wrongTool: false })
    expect(matchShape('rect', { x: 0, y: 0 }, { x: 20, y: 20 }, ghosts, [false, false], 10)).toEqual({ index: -1, wrongTool: false })
  })

  it('tooSmall', () => {
    expect(tooSmall({ x: 1, y: 1 }, { x: 3, y: 2 })).toBe(true)
    expect(tooSmall({ x: 1, y: 1 }, { x: 30, y: 2 })).toBe(false)
  })

  it('namunadagi har shakl o’zining aniq chizilganiga mos keladi va maydon ichida', () => {
    for (const pic of SHAPE_PICTURES)
      for (const s of pic.shapes) {
        expect(fits(s.a, s.b, s, 10)).toBe(true)
        for (const p of [s.a, s.b]) {
          expect(p.x).toBeGreaterThanOrEqual(0)
          expect(p.x).toBeLessThanOrEqual(VIEW_W)
          expect(p.y).toBeGreaterThanOrEqual(0)
          expect(p.y).toBeLessThanOrEqual(VIEW_H)
        }
      }
  })

  it('bitta rasm ichida ikki shakl bir-biri bilan adashtirilmaydi', () => {
    for (const pic of SHAPE_PICTURES)
      pic.shapes.forEach((s, i) =>
        pic.shapes.forEach((g, j) => {
          if (i !== j) expect(fits(s.a, s.b, g, 16)).toBe(false)
        }),
      )
  })
})

describe('paintlab: o’chirg’ich', () => {
  it('distToSegment', () => {
    expect(distToSegment({ x: 5, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(5)
    expect(distToSegment({ x: 13, y: 4 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(5)
    expect(distToSegment({ x: 3, y: 4 }, { x: 0, y: 0 }, { x: 0, y: 0 })).toBe(5)
  })

  it('eraseAlong faqat yo’ldagi nuqtalarni o’chiradi va qayta sanamaydi', () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 50, y: 4 },
      { x: 50, y: 40 },
    ]
    const erased = [false, false, false]
    expect(eraseAlong(pts, erased, { x: 0, y: 0 }, { x: 100, y: 0 }, 10)).toBe(2)
    expect(erased).toEqual([true, true, false])
    expect(eraseAlong(pts, erased, { x: 0, y: 0 }, { x: 100, y: 0 }, 10)).toBe(0)
  })

  it('scribble maydon ichida qoladi', () => {
    let s = 7
    const rnd = () => {
      s = (s * 16807) % 2147483647
      return s / 2147483647
    }
    for (let k = 0; k < 10; k++)
      for (const p of scribble(800, 600, rnd)) {
        expect(p.x).toBeGreaterThanOrEqual(50)
        expect(p.x).toBeLessThanOrEqual(750)
        expect(p.y).toBeGreaterThanOrEqual(50)
        expect(p.y).toBeLessThanOrEqual(550)
      }
  })
})

describe('paintlab: ko’zgu', () => {
  const tree = MIRROR_PICTURES.find((p) => p.id === 'tree')!

  it('mirrorWant o’qqa nisbatan aks ettiradi', () => {
    // 1-qator: '....1' — o'qqa eng yaqin katak bo'yalgan
    expect(mirrorWant(tree, 0, 0)).toBe(1)
    expect(mirrorWant(tree, 1, 0)).toBe(0)
    // 5-qator: '11111'
    expect(mirrorWant(tree, 4, 4)).toBe(1)
    expect(mirrorWant(tree, 0, 6)).toBe(2)
  })

  it('mirrorDone faqat to’liq va to’g’ri bo’yalganda', () => {
    const painted: Record<string, number> = {}
    expect(mirrorDone(tree, painted)).toBe(false)
    for (let y = 0; y < tree.half.length; y++)
      for (let x = 0; x < 5; x++) {
        const w = mirrorWant(tree, x, y)
        if (w) painted[cellKey(x, y)] = w
      }
    expect(Object.keys(painted)).toHaveLength(mirrorCount(tree))
    expect(mirrorDone(tree, painted)).toBe(true)
    painted[cellKey(0, 0)] = 2
    expect(mirrorDone(tree, painted)).toBe(false)
  })

  it('rasmlar to’g’ri tuzilgan', () => {
    for (const p of MIRROR_PICTURES) {
      const w = p.half[0].length
      for (const row of p.half) {
        expect(row).toHaveLength(w)
        for (const ch of row) if (ch !== '.') expect(Number(ch)).toBeLessThanOrEqual(p.colors.length)
      }
      // har rang kamida bir marta ishlatilgan
      p.colors.forEach((_, i) => expect(p.half.join('')).toContain(String(i + 1)))
    }
    for (const p of FILL_PICTURES) for (const r of p.regions) expect(COLORS[r.color]).toBeTruthy()
  })
})
