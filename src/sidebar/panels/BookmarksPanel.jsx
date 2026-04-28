import { useState } from 'react'
import { Bookmark, Trash2, ExternalLink, Search } from 'lucide-react'
import { useNovaStore } from '../../store/index.js'

export default function BookmarksPanel() {
  const { bookmarks, removeBookmark, updateTab, activeTabId } = useNovaStore()
  const [search, setSearch] = useState('')

  const filtered = bookmarks.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.url?.toLowerCase().includes(search.toLowerCase())
  )

  const navigate = (url) => {
    updateTab(activeTabId, { url, loading: true })
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      >
        <Search size={12} style={{ color: 'var(--muted)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar favoritos..."
          className="flex-1 bg-transparent text-xs focus:outline-none"
          style={{ color: 'var(--text)' }}
        />
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <Bookmark size={24} style={{ color: 'var(--muted)' }} className="mx-auto mb-2" />
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {bookmarks.length === 0 ? 'No hay favoritos' : 'Sin resultados'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((bm) => (
            <div
              key={bm.id}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style={{ border: '1px solid transparent' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--card)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
              }}
              onClick={() => navigate(bm.url)}
            >
              {bm.favicon
                ? <img src={bm.favicon} className="w-4 h-4 shrink-0" alt="" />
                : <div className="w-4 h-4 rounded" style={{ background: 'var(--border)' }} />
              }
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                  {bm.title || bm.url}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{bm.url}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(bm.url) }}
                  className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <ExternalLink size={11} style={{ color: 'var(--muted)' }} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeBookmark(bm.id) }}
                  className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = '#ef444420'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={11} style={{ color: '#ef4444' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}