import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { StoreProvider } from './store/store.jsx'
import './styles/index.css'
import './styles/components.css'
import { registerSW } from 'virtual:pwa-register'

// Update-Fluss: Beim Öffnen prüft der Browser im Hintergrund auf eine neue
// Version. Liegt eine bereit, zeigt die App ein Popup (UpdateHinweis) –
// erst der Knopf dort aktiviert sie. Zusätzlich stündliche Prüfung für
// Nutzerinnen, die die App lange offen lassen.
const aktualisieren = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('sl-update-bereit'))
  },
  onRegisteredSW(_url, reg) {
    if (!reg) return
    reg.update().catch(() => {})
    setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000)
  },
})
window.__slUpdate = aktualisieren

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <StoreProvider>
          <App />
        </StoreProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
