import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CURRICULUM } from '../core/curriculum'
import { isDone, isGradeLocked, isLevelLocked, teacherUnlocked, useStore } from '../core/progress'
import { useT } from '../i18n/useT'
import { GAMES, TOPICS } from '../modules/registry'
import { NotFound } from './NotFound'
import { LangSwitch } from '../ui/LangSwitch'
import { HomeIcon, LockIcon, Star } from '../ui/art'

// Darajalar xaritasi: har mavzu — bir yo'lak, darajalar yo'lak bo'ylab tiziladi.
export function GradeMap() {
  const grade = Number(useParams().g)
  const s = useStore()
  const t = useT()
  const topics = CURRICULUM[grade]
  if (!topics || (isGradeLocked(s, grade) && !teacherUnlocked())) return <NotFound />

  return (
    <div className="page">
      <header className="bar">
        <Link className="iconbtn" to="/" aria-label={t('common.home')}>
          <HomeIcon />
        </Link>
        <div className={`grade-chip g${grade}`}>{t('grade.name', { n: grade })}</div>
        <LangSwitch />
      </header>

      <main className="map">
        {topics.map((topic) => {
          const T = TOPICS[topic.id]
          return (
            <section key={topic.id} className={`topic ${topic.levels.length ? '' : 'soon'}`} style={{ '--c': T.color } as CSSProperties}>
              <div className="topic-head">
                <span className="topic-icon">
                  <T.icon />
                </span>
                <h2>{t(T.title)}</h2>
              </div>
              {topic.levels.length === 0 ? (
                <p className="soon-note">{t('common.soon')}</p>
              ) : (
                <ol className="path">
                  {topic.levels.map((id, i) => {
                    const G = GAMES[id]
                    const done = isDone(s, grade, id)
                    const body = (
                      <>
                        <span className="tile-num">{i + 1}</span>
                        <span className="tile-art">
                          <G.icon />
                        </span>
                        <span className="tile-title">{t(G.title)}</span>
                        {done && (
                          <span className="tile-star">
                            <Star />
                          </span>
                        )}
                      </>
                    )
                    return (
                      <li key={id}>
                        {isLevelLocked(s, grade, id) ? (
                          <div className="tile locked" aria-label={`${t(G.title)} — ${t('common.locked')}`}>
                            {body}
                            <span className="lock">
                              <LockIcon />
                            </span>
                          </div>
                        ) : (
                          <Link className={`tile ${done ? 'done' : ''}`} to={`/play/${grade}/${id}`}>
                            {body}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ol>
              )}
            </section>
          )
        })}
      </main>
    </div>
  )
}
