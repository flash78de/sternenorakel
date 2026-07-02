import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

// 07 · Anmeldung — local-first (Standard). Konto/Cloud ist „derzeit nicht verfügbar".
export default function Auth() {
  const nav = useNavigate()
  const { onboarded } = useStore()

  const start = () => nav(onboarded ? '/dashboard' : '/onboarding', { replace: true })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 26px 30px' }}>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Luna state="idle" width={140} glowSize={175} float />
      </div>

      <div className="title-lg" style={{ textAlign: 'center', marginTop: 6, fontSize: 25, lineHeight: 1.15, color: 'var(--gold-1)', textShadow: '0 2px 16px rgba(232,199,122,.35)' }}>
        Dein Sternenband<br />gehört dir.
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 13.5px/1.55 var(--font-body)', textAlign: 'center', marginTop: 10, padding: '0 6px' }}>
        Kein Konto, keine E-Mail. Alles bleibt auf deinem Gerät.
      </div>

      {/* Zwei Info-Karten: Privat · Lokal */}
      <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
        <div className="glass" style={{ flex: 1, padding: '14px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, color: 'var(--gold-1)' }}>🕊</div>
          <div style={{ font: '600 12.5px var(--font-body)', color: 'var(--text)', marginTop: 6 }}>Privat</div>
          <div style={{ color: 'var(--text-dim)', font: '400 11px/1.45 var(--font-body)', marginTop: 3 }}>
            Niemand liest mit – auch wir nicht.
          </div>
        </div>
        <div className="glass" style={{ flex: 1, padding: '14px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, color: 'var(--gold-1)' }}>☾</div>
          <div style={{ font: '600 12.5px var(--font-body)', color: 'var(--text)', marginTop: 6 }}>Lokal</div>
          <div style={{ color: 'var(--text-dim)', font: '400 11px/1.45 var(--font-body)', marginTop: 3 }}>
            Alles wird nur auf diesem Gerät gespeichert.
          </div>
        </div>
      </div>

      <button className="btn-gold" style={{ marginTop: 20 }} onClick={start}>
        Ohne Konto starten
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 2px', color: '#7a7494', font: '500 12px var(--font-body)' }}>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.12)' }} />
        oder
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.12)' }} />
      </div>

      {/* Konto erstellen · Cloud-Sync — ausgegraut, Vorschau der Zukunfts-Variante */}
      <button
        onClick={() => nav('/auth/account')}
        style={{
          background: 'rgba(255,255,255,.02)',
          border: '1px solid rgba(255,255,255,.06)',
          borderRadius: 16,
          padding: '13px 16px',
          opacity: 0.55,
          textAlign: 'left',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', font: '500 13.5px var(--font-body)' }}>
          <span>☁ Konto erstellen · Cloud-Sync</span>
          <span style={{ fontSize: 13 }}>🔒</span>
        </div>
        <div style={{ color: '#7a7494', font: '400 11px var(--font-body)', marginTop: 4 }}>
          Cloud-Sync später · derzeit nicht verfügbar
        </div>
      </button>

      <div style={{ flex: 1 }} />
      <div style={{ color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', textAlign: 'center' }}>
        Du kannst später jederzeit ein Konto hinzufügen, um geräteübergreifend zu synchronisieren.
      </div>
    </div>
  )
}
