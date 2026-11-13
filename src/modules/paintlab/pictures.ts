// «Paint asboblari» rasmlari — faqat ma'lumot (DOM yo'q). Barcha koordinatalar 200x150 maydonda.

export type ColorId = 'red' | 'orange' | 'yellow' | 'green' | 'sky' | 'blue' | 'violet' | 'pink' | 'brown'

export const COLORS: Record<ColorId, string> = {
  red: '#E5484D',
  orange: '#FF8A3D',
  yellow: '#FFC94A',
  green: '#45B97C',
  sky: '#8FD0F7',
  blue: '#3B6BDB',
  violet: '#9B5DE5',
  pink: '#F58FB7',
  brown: '#8A5A32',
}

export const COLOR_IDS = Object.keys(COLORS) as ColorId[]

export const VIEW_W = 200
export const VIEW_H = 150

// ---------- Chelak: bo'laklarga bo'lingan rasmlar ----------

export interface Region {
  /** SVG path */
  d: string
  color: ColorId
}

export interface FillPicture {
  id: string
  /** Chizilish tartibida: orqa fon birinchi */
  regions: Region[]
  /** Bo'yalmaydigan bezak (ko'z va h.k.) — ustidan chiziladi */
  deco?: string
}

const circle = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`

const BG = 'M0 0H200V150H0Z'

export const FILL_PICTURES: FillPicture[] = [
  {
    id: 'house',
    regions: [
      { d: BG, color: 'sky' },
      { d: circle(166, 30, 17), color: 'orange' },
      { d: 'M0 114H200V150H0Z', color: 'green' },
      { d: 'M50 70H140V126H50Z', color: 'yellow' },
      { d: 'M38 70L95 24L152 70Z', color: 'red' },
      { d: 'M62 90H84V126H62Z', color: 'brown' },
      { d: 'M100 84H126V106H100Z', color: 'blue' },
    ],
  },
  {
    id: 'fish',
    regions: [
      { d: BG, color: 'sky' },
      { d: 'M0 126Q50 112 100 126T200 126V150H0Z', color: 'yellow' },
      { d: 'M14 130C4 104 24 94 14 64C34 90 20 108 30 130Z', color: 'green' },
      { d: 'M64 75L36 50V100Z', color: 'red' },
      { d: circle(108, 75, 50, 30), color: 'orange' },
      { d: 'M92 47L122 22L128 49Z', color: 'red' },
    ],
    deco: `${circle(136, 67, 7)}`,
  },
  {
    id: 'rocket',
    regions: [
      { d: BG, color: 'blue' },
      { d: circle(40, 36, 17), color: 'yellow' },
      { d: 'M82 88L58 124H86Z', color: 'orange' },
      { d: 'M118 88L142 124H114Z', color: 'orange' },
      { d: 'M88 110H112L100 144Z', color: 'yellow' },
      { d: 'M100 14C124 42 124 82 118 112H82C76 82 76 42 100 14Z', color: 'red' },
      { d: circle(100, 62, 12), color: 'sky' },
    ],
  },
]

// ---------- Shakllardan rasm ----------

export type ShapeType = 'line' | 'rect' | 'circle'

export interface Pt {
  x: number
  y: number
}

/** Shakl ikki nuqta bilan beriladi: chiziq — uchlari; to'rtburchak va doira — qarama-qarshi burchaklar. */
export interface Shape {
  type: ShapeType
  a: Pt
  b: Pt
  color: ColorId
}

export interface ShapePicture {
  id: string
  shapes: Shape[]
}

const sh = (type: ShapeType, x1: number, y1: number, x2: number, y2: number, color: ColorId): Shape => ({
  type,
  a: { x: x1, y: y1 },
  b: { x: x2, y: y2 },
  color,
})

export const SHAPE_PICTURES: ShapePicture[] = [
  {
    id: 'house',
    shapes: [
      sh('rect', 55, 72, 145, 132, 'yellow'),
      sh('rect', 88, 96, 112, 132, 'brown'),
      sh('line', 50, 72, 100, 30, 'red'),
      sh('line', 100, 30, 150, 72, 'red'),
      sh('circle', 158, 12, 190, 44, 'orange'),
    ],
  },
  {
    id: 'car',
    shapes: [
      sh('rect', 28, 70, 172, 106, 'red'),
      sh('rect', 68, 38, 132, 70, 'sky'),
      sh('circle', 42, 92, 76, 126, 'blue'),
      sh('circle', 124, 92, 158, 126, 'blue'),
      sh('line', 10, 130, 190, 130, 'brown'),
    ],
  },
  {
    id: 'snowman',
    shapes: [
      sh('circle', 68, 88, 132, 146, 'sky'),
      sh('circle', 78, 48, 122, 90, 'sky'),
      sh('circle', 85, 18, 115, 48, 'sky'),
      sh('rect', 84, 2, 116, 18, 'violet'),
      sh('line', 78, 66, 44, 48, 'brown'),
      sh('line', 122, 66, 156, 48, 'brown'),
    ],
  },
]

// ---------- Ko'zgu: rasmning chap yarmi ----------

export interface MirrorPicture {
  id: string
  /** 1 — bitta/ikki rang, 2 — murakkabroq */
  level: 1 | 2
  /** Chap yarim: '.' bo'sh, '1'..'9' — `colors` dagi rang tartib raqami. O'q — o'ng chetda. */
  half: string[]
  colors: ColorId[]
}

export const MIRROR_PICTURES: MirrorPicture[] = [
  {
    id: 'heart',
    level: 1,
    colors: ['red'],
    half: ['.11..', '11111', '11111', '11111', '.1111', '..111', '...11'],
  },
  {
    id: 'tree',
    level: 1,
    colors: ['green', 'brown'],
    half: ['....1', '...11', '..111', '.1111', '11111', '....2', '....2'],
  },
  {
    id: 'butterfly',
    level: 2,
    colors: ['violet', 'blue'],
    half: ['11..2', '111.2', '11112', '.1112', '11112', '111.2', '11..2'],
  },
  {
    id: 'house',
    level: 2,
    colors: ['red', 'yellow', 'blue'],
    half: ['....1', '...11', '..111', '.1111', '.2222', '.2322', '.2222'],
  },
]
