import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import type { GameProps } from '../registry'
import { OnScreenKeyboard } from './OnScreenKeyboard'
import { Dots, SwitchHint } from './parts'
import { findKey, type Script } from './layouts'
import { useTyping } from './useTyping'
import { pickTexts } from './words'

// So'z yozish: so'z harf kataklarida turadi, bola harfma-harf teradi.
// 2-sinf — qisqa so'zlar (tugma doim yoritiladi), 3–4-sinf — uzunroq so'z va
// qisqa gap (yoritish faqat adashgandan keyin).
function WordGame({ grade, onWin, setSay, script, say }: GameProps & { script: Script; say: StrKey }) {
  const [texts] = useState(() => pickTexts(grade, script))
  const [idx, setIdx] = useState(0)
  const [pos, setPos] = useState(0)
  useWinWhen(idx >= texts.length, onWin, 300)

  const text = texts[idx] ?? ''
  const typedAll = text !== '' && pos >= text.length
  const expected = text !== '' && !typedAll ? text[pos] : null

  // So'z tugagach biroz kutib keyingisiga o'tamiz — bola yashil so'zni ko'rsin
  useEffect(() => {
    if (!typedAll) return
    const t = setTimeout(() => {
      setIdx((i) => i + 1)
      setPos(0)
    }, 800)
    return () => clearTimeout(t)
  }, [typedAll])

  const { flash, misses, wrongScript, press } = useTyping({
    script,
    expected,
    say,
    setSay,
    onHit: () => {
      if (pos + 1 >= text.length) sfx.good()
      else sfx.pop()
      setPos((p) => p + 1)
    },
  })
  const hint = expected !== null && (grade <= 2 || misses > 0) ? findKey(script, expected)?.code : null

  // Gap so'zlarga bo'linadi — qator faqat so'z orasidan sinadi
  const parts = text.split(' ')
  const words = parts.map((w, i) => ({ w, start: parts.slice(0, i).join(' ').length + (i > 0 ? 1 : 0) }))

  return (
    <div className="field kbd-field">
      <div className="kbd-stage">
        <Dots total={texts.length} done={idx} />
        <div key={idx} className={`kbd-word ${typedAll ? 'kbd-word-done' : ''} ${text.length > 12 ? 'kbd-word-long' : ''}`}>
          {words.map(({ w, start }, wi) => (
            <span key={wi} className="kbd-word-part">
              {[...w].map((ch, i) => (
                <span key={i} className={tileClass(start + i, pos)}>
                  {ch.toUpperCase()}
                </span>
              ))}
              {wi < words.length - 1 && <span className={`${tileClass(start + w.length, pos)} kbd-tile-gap`} />}
            </span>
          ))}
        </div>
        {wrongScript && <SwitchHint />}
      </div>
      <OnScreenKeyboard script={script} hint={hint} flash={flash} onKey={press} />
    </div>
  )
}

const tileClass = (i: number, pos: number) => `kbd-tile ${i < pos ? 'kbd-tile-done' : i === pos ? 'kbd-tile-cur' : ''}`

export const WordLat = (p: GameProps) => <WordGame {...p} script="lat" say="say.kbd.word.lat" />
export const WordCyr = (p: GameProps) => <WordGame {...p} script="cyr" say="say.kbd.word.cyr" />
