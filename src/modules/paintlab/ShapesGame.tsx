import { useEffect, useRef, useState, type ComponentType, type PointerEvent } from 'react'
import { sfx } from '../../core/audio'
import { shuffle, useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import { useT } from '../../i18n/useT'
import { CircleTool, LineTool, RectTool } from '../paint/paintArt'
import type { GameProps } from '../registry'
import { matchShape, tooSmall } from './logic'
import { Dots } from './parts'
import { COLORS, SHAPE_PICTURES, VIEW_H, VIEW_W, type Pt, type Shape, type ShapeType } from './pictures'

const TOOLS: { id: ShapeType; Icon: ComponentType; label: StrKey }[] = [
  { id: 'line', Icon: LineTool, label: 'paintlab.tool.line' },
  { id: 'rect', Icon: RectTool, label: 'paintlab.tool.rect' },
  { id: 'circle', Icon: CircleTool, label: 'paintlab.tool.circle' },
]

/** Bitta shakl: namuna (nuqtali), chizilayotgan yoki tayyor (bo'yalgan). */
function ShapeEl({ type, a, b, className, fill, stroke }: { type: ShapeType; a: Pt; b: Pt; className?: string; fill?: string; stroke?: string }) {
  // CSS dagi stroke atributdan ustun — chiziq rangi inline uslub bilan beriladi
  if (type === 'line') return <line className={className} x1={a.x} y1={a.y} x2={b.x} y2={b.y} style={stroke ? { stroke } : undefined} />
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  const w = Math.abs(a.x - b.x)
  const h = Math.abs(a.y - b.y)
  if (type === 'rect') return <rect className={className} x={x} y={y} width={w} height={h} rx="2" fill={fill} />
  return <ellipse className={className} cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={fill} />
}

// Shakllardan rasm: nuqtali namuna ustidan kerakli asbob bilan tortiladi.
// Asbob va joy to'g'ri kelsa, shakl namunaga "yopishib" bo'yaladi. Joyi to'g'ri,
// asbob boshqa bo'lsa — yo'riqnoma asbobni almashtirishni aytadi.
export function PaintShapes({ grade, onWin, setSay }: GameProps) {
  const t = useT()
  const [pics] = useState(() => {
    // 1-sinf: bitta rasm — uycha; keyin ikki-uchta, tartibi aralash
    if (grade <= 1) return SHAPE_PICTURES.slice(0, 1)
    return shuffle(SHAPE_PICTURES).slice(0, grade >= 3 ? 3 : 2)
  })
  const tol = grade <= 1 ? 16 : grade === 2 ? 13 : 10
  const [idx, setIdx] = useState(0)
  const [tool, setTool] = useState<ShapeType>('line')
  const [drawn, setDrawn] = useState<boolean[]>([])
  const [drag, setDrag] = useState<{ a: Pt; b: Pt } | null>(null)
  const [miss, setMiss] = useState<{ type: ShapeType; a: Pt; b: Pt; n: number } | null>(null)
  const [hinted, setHinted] = useState(false)
  const n = useRef(0)
  useWinWhen(idx >= pics.length, onWin, 200)

  const done = idx >= pics.length
  const pic = pics[Math.min(idx, pics.length - 1)]
  const got = pic.shapes.map((_, i) => drawn[i] ?? false)
  const solved = got.every(Boolean)

  useEffect(() => {
    if (!solved || done) return
    sfx.good()
    const timer = setTimeout(() => {
      // Oxirgi rasm g'alaba oynasi ortida tayyor holda qoladi
      if (idx + 1 < pics.length) setDrawn([])
      setIdx((i) => i + 1)
    }, 1400)
    return () => clearTimeout(timer)
  }, [solved, done, idx, pics.length])

  const point = (e: PointerEvent<SVGSVGElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * VIEW_W, y: ((e.clientY - r.top) / r.height) * VIEW_H }
  }

  const down = (e: PointerEvent<SVGSVGElement>) => {
    if (done || solved || drag) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = point(e)
    setDrag({ a: p, b: p })
  }

  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (drag) setDrag({ a: drag.a, b: point(e) })
  }

  const up = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag) return
    setDrag(null)
    // Oxirgi nuqta qo'yib yuborilgan joydan olinadi (harakat hodisasi kelmagan bo'lishi mumkin)
    const a = drag.a
    const b = point(e)
    if (tooSmall(a, b)) return
    const m = matchShape(tool, a, b, pic.shapes, got, tol)
    if (m.index >= 0) {
      sfx.pop()
      setDrawn(got.map((v, i) => v || i === m.index))
      if (hinted) {
        setHinted(false)
        setSay('say.paintlab.shapes')
      }
      return
    }
    sfx.oops()
    n.current += 1
    setMiss({ type: tool, a, b, n: n.current })
    if (m.wrongTool && !hinted) {
      setHinted(true)
      setSay('say.paintlab.shapes.tool')
    }
  }

  const pickTool = (id: ShapeType) => {
    setTool(id)
    if (hinted) {
      setHinted(false)
      setSay('say.paintlab.shapes')
    }
  }

  return (
    <div className="field pl-field">
      <Dots total={pics.length} done={idx + (solved && !done ? 1 : 0)} />
      <div className="pl-tools">
        {TOOLS.map(({ id, Icon, label }) => (
          <button
            key={id}
            type="button"
            className={`pl-tool ${tool === id ? 'on' : ''} ${hinted && tool !== id ? 'pl-tool-hint' : ''}`}
            aria-label={t(label)}
            aria-pressed={tool === id}
            onClick={() => pickTool(id)}
          >
            <Icon />
          </button>
        ))}
      </div>
      <div key={pic.id} className={`pl-stage ${solved ? 'pl-stage-done' : ''}`}>
        <svg
          className="pl-canvas pl-draw"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={() => setDrag(null)}
        >
          {pic.shapes.map((s: Shape, i) =>
            got[i] ? (
              <ShapeEl key={i} type={s.type} a={s.a} b={s.b} className="pl-shape" fill={COLORS[s.color]} stroke={s.type === 'line' ? COLORS[s.color] : undefined} />
            ) : (
              <ShapeEl key={i} type={s.type} a={s.a} b={s.b} className="pl-ghost" />
            ),
          )}
          {miss && <ShapeEl key={miss.n} type={miss.type} a={miss.a} b={miss.b} className="pl-miss" />}
          {drag && <ShapeEl type={tool} a={drag.a} b={drag.b} className="pl-preview" />}
        </svg>
      </div>
    </div>
  )
}
