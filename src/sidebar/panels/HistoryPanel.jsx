import { useState } from 'react'
import { History, Trash2, Search, ExternalLink } from 'lucide-react'
import { useNovaStore } from '../../store/index.js'

export default function HistoryPanel() {
  const { history, clearHistory, updateTab, activeTabId } = useNovaStore()
  const [search, setSearch] = useState('')

  const filtered = history.filter((h) =>
    h.title?.toLowerCase().includes(search.toLowerCase()) ||
    h.url?.toLowerCase().includes(search.toLowerCase())
  )

  const formatTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const navigate = (url) => updateTab(activeTabId, { url, loading: true })

  return (
    <div className="space-y-3">
      {/* Search + Clear */}
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <Search size={12} style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar historial..."
            className="flex-1 bg-transparent text-xs focus:outline-none"
            style={{ color: 'var(--text)' }}
          />
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-3 py-2 rounded-lg text-xs transition-colors"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <History size={24} style={{ color: 'var(--muted)' }} className="mx-auto mb-2" />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {history.length === 0 ? 'Sin historial' : 'Sin resultados'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((h) => (
            <div
              key={h.id}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              onClick={() => navigate(h.url)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--card)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                  {h.title || h.url}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                  {formatTime(h.time)} · {h.url}
                </p>
              </div>
              <ExternalLink
                size={11}
                style={{ color: 'var(--muted)' }}
                className="opacity-0 group-hover:opacity-100 shrink-0"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}