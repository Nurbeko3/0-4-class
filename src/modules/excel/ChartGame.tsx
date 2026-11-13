import { useState, type CSSProperties } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { GameProps } from '../registry'
import { CheckIcon, Fruit } from './excelArt'
import { FRUITS, FRUIT_COLOR } from './fruits'
import { Dots, Grid } from './parts'
import { addr, chartValues } from './sheet'

const ROUNDS = 2

// Diagramma: jadvaldagi songa qarab har ustun kerakli balandlikka ko'tariladi
// (katakni bosish — ustun o'sha yergacha o'sadi). Hammasi to'g'ri bo'lgach savol:
// qaysi biri eng ko'p — eng baland ustunni bosish.
export function ExcelChart({ grade, onWin, setSay }: GameProps) {
  const hard = grade >= 4
  const n = hard ? 4 : 3
  const max = hard ? 8 : 5
  const [rounds] = useState(() => Array.from({ length: ROUNDS }, () => chartValues(n, max)))
  const [round, setRound] = useState(0)
  const [heights, setHeights] = useState<number[]>(() => Array(n).fill(0))
  const [miss, setMiss] = useState<number | null>(null)
  useWinWhen(round >= ROUNDS, onWin, 300)

  const done = round >= ROUNDS
  const values = rounds[Math.min(round, ROUNDS - 1)]
  const built = heights.every((h, i) => h === values[i])
  const top = values.indexOf(Math.max(...values))

  const setBar = (i: number, level: number) => {
    if (done || built || heights[i] === values[i]) return
    const next = heights.map((h, j) => (j === i ? level : h))
    setHeights(next)
    if (next.every((h, j) => h === values[j])) {
      sfx.good()
      setSay('say.excel.chart.most')
    } else if (level === values[i]) sfx.pop()
  }

  const pickMost = (i: number) => {
    if (done || !built) return
    if (i !== top) {
      sfx.oops()
      setMiss(i)
      return
    }
    sfx.good()
    setMiss(null)
    setHeights(Array(n).fill(0))
    if (round + 1 < ROUNDS) setSay('say.excel.chart')
    setRound((r) => r + 1)
  }

  return (
    <div className="field xl-field">
      <Dots total={ROUNDS * 2} done={round * 2 + (built && !done ? 1 : 0)} />
      <Grid
        key={`grid${round}`}
        cols={2}
        rows={n}
        cell={(c) =>
          c.col === 0 ? (
            <span key={addr(c)} className="xl-cell xl-cell-pic">
              <Fruit id={FRUITS[c.row]} />
            </span>
          ) : (
            <span key={addr(c)} className={`xl-cell xl-cell-num ${heights[c.row] === values[c.row] ? 'xl-cell-done' : ''}`}>
              {values[c.row]}
            </span>
          )
        }
      />
      <div key={`chart${round}`} className={`xl-chart ${built ? 'xl-chart-built' : ''}`} style={{ '--max': max, '--n': n } as CSSProperties}>
        <div className="xl-axis" aria-hidden="true">
          {Array.from({ length: max }, (_, k) => (
            <span key={k}>{max - k}</span>
          ))}
        </div>
        {values.map((v, i) => {
          const ok = heights[i] === v
          return (
            <div key={i} className={`xl-col ${ok ? 'xl-col-ok' : ''} ${miss === i ? 'xl-col-miss' : ''}`} style={{ '--c': FRUIT_COLOR[FRUITS[i]] } as CSSProperties}>
              <div className="xl-bar" onClick={() => pickMost(i)}>
                {Array.from({ length: max }, (_, k) => {
                  const level = max - k
                  return (
                    <button
                      key={level}
                      type="button"
                      className={`xl-step ${level <= heights[i] ? 'xl-step-on' : ''} ${level === heights[i] ? 'xl-step-top' : ''}`}
                      tabIndex={built || ok ? -1 : 0}
                      aria-label={`${level}`}
                      onClick={() => setBar(i, level)}
                    >
                      {level === heights[i] && ok && !built ? <CheckIcon /> : null}
                    </button>
                  )
                })}
              </div>
              <span className="xl-col-pic">
                <Fruit id={FRUITS[i]} />
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
