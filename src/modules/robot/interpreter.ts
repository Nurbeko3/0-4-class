// Robot dasturining sof mantig'i (React yo'q — vitest bilan tekshiriladi):
// panjara + buyruqlar ro'yxati -> qadamlar ketma-ketligi va natija.

export type Dir = 'up' | 'down' | 'left' | 'right'
export interface Repeat {
  repeat: number
  body: Cmd[]
}
export type Cmd = Dir | Repeat

export const isRepeat = (c: Cmd): c is Repeat => typeof c !== 'string'

export interface Point {
  x: number
  y: number
}

export interface Grid {
  w: number
  h: number
  start: Point
  goal: Point
  /** walls[y][x] */
  walls: boolean[][]
}

/** Panjara matn bilan beriladi: S — robot, G — marra, # — devor, . — bo'sh katak. */
export function parseGrid(rows: readonly string[]): Grid {
  let start: Point | null = null
  let goal: Point | null = null
  const walls = rows.map((row, y) =>
    [...row].map((ch, x) => {
      if (ch === 'S') start = { x, y }
      if (ch === 'G') goal = { x, y }
      return ch === '#'
    }),
  )
  if (!start || !goal) throw new Error('Panjarada S va G bo’lishi shart')
  return { w: rows[0].length, h: rows.length, start, goal, walls }
}

const DELTA: Record<Dir, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }

export interface Step {
  /** Bajarilayotgan buyruqning dasturdagi yo'li (ichma-ich bloklar uchun indekslar) */
  path: number[]
  dir: Dir
  /** Qadamdan keyingi joy (urilganda — o'zgarmaydi) */
  to: Point
  /** Devorga yoki chetga urildi */
  bump: boolean
}

export type Result = 'goal' | 'bump' | 'short'

export interface Run {
  steps: Step[]
  result: Result
}

const MAX_STEPS = 400

/**
 * Dasturni bajaradi. Robot marraga yetishi bilan to'xtaydi (ortiqcha buyruq
 * xato emas), devorga urilsa — shu qadamda to'xtaydi, dastur tugab marraga
 * yetmagan bo'lsa — 'short'.
 */
export function run(grid: Grid, program: readonly Cmd[]): Run {
  const steps: Step[] = []
  let pos = grid.start
  let result: Result | null = null

  const exec = (cmds: readonly Cmd[], path: number[]) => {
    for (let i = 0; i < cmds.length && result === null; i++) {
      const c = cmds[i]
      if (isRepeat(c)) {
        for (let n = 0; n < c.repeat && result === null; n++) exec(c.body, [...path, i])
        continue
      }
      if (steps.length >= MAX_STEPS) {
        result = 'short'
        return
      }
      const d = DELTA[c]
      const to = { x: pos.x + d.x, y: pos.y + d.y }
      const blocked = to.x < 0 || to.y < 0 || to.x >= grid.w || to.y >= grid.h || grid.walls[to.y][to.x]
      steps.push({ path: [...path, i], dir: c, to: blocked ? pos : to, bump: blocked })
      if (blocked) result = 'bump'
      else {
        pos = to
        if (pos.x === grid.goal.x && pos.y === grid.goal.y) result = 'goal'
      }
    }
  }
  exec(program, [])
  return { steps, result: result ?? 'short' }
}

/** Dasturdagi bloklar soni: har bir strelka va har bir takrorlash bloki — bittadan. */
export const size = (program: readonly Cmd[]): number =>
  program.reduce((n, c) => n + 1 + (isRepeat(c) ? size(c.body) : 0), 0)

// ---------- Dasturni tahrirlash (o'zgarmas daraxt) ----------
// `open` — hozir ochiq turgan takrorlash bloklarining yo'li; yangi buyruq
// eng ichkaridagi ochiq blokka qo'shiladi.

function update(program: readonly Cmd[], path: readonly number[], f: (body: Cmd[]) => Cmd[]): Cmd[] {
  if (path.length === 0) return f([...program])
  const [i, ...rest] = path
  return program.map((c, j) => (j === i && isRepeat(c) ? { ...c, body: update(c.body, rest, f) } : c))
}

function bodyAt(program: readonly Cmd[], path: readonly number[]): readonly Cmd[] {
  let body = program
  for (const i of path) {
    const c = body[i]
    if (!c || !isRepeat(c)) return []
    body = c.body
  }
  return body
}

/** Buyruq qo'shadi; takrorlash bloki qo'shilsa, u ochiq bo'lib qoladi. */
export function append(program: readonly Cmd[], open: readonly number[], cmd: Cmd): { program: Cmd[]; open: number[] } {
  const at = bodyAt(program, open).length
  return { program: update(program, open, (b) => [...b, cmd]), open: isRepeat(cmd) ? [...open, at] : [...open] }
}

/** Oxirgi buyruqni o'chiradi; ochiq blok bo'sh bo'lsa — blokning o'zini. */
export function removeLast(program: readonly Cmd[], open: readonly number[]): { program: Cmd[]; open: number[] } {
  if (bodyAt(program, open).length === 0) {
    if (open.length === 0) return { program: [], open: [] }
    const parent = open.slice(0, -1)
    return { program: update(program, parent, (b) => b.slice(0, -1)), open: parent }
  }
  return { program: update(program, open, (b) => b.slice(0, -1)), open: [...open] }
}

/** Takrorlash blokining sonini o'zgartiradi. */
export function setCount(program: readonly Cmd[], path: readonly number[], n: number): Cmd[] {
  const parent = path.slice(0, -1)
  const i = path[path.length - 1]
  return update(program, parent, (b) => b.map((c, j) => (j === i && isRepeat(c) ? { ...c, repeat: n } : c)))
}
