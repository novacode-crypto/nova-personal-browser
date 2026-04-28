import { useEffect } from 'react'
import TitleBar from './browser/TitleBar.jsx'
import TabBar from './browser/TabBar.jsx'
import ToolBar from './browser/ToolBar.jsx'
import BookmarksBar from './browser/BookmarksBar.jsx'
import WebViewContainer from './browser/WebViewContainer.jsx'
import SidebarIcons from './sidebar/SidebarIcons.jsx'
import SidebarPanel from './sidebar/SidebarPanel.jsx'
import Toast from './components/Toast.jsx'
import { useNovaStore } from './store/index.js'

export default function App() {
  const { sidebarOpen, toggleBookmarksBar } = useNovaStore()

  // Ctrl+B toggle bookmarks bar
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleBookmarksBar()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleBookmarksBar])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      <TitleBar />
      <TabBar />
      <ToolBar />
      <BookmarksBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {sidebarOpen && <SidebarPanel />}
        <WebViewContainer />
        <SidebarIcons />
      </div>

      <Toast />
    </div>
  )
}