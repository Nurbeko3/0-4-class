import type { CSSProperties, ReactNode } from 'react'
import { BackKeyIcon, EnterKeyIcon } from './excelArt'
import { BACKSPACE, ENTER, LETTERS, type Cell } from './sheet'
import './excel.css'

/** Nechta topshiriq bajarilgani: nuqtalar qatori. */
export function Dots({ total, done }: { total: number; done: number }) {
  return (
    <div className="xl-dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < done ? 'xl-dot xl-dot-on' : 'xl-dot'} />
      ))}
    </div>
  )
}

interface GridProps {
  cols: number
  rows: number
  /** Sarlavhasi (harf va raqam) yoritiladigan katak */
  hot?: Cell | null
  /** Har katakning ichi; tugma yoki oddiy element qaytaradi */
  cell: (c: Cell) => ReactNode
}

/** Jadval: yuqorida ustun harflari, chapda qator raqamlari. */
export function Grid({ cols, rows, hot, cell }: GridProps) {
  return (
    <div className="xl-grid" style={{ '--cols': cols, '--rows': rows } as CSSProperties}>
      <span className="xl-corner" />
      {Array.from({ length: cols }, (_, col) => (
        <span key={`c${col}`} className={`xl-head ${hot?.col === col ? 'xl-hot' : ''}`}>
          {LETTERS[col]}
        </span>
      ))}
      {Array.from({ length: rows }, (_, row) => [
        <span key={`r${row}`} className={`xl-head xl-head-row ${hot?.row === row ? 'xl-hot' : ''}`}>
          {row + 1}
        </span>,
        ...Array.from({ length: cols }, (_, col) => cell({ col, row })),
      ])}
    </div>
  )
}

const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', BACKSPACE, '0', ENTER]

/** Ekrandagi raqamli tugmalar — klaviaturasiz (sichqoncha yoki planshet) ham o'ynash uchun. */
export function NumPad({ onKey, enterHint }: { onKey: (key: string) => void; enterHint?: boolean }) {
  return (
    <div className="xl-pad">
      {PAD.map((k) => (
        <button
          key={k}
          type="button"
          tabIndex={-1}
          className={`xl-key ${k === ENTER ? 'xl-key-enter' : ''} ${k === ENTER && enterHint ? 'xl-key-hint' : ''}`}
          aria-label={k}
          onPointerDown={(e) => {
            e.preventDefault()
            onKey(k)
          }}
        >
          {k === BACKSPACE ? <BackKeyIcon /> : k === ENTER ? <EnterKeyIcon /> : k}
        </button>
      ))}
    </div>
  )
}
