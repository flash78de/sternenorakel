import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

// Anmeldung · local-first (Standard). Konto ist „derzeit nicht verfügbar".
export default function Auth() {
  const nav = useNavigate()
  const { onboarded } = useStore()

  const start = () => nav(onboarded ? '/dashboard' : '/onboarding', { replace: true })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 26px 30px' }}>
      <div className="statusbar" style={{ padding: 0, height: 30 }}>
        <span>9:41</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <Luna state="idle" width={150} glowSize={185} float />
      </div>
      <div className="title-lg" style={{ textAlign: 'center', marginTop: 4, fontSize: 24 }}>
        Dein Sternenband<br />gehört dir.
      </div>

      <div className="glass" style={{ marginTop: 18, padding: '16px 18px' }}>
        <div style={{ font: '600 11px var(--font-body)', letterSpacing: 1.5, color: 'var(--gold-1)', textTransform: 'uppercase', marginBottom: 6 }}>
          ☾ Local-first
        </div>
        <div style={{ color: 'var(--text)', font: '400 13.5px/1.55 var(--font-body)' }}>
          Alles bleibt auf deinem Gerät – kein Konto, keine E-Mail, keine Wolke. Nur du und Luna.
        </div>
      </div>

      <button className="btn-gold" style={{ marginTop: 16 }} onClick={start}>
        Ohne Konto starten
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 2px', color: '#7a7494', font: '500 12px var(--font-body)' }}>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.12)' }} />
        oder
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.12)' }} />
      </div>

      {/* Konto erstellen — ausgegraut */}
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
        <div style={{ color: '#7a7494', font: '400 11px var(--font-body)', marginTop: 4 }}>derzeit nicht verfügbar</div>
      </button>

      <div style={{ flex: 1 }} />
      <div style={{ color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', textAlign: 'center' }}>
        Du kannst später jederzeit ein Konto hinzufügen, um geräteübergreifend zu synchronisieren.
      </div>
    </div>
  )
}
