import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { Fruit } from './excelArt'
import { FRUITS } from './fruits'
import { Dots, Grid, NumPad } from './parts'
import { ENTER, addr, numbers, total, typeInput } from './sheet'
import { useNumKeys } from './useNumKeys'

const ROUNDS = 3

// Yig'indi: bola sonlarni birma-bir bosib "qo'shadi" (ifoda yig'iladi: 3 + 4 + 2),
// keyin javobni «Jami» katagiga yozadi. Oxirgi raundda — Avtoyig'indi tugmasi:
// kompyuter o'zi hisoblashini ko'radi.
export function ExcelSum({ grade, onWin, setSay }: GameProps) {
  const t = useT()
  const hard = grade >= 4
  const n = hard ? 4 : 3
  const [rounds] = useState(() => Array.from({ length: ROUNDS }, () => numbers(n, hard ? 2 : 1, hard ? 9 : 5)))
  const [round, setRound] = useState(0)
  const [order, setOrder] = useState<number[]>([])
  const [buf, setBuf] = useState('')
  const [solved, setSolved] = useState(false)
  const [shake, setShake] = useState(0)
  useWinWhen(round >= ROUNDS, onWin, 200)

  const done = round >= ROUNDS
  const nums = rounds[Math.min(round, ROUNDS - 1)]
  const sum = total(nums)
  const auto = round === ROUNDS - 1
  const allAdded = order.length === n

  // Raund yechilgach javobni biroz ko'rsatib, keyingisiga o'tamiz
  useEffect(() => {
    if (!solved) return
    const timer = setTimeout(() => {
      if (round + 1 === ROUNDS - 1) setSay('say.excel.sum.auto')
      setRound((r) => r + 1)
      setOrder([])
      setBuf('')
      setSolved(false)
    }, 1300)
    return () => clearTimeout(timer)
  }, [solved, round, setSay])

  const add = (i: number) => {
    if (done || solved || auto || order.includes(i)) return
    sfx.pop()
    setOrder((o) => [...o, i])
  }

  const press = (key: string) => {
    if (done || solved || auto) return
    if (!allAdded) {
      sfx.oops()
      setShake((s) => s + 1)
      return
    }
    if (key !== ENTER) {
      setBuf((b) => typeInput(b, key))
      return
    }
    if (buf === String(sum)) {
      sfx.good()
      setSolved(true)
    } else {
      sfx.oops()
      setBuf('')
      setShake((s) => s + 1)
    }
  }

  useNumKeys(press, !done && !auto)

  const autoSum = () => {
    if (solved) return
    sfx.good()
    setOrder(nums.map((_, i) => i))
    setSolved(true)
  }

  return (
    <div className="field xl-field">
      <Dots total={ROUNDS} done={round} />
      <div className="xl-side">
        <div className="xl-expr" aria-live="polite">
          {order.map((i, k) => (
            <span key={i} className="xl-expr-num">
              {k > 0 && <b>+</b>}
              {nums[i]}
            </span>
          ))}
          {allAdded && <b>=</b>}
          {allAdded && <span className={`xl-expr-num ${solved ? 'xl-expr-sum' : ''}`}>{solved ? sum : '?'}</span>}
        </div>
        {auto && !done ? (
          <button type="button" className={`btn xl-auto ${solved ? '' : 'xl-auto-hint'}`} onClick={autoSum}>
            <span className="xl-sigma">Σ</span>
            {t('excel.auto')}
          </button>
        ) : (
          <NumPad onKey={press} enterHint={allAdded && buf === String(sum)} />
        )}
      </div>
      <Grid
        key={round}
        cols={2}
        rows={n + 1}
        cell={(c) => {
          const key = addr(c)
          if (c.row === n) {
            if (c.col === 0)
              return (
                <span key={key} className="xl-cell xl-cell-total">
                  {t('excel.total')}
                </span>
              )
            const active = allAdded && !solved
            return (
              <span key={`${key}-${shake}`} className={`xl-cell xl-cell-total ${active ? 'xl-cell-sel' : ''} ${solved ? 'xl-cell-done' : ''} ${shake && !solved ? 'xl-cell-shake' : ''}`}>
                {solved ? sum : active ? <>{buf}<i className="xl-caret" /></> : null}
              </span>
            )
          }
          if (c.col === 0)
            return (
              <span key={key} className="xl-cell xl-cell-pic">
                <Fruit id={FRUITS[c.row % FRUITS.length]} />
              </span>
            )
          const used = order.includes(c.row)
          return (
            <button
              key={key}
              type="button"
              className={`xl-cell xl-cell-num ${used ? 'xl-cell-used' : auto ? '' : 'xl-cell-pick'}`}
              tabIndex={used || auto ? -1 : 0}
              aria-label={`${key}: ${nums[c.row]}`}
              onClick={() => add(c.row)}
            >
              {nums[c.row]}
            </button>
          )
        }}
      />
    </div>
  )
}
