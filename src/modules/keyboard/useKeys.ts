import { useEffect, useRef } from 'react'
import { BACKSPACE, ENTER, SPACE } from './layouts'

/**
 * Fizik klaviaturani tinglaydi va bosilgan belgini (event.key) beradi.
 * Probel/Enter/Backspace brauzerning o'z amalini bajarmaydi (sahifa sakramaydi,
 * fokusdagi tugma bosilib ketmaydi). Ctrl/Alt/Win bilan bosilganlar o'tkazib
 * yuboriladi — bola raskladkani Alt+Shift bilan almashtira olsin.
 */
export function useKeys(onKey: (key: string) => void, active = true) {
  const ref = useRef(onKey)
  useEffect(() => {
    ref.current = onKey
  })

  useEffect(() => {
    if (!active) return
    const special = (k: string) => k === SPACE || k === ENTER || k === BACKSPACE
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key.length !== 1 && !special(e.key)) return
      if (special(e.key)) e.preventDefault()
      if (e.repeat) return
      ref.current(e.key)
    }
    // Probel fokusdagi tugmani keyup'da bosadi — uni ham to'xtatamiz
    const up = (e: KeyboardEvent) => {
      if (e.key === SPACE) e.preventDefault()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [active])
}
