import { shuffle } from '../../core/util'
import type { Script } from './layouts'

// So'zlar darajaga (yozuvga) bog'liq, interfeys tiliga emas:
// lotin darajasida — o'zbekcha, kirill darajasida — ruscha so'zlar.
const SHORT: Record<Script, string[]> = {
  lat: ['ona', 'ota', 'non', 'bola', 'olma', 'gul', 'suv', 'uy', 'kitob', 'daraxt'],
  cyr: ['мама', 'папа', 'дом', 'кот', 'сок', 'мир', 'лес', 'сад', 'рука', 'луна'],
}

const LONG: Record<Script, string[]> = {
  lat: ['maktab', 'kompyuter', 'sichqoncha', 'o’yin', 'qo’g’irchoq', 'do’st', 'bahor', 'quyosh'],
  cyr: ['школа', 'компьютер', 'мышка', 'экран', 'книга', 'друг', 'весна', 'солнце'],
}

const SENTENCES: Record<Script, string[]> = {
  lat: ['men maktabga boraman', 'bu mening kitobim', 'biz o’yin o’ynaymiz', 'ona non yopdi'],
  cyr: ['мама мыла раму', 'я люблю школу', 'кот пил сок', 'у нас урок'],
}

/** Sinfga qarab terish uchun matnlar: 2-sinf — qisqa so'zlar, 3–4-sinf — so'z va qisqa gap. */
export function pickTexts(grade: number, script: Script): string[] {
  if (grade <= 2) return shuffle(SHORT[script]).slice(0, 3)
  const sentence = shuffle(SENTENCES[script]).slice(0, grade >= 4 ? 2 : 1)
  return [...shuffle(SHORT[script]).slice(0, 1), ...shuffle(LONG[script]).slice(0, 2), ...sentence]
}

export const ALL_TEXTS: Record<Script, string[]> = {
  lat: [...SHORT.lat, ...LONG.lat, ...SENTENCES.lat],
  cyr: [...SHORT.cyr, ...LONG.cyr, ...SENTENCES.cyr],
}
