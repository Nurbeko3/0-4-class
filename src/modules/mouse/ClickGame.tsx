import { useState } from 'react'
import { sfx } from '../../core/audio'
import { layout, useWinWhen } from '../../core/util'
import { Balloon } from '../../ui/art'
import type { GameProps } from '../registry'
import { COLORS, targetSize } from './sizes'

// Bir marta bosish: sharlar qochmaydi, vaqt chegarasi yo'q.
export function ClickGame({ grade, onWin }: GameProps) {
  const n = grade === 0 ? 6 : 10
  const [spots] = useState(() => layout(n))
  const [popped, setPopped] = useState<boolean[]>(() => Array(n).fill(false))
  useWinWhen(popped.every(Boolean), onWin)

  const pop = (i: number) => {
    if (popped[i]) return
    sfx.pop()
    setPopped((a) => a.map((v, j) => v || j === i))
  }

  return (
    <div className="field sky">
      {spots.map((s, i) => (
        <button
          key={i}
          className={`target ${popped[i] ? 'burst' : 'bob'}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: targetSize(grade), animationDelay: popped[i] ? '0s' : `${-i * 0.37}s` }}
          onClick={() => pop(i)}
          tabIndex={popped[i] ? -1 : 0}
        >
          <Balloon color={COLORS[i % COLORS.length]} />
        </button>
      ))}
    </div>
  )
}
