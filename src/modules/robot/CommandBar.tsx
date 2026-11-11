import { useT } from '../../i18n/useT'
import { isRepeat, type Cmd, type Dir } from './interpreter'
import { Arrow, CloseBlockIcon, LoopIcon, PlayIcon, TrashIcon, UndoIcon } from './rbArt'

const same = (a: readonly number[] | null, b: readonly number[]) => a !== null && a.length === b.length && a.every((v, i) => v === b[i])
const within = (a: readonly number[] | null, b: readonly number[]) => a !== null && a.length >= b.length && b.every((v, i) => v === a[i])

interface ProgramProps {
  program: readonly Cmd[]
  /** Hozir bajarilayotgan buyruq yo'li */
  active: readonly number[] | null
  /** Ochiq (to'ldirilayotgan) blok yo'li */
  open: readonly number[]
  locked: boolean
  onCount: (path: number[]) => void
}

// Yig'ilgan dastur: strelkalar qatori; takrorlash bloki — ramka ichida, soni bilan.
export function Program({ program, active, open, locked, onCount }: ProgramProps) {
  const t = useT()
  const list = (cmds: readonly Cmd[], path: number[]) =>
    cmds.map((c, i) => {
      const at = [...path, i]
      if (!isRepeat(c))
        return (
          <span key={i} className={`rb-chip ${same(active, at) ? 'rb-chip-on' : ''}`}>
            <Arrow dir={c} />
          </span>
        )
      return (
        <span key={i} className={`rb-block ${same(open, at) ? 'rb-block-open' : ''} ${within(active, at) ? 'rb-block-on' : ''}`}>
          <button type="button" className="rb-count" disabled={locked} onClick={() => onCount(at)} aria-label={`${t('robot.repeat')}: ${c.repeat}`}>
            <LoopIcon />
            {c.repeat}
          </button>
          {list(c.body, at)}
          {c.body.length === 0 && <span className="rb-chip rb-chip-empty" />}
        </span>
      )
    })

  return (
    <div className="rb-program">
      {program.length === 0 ? <span className="rb-chip rb-chip-empty" /> : list(program, [])}
    </div>
  )
}

interface BarProps {
  locked: boolean
  /** Yana buyruq qo'shish mumkinmi (chegara to'lmagan) */
  canAdd: boolean
  canRepeat: boolean
  canClose: boolean
  empty: boolean
  /** Ishlatilgan / ruxsat etilgan bloklar (chegara bo'lsa) */
  used: number
  max?: number
  onDir: (d: Dir) => void
  onRepeat: () => void
  onClose: () => void
  onUndo: () => void
  onClear: () => void
  onRun: () => void
  showRepeat: boolean
}

const DIRS: Dir[] = ['left', 'up', 'down', 'right']

// Buyruq tugmalari: strelkalar, takrorlash, o'chirish, tozalash va "Yurgiz".
export function CommandBar(p: BarProps) {
  const t = useT()
  return (
    <div className="rb-bar">
      <div className="rb-group">
        {DIRS.map((d) => (
          <button key={d} type="button" className="rb-btn rb-btn-dir" disabled={p.locked || !p.canAdd} onClick={() => p.onDir(d)} aria-label={t(`robot.${d}`)}>
            <Arrow dir={d} />
          </button>
        ))}
      </div>
      {p.showRepeat && (
        <div className="rb-group">
          <button type="button" className="rb-btn rb-btn-loop" disabled={p.locked || !p.canAdd || !p.canRepeat} onClick={p.onRepeat} aria-label={t('robot.repeat')}>
            <LoopIcon />
          </button>
          <button type="button" className="rb-btn rb-btn-loop" disabled={p.locked || !p.canClose} onClick={p.onClose} aria-label={t('robot.close')}>
            <CloseBlockIcon />
          </button>
        </div>
      )}
      {p.max !== undefined && (
        <span className={`rb-limit ${p.used >= p.max ? 'rb-limit-full' : ''}`}>
          {p.used}/{p.max}
        </span>
      )}
      <div className="rb-group rb-group-end">
        <button type="button" className="rb-btn rb-btn-soft" disabled={p.locked || p.empty} onClick={p.onUndo} aria-label={t('robot.undo')}>
          <UndoIcon />
        </button>
        <button type="button" className="rb-btn rb-btn-soft" disabled={p.locked || p.empty} onClick={p.onClear} aria-label={t('robot.clear')}>
          <TrashIcon />
        </button>
        <button type="button" className="rb-btn rb-btn-run" disabled={p.locked || p.empty} onClick={p.onRun} aria-label={t('robot.run')}>
          <PlayIcon />
        </button>
      </div>
    </div>
  )
}
