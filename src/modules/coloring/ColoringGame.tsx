import { useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { CheckMark, PixelPic } from './clArt'
import { buildCells, COLORS, picturesFor, valueOf, type Picture } from './pictures'
import './coloring.css'

/**
 * Raqam bo'yicha bo'yash. Avval rasm tanlanadi, keyin palitradan rang (raqam) tanlab,
 * shu raqamli kataklar bosib yoki sudrab bo'yaladi. 2-sinfdan boshlab katakda raqam emas,
 * misol turadi — javobi qaysi rang ekanini bildiradi.
 */
export function ColoringGame({ grade, onWin, setSay }: GameProps) {
  const t = useT()
  const [pic, setPic] = useState<Picture | null>(null)

  if (!pic) {
    return (
      <div className="field cl-field cl-gallery">
        {picturesFor(grade).map((p) => (
          <button
            key={p.id}
            className="cl-thumb"
            aria-label={t(`paint.numbers.pic.${p.id}` as StrKey)}
            onClick={() => {
              sfx.pop()
              if (grade >= 2) setSay('say.paint.numbers.math')
              setPic(p)
            }}
          >
            <PixelPic pic={p} />
            <span>{t(`paint.numbers.pic.${p.id}` as StrKey)}</span>
          </button>
        ))}
      </div>
    )
  }
  return <Board pic={pic} grade={grade} onWin={onWin} />
}

function Board({ pic, grade, onWin }: { pic: Picture; grade: number; onWin: () => void }) {
  const t = useT()
  const cells = useMemo(() => buildCells(pic, grade), [pic, grade])
  const total = useMemo(() => cells.filter((c) => c.color >= 0).length, [cells])
  const [filled, setFilled] = useState<ReadonlySet<number>>(() => new Set())
  const [sel, setSel] = useState(0)
  const [nope, setNope] = useState<number | null>(null)
  const painting = useRef(false)
  const last = useRef(-1)
  // Sinxron nusxa: bitta sudrashda bir nechta katak ketma-ket bo'yaladi
  const filledRef = useRef(filled)

  const left = (color: number, set: ReadonlySet<number> = filled) =>
    cells.reduce((n, c, i) => n + (c.color === color && !set.has(i) ? 1 : 0), 0)

  const done = filled.size === total
  useWinWhen(done, onWin, 1100)

  const paint = (i: number, isClick: boolean) => {
    const cell = cells[i]
    if (!cell || cell.color < 0 || filledRef.current.has(i)) return
    if (cell.color !== sel) {
      // Jazo yo'q: katak yumshoq silkinadi, xolos
      if (isClick) {
        sfx.oops()
        setNope(i)
      }
      return
    }
    const next = new Set(filledRef.current).add(i)
    filledRef.current = next
    setFilled(next)
    if (left(sel, next) > 0) {
      sfx.pop()
      return
    }
    // Rang tugadi — keyingi tugamagan rangga o'tamiz
    sfx.good()
    const order = pic.colors.map((_, k) => (sel + 1 + k) % pic.colors.length)
    const nextColor = order.find((c) => left(c, next) > 0)
    if (nextColor !== undefined) setSel(nextColor)
  }

  const cellAt = (e: PointerEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-i]')
    return el ? Number(el.dataset.i) : -1
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    painting.current = true
    last.current = cellAt(e)
    paint(last.current, true)
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!painting.current || !(e.buttons & 1)) return
    const i = cellAt(e)
    if (i === last.current) return
    last.current = i
    paint(i, false)
  }

  const stop = () => {
    painting.current = false
  }

  const cols = pic.rows[0].length
  const rows = pic.rows.length

  return (
    <div className={`field cl-field ${done ? 'cl-done' : ''}`}>
      <div className="cl-main">
        <div className="cl-stage">
          <div
            className={`cl-grid ${grade <= 0 ? 'cl-tinted' : ''} ${grade >= 2 ? 'cl-math' : ''}`}
            style={{ '--cols': cols, '--rows': rows } as CSSProperties}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerCancel={stop}
          >
            {cells.map((c, i) => {
              if (c.color < 0) return <span key={i} className="cl-cell cl-empty" />
              const color = COLORS[pic.colors[c.color]]
              const on = filled.has(i)
              return (
                <span
                  key={i}
                  data-i={i}
                  className={`cl-cell ${on ? 'cl-on' : ''} ${!on && grade <= 1 && c.color === sel ? 'cl-hot' : ''} ${nope === i ? 'cl-nope' : ''}`}
                  style={{ '--c': color.hex } as CSSProperties}
                  onAnimationEnd={(e) => {
                    if (e.animationName === 'cl-nope') setNope(null)
                  }}
                >
                  {!on && c.label}
                </span>
              )
            })}
          </div>
        </div>
        <div className="cl-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={filled.size}>
          <span style={{ transform: `scaleX(${filled.size / total})` }} />
        </div>
      </div>

      <div className="cl-palette">
        {pic.colors.map((id, k) => {
          const color = COLORS[id]
          const finished = left(k) === 0
          return (
            <button
              key={id}
              className={`cl-swatch ${k === sel && !done ? 'cl-sel' : ''} ${finished ? 'cl-finished' : ''}`}
              style={{ '--c': color.hex, '--ink': color.ink } as CSSProperties}
              onClick={() => {
                if (finished) return
                sfx.pop()
                setSel(k)
              }}
              aria-pressed={k === sel}
              aria-label={`${valueOf(grade, k)} — ${t(`paint.color.${id}` as StrKey)}`}
            >
              <b>{finished ? <CheckMark /> : valueOf(grade, k)}</b>
              <span>{t(`paint.color.${id}` as StrKey)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
