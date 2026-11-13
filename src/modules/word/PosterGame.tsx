import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { Toolbar } from './Toolbar'
import { PLAIN, POSTERS, apply, cmdId, hintFor, posterTarget, sameStyle, textCss, type Cmd, type Style } from './model'
import { Tick } from './wdArt'
import './word.css'

// Namunadagidek bezash: chapda tayyor taklifnoma (yoki e'lon), o'ngda bezaksiz
// nusxasi. Bola qatorni bosib, uni namunaga o'xshatadi. Mos kelgan qator yonida
// yashil belgi chiqadi; tartib erkin, ortiqcha bezakni qaytarib olish mumkin.
export function PosterGame({ grade, onWin, setSay }: GameProps) {
  const t = useT()
  const [lines] = useState(() => POSTERS[Math.floor(Math.random() * POSTERS.length)])
  const [want] = useState(() => lines.map((l) => posterTarget(l, grade)))
  const [styles, setStyles] = useState<Style[]>(() => lines.map(() => PLAIN))
  const [sel, setSel] = useState<number | null>(null)
  const [tries, setTries] = useState(0)

  const ok = styles.map((s, i) => sameStyle(s, want[i]))
  const okCount = ok.filter(Boolean).length
  const done = okCount === lines.length
  useWinWhen(done, onWin, 1000)

  // Har yangi tayyor qator uchun qisqa quvonch ovozi
  useEffect(() => {
    if (okCount > 0) sfx.good()
  }, [okCount])

  const pick = (i: number) => {
    if (done) return
    sfx.pop()
    setSel(i)
    setTries(0)
    setSay('say.word.poster')
  }

  const cmd = (c: Cmd) => {
    if (done) return
    if (sel === null) {
      sfx.oops()
      setSay('say.word.pickline')
      return
    }
    sfx.pop()
    setStyles((all) => all.map((s, i) => (i === sel ? apply(s, c) : s)))
    setTries((n) => n + 1)
  }

  const cur = sel === null ? null : styles[sel]
  // Bir qatorda uzoq adashsa (4+ bosish) — keyingi kerakli tugma lipillaydi
  const help = !done && sel !== null && !ok[sel] && tries >= 4 ? hintFor(styles[sel], want[sel]) : null

  return (
    <div className="field wd-field">
      <Toolbar groups={['bius', 'size', 'color', 'align']} cur={cur} hint={help && cmdId(help)} onCmd={cmd} />
      <div className="wd-desk">
        <div className="wd-col wd-col-sample">
          <span className="wd-cap">{t('word.sample')}</span>
          <div className="wd-page wd-page-poster">
            {lines.map((l, i) => (
              <span key={l.text} className="wd-pline" style={{ ...textCss(want[i]), textAlign: want[i].align }}>
                {t(l.text)}
              </span>
            ))}
          </div>
        </div>
        <div className="wd-col wd-col-yours">
          <span className="wd-cap wd-cap-yours">{t('word.yours')}</span>
          <div className={`wd-page wd-page-poster ${done ? 'wd-cheer' : ''}`}>
            {lines.map((l, i) => (
              <button
                key={l.text}
                type="button"
                className={`wd-pline ${sel === i ? 'wd-sel' : ''}`}
                style={{ ...textCss(styles[i]), textAlign: styles[i].align }}
                onClick={() => pick(i)}
              >
                {t(l.text)}
                {ok[i] && <Tick className="wd-tick" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
