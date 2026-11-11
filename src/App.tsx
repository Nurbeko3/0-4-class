import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useStore } from './core/progress'
import { useT } from './i18n/useT'
import { Home } from './pages/Home'
import { GradeMap } from './pages/GradeMap'
import { LevelPage } from './pages/LevelPage'
import { NotFound } from './pages/NotFound'
import { Teacher } from './pages/teacher/Teacher'

export function App() {
  const { lang } = useStore()
  const t = useT()
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t('app.title')
  }, [lang, t])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/grade/:g" element={<GradeMap />} />
      <Route path="/play/:g/:game" element={<LevelPage />} />
      <Route path="/teacher" element={<Teacher />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
