import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { formatDate } from '../data/library.js'
import { generateMessage } from '../data/generator.js'
import { isInstalled, isIOS, canPromptInstall, promptInstall, onInstallChange } from '../lib/install.js'

// Einstellungen-Hub: kurze, gruppierte Reihen (Apple-Stil) – alles
// Inhaltliche liegt auf Untersektionen (SettingsSektion.jsx).

const Gruppe = ({ label, children }) => (
  <div style={{ marginTop: 16 }}>
    <div style={{ color: '#8a83a6', font: '600 11px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase', margin: '0 4px 7px' }}>
      {label}
    </div>
    <div className="list">{children}</div>
  </div>
)

const Reihe = ({ icon, title, meta, onClick, children }) => (
  <button className="list-row" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
      <span style={{ width: 30, textAlign: 'center', fontSize: 17, flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
    </span>
    {children || <span className="meta">{meta ? `${meta} ›` : '›'}</span>}
  </button>
)

export default function Settings() {
  const nav = useNavigate()
  const { settings, updateSettings, profile, patch, journal } = useStore()
  const [devTaps, setDevTaps] = useState(0)
  const devMode = devTaps >= 5
  const [updating, setUpdating] = useState(false)
  const [installHint, setInstallHint] = useState(false)
  const [, setInstallTick] = useState(0)
  useEffect(() => onInstallChange(() => setInstallTick((n) => n + 1)), [])

  // Holt die neueste App-Version: Service Worker + Cache verwerfen, frisch laden.
  // Tagebuch & Einstellungen (localStorage) bleiben dabei vollständig erhalten.
  const forceUpdate = async () => {
    setUpdating(true)
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.unregister()))
      }
      if (window.caches) {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      }
    } catch {
      /* auch bei Fehlern: neu laden holt zumindest frisches HTML */
    }
    window.location.reload()
  }

  // ---- Test-Werkzeuge (nur für die Erprobung, erreichbar über 5× Tippen auf die Version) ----
  const seedDemo = () => {
    const plan = [
      ['Liebe & Beziehungen', 'wuerfel', 'Ich habe heute an unser Gespräch gedacht.'],
      ['Liebe & Beziehungen', 'karten', 'Nähe fällt mir leichter, wenn ich ehrlich bin.'],
      ['Liebe & Beziehungen', 'runen', 'Ich möchte öfter zuhören statt zu antworten.'],
      ['Beruf & Berufung', 'wuerfel', 'Der Druck kommt mehr von mir als von außen.'],
      ['Beruf & Berufung', 'karten', 'Kleine Schritte reichen heute.'],
      ['Beruf & Berufung', 'runen', 'Ich darf Aufgaben auch abgeben.'],
      ['Selbstwert & innere Ruhe', 'wuerfel', 'Ich war heute freundlicher zu mir.'],
      ['Selbstwert & innere Ruhe', 'karten', ''],
      ['Veränderung & Neuanfang', 'runen', 'Etwas Altes darf enden.'],
      ['Dankbarkeit', 'wuerfel', 'Der Morgenkaffee auf dem Balkon.'],
      ['Kreativität', 'karten', ''],
      ['Loslassen', 'runen', 'Ich muss nicht alles festhalten.'],
      ['Entscheidungen & Klarheit', 'wuerfel', ''],
      ['Lernen & Wachstum', 'karten', 'Lernen fällt mir abends leichter.'],
    ]
    const entries = plan.map(([theme, ritual, reflection], i) => {
      const ts = Date.now() - (i + 1) * 86400000
      const msg = generateMessage({ name: profile.name, themes: [theme], mood: 1 + ((i * 2) % 5), ritual })
      return {
        id: `demo-${i}`, ts, iso: new Date(ts).toISOString().slice(0, 10),
        title: msg.title, symbol: msg.symbol, constellation: msg.constellation ?? null,
        theme, mantra: msg.mantra, text: msg.text, luck: msg.luck, energy: msg.energy,
        question: msg.reflection, ritual, archetype: msg.archetype ?? null,
        card: msg.card ?? null, runes: msg.runes ?? null,
        mood: 1 + ((i * 2) % 5), reflection,
      }
    })
    patch((s) => ({
      journal: [...entries, ...s.journal.filter((e) => !String(e.id).startsWith('demo-'))],
      stats: { ...s.stats, stardust: Math.max(s.stats.stardust, 140), streak: Math.max(s.stats.streak, 3) },
    }))
  }
  const simulateReturn = () => {
    const past = new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10)
    patch((s) => ({ stats: { ...s.stats, lastDrawISO: past }, seenReturnISO: null }))
    nav('/dashboard')
  }
  const timeShift = () => {
    const shift = (iso) => (iso ? new Date(new Date(iso + 'T12:00').getTime() - 86400000).toISOString().slice(0, 10) : iso)
    patch((s) => ({
      journal: s.journal.map((e) => ({ ...e, ts: e.ts - 86400000, iso: shift(e.iso) })),
      stats: { ...s.stats, lastDrawISO: shift(s.stats.lastDrawISO), moodTodayISO: shift(s.stats.moodTodayISO) },
      seenReturnISO: formatDate().iso,
    }))
  }

  const themenMeta = (profile.themes || []).length ? `${(profile.themes || []).length} von 3` : 'wählen'
  const kiAn = settings.aiMode && settings.aiConsent === true

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)' }}>
        <button className="back" onClick={() => nav('/profil')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 19 }}>Einstellungen</span>
      </div>

      <Gruppe label="Dein Profil">
        <Reihe icon="👤" title="Über dich" meta={profile.name || 'Name · Geburtstag'} onClick={() => nav('/profil/settings/du')} />
        <Reihe icon="✨" title="Deine Themen" meta={themenMeta} onClick={() => nav('/profil/settings/themen')} />
        <Reihe icon="🗣" title="Lunas Ton & Stil" meta={settings.tone} onClick={() => nav('/profil/settings/ton')} />
      </Gruppe>

      <Gruppe label="Luna & Botschaften">
        <Reihe icon="🔮" title="KI-Botschaften" meta={kiAn ? 'An' : 'Aus'} onClick={() => nav('/profil/settings/ki')} />
        <Reihe icon="🔔" title="Erinnerung" meta={settings.reminder ? `täglich ${settings.reminderTime || '21:00'}` : 'aus'} onClick={() => nav('/profil/erinnerung')} />
        <Reihe icon="🌙" title="„Luna erwacht“-Start">
          <span className={'toggle' + (settings.splash !== false ? ' on' : '')} onClick={(e) => { e.stopPropagation(); updateSettings({ splash: settings.splash === false }) }}>
            <span className="knob" />
          </span>
        </Reihe>
      </Gruppe>

      <Gruppe label="Plus & Käufe">
        <Reihe icon="✦" title="Sternenluna Plus"
          meta={settings.premium ? `aktiv${settings.plusUntilISO ? ` bis ${settings.plusUntilISO.split('-').reverse().join('.')}` : ''}` : 'ab 4,99 € / Monat'}
          onClick={() => nav('/profil/plus')} />
        <Reihe icon="🎟" title="Gutschein einlösen" onClick={() => nav('/profil/plus', { state: { coupon: true } })} />
      </Gruppe>

      <Gruppe label="Daten & Rechtliches">
        <Reihe icon="🔒" title="Daten & Privatsphäre" meta="Backup · Löschen" onClick={() => nav('/profil/privacy')} />
        <Reihe icon="§" title="Rechtliches" meta="Impressum · Kündigung" onClick={() => nav('/rechtliches')} />
        <Reihe icon="💬" title="Feedback senden" onClick={() => {
          const build = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'
          const body = `Hallo Marcel,\n\nmein Feedback zu Sternenluna:\n\n(Was gefällt dir? Was klemmt? Was fehlt?)\n\n—\nVersion: ${build}\nGerät: ${navigator.userAgent}`
          window.location.href = `mailto:ml@mittel-bar.com?subject=${encodeURIComponent('Sternenluna Feedback')}&body=${encodeURIComponent(body)}`
        }} />
      </Gruppe>

      <Gruppe label="App">
        {!isInstalled() && (
          <>
            <Reihe icon="📲" title="Als App installieren" meta="wichtig" onClick={() => (canPromptInstall() ? promptInstall() : setInstallHint(!installHint))} />
            {installHint && !canPromptInstall() && (
              <div style={{ padding: '4px 15px 13px 56px', color: 'var(--gold-1)', font: '500 12.5px/1.55 var(--font-body)' }}>
                {isIOS()
                  ? <>So geht’s: <b>Teilen-Symbol</b> (□↑) tippen → „<b>Zum Home-Bildschirm</b>“ wählen. Nur als
                    installierte App ist dein Tagebuch dauerhaft sicher.</>
                  : <>So geht’s: Browser-Menü (⋮) öffnen → „<b>App installieren</b>“ bzw. „Zum Startbildschirm hinzufügen“.</>}
              </div>
            )}
          </>
        )}
        <Reihe icon="↻" title={updating ? 'Aktualisiert …' : 'Nach Update suchen'} meta="Daten bleiben" onClick={updating ? undefined : forceUpdate} />
      </Gruppe>

      {/* Test-Werkzeuge — erscheinen nach 5× Tippen auf die Versionszeile */}
      {devMode && (
        <div className="glass" style={{ marginTop: 14, padding: '13px 15px', border: '1px dashed rgba(255,122,154,.5)' }}>
          <div style={{ color: 'var(--danger)', font: '600 11px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>🧪 Test-Werkzeuge · nur Demo</div>
          <button className="list-row" style={{ marginTop: 8, borderRadius: 12, background: 'rgba(255,255,255,.05)' }} onClick={seedDemo}>
            <span>📖 Demo-Tagebuch laden (14 Tage)</span><span className="meta">›</span>
          </button>
          <button className="list-row" style={{ marginTop: 6, borderRadius: 12, background: 'rgba(255,255,255,.05)' }} onClick={timeShift}>
            <span>⏪ Alles 1 Tag zurückdatieren</span><span className="meta">›</span>
          </button>
          <button className="list-row" style={{ marginTop: 6, borderRadius: 12, background: 'rgba(255,255,255,.05)' }} disabled={journal.length === 0} onClick={simulateReturn}>
            <span>💜 Rückkehr nach Pause simulieren</span><span className="meta">›</span>
          </button>
        </div>
      )}

      <div className="glass-purple" style={{ marginTop: 14, padding: '11px 13px' }}>
        <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.55 var(--font-body)' }}>
          Luna ist ein weiser Begleiter – kein Ersatz für Therapie. Wenn es dir schwer fällt, sprich mit einem Menschen.{' '}
          <b style={{ color: 'var(--text)', fontWeight: 600 }}>Telefonseelsorge: 0800 111 0 111</b>
        </div>
      </div>

      <div onClick={() => setDevTaps((n) => n + 1)} style={{ textAlign: 'center', color: '#8a83a6', font: '400 11px/1.6 var(--font-body)', paddingTop: 12, cursor: 'default', userSelect: 'none' }}>
        Sternenluna · v1.1 · local-first{devMode ? ' · 🧪' : ''}
        <br />Stand: {typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'}
      </div>
    </div>
  )
}
