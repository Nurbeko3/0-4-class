import { useRef, useState } from 'react'
import { sfx } from '../../core/audio'
import type { StrKey } from '../../i18n/strings'
import { findKey, isWrongScript, matches, type Script } from './layouts'
import { useKeys } from './useKeys'

interface Options {
  script: Script
  /** Hozir kutilayotgan belgi (null — hech narsa kutilmayapti) */
  expected: string | null
  /** To'g'ri tugma bosilganda */
  onHit: () => void
  /** Shu darajaning asosiy yo'riqnomasi — raskladka to'g'rilangach qaytariladi */
  say: StrKey
  setSay: (key: StrKey) => void
  /** Boshqa alifbo harfi bosilganda raskladka ko'rsatmasi chiqsinmi (harf terilmaydigan darajada — yo'q) */
  checkScript?: boolean
}

/**
 * Uchala klaviatura o'yinining umumiy qismi: tugmani tekshirish, ovoz,
 * ekrandagi klaviaturada chaqnash va "boshqa raskladka" ko'rsatmasi.
 * Xato uchun jazo yo'q — faqat yumshoq ovoz va tugmaning silkinishi.
 */
export function useTyping({ script, expected, onHit, say, setSay, checkScript = true }: Options) {
  const [flash, setFlash] = useState<{ code: string; ok: boolean; n: number } | null>(null)
  const [misses, setMisses] = useState(0)
  const [wrongScript, setWrongScript] = useState(false)
  const n = useRef(0)

  const press = (key: string) => {
    if (expected === null) return
    n.current += 1
    if (matches(expected, key)) {
      setFlash({ code: findKey(script, expected)?.code ?? '', ok: true, n: n.current })
      setMisses(0)
      if (wrongScript) {
        setWrongScript(false)
        setSay(say)
      }
      onHit()
      return
    }
    sfx.oops()
    setMisses((m) => m + 1)
    // Bosilgan tugma shu joylashuvda bo'lsa — o'sha silkinadi
    setFlash({ code: findKey(script, key)?.code ?? '', ok: false, n: n.current })
    if (checkScript && isWrongScript(script, key) && !wrongScript) {
      setWrongScript(true)
      setSay(script === 'lat' ? 'say.kbd.layout.lat' : 'say.kbd.layout.cyr')
    }
  }

  useKeys(press, expected !== null)

  return { flash, misses, wrongScript, press }
}
