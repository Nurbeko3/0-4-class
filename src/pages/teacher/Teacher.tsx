import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { CURRICULUM, GRADES, gradeLevels, type TopicId } from '../../core/curriculum'
import {
  isDone,
  isGradeLocked,
  levelKey,
  resetProgress,
  setState,
  setTeacherUnlocked,
  teacherUnlocked,
  toggleGradeLock,
  toggleLevelLock,
  useStore,
} from '../../core/progress'
import { strings, type StrKey } from '../../i18n/strings'
import { useT } from '../../i18n/useT'
import { GAMES, TOPICS } from '../../modules/registry'
import { LangSwitch } from '../../ui/LangSwitch'
import { HomeIcon, LockIcon, Star } from '../../ui/art'
import { PinPad } from './PinPad'
import './teacher.css'

/** /teacher — PIN bilan himoyalangan. O'quvchilar uchun login yo'q, bu faqat o'qituvchi paneli. */
export function Teacher() {
  const { pin } = useStore()
  const t = useT()
  const [unlocked, setUnlocked] = useState(teacherUnlocked)
  const [changing, setChanging] = useState(false)
  const [first, setFirst] = useState<string | null>(null)
  const [error, setError] = useState<StrKey | null>(null)

  const unlock = () => {
    setTeacherUnlocked(true)
    setUnlocked(true)
    setError(null)
  }

  const onPin = useCallback(
    (entered: string) => {
      if (pin && !changing) {
        // Kirish
        if (entered === pin) unlock()
        else setError('teacher.pin.wrong')
      } else if (first === null) {
        // Yangi PIN: birinchi kiritish
        setFirst(entered)
        setError(null)
      } else if (entered === first) {
        setState({ pin: entered })
        setFirst(null)
        setChanging(false)
        unlock()
      } else {
        setFirst(null)
        setError('teacher.pin.mismatch')
      }
    },
    [pin, changing, first],
  )

  if (!pin || changing || !unlocked) {
    const title = pin && !changing ? 'teacher.pin.enter' : first === null ? 'teacher.pin.set' : 'teacher.pin.repeat'
    return (
      <div className="page tc-gate">
        <header className="bar">
          <Link className="iconbtn" to="/" aria-label={t('common.home')}>
            <HomeIcon />
          </Link>
          <LangSwitch />
        </header>
        <PinPad title={t(title)} error={error && t(error)} onSubmit={onPin} />
      </div>
    )
  }

  return (
    <Dashboard
      onExit={() => {
        setTeacherUnlocked(false)
        setUnlocked(false)
      }}
      onChangePin={() => {
        setFirst(null)
        setError(null)
        setChanging(true)
      }}
    />
  )
}

const PLAN = ['goal', 'explain', 'practice', 'tip'] as const

