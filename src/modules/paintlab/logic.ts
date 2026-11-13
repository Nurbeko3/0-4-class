// «Paint asboblari» modulining sof mantiqi (React/DOM yo'q — vitest bilan tekshiriladi).
import type { MirrorPicture, Pt, Shape, ShapeType } from './pictures'

// ---------- Shakllar ----------

const dist = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y)

const box = (a: Pt, b: Pt) => ({
  x0: Math.min(a.x, b.x),
  y0: Math.min(a.y, b.y),
  x1: Math.max(a.x, b.x),
  y1: Math.max(a.y, b.y),
})

/** Juda qisqa tortish — tasodifiy bosish, shakl emas. */
export const tooSmall = (a: Pt, b: Pt, min = 6): boolean => dist(a, b) < min

/**
 * Chizilgan shakl (a -> b) namunadagi shaklga joyi bo'yicha mos keladimi.
 * Chiziq: ikkala uchi (istalgan tartibda) tol ichida. To'rtburchak/doira: to'rt tomoni tol ichida.
 */
export function fits(a: Pt, b: Pt, ghost: Shape, tol: number): boolean {
  if (ghost.type === 'line') {
    return (dist(a, ghost.a) <= tol && dist(b, ghost.b) <= tol) || (dist(a, ghost.b) <= tol && dist(b, ghost.a) <= tol)
  }
  const d = box(a, b)
  const g = box(ghost.a, ghost.b)
  // Kichik shaklda xato chegarasi ham kichrayadi — aks holda istalgan chiziq "mos" keladi
  const t = Math.min(tol, Math.max(5, Math.min(g.x1 - g.x0, g.y1 - g.y0) * 0.45))
  return Math.abs(d.x0 - g.x0) <= t && Math.abs(d.y0 - g.y0) <= t && Math.abs(d.x1 - g.x1) <= t && Math.abs(d.y1 - g.y1) <= t
}

export interface MatchResult {
  /** Mos kelgan shakl indeksi (yo'q bo'lsa -1) */
  index: number
  /** Joyi to'g'ri, lekin asbob boshqa */
  wrongTool: boolean
}

/** Chizilgan shaklni hali chizilmagan namunalar bilan solishtiradi. */
export function matchShape(tool: ShapeType, a: Pt, b: Pt, ghosts: Shape[], drawn: boolean[], tol: number): MatchResult {
  let other = -1
  for (let i = 0; i < ghosts.length; i++) {
    if (drawn[i] || !fits(a, b, ghosts[i], tol)) continue
    if (ghosts[i].type === tool) return { index: i, wrongTool: false }
    other = i
  }
  return { index: -1, wrongTool: other >= 0 }
}

// ---------- O'chirg'ich ----------

/** p nuqtadan a–b kesmagacha masofa. */
export function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len2 = dx * dx + dy * dy
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2))
  return dist(p, { x: a.x + t * dx, y: a.y + t * dy })
}

/** O'chirg'ich a -> b yo'lida r radius bilan o'tganda o'chgan nuqtalarni belgilaydi; nechta yangi o'chganini qaytaradi. */
export function eraseAlong(points: Pt[], erased: boolean[], a: Pt, b: Pt, r: number): number {
  let n = 0
  for (let i = 0; i < points.length; i++) {
    if (!erased[i] && distToSegment(points[i], a, b) <= r) {
      erased[i] = true
      n++
    }
  }
  return n
}

/** Tasodifiy to'lqinsimon chiziq (qoralama) nuqtalari. */
export function scribble(w: number, h: number, rnd: () => number = Math.random, step = 12): Pt[] {
  const margin = 50
  const start = { x: margin + rnd() * (w - margin * 2), y: margin + rnd() * (h - margin * 2) }
  const pts: Pt[] = [start]
  let angle = rnd() * Math.PI * 2
  const count = 40 + Math.floor(rnd() * 25)
  for (let i = 0; i < count; i++) {
    angle += (rnd() - 0.5) * 1.5
    const last = pts[pts.length - 1]
    let x = last.x + Math.cos(angle) * step
    let y = last.y + Math.sin(angle) * step
    // Chetga yetganda ichkariga qaytadi
    if (x < margin || x > w - margin || y < margin || y > h - margin) {
      angle += Math.PI / 2
      x = Math.max(margin, Math.min(w - margin, x))
      y = Math.max(margin, Math.min(h - margin, y))
    }
    pts.push({ x, y })
  }
  return pts
}

// ---------- Ko'zgu ----------

/** O'ng yarimdagi (x, y) katakda nima bo'lishi kerak: rang tartib raqami yoki 0 (bo'sh). x — o'qdan boshlab. */
export function mirrorWant(pic: MirrorPicture, x: number, y: number): number {
  const row = pic.half[y]
  const ch = row?.[row.length - 1 - x]
  return !ch || ch === '.' ? 0 : Number(ch)
}

/** Bo'yalishi kerak bo'lgan kataklar soni. */
export const mirrorCount = (pic: MirrorPicture): number => pic.half.join('').replaceAll('.', '').length

export const cellKey = (x: number, y: number): string => `${x}.${y}`

export function mirrorDone(pic: MirrorPicture, painted: Record<string, number>): boolean {
  for (let y = 0; y < pic.half.length; y++)
    for (let x = 0; x < pic.half[y].length; x++) if ((painted[cellKey(x, y)] ?? 0) !== mirrorWant(pic, x, y)) return false
  return true
}
