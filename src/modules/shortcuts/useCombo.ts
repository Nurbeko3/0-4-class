import { useCallback, useEffect, useRef, useState } from 'react'
import { letterOf, type Letter } from './logic'

/**
 * Ctrl+harf birikmalarini tinglaydi. Brauzerning o'z amali (Ctrl+S — saqlash oynasi,
 * Ctrl+A — hammasini belgilash va h.k.) to'xtatiladi. Harf Ctrl'siz bosilsa — onBare.
 * Ekrandagi tugmalar uchun: tapCtrl Ctrl'ni "ushlab turadi", tapLetter harfni bosadi.
 */
export function useCombo(onCombo: (l: Letter) => void, onBare: (l: Letter) => void) {
  const [held, setHeld] = useState(false)
  const [latch, setLatch] = useState(false)
  const [last, setLast] = useState<Letter | null>(null)
  const cb = useRef({ onCombo, onBare, latch })
  useEffect(() => {
    cb.current = { onCombo, onBare, latch }
  })

  const fire = useCallback((l: Letter, withCtrl: boolean) => {
    setLast(l)
    setLatch(false)
    if (withCtrl) cb.current.onCombo(l)
    else cb.current.onBare(l)
  }, [])

  // Bosilgan harf ekranda bir lahza "botib" turadi
  useEffect(() => {
    if (!last) return
    const t = setTimeout(() => setLast(null), 220)
    return () => clearTimeout(t)
  }, [last])

  useEffect(() => {
    const isCtrl = (e: KeyboardEvent) => e.key === 'Control' || e.key === 'Meta'
    const down = (e: KeyboardEvent) => {
      if (isCtrl(e)) return setHeld(true)
      if (e.altKey) return
      const l = letterOf(e.code, e.key)
      if (!l) return
      const mod = e.ctrlKey || e.metaKey
      if (mod) e.preventDefault()
      if (e.repeat) return
      fire(l, mod || cb.current.latch)
    }
    const up = (e: KeyboardEvent) => {
      if (isCtrl(e)) setHeld(false)
    }
    const blur = () => setHeld(false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [fire])

  const ctrl = held || latch
  return {
    ctrl,
    last,
    tapCtrl: () => setLatch((v) => !v),
    tapLetter: (l: Letter) => fire(l, ctrl),
  }
}
