import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useStore } from '../../core/progress'
import { useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import type { GameProps } from '../registry'
import { OnScreenKeyboard } from './OnScreenKeyboard'
import { Dots } from './parts'
import { Door, Frog, Pad } from './kbdArt'
import { BACKSPACE, ENTER, SPACE, findKey } from './layouts'
import { useTyping } from './useTyping'

type Phase = 'space' | 'enter' | 'back'

const PHASES: { id: Phase; key: string; say: StrKey }[] = [
  { id: 'space', key: SPACE, say: 'say.kbd.special' },
  { id: 'enter', key: ENTER, say: 'say.kbd.special.enter' },
  { id: 'back', key: BACKSPACE, say: 'say.kbd.special.back' },
]

// Maxsus tugmalar, uch bosqich:
//   Probel — qurbaqa barglar ustidan sakraydi;
//   Enter — eshiklar ochiladi;
//   Backspace — so'z oxiridagi ortiqcha harflar o'chiriladi.
export function SpecialGame({ grade, onWin, setSay }: GameProps) {
  const need = grade <= 2 ? 3 : 4
  // Klaviatura interfeys tilidagi joylashuvda ko'rsatiladi (bu darajada harf terilmaydi)
  const script = useStore().lang === 'ru' ? 'cyr' : 'lat'
  const [step, setStep] = useState(0)
  const [count, setCount] = useState(0)
  useWinWhen(step >= PHASES.length, onWin, 300)

  const phase = PHASES[step]
  const full = count >= need
  const expected = phase && !full ? phase.key : null

  // Bosqich tugagach biroz kutib keyingisiga o'tamiz
  useEffect(() => {
    if (!full) return
    const t = setTimeout(() => {
      const next = PHASES[step + 1]
      if (next) setSay(next.say)
      setStep((s) => s + 1)
      setCount(0)
    }, 900)
    return () => clearTimeout(t)
  }, [full, step, setSay])

  const { flash, press } = useTyping({
    script,
    expected,
    say: phase?.say ?? 'say.kbd.special',
    setSay,
    checkScript: false,
    onHit: () => {
      if (count + 1 >= need) sfx.good()
      else sfx.pop()
      setCount((c) => c + 1)
    },
  })

  const word = script === 'cyr' ? 'МАМА' : 'OLMA'
  const extra = (script === 'cyr' ? 'ЩЪЖЫ' : 'XQWZ').slice(0, need)

  return (
    <div className="field kbd-field">
      <div className="kbd-stage">
        <Dots total={PHASES.length} done={step} />
        {phase?.id === 'space' && (
          <div className="kbd-scene kbd-pond">
            {Array.from({ length: need + 1 }, (_, i) => (
              <span key={i} className="kbd-pad">
                <Pad />
                {i === count && (
                  <span key={count} className="kbd-frog">
                    <Frog />
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
        {phase?.id === 'enter' && (
          <div className="kbd-scene">
            {Array.from({ length: need }, (_, i) => (
              <span key={i} className={`kbd-door ${i < count ? 'kbd-door-open' : ''}`}>
                <Door open={i < count} />
              </span>
            ))}
          </div>
        )}
        {phase?.id === 'back' && (
          <div className="kbd-word">
            <span className="kbd-word-part">
              {[...word].map((ch, i) => (
                <span key={i} className={`kbd-tile ${full ? 'kbd-tile-done' : ''}`}>
                  {ch}
                </span>
              ))}
              {[...extra].slice(0, need - count).map((ch, i) => (
                <span key={`x${i}`} className="kbd-tile kbd-tile-extra">
                  {ch}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
      <OnScreenKeyboard script={script} hint={expected !== null ? findKey(script, expected)?.code : null} flash={flash} onKey={press} />
    </div>
  )
}
