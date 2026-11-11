import { useState } from 'react'
import { sfx } from '../../core/audio'
import { layout, useWinWhen } from '../../core/util'
import { Cloud, Star } from '../../ui/art'
import type { GameProps } from '../registry'
import { targetSize } from './sizes'

// Ko'rsatish: bosish shart emas — ko'rsatkichni bulut ustiga olib borish kifoya.
export function PointGame({ grade, onWin }: GameProps) {
  const n = grade === 0 ? 5 : 8
  const [spots] = useState(() => layout(n))
  const [awake, setAwake] = useState<boolean[]>(() => Array(n).fill(false))
  useWinWhen(awake.every(Boolean), onWin)

  const wake = (i: number) => {
    if (awake[i]) return
    sfx.pop()
    setAwake((a) => a.map((v, j) => v || j === i))
  }

  return (
    <div className="field sky">
      {spots.map((s, i) => (
        <div
          key={i}
          className={`target ${awake[i] ? 'pop-in' : 'bob'}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: targetSize(grade), animationDelay: awake[i] ? '0s' : `${-i * 0.4}s` }}
          // Enter emas: bulut yulduzga almashganda React "enter"ni yo'qotib qo'yishi mumkin
          onPointerOver={() => wake(i)}
          onPointerMove={() => wake(i)}
        >
          {awake[i] ? <Star /> : <Cloud />}
        </div>
      ))}
    </div>
  )
}
