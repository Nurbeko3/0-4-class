import { useEffect, useState } from 'react'
import { useT } from '../../i18n/useT'
import { BackIcon } from '../../ui/art'

const LEN = 4

/** 4 raqamli PIN: ekrandagi tugmalar yoki klaviatura bilan kiritiladi. */
export function PinPad({ title, error, onSubmit }: { title: string; error?: string | null; onSubmit: (pin: string) => void }) {
  const t = useT()
  const [pin, setPin] = useState('')

  const press = (d: string) => setPin((p) => (p.length < LEN ? p + d : p))
  const erase = () => setPin((p) => p.slice(0, -1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key)
      else if (e.key === 'Backspace') erase()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // To'rtinchi raqamdan keyin o'zi yuboriladi
  useEffect(() => {
    if (pin.length !== LEN) return
    const id = setTimeout(() => {
      onSubmit(pin)
      setPin('')
    }, 150)
    return () => clearTimeout(id)
  }, [pin, onSubmit])

  return (
    <div className="tc-pin">
      <h1>{title}</h1>
      <div className={`tc-dots ${error && !pin ? 'wiggle' : ''}`} aria-label={`${pin.length} / ${LEN}`}>
        {Array.from({ length: LEN }, (_, i) => (
          <i key={i} className={i < pin.length ? 'on' : ''} />
        ))}
      </div>
      <p className="tc-error" role="alert">
        {!pin && error}
      </p>
      <div className="tc-keys">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} onClick={() => press(d)}>
            {d}
          </button>
        ))}
        <span />
        <button onClick={() => press('0')}>0</button>
        <button className="erase" onClick={erase} aria-label={t('teacher.backspace')}>
          <BackIcon />
        </button>
      </div>
    </div>
  )
}
