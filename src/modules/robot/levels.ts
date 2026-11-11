import type { Cmd } from './interpreter'

export type RobotGameId = 'arrows' | 'repeat' | 'nested'

export interface Level {
  /** S — robot, G — marra, # — devor, . — bo'sh katak */
  rows: string[]
  /** Bloklar soni chegarasi (takrorlashsiz sig'maydi). Yo'q bo'lsa — cheklanmagan. */
  max?: number
  /** Namuna yechim — testda darajaning yechilishi tekshiriladi */
  solution: Cmd[]
}

const rep = (repeat: number, ...body: Cmd[]): Cmd => ({ repeat, body })

// 1-sinf: 2–3 qadamli to'g'ri yo'l
const STRAIGHT: Level[] = [
  { rows: ['....', 'S.G.', '....'], solution: ['right', 'right'] },
  { rows: ['.G..', '....', '.S..'], solution: ['up', 'up'] },
  { rows: ['.....', 'S..G.', '.....'], solution: ['right', 'right', 'right'] },
]

// 2-sinfdan: burilishli yo'l va to'siqlar
const TURNS: Level[] = [
  { rows: ['S..#.', '##.#.', '..G..', '.....'], solution: ['right', 'right', 'down', 'down'] },
  {
    rows: ['..#G.', 'S.#..', '..#..', '.....'],
    solution: ['down', 'down', 'right', 'right', 'right', 'up', 'up', 'up'],
  },
  {
    rows: ['S#...', '.#.#.', '.#.#G', '...#.'],
    solution: ['down', 'down', 'down', 'right', 'right', 'up', 'up', 'up', 'right', 'right', 'down', 'down'],
  },
]

// 3-sinfdan: takrorlash bloki. Bloklar soni cheklangan — takrorlashsiz sig'maydi.
const REPEAT: Level[] = [
  { rows: ['.......', 'S.....G', '.......'], max: 2, solution: [rep(6, 'right')] },
  { rows: ['###G', '##..', '#..#', 'S.##'], max: 3, solution: [rep(3, 'right', 'up')] },
  { rows: ['S....', '####.', '####.', '####G'], max: 4, solution: [rep(4, 'right'), rep(3, 'down')] },
]

// 4-sinf: takrorlash ichida takrorlash
const NESTED: Level[] = [
  { rows: ['S...###', '###....', '######G'], max: 4, solution: [rep(2, rep(3, 'right'), 'down')] },
  { rows: ['####G', '####.', '##...', '##.##', 'S..##'], max: 5, solution: [rep(2, rep(2, 'right'), rep(2, 'up'))] },
  { rows: ['S..####', '##...##', '####...', '######G'], max: 4, solution: [rep(3, rep(2, 'right'), 'down')] },
]

export const ALL_LEVELS: Record<string, Level[]> = { STRAIGHT, TURNS, REPEAT, NESTED }

/** Shu o'yin va sinf uchun ketma-ket bosqichlar. */
export function stages(game: RobotGameId, grade: number): Level[] {
  if (game === 'repeat') return REPEAT
  if (game === 'nested') return NESTED
  return grade <= 1 ? STRAIGHT : TURNS
}

/** Takrorlash bloklarining ruxsat etilgan chuqurligi. */
export const maxDepth = (game: RobotGameId): number => (game === 'nested' ? 2 : game === 'repeat' ? 1 : 0)
