import { useEffect, useRef, useState, type ComponentType, type PointerEvent } from 'react'
import { sfx } from '../../core/audio'
import type { StrKey } from '../../i18n/strings'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { BrushTool, CheckIcon, CircleTool, ClearIcon, EraserTool, LineTool, RectTool, SaveIcon, UndoIcon } from './paintArt'
import './paint.css'

// Ichki o'lcham o'zgarmas: oyna kattalashsa ham rasm buzilmaydi, CSS shunchaki masshtablaydi.
const W = 1280
const H = 720
const MAX_UNDO = 8

type Tool = 'brush' | 'eraser' | 'rect' | 'circle' | 'line'

const TOOLS: { id: Tool; Icon: ComponentType; label: StrKey; minGrade: number }[] = [
  { id: 'brush', Icon: BrushTool, label: 'paint.brush', minGrade: 0 },
  { id: 'rect', Icon: RectTool, label: 'paint.rect', minGrade: 1 },
  { id: 'circle', Icon: CircleTool, label: 'paint.circle', minGrade: 1 },
  { id: 'line', Icon: LineTool, label: 'paint.line', minGrade: 1 },
  { id: 'eraser', Icon: EraserTool, label: 'paint.eraser', minGrade: 2 },
]

const COLORS = ['#2D3A4A', '#E5484D', '#FF8A3D', '#FFC94A', '#45B97C', '#3FA9F5', '#3B5BDB', '#9B5DE5', '#F58FB7', '#8A5A32']
const SIZES = [8, 18, 36]

/** Sinfga qarab asboblar: 0 — cho'tka va rang; 1 — + shakllar; 2+ — o'chirg'ich, qalinlik, saqlash. */
export function PaintGame({ grade, onWin }: GameProps) {
  const t = useT()
  const canvas = useRef<HTMLCanvasElement>(null)
  const undo = useRef<ImageData[]>([])
  const stroke = useRef<{ x: number; y: number; base: ImageData } | null>(null)
  const [tool, setTool] = useState<Tool>('brush')
  const [color, setColor] = useState(COLORS[1])
  const [size, setSize] = useState(SIZES[1])
  const [undoable, setUndoable] = useState(0)
  const [dirty, setDirty] = useState(false)

  const ctx = () => canvas.current!.getContext('2d', { willReadFrequently: true })!

  useEffect(() => {
    const c = ctx()
    c.fillStyle = '#fff'
    c.fillRect(0, 0, W, H)
  }, [])

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }

  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    if (stroke.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const c = ctx()
    const base = c.getImageData(0, 0, W, H)
    undo.current = [...undo.current.slice(-(MAX_UNDO - 1)), base]
    setUndoable(undo.current.length)
    const p = point(e)
    stroke.current = { ...p, base }
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.strokeStyle = tool === 'eraser' ? '#fff' : color
    c.lineWidth = tool === 'eraser' ? size * 2.2 : size
    if (tool === 'brush' || tool === 'eraser') {
      // Bitta bosish ham nuqta qoldiradi
      c.beginPath()
      c.moveTo(p.x, p.y)
      c.lineTo(p.x + 0.01, p.y)
      c.stroke()
    }
  }

  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    const s = stroke.current
    if (!s) return
    const c = ctx()
    const p = point(e)
    if (tool === 'brush' || tool === 'eraser') {
      c.beginPath()
      c.moveTo(s.x, s.y)
      c.lineTo(p.x, p.y)
      c.stroke()
      s.x = p.x
      s.y = p.y
      return
    }
    // Shakl: har harakatda boshlang'ich rasmga qaytib, yangisini chizamiz
    c.putImageData(s.base, 0, 0)
    c.beginPath()
    if (tool === 'rect') c.rect(s.x, s.y, p.x - s.x, p.y - s.y)
    else if (tool === 'circle') c.ellipse((s.x + p.x) / 2, (s.y + p.y) / 2, Math.abs(p.x - s.x) / 2, Math.abs(p.y - s.y) / 2, 0, 0, Math.PI * 2)
    else {
      c.moveTo(s.x, s.y)
      c.lineTo(p.x, p.y)
    }
    c.stroke()
  }

  const up = () => {
    if (!stroke.current) return
    stroke.current = null
    setDirty(true)
  }

  const undoLast = () => {
    const last = undo.current.pop()
    if (!last) return
    ctx().putImageData(last, 0, 0)
    setUndoable(undo.current.length)
    sfx.pop()
  }

  const clear = () => {
    const c = ctx()
    undo.current = [...undo.current.slice(-(MAX_UNDO - 1)), c.getImageData(0, 0, W, H)]
    setUndoable(undo.current.length)
    c.fillStyle = '#fff'
    c.fillRect(0, 0, W, H)
    sfx.pop()
  }

  const save = () => {
    canvas.current!.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${t('paint.filename')}.png`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      sfx.good()
    })
  }

  const tools = TOOLS.filter((x) => grade >= x.minGrade)

  return (
    <div className="field pn-field">
      <div className="pn-main">
        <div className="pn-side">
          {tools.map(({ id, Icon, label }) => (
            <button key={id} data-tool={id} className={`pn-btn ${tool === id ? 'on' : ''}`} aria-label={t(label)} aria-pressed={tool === id} onClick={() => setTool(id)}>
              <Icon />
            </button>
          ))}
        </div>

        <div className="pn-wrap">
          <canvas
            ref={canvas}
            className="pn-canvas"
            width={W}
            height={H}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          />
        </div>

        <div className="pn-side">
          <button className="pn-btn" aria-label={t('paint.undo')} disabled={!undoable} onClick={undoLast}>
            <UndoIcon />
          </button>
          <button className="pn-btn" aria-label={t('paint.clear')} onClick={clear}>
            <ClearIcon />
          </button>
          {grade >= 2 && (
            <button className="pn-btn" data-act="save" aria-label={t('paint.save')} onClick={save}>
              <SaveIcon />
            </button>
          )}
          {/* Tayyor: kamida bir marta chizilgandan keyin yonadi */}
          <button className={`pn-btn done ${dirty ? 'ready' : ''}`} data-act="done" aria-label={t('paint.done')} disabled={!dirty} onClick={onWin}>
            <CheckIcon />
          </button>
        </div>
      </div>

      <div className="pn-bottom">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`pn-color ${color === c && tool !== 'eraser' ? 'on' : ''}`}
            style={{ background: c }}
            aria-label={c}
            onClick={() => {
              setColor(c)
              if (tool === 'eraser') setTool('brush')
            }}
          />
        ))}
        {grade >= 2 && (
          <div className="pn-sizes">
            {SIZES.map((s) => (
              <button key={s} className={`pn-size ${size === s ? 'on' : ''}`} aria-label={`${t('paint.size')} ${s}`} onClick={() => setSize(s)}>
                <i style={{ width: s, height: s }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
