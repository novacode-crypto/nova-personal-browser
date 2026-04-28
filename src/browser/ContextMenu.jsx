import { motion, AnimatePresence } from 'framer-motion'

export default function ContextMenu({ x, y, items, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-50 min-w-[160px] rounded-xl border shadow-lg overflow-hidden"
        style={{
          top: y,
          left: x,
          background: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {items.map((item, i) =>
          item.separator ? (
            <div key={i} className="h-px mx-2 my-1" style={{ background: 'var(--border)' }} />
          ) : (
            <button
              key={i}
              onClick={() => { item.action?.(); onClose?.() }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left"
              style={{ color: item.danger ? '#ef4444' : 'var(--text)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </button>
          )
        )}
      </motion.div>
    </AnimatePresence>
  )
}