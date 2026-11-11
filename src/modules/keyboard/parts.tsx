import './keyboard.css'

/** Nechta topshiriq bajarilgani: nuqtalar qatori. */
export function Dots({ total, done }: { total: number; done: number }) {
  return (
    <div className="kbd-dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < done ? 'kbd-dot kbd-dot-on' : 'kbd-dot'} />
      ))}
    </div>
  )
}

/** Bola boshqa raskladkada bo'lsa: tilni almashtirish tugmalari (matnsiz ko'rsatma). */
export function SwitchHint() {
  return (
    <div className="kbd-switch" aria-hidden="true">
      <span className="kbd-switch-cap">Alt</span>
      <span>+</span>
      <span className="kbd-switch-cap">Shift</span>
    </div>
  )
}
