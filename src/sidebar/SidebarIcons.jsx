import { motion } from 'framer-motion'
import { Globe, Sparkles, Bookmark, History, Settings, Plus, Download } from 'lucide-react'
import { useNovaStore } from '../store/index.js'

const PANELS = [
  { id: 'hub',       icon: Globe,     label: 'Hub',        color: '#10b981' },
  { id: 'ai',        icon: Sparkles,  label: 'NOVA AI',    color: '#7c6aff' },
  { id: 'bookmarks', icon: Bookmark,  label: 'Favoritos',  color: '#f59e0b' },
  { id: 'history',   icon: History,   label: 'Historial',  color: '#3b82f6' },
  { id: 'downloads', icon: Download,  label: 'Descargas',  color: '#06b6d4' },
]

export default function SidebarIcons() {
  const { activePanel, sidebarOpen, togglePanel, extensions } = useNovaStore()

  const isActive = (id) => sidebarOpen && activePanel === id

  return (
<div
  className="flex flex-col items-center py-3 gap-1 shrink-0"
  style={{
    width: '48px',
    background: 'var(--surface)',
    borderLeft: '1px solid var(--border)',
  }}
>
      {/* Paneles principales */}
      {PANELS.map((panel) => {
        const Icon = panel.icon
        const active = isActive(panel.id)
        return (
          <motion.button
            key={panel.id}
            onClick={() => togglePanel(panel.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={panel.label}
            className="sidebar-icon"
            style={{
              background: active ? 'var(--card)' : 'transparent',
              borderColor: active ? panel.color : 'transparent',
              color: active ? panel.color : 'var(--muted)',
              boxShadow: active ? `0 0 10px ${panel.color}30` : 'none',
            }}
          >
            <Icon size={17} />
          </motion.button>
        )
      })}

      {/* Separador */}
      <div className="w-6 h-px my-1" style={{ background: 'var(--border)' }} />

      {/* Extensiones dinámicas */}
      {extensions.map((ext) => {
        const active = isActive(ext.id)
        return (
          <motion.button
            key={ext.id}
            onClick={() => togglePanel(ext.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={ext.label}
            className="sidebar-icon"
            style={{
              background: active ? 'var(--card)' : 'transparent',
              borderColor: active ? ext.color : 'transparent',
              color: active ? ext.color : 'var(--muted)',
            }}
          >
            <span className="text-base">{ext.icon}</span>
          </motion.button>
        )
      })}

      {/* Botón agregar extensión */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Agregar extensión"
        className="sidebar-icon"
        style={{ color: 'var(--muted)', borderColor: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
      >
        <Plus size={15} />
      </motion.button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings — siempre al fondo */}
      <motion.button
        onClick={() => togglePanel('settings')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Configuración"
        className="sidebar-icon"
        style={{
          background: isActive('settings') ? 'var(--card)' : 'transparent',
          borderColor: isActive('settings') ? 'var(--accent)' : 'transparent',
          color: isActive('settings') ? 'var(--accent)' : 'var(--muted)',
        }}
      >
        <Settings size={17} />
      </motion.button>
    </div>
  )
}