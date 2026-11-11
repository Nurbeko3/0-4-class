import { useRef, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import { Chest, Cloud, Fish, Sun } from '../../ui/art'
import type { GameProps } from '../registry'

// G'ildirak: avval pastga — dengiz tubidagi xazinagacha, keyin yuqoriga — quyoshgacha.
// Skrolbar yashirilgan, shuning uchun faqat g'ildirak (yoki barmoq) ishlaydi.
export function ScrollGame({ onWin, setSay }: GameProps) {
  const [phase, setPhase] = useState<'down' | 'up' | 'done'>('down')
  const ref = useRef<HTMLDivElement>(null)
  useWinWhen(phase === 'done', onWin)

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    if (phase === 'down' && el.scrollTop >= max - 12) {
      sfx.good()
      setPhase('up')
      setSay('say.mouse.scroll.up')
    } else if (phase === 'up' && el.scrollTop <= 12) {
      sfx.good()
      setPhase('done')
    }
  }

  return (
    <div className="field scrollfield">
      <div className="scroller" ref={ref} onScroll={onScroll} tabIndex={0}>
        <div className="sea">
          <div className={`sea-item ${phase !== 'down' ? 'glow' : ''}`} style={{ top: '1%', left: '50%', fontSize: 170 }}>
            <Sun />
          </div>
          <div className="sea-item" style={{ top: '6%', left: '18%', fontSize: 130 }}>
            <Cloud />
          </div>
          <div className="sea-item" style={{ top: '9%', left: '80%', fontSize: 110 }}>
            <Cloud />
          </div>
          {[32, 47, 61, 74].map((top, i) => (
            <div key={top} className="sea-item swim" style={{ top: `${top}%`, left: `${[25, 70, 35, 62][i]}%`, fontSize: 100, animationDelay: `${-i}s` }}>
              <Fish />
            </div>
          ))}
          <div className={`sea-item ${phase !== 'down' ? 'pop-in' : ''}`} style={{ bottom: '1%', left: '50%', fontSize: 190 }}>
            <Chest open={phase !== 'down'} />
          </div>
        </div>
      </div>
      {phase !== 'done' && <div className={`scroll-arrow ${phase}`} />}
    </div>
  )
}
