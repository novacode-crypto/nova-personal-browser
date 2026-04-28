import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNovaStore } from '../store/index.js'

const ENGINES = {
  google: {
    url:   'https://www.google.com/search?q=',
    label: 'Google',
    icon:  'https://www.google.com/favicon.ico',
  },
  duckduckgo: {
    url:   'https://duckduckgo.com/?q=',
    label: 'DuckDuckGo',
    icon:  'https://duckduckgo.com/favicon.ico',
  },
  brave: {
    url:   'https://search.brave.com/search?q=',
    label: 'Brave',
    icon:  'https://brave.com/favicon.ico',
  },
  bing: {
    url:   'https://www.bing.com/search?q=',
    label: 'Bing',
    icon:  'https://www.bing.com/favicon.ico',
  },
  ecosia: {
    url:   'https://www.ecosia.org/search?q=',
    label: 'Ecosia',
    icon:  'https://www.ecosia.org/favicon.ico',
  },
}

export default function SearchBar() {
  const { settings, updateTab, activeTabId } = useNovaStore()
  const [query, setQuery] = useState('')
  const [showEngines, setShowEngines] = useState(false)

  const engine = ENGINES[settings.searchEngine] || ENGINES.google

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    updateTab(activeTabId, { url: engine.url + encodeURIComponent(query), loading: true })
    setQuery('')
  }

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSearch}>
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 20px var(--accent-glow)',
          }}
          onFocus={() => {}}
        >
          {/* Motor de búsqueda — clickeable */}
          <button
            type="button"
            onClick={() => setShowEngines(!showEngines)}
            className="flex items-center gap-1.5 shrink-0 rounded-lg px-2 py-1 transition-colors"
            style={{ background: 'var(--card)' }}
            title={`Motor: ${engine.label}`}
          >
            <img
              src={engine.icon}
              className="w-4 h-4 rounded-sm"
              alt={engine.label}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {engine.label}
            </span>
          </button>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Buscar en ${engine.label}...`}
            autoFocus
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--text)' }}
          />

          <Search size={16} style={{ color: 'var(--muted)' }} className="shrink-0" />
        </div>
      </form>

      {/* Selector de motor */}
      {showEngines && (
        <div
          className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden shadow-lg z-20"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {Object.entries(ENGINES).map(([id, eng]) => (
            <button
              key={id}
              onClick={() => {
                useNovaStore.getState().setSettings({ searchEngine: id })
                setShowEngines(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors text-left"
              style={{
                background: settings.searchEngine === id ? 'var(--accent-soft)' : 'transparent',
                color: settings.searchEngine === id ? 'var(--accent)' : 'var(--text)',
              }}
              onMouseEnter={e => {
                if (settings.searchEngine !== id)
                  e.currentTarget.style.background = 'var(--card)'
              }}
              onMouseLeave={e => {
                if (settings.searchEngine !== id)
                  e.currentTarget.style.background = 'transparent'
              }}
            >
              <img
                src={eng.icon}
                className="w-4 h-4 rounded-sm"
                alt={eng.label}
                onError={(e) => { e.target.style.display = 'none' }}
              />
              {eng.label}
              {id === 'brave' && (
                <span className="ml-auto text-xs" style={{ color: '#f59e0b' }}>
                  ⚠️ VPN
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}