import { Trophy } from 'lucide-react'

export default function LaLigaPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: '#f59e0b20', border: '1px solid #f59e0b30' }}
      >
        <Trophy size={22} style={{ color: '#f59e0b' }} />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          LaLiga Tracker
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Extensión independiente
        </p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          — En desarrollo —
        </p>
      </div>
    </div>
  )
}