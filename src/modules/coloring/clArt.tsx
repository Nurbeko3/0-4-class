// Raqam bo'yicha bo'yash rasmlari: piksel-rasm SVG ko'rinishida (lokal, emoji yo'q).
import { COLORS, PICTURES, type Picture } from './pictures'

/** Rasmning tayyor (bo'yalgan) ko'rinishi. O'lcham font-size bilan: balandligi 1em. */
export function PixelPic({ pic, className }: { pic: Picture; className?: string }) {
  const w = pic.rows[0].length
  const h = pic.rows.length
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} width="1em" height="1em" shapeRendering="crispEdges" aria-hidden="true">
      {pic.rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === '.' ? null : (
            <rect key={`${x}.${y}`} x={x} y={y} width={1.02} height={1.02} fill={COLORS[pic.colors[Number(ch) - 1]].hex} />
          ),
        ),
      )}
    </svg>
  )
}

/** Xaritadagi daraja ikonkasi */
export const NumbersIcon = ({ className }: { className?: string }) => <PixelPic pic={PICTURES[0]} className={className} />

export const CheckMark = () => (
  <svg viewBox="0 0 100 100" width="1em" height="1em" aria-hidden="true">
    <path d="M22 54 L42 73 L80 30" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
