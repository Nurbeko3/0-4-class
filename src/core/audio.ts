import type { Lang, StrKey } from '../i18n/strings'

// Ovozli yo'riqnoma: /audio/<til>/<kalit>.mp3. Fayl bo'lmasa yoki brauzer
// ruxsat bermasa — jim o'tib ketamiz, o'yin to'xtamaydi.
let current: HTMLAudioElement | null = null

export function speak(key: StrKey, lang: Lang) {
  stopSpeech()
  try {
    const a = new Audio(`${import.meta.env.BASE_URL}audio/${lang}/${key}.mp3`)
    current = a
    void a.play().catch(() => {})
  } catch {
    /* audio yo'q */
  }
}

export function stopSpeech() {
  if (current) {
    current.pause()
    current = null
  }
}

// Effekt ovozlari fayl emas — WebAudio bilan sintez qilinadi.
let ctx: AudioContext | null = null

function tone(freq: number, at: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const t = ctx.currentTime + at
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(ctx.destination)
    o.start(t)
    o.stop(t + dur + 0.03)
  } catch {
    /* ovoz chiqmasa ham mayli */
  }
}

export const sfx = {
  pop() {
    tone(520, 0, 0.08, 'triangle')
    tone(820, 0.04, 0.1, 'triangle')
  },
  good() {
    tone(660, 0, 0.12)
    tone(880, 0.1, 0.2)
  },
  /** Xato emas, yumshoq "yana urinib ko'r" ovozi */
  oops() {
    tone(240, 0, 0.16, 'sine', 0.07)
  },
  win() {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.32, 'triangle'))
  },
}
