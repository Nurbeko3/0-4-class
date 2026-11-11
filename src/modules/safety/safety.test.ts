import { describe, expect, it } from 'vitest'
import { strings } from '../../i18n/strings'
import { SCENARIOS, pickScenarios } from './scenarios'

describe('internet xavfsizligi vaziyatlari', () => {
  it('kamida 8 ta vaziyat; 3-sinfda 5 tasi, 4-sinfda hammasi', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(8)
    expect(pickScenarios(3)).toHaveLength(5)
    expect(pickScenarios(4)).toHaveLength(SCENARIOS.length)
  })

  it('har vaziyatda 2–3 javob va faqat bittasi to’g’ri', () => {
    for (const s of SCENARIOS) {
      expect(s.options.length, s.id).toBeGreaterThanOrEqual(2)
      expect(s.options.length, s.id).toBeLessThanOrEqual(3)
      expect(s.options.filter((o) => o.ok), s.id).toHaveLength(1)
    }
  })

  it('barcha matnlar ikkala tilda bor', () => {
    for (const s of SCENARIOS)
      for (const key of [s.ask, s.yes, s.no, ...s.options.map((o) => o.text)])
        for (const lang of ['uz', 'ru'] as const) expect(strings[lang][key], `${lang} ${key}`).toBeTruthy()
  })
})
