import type { ReactNode } from 'react'
import { useT } from '../../i18n/useT'
import { ALIGNS, COLORS, COLOR_HEX, cmdId, type Cmd, type Style } from './model'
import { AlignGlyph } from './wdArt'

export type Group = 'bius' | 'size' | 'color' | 'align'

export function Dots({ total, done }: { total: number; done: number }) {
  return (
    <div className="wd-dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < done ? 'wd-dot wd-dot-on' : 'wd-dot'} />
      ))}
    </div>
  )
}

interface Props {
  groups: Group[]
  /** Belgilangan bo'lakning bezagi (tugmalar holati shunga qarab yonadi); belgilanmagan bo'lsa null */
  cur: Style | null
  /** Lipillab turadigan tugma (cmdId) */
  hint: string | null
  onCmd: (c: Cmd) => void
}

// Muharrirning asboblar paneli. Tugmalar haqiqiy Word'dagi tartibda.
export function Toolbar({ groups, cur, hint, onCmd }: Props) {
  const t = useT()

  const btn = (c: Cmd, on: boolean, label: string, body: ReactNode, extra = '') => {
    const id = cmdId(c)
    return (
      <button
        key={id}
        type="button"
        className={`wd-btn ${extra} ${on ? 'wd-btn-on' : ''} ${hint === id ? 'wd-btn-hint' : ''}`}
        aria-label={label}
        aria-pressed={on}
        title={label}
        onClick={() => onCmd(c)}
      >
        {body}
      </button>
    )
  }

  return (
    <div className="wd-bar" role="toolbar">
      {groups.includes('bius') && (
        <div className="wd-group">
          {btn({ t: 'b' }, !!cur?.b, t('word.btn.b.name'), <b>{t('word.btn.b')}</b>)}
          {btn({ t: 'i' }, !!cur?.i, t('word.btn.i.name'), <i>{t('word.btn.i')}</i>)}
          {btn({ t: 'u' }, !!cur?.u, t('word.btn.u.name'), <u>{t('word.btn.u')}</u>)}
        </div>
      )}
      {groups.includes('size') && (
        <div className="wd-group">
          {btn({ t: 'bigger' }, false, t('word.btn.bigger'), <span className="wd-size wd-size-up">A</span>)}
          {btn({ t: 'smaller' }, false, t('word.btn.smaller'), <span className="wd-size wd-size-down">A</span>)}
        </div>
      )}
      {groups.includes('color') && (
        <div className="wd-group">
          {COLORS.map((c) =>
            btn(
              { t: 'color', c },
              cur?.color === c,
              t(`word.color.${c}`),
              <span className="wd-swatch" style={{ background: COLOR_HEX[c] }} />,
              'wd-btn-color',
            ),
          )}
        </div>
      )}
      {groups.includes('align') && (
        <div className="wd-group">
          {ALIGNS.map((a) => btn({ t: 'align', a }, cur?.align === a, t(`word.btn.${a}`), <AlignGlyph align={a} />))}
        </div>
      )}
    </div>
  )
}
