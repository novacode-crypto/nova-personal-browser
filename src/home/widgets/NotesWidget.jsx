import { useState, useEffect } from 'react'
import { StickyNote } from 'lucide-react'

export default function NotesWidget() {
  const [note, setNote] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nova-quick-note')
    if (saved) setNote(saved)
  }, [])

  const handleChange = (e) => {
    setNote(e.target.value)
    localStorage.setItem('nova-quick-note', e.target.value)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
        style={{
          background: 'var(--card)',
          border: `1px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
          color: open ? 'var(--accent)' : 'var(--muted)',
        }}
      >
        <StickyNote size={14} />
        <span>Notas rápidas</span>
      </button>

      {open && (
        <div
          className="absolute top-10 left-0 w-64 rounded-xl shadow-lg z-10 p-3"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <textarea
            value={note}
            onChange={handleChange}
            placeholder="Escribe algo..."
            rows={5}
            className="w-full bg-transparent text-xs resize-none focus:outline-none"
            style={{ color: 'var(--text)' }}
          />
        </div>
      )}
    </div>
  )
}