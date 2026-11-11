import { setState, useStore } from '../core/progress'

export function LangSwitch() {
  const { lang } = useStore()
  return (
    <div className="lang" role="group" aria-label="Til / Язык">
      <button className={lang === 'uz' ? 'on' : ''} onClick={() => setState({ lang: 'uz' })} lang="uz">
        O’zbekcha
      </button>
      <button className={lang === 'ru' ? 'on' : ''} onClick={() => setState({ lang: 'ru' })} lang="ru">
        Русский
      </button>
    </div>
  )
}
