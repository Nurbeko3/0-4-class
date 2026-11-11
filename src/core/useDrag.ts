import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { sfx } from './audio'

interface Drag {
  id: string
  dx: number
  dy: number
}

/**
 * Sichqoncha va barmoq uchun bir xil ishlaydigan sudrash (Pointer Events).
 * onDrop true qaytarsa — narsa joyiga tushdi; false bo'lsa o'z o'rniga qaytadi
 * (jazo yo'q, faqat yumshoq ovoz).
 */
export function useDrag(onDrop: (id: string, x: number, y: number) => boolean, onPick?: (id: string) => void) {
  const [drag, setDrag] = useState<Drag | null>(null)
  // ref: hodisalar render'dan tez kelsa ham holat eskirmaydi
  const live = useRef<Drag | null>(null)
  const origin = useRef({ x: 0, y: 0 })
  const update = (d: Drag | null) => {
    live.current = d
    setDrag(d)
  }

  const bind = (id: string) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (live.current) return
      e.currentTarget.setPointerCapture(e.pointerId)
      origin.current = { x: e.clientX, y: e.clientY }
      update({ id, dx: 0, dy: 0 })
      onPick?.(id)
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const d = live.current
      if (d) update({ id: d.id, dx: e.clientX - origin.current.x, dy: e.clientY - origin.current.y })
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      const d = live.current
      if (!d) return
      if (!onDrop(d.id, e.clientX, e.clientY) && Math.abs(d.dx) + Math.abs(d.dy) > 30) sfx.oops()
      update(null)
    },
    onPointerCancel: () => update(null),
    style: (drag?.id === id ? { transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.06)` } : undefined) as
      | CSSProperties
      | undefined,
  })

  return { dragging: drag?.id ?? null, bind }
}

export function inside(el: Element | null | undefined, x: number, y: number) {
  if (!el) return false
  const r = el.getBoundingClientRect()
  return x > r.left && x < r.right && y > r.top && y < r.bottom
}
