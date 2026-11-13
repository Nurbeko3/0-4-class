import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { layout, useWinWhen } from '../../core/util'
import type { GameProps } from '../registry'
import { Dots, KeyPad } from './KeyPad'
import { Blot, Picture } from './ksArt'
import { undoRounds } from './logic'
import { useCombo } from './useCombo'
import './shortcuts.css'

const INKS = ['#2D3A4A', '#9B8AE6', '#FF7A6B', '#4AA3E3']

// Ortga qaytarish: shumtak siyoh rasmga birin-ketin dog' tomizadi. Har Ctrl+Z
// oxirgi dog'ni olib tashlaydi — amallar teskari tartibda qaytadi.
export function UndoGame({ grade, onWin, setSay }: GameProps) {
  const [rounds] = useState(() => undoRounds(grade))
  const [spots] = useState(() => rounds.map((n) => layout(n)))
  const [round, setRound] = useState(0)
  // dropped — nechta dog' tushdi, undone — nechtasi qaytarildi
  const [dropped, setDropped] = useState(0)
  const [undone, setUndone] = useState(0)
  const [errs, setErrs] = useState(0)
  useWinWhen(round >= rounds.length, onWin, 200)

  const live = round < rounds.length
  const need = rounds[Math.min(round, rounds.length - 1)]
  const blots = dropped - undone
  // mess — dog'lar tushyapti; fix — bola qaytaryapti; clean — rasm toza
  const phase = dropped < need ? 'mess' : blots > 0 ? 'fix' : 'clean'

  // Dog'lar bittalab tushadi
  useEffect(() => {
    if (!live || phase !== 'mess') return
    const tm = setTimeout(
      () => {
        sfx.oops()
        setDropped((d) => d + 1)
      },
      dropped === 0 ? 700 : 420,
    )
    return () => clearTimeout(tm)
  }, [live, phase, dropped])

  useEffect(() => {
    if (!live || phase !== 'clean') return
    const tm = setTimeout(() => {
      setDropped(0)
      setUndone(0)
      setRound((r) => r + 1)
      setSay('say.keys.undo')
    }, 1100)
    return () => clearTimeout(tm)
  }, [live, phase, setSay])

  const miss = () => {
    sfx.oops()
    setErrs((n) => n + 1)
  }

  const combo = useCombo(
    (l) => {
      if (phase !== 'fix') return
      if (l !== 'Z') return miss()
      setSay('say.keys.undo')
      if (blots <= 1) sfx.good()
      else sfx.pop()
      setUndone((u) => u + 1)
    },
    (l) => {
      if (phase !== 'fix' || l !== 'Z') return
      miss()
      setSay('say.keys.hold')
    },
  )

  return (
    <div className="field ks-field ks-studio">
      <Dots total={rounds.length} done={round + (phase === 'clean' ? 1 : 0)} />
      <div className="ks-stage ks-stage-mid">
        <div className={`ks-easel ${phase === 'clean' ? 'ks-easel-clean' : ''}`}>
          <Picture className="ks-picture" />
          {live &&
            spots[round].slice(0, blots).map((p, i) => (
              <span
                key={`${round}-${i}`}
                className={`ks-blot ${i === blots - 1 && phase === 'fix' ? 'ks-blot-last' : ''}`}
                style={{ left: `${12 + p.left * 0.76}%`, top: `${14 + p.top * 0.72}%` }}
              >
                <Blot color={INKS[i % INKS.length]} />
              </span>
            ))}
        </div>
        <div className="ks-history" aria-hidden="true">
          {Array.from({ length: need }, (_, i) => (
            <span key={i} className={`ks-step ${i < blots ? 'ks-step-on' : ''}`} style={{ color: INKS[i % INKS.length] }} />
          ))}
        </div>
      </div>
      <KeyPad
        letters={['Z']}
        ctrl={combo.ctrl}
        last={combo.last}
        hint={phase === 'fix' && (grade <= 3 || errs > 0) ? 'Z' : null}
        onCtrl={combo.tapCtrl}
        onLetter={combo.tapLetter}
      />
    </div>
  )
}
