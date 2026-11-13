import { useEffect, useRef } from 'react'
import { BACKSPACE, ENTER, isDigit } from './sheet'

/**
 * Fizik klaviaturadan raqamlar, Enter va Backspace ni tinglaydi.
 * Enter/Backspace brauzerning o'z amalini bajarmaydi (fokusdagi tugma bosilib
 * ketmaydi, sahifa orqaga qaytmaydi).
 */
export function useNumKeys(onKey: (key: string) => void, active = true) {
  const ref = useRef(onKey)
  useEffect(() => {
    ref.current = onKey
  })

  useEffect(() => {
    if (!active) return
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      const special = e.key === ENTER || e.key === BACKSPACE
      if (!special && !isDigit(e.key)) return
      if (special) e.preventDefault()
      if (e.repeat) return
      ref.current(e.key)
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [active])
}
