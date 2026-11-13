import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { GameProps } from '../registry'
import { Gem } from './excelArt'
import { Dots, Grid } from './parts'
import { addr, addrOptions, pickCells, same, type Cell } from './sheet'

// Xazina katagi, ikki bosqich:
//   1) manzil aytiladi (B3) — bola katakni topib bosadi, ichidan xazina chiqadi;
//   2) aksincha — sariq katak ko'rsatiladi, bola uning manzilini uchta variantdan tanlaydi.
// Xato bosilgan katak o'z manzilini ko'rsatadi: jazo emas, yordam.
export function ExcelCell({ grade, onWin, setSay }: GameProps) {
  const hard = grade >= 4
  const cols = hard ? 7 : 5
  const rows = hard ? 5 : 4
  const nFind = hard ? 6 : 5
  const nName = hard ? 4 : 3
  const count = nFind + nName

  const [targets] = useState(() => pickCells(cols, rows, count).map((cell) => ({ cell, options: addrOptions(cell, cols, rows) })))
  const [step, setStep] = useState(0)
  const [peek, setPeek] = useState<Cell | null>(null)
  const [hover, setHover] = useState<Cell | null>(null)
  const [wrong, setWrong] = useState<string[]>([])
  useWinWhen(step >= count, onWin)

  const done = step >= count
  const { cell: target, options } = targets[Math.min(step, count - 1)]
  const naming = step >= nFind
  const found = targets.slice(0, step).map((x) => x.cell)

  useEffect(() => {
    if (!peek) return
    const t = setTimeout(() => setPeek(null), 1200)
    return () => clearTimeout(t)
  }, [peek])

  const advance = () => {
    sfx.good()
    setPeek(null)
    setWrong([])
    if (step + 1 === nFind) setSay('say.excel.cell.name')
    setStep((s) => s + 1)
  }

  const clickCell = (c: Cell) => {
    if (done || naming || found.some((f) => same(f, c))) return
    if (same(c, target)) advance()
    else {
      sfx.oops()
      setPeek(c)
    }
  }

  const choose = (o: string) => {
    if (done || wrong.includes(o)) return
    if (o === addr(target)) advance()
    else {
      sfx.oops()
      setWrong((w) => [...w, o])
    }
  }

  return (
    <div className="field xl-field">
      <Dots total={count} done={step} />
      <div className="xl-side">
        {!naming && !done && (
          <div key={step} className="xl-badge">
            {addr(target)}
          </div>
        )}
        {naming && !done && (
          <div key={step} className="xl-options">
            {options.map((o) => (
              <button key={o} type="button" className={`xl-option ${wrong.includes(o) ? 'xl-option-no' : ''}`} onClick={() => choose(o)}>
                {o}
              </button>
            ))}
          </div>
        )}
        <div className="xl-loot" aria-hidden="true">
          {found.map((f) => (
            <span key={addr(f)} className="xl-loot-gem">
              <Gem />
            </span>
          ))}
        </div>
      </div>
      <Grid
        cols={cols}
        rows={rows}
        // 3-sinfda sariq katakning harfi va raqami ham yoritiladi; 4-sinfda bola o'zi topadi
        hot={naming ? (hard || done ? null : target) : hover}
        cell={(c) => {
          const isFound = found.some((f) => same(f, c))
          const ask = naming && !done && same(c, target)
          return (
            <button
              key={addr(c)}
              type="button"
              className={`xl-cell ${isFound ? 'xl-cell-found' : ''} ${ask ? 'xl-cell-ask' : ''} ${same(peek, c) ? 'xl-cell-peek' : ''}`}
              tabIndex={naming || isFound ? -1 : 0}
              aria-label={addr(c)}
              onPointerEnter={() => !naming && setHover(c)}
              onPointerLeave={() => setHover(null)}
              onClick={() => clickCell(c)}
            >
              {isFound ? <Gem /> : same(peek, c) ? addr(c) : null}
            </button>
          )
        }}
      />
    </div>
  )
}
