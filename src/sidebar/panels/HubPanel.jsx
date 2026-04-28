import { Wifi, Shield, Radio } from 'lucide-react'
import { useNovaStore } from '../../store/index.js'

export default function HubPanel() {
  const { isp, proxy } = useNovaStore()

  return (
    <div className="space-y-3">
      {/* ISP */}
      <div className="nova-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wifi size={14} style={{ color: '#10b981' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
              ISP Manager
            </span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: isp.isConnected ? '#10b98120' : 'var(--card)',
              color: isp.isConnected ? '#10b981' : 'var(--muted)',
              border: `1px solid ${isp.isConnected ? '#10b98130' : 'var(--border)'}`,
            }}
          >
            {isp.isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          KonohaWISP — ETECSA
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Panel completo — próximamente
        </p>
      </div>

      {/* Proxy */}
      <div className="nova-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield size={14} style={{ color: '#7c6aff' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
              Proxy Manager
            </span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: proxy.active ? '#7c6aff20' : 'var(--card)',
              color: proxy.active ? '#7c6aff' : 'var(--muted)',
              border: `1px solid ${proxy.active ? '#7c6aff30' : 'var(--border)'}`,
            }}
          >
            {proxy.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Oxylabs · Cloudflare Workers
        </p>
      </div>

      {/* Ubiquiti */}
      <div className="nova-card">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={14} style={{ color: '#3b82f6' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            Ubiquiti Panel
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          NanoStation M5 · 172.16.1.7
        </p>
      </div>
    </div>
  )
}