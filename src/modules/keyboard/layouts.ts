// Klaviatura joylashuvlari va sof mantiq (React yo'q — vitest bilan tekshiriladi).
// Tugma bosilishi event.key bo'yicha tekshiriladi (bola qaysi belgini terdi),
// ekrandagi yoritish esa joylashuv bo'yicha (tugma qayerda turibdi).

export type Script = 'lat' | 'cyr'

/** Maxsus tugmalar event.key qiymati bilan yoziladi. */
export const SPACE = ' '
export const ENTER = 'Enter'
export const BACKSPACE = 'Backspace'

export interface KeyDef {
  /** Fizik tugma (KeyboardEvent.code) — faqat ekranda joyini topish uchun */
  code: string
  /** Shu joylashuvda teriladigan belgi (kichik harf) yoki maxsus tugma nomi */
  char: string
  /** Tugma ustidagi yozuv */
  label: string
  /** Eni (oddiy tugma = 1) */
  w?: number
}

const CODES: string[][] = [
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
  ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash'],
]

const CHARS: Record<Script, string[]> = {
  lat: ['qwertyuiop[]', "asdfghjkl;'", 'zxcvbnm,./'],
  cyr: ['йцукенгшщзхъ', 'фывапролджэ', 'ячсмитьбю.'],
}

/** O'zbek lotin yozuvidagi apostrof (o’, g’) klaviaturada shu belgilardan biri bo'lib keladi. */
const APOSTROPHES = "'’‘ʻʼ`"

function build(script: Script): KeyDef[][] {
  const rows = CODES.map((codes, r) =>
    codes.map((code, i): KeyDef => {
      const char = CHARS[script][r][i]
      return { code, char, label: char === "'" ? '’' : char.toUpperCase() }
    }),
  )
  rows[0].push({ code: 'Backspace', char: BACKSPACE, label: 'Backspace', w: 2 })
  rows[1].push({ code: 'Enter', char: ENTER, label: 'Enter', w: 2.2 })
  rows.push([{ code: 'Space', char: SPACE, label: '', w: 7 }])
  return rows
}

export const LAYOUTS: Record<Script, KeyDef[][]> = { lat: build('lat'), cyr: build('cyr') }

/** Belgini bir xil ko'rinishga keltiradi: kichik harf, har xil apostroflar -> ' */
export function normalize(ch: string): string {
  if (ch.length === 1 && APOSTROPHES.includes(ch)) return "'"
  if (ch === ENTER || ch === BACKSPACE) return ch
  return ch.toLowerCase()
}

/** Kutilgan belgi shu joylashuvda qaysi tugmada turadi. */
export function findKey(script: Script, ch: string): KeyDef | null {
  const want = normalize(ch)
  for (const row of LAYOUTS[script]) for (const k of row) if (k.char === want) return k
  return null
}

/** Bosilgan tugma (event.key) kutilgan belgiga mos keladimi. */
export const matches = (expected: string, pressed: string): boolean => normalize(expected) === normalize(pressed)

/** Belgi qaysi alifboga tegishli (harf bo'lmasa — null). */
export function scriptOf(ch: string): Script | null {
  const c = ch.toLowerCase()
  if (c.length !== 1) return null
  if (c >= 'a' && c <= 'z') return 'lat'
  if ((c >= 'а' && c <= 'я') || c === 'ё' || 'ўқғҳ'.includes(c)) return 'cyr'
  return null
}

/** Bola boshqa raskladkada teryaptimi: daraja bitta alifboda, bosilgan harf boshqasida. */
export function isWrongScript(want: Script, pressed: string): boolean {
  const got = scriptOf(pressed)
  return got !== null && got !== want
}

/** Matnni terish: to'g'ri tugma bo'lsa keyingi o'ringa o'tadi, bo'lmasa joyida qoladi. */
export function advance(target: string, pos: number, pressed: string): number {
  return pos < target.length && matches(target[pos], pressed) ? pos + 1 : pos
}

/** Harf topish o'yini uchun harflar (maxsus belgilarsiz). */
export function letters(script: Script): string[] {
  return LAYOUTS[script].flat().map((k) => k.char).filter((c) => scriptOf(c) === script)
}
