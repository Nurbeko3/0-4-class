// Ovozli yo'riqnoma uchun placeholder'lar va yozib olish ro'yxatini yaratadi.
//   node scripts/gen-audio.mjs
// - strings.ts dagi har bir `say.*` kaliti uchun public/audio/{uz,ru}/<kalit>.mp3
//   bo'lmasa, jimjit mp3 qo'yadi. Mavjud (siz yozgan) fayllarga TEGMAYDI.
// - AUDIO_SCRIPT.md: qaysi faylga qaysi matn o'qilishi kerakligi.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { strings } from '../src/i18n/strings.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Jimjit MP3: MPEG-1 Layer III, 128 kbit/s, 44.1 kHz kadrlari (har biri 417 bayt, ichi nol).
function silentMp3(frames = 12) {
  const frame = Buffer.alloc(417)
  frame.set([0xff, 0xfb, 0x90, 0xc4])
  return Buffer.concat(Array(frames).fill(frame))
}

const keys = Object.keys(strings.uz).filter((k) => k.startsWith('say.'))
let created = 0
for (const lang of Object.keys(strings)) {
  const dir = join(root, 'public', 'audio', lang)
  mkdirSync(dir, { recursive: true })
  for (const key of keys) {
    const file = join(dir, `${key}.mp3`)
    if (!existsSync(file)) {
      writeFileSync(file, silentMp3())
      created++
    }
  }
}

const rows = keys.map((k) => `| \`${k}.mp3\` | ${strings.uz[k]} | ${strings.ru[k]} |`)
writeFileSync(
  join(root, 'AUDIO_SCRIPT.md'),
  `# Ovozli yo'riqnoma matnlari

Har bir qatorni ikki tilda yozib oling va shu nom bilan saqlang:

- o'zbekcha: \`public/audio/uz/<fayl>\`
- ruscha: \`public/audio/ru/<fayl>\`

Format: MP3. Hozir bu fayllar o'rnida jimjit placeholder turibdi — ustidan yozib qo'ying.
Bu ro'yxat \`node scripts/gen-audio.mjs\` bilan yangilanadi.

| Fayl | O'zbekcha matn | Ruscha matn |
|---|---|---|
${rows.join('\n')}
`,
)

console.log(`${keys.length} ta kalit, ${created} ta yangi placeholder yaratildi.`)
