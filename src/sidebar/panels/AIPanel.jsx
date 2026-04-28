import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Loader, AlertCircle, Sparkles } from 'lucide-react'
import { useNovaStore } from '../../store/index.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export default function AIPanel() {
  const { settings } = useNovaStore()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (!settings.groqApiKey) {
      setError('Agrega tu API Key de Groq en Settings')
      return
    }

    const userMsg = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.groqApiKey}`,
        },
        body: JSON.stringify({
          model: settings.groqModel || 'llama3-8b-8192',
          messages: [...messages, userMsg],
          max_tokens: 1024,
        }),
      })

      if (response.status === 429) {
        setError('Límite de IA alcanzado — se renueva en breve ⏳')
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      const data = await response.json()
      const reply = data.choices[0].message.content

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message || 'Error conectando con Groq')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--accent-soft)' }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            IA Assistant
          </p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Groq · {settings.groqModel || 'llama3-8b-8192'}
          </p>
        </div>
        {!settings.groqApiKey && (
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full"
            style={{ background: '#ef444420', color: '#ef4444', border: '1px solid #ef444430' }}
          >
            Sin API Key
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs"
          style={{ background: '#f59e0b15', border: '1px solid #f59e0b30', color: '#f59e0b' }}
        >
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot size={28} style={{ color: 'var(--muted)' }} className="mx-auto mb-2" />
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Pregúntame lo que quieras
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
              style={{
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--card)',
                color: msg.role === 'user' ? 'white' : 'var(--text)',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2 rounded-xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Loader size={12} style={{ color: 'var(--accent)' }} className="animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-end gap-2 p-2 rounded-xl"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Escribe un mensaje... (Enter para enviar)"
          rows={2}
          className="flex-1 bg-transparent text-xs resize-none focus:outline-none"
          style={{ color: 'var(--text)' }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0"
          style={{
            background: input.trim() && !loading ? 'var(--accent)' : 'var(--border)',
            color: 'white',
          }}
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  )
}