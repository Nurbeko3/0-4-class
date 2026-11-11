import { describe, expect, it } from 'vitest'
import { append, parseGrid, removeLast, run, setCount, size, type Cmd } from './interpreter'
import { ALL_LEVELS, maxDepth, stages } from './levels'

const grid = parseGrid(['S..', '.#.', '..G'])

describe('robot interpretatori', () => {
  it('panjarani o’qiydi', () => {
    expect(grid.w).toBe(3)
    expect(grid.start).toEqual({ x: 0, y: 0 })
    expect(grid.goal).toEqual({ x: 2, y: 2 })
    expect(grid.walls[1][1]).toBe(true)
  })

  it('marraga yetganda to’xtaydi, ortiqcha buyruq bajarilmaydi', () => {
    const r = run(grid, ['right', 'right', 'down', 'down', 'left'])
    expect(r.result).toBe('goal')
    expect(r.steps).toHaveLength(4)
    expect(r.steps[3].to).toEqual(grid.goal)
  })

  it('devorga va chetga urilsa — joyida qoladi va to’xtaydi', () => {
    const wall = run(grid, ['right', 'down', 'down'])
    expect(wall.result).toBe('bump')
    expect(wall.steps).toHaveLength(2)
    expect(wall.steps[1]).toMatchObject({ bump: true, to: { x: 1, y: 0 } })
    expect(run(grid, ['up']).result).toBe('bump')
  })

  it('dastur tugab marraga yetmasa — short', () => {
    expect(run(grid, ['right']).result).toBe('short')
    expect(run(grid, []).result).toBe('short')
  })

  it('takrorlash va ichma-ich takrorlash, qadam yo’li bilan', () => {
    const r = run(grid, [{ repeat: 2, body: ['right'] }, { repeat: 2, body: ['down'] }])
    expect(r.result).toBe('goal')
    expect(r.steps.map((s) => s.path)).toEqual([[0, 0], [0, 0], [1, 0], [1, 0]])
    const big = parseGrid(['S...', '....', '...G'])
    const nested: Cmd[] = [{ repeat: 2, body: [{ repeat: 1, body: ['right'] }, 'down'] }, 'right']
    expect(run(big, nested).result).toBe('goal')
    expect(size(nested)).toBe(5)
  })
})

describe('dasturni tahrirlash', () => {
  it('buyruq ochiq blok ichiga qo’shiladi', () => {
    let s = append([], [], 'up')
    s = append(s.program, s.open, { repeat: 2, body: [] })
    expect(s.open).toEqual([1])
    s = append(s.program, s.open, 'right')
    expect(s.program).toEqual(['up', { repeat: 2, body: ['right'] }])
    s = append(s.program, s.open, { repeat: 2, body: [] })
    expect(s.open).toEqual([1, 1])
  })

  it('oxirgisini o’chirish: avval buyruq, keyin bo’sh blokning o’zi', () => {
    let s = append([], [], { repeat: 3, body: [] })
    s = append(s.program, s.open, 'left')
    s = removeLast(s.program, s.open)
    expect(s).toEqual({ program: [{ repeat: 3, body: [] }], open: [0] })
    s = removeLast(s.program, s.open)
    expect(s).toEqual({ program: [], open: [] })
    expect(removeLast(['up', 'down'], [])).toEqual({ program: ['up'], open: [] })
  })

  it('takrorlash soni o’zgaradi', () => {
    const p: Cmd[] = ['up', { repeat: 2, body: [{ repeat: 2, body: ['left'] }] }]
    expect(setCount(p, [1, 0], 5)).toEqual(['up', { repeat: 2, body: [{ repeat: 5, body: ['left'] }] }])
    expect(p[1]).toEqual({ repeat: 2, body: [{ repeat: 2, body: ['left'] }] })
  })
})

describe('robot darajalari', () => {
  it('har bir darajaning namuna yechimi marraga yetadi va chegaraga sig’adi', () => {
    for (const [name, list] of Object.entries(ALL_LEVELS))
      list.forEach((lv, i) => {
        expect(run(parseGrid(lv.rows), lv.solution).result, `${name} ${i}`).toBe('goal')
        if (lv.max) expect(size(lv.solution), `${name} ${i}`).toBeLessThanOrEqual(lv.max)
        expect(new Set(lv.rows.map((r) => r.length)).size, `${name} ${i}`).toBe(1)
      })
  })

  it('cheklangan darajalar takrorlashsiz sig’maydi', () => {
    for (const lv of [...ALL_LEVELS.REPEAT, ...ALL_LEVELS.NESTED]) {
      const flat = run(parseGrid(lv.rows), lv.solution).steps.length
      expect(flat).toBeGreaterThan(lv.max ?? 0)
    }
  })

  it('sinfga qarab bosqichlar', () => {
    expect(stages('arrows', 1)).toBe(ALL_LEVELS.STRAIGHT)
    expect(stages('arrows', 3)).toBe(ALL_LEVELS.TURNS)
    expect(maxDepth('arrows')).toBe(0)
    expect(maxDepth('nested')).toBe(2)
  })
})
