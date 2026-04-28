import { useState, useEffect } from 'react'

export default function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const hours   = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')
  const date    = time.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="text-center select-none">
      <div className="flex items-end justify-center gap-1">
        <span
          className="font-mono font-light tracking-widest"
          style={{ fontSize: '3.5rem', color: 'var(--text)', lineHeight: 1 }}
        >
          {hours}
        </span>
        <span
          className="font-mono font-light animate-pulse"
          style={{ fontSize: '3rem', color: 'var(--accent)', lineHeight: 1, marginBottom: '2px' }}
        >
          :
        </span>
        <span
          className="font-mono font-light tracking-widest"
          style={{ fontSize: '3.5rem', color: 'var(--text)', lineHeight: 1 }}
        >
          {minutes}
        </span>
        <span
          className="font-mono font-light ml-2"
          style={{ fontSize: '1.5rem', color: 'var(--muted)', lineHeight: 1, marginBottom: '6px' }}
        >
          {seconds}
        </span>
      </div>
      <p className="text-xs mt-2 capitalize" style={{ color: 'var(--muted)' }}>
        {date}
      </p>
    </div>
  )
}