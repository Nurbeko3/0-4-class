import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sfx, speak, stopSpeech } from '../core/audio'
import { gradeLevels, nextLevel, type GameId } from '../core/curriculum'
import { isLevelLocked, markDone, teacherUnlocked, useStore } from '../core/progress'
import type { StrKey } from '../i18n/strings'
import { useT } from '../i18n/useT'
import { GAMES } from '../modules/registry'
import { NotFound } from './NotFound'
import { BackIcon, GridIcon, NextIcon, ReplayIcon, SpeakerIcon, Star } from '../ui/art'

export function LevelPage() {
  const { g, game } = useParams()
  const grade = Number(g)
  const s = useStore()
  const id = game as GameId
  if (!gradeLevels(grade).includes(id) || (isLevelLocked(s, grade, id) && !teacherUnlocked())) return <NotFound />
  // key: boshqa darajaga o'tganda holat to'liq yangilansin
  return <Play key={`${grade}/${id}`} grade={grade} id={id} />
}

function Play({ grade, id }: { grade: number; id: GameId }) {
  const def = GAMES[id]
  const { lang } = useStore()
  const t = useT()
  const [run, setRun] = useState(0)
  const [won, setWon] = useState(false)
  const [say, setSay] = useState<StrKey>(def.say)
  const next = nextLevel(grade, id)

  // Yo'riqnoma daraja boshlanganda va almashganda o'zi o'qiladi
  useEffect(() => {
    speak(say, lang)
    return stopSpeech
  }, [say, lang, run])

  const onWin = useCallback(() => {
    markDone(grade, id)
    sfx.win()
    setWon(true)
  }, [grade, id])

  const restart = () => {
    setWon(false)
    setSay(def.say)
    setRun((r) => r + 1)
  }

  const Game = def.component

  return (
    <div className="page play">
      <header className="bar">
        <Link className="iconbtn" to={`/grade/${grade}`} aria-label={t('common.back')}>
          <BackIcon />
        </Link>
        <h1 className="play-title">{t(def.title)}</h1>
        <button className="iconbtn" onClick={restart} aria-label={t('common.again')}>
          <ReplayIcon />
        </button>
      </header>

      <div className="instr">
        <def.Demo />
        <p key={say}>{t(say)}</p>
        <button className="iconbtn big" onClick={() => speak(say, lang)} aria-label={t('common.listen')}>
          <SpeakerIcon />
        </button>
      </div>

      <Game key={run} grade={grade} onWin={onWin} setSay={setSay} />

      {won && (
        <div className="win" role="dialog" aria-label={t('common.great')}>
          <div className="win-card">
            <div className="win-stars">
              <Star />
              <Star />
              <Star />
            </div>
            <h2>{t('common.great')}</h2>
            <div className="win-actions">
              <button className="btn ghost" onClick={restart}>
                <ReplayIcon />
                {t('common.again')}
              </button>
              <Link className="btn ghost" to={`/grade/${grade}`}>
                <GridIcon />
                {t('common.topics')}
              </Link>
              {next && (
                <Link className="btn" to={`/play/${grade}/${next}`}>
                  {t('common.next')}
                  <NextIcon />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
