import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { sfx } from '../../core/audio'
import { shuffle, useWinWhen } from '../../core/util'
import { useT } from '../../i18n/useT'
import { BrushTool, EraserTool } from '../paint/paintArt'
import type { GameProps } from '../registry'
import { eraseAlong, scribble } from './logic'
import { Dots, Pic } from './parts'
import { FILL_PICTURES, type Pt } from './pictures'

// Ichki o'lcham o'zgarmas, CSS masshtablaydi (rasm bilan bir xil 4:3).
const W = 800
const H = 600
const INKS = ['#2D3A4A', '#C2185B', '#5B3A8C']
/** Qoralamaning shuncha qismi o'chsa, qolgani o'zi tozalanadi */
const ENOUGH = 0.94

type Tool = 'brush' | 'eraser'

// O'chirg'ich: tayyor rasm ustiga qoralama chizib tashlangan. Cho'tka tanlangan
// holda boshlanadi — bola avval asbobni almashtirishi kerak (cho'tka o'chirmaydi),
// keyin qoralamani sudrab o'chiradi. Rasmning o'zi o'chmaydi.
export function PaintEraser({ grade, onWin, setSay }: GameProps) {
  const t = useT()
  const [pics] = useState(() => shuffle(FILL_PICTURES).slice(0, 2))
  const strokes = grade <= 2 ? 4 : 6
  const radius = grade <= 2 ? 40 : 30
  const [idx, setIdx] = useState(0)
  const [tool, setTool] = useState<Tool>('brush')
  const [left, setLeft] = useState(1)
  const [hinted, setHinted] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const points = useRef<Pt[]>([])
  const erased = useRef<boolean[]>([])
  const last = useRef<Pt | null>(null)
  useWinWhen(idx >= pics.length, onWin, 200)

  const done = idx >= pics.length
  const pic = pics[Math.min(idx, pics.length - 1)]
  const clean = left <= 1 - ENOUGH

  // Har rasm boshida yangi qoralama chiziladi
  useEffect(() => {
    const c = canvas.current?.getContext('2d')
    if (!c || done) return
    c.globalCompositeOperation = 'source-over'
    c.clearRect(0, 0, W, H)
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.lineWidth = 14
    const all: Pt[] = []
    for (let s = 0; s < strokes; s++) {
      const pts = scribble(W, H)
      c.strokeStyle = INKS[s % INKS.length]
      c.beginPath()
      pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)))
      c.stroke()
      all.push(...pts)
    }
    points.current = all
    erased.current = Array(all.length).fill(false)
    setLeft(1)
  }, [idx, done, strokes])

  // Tozalangach: qoldiqlar yo'qoladi, rasm ko'rinadi, keyingisiga o'tamiz
  useEffect(() => {
    if (!clean || done) return
    canvas.current?.getContext('2d')?.clearRect(0, 0, W, H)
    sfx.good()
    const timer = setTimeout(() => setIdx((i) => i + 1), 1400)
    return () => clearTimeout(timer)
  }, [clean, done])

  const point = (e: PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }

  const rub = (a: Pt, b: Pt) => {
    const c = canvas.current!.getContext('2d')!
    c.globalCompositeOperation = 'destination-out'
    c.lineWidth = radius * 2
    c.beginPath()
    c.moveTo(a.x, a.y)
    c.lineTo(b.x + 0.01, b.y)
    c.stroke()
    if (eraseAlong(points.current, erased.current, a, b, radius)) {
      setLeft(erased.current.filter((v) => !v).length / erased.current.length)
    }
  }

  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    if (done || clean) return
    if (tool !== 'eraser') {
      sfx.oops()
      if (!hinted) {
        setHinted(true)
        setSay('say.paintlab.eraser.pick')
      }
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = point(e)
    last.current = p
    rub(p, p)
  }

  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!last.current || clean) return
    const p = point(e)
    rub(last.current, p)
    last.current = p
  }

  const up = () => {
    last.current = null
  }

  const pick = (id: Tool) => {
    setTool(id)
    if (id === 'eraser') sfx.pop()
    if (id === 'eraser' && hinted) {
      setHinted(false)
      setSay('say.paintlab.eraser')
    }
  }

  return (
    <div className="field pl-field">
      <Dots total={pics.length} done={idx + (clean && !done ? 1 : 0)} />
      <div className="pl-tools">
        <button type="button" className={`pl-tool ${tool === 'brush' ? 'on' : ''}`} aria-label={t('paintlab.tool.brush')} aria-pressed={tool === 'brush'} onClick={() => pick('brush')}>
          <BrushTool />
        </button>
        <button
          type="button"
          className={`pl-tool ${tool === 'eraser' ? 'on' : ''} ${tool !== 'eraser' ? 'pl-tool-hint' : ''}`}
          aria-label={t('paintlab.tool.eraser')}
          aria-pressed={tool === 'eraser'}
          onClick={() => pick('eraser')}
        >
          <EraserTool />
        </button>
        <div className="pl-meter" aria-hidden="true">
          <i style={{ height: `${Math.round((1 - left) * 100)}%` }} />
        </div>
      </div>
      <div key={pic.id} className={`pl-stage ${clean ? 'pl-stage-done' : ''}`}>
        <Pic pic={pic} className="pl-canvas" />
        <canvas
          ref={canvas}
          className={`pl-cover ${tool === 'eraser' ? 'pl-cover-erase' : ''}`}
          width={W}
          height={H}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        />
      </div>
    </div>
  )
}
