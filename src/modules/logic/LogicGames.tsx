import { useEffect, useState, type CSSProperties } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { Question, ShapeArt } from './lgArt'
import { memoryCols, memoryDeck, oddCols, oddRounds, patternRounds, same, type OddRound, type PatternRound } from './logic'
import { useItemName, useRounds } from './useRounds'
import './logic.css'

const vars = (v: Record<string, number>) => v as CSSProperties

function Dots({ count, idx, solved }: { count: number; idx: number; solved: boolean }) {
  return (
    <div className="lg-dots" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={i < idx || (i === idx && solved) ? 'lg-dot lg-dot-on' : 'lg-dot'} />
      ))}
    </div>
  )
}

/** Tugma holati: to'g'ri topilgan / noto'g'ri bosilgan / savol yechilgach xiralashgan */
const tileClass = (right: boolean, wrong: boolean, off: boolean) =>
  `lg-tile ${right ? 'lg-tile-yes' : ''} ${wrong ? 'lg-tile-no' : ''} ${off ? 'lg-tile-off' : ''}`

// ---------- Ortiqchasini top ----------

export function OddGame({ grade, onWin }: GameProps) {
  const [rounds] = useState(() => oddRounds(grade))
  const { idx, solved, solve } = useRounds(rounds.length, onWin)
  return (
    <div className="field lg-field">
      <Dots count={rounds.length} idx={idx} solved={solved} />
      <OddBoard key={idx} round={rounds[idx]} solved={solved} onSolve={solve} />
    </div>
  )
}

function OddBoard({ round, solved, onSolve }: { round: OddRound; solved: boolean; onSolve: () => void }) {
  const name = useItemName()
  const [wrong, setWrong] = useState<number[]>([])
  const cols = oddCols(round.items.length)

  const choose = (i: number) => {
    if (solved || wrong.includes(i)) return
    if (i === round.odd) {
      sfx.good()
      onSolve()
    } else {
      sfx.oops()
      setWrong((w) => [...w, i])
    }
  }

  return (
    <div className="lg-body">
      <div className="lg-odd" style={vars({ '--cols': cols, '--rows': Math.ceil(round.items.length / cols) })}>
        {round.items.map((it, i) => (
          <button
            key={i}
            type="button"
            className={tileClass(solved && i === round.odd, wrong.includes(i), solved && i !== round.odd)}
            style={vars({ '--i': i })}
            aria-label={name(it)}
            aria-disabled={solved || wrong.includes(i)}
            onClick={() => choose(i)}
          >
            <ShapeArt item={it} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- Qatorni davom ettir ----------

export function PatternGame({ grade, onWin }: GameProps) {
  const [rounds] = useState(() => patternRounds(grade))
  const { idx, solved, solve } = useRounds(rounds.length, onWin)
  return (
    <div className="field lg-field">
      <Dots count={rounds.length} idx={idx} solved={solved} />
      <PatternBoard key={idx} round={rounds[idx]} solved={solved} onSolve={solve} />
    </div>
  )
}

function PatternBoard({ round, solved, onSolve }: { round: PatternRound; solved: boolean; onSolve: () => void }) {
  const name = useItemName()
  const [wrong, setWrong] = useState<number[]>([])

  const choose = (i: number) => {
    if (solved || wrong.includes(i)) return
    if (i === round.answer) {
      sfx.good()
      onSolve()
    } else {
      sfx.oops()
      setWrong((w) => [...w, i])
    }
  }

  return (
    <div className="lg-body lg-pattern">
      <div className="lg-row" style={vars({ '--len': round.row.length })}>
        {round.row.map((it, i) =>
          i !== round.gap ? (
            <span key={i} className="lg-cell" style={vars({ '--i': i })} role="img" aria-label={name(it)}>
              <ShapeArt item={it} />
            </span>
          ) : (
            <span key={i} className={`lg-cell lg-gap ${solved ? 'lg-gap-done' : ''}`} style={vars({ '--i': i })}>
              {solved ? <ShapeArt item={it} /> : <Question />}
            </span>
          ),
        )}
      </div>
      <div className="lg-options" style={vars({ '--opts': round.options.length })}>
        {round.options.map((it, i) => (
          <button
            key={i}
            type="button"
            className={tileClass(solved && i === round.answer, wrong.includes(i), solved && i !== round.answer)}
            style={vars({ '--i': i })}
            aria-label={name(it)}
            aria-disabled={solved || wrong.includes(i)}
            onClick={() => choose(i)}
          >
            <ShapeArt item={it} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- Juftini top ----------

export function MemoryGame({ grade, onWin }: GameProps) {
  const t = useT()
  const name = useItemName()
  const [deck] = useState(() => memoryDeck(grade))
  /** Ochiq turgan, hali jufti topilmagan kartochkalar (ko'pi bilan ikkita) */
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  useWinWhen(matched.length === deck.length, onWin, 800)

  // Mos kelmagan juftlik biroz ko'rinib turadi, keyin yopiladi
  useEffect(() => {
    if (open.length !== 2) return
    const timer = setTimeout(() => setOpen([]), grade <= 1 ? 1500 : 1100)
    return () => clearTimeout(timer)
  }, [open, grade])

  const flip = (i: number) => {
    if (matched.includes(i) || open.includes(i)) return
    if (open.length !== 1) {
      // Birinchi kartochka (ikkita mos kelmagani ochiq tursa — kutmasdan yopamiz)
      sfx.pop()
      setOpen([i])
      return
    }
    setMoves((m) => m + 1)
    if (same(deck[open[0]], deck[i])) {
      sfx.good()
      setMatched((m) => [...m, open[0], i])
      setOpen([])
    } else {
      sfx.pop()
      setOpen([open[0], i])
    }
  }

  const cols = memoryCols(deck.length)

  return (
    <div className="field lg-field lg-memory">
      <p className="lg-moves">{t('logic.moves', { n: moves })}</p>
      <div className="lg-body">
        <div className="lg-deck" style={vars({ '--cols': cols, '--rows': Math.ceil(deck.length / cols) })}>
          {deck.map((it, i) => {
            const done = matched.includes(i)
            const up = done || open.includes(i)
            return (
              <button
                key={i}
                type="button"
                className={`lg-card ${up ? 'lg-card-up' : ''} ${done ? 'lg-card-done' : ''}`}
                style={vars({ '--i': i })}
                aria-label={up ? name(it) : t('logic.card', { n: i + 1 })}
                aria-disabled={up}
                onClick={() => flip(i)}
              >
                <span className="lg-card-in">
                  <span className="lg-face lg-back">
                    <Question />
                  </span>
                  <span className="lg-face lg-front">
                    <ShapeArt item={it} />
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
