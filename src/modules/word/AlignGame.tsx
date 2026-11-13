import { useCallback, useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { Dots, Toolbar } from './Toolbar'
import { PLAIN, alignPages, type AlignLine, type Cmd } from './model'
import './word.css'

// Tekislash. Varaqdagi har qatorning nuqtali «soyasi» uning joyini ko'rsatadi:
// sarlavha — o'rtada, matn — chapda, imzo — o'ngda. Bola qatorni bosadi va
// tekislash tugmasi bilan joyiga suradi; qator sirpanib boradi.
export function AlignGame({ grade, onWin, setSay }: GameProps) {
  const [pages] = useState(() => alignPages(grade))
  const [idx, setIdx] = useState(0)
  useWinWhen(idx >= pages.length, onWin, 200)
  const next = useCallback(() => setIdx((i) => i + 1), [])

  return (
    <div className="field wd-field">
      <Dots total={pages.length} done={idx} />
      {idx < pages.length && <AlignPage key={idx} lines={pages[idx]} onDone={next} setSay={setSay} />}
    </div>
  )
}

function AlignPage({ lines, onDone, setSay }: { lines: AlignLine[]; onDone: () => void; setSay: (k: StrKey) => void }) {
  const t = useT()
  const [al, setAl] = useState(() => lines.map((l) => l.from))
  const [sel, setSel] = useState<number | null>(null)
  const [tries, setTries] = useState(0)
  const done = lines.every((l, i) => al[i] === l.want)

  useEffect(() => {
    if (!done) return
    sfx.good()
    const tm = setTimeout(onDone, 1300)
    return () => clearTimeout(tm)
  }, [done, onDone])

  const pick = (i: number) => {
    if (done) return
    sfx.pop()
    setSel(i)
    setTries(0)
    setSay('say.word.align')
  }

  const cmd = (c: Cmd) => {
    if (done || c.t !== 'align') return
    if (sel === null) {
      sfx.oops()
      setSay('say.word.pickline')
      return
    }
    sfx.pop()
    setAl((a) => a.map((v, i) => (i === sel ? c.a : v)))
    setTries((n) => n + 1)
  }

  const off = sel !== null && al[sel] !== lines[sel].want
  return (
    <>
      <Toolbar
        groups={['align']}
        cur={sel === null ? null : { ...PLAIN, align: al[sel] }}
        hint={!done && off && tries >= 2 ? `align:${lines[sel].want}` : null}
        onCmd={cmd}
      />
      <div className="wd-desk">
        <div className="wd-page wd-page-lines">
          {lines.map((l, i) => (
            <div key={l.text} className={`wd-row ${l.title ? 'wd-row-title' : ''}`}>
              <span className={`wd-ghost wd-pos-${l.want}`} aria-hidden="true">
                {t(l.text)}
              </span>
              <button
                type="button"
                className={`wd-line wd-pos-${al[i]} ${sel === i ? 'wd-sel' : ''} ${al[i] === l.want ? 'wd-ok' : ''}`}
                onClick={() => pick(i)}
              >
                {t(l.text)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
