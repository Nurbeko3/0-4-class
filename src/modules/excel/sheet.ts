// «Jadval» modulining sof mantiqi (React yo'q — vitest bilan tekshiriladi).

export const LETTERS = 'ABCDEFGH'

export interface Cell {
  col: number
  row: number
}

type Rnd = () => number

/** Katak manzili: avval ustun harfi, keyin qator raqami — B3. */
export const addr = (c: Cell): string => `${LETTERS[c.col]}${c.row + 1}`

export const same = (a: Cell | null, b: Cell | null): boolean => !!a && !!b && a.col === b.col && a.row === b.row

function shuffled<T>(arr: T[], rnd: Rnd): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Jadvaldan n ta har xil katak (fromCol — birinchi ruxsat etilgan ustun). */
export function pickCells(cols: number, rows: number, n: number, rnd: Rnd = Math.random, fromCol = 0): Cell[] {
  const all: Cell[] = []
  for (let row = 0; row < rows; row++) for (let col = fromCol; col < cols; col++) all.push({ col, row })
  return shuffled(all, rnd).slice(0, n)
}

/**
 * Manzilni tanlash uchun uchta variant: to'g'risi, qo'shni ustun va qo'shni qator.
 * Chalg'ituvchilar ataylab o'xshash — bola harfni ham, raqamni ham o'qishi kerak.
 */
export function addrOptions(c: Cell, cols: number, rows: number, rnd: Rnd = Math.random): string[] {
  const otherCol = (c.col + 1 + Math.floor(rnd() * (cols - 1))) % cols
  const otherRow = (c.row + 1 + Math.floor(rnd() * (rows - 1))) % rows
  return shuffled([addr(c), addr({ col: otherCol, row: c.row }), addr({ col: c.col, row: otherRow })], rnd)
}

/** [min, max] oralig'idan n ta son. */
export function numbers(n: number, min: number, max: number, rnd: Rnd = Math.random): number[] {
  return Array.from({ length: n }, () => min + Math.floor(rnd() * (max - min + 1)))
}

export const total = (nums: number[]): number => nums.reduce((a, b) => a + b, 0)

/** Diagramma uchun 1..max dan n ta HAR XIL son — «eng ko'pi» bitta bo'lsin. */
export function chartValues(n: number, max: number, rnd: Rnd = Math.random): number[] {
  return shuffled(
    Array.from({ length: max }, (_, i) => i + 1),
    rnd,
  ).slice(0, n)
}

export interface TypeTask {
  cell: Cell
  value: number
}

/** «Katakka yozish» topshiriqlari: 3-sinf — B ustuni, bir xonali; 4-sinf — B va C, ikki xonali. */
export function typeTasks(grade: number, rows: number, rnd: Rnd = Math.random): TypeTask[] {
  const hard = grade >= 4
  const cells = pickCells(hard ? 3 : 2, rows, hard ? 5 : 4, rnd, 1)
  const values = hard ? numbers(cells.length, 10, 99, rnd) : shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9], rnd)
  return cells.map((cell, i) => ({ cell, value: values[i] }))
}

export const ENTER = 'Enter'
export const BACKSPACE = 'Backspace'
export const isDigit = (k: string): boolean => k.length === 1 && k >= '0' && k <= '9'

/** Katakdagi yozuv: raqam qo'shiladi (maxLen gacha), Backspace oxirgisini o'chiradi. */
export function typeInput(cur: string, key: string, maxLen = 2): string {
  if (key === BACKSPACE) return cur.slice(0, -1)
  if (!isDigit(key) || cur.length >= maxLen) return cur
  // Boshida nol bo'lmaydi: "0" dan keyin raqam uni almashtiradi
  return cur === '0' ? key : cur + key
}
