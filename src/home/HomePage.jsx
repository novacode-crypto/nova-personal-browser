import { useState } from 'react'
import { useNovaStore } from '../store/index.js'
import ClockWidget from './widgets/ClockWidget.jsx'
import WeatherWidget from './widgets/WeatherWidget.jsx'
import SearchBar from './SearchBar.jsx'

export default function HomePage() {
  const { bookmarks, updateTab, activeTabId } = useNovaStore()

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto"
      style={{ background: 'var(--bg)' }}
    >
      {/* Logo */}
      <div className="mb-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            boxShadow: '0 0 30px var(--accent-glow)',
          }}
        >
          <span className="text-white text-2xl font-bold">N</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          NOVA
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Personal Browser Suite
        </p>
      </div>

      {/* Clock */}
      <ClockWidget />

      {/* Weather */}
      <div className="mt-3">
        <WeatherWidget />
      </div>

      {/* Search */}
      <div className="mt-6 w-full max-w-xl">
        <SearchBar />
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="mt-8 w-full max-w-xl">
          <p className="text-xs mb-3 text-center" style={{ color: 'var(--muted)' }}>
            Accesos rápidos
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {bookmarks.slice(0, 8).map((bm) => (
              <button
                key={bm.id}
                onClick={() => updateTab(activeTabId, { url: bm.url, loading: true })}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {bm.favicon
                  ? <img src={bm.favicon} className="w-4 h-4" alt="" />
                  : <div className="w-4 h-4 rounded" style={{ background: 'var(--border)' }} />
                }
                {bm.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}