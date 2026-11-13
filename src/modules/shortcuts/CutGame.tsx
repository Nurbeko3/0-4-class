import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import type { GameProps } from '../registry'
import { Clip, Dots, KeyPad } from './KeyPad'
import { Bird, Car, Fish, Garage, Nest, Pond } from './ksArt'
import { cutKey, cutNext, cutRounds, type CutEvent, type CutStep } from './logic'
import { useCombo } from './useCombo'
import './shortcuts.css'

const PAIRS = [
  { Item: Fish, Home: Pond },
  { Item: Bird, Home: Nest },
  { Item: Car, Home: Garage },
]

const SAY: Record<CutStep, StrKey> = {
  pick: 'say.keys.cut',
  cut: 'say.keys.cut.x',
  place: 'say.keys.cut.place',
  paste: 'say.keys.cut.v',
  done: 'say.keys.cut.v',
}

// Ko'chirish: kimdir begona uyda qolgan (baliq — uyada, qush — garajda).
// To'rt qadam: narsani bosish -> Ctrl+X -> o'z uyini bosish -> Ctrl+V.
export function CutGame({ grade, onWin, setSay }: GameProps) {
  const total = cutRounds(grade)
  // Har raundda o'z uyi chapda yoki o'ngda — tasodifiy
  const [flips] = useState(() => Array.from({ length: total }, () => Math.random() < 0.5))
  const [round, setRound] = useState(0)
  const [step, setStep] = useState<CutStep>('pick')
  const [errs, setErrs] = useState(0)
  useWinWhen(round >= total, onWin, 200)

  useEffect(() => {
    if (step !== 'done') return
    const tm = setTimeout(() => {
      if (round + 1 < total) {
        setStep('pick')
        setSay('say.keys.cut')
      }
      setRound((r) => r + 1)
    }, 1200)
    return () => clearTimeout(tm)
  }, [step, round, total, setSay])

  const act = (e: CutEvent) => {
    if (step === 'done' || round >= total) return
    const next = cutNext(step, e)
    if (!next) {
      // Sichqoncha bilan bo'sh joyni bosish xato emas; noto'g'ri tugma yoki uy — yumshoq eslatma
      if (e.t === 'key' || (e.t === 'home' && step === 'place')) {
        sfx.oops()
        setErrs((n) => n + 1)
        setSay(SAY[step])
      }
      return
    }
    if (next === 'done') sfx.good()
    else sfx.pop()
    setStep(next)
    setSay(SAY[next])
  }

  const expected = cutKey(step)
  const combo = useCombo(
    (l) => act({ t: 'key', l }),
    (l) => {
      if (l !== expected) return
      sfx.oops()
      setErrs((n) => n + 1)
      setSay('say.keys.hold')
    },
  )

  const { Item, Home } = PAIRS[round % PAIRS.length]
  const Wrong = PAIRS[(round + 1) % PAIRS.length].Home
  const flip = flips[Math.min(round, total - 1)]
  const held = step === 'place' || step === 'paste'

  const zone = (right: boolean) => {
    const Art = right ? Home : Wrong
    const here = right ? step === 'done' : step === 'pick' || step === 'cut'
    return (
      <button
        type="button"
        className={`ks-zone ${right && step === 'paste' ? 'ks-zone-cursor' : ''} ${right && step === 'place' && errs > 0 ? 'ks-zone-hint' : ''}`}
        onClick={() => act({ t: 'home', right })}
      >
        <Art className="ks-home" />
        {here && (
          <span
            className={`ks-guest ${step === 'cut' ? 'ks-guest-sel' : ''} ${step === 'done' ? 'ks-pop' : ''} ${step === 'pick' ? 'ks-guest-lost' : ''}`}
            onClick={(ev) => {
              if (step !== 'pick') return
              ev.stopPropagation()
              act({ t: 'item' })
            }}
          >
            <Item />
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="field ks-field ks-yard">
      <Dots total={total} done={round + (step === 'done' ? 1 : 0)} />
      {round < total && (
        <div key={round} className="ks-stage">
          {zone(flip)}
          {zone(!flip)}
          <Clip>{held && <Item />}</Clip>
        </div>
      )}
      <KeyPad
        letters={['X', 'V']}
        ctrl={combo.ctrl}
        last={combo.last}
        hint={grade <= 3 || errs > 0 ? expected : null}
        onCtrl={combo.tapCtrl}
        onLetter={combo.tapLetter}
      />
    </div>
  )
}
