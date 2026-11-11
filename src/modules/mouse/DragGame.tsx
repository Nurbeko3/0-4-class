import { useRef, useState, type PointerEvent } from 'react'
import { sfx } from '../../core/audio'
import { shuffle, useWinWhen } from '../../core/util'
import { Bee, Bird, Bowl, Dog, Fish, Hive, Kennel, Nest } from '../../ui/art'
import type { GameProps } from '../registry'

const PAIRS = [
  { id: 'dog', Animal: Dog, Home: Kennel },
  { id: 'bird', Animal: Bird, Home: Nest },
  { id: 'fish', Animal: Fish, Home: Bowl },
  { id: 'bee', Animal: Bee, Home: Hive },
]

// Sudrab tashlash: hayvon noto'g'ri joyga qo'yilsa, shunchaki o'rniga qaytadi.
export function DragGame({ grade, onWin }: GameProps) {
  const [animals] = useState(() => shuffle(PAIRS).slice(0, grade === 0 ? 3 : 4))
  const [homes] = useState(() => shuffle(animals))
  const [done, setDone] = useState<string[]>([])
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null)
  const origin = useRef({ x: 0, y: 0 })
  const homeEls = useRef<Record<string, HTMLDivElement | null>>({})
  useWinWhen(done.length === animals.length, onWin)

  // Joriy sudrash ref'da ham turadi: hodisalar render'dan tez kelsa ham holat eskirmaydi
  const live = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const update = (d: typeof live.current) => {
    live.current = d
    setDrag(d)
  }

  const down = (e: PointerEvent<HTMLDivElement>, id: string) => {
    if (live.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    origin.current = { x: e.clientX, y: e.clientY }
    update({ id, dx: 0, dy: 0 })
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = live.current
    if (d) update({ id: d.id, dx: e.clientX - origin.current.x, dy: e.clientY - origin.current.y })
  }
  const up = (e: PointerEvent<HTMLDivElement>) => {
    const d = live.current
    if (!d) return
    // Qo'yib yuborilgan nuqta uy ichidami?
    const h = homeEls.current[d.id]?.getBoundingClientRect()
    if (h && e.clientX > h.left && e.clientX < h.right && e.clientY > h.top && e.clientY < h.bottom) {
      sfx.good()
      setDone((list) => (list.includes(d.id) ? list : [...list, d.id]))
    } else if (Math.abs(d.dx) + Math.abs(d.dy) > 30) {
      sfx.oops()
    }
    update(null)
  }

  return (
    <div className="field meadow dragfield">
      <div className="dragcol">
        {animals.map(({ id, Animal }) => {
          const active = drag?.id === id
          return (
            <div key={id} className="dragslot">
              {!done.includes(id) && (
                <div
                  className={`animal ${active ? 'dragging' : ''}`}
                  data-id={id}
                  style={active ? { transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.08)` } : undefined}
                  onPointerDown={(e) => down(e, id)}
                  onPointerMove={move}
                  onPointerUp={up}
                  onPointerCancel={() => update(null)}
                >
                  <Animal />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="dragcol">
        {homes.map(({ id, Animal, Home }) => (
          <div
            key={id}
            className="den"
            data-id={id}
            ref={(el) => {
              homeEls.current[id] = el
            }}
          >
            <Home />
            {done.includes(id) && (
              <div className="resident pop-in">
                <Animal />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
