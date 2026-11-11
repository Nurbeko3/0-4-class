import { describe, expect, it } from 'vitest'
import { CURRICULUM, GRADES, gradeLevels, nextLevel } from './curriculum'
import { getState, isDone, isLevelLocked, markDone, resetProgress, setState } from './progress'
import { strings } from '../i18n/strings'

describe('curriculum', () => {
  it('har sinf uchun mavzular bor', () => {
    for (const g of GRADES) expect(CURRICULUM[g].length).toBeGreaterThan(0)
  })

  it('0-sinfda faqat oddiy sichqoncha mashqlari', () => {
    expect(CURRICULUM[0][0].levels).toEqual(['mouse.point', 'mouse.click', 'mouse.drag'])
  })

  it('nextLevel oxirgi darajada null qaytaradi', () => {
    expect(nextLevel(0, 'mouse.point')).toBe('mouse.click')
    // mavzu tugasa, keyingi mavzuning birinchi darajasiga o'tadi
    expect(nextLevel(0, 'mouse.drag')).toBe('parts.match')
    expect(nextLevel(0, gradeLevels(0).at(-1)!)).toBeNull()
  })
})

describe('progress', () => {
  it('bajarilgan daraja saqlanadi va tozalanadi', () => {
    markDone(1, 'mouse.click')
    expect(isDone(getState(), 1, 'mouse.click')).toBe(true)
    expect(isDone(getState(), 2, 'mouse.click')).toBe(false)
    resetProgress()
    expect(isDone(getState(), 1, 'mouse.click')).toBe(false)
  })

  it('sinf qulflansa, uning barcha darajalari yopiladi', () => {
    setState({ lockedGrades: [2], lockedLevels: ['1:mouse.dbl'] })
    expect(isLevelLocked(getState(), 2, 'mouse.click')).toBe(true)
    expect(isLevelLocked(getState(), 1, 'mouse.dbl')).toBe(true)
    expect(isLevelLocked(getState(), 1, 'mouse.click')).toBe(false)
    setState({ lockedGrades: [], lockedLevels: [] })
  })
})

describe('i18n', () => {
  it('uz va ru kalitlari bir xil', () => {
    expect(Object.keys(strings.ru).sort()).toEqual(Object.keys(strings.uz).sort())
  })
})