function Dashboard({ onExit, onChangePin }: { onExit: () => void; onChangePin: () => void }) {
  const s = useStore()
  const t = useT()
  const [grade, setGrade] = useState(0)
  const [confirming, setConfirming] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [full, setFull] = useState(() => !!document.fullscreenElement)

  useEffect(() => {
    const sync = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen().catch(() => {})
  }

  const levels = gradeLevels(grade)
  const doneCount = levels.filter((l) => isDone(s, grade, l)).length
  const gradeLocked = isGradeLocked(s, grade)

  return (
    <div className="page tc">
      <header className="bar">
        <Link className="iconbtn" to="/" aria-label={t('common.home')}>
          <HomeIcon />
        </Link>
        <h1 className="tc-title">{t('teacher.title')}</h1>
        <div className="tc-headbtns">
          <button className={`tc-btn ${full ? 'on' : ''}`} onClick={toggleFull} aria-pressed={full}>
            {t('teacher.fullscreen')}
          </button>
          <LangSwitch />
          <button className="tc-btn" onClick={onExit}>
            {t('teacher.exit')}
          </button>
        </div>
      </header>

      <main className="tc-main">
        <div className="tc-tabs" role="tablist">
          {GRADES.map((g) => (
            <button key={g} role="tab" aria-selected={g === grade} className={`tc-tab g${g} ${g === grade ? 'on' : ''}`} onClick={() => setGrade(g)}>
              {t('grade.name', { n: g })}
              {isGradeLocked(s, g) && <LockIcon />}
            </button>
          ))}
        </div>

        <div className="tc-gradebar">
          <span>{t('teacher.done', { n: doneCount, m: levels.length })}</span>
          {gradeLocked && <strong>{t('teacher.grade.locked')}</strong>}
          <button className={`tc-btn ${gradeLocked ? 'warn' : ''}`} data-act="grade-lock" onClick={() => toggleGradeLock(grade)}>
            <LockIcon />
            {t(gradeLocked ? 'teacher.grade.unlock' : 'teacher.grade.lock')}
          </button>
        </div>

        {CURRICULUM[grade]
          .filter((topic) => topic.levels.length > 0)
          .map((topic) => {
            const T = TOPICS[topic.id]
            return (
              <section key={topic.id} className="tc-topic" style={{ '--c': T.color } as CSSProperties}>
                <div className="tc-topichead">
                  <span className="topic-icon">
                    <T.icon />
                  </span>
                  <h2>{t(T.title)}</h2>
                </div>

                <div className="tc-cols">
                  <LessonPlan topic={topic.id} />

                  <ul className="tc-levels">
                    {topic.levels.map((id, i) => {
                      const G = GAMES[id]
                      const locked = s.lockedLevels.includes(levelKey(grade, id))
                      return (
                        <li key={id}>
                          <span className="tc-num">{i + 1}</span>
                          <span className="tc-art">
                            <G.icon />
                          </span>
                          <span className="tc-name">
                            {t(G.title)}
                            {isDone(s, grade, id) && <Star />}
                          </span>
                          <Link className="tc-btn primary" to={`/play/${grade}/${id}`}>
                            {t('teacher.show')}
                          </Link>
                          <button
                            className={`tc-btn tc-lock ${locked ? 'warn' : ''}`}
                            data-lock={id}
                            aria-pressed={locked}
                            disabled={gradeLocked}
                            onClick={() => toggleLevelLock(grade, id)}
                          >
                            <LockIcon />
                            {t(locked || gradeLocked ? 'common.locked' : 'teacher.open')}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            )
          })}

        <section className="tc-danger">
          {confirming ? (
            <>
              <strong>{t('teacher.reset.confirm')}</strong>
              <button
                className="tc-btn warn"
                data-act="reset-yes"
                onClick={() => {
                  resetProgress()
                  setConfirming(false)
                  setResetDone(true)
                }}
              >
                {t('teacher.reset.yes')}
              </button>
              <button className="tc-btn" onClick={() => setConfirming(false)}>
                {t('teacher.reset.no')}
              </button>
            </>
          ) : (
            <>
              <button
                className="tc-btn warn"
                data-act="reset"
                onClick={() => {
                  setResetDone(false)
                  setConfirming(true)
                }}
              >
                {t('teacher.reset')}
              </button>
              {resetDone && <strong role="status">{t('teacher.reset.done')}</strong>}
              <button className="tc-btn" style={{ marginLeft: 'auto' }} onClick={onChangePin}>
                {t('teacher.pin.change')}
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

/** Dars rejasi: strings.ts dagi 'lesson.<mavzu>.<qism>' kalitlari. Matn hali yozilmagan bo'lsa — ko'rsatilmaydi. */
function LessonPlan({ topic }: { topic: TopicId }) {
  const t = useT()
  const rows = PLAN.map((part) => ({ part, key: `lesson.${topic}.${part}` })).filter((r) => r.key in strings.uz)
  if (rows.length === 0) return <div className="tc-plan" />
  return (
    <dl className="tc-plan">
      {rows.map(({ part, key }) => (
        <div key={part}>
          <dt>{t(`teacher.plan.${part}`)}</dt>
          <dd>{t(key as StrKey)}</dd>
        </div>
      ))}
    </dl>
  )
}
