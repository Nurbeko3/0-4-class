import { useEffect, useState, type CSSProperties } from 'react'
import { sfx } from '../../core/audio'
import { shuffle, useWinWhen } from '../../core/util'
import type { GameProps } from '../registry'
import { cellKey, mirrorDone, mirrorWant } from './logic'
import { Dots, Palette } from './parts'
import { COLORS, MIRROR_PICTURES, type ColorId } from './pictures'

// Ko'zgu (simmetriya): rasmning chap yarmi tayyor, o'ng yarmini bola o'qqa
// nisbatan aks ettirib bo'yaydi. Noto'g'ri katak bo'yalmaydi — yumshoq ovoz
// va silkinish; jazo yo'q.
export function PaintMirror({ grade, onWin }: GameProps) {
  const [pics] = useState(() => {
    const easy = shuffle(MIRROR_PICTURES.filter((p) => p.level === 1))
    const hard = shuffle(MIRROR_PICTURES.filter((p) => p.level === 2))
    // 3-sinf: ikkita oson + bitta murakkab; 4-sinf: bitta oson + ikkita murakkab
    return grade >= 4 ? [easy[0], ...hard] : [...easy, hard[0]]
  })
  const [idx, setIdx] = useState(0)
  const [painted, setPainted] = useState<Record<string, number>>({})
  const [color, setColor] = useState<ColorId | null>(null)
  const [miss, setMiss] = useState<{ key: string; n: number } | null>(null)
  useWinWhen(idx >= pics.length, onWin, 200)

  const done = idx >= pics.length
  const pic = pics[Math.min(idx, pics.length - 1)]
  const w = pic.half[0].length
  const solved = mirrorDone(pic, painted)
  // Bitta rangli rasmda rang o'zi tanlangan
  const cur = pic.colors.length === 1 ? pic.colors[0] : color && pic.colors.includes(color) ? color : null

  useEffect(() => {
    if (!solved || done) return
    sfx.good()
    const timer = setTimeout(() => {
      // Oxirgi rasm g'alaba oynasi ortida tayyor holda qoladi
      if (idx + 1 < pics.length) {
        setPainted({})
        setColor(null)
      }
      setMiss(null)
      setIdx((i) => i + 1)
    }, 1400)
    return () => clearTimeout(timer)
  }, [solved, done, idx, pics.length])

  const paint = (x: number, y: number) => {
    const key = cellKey(x, y)
    if (done || solved || painted[key]) return
    const want = mirrorWant(pic, x, y)
    if (cur && want === pic.colors.indexOf(cur) + 1) {
      sfx.pop()
      setPainted((p) => ({ ...p, [key]: want }))
    } else {
      sfx.oops()
      setMiss((m) => ({ key: cur ? key : 'palette', n: (m?.n ?? 0) + 1 }))
    }
  }

  return (
    <div className="field pl-field">
      <Dots total={pics.length} done={idx + (solved && !done ? 1 : 0)} />
      {pic.colors.length > 1 && (
        <div key={miss?.key === 'palette' ? miss.n : 0} className={`pl-side ${miss?.key === 'palette' ? 'pl-nudge' : ''}`}>
          <Palette colors={pic.colors} value={cur} onChange={setColor} />
        </div>
      )}
      <div key={pic.id} className={`pl-mirror ${solved ? 'pl-stage-done' : ''}`} style={{ '--w': w, '--h': pic.half.length } as CSSProperties}>
        {pic.half.map((row, y) => [
          ...[...row].map((ch, x) => (
            <span key={`l${x}.${y}`} className="pl-px" style={ch === '.' ? undefined : { background: COLORS[pic.colors[Number(ch) - 1]] }} />
          )),
          ...Array.from({ length: w }, (_, x) => {
            const key = cellKey(x, y)
            const c = painted[key]
            const shake = miss?.key === key
            return (
              <button
                key={shake ? `${key}-${miss.n}` : key}
                type="button"
                className={`pl-px pl-px-live ${x === 0 ? 'pl-px-axis' : ''} ${c ? 'pl-px-on' : ''} ${shake ? 'pl-px-miss' : ''}`}
                style={c ? { background: COLORS[pic.colors[c - 1]] } : undefined}
                tabIndex={c ? -1 : 0}
                aria-label={key}
                onClick={() => paint(x, y)}
              />
            )
          }),
        ])}
      </div>
    </div>
  )
}
