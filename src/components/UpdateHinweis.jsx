import { useEffect, useState } from 'react'
import { LunaAvatar } from './Luna.jsx'

// Update-Popup: erscheint nur, wenn der Hintergrund-Check beim Öffnen
// eine neue Version gefunden hat (Event aus main.jsx). Ein Tipp genügt –
// die App lädt sich einmal neu, alle Daten bleiben (local-first).
// „Später“ schließt nur; beim nächsten Öffnen fragt Luna wieder.

export default function UpdateHinweis() {
  const [bereit, setBereit] = useState(false)
  useEffect(() => {
    const auf = () => setBereit(true)
    window.addEventListener('sl-update-bereit', auf)
    return () => window.removeEventListener('sl-update-bereit', auf)
  }, [])

  if (!bereit) return null
  return (
    <div className="overlay" style={{ zIndex: 70 }}>
      <div className="modal pop" style={{ paddingTop: 22, textAlign: 'center' }}>
        <LunaAvatar size={64} />
        <div className="title-lg" style={{ fontSize: 19, color: 'var(--text)', marginTop: 10 }}>
          Luna hat sich weiterentwickelt ✦
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.55 var(--font-body)', marginTop: 8 }}>
          Eine neue Version von Sternenluna liegt bereit. Ein Tipp genügt –
          deine Sterne, Einträge und Einstellungen bleiben selbstverständlich erhalten.
        </div>
        <button className="btn-gold" style={{ marginTop: 16 }}
          onClick={() => (window.__slUpdate ? window.__slUpdate(true) : window.location.reload())}>
          ✦ Jetzt aktualisieren
        </button>
        <button className="link-soft" style={{ marginTop: 12 }} onClick={() => setBereit(false)}>
          Später
        </button>
      </div>
    </div>
  )
}
