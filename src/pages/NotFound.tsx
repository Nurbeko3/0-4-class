import { Link } from 'react-router-dom'
import { useT } from '../i18n/useT'
import { HomeIcon } from '../ui/art'

export function NotFound() {
  const t = useT()
  return (
    <div className="page center">
      <h1>{t('common.notFound')}</h1>
      <Link className="btn" to="/">
        <HomeIcon /> {t('common.home')}
      </Link>
    </div>
  )
}
