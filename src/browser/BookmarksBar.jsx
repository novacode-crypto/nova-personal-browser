import { useState } from 'react'
import { Plus, X, Edit2, Check } from 'lucide-react'
import { useNovaStore } from '../store/index.js'
import { motion, AnimatePresence } from 'framer-motion'

export default function BookmarksBar() {
  const {
    bookmarks, removeBookmark, updateBookmark,
    updateTab, activeTabId, addTab,
    showBookmarksBar,
  } = useNovaStore()

  const [editing, setEditing]   = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [contextMenu, setContextMenu] = useState(null)

  if (!showBookmarksBar) return null

  const navigate = (url) => {
    updateTab(activeTabId, { url, loading: true })
  }

  const handleContext = (e, bm) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, bm })
  }

  const startEdit = (bm) => {
    setEditing(bm.id)
    setEditTitle(bm.title)
    setContextMenu(null)
  }

  const saveEdit = (id) => {
    updateBookmark(id, { title: editTitle })
    setEditing(null)
  }

  return (
    <>
      <div
        className="flex items-center shrink-0 overflow-x-auto"
        style={{
          height: '30px',
          padding: '0 8px',
          gap: '2px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
        }}
        onClick={() => setContextMenu(null)}
      >
        {bookmarks.map((bm) => (
          <div
            key={bm.id}
            className="flex items-center shrink-0 group"
            style={{ maxWidth: '160px' }}
          >
            {editing === bm.id ? (
              <div className="flex items-center gap-1 px-2">
                <input
                  autoFocus
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(bm.id)
                    if (e.key === 'Escape') setEditing(null)
                  }}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--accent)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '11px',
                    color: 'var(--text)',
                    outline: 'none',
                    width: '100px',
                  }}
                />
                <button onClick={() => saveEdit(bm.id)}>
                  <Check size={11} style={{ color: 'var(--accent)' }} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate(bm.url)}
                onContextMenu={e => handleContext(e, bm)}
                className="flex items-center gap-1.5 rounded-md px-2 transition-colors"
                style={{
                  height: '22px',
                  maxWidth: '160px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text)',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--card)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {bm.favicon
                  ? <img src={bm.favicon} style={{ width: '12px', height: '12px', flexShrink: 0 }} alt="" />
                  : <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--border)', flexShrink: 0 }} />
                }
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {bm.title || bm.url}
                </span>
              </button>
            )}
          </div>
        ))}

        {bookmarks.length === 0 && (
          <span style={{ fontSize: '11px', color: 'var(--muted)', paddingLeft: '4px' }}>
            Agrega favoritos con el ícono 🔖 en la barra de dirección
          </span>
        )}
      </div>

      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 9999,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              overflow: 'hidden',
              minWidth: '160px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}
          >
            {[
              { label: 'Abrir',              action: () => { navigate(contextMenu.bm.url); setContextMenu(null) } },
              { label: 'Abrir en nueva tab', action: () => { addTab(contextMenu.bm.url); setContextMenu(null) } },
              { separator: true },
              { label: 'Editar',             action: () => startEdit(contextMenu.bm) },
              { label: 'Eliminar',           action: () => { removeBookmark(contextMenu.bm.id); setContextMenu(null) }, danger: true },
            ].map((item, i) =>
              item.separator ? (
                <div key={i} style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
              ) : (
                <button
                  key={i}
                  onClick={item.action}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 14px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: item.danger ? '#ef4444' : 'var(--text)',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}