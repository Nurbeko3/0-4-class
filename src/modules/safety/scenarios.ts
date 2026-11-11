import type { StrKey } from '../../i18n/strings'

// Internet xavfsizligi vaziyatlari. Barcha matn strings.ts da:
//   say.safety.<id>       — vaziyat (savol), ovoz bilan o'qiladi
//   safety.<id>.a/b/c     — javob kartalari (a — har doim to'g'ri javob)
//   say.safety.<id>.yes   — to'g'ri javobdan keyingi tushuntirish
//   say.safety.<id>.no    — noto'g'ri javobdan keyingi tushuntirish
export const SCENARIO_IDS = ['stranger', 'password', 'prize', 'file', 'bully', 'meet', 'photo', 'time'] as const

export type ScenarioId = (typeof SCENARIO_IDS)[number]

export interface Option {
  text: StrKey
  ok: boolean
}

export interface Scenario {
  id: ScenarioId
  ask: StrKey
  yes: StrKey
  no: StrKey
  options: Option[]
}

/** Uchta javobli vaziyatlar (qolganlarida ikkitadan). */
const THREE: readonly ScenarioId[] = ['stranger', 'prize', 'bully']

export const SCENARIOS: Scenario[] = SCENARIO_IDS.map((id) => ({
  id,
  ask: `say.safety.${id}`,
  yes: `say.safety.${id}.yes`,
  no: `say.safety.${id}.no`,
  options: [
    { text: `safety.${id}.a` as StrKey, ok: true },
    { text: `safety.${id}.b` as StrKey, ok: false },
    ...(THREE.includes(id) ? [{ text: `safety.${id}.c` as StrKey, ok: false }] : []),
  ],
}))

/** 3-sinf — birinchi 5 vaziyat, 4-sinf — hammasi. */
export const pickScenarios = (grade: number): Scenario[] => (grade >= 4 ? SCENARIOS : SCENARIOS.slice(0, 5))
