import { useEffect, useMemo, useRef, useState } from 'react'
import { sfx } from '../../core/audio'
import { useWinWhen } from '../../core/util'
import type { StrKey } from '../../i18n/strings'
import type { GameProps } from '../registry'
import { CommandBar, Program } from './CommandBar'
import { Grid } from './Grid'
import { append, isRepeat, parseGrid, removeLast, run, setCount, size, type Cmd, type Dir, type Point } from './interpreter'
import { maxDepth, stages, type Level, type RobotGameId } from './levels'
import './robot.css'

const STEP_MS = 480
const COUNTS = [2, 3, 4, 5, 6]

type Status = 'idle' | 'run' | 'goal' | 'bump' | 'short'

interface StageProps {
  level: Level
  depth: number
  say: StrKey
  setSay: (key: StrKey) => void
  onDone: () => void
}

// Bitta bosqich: bola buyruqlarni yig'adi, "Yurgiz" robotni qadam-baqadam yuritadi.
// Devorga urilsa yoki marraga yetmasa — jazo yo'q: robot boshiga qaytadi,
// dastur saqlanib qoladi, bola tuzatadi.
function Stage({ level, depth, say, setSay, onDone }: StageProps) {
  const grid = useMemo(() => parseGrid(level.rows), [level])
  const [program, setProgram] = useState<Cmd[]>([])
  const [open, setOpen] = useState<number[]>([])
  const [pos, setPos] = useState<Point>(grid.start)
  const [active, setActive] = useState<number[] | null>(null)
  const [bump, setBump] = useState<Dir | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  const timers = useRef<number[]>([])
  const later = (ms: number, f: () => void) => {
    timers.current.push(window.setTimeout(f, ms))
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const locked = status !== 'idle'
  const used = size(program)
  const canAdd = level.max === undefined || used < level.max

  const edit = (next: { program: Cmd[]; open: number[] }) => {
    setProgram(next.program)
    setOpen(next.open)
  }

  const add = (cmd: Cmd) => {
    if (locked || !canAdd) return
    sfx.pop()
    edit(append(program, open, cmd))
  }

  const cycleCount = (path: number[]) => {
    let c: Cmd | undefined
    let body: readonly Cmd[] = program
    for (const i of path) {
      c = body[i]
      body = c && isRepeat(c) ? c.body : []
    }
    if (!c || !isRepeat(c)) return
    sfx.pop()
    setProgram(setCount(program, path, COUNTS[(COUNTS.indexOf(c.repeat) + 1) % COUNTS.length]))
  }

  const go = () => {
    if (locked || program.length === 0) return
    const r = run(grid, program)
    setStatus('run')
    setSay(say)
    r.steps.forEach((s, i) =>
      later(i * STEP_MS, () => {
        setActive(s.path)
        if (s.bump) setBump(s.dir)
        else {
          setPos(s.to)
          sfx.pop()
        }
      }),
    )
    later(Math.max(1, r.steps.length) * STEP_MS, () => {
      setActive(null)
      setStatus(r.result)
      if (r.result === 'goal') {
        sfx.good()
        later(1000, onDone)
        return
      }
      sfx.oops()
      setSay(r.result === 'bump' ? 'say.robot.bump' : 'say.robot.short')
      // Yumshoq qaytish: robot boshiga boradi, dastur joyida qoladi
      later(900, () => {
        setBump(null)
        setPos(grid.start)
        setStatus('idle')
      })
    })
  }

  return (
    <>
      <div className="rb-stage">
        <Grid grid={grid} pos={pos} bump={bump} won={status === 'goal'} lost={status === 'short'} />
      </div>
      <Program program={program} active={active} open={open} locked={locked} onCount={cycleCount} />
      <CommandBar
        locked={locked}
        canAdd={canAdd}
        canRepeat={open.length < depth}
        canClose={open.length > 0}
        empty={program.length === 0}
        used={used}
        max={level.max}
        showRepeat={depth > 0}
        onDir={add}
        onRepeat={() => add({ repeat: 2, body: [] })}
        onClose={() => setOpen(open.slice(0, -1))}
        onUndo={() => edit(removeLast(program, open))}
        onClear={() => edit({ program: [], open: [] })}
        onRun={go}
      />
    </>
  )
}

function RobotGame({ grade, onWin, setSay, game, say }: GameProps & { game: RobotGameId; say: StrKey }) {
  const [levels] = useState(() => stages(game, grade))
  const [idx, setIdx] = useState(0)
  useWinWhen(idx >= levels.length, onWin, 200)
  const level = levels[Math.min(idx, levels.length - 1)]

  return (
    <div className="field rb-field">
      <div className="rb-dots" aria-hidden="true">
        {levels.map((_, i) => (
          <span key={i} className={i < idx ? 'rb-dot rb-dot-on' : 'rb-dot'} />
        ))}
      </div>
      <Stage key={Math.min(idx, levels.length - 1)} level={level} depth={maxDepth(game)} say={say} setSay={setSay} onDone={() => setIdx((i) => i + 1)} />
    </div>
  )
}

export const ArrowsGame = (p: GameProps) => <RobotGame {...p} game="arrows" say="say.robot.arrows" />
export const RepeatGame = (p: GameProps) => <RobotGame {...p} game="repeat" say="say.robot.repeat" />
export const NestedGame = (p: GameProps) => <RobotGame {...p} game="nested" say="say.robot.nested" />
