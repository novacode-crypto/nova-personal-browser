import { Minus, Square, X, Globe, Sun, Moon } from 'lucide-react'
import { useNovaStore, ACCENTS } from '../store/index.js'

export default function TitleBar() {
  const { theme, accentColor, setTheme, setAccent } = useNovaStore()

  const minimize = () => window.nova?.window.minimize()
  const maximize = () => window.nova?.window.maximize()
  const close    = () => window.nova?.window.close()

  return (
    <div
      className="titlebar-drag select-none shrink-0 flex items-center"
      style={{
        height: '36px',
        background: 'var(--surface-tinted)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 titlebar-no-drag">
        <div
          className="flex items-center justify-center rounded-md"
          style={{
            width: '20px',
            height: '20px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          }}
        >
          <Globe size={11} className="text-white" />
        </div>
        <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
          NOVA
        </span>
      </div>

      <div className="flex-1" />

      {/* Accent picker */}
      <div className="flex items-center gap-1.5 px-3 titlebar-no-drag">
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAccent(a.id)}
            title={a.label}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: a.color,
              outline: accentColor === a.id ? `2px solid ${a.color}` : 'none',
              outlineOffset: '2px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ))}

        {/* Separador */}
        <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 4px' }} />

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          className="titlebar-no-drag flex items-center justify-center rounded-lg transition-colors"
          style={{
            width: '28px',
            height: '28px',
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
        >
          {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>

        <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 4px' }} />
      </div>

      {/* Window controls */}
      <div className="flex titlebar-no-drag" style={{ height: '36px' }}>
        {[
          { action: minimize, icon: <Minus size={13} />, danger: false },
          { action: maximize, icon: <Square size={11} />, danger: false },
          { action: close,    icon: <X size={13} />,      danger: true  },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            style={{
              width: '46px',
              height: '36px',
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = btn.danger ? '#ef4444' : 'var(--card)'
              e.currentTarget.style.color = btn.danger ? 'white' : 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--muted)'
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  )
}