import { COLORS, VIEW_H, VIEW_W, type ColorId, type FillPicture } from './pictures'
import './paintlab.css'

/** Nechta rasm bajarilgani: nuqtalar qatori. */
export function Dots({ total, done }: { total: number; done: number }) {
  return (
    <div className="pl-dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < done ? 'pl-dot pl-dot-on' : 'pl-dot'} />
      ))}
    </div>
  )
}

interface PicProps {
  pic: FillPicture
  className?: string
  /** Har bo'lakning hozirgi rangi; berilmasa — tayyor (namuna) ko'rinish */
  fills?: (ColorId | null)[]
  /** Noto'g'ri bo'yalgan bo'laklar (qimirlab turadi) */
  wrong?: boolean[]
  onPick?: (index: number) => void
}

/** Bo'laklarga bo'lingan rasm: namuna, bo'yash maydoni yoki o'chirg'ich ostidagi rasm. */
export function Pic({ pic, className, fills, wrong, onPick }: PicProps) {
  return (
    <svg className={className} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden={onPick ? undefined : true}>
      {pic.regions.map((r, i) => {
        const c = fills ? fills[i] : r.color
        return (
          <path
            key={i}
            d={r.d}
            className={`pl-region ${onPick ? 'pl-region-live' : ''} ${wrong?.[i] ? 'pl-region-wrong' : ''}`}
            fill={c ? COLORS[c] : '#fff'}
            onPointerDown={onPick ? () => onPick(i) : undefined}
          />
        )
      })}
      {pic.deco && (
        <>
          <path d={pic.deco} fill="#fff" stroke="#2D3A4A" strokeWidth="2" pointerEvents="none" />
          <circle cx="138" cy="67" r="3" fill="#2D3A4A" pointerEvents="none" />
        </>
      )}
    </svg>
  )
}

/** Ranglar palitrasi */
export function Palette({ colors, value, onChange }: { colors: ColorId[]; value: ColorId | null; onChange: (c: ColorId) => void }) {
  return (
    <div className="pl-palette">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          className={`pl-color ${value === c ? 'on' : ''}`}
          style={{ background: COLORS[c] }}
          aria-label={c}
          aria-pressed={value === c}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}
