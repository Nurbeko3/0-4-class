import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import { useT } from '../../i18n/useT'
import { Star } from '../../ui/art'
import type { GameProps } from '../registry'
import { Clip, Dots, KeyPad } from './KeyPad'
import { Butterfly, Disk, Flower } from './ksArt'
import { SAVE_SEQ } from './logic'
import { useCombo } from './useCombo'
import './shortcuts.css'

// Har qadamdan keyingi yo'riqnoma (0 — boshlanish)
const SAY: StrKey[] = ['say.keys.save', 'say.keys.save.copy', 'say.keys.save.paste', 'say.keys.save.disk']

const SCENES = [
  { Item: Star, cls: 'ks-night' },
  { Item: Flower, cls: 'ks-meadow' },
  { Item: Butterfly, cls: 'ks-day' },
]

// Rasmdagi joylar (foizda): avval uchta asl nusxa, keyin uchta qo'yilgan nusxa
const SPOTS = [
  [18, 30],
  [44, 58],
  [72, 26],
  [30, 72],
  [58, 22],
  [84, 62],
]

// Belgilash va saqlash: Ctrl+A — hammasi belgilanadi, Ctrl+C — nusxa, Ctrl+V —
// hammasi ko'payadi, Ctrl+S — tayyor rasm saqlanadi. Qadamlar tartib bilan.
export function SaveGame({ grade, onWin, setSay }: GameProps) {
  const t = useT()
  const total = grade <= 3 ? 2 : 3
  const [round, setRound] = useState(0)
  const [step, setStep] = useState(0)
  const [errs, setErrs] = useState(0)
  useWinWhen(round >= total, onWin, 200)

  const saved = step >= SAVE_SEQ.length
  const expected = saved || round >= total ? null : SAVE_SEQ[step]

  useEffect(() => {
    if (!saved) return
    const tm = setTimeout(() => {
      if (round + 1 < total) {
        setStep(0)
        setSay(SAY[0])
      }
      setRound((r) => r + 1)
    }, 1700)
    return () => clearTimeout(tm)
  }, [saved, round, total, setSay])

  const miss = (say: StrKey) => {
    sfx.oops()
    setErrs((n) => n + 1)
    setSay(say)
  }

  const combo = useCombo(
    (l) => {
      if (!expected) return
      if (l !== expected) return miss(SAY[step])
      if (step + 1 >= SAVE_SEQ.length) sfx.good()
      else {
        sfx.pop()
        setSay(SAY[step + 1])
      }
      setStep((s) => s + 1)
    },
    (l) => {
      if (l === expected) miss('say.keys.hold')
    },
  )

  const { Item, cls } = SCENES[round % SCENES.length]
  const count = step >= 3 ? 6 : 3

  return (
    <div className="field ks-field ks-studio">
      <Dots total={total} done={round + (saved ? 1 : 0)} />
      {round < total && (
        <div key={round} className="ks-stage">
          <div className={`ks-canvas ${cls} ${saved ? 'ks-canvas-saved' : ''}`}>
            {SPOTS.slice(0, count).map(([x, y], i) => (
              <span
                key={i}
                className={`ks-thing ${step >= 1 && step < 3 && i < 3 ? 'ks-thing-sel' : ''} ${i >= 3 ? 'ks-pop' : ''}`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <Item />
              </span>
            ))}
          </div>
          {saved && (
            <div className="ks-saved">
              <Disk />
              <span>{t('keys.saved')}</span>
            </div>
          )}
          <Clip>{step >= 2 && !saved && <Item />}</Clip>
        </div>
      )}
      <KeyPad
        letters={SAVE_SEQ}
        ctrl={combo.ctrl}
        last={combo.last}
        hint={grade <= 3 || errs > 0 ? expected : null}
        onCtrl={combo.tapCtrl}
        onLetter={combo.tapLetter}
      />
    </div>
  )
}
