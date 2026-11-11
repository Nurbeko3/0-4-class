import { useRef, useState, type ComponentType, type CSSProperties } from 'react'
import { sfx, speak } from '../../core/audio'
import { useStore } from '../../core/progress'
import { inside, useDrag } from '../../core/useDrag'
import { shuffle, useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { KeyboardArt, MonitorArt, MouseArt, PrinterArt, SpeakerArt, UnitArt } from './partsArt'
import './parts.css'

interface Part {
  id: string
  Art: ComponentType<{ className?: string }>
  /** Nomi — ham yozuv, ham ovoz (say.* kaliti) */
  name: StrKey
  use: StrKey
}

// Birinchi to'rttasi — asosiy qismlar (0–1-sinf), qolganlari 2-sinfdan qo'shiladi.
export const PARTS: Part[] = [
  { id: 'monitor', Art: MonitorArt, name: 'say.parts.monitor', use: 'parts.use.monitor' },
  { id: 'mouse', Art: MouseArt, name: 'say.parts.mouse', use: 'parts.use.mouse' },
  { id: 'keyboard', Art: KeyboardArt, name: 'say.parts.keyboard', use: 'parts.use.keyboard' },
  { id: 'unit', Art: UnitArt, name: 'say.parts.unit', use: 'parts.use.unit' },
  { id: 'speaker', Art: SpeakerArt, name: 'say.parts.speaker', use: 'parts.use.speaker' },
  { id: 'printer', Art: PrinterArt, name: 'say.parts.printer', use: 'parts.use.printer' },
]

export const partsFor = (grade: number) => (grade <= 1 ? PARTS.slice(0, 4) : PARTS)

/**
 * match — rasmni o'z soyasiga qo'yish (o'qiy olmaydiganlar uchun, nomi ovoz bilan aytiladi)
 * name  — nom yozilgan yorliqni rasmga qo'yish
 * use   — qurilma vazifasini rasmga qo'yish
 */
type Mode = 'match' | 'name' | 'use'

function PartsGame({ grade, onWin, mode }: GameProps & { mode: Mode }) {
  const { lang } = useStore()
  const t = useT()
  const [parts] = useState(() => shuffle(partsFor(grade)))
  const [chips] = useState(() => shuffle(parts))
  const [done, setDone] = useState<string[]>([])
  const [shake, setShake] = useState<string | null>(null)
  const cards = useRef<Record<string, HTMLElement | null>>({})
  useWinWhen(done.length === parts.length, onWin)

  const { dragging, bind } = useDrag(
    (id, x, y) => {
      const hit = parts.find((p) => inside(cards.current[p.id], x, y))
      if (hit?.id === id) {
        sfx.good()
        setDone((d) => (d.includes(id) ? d : [...d, id]))
        return true
      }
      if (hit && !done.includes(hit.id)) setShake(hit.id)
      return false
    },
    (id) => {
      // Yorliq yoki rasm qo'lga olinganda nomi aytiladi
      const p = parts.find((x) => x.id === id)
      if (p && mode !== 'use') speak(p.name, lang)
    },
  )

  return (
    <div className="field pt-field">
      <div className="pt-cards" style={{ '--cols': parts.length } as CSSProperties}>
        {parts.map((p) => {
          const ok = done.includes(p.id)
          return (
            <div
              key={p.id}
              data-id={p.id}
              className={`pt-card ${ok ? 'ok' : ''} ${shake === p.id ? 'wiggle' : ''}`}
              ref={(el) => {
                cards.current[p.id] = el
              }}
              onAnimationEnd={() => setShake((s) => (s === p.id ? null : s))}
            >
              <p.Art className={`pt-art ${mode === 'match' && !ok ? 'pt-shadow' : ''}`} />
              {mode === 'use' && <div className="pt-caption">{t(p.name)}</div>}
              <div className={`pt-slot ${ok ? 'filled' : ''}`}>{ok && <span className="pop-in">{t(mode === 'use' ? p.use : p.name)}</span>}</div>
            </div>
          )
        })}
      </div>

      <div className="pt-tray">
        {chips.map((p) => (
          <div key={p.id} className="pt-chipslot">
            {!done.includes(p.id) && (
              <div data-id={p.id} className={`pt-chip ${mode} ${dragging === p.id ? 'dragging' : ''}`} {...bind(p.id)}>
                {mode === 'match' ? <p.Art /> : t(mode === 'use' ? p.use : p.name)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export const PartsMatch = (p: GameProps) => <PartsGame {...p} mode="match" />
export const PartsName = (p: GameProps) => <PartsGame {...p} mode="name" />
export const PartsUse = (p: GameProps) => <PartsGame {...p} mode="use" />
