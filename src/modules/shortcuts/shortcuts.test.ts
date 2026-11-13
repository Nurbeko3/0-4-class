import { describe, expect, it } from 'vitest'
import { strings } from '../../i18n/strings'
import { keysStrings } from './strings'
import {
  LETTERS,
  SAVE_SEQ,
  copyPress,
  copyRounds,
  copyStart,
  cutKey,
  cutNext,
  cutRounds,
  letterOf,
  undoRounds,
  type CopyFx,
  type CutStep,
  type Letter,
} from './logic'

describe('tezkor tugmalar: tugmani aniqlash', () => {
  it('tugmaning joyi bo’yicha: rus raskladkasida ham ishlaydi', () => {
    expect(letterOf('KeyC', 'c')).toBe('C')
    expect(letterOf('KeyC', 'с')).toBe('C') // kirill «с»
    expect(letterOf('KeyZ', 'я')).toBe('Z')
    for (const l of LETTERS) expect(letterOf(`Key${l}`)).toBe(l)
  })

  it('code bo’lmasa harfning o’zidan, kirill harflari bilan birga', () => {
    expect(letterOf('', 'v')).toBe('V')
    expect(letterOf('', 'М')).toBe('V')
    expect(letterOf('', 'ы')).toBe('S')
  })

  it('o’yinga kirmaydigan tugmalar e’tiborsiz qoladi', () => {
    expect(letterOf('KeyW', 'w')).toBeNull()
    expect(letterOf('Enter', 'Enter')).toBeNull()
    expect(letterOf('Digit1', '1')).toBeNull()
  })
})

describe('tezkor tugmalar: nusxa ko’paytirish', () => {
  const run = (need: number, keys: Letter[]) => {
    let s = copyStart(need)
    const fx: CopyFx[] = []
    for (const k of keys) {
      const [next, f] = copyPress(s, k)
      s = next
      fx.push(f)
    }
    return { s, fx }
  }

  it('Ctrl+C, keyin har Ctrl+V bitta joyni to’ldiradi', () => {
    const { s, fx } = run(3, ['C', 'V', 'V', 'V'])
    expect(fx).toEqual(['copy', 'paste', 'paste', 'full'])
    expect(s.filled).toBe(3)
  })

  it('nusxa olinmasdan Ctrl+V hech narsa qo’ymaydi', () => {
    const { s, fx } = run(2, ['V', 'X', 'C', 'V'])
    expect(fx).toEqual(['nocopy', 'wrong', 'copy', 'paste'])
    expect(s.filled).toBe(1)
  })

  it('to’lgandan keyin ortiqcha qo’yilmaydi', () => {
    const { s } = run(2, ['C', 'V', 'V', 'V', 'V'])
    expect(s.filled).toBe(2)
  })

  it('raundlar soni va o’sishi', () => {
    for (const g of [3, 4]) {
      const r = copyRounds(g)
      expect(r).toHaveLength(3)
      expect([...r].sort((a, b) => a - b)).toEqual(r)
      expect(undoRounds(g)).toHaveLength(3)
    }
    expect(cutRounds(4)).toBeGreaterThan(cutRounds(3))
  })
})

describe('tezkor tugmalar: ko’chirish', () => {
  it('to’g’ri yo’l: bosish, Ctrl+X, o’z uyi, Ctrl+V', () => {
    let step: CutStep = 'pick'
    for (const e of [{ t: 'item' }, { t: 'key', l: 'X' }, { t: 'home', right: true }, { t: 'key', l: 'V' }] as const) {
      const next = cutNext(step, e)
      expect(next).not.toBeNull()
      step = next!
    }
    expect(step).toBe('done')
  })

  it('tartibdan tashqari harakat qadamni o’zgartirmaydi', () => {
    expect(cutNext('pick', { t: 'key', l: 'X' })).toBeNull()
    expect(cutNext('cut', { t: 'key', l: 'V' })).toBeNull()
    expect(cutNext('cut', { t: 'key', l: 'C' })).toBeNull()
    expect(cutNext('place', { t: 'home', right: false })).toBeNull()
    expect(cutNext('place', { t: 'key', l: 'V' })).toBeNull()
    expect(cutNext('paste', { t: 'key', l: 'X' })).toBeNull()
    expect(cutNext('done', { t: 'item' })).toBeNull()
  })

  it('kutilayotgan tugma faqat klaviatura qadamlarida', () => {
    expect(cutKey('pick')).toBeNull()
    expect(cutKey('cut')).toBe('X')
    expect(cutKey('place')).toBeNull()
    expect(cutKey('paste')).toBe('V')
  })
})

describe('tezkor tugmalar: matnlar', () => {
  it('saqlash ketma-ketligi: A, C, V, S', () => {
    expect(SAVE_SEQ).toEqual(['A', 'C', 'V', 'S'])
  })

  it('modul kalitlari ikkala tilda bir xil va umumiy lug’atga kirgan', () => {
    expect(Object.keys(keysStrings.ru).sort()).toEqual(Object.keys(keysStrings.uz).sort())
    for (const key of Object.keys(keysStrings.uz) as (keyof typeof keysStrings.uz)[])
      for (const lang of ['uz', 'ru'] as const) expect(strings[lang][key], `${lang} ${key}`).toBeTruthy()
  })
})
