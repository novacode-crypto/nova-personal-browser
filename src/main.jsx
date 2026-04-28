import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import { useNovaStore, applyTheme } from './store/index.js'

// Aplicar tema inmediatamente para evitar flash
applyTheme('dark', 'violet')

// Inicializar store con datos persistidos
const init = async () => {
  const { initStore } = useNovaStore.getState()
  await initStore()

  ReactDOM.createRoot(document.getElementById('root')).render(<App />)
}

init()