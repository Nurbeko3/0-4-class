import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import { Star } from '../../ui/art'
import type { GameProps } from '../registry'
import { Clip, Dots, KeyPad } from './KeyPad'
import { Butterfly, Flower } from './ksArt'
import { copyPress, copyRounds, copyStart, type Letter } from './logic'
import { useCombo } from './useCombo'
import './shortcuts.css'

const ITEMS = [Flower, Butterfly, Star]

// Nusxa ko'paytirish: bitta narsa bor, yonida bo'sh joylar. Ctrl+C — nusxa
// «xotira»ga tushadi, har Ctrl+V bitta bo'sh joyni to'ldiradi.
export function CopyGame({ grade, onWin, setSay }: GameProps) {
  const [rounds] = useState(() => copyRounds(grade))
  const [round, setRound] = useState(0)
  const [st, setSt] = useState(() => copyStart(rounds[0]))
  const [errs, setErrs] = useState(0)
  useWinWhen(round >= rounds.length, onWin, 200)

  const full = st.filled >= st.need
  const expected: Letter | null = full ? null : st.clip ? 'V' : 'C'

  // Raund tugadi: biroz quvonib, keyingisiga o'tamiz
  useEffect(() => {
    if (!full) return
    const tm = setTimeout(() => {
      const next = round + 1
      if (next < rounds.length) {
        setSt(copyStart(rounds[next]))
        setSay('say.keys.copy')
      }
      setRound(next)
    }, 1100)
    return () => clearTimeout(tm)
  }, [full, round, rounds, setSay])

  const miss = () => {
    sfx.oops()
    setErrs((n) => n + 1)
  }

  const combo = useCombo(
    (l) => {
      if (full) return
      const [next, fx] = copyPress(st, l)
      setSt(next)
      if (fx === 'copy') {
        sfx.good()
        setSay('say.keys.copy.paste')
      } else if (fx === 'paste') sfx.pop()
      else if (fx === 'full') sfx.good()
      else {
        miss()
        if (fx === 'nocopy') setSay('say.keys.copy')
      }
    },
    (l) => {
      if (l !== expected) return
      miss()
      setSay('say.keys.hold')
    },
  )

  const Item = ITEMS[round % ITEMS.length]
  const hint = grade <= 3 || errs > 0 ? expected : null

  return (
    <div className="field ks-field ks-garden">
      <Dots total={rounds.length} done={round + (full ? 1 : 0)} />
      {round < rounds.length && (
        <div key={round} className="ks-stage">
          <span className={`ks-origin ${st.clip ? 'ks-origin-copied' : ''}`}>
            <Item />
          </span>
          <span className="ks-arrow" aria-hidden="true" />
          <div className="ks-slots">
            {Array.from({ length: st.need }, (_, i) => (
              <span key={i} className={`ks-slot ${i < st.filled ? 'ks-slot-full' : ''}`}>
                {i < st.filled && <Item className="ks-pop" />}
              </span>
            ))}
          </div>
          <Clip>{st.clip && <Item />}</Clip>
        </div>
      )}
      <KeyPad letters={['C', 'V']} ctrl={combo.ctrl} last={combo.last} hint={hint} onCtrl={combo.tapCtrl} onLetter={combo.tapLetter} />
    </div>
  )
}
