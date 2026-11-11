import { useState } from 'react'
import { sfx } from '../../core/audio'
import { layout, useWinWhen } from '../../core/util'
import { Lamp } from '../../ui/art'
import type { GameProps } from '../registry'
import { targetSize } from './sizes'

// O'ng tugma: chap tugma bosilsa chiroq faqat qimirlaydi.
export function RightClickGame({ grade, onWin }: GameProps) {
  const n = grade <= 1 ? 4 : 6
  const [spots] = useState(() => layout(n))
  const [lit, setLit] = useState<boolean[]>(() => Array(n).fill(false))
  const [wiggle, setWiggle] = useState<number | null>(null)
  useWinWhen(lit.every(Boolean), onWin)

  return (
    // Maydonning bo'sh joyida ham brauzer menyusi chiqmasin
    <div className="field night" onContextMenu={(e) => e.preventDefault()}>
      {spots.map((s, i) => (
        <button
          key={i}
          className={`target ${wiggle === i ? 'wiggle' : ''}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: targetSize(grade) }}
          onClick={() => {
            if (!lit[i]) setWiggle(i)
          }}
          onAnimationEnd={() => setWiggle((w) => (w === i ? null : w))}
          onContextMenu={() => {
            if (lit[i]) return
            sfx.good()
            setLit((a) => a.map((v, j) => v || j === i))
          }}
        >
          <Lamp on={lit[i]} />
        </button>
      ))}
    </div>
  )
}
