import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'

export default function Privacy() {
  const nav = useNavigate()
  const { settings, updateSettings, resetAll, journal, profile, stats } = useStore()
  const [confirm, setConfirm] = useState(false)

  // Vollständiges Backup: Tagebuch + Profil + Fortschritt + Einstellungen.
  const exportData = () => {
    const backup = {
      app: 'sternenluna',
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      stats,
      settings,
      journal,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sternenluna-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const wipe = () => {
    resetAll()
    nav('/welcome', { replace: true })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text)' }}>
        <button className="back" onClick={() => nav('/profil/settings')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 18 }}>Daten &amp; Privatsphäre</span>
      </div>

      {/* Auf diesem Gerät */}
      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold-1)', font: '600 11px var(--font-body)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 7 }}>
          <span style={{ fontSize: 13 }}>🔒</span>Auf diesem Gerät
        </div>
        <div style={{ color: 'var(--text)', font: '400 13px/1.6 var(--font-body)' }}>
          Alle deine Eingaben und Botschaften bleiben auf diesem Gerät. Es gibt <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>kein Konto</b>.
          Im KI-Modus wird nur der Text deiner Anfrage zur Erstellung der Botschaft verarbeitet.
        </div>
      </div>

      {/* KI-Modus */}
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text)', font: '600 14px var(--font-body)' }}>KI-Modus</span>
            <span style={{ color: 'var(--purple-2)', font: '600 11px var(--font-body)', marginTop: 2, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {settings.aiMode ? 'An' : 'Aus'}
            </span>
          </div>
          <span className={'toggle' + (settings.aiMode ? ' on' : '')} onClick={() => updateSettings({ aiMode: !settings.aiMode })}>
            <span className="knob" />
          </span>
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 12px/1.55 var(--font-body)', borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 10 }}>
          Botschaften kommen aus der <b style={{ color: 'var(--text)', fontWeight: 600 }}>eingebauten Bibliothek</b> – komplett offline.
          Im KI-Modus formuliert ein Sprachmodell deine Botschaft live; dafür wird nur dein Anfragetext gesendet.
        </div>
      </div>

      {/* Export / Suche */}
      <div className="list" style={{ marginTop: 12, background: 'linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.03))', border: '1px solid rgba(255,255,255,.1)' }}>
        <button className="list-row" onClick={exportData}>
          <span>Deine Einträge exportieren</span>
          <span className="chev">›</span>
        </button>
        <button className="list-row" onClick={() => nav('/tagebuch')}>
          <span>Tagebuch durchsuchen</span>
          <span className="chev">›</span>
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <button className="btn-ghost" style={{ marginBottom: 8 }} onClick={() => setConfirm(true)}>
        Alle Daten löschen
      </button>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10.5px/1.45 var(--font-body)', paddingBottom: 12 }}>
        Entfernt Tagebuch &amp; Einstellungen unwiderruflich von diesem Gerät.
      </div>

      {confirm && (
        <div className="overlay" onClick={() => setConfirm(false)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()} style={{ paddingTop: 24 }}>
            <div className="title-lg" style={{ fontSize: 20, color: 'var(--text)' }}>Wirklich alles löschen?</div>
            <div style={{ color: 'var(--text-dim)', font: '400 13px/1.55 var(--font-body)', marginTop: 10 }}>
              Dein Tagebuch, dein Sternenband und alle Einstellungen werden unwiderruflich von diesem Gerät entfernt.
              Das lässt sich nicht rückgängig machen.
            </div>
            <button className="btn-ghost" style={{ marginTop: 18 }} onClick={wipe}>Ja, alles löschen</button>
            <button className="link-soft" style={{ marginTop: 14 }} onClick={() => setConfirm(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  )
}
