// Animatsion ko'rsatma: o'qiy olmaydigan bolaga qaysi tugma va qanday
// harakat kerakligini sichqoncha rasmi o'zi ko'rsatadi.
export type MouseAction = 'move' | 'click' | 'dbl' | 'right' | 'drag' | 'scroll'

export function MouseDemo({ action }: { action: MouseAction }) {
  return (
    <div className={`mdemo mdemo-${action}`} aria-hidden="true">
      <svg viewBox="0 0 100 120">
        <g className="mdemo-body">
          <rect x="22" y="8" width="56" height="104" rx="28" fill="#fff" />
          <path className="mdemo-l" d="M22 52 V36 A28 28 0 0 1 50 8 V52Z" />
          <path className="mdemo-r" d="M78 52 V36 A28 28 0 0 0 50 8 V52Z" />
          <rect x="22" y="8" width="56" height="104" rx="28" fill="none" stroke="#2D3A4A" strokeWidth="4" />
          <path d="M22 52 H78 M50 8 V52" stroke="#2D3A4A" strokeWidth="4" />
          <rect className="mdemo-w" x="44" y="20" width="12" height="22" rx="6" stroke="#2D3A4A" strokeWidth="3" />
        </g>
      </svg>
    </div>
  )
}
