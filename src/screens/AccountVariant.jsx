import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LunaAvatar } from '../components/Luna.jsx'

// Zukunfts-Variante — Konto & Sync (passwortloser magischer Link).
// Bewusst „wire-ahead": demonstriert die spätere Cloud-Option.
export default function AccountVariant() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [sync, setSync] = useState(true)
  const [sent, setSent] = useState(false)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 26px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 18 }}>Konto &amp; Sync</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <LunaAvatar size={78} />
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 13px/1.5 var(--font-body)', textAlign: 'center' }}>
        Sichere dein Sternenband und nutze es auf mehreren Geräten.
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ color: '#7a7494', font: '500 11px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 7 }}>
          E-Mail
        </div>
        <input
          className="field"
          style={{ fontSize: 14, padding: '15px 16px' }}
          type="email"
          placeholder="name@beispiel.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="glass-purple" style={{ marginTop: 14, padding: '13px 15px', color: 'var(--text-dim)', font: '400 12.5px/1.5 var(--font-body)' }}>
        ✦ Passwortlos: Wir senden dir einen <b style={{ color: 'var(--text)', fontWeight: 600 }}>magischen Link</b> – kein
        Passwort nötig.
      </div>

      <div
        style={{
          marginTop: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(255,255,255,.1)',
          borderRadius: 14,
          padding: '13px 16px',
          color: 'var(--text)',
          font: '500 13.5px var(--font-body)',
        }}
      >
        <span>Geräte synchronisieren</span>
        <span className={'toggle' + (sync ? ' on' : '')} onClick={() => setSync((v) => !v)}>
          <span className="knob" />
        </span>
      </div>

      <button
        className="btn-gold"
        style={{ marginTop: 18 }}
        disabled={!email.includes('@')}
        onClick={() => setSent(true)}
      >
        {sent ? 'Magischer Link gesendet ✓' : 'Sync aktivieren'}
      </button>
      {sent && (
        <div style={{ marginTop: 10, color: 'var(--gold-1)', font: '500 12px var(--font-body)', textAlign: 'center' }}>
          Prüfe dein Postfach – tippe auf den Link, um fortzufahren.
        </div>
      )}

      <div style={{ flex: 1 }} />
      <div style={{ color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', textAlign: 'center' }}>
        🔒 Ende-zu-Ende verschlüsselt. Du kannst jederzeit zu local-first zurück.
      </div>
    </div>
  )
}
