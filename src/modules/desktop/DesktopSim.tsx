import { useRef, useState, type ComponentType } from 'react'
import { sfx } from '../../core/audio'
import { inside, useDrag } from '../../core/useDrag'
import { useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import { useT } from '../../i18n/useT'
import type { GameProps } from '../registry'
import { FileArt, FolderArt, JunkArt, PicArt, TrashArt } from './deskArt'
import './desktop.css'

/**
 * open — papkani ochish, oynani kichraytirish, qaytarish, yopish
 * file — o'ng tugma bilan fayl yaratish, nomlash, savatga tashlash
 * sort — rasmlarni papkaga, keraksizlarni savatga sudrash
 */
type Level = 'open' | 'file' | 'sort'
type Win = 'closed' | 'open' | 'min'

interface Item {
  id: string
  kind: 'pic' | 'junk'
  x: number
  y: number
}

const SORT_ITEMS: Item[] = [
  { id: 'p1', kind: 'pic', x: 34, y: 12 },
  { id: 'j1', kind: 'junk', x: 58, y: 8 },
  { id: 'p2', kind: 'pic', x: 62, y: 46 },
  { id: 'j2', kind: 'junk', x: 36, y: 50 },
]

function DesktopSim({ onWin, setSay, level }: GameProps & { level: Level }) {
  const t = useT()
  const [step, setStep] = useState(0)
  const [win, setWin] = useState<Win>('closed')
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [file, setFile] = useState<{ x: number; y: number; name: string; editing: boolean } | null>(null)
  const [gone, setGone] = useState<string[]>([]) // savatga yoki papkaga tushganlar
  const [won, setWon] = useState(false)
  const desk = useRef<HTMLDivElement>(null)
  const folder = useRef<HTMLDivElement>(null)
  const trash = useRef<HTMLDivElement>(null)
  useWinWhen(won || (level === 'sort' && gone.length === SORT_ITEMS.length), onWin)

  // Qadam faqat kutilgan tartibda oldinga siljiydi; boshqa harakatlar zarar qilmaydi
  const advance = (from: number, say: StrKey) => {
    if (step !== from) return
    sfx.good()
    setStep(from + 1)
    setSay(say)
  }

  const { dragging, bind } = useDrag((id, x, y) => {
    const toTrash = id === 'new' || id.startsWith('j')
    if (!inside((toTrash ? trash : folder).current, x, y)) return false
    sfx.good()
    setGone((g) => (g.includes(id) ? g : [...g, id]))
    if (id === 'new') setWon(true)
    return true
  })

  // Hozir qaysi narsa "meni bos" deb pulslanadi
  const hint =
    level === 'open'
      ? win === 'closed'
        ? 'folder'
        : win === 'min'
          ? 'task'
          : step === 1
            ? 'min'
            : step === 3
              ? 'close'
              : null
      : level === 'file' && step === 2
        ? 'trash'
        : null

  const openFolder = () => {
    setWin('open')
    if (level === 'open') advance(0, 'say.desk.open.min')
  }

  const commitName = () => {
    if (!file || !file.name.trim()) return
    setFile({ ...file, name: file.name.trim(), editing: false })
    advance(1, 'say.desk.file.trash')
  }

  const pics = level === 'sort' ? gone.filter((id) => id.startsWith('p')) : ['a', 'b']
  const trashFull = gone.some((id) => id === 'new' || id.startsWith('j'))

  return (
    <div
      className="field dk-desk"
      ref={desk}
      onContextMenu={(e) => {
        e.preventDefault()
        if (level !== 'file' || step !== 0 || !desk.current) return
        const r = desk.current.getBoundingClientRect()
        setMenu({
          x: Math.min(78, Math.max(4, ((e.clientX - r.left) / r.width) * 100)),
          y: Math.min(62, Math.max(4, ((e.clientY - r.top) / r.height) * 100)),
        })
      }}
      onPointerDown={(e) => {
        if (menu && !(e.target as Element).closest('.dk-menu')) setMenu(null)
      }}
    >
      {/* Ish stoli belgilari */}
      <div
        ref={folder}
        className={`dk-icon ${hint === 'folder' ? 'dk-pulse' : ''}`}
        style={{ left: '4%', top: '6%' }}
        onDoubleClick={openFolder}
      >
        <FolderArt />
        <span>{t('desk.folder')}</span>
      </div>

      <div ref={trash} className={`dk-icon ${hint === 'trash' ? 'dk-pulse' : ''}`} style={{ left: '86%', top: '58%' }}>
        <TrashArt full={trashFull} />
        <span>{t('desk.trash')}</span>
      </div>

      {level === 'sort' &&
        SORT_ITEMS.filter((it) => !gone.includes(it.id)).map((it) => (
          <DragIcon key={it.id} id={it.id} x={it.x} y={it.y} Art={it.kind === 'pic' ? PicArt : JunkArt} label={t(it.kind === 'pic' ? 'desk.pic' : 'desk.junk')} dragging={dragging === it.id} bind={bind} />
        ))}

      {file && !gone.includes('new') && file.editing && (
        <div className="dk-icon" style={{ left: `${file.x}%`, top: `${file.y}%` }}>
          <FileArt />
          <input
            className="dk-rename"
            autoFocus
            maxLength={12}
            value={file.name}
            placeholder={t('desk.placeholder')}
            onChange={(e) => setFile({ ...file, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName()
            }}
            onBlur={(e) => {
              // Nom yozilmaguncha kursor shu yerda qoladi
              if (file.name.trim()) commitName()
              else e.currentTarget.focus()
            }}
          />
        </div>
      )}
      {file && !gone.includes('new') && !file.editing && (
        <DragIcon id="new" x={file.x} y={file.y} Art={FileArt} label={file.name} dragging={dragging === 'new'} bind={bind} />
      )}

      {/* O'ng tugma menyusi */}
      {menu && (
        <div className="dk-menu" style={{ left: `${menu.x}%`, top: `${menu.y}%` }}>
          <button
            className="dk-pulse"
            onClick={() => {
              setFile({ x: menu.x, y: menu.y, name: '', editing: true })
              setMenu(null)
              advance(0, 'say.desk.file.name')
            }}
          >
            <FileArt />
            {t('desk.file.title')}
          </button>
        </div>
      )}

      {/* Oyna */}
      {win === 'open' && (
        <div className="dk-window pop-in">
          <div className="dk-titlebar">
            <FolderArt />
            <span>{t('desk.folder')}</span>
            <button
              className={`dk-wbtn min ${hint === 'min' ? 'dk-pulse' : ''}`}
              aria-label={t('desk.minimize')}
              onClick={() => {
                setWin('min')
                advance(1, 'say.desk.open.restore')
              }}
            />
            <button
              className={`dk-wbtn close ${hint === 'close' ? 'dk-pulse' : ''}`}
              aria-label={t('desk.close')}
              onClick={() => {
                setWin('closed')
                if (level === 'open' && step === 3) {
                  sfx.good()
                  setWon(true)
                }
              }}
            />
          </div>
          <div className="dk-content">
            {pics.map((id) => (
              <div key={id} className="dk-inwin">
                <PicArt />
                <span>{t('desk.pic')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vazifalar paneli */}
      <div className="dk-taskbar">
        <div className="dk-start" />
        {win !== 'closed' && (
          <button
            className={`dk-task ${win === 'open' ? 'active' : ''} ${hint === 'task' ? 'dk-pulse' : ''}`}
            onClick={() => {
              if (win === 'min') {
                setWin('open')
                advance(2, 'say.desk.open.close')
              } else setWin('min')
            }}
          >
            <FolderArt />
            {t('desk.folder')}
          </button>
        )}
      </div>
    </div>
  )
}

function DragIcon(props: {
  id: string
  x: number
  y: number
  Art: ComponentType
  label: string
  dragging: boolean
  bind: ReturnType<typeof useDrag>['bind']
}) {
  const { style, ...handlers } = props.bind(props.id)
  return (
    <div
      className={`dk-icon dk-drag ${props.dragging ? 'dragging' : ''}`}
      data-id={props.id}
      style={{ left: `${props.x}%`, top: `${props.y}%`, ...style }}
      {...handlers}
    >
      <props.Art />
      <span>{props.label}</span>
    </div>
  )
}

export const DeskOpen = (p: GameProps) => <DesktopSim {...p} level="open" />
export const DeskFile = (p: GameProps) => <DesktopSim {...p} level="file" />
export const DeskSort = (p: GameProps) => <DesktopSim {...p} level="sort" />
