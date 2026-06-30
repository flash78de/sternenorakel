import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'

export default function Settings() {
  const nav = useNavigate()
  const { settings, updateSettings, profile } = useStore()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 18px', overflowY: 'auto' }} className="screen-scroll">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)' }}>
        <button className="back" onClick={() => nav('/profil')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 18 }}>Einstellungen</span>
      </div>

      {/* Tägliche Erinnerung */}
      <div style={{ marginTop: 14, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <img src="/uploads/luna-schlaf-transparent.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>Tägliche Erinnerung</div>
          <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginTop: 1 }}>
            Jeden Abend um <b style={{ color: 'var(--gold-1)' }}>{settings.reminderTime}</b>
          </div>
        </div>
        <span className={'toggle' + (settings.reminder ? ' on' : '')} onClick={() => updateSettings({ reminder: !settings.reminder })}>
          <span className="knob" />
        </span>
      </div>

      {/* Themen & Stimmung */}
      <div className="list" style={{ marginTop: 12 }}>
        <div className="list-row" style={{ cursor: 'default' }}>
          <span>Themen</span>
          <span className="meta">{profile.themes?.length ? profile.themes.slice(0, 2).join(' · ') : 'Keine'} ›</span>
        </div>
        <div className="list-row" style={{ cursor: 'default' }}>
          <span>Stimmung &amp; Ton</span>
          <span className="meta">{settings.tone} ›</span>
        </div>
      </div>

      {/* Premium */}
      <div style={{ marginTop: 12, background: 'linear-gradient(150deg,rgba(232,199,122,.2),rgba(232,199,122,.05))', border: '1px solid rgba(232,199,122,.4)', borderRadius: 18, padding: '14px 16px', boxShadow: '0 8px 26px rgba(232,199,122,.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--gold-1)', fontSize: 16 }}>✦</span>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 16, color: 'var(--gold-1)' }}>Sternenorakel Plus</span>
        </div>
        <div style={{ marginTop: 8, color: 'var(--text)', font: '400 12px/1.7 var(--font-body)' }}>
          Tiefere Botschaften · alle Sternbilder · unbegrenztes Tagebuch · Luna-Themes
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-dim)', font: '500 12px var(--font-body)' }}>
            <b style={{ color: 'var(--text)', fontSize: 16 }}>3,99 €</b> / Monat
          </span>
          <button style={{ background: 'linear-gradient(135deg,#E8C77A,#D9B45A)', color: 'var(--gold-ink)', font: '700 12px var(--font-body)', padding: '9px 18px', borderRadius: 12, border: 'none', boxShadow: '0 6px 16px rgba(232,199,122,.3)', cursor: 'pointer' }}>
            Plus entdecken
          </button>
        </div>
      </div>

      {/* Privatsphäre */}
      <button className="list-row" style={{ marginTop: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16 }} onClick={() => nav('/profil/privacy')}>
        <span>🔒 Daten &amp; Privatsphäre</span>
        <span className="meta">Export · Löschen ›</span>
      </button>

      {/* Therapie-Hinweis */}
      <div className="glass-purple" style={{ marginTop: 12, padding: '11px 13px' }}>
        <div style={{ color: 'var(--gold-1)', font: '600 11px var(--font-body)', marginBottom: 3 }}>Ein ehrliches Wort von Luna</div>
        <div style={{ color: 'var(--text-dim)', font: '400 11px/1.5 var(--font-body)' }}>
          Ich bin ein weiser Begleiter – kein Ersatz für Therapie. Wenn es dir schwer fällt, sprich mit einem Menschen.{' '}
          <b style={{ color: 'var(--text)', fontWeight: 600 }}>Telefonseelsorge: 0800 111 0 111</b>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10px var(--font-body)', paddingTop: 8 }}>
        Sternenorakel · v1.0 · local-first
      </div>
    </div>
  )
}
