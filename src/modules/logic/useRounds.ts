import { useEffect, useState } from 'react'
import { useWinWhen } from '../../core/util'
import { useT } from '../../i18n/useT'
import type { Item } from './logic'

/**
 * Ketma-ket savollar: to'g'ri javobdan keyin bola natijani ko'rib ulgursin deb
 * biroz kutamiz, so'ng keyingi savolga o'tamiz; oxirgisidan keyin — g'alaba.
 */
export function useRounds(count: number, onWin: () => void) {
  const [idx, setIdx] = useState(0)
  const [solved, setSolved] = useState(false)
  const last = idx === count - 1
  useWinWhen(solved && last, onWin, 900)

  useEffect(() => {
    if (!solved || last) return
    const t = setTimeout(() => {
      setSolved(false)
      setIdx((i) => i + 1)
    }, 1000)
    return () => clearTimeout(t)
  }, [solved, last])

  return { idx, solved, solve: () => setSolved(true) }
}

/** Shaklning ekran o'quvchisi uchun nomi: «Yulduz, qizil» */
export function useItemName() {
  const t = useT()
  return (it: Item) => `${t(`logic.shape.${it.shape}`)}, ${t(`logic.hue.${it.hue}`)}${it.small ? `, ${t('logic.small')}` : ''}`
}
