import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { shuffle, useWinWhen } from '../../core/util'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { Dots, Palette, Pic } from './parts'
import { COLOR_IDS, FILL_PICTURES, type ColorId } from './pictures'

// Chelak: rang tanlanadi, rasm bo'lagi bosiladi — butun bo'lak bo'yaladi.
// Namunadagidan boshqa rang ham quyiladi (Paint dagi kabi), lekin bo'lak
// qimirlab "bu rang emas" deydi — ustidan to'g'ri rangni quyish mumkin.
export function PaintFill({ grade, onWin }: GameProps) {
  const t = useT()
  const [pics] = useState(() => shuffle(FILL_PICTURES).slice(0, grade >= 3 ? 3 : 2))
  const [idx, setIdx] = useState(0)
  const [color, setColor] = useState<ColorId | null>(null)
  const [fills, setFills] = useState<(ColorId | null)[]>([])
  const [nudge, setNudge] = useState(0)
  useWinWhen(idx >= pics.length, onWin, 200)

  const done = idx >= pics.length
  const pic = pics[Math.min(idx, pics.length - 1)]
  const cur = pic.regions.map((_, i) => fills[i] ?? null)
  const solved = pic.regions.every((r, i) => cur[i] === r.color)

  // 1–2-sinf: faqat shu rasmning ranglari; 3–4-sinf: butun palitra — o'xshash ranglarni ajratish kerak
  const used = COLOR_IDS.filter((c) => pic.regions.some((r) => r.color === c))
  const palette = grade >= 3 ? COLOR_IDS : used

  useEffect(() => {
    if (!solved || done) return
    sfx.good()
    const timer = setTimeout(() => {
      // Oxirgi rasm g'alaba oynasi ortida bo'yalgan holda qoladi
      if (idx + 1 < pics.length) setFills([])
      setIdx((i) => i + 1)
    }, 1400)
    return () => clearTimeout(timer)
  }, [solved, done, idx, pics.length])

  const pick = (i: number) => {
    if (done || solved) return
    if (!color) {
      // Rang tanlanmagan: palitra "qimirlab" eslatadi
      sfx.oops()
      setNudge((n) => n + 1)
      return
    }
    if (cur[i] === color) return
    if (color === pic.regions[i].color) sfx.pop()
    else sfx.oops()
    setFills(cur.map((c, j) => (j === i ? color : c)))
  }

  return (
    <div className="field pl-field">
      <Dots total={pics.length} done={idx + (solved && !done ? 1 : 0)} />
      <div className="pl-side">
        <div className="pl-sample">
          <span>{t('paintlab.sample')}</span>
          <Pic pic={pic} />
        </div>
        <div key={nudge} className={nudge && !color ? 'pl-nudge' : ''}>
          <Palette colors={palette} value={color} onChange={setColor} />
        </div>
      </div>
      <div key={pic.id} className={`pl-stage ${solved ? 'pl-stage-done' : ''}`}>
        <Pic
          pic={pic}
          className="pl-canvas pl-bucket"
          fills={cur}
          wrong={pic.regions.map((r, i) => cur[i] !== null && cur[i] !== r.color)}
          onPick={pick}
        />
      </div>
    </div>
  )
}
