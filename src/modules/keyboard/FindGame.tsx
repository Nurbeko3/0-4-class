import { useState } from 'react'
import { sfx } from '../../core/audio'
import { shuffle, useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import type { GameProps } from '../registry'
import { OnScreenKeyboard } from './OnScreenKeyboard'
import { Dots, SwitchHint } from './parts'
import { findKey, letters, type Script } from './layouts'
import { useTyping } from './useTyping'

// Harfni topish: katta harf ko'rsatiladi, bola uni klaviaturadan topib bosadi.
// 1–2-sinfda tugma doim yoritiladi, 3–4-sinfda faqat adashgandan keyin.
function FindGame({ grade, onWin, setSay, script, say }: GameProps & { script: Script; say: StrKey }) {
  const n = grade <= 1 ? 6 : grade === 2 ? 8 : 10
  const [seq] = useState(() => shuffle(letters(script)).slice(0, n))
  const [pos, setPos] = useState(0)
  useWinWhen(pos >= n, onWin)

  const expected = pos < n ? seq[pos] : null
  const { flash, misses, wrongScript, press } = useTyping({
    script,
    expected,
    say,
    setSay,
    onHit: () => {
      sfx.pop()
      setPos((p) => p + 1)
    },
  })
  const hint = expected !== null && (grade <= 2 || misses > 0) ? findKey(script, expected)?.code : null

  return (
    <div className="field kbd-field">
      <div className="kbd-stage">
        <Dots total={n} done={pos} />
        {expected !== null && (
          <div key={pos} className="kbd-letter">
            {expected.toUpperCase()}
          </div>
        )}
        {wrongScript && <SwitchHint />}
      </div>
      <OnScreenKeyboard script={script} hint={hint} flash={flash} onKey={press} />
    </div>
  )
}

export const FindLat = (p: GameProps) => <FindGame {...p} script="lat" say="say.kbd.find.lat" />
export const FindCyr = (p: GameProps) => <FindGame {...p} script="cyr" say="say.kbd.find.cyr" />
