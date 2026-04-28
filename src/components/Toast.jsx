import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useNovaStore } from '../store/index.js'

const icons = {
  success: { icon: CheckCircle, color: 'text-green-400',  bg: 'border-green-400/30 bg-green-400/10' },
  error:   { icon: XCircle,     color: 'text-red-400',    bg: 'border-red-400/30 bg-red-400/10' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'border-yellow-400/30 bg-yellow-400/10' },
  info:    { icon: Info,        color: 'text-blue-400',   bg: 'border-blue-400/30 bg-blue-400/10' },
}

export default function Toast() {
  const { toasts, removeToast } = useNovaStore()

  return (
    <div className="fixed bottom-4 right-14 flex flex-col gap-2 z-50">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const { icon: Icon, color, bg } = icons[toast.type] || icons.info
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`flex items-start gap-3 p-3 rounded-xl border ${bg} min-w-[260px] max-w-[300px] shadow-lg`}
            >
              <Icon size={14} className={`${color} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="text-nova-text text-xs font-semibold">{toast.title}</p>
                )}
                <p className="text-nova-muted text-xs">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-nova-muted hover:text-nova-text shrink-0"
              >
                <X size={11} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}