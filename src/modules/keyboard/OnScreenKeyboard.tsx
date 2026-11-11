import type { CSSProperties } from 'react'
import { LAYOUTS, type Script } from './layouts'
import './keyboard.css'

interface Props {
  script: Script
  /** Yoritiladigan tugma (KeyboardEvent.code) — "shuni bos" */
  hint?: string | null
  /** Hozirgina bosilgan tugma va natijasi (qisqa animatsiya uchun) */
  flash?: { code: string; ok: boolean; n: number } | null
  /** Ekrandagi tugma bosilganda (planshet yoki sichqoncha bilan) */
  onKey?: (key: string) => void
}

// Ekrandagi klaviatura: haqiqiy klaviaturadagi kabi uch qator harf, Probel,
// Enter va Backspace. Kerakli tugma joylashuv bo'yicha yoritiladi.
export function OnScreenKeyboard({ script, hint, flash, onKey }: Props) {
  return (
    <div className="kbd-board" aria-hidden="true">
      {LAYOUTS[script].map((row, r) => (
        <div key={r} className={`kbd-row kbd-row-${r}`}>
          {row.map((k) => {
            const flashed = flash?.code === k.code
            const cls = [
              'kbd-key',
              k.code === 'Space' ? 'kbd-space' : '',
              k.label.length > 1 ? 'kbd-wide' : '',
              k.code === 'KeyF' || k.code === 'KeyJ' ? 'kbd-home' : '',
              hint === k.code ? 'kbd-hint' : '',
              flashed ? (flash.ok ? 'kbd-ok' : 'kbd-no') : '',
            ].join(' ')
            return (
              <button
                // key: har bosishda animatsiya qaytadan boshlansin
                key={flashed ? `${k.code}-${flash.n}` : k.code}
                type="button"
                tabIndex={-1}
                className={cls}
                style={{ '--w': k.w ?? 1 } as CSSProperties}
                onPointerDown={(e) => {
                  e.preventDefault()
                  onKey?.(k.char)
                }}
              >
                {k.label}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
