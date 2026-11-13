import { useEffect, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { GameProps } from '../registry'
import { Fruit } from './excelArt'
import { FRUITS } from './fruits'
import { Dots, Grid, NumPad } from './parts'
import { ENTER, addr, same, typeInput, typeTasks, type Cell } from './sheet'
import { useNumKeys } from './useNumKeys'

const ROWS = 4

// Katakka yozish: topshiriq «B2 = 7». Bola katakni bosadi (tanlaydi), sonni
// teradi va Enter bilan tasdiqlaydi — haqiqiy jadvaldagi kabi uch qadam.
export function ExcelType({ grade, onWin }: GameProps) {
  const cols = grade >= 4 ? 3 : 2
  const [tasks] = useState(() => typeTasks(grade, ROWS))
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState(false)
  const [buf, setBuf] = useState('')
  const [peek, setPeek] = useState<Cell | null>(null)
  const [nudge, setNudge] = useState(0)
  const [shake, setShake] = useState(0)
  useWinWhen(step >= tasks.length, onWin)

  const done = step >= tasks.length
  const task = tasks[Math.min(step, tasks.length - 1)]
  const filled = tasks.slice(0, step)

  useEffect(() => {
    if (!peek) return
    const t = setTimeout(() => setPeek(null), 1200)
    return () => clearTimeout(t)
  }, [peek])

  const press = (key: string) => {
    if (done) return
    if (!sel) {
      // Katak tanlanmagan: topshiriqdagi manzil "qimirlab" eslatadi
      sfx.oops()
      setNudge((n) => n + 1)
      return
    }
    if (key !== ENTER) {
      setBuf((b) => typeInput(b, key))
      return
    }
    if (buf === String(task.value)) {
      sfx.good()
      setSel(false)
      setBuf('')
      setStep((s) => s + 1)
    } else {
      sfx.oops()
      setBuf('')
      setShake((n) => n + 1)
    }
  }

  useNumKeys(press, !done)

  const clickCell = (c: Cell) => {
    if (done || c.col === 0 || filled.some((f) => same(f.cell, c))) return
    if (same(c, task.cell)) {
      if (!sel) sfx.pop()
      setSel(true)
    } else {
      sfx.oops()
      setPeek(c)
    }
  }

  return (
    <div className="field xl-field">
      <Dots total={tasks.length} done={step} />
      <div className="xl-side">
        {!done && (
          <div key={`${step}-${nudge}`} className={`xl-task ${nudge ? 'xl-task-nudge' : ''}`}>
            <span className={`xl-task-addr ${sel ? '' : 'xl-task-now'}`}>{addr(task.cell)}</span>
            <b>=</b>
            <span className={`xl-task-val ${sel ? 'xl-task-now' : ''}`}>{task.value}</span>
          </div>
        )}
        <NumPad onKey={press} enterHint={sel && buf === String(task.value)} />
      </div>
      <Grid
        cols={cols}
        rows={ROWS}
        hot={sel ? task.cell : null}
        cell={(c) => {
          const key = addr(c)
          if (c.col === 0)
            return (
              <span key={key} className="xl-cell xl-cell-pic">
                <Fruit id={FRUITS[c.row % FRUITS.length]} />
              </span>
            )
          const f = filled.find((x) => same(x.cell, c))
          const active = sel && !done && same(c, task.cell)
          return (
            <button
              key={active ? `${key}-${shake}` : key}
              type="button"
              className={`xl-cell ${f ? 'xl-cell-done' : ''} ${active ? 'xl-cell-sel' : ''} ${active && shake ? 'xl-cell-shake' : ''} ${same(peek, c) ? 'xl-cell-peek' : ''}`}
              tabIndex={-1}
              aria-label={key}
              onClick={() => clickCell(c)}
            >
              {f ? f.value : active ? <>{buf}<i className="xl-caret" /></> : same(peek, c) ? key : null}
            </button>
          )
        }}
      />
    </div>
  )
}
