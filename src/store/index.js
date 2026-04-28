import { create } from 'zustand'

let toastId = 0

export const ACCENTS = [
  { id: 'violet', label: 'Violeta', color: '#7c6aff' },
  { id: 'blue',   label: 'Azul',    color: '#3b82f6' },
  { id: 'green',  label: 'Verde',   color: '#10b981' },
  { id: 'orange', label: 'Naranja', color: '#f59e0b' },
  { id: 'pink',   label: 'Rosa',    color: '#ec4899' },
  { id: 'red',    label: 'Rojo',    color: '#ef4444' },
  { id: 'silver', label: 'Plateado',color: '#94a3b8' },
]

export function applyTheme(theme, accent) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.setAttribute('data-accent', accent)
  theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark')

  const darkVars  = { '--bg': '#09090f', '--surface': '#0f0f1b', '--card': '#15152a', '--border': '#2a2a45', '--text': '#e8e8f5', '--muted': '#6b6b90' }
  const lightVars = { '--bg': '#f5f5fd', '--surface': '#ffffff', '--card': '#ebebf8', '--border': '#d5d5ee', '--text': '#111128', '--muted': '#6868a0' }
  const accentVars = {
    violet: { '--accent': '#7c6aff', '--accent2': '#a78bfa', '--accent-glow': '#7c6aff25', '--accent-soft': '#7c6aff18', '--accent-tint': '#7c6aff08' },
    blue:   { '--accent': '#3b82f6', '--accent2': '#60a5fa', '--accent-glow': '#3b82f625', '--accent-soft': '#3b82f618', '--accent-tint': '#3b82f608' },
    green:  { '--accent': '#10b981', '--accent2': '#34d399', '--accent-glow': '#10b98125', '--accent-soft': '#10b98118', '--accent-tint': '#10b98108' },
    orange: { '--accent': '#f59e0b', '--accent2': '#fbbf24', '--accent-glow': '#f59e0b25', '--accent-soft': '#f59e0b18', '--accent-tint': '#f59e0b08' },
    pink:   { '--accent': '#ec4899', '--accent2': '#f472b6', '--accent-glow': '#ec489925', '--accent-soft': '#ec489918', '--accent-tint': '#ec489908' },
    red:    { '--accent': '#ef4444', '--accent2': '#f87171', '--accent-glow': '#ef444425', '--accent-soft': '#ef444418', '--accent-tint': '#ef444408' },
    silver: { '--accent': '#94a3b8', '--accent2': '#cbd5e1', '--accent-glow': '#94a3b825', '--accent-soft': '#94a3b818', '--accent-tint': '#94a3b808' },
  }

  const vars = { ...(theme === 'dark' ? darkVars : lightVars), ...(accentVars[accent] || accentVars.violet) }
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))

  const accentColor = (accentVars[accent] || accentVars.violet)['--accent']
  if (theme === 'dark') {
    root.style.setProperty('--surface-tinted', `color-mix(in srgb, ${accentColor}08 100%, #0f0f1b)`)
    root.style.setProperty('--bg-tinted',      `color-mix(in srgb, ${accentColor}06 100%, #09090f)`)
  } else {
    root.style.setProperty('--surface-tinted', `color-mix(in srgb, ${accentColor}15 100%, #ffffff)`)
    root.style.setProperty('--bg-tinted',      `color-mix(in srgb, ${accentColor}10 100%, #f5f5fd)`)
  }
}

// Persistencia via Electron store
const persist = async (key, value) => {
  if (window.nova?.store) {
    await window.nova.store.set(key, value)
  }
}

