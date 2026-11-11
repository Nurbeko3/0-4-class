import type { CSSProperties } from 'react'
import { Star } from '../../ui/art'
import type { Dir, Grid as GridData, Point } from './interpreter'
import { Bush, Robot } from './rbArt'

interface Props {
  grid: GridData
  pos: Point
  /** Robot shu tomonga urildi (qisqa turtki animatsiyasi) */
  bump: Dir | null
  /** Marraga yetdi */
  won: boolean
  /** Dastur oxirigacha bajarildi, lekin marraga yetmadi */
  lost: boolean
}

// Panjara: kataklar, to'siqlar (butalar), marra (yulduz) va robot.
// Robot kataklar ustida alohida qatlamda turadi va silliq siljiydi.
export function Grid({ grid, pos, bump, won, lost }: Props) {
  return (
    <div className="rb-grid" style={{ '--w': grid.w, '--h': grid.h } as CSSProperties} aria-hidden="true">
      {grid.walls.flatMap((row, y) =>
        row.map((wall, x) => {
          const goal = grid.goal.x === x && grid.goal.y === y
          return (
            <span key={`${x}-${y}`} className={`rb-cell ${(x + y) % 2 ? 'rb-cell-alt' : ''}`}>
              {wall && <Bush />}
              {goal && <Star className={won ? 'rb-goal rb-goal-won' : 'rb-goal'} />}
            </span>
          )
        }),
      )}
      <span className="rb-robot" style={{ '--x': pos.x, '--y': pos.y } as CSSProperties}>
        <span className={bump ? `rb-bump-${bump}` : won ? 'rb-cheer' : lost ? 'rb-shrug' : ''}>
          <Robot />
        </span>
      </span>
    </div>
  )
}
