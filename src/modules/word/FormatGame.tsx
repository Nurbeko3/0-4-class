import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { Dots, Toolbar } from './Toolbar'
import { FORMAT_WANT, PLAIN, apply, cmdId, formatTasks, hintFor, parseSentence, sameStyle, textCss, type Cmd, type Style } from './model'
import './word.css'

// So'zni bezash. Har raundda bitta gap: bola so'zni bosib belgilaydi va tugma bilan
// bezaydi. Bezak so'zning ma'nosiga mos («og'ir» — qalin, «qizil» — qizil rang).
// Xato yo'q: ortiqcha bezak o'sha tugma bilan olib tashlanadi, ikki urinishdan
// keyin kerakli tugma lipillaydi.
export function FormatGame({ grade, onWin, setSay }: GameProps) {
  const t = useT()
  const [tasks] = useState(() => formatTasks(grade))
  const [idx, setIdx] = useState(0)
  const [styles, setStyles] = useState<Record<number, Style>>({})
  const [sel, setSel] = useState<number | null>(null)
  const [tries, setTries] = useState(0)
  const [misses, setMisses] = useState(0)
  useWinWhen(idx >= tasks.length, onWin, 200)

  const id = tasks[Math.min(idx, tasks.length - 1)]
  const { words, target } = parseSentence(t(`word.s.${id}`))
  const want = { ...PLAIN, ...FORMAT_WANT[id] }
  const done = idx < tasks.length && sameStyle(styles[target] ?? PLAIN, want)

  useEffect(() => {
    if (idx < tasks.length) setSay(`say.word.format.${tasks[idx]}`)
  }, [idx, tasks, setSay])

  // So'z tayyor: biroz quvonib, keyingi gapga o'tamiz
  useEffect(() => {
    if (!done) return
    sfx.good()
    const tm = setTimeout(() => {
      setStyles({})
      setSel(null)
      setTries(0)
      setMisses(0)
      setIdx((i) => i + 1)
    }, 1300)
    return () => clearTimeout(tm)
  }, [done])

  const pick = (i: number) => {
    if (done) return
    sfx.pop()
    setSel(i)
    setSay(`say.word.format.${id}`)
    if (i !== target) setMisses((m) => m + 1)
  }

  const cmd = (c: Cmd) => {
    if (done) return
    if (sel === null) {
      sfx.oops()
      setSay('say.word.pick')
      return
    }
    sfx.pop()
    setStyles((s) => ({ ...s, [sel]: apply(s[sel] ?? PLAIN, c) }))
    setTries((n) => n + 1)
  }

  const cur = sel === null ? null : (styles[sel] ?? PLAIN)
  const help = !done && sel === target && tries >= 2 && cur ? hintFor(cur, want) : null
  // Kichiklarga kerakli so'z darhol ko'rsatiladi, kattalarga — adashgandan keyin
  const point = !done && sel !== target && (grade <= 2 || misses > 0 || tries >= 2)

  return (
    <div className="field wd-field">
      <Dots total={tasks.length} done={idx + (done ? 1 : 0)} />
      <Toolbar groups={['bius', 'size', 'color']} cur={cur} hint={help && cmdId(help)} onCmd={cmd} />
      <div className="wd-desk">
        <div key={idx} className="wd-page wd-page-one">
          <p className="wd-sentence">
            {words.map((w, i) => (
              <button
                key={i}
                type="button"
                className={`wd-word ${sel === i ? 'wd-sel' : ''} ${done && i === target ? 'wd-cheer' : ''}`}
                style={textCss(styles[i] ?? PLAIN)}
                onClick={() => pick(i)}
              >
                {w}
                {point && i === target && <span className="wd-pointer" aria-hidden="true" />}
              </button>
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}
