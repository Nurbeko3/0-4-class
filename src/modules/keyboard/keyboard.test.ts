import { describe, expect, it } from 'vitest'
import { BACKSPACE, ENTER, LAYOUTS, SPACE, advance, findKey, isWrongScript, letters, matches, scriptOf } from './layouts'
import { ALL_TEXTS, pickTexts } from './words'

describe('klaviatura joylashuvi', () => {
  it('lotin va kirill bir xil fizik tugmalarda turadi', () => {
    expect(LAYOUTS.lat.map((r) => r.map((k) => k.code))).toEqual(LAYOUTS.cyr.map((r) => r.map((k) => k.code)))
  })

  it('harf o’z joylashuvidagi tugmada topiladi', () => {
    expect(findKey('lat', 'A')?.code).toBe('KeyA')
    expect(findKey('cyr', 'ф')?.code).toBe('KeyA')
    expect(findKey('cyr', 'Й')?.code).toBe('KeyQ')
    expect(findKey('lat', 'ф')).toBeNull()
  })

  it('maxsus tugmalar va apostrof topiladi', () => {
    expect(findKey('lat', SPACE)?.code).toBe('Space')
    expect(findKey('cyr', ENTER)?.code).toBe('Enter')
    expect(findKey('lat', BACKSPACE)?.code).toBe('Backspace')
    expect(findKey('lat', '’')?.code).toBe('Quote')
  })

  it('har alifboda 26 / 32 ta harf bor', () => {
    expect(letters('lat')).toHaveLength(26)
    expect(letters('cyr')).toHaveLength(32)
  })
})

describe('tugmani tekshirish', () => {
  it('katta-kichik harf farq qilmaydi', () => {
    expect(matches('a', 'A')).toBe(true)
    expect(matches('Ж', 'ж')).toBe(true)
    expect(matches('a', 'ф')).toBe(false)
  })

  it('apostrofning barcha ko’rinishlari qabul qilinadi', () => {
    for (const a of ["'", '’', 'ʻ', '`']) expect(matches('’', a)).toBe(true)
  })

  it('boshqa raskladka aniqlanadi', () => {
    expect(scriptOf('q')).toBe('lat')
    expect(scriptOf('й')).toBe('cyr')
    expect(scriptOf('1')).toBeNull()
    expect(isWrongScript('lat', 'ф')).toBe(true)
    expect(isWrongScript('cyr', 'a')).toBe(true)
    expect(isWrongScript('lat', 'a')).toBe(false)
    expect(isWrongScript('lat', ENTER)).toBe(false)
    expect(isWrongScript('lat', SPACE)).toBe(false)
  })

  it('so’z harfma-harf teriladi, xato tugma joyida qoldiradi', () => {
    let pos = 0
    for (const k of ['o', 'x', "'", 'Y', 'i', 'n']) pos = advance('o’yin', pos, k)
    expect(pos).toBe(5)
    expect(advance('o’yin', 5, 'n')).toBe(5)
  })
})

describe('so’zlar', () => {
  it('har bir belgi o’z joylashuvida teriladigan', () => {
    for (const script of ['lat', 'cyr'] as const)
      for (const text of ALL_TEXTS[script]) for (const ch of text) expect(findKey(script, ch), `${text}: ${ch}`).not.toBeNull()
  })

  it('2-sinfda gap yo’q, 3–4-sinfda bor', () => {
    expect(pickTexts(2, 'lat').some((t) => t.includes(' '))).toBe(false)
    expect(pickTexts(3, 'cyr').some((t) => t.includes(' '))).toBe(true)
    expect(pickTexts(4, 'lat').filter((t) => t.includes(' '))).toHaveLength(2)
  })
})
