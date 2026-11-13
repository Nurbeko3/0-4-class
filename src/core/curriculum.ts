// Sinf -> mavzular -> darajalar. Yangi modul qurilganda shu yerga qo'shiladi.

export type GameId =
  | 'mouse.point'
  | 'mouse.click'
  | 'mouse.dbl'
  | 'mouse.right'
  | 'mouse.drag'
  | 'mouse.scroll'
  | 'kbd.find.lat'
  | 'kbd.find.cyr'
  | 'kbd.special'
  | 'kbd.word.lat'
  | 'kbd.word.cyr'
  | 'parts.match'
  | 'parts.name'
  | 'parts.use'
  | 'robot.arrows'
  | 'robot.repeat'
  | 'robot.nested'
  | 'desk.open'
  | 'desk.file'
  | 'desk.sort'
  | 'safety.quiz'
  | 'paint.free'
  | 'paint.numbers'
  | 'paintlab.fill'
  | 'paintlab.shapes'
  | 'paintlab.eraser'
  | 'paintlab.mirror'
  | 'logic.odd'
  | 'logic.pattern'
  | 'logic.memory'
  | 'excel.cell'
  | 'excel.type'
  | 'excel.sum'
  | 'excel.chart'
  | 'word.format'
  | 'word.align'
  | 'word.poster'
  | 'keys.copy'
  | 'keys.cut'
  | 'keys.undo'
  | 'keys.save'

export type TopicId = 'mouse' | 'keyboard' | 'parts' | 'desktop' | 'paint' | 'word' | 'keys' | 'logic' | 'robot' | 'excel' | 'safety'

export interface Topic {
  id: TopicId
  levels: GameId[]
}

export const GRADES = [0, 1, 2, 3, 4] as const

const ALL_MOUSE: GameId[] = ['mouse.point', 'mouse.click', 'mouse.dbl', 'mouse.right', 'mouse.drag', 'mouse.scroll']
// Klaviatura: 1-sinf — harf topish; 2–4-sinf — + maxsus tugmalar va so'z yozish (qiyinligi sinfga qarab).
const KBD_FIND: GameId[] = ['kbd.find.lat', 'kbd.find.cyr']
const KBD_ALL: GameId[] = [...KBD_FIND, 'kbd.special', 'kbd.word.lat', 'kbd.word.cyr']
// Algoritm: 1–2-sinf — strelkalar; 3-sinf — + takrorlash; 4-sinf — + ichma-ich takrorlash.
const ROBOT_1: GameId[] = ['robot.arrows']
const ROBOT_3: GameId[] = [...ROBOT_1, 'robot.repeat']
const ROBOT_4: GameId[] = [...ROBOT_3, 'robot.nested']

// Mantiq: hamma sinfda uch daraja, qiyinligi sinfga qarab o'sadi.
const LOGIC: GameId[] = ['logic.odd', 'logic.pattern', 'logic.memory']
// Rasm: erkin rasm va raqamli bo'yash — hamma sinfda; Paint asboblari 1-sinfdan qo'shila boradi.
const PAINT_0: GameId[] = ['paint.free', 'paint.numbers']
const PAINT_1: GameId[] = [...PAINT_0, 'paintlab.fill', 'paintlab.shapes']
const PAINT_2: GameId[] = [...PAINT_1, 'paintlab.eraser']
const PAINT_3: GameId[] = [...PAINT_2, 'paintlab.mirror']
// Jadval (Excel): 3–4-sinf.
const EXCEL: GameId[] = ['excel.cell', 'excel.type', 'excel.sum', 'excel.chart']
// Matn muharriri (Word): 2-sinfdan; tezkor tugmalar (Ctrl+C va h.k.): 3–4-sinf.
const WORD_2: GameId[] = ['word.format', 'word.align']
const WORD_3: GameId[] = [...WORD_2, 'word.poster']
const KEYS_3: GameId[] = ['keys.copy', 'keys.cut', 'keys.undo']
const KEYS_4: GameId[] = [...KEYS_3, 'keys.save']

// Darajasi bo'sh mavzu xaritada "Tez kunda" bo'lib ko'rinadi.
export const CURRICULUM: Record<number, Topic[]> = {
  0: [
    { id: 'mouse', levels: ['mouse.point', 'mouse.click', 'mouse.drag'] },
    { id: 'parts', levels: ['parts.match'] },
    { id: 'paint', levels: PAINT_0 },
    { id: 'logic', levels: LOGIC },
  ],
  1: [
    { id: 'mouse', levels: ALL_MOUSE },
    { id: 'keyboard', levels: KBD_FIND },
    { id: 'parts', levels: ['parts.match', 'parts.name'] },
    { id: 'paint', levels: PAINT_1 },
    { id: 'logic', levels: LOGIC },
    { id: 'robot', levels: ROBOT_1 },
  ],
  2: [
    { id: 'mouse', levels: ALL_MOUSE },
    { id: 'keyboard', levels: KBD_ALL },
    { id: 'parts', levels: ['parts.name'] },
    { id: 'desktop', levels: ['desk.open', 'desk.file'] },
    { id: 'word', levels: WORD_2 },
    { id: 'paint', levels: PAINT_2 },
    { id: 'logic', levels: LOGIC },
    { id: 'robot', levels: ROBOT_1 },
  ],
  3: [
    { id: 'mouse', levels: ALL_MOUSE },
    { id: 'keyboard', levels: KBD_ALL },
    { id: 'keys', levels: KEYS_3 },
    { id: 'parts', levels: ['parts.name', 'parts.use'] },
    { id: 'desktop', levels: ['desk.open', 'desk.file', 'desk.sort'] },
    { id: 'word', levels: WORD_3 },
    { id: 'paint', levels: PAINT_3 },
    { id: 'logic', levels: LOGIC },
    { id: 'robot', levels: ROBOT_3 },
    { id: 'excel', levels: EXCEL },
    { id: 'safety', levels: ['safety.quiz'] },
  ],
  4: [
    { id: 'keyboard', levels: KBD_ALL },
    { id: 'keys', levels: KEYS_4 },
    { id: 'parts', levels: ['parts.name', 'parts.use'] },
    { id: 'desktop', levels: ['desk.open', 'desk.file', 'desk.sort'] },
    { id: 'word', levels: WORD_3 },
    { id: 'paint', levels: PAINT_3 },
    { id: 'logic', levels: LOGIC },
    { id: 'robot', levels: ROBOT_4 },
    { id: 'excel', levels: EXCEL },
    { id: 'safety', levels: ['safety.quiz'] },
  ],
}

export const gradeLevels = (grade: number): GameId[] => (CURRICULUM[grade] ?? []).flatMap((t) => t.levels)

export function nextLevel(grade: number, game: GameId): GameId | null {
  const all = gradeLevels(grade)
  const i = all.indexOf(game)
  return i >= 0 && i < all.length - 1 ? all[i + 1] : null
}
