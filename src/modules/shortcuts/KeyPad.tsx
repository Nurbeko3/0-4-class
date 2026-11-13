import type { ReactNode } from 'react'
import { useT } from '../../i18n/useT'
import type { Letter } from './logic'

export function Dots({ total, done }: { total: number; done: number }) {
  return (
    <div className="ks-dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < done ? 'ks-dot ks-dot-on' : 'ks-dot'} />
      ))}
    </div>
  )
}

/** «Xotira» (almashinuv buferi): nusxa olingan yoki qirqilgan narsa shu yerda turadi. */
export function Clip({ children }: { children?: ReactNode }) {
  const t = useT()
  return (
    <div className={`ks-clip ${children ? 'ks-clip-full' : ''}`}>
      <span className="ks-clip-label">{t('keys.clip')}</span>
      <span className="ks-clip-box">{children}</span>
    </div>
  )
}

interface Props {
  letters: readonly Letter[]
  /** Ctrl bosib turilibdi (klaviaturada yoki ekranda) */
  ctrl: boolean
  /** Hozirgina bosilgan harf */
  last: Letter | null
  /** Sariq bilan ko'rsatiladigan harf; null — yordam yo'q */
  hint: Letter | null
  onCtrl: () => void
  onLetter: (l: Letter) => void
}

// Ekrandagi tugmalar: Ctrl + shu darajada kerak bo'ladigan harflar. Klaviaturada
// bosilgani shu yerda ko'rinadi; sensorli ekranda ularning o'zini bosish mumkin.
export function KeyPad({ letters, ctrl, last, hint, onCtrl, onLetter }: Props) {
  return (
    <div className="ks-pad">
      <button
        type="button"
        className={`ks-key ks-key-ctrl ${ctrl ? 'ks-key-down' : ''} ${hint && !ctrl ? 'ks-key-hint' : ''}`}
        aria-pressed={ctrl}
        onClick={onCtrl}
      >
        Ctrl
      </button>
      <span className="ks-plus" aria-hidden="true">
        +
      </span>
      {letters.map((l) => (
        <button
          key={l}
          type="button"
          className={`ks-key ${last === l ? 'ks-key-down' : ''} ${hint === l && ctrl ? 'ks-key-hint' : ''} ${hint === l ? 'ks-key-want' : ''}`}
          onClick={() => onLetter(l)}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
