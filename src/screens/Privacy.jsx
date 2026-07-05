import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { formatDate } from '../data/library.js'

export default function Privacy() {
  const nav = useNavigate()
  const { settings, updateSettings, resetAll, journal, profile, stats, patch } = useStore()
  const [confirm, setConfirm] = useState(false)
  const [pending, setPending] = useState(null) // geprüftes Backup, wartet auf Zusammenführen/Ersetzen
  const [importMsg, setImportMsg] = useState('')
  const fileRef = useRef(null)

  // Vollständiges Backup: Tagebuch + Profil + Fortschritt + Einstellungen.
  const makeBackup = () =>
    JSON.stringify(
      { app: 'sternenluna', version: 1, exportedAt: new Date().toISOString(), profile, stats, settings, journal },
      null,
      2
    )

  const exportData = () => {
    const blob = new Blob([makeBackup()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sternenluna-backup-${formatDate().iso}.json`
    a.click()
    URL.revokeObjectURL(url)
    updateSettings({ lastBackupISO: formatDate().iso })
  }

  // Backup per E-Mail (P3): Teilen-Menü mit der Datei öffnen → „Mail" wählen
  // und an die eigene Adresse schicken. Fallback ohne Teilen-API: Download.
  const mailBackup = async () => {
    const file = new File([makeBackup()], `sternenluna-backup-${formatDate().iso}.json`, { type: 'application/json' })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Sternenluna Backup' })
        updateSettings({ lastBackupISO: formatDate().iso })
        setImportMsg('✓ Backup geteilt – am sichersten: an deine eigene E-Mail-Adresse senden.')
      } catch {
        /* abgebrochen – kein Fehler */
      }
      return
    }
    exportData()
    setImportMsg('✓ Backup heruntergeladen – hänge die Datei an eine E-Mail an dich selbst.')
  }

  // Backup-Datei einlesen & prüfen (akzeptiert auch alte Sternenorakel-Exporte).
  const onImportFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // gleiche Datei erneut wählbar
    if (!file) return
    setImportMsg('')
    try {
      const data = JSON.parse(await file.text())
      const entries = Array.isArray(data.journal) ? data.journal.filter((x) => x && x.id && x.ts) : null
      if (!entries) throw new Error('kein Tagebuch enthalten')
      setPending({ data, entries })
    } catch {
      setImportMsg('Diese Datei ist kein gültiges Sternenluna-Backup.')
    }
  }

  // mode 'merge': fehlende Einträge ergänzen, alles andere bleibt.
  // mode 'replace': Gerätestand vollständig durch das Backup ersetzen.
  const applyImport = (mode) => {
    const { data, entries } = pending
    patch((s) => {
      if (mode === 'replace') {
        return {
          onboarded: true,
          profile: { ...s.profile, ...(data.profile || {}) },
          stats: { ...s.stats, ...(data.stats || {}) },
          settings: { ...s.settings, ...(data.settings || {}), lastBackupISO: s.settings.lastBackupISO },
          journal: [...entries].sort((a, b) => b.ts - a.ts),
        }
      }
      const have = new Set(s.journal.map((x) => x.id))
      const merged = [...s.journal, ...entries.filter((x) => !have.has(x.id))].sort((a, b) => b.ts - a.ts)
      return { journal: merged }
    })
    setPending(null)
    setImportMsg(`✓ Backup eingespielt – ${entries.length} Einträge ${mode === 'merge' ? 'zusammengeführt' : 'wiederhergestellt'}.`)
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
              {settings.aiMode && settings.aiConsent === true ? 'An' : 'Aus'}
            </span>
          </div>
          <span className={'toggle' + (settings.aiMode && settings.aiConsent === true ? ' on' : '')}
            onClick={() => (settings.aiMode && settings.aiConsent === true
              ? updateSettings({ aiMode: false, aiConsent: false })
              : updateSettings({ aiMode: true, aiConsent: true }))}>
            <span className="knob" />
          </span>
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 12px/1.55 var(--font-body)', borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 10 }}>
          Botschaften kommen aus der <b style={{ color: 'var(--text)', fontWeight: 600 }}>eingebauten Bibliothek</b> – komplett offline.
          Im KI-Modus formuliert ein Sprachmodell deine Botschaft live; dafür wird nur dein Anfragetext gesendet.
        </div>
      </div>

      {/* Export / Import / Suche */}
      <div className="list" style={{ marginTop: 12, background: 'linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.03))', border: '1px solid rgba(255,255,255,.1)' }}>
        <button className="list-row" onClick={mailBackup}>
          <span>✉️ Backup per E-Mail sichern</span>
          <span className="meta">{settings.lastBackupISO ? `zuletzt ${settings.lastBackupISO}` : 'noch nie'} ›</span>
        </button>
        <button className="list-row" onClick={exportData}>
          <span>⬇ Backup als Datei (Export)</span>
          <span className="chev">›</span>
        </button>
        <button className="list-row" onClick={() => fileRef.current?.click()}>
          <span>⬆ Backup wiederherstellen (Import)</span>
          <span className="chev">›</span>
        </button>
        <button className="list-row" onClick={() => nav('/tagebuch')}>
          <span>Tagebuch durchsuchen</span>
          <span className="chev">›</span>
        </button>
      </div>
      <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={onImportFile} />
      {importMsg && (
        <div style={{ marginTop: 8, textAlign: 'center', color: importMsg.startsWith('✓') ? 'var(--gold-1)' : 'var(--danger)', font: '500 11.5px var(--font-body)' }}>
          {importMsg}
        </div>
      )}

      {/* Import-Bestätigung: Zusammenführen oder Ersetzen */}
      {pending && (
        <div className="overlay" onClick={() => setPending(null)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()} style={{ paddingTop: 24 }}>
            <div className="title-lg" style={{ fontSize: 19, color: 'var(--text)' }}>Backup gefunden ✓</div>
            <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.6 var(--font-body)', marginTop: 10 }}>
              <b style={{ color: 'var(--gold-1)' }}>{pending.entries.length}</b> Einträge
              {pending.data.exportedAt ? <> · gesichert am {String(pending.data.exportedAt).slice(0, 10)}</> : null}
              <br />Wie möchtest du es einspielen?
            </div>
            <button className="btn-gold" style={{ marginTop: 16, padding: 13 }} onClick={() => applyImport('merge')}>
              Zusammenführen (empfohlen)
            </button>
            <div style={{ color: '#7a7494', font: '400 10.5px/1.4 var(--font-body)', marginTop: 5 }}>
              Ergänzt fehlende Einträge, nichts geht verloren.
            </div>
            <button className="btn-ghost" style={{ marginTop: 12, padding: 12 }} onClick={() => applyImport('replace')}>
              Alles ersetzen
            </button>
            <div style={{ color: '#7a7494', font: '400 10.5px/1.4 var(--font-body)', marginTop: 5 }}>
              Überschreibt diesen Gerätestand vollständig mit dem Backup.
            </div>
            <button className="link-soft" style={{ marginTop: 14 }} onClick={() => setPending(null)}>Abbrechen</button>
          </div>
        </div>
      )}

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
