import { useEffect, useRef, useState } from 'react'
import { useNovaStore } from '../store/index.js'
import HomePage from '../home/HomePage.jsx'
import { Bot, X, Send, Loader, Sparkles, AlertTriangle } from 'lucide-react'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Registro global de refs de webviews
export const webviewRefs = new Map()

function AIFloating({ settings }) {
  const [visible, setVisible]   = useState(false)
  const [input,   setInput]     = useState('')
  const [response, setResponse] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const needsProxy = settings.proxyRequired && !settings.proxyEnabled

  const askGroq = async (prompt) => {
    if (!settings.groqApiKey) { setError('Configura tu API Key de Groq en Settings'); return }
    if (needsProxy) { setError('Activa el Proxy para usar la IA'); return }
    setLoading(true); setResponse(''); setError(null)
    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.groqApiKey}` },
        body: JSON.stringify({ model: settings.groqModel || 'llama3-8b-8192', messages: [{ role: 'user', content: prompt }], max_tokens: 512 }),
      })
      if (res.status === 429) { setError('⏳ Límite alcanzado — intenta en un momento'); return }
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setResponse(data.choices[0].message.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        title="NOVA AI"
        style={{
          position: 'absolute', bottom: '16px', right: '16px', zIndex: 30,
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'var(--accent)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px var(--accent-glow)',
        }}
      >
        <Sparkles size={18} color="white" />
      </button>

      {visible && (
        <div style={{
          position: 'absolute', bottom: '64px', right: '16px', zIndex: 30,
          width: '300px', maxHeight: '380px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
            <Sparkles size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', flex: 1 }}>NOVA AI</span>
            <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              <X size={13} />
            </button>
          </div>

          {/* Proxy warning */}
          {needsProxy && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f59e0b15', borderBottom: '1px solid #f59e0b30' }}>
              <AlertTriangle size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#f59e0b' }}>Activa el Proxy para usar la IA</span>
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {error && <p style={{ fontSize: '11px', color: '#ef4444', marginBottom: '8px' }}>{error}</p>}
            {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}><Loader size={16} style={{ color: 'var(--accent)' }} className="animate-spin" /></div>}
            {response && <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6 }}>{response}</p>}
            {!response && !loading && !error && (
              <p style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', padding: '16px 0' }}>
                Escribe tu pregunta
              </p>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '8px', padding: '8px', borderTop: '1px solid var(--border)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { askGroq(input); setInput('') } }}
              placeholder="Pregunta algo..."
              disabled={needsProxy || !settings.groqApiKey}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '12px', color: 'var(--text)' }}
            />
            <button
              onClick={() => { askGroq(input); setInput('') }}
              disabled={!input.trim() || loading || needsProxy}
              style={{
                width: '28px', height: '28px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: input.trim() && !needsProxy ? 'var(--accent)' : 'var(--border)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Send size={11} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function WebView({ tab, onUpdate, onHistory }) {
  const webviewRef = useRef(null)

  useEffect(() => {
    const wv = webviewRef.current
    if (!wv) return

    // Registrar ref globalmente para back/forward/reload
    webviewRefs.set(tab.id, wv)

    const onLoadStart = () => onUpdate({ loading: true })
    const onLoadStop  = () => {
      onUpdate({ loading: false, title: wv.getTitle(), url: wv.getURL() })
      onHistory({ title: wv.getTitle(), url: wv.getURL() })
    }
    const onFavicon      = (e) => { if (e.favicons?.[0]) onUpdate({ favicon: e.favicons[0] }) }
    const onTitleUpdate  = (e) => onUpdate({ title: e.title })
    const onNavDone      = ()  => onUpdate({ url: wv.getURL(), title: wv.getTitle() })

    wv.addEventListener('did-start-loading',      onLoadStart)
    wv.addEventListener('did-stop-loading',       onLoadStop)
    wv.addEventListener('page-favicon-updated',   onFavicon)
    wv.addEventListener('page-title-updated',     onTitleUpdate)
    wv.addEventListener('did-navigate',           onNavDone)
    wv.addEventListener('did-navigate-in-page',   onNavDone)

    return () => {
      webviewRefs.delete(tab.id)
      wv.removeEventListener('did-start-loading',    onLoadStart)
      wv.removeEventListener('did-stop-loading',     onLoadStop)
      wv.removeEventListener('page-favicon-updated', onFavicon)
      wv.removeEventListener('page-title-updated',   onTitleUpdate)
      wv.removeEventListener('did-navigate',         onNavDone)
      wv.removeEventListener('did-navigate-in-page', onNavDone)
    }
  }, [tab.id])

  return (
    <webview
      ref={webviewRef}
      src={tab.url}
      style={{ width: '100%', height: '100%', display: 'flex' }}
      allowpopups="true"
      partition="persist:nova"
      useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    />
  )
}

export default function WebViewContainer() {
  const { tabs, activeTabId, updateTab, addHistory, settings } = useNovaStore()
  const activeTab = tabs.find(t => t.id === activeTabId)

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#fff' }}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={{ position: 'absolute', inset: 0, display: tab.id === activeTabId ? 'flex' : 'none' }}
        >
          {tab.url === 'nova://home'
            ? <HomePage />
            : <WebView
                tab={tab}
                isActive={tab.id === activeTabId}
                onUpdate={(data) => updateTab(tab.id, data)}
                onHistory={(entry) => addHistory(entry)}
              />
          }
        </div>
      ))}

      {/* IA flotante solo en tabs que no son home */}
      {activeTab?.url !== 'nova://home' && (
        <AIFloating settings={settings} />
      )}
    </div>
  )
}