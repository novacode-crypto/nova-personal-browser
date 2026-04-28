import { X, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNovaStore } from '../store/index.js'

export default function TabBar() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab } = useNovaStore()

  return (
    <div
      className="flex items-end shrink-0 overflow-x-auto"
      style={{
        height: '34px',
        background: 'var(--bg-tinted)',
        paddingLeft: '8px',
        paddingRight: '8px',
        gap: '4px',
      }}
    >
      <AnimatePresence initial={false}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActiveTab(tab.id)}
              className="group flex items-center shrink-0"
              style={{
                minWidth: '120px',
                maxWidth: '200px',
                height: '28px',
                padding: '0 10px',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                background: isActive ? 'var(--surface)' : 'transparent',
                border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                borderBottom: isActive ? '1px solid var(--surface)' : '1px solid transparent',
                gap: '6px',
              }}
            >
              {/* Favicon */}
              {tab.favicon
                ? <img src={tab.favicon} style={{ width: '14px', height: '14px', flexShrink: 0 }} alt="" />
                : <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--border)', flexShrink: 0 }} />
              }

              {/* Título */}
              <span
                className="truncate flex-1 text-xs"
                style={{ color: isActive ? 'var(--text)' : 'var(--muted)' }}
              >
                {tab.loading ? 'Cargando...' : (tab.title || 'Nueva pestaña')}
              </span>

              {/* Cerrar */}
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
                className="flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{
                  width: '16px',
                  height: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={10} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Nueva tab */}
      <button
        onClick={() => addTab()}
        className="flex items-center justify-center rounded-lg transition-colors shrink-0"
        style={{
          width: '28px',
          height: '28px',
          background: 'transparent',
          border: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          marginBottom: '2px',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}