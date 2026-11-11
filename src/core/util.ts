import { useEffect } from 'react'

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** n ta narsani maydon bo'ylab bir-biriga tegmaydigan qilib joylaydi (foizda). */
export function layout(n: number): { left: number; top: number }[] {
  const cols = Math.ceil(Math.sqrt(n * 1.8))
  const rows = Math.ceil(n / cols)
  const cells = shuffle(Array.from({ length: cols * rows }, (_, i) => i)).slice(0, n)
  return cells.map((c) => ({
    left: (((c % cols) + 0.5) / cols) * 100 + (Math.random() - 0.5) * 6,
    top: ((Math.floor(c / cols) + 0.5) / rows) * 100 + (Math.random() - 0.5) * 8,
  }))
}

/** Shart bajarilganda biroz kutib (animatsiya tugasin) g'alabani bildiradi. */
export function useWinWhen(won: boolean, onWin: () => void, delay = 700) {
  useEffect(() => {
    if (!won) return
    const t = setTimeout(onWin, delay)
    return () => clearTimeout(t)
  }, [won, onWin, delay])
}
