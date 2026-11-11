import { useState } from 'react'
import { sfx } from '../../core/audio'
import { layout, useWinWhen } from '../../core/util'
import { Gift, Star } from '../../ui/art'
import type { GameProps } from '../registry'
import { COLORS, targetSize } from './sizes'

// Ikki marta bosish: bitta bosishda quti faqat qimirlaydi (jazo yo'q),
// tez ikki marta bosilganda ochiladi.
export function DoubleClickGame({ grade, onWin }: GameProps) {
  const n = grade <= 1 ? 4 : 6
  const [spots] = useState(() => layout(n))
  const [open, setOpen] = useState<boolean[]>(() => Array(n).fill(false))
  const [wiggle, setWiggle] = useState<number | null>(null)
  useWinWhen(open.every(Boolean), onWin)

  return (
    <div className="field meadow">
      {spots.map((s, i) => (
        <button
          key={i}
          className={`target ${open[i] ? 'pop-in' : wiggle === i ? 'wiggle' : ''}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: targetSize(grade) }}
          onClick={(e) => {
            if (!open[i] && e.detail === 1) setWiggle(i)
          }}
          onAnimationEnd={() => setWiggle((w) => (w === i ? null : w))}
          onDoubleClick={() => {
            if (open[i]) return
            sfx.good()
            setOpen((a) => a.map((v, j) => v || j === i))
          }}
        >
          {open[i] ? <Star /> : <Gift color={COLORS[(i + 3) % COLORS.length]} />}
        </button>
      ))}
    </div>
  )
}
