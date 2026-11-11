import { Link } from 'react-router-dom'
import { speak } from '../core/audio'
import { GRADES, gradeLevels } from '../core/curriculum'
import { isDone, isGradeLocked, useStore } from '../core/progress'
import { useT } from '../i18n/useT'
import { LangSwitch } from '../ui/LangSwitch'
import { LockIcon, MonitorIcon, SpeakerIcon, Star } from '../ui/art'

export function Home() {
  const s = useStore()
  const t = useT()

  return (
    <div className="page">
      <header className="bar">
        <div className="brand">
          <MonitorIcon />
          <span>{t('app.title')}</span>
        </div>
        <LangSwitch />
      </header>

      <main className="home">
        <h1>
          {t('home.choose')}
          <button className="iconbtn" onClick={() => speak('say.home', s.lang)} aria-label={t('common.listen')}>
            <SpeakerIcon />
          </button>
        </h1>
        <div className="grades">
          {GRADES.map((g) => {
            const levels = gradeLevels(g)
            const done = levels.filter((l) => isDone(s, g, l)).length
            const inner = (
              <>
                <span className="grade-num">{g}</span>
                <span className="grade-label">{t('grade.name', { n: g })}</span>
                <span className="grade-stars">
                  <Star /> {done} / {levels.length}
                </span>
              </>
            )
            return isGradeLocked(s, g) ? (
              <div key={g} className={`grade g${g} locked`} aria-label={`${t('grade.name', { n: g })} — ${t('common.locked')}`}>
                {inner}
                <span className="lock">
                  <LockIcon />
                </span>
              </div>
            ) : (
              <Link key={g} className={`grade g${g}`} to={`/grade/${g}`}>
                {inner}
              </Link>
            )
          })}
        </div>
      </main>

      <footer className="tc-foot">
        <Link to="/teacher">
          <LockIcon /> {t('teacher.link')}
        </Link>
      </footer>
    </div>
  )
}
