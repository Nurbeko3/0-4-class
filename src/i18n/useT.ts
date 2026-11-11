import { useCallback } from 'react'
import { useStore } from '../core/progress'
import { strings, type StrKey } from './strings'

export function useT() {
  const { lang } = useStore()
  return useCallback(
    (key: StrKey, vars?: Record<string, string | number>) => {
      let s: string = strings[lang][key] ?? strings.uz[key] ?? key
      if (vars) for (const k in vars) s = s.replace(`{${k}}`, String(vars[k]))
      return s
    },
    [lang],
  )
}
