import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { shuffle, useWinWhen } from '../../core/util'
import { useT } from '../../i18n/useT'
import { NextIcon } from '../../ui/art'
import type { GameProps } from '../registry'
import { Scene } from './safetyArt'
import { pickScenarios } from './scenarios'
import './safety.css'

// Rasmli vaziyatli savollar. Noto'g'ri javobda jazo yo'q: qisqa tushuntirish
// chiqadi va boshqa javobni tanlash mumkin. To'g'ri javobda ham bir jumla
// tushuntirish o'qiladi, keyin bola o'zi "Keyingisi"ni bosadi.
export function ScenarioQuiz({ grade, onWin, setSay }: GameProps) {
  const t = useT()
  const [list] = useState(() => pickScenarios(grade).map((s) => ({ ...s, options: shuffle(s.options) })))
  const [idx, setIdx] = useState(0)
  const [wrong, setWrong] = useState<number[]>([])
  const [solved, setSolved] = useState(false)
  useWinWhen(idx >= list.length, onWin, 200)

  const sc = list[Math.min(idx, list.length - 1)]

  // Har vaziyat boshida savol yo'riqnoma panelida chiqadi va ovoz bilan o'qiladi
  useEffect(() => {
    if (idx < list.length) setSay(list[idx].ask)
  }, [idx, list, setSay])

  const choose = (i: number) => {
    if (solved || wrong.includes(i)) return
    if (sc.options[i].ok) {
      sfx.good()
      setSolved(true)
      setSay(sc.yes)
    } else {
      sfx.oops()
      setWrong((w) => [...w, i])
      setSay(sc.no)
    }
  }

  const next = () => {
    setWrong([])
    setSolved(false)
    setIdx((i) => i + 1)
  }

  return (
    <div className="field sf-field">
      <div className="sf-dots" aria-hidden="true">
        {list.map((_, i) => (
          <span key={i} className={i < idx || (i === idx && solved) ? 'sf-dot sf-dot-on' : 'sf-dot'} />
        ))}
      </div>
      <div key={sc.id} className="sf-body">
        <Scene id={sc.id} />
        <div className="sf-cards">
          {sc.options.map((o, i) => {
            const isWrong = wrong.includes(i)
            const isRight = solved && o.ok
            return (
              <button
                key={o.text}
                type="button"
                className={`sf-card ${isWrong ? 'sf-card-no' : ''} ${isRight ? 'sf-card-yes' : ''} ${solved && !o.ok ? 'sf-card-off' : ''}`}
                aria-disabled={solved || isWrong}
                onClick={() => choose(i)}
              >
                {t(o.text)}
              </button>
            )
          })}
          {solved && idx < list.length && (
            <button type="button" className="btn sf-next" onClick={next}>
              {t('common.next')}
              <NextIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