export const useNovaStore = create((set, get) => ({

  // ── Init — carga datos persistidos ────────────
  initialized: false,
  initStore: async () => {
    if (!window.nova?.store) return
    const saved = await window.nova.store.getAll()
    if (!saved) return

    const theme  = saved.theme       || 'dark'
    const accent = saved.accentColor || 'violet'
    applyTheme(theme, accent)

    set({
      initialized:      true,
      theme,
      accentColor:      accent,
      bookmarks:        saved.bookmarks        || [],
      history:          saved.history          || [],
      showBookmarksBar: saved.showBookmarksBar ?? true,
      settings:         { ...get().settings, ...(saved.settings || {}) },
      extensions:       saved.extensions       || [],
    })
  },

  // ── Tema ──────────────────────────────────────
  theme: 'dark',
  accentColor: 'violet',

  setTheme: (theme) => {
    const { accentColor } = get()
    applyTheme(theme, accentColor)
    set({ theme })
    persist('theme', theme)
  },

  setAccent: (accent) => {
    const { theme } = get()
    applyTheme(theme, accent)
    set({ accentColor: accent })
    persist('accentColor', accent)
  },

  initTheme: () => {
    const { theme, accentColor } = get()
    applyTheme(theme, accentColor)
  },

  // ── Tabs ──────────────────────────────────────
  tabs: [{ id: 'tab-1', url: 'nova://home', title: 'Nueva pestaña', favicon: null, loading: false }],
  activeTabId: 'tab-1',

  addTab: (url = 'nova://home') => {
    const id = `tab-${Date.now()}`
    set((s) => ({
      tabs: [...s.tabs, { id, url, title: 'Nueva pestaña', favicon: null, loading: false }],
      activeTabId: id,
    }))
    return id
  },

  closeTab: (id) => set((s) => {
    const tabs = s.tabs.filter((t) => t.id !== id)
    if (tabs.length === 0) {
      const newId = `tab-${Date.now()}`
      return { tabs: [{ id: newId, url: 'nova://home', title: 'Nueva pestaña', favicon: null, loading: false }], activeTabId: newId }
    }
    const idx = s.tabs.findIndex((t) => t.id === id)
    const activeTabId = s.activeTabId === id ? tabs[Math.max(0, idx - 1)].id : s.activeTabId
    return { tabs, activeTabId }
  }),

  setActiveTab:  (id)   => set({ activeTabId: id }),
  updateTab: (id, data) => set((s) => ({
    tabs: s.tabs.map((t) => t.id === id ? { ...t, ...data } : t),
  })),

  // ── Sidebar ───────────────────────────────────
  sidebarOpen:  false,
  activePanel:  null,
  togglePanel:  (panel) => set((s) => ({
    sidebarOpen: s.activePanel === panel ? !s.sidebarOpen : true,
    activePanel: panel,
  })),
  closePanel: () => set({ sidebarOpen: false }),

  // ── Settings ──────────────────────────────────
  settings: {
    searchEngine:  'google',
    homepage:      'nova://home',
    adblock:       true,
    groqApiKey:    '',
    groqModel:     'llama3-8b-8192',
    weatherApiKey: '',
    ubiquitiIP:    '172.16.1.7',
    ubiquitiUser:  'ubnt',
    ubiquitiPass:  '',
    timezone:      'America/Havana',
    downloadPath:  '',
    downloadParts: 4,
    proxyEnabled:  false,
    proxyRequired: true,  // IA requiere proxy
  },

  setSettings: (data) => {
    set((s) => {
      const settings = { ...s.settings, ...data }
      persist('settings', settings)
      return { settings }
    })
  },

  // ── Bookmarks ─────────────────────────────────
  bookmarks: [],

  addBookmark: (bookmark) => set((s) => {
    const exists = s.bookmarks.find(b => b.url === bookmark.url)
    if (exists) return s
    const bookmarks = [...s.bookmarks, { ...bookmark, id: `bm-${Date.now()}` }]
    persist('bookmarks', bookmarks)
    return { bookmarks }
  }),

  removeBookmark: (id) => set((s) => {
    const bookmarks = s.bookmarks.filter((b) => b.id !== id)
    persist('bookmarks', bookmarks)
    return { bookmarks }
  }),

  updateBookmark: (id, data) => set((s) => {
    const bookmarks = s.bookmarks.map((b) => b.id === id ? { ...b, ...data } : b)
    persist('bookmarks', bookmarks)
    return { bookmarks }
  }),

  // ── Historial ─────────────────────────────────
  history: [],

  addHistory: (entry) => set((s) => {
    // No agregar home ni duplicados consecutivos
    if (entry.url === 'nova://home') return s
    if (s.history[0]?.url === entry.url) return s
    const history = [
      { ...entry, id: `h-${Date.now()}`, time: Date.now() },
      ...s.history,
    ].slice(0, 500)
    persist('history', history)
    return { history }
  }),

  clearHistory: () => {
    persist('history', [])
    set({ history: [] })
  },

  // ── Bookmarks Bar ─────────────────────────────
  showBookmarksBar: true,
  toggleBookmarksBar: () => set((s) => {
    const showBookmarksBar = !s.showBookmarksBar
    persist('showBookmarksBar', showBookmarksBar)
    return { showBookmarksBar }
  }),

  // ── Extensions ────────────────────────────────
  extensions: [],
  addExtension: (ext) => set((s) => {
    const extensions = [...s.extensions, ext]
    persist('extensions', extensions)
    return { extensions }
  }),

  // ── Downloads ─────────────────────────────────
  downloads: [],
  addDownload:        (dl)       => set((s) => ({ downloads: [dl, ...s.downloads] })),
  updateDownloadItem: (id, data) => set((s) => ({
    downloads: s.downloads.map(d => d.id === id ? { ...d, ...data } : d)
  })),
  removeDownload: (id) => set((s) => ({
    downloads: s.downloads.filter(d => d.id !== id)
  })),

  // ── ISP ───────────────────────────────────────
  isp: {
    isConnected: false, activeAccountId: null,
    connectionType: 'nauta', timeUsed: 0,
    timeRemaining: 0, portalReachable: null,
    scheduledSecsLeft: null,
  },
  setIsp: (data) => set((s) => ({ isp: { ...s.isp, ...data } })),

  ispTimerRef: { current: null },
  startIspTimer: () => {
    const store = get()
    if (store.ispTimerRef.current) clearInterval(store.ispTimerRef.current)
    store.ispTimerRef.current = setInterval(() => {
      set((s) => ({
        isp: { ...s.isp, timeUsed: s.isp.timeUsed + 1, timeRemaining: Math.max(0, s.isp.timeRemaining - 1) }
      }))
    }, 1000)
  },
  stopIspTimer: () => {
    const store = get()
    if (store.ispTimerRef.current) { clearInterval(store.ispTimerRef.current); store.ispTimerRef.current = null }
  },

  // ── Proxy ─────────────────────────────────────
  proxy: { active: false, activeAccount: null, accounts: [], currentIP: null, geo: null },
  setProxy: (data) => set((s) => ({ proxy: { ...s.proxy, ...data } })),

  // ── Toast ─────────────────────────────────────
  toasts: [],
  addToast: ({ type = 'info', title, message, duration = 4000 }) => {
    const id = `t-${++toastId}`
    set((s) => ({ toasts: [...s.toasts, { id, type, title, message }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))