// Tezkor tugmalar: sof mantiq (qaysi tugma bosildi, o'yin holatlari). React'ga bog'liq emas.

export const LETTERS = ['A', 'C', 'V', 'X', 'Z', 'S'] as const
export type Letter = (typeof LETTERS)[number]

// Rus raskladkasida shu tugmalarda turgan harflar (event.code bo'lmagan holat uchun)
const CYR: Record<string, Letter> = { ф: 'A', с: 'C', м: 'V', ч: 'X', я: 'Z', ы: 'S' }

/**
 * Bosilgan tugmadan o'yin harfini aniqlaydi. Avvalo tugmaning JOYI (event.code)
 * olinadi — shunda Ctrl+C rus raskladkasida ham ishlaydi; code bo'lmasa — harfning o'zi.
 */
export function letterOf(code: string, key = ''): Letter | null {
  const m = /^Key([A-Z])$/.exec(code)
  const l = m ? m[1] : (CYR[key.toLowerCase()] ?? key.toUpperCase())
  return (LETTERS as readonly string[]).includes(l) ? (l as Letter) : null
}

// ---------- Nusxa ko'paytirish: Ctrl+C, keyin Ctrl+V ----------

export interface CopyState {
  clip: boolean
  filled: number
  need: number
}

export type CopyFx = 'copy' | 'paste' | 'full' | 'nocopy' | 'wrong'

export const copyStart = (need: number): CopyState => ({ clip: false, filled: 0, need })

export function copyPress(s: CopyState, l: Letter): [CopyState, CopyFx] {
  if (s.filled >= s.need) return [s, 'wrong']
  if (l === 'C') return [{ ...s, clip: true }, 'copy']
  if (l !== 'V') return [s, 'wrong']
  if (!s.clip) return [s, 'nocopy']
  const filled = s.filled + 1
  return [{ ...s, filled }, filled >= s.need ? 'full' : 'paste']
}

/** Har raundda nechta bo'sh joy. */
export const copyRounds = (grade: number): number[] => (grade <= 3 ? [2, 3, 4] : [3, 4, 5])

// ---------- Ko'chirish: bosish, Ctrl+X, uyni bosish, Ctrl+V ----------

export type CutStep = 'pick' | 'cut' | 'place' | 'paste' | 'done'
export type CutEvent = { t: 'item' } | { t: 'home'; right: boolean } | { t: 'key'; l: Letter }

/** Keyingi qadam; harakat hozirgi qadamga mos kelmasa — null. */
export function cutNext(step: CutStep, e: CutEvent): CutStep | null {
  if (step === 'pick') return e.t === 'item' ? 'cut' : null
  if (step === 'cut') return e.t === 'key' && e.l === 'X' ? 'place' : null
  if (step === 'place') return e.t === 'home' && e.right ? 'paste' : null
  if (step === 'paste') return e.t === 'key' && e.l === 'V' ? 'done' : null
  return null
}

/** Shu qadamda kutilayotgan tugma (sichqoncha qadamlarida — null). */
export const cutKey = (step: CutStep): Letter | null => (step === 'cut' ? 'X' : step === 'paste' ? 'V' : null)

export const cutRounds = (grade: number): number => (grade <= 3 ? 3 : 4)

// ---------- Ortga qaytarish ----------

/** Har raundda nechta dog'. */
export const undoRounds = (grade: number): number[] => (grade <= 3 ? [2, 3, 4] : [3, 4, 5])

// ---------- Belgilash va saqlash: Ctrl+A, C, V, S ----------

export const SAVE_SEQ: Letter[] = ['A', 'C', 'V', 'S']
