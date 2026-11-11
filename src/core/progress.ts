import { useSyncExternalStore } from 'react'
import type { Lang } from '../i18n/strings'

// Butun holat bitta localStorage kalitida. Akkaunt yo'q, server yo'q.
export interface State {
  v: 1
  lang: Lang
  /** "sinf:o'yin" -> necha marta bajarilgan */
  done: Record<string, number>
  lockedGrades: number[]
  /** "sinf:o'yin" ko'rinishidagi qulflangan darajalar */
  lockedLevels: string[]
  /** O'qituvchi PIN-kodi (faqat /teacher uchun) */
  pin: string | null
}

const KEY = 'kbt.state.v1'
const initial: State = { v: 1, lang: 'uz', done: {}, lockedGrades: [], lockedLevels: [], pin: null }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.v === 1) return { ...initial, ...parsed }
    }
  } catch {
    /* localStorage yo'q yoki buzilgan — boshidan boshlaymiz */
  }
  return initial
}

let state = load()
const subs = new Set<() => void>()

export const getState = () => state

export function setState(patch: Partial<State> | ((s: State) => Partial<State>)) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* saqlab bo'lmadi — o'yin baribir davom etadi */
  }
  subs.forEach((f) => f())
}

export function useStore() {
  return useSyncExternalStore((f) => {
    subs.add(f)
    return () => subs.delete(f)
  }, getState)
}

export const levelKey = (grade: number, game: string) => `${grade}:${game}`

export function markDone(grade: number, game: string) {
  const k = levelKey(grade, game)
  setState((s) => ({ done: { ...s.done, [k]: (s.done[k] ?? 0) + 1 } }))
}

export const isDone = (s: State, grade: number, game: string) => (s.done[levelKey(grade, game)] ?? 0) > 0
export const isGradeLocked = (s: State, grade: number) => s.lockedGrades.includes(grade)
export const isLevelLocked = (s: State, grade: number, game: string) =>
  isGradeLocked(s, grade) || s.lockedLevels.includes(levelKey(grade, game))

export function resetProgress() {
  setState({ done: {} })
}

// ---------- O'qituvchi rejimi ----------

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])

export function toggleGradeLock(grade: number) {
  setState((s) => ({ lockedGrades: toggle(s.lockedGrades, grade) }))
}

export function toggleLevelLock(grade: number, game: string) {
  setState((s) => ({ lockedLevels: toggle(s.lockedLevels, levelKey(grade, game)) }))
}

// PIN to'g'ri kiritilgani shu brauzer tabi yopilguncha eslab qolinadi.
// O'qituvchi qulflangan darajani ham proyektorda ko'rsata oladi.
const TEACHER_KEY = 'kbt.teacher'

export function teacherUnlocked() {
  try {
    return sessionStorage.getItem(TEACHER_KEY) === '1'
  } catch {
    return false
  }
}

export function setTeacherUnlocked(on: boolean) {
  try {
    if (on) sessionStorage.setItem(TEACHER_KEY, '1')
    else sessionStorage.removeItem(TEACHER_KEY)
  } catch {
    /* sessionStorage yo'q */
  }
}
