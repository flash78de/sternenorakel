import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LunaAvatar } from '../components/Luna.jsx'

// 08 · Zukunfts-Variante — Konto & Sync (passwortloser Magic Link).
// Bewusst „wire-ahead": demonstriert die spätere Cloud-Option (kein echtes Backend).
const VORTEILE = [
  { glyph: '📖', title: 'Tagebuch auf allen Geräten', desc: 'Deine Botschaften und Notizen überall dabei.' },
  { glyph: '🛡', title: 'Backup & Sicherheit', desc: 'Nichts geht verloren, wenn das Gerät wechselt.' },
  { glyph: '✦', title: 'Ohne Passwort', desc: 'Ein magischer Link genügt – nichts zu merken.' },
]

export default function AccountVariant() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [sync, setSync] = useState(true)
  const [sent, setSent] = useState(false)

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 26px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 18 }}>Konto &amp; Sync</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <LunaAvatar size={74} />
      </div>

      <div className="title-lg" style={{ textAlign: 'center', fontSize: 22, lineHeight: 1.2, color: 'var(--gold-1)', textShadow: '0 2px 16px rgba(232,199,122,.35)' }}>
        Synchronisierung für<br />mehr Sicherheit
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 13px/1.5 var(--font-body)', textAlign: 'center', marginTop: 8 }}>
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

      <div className="glass-purple" style={{ marginTop: 12, padding: '13px 15px', color: 'var(--text-dim)', font: '400 12.5px/1.5 var(--font-body)' }}>
        ✦ Passwortlos: Wir senden dir einen <b style={{ color: 'var(--text)', fontWeight: 600 }}>Magic Link</b> – kein Passwort nötig.
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '10px 12px' }}>
        <span style={{ color: '#7a7494', fontSize: 13 }}>ⓘ</span>
        <div style={{ color: '#7a7494', font: '400 10.5px/1.45 var(--font-body)' }}>
          <b style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Demo:</b> Konto &amp; Sync sind eine Vorschau – es wird noch keine echte E-Mail versendet und nichts in eine Cloud übertragen.
        </div>
      </div>

      {/* Vorteile */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {VORTEILE.map((v) => (
          <div key={v.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 38, height: 38, flexShrink: 0, borderRadius: 11, display: 'grid', placeItems: 'center',
              fontSize: 17, background: 'rgba(232,199,122,.12)', border: '1px solid rgba(232,199,122,.3)',
            }}>{v.glyph}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', color: 'var(--text)', font: '600 13px var(--font-body)' }}>{v.title}</span>
              <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 11.5px/1.4 var(--font-body)', marginTop: 1 }}>{v.desc}</span>
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
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
        <span>Gerätesynchronisierung aktivieren</span>
        <span className={'toggle' + (sync ? ' on' : '')} onClick={() => setSync((v) => !v)}>
          <span className="knob" />
        </span>
      </div>

      <button
        className="btn-gold"
        style={{ marginTop: 18 }}
        disabled={!email.includes('@') || !sync}
        onClick={() => setSent(true)}
      >
        {sent ? 'Magic Link gesendet ✓' : 'Sync aktivieren'}
      </button>
      {sent && (
        <div style={{ marginTop: 10, color: 'var(--gold-1)', font: '500 12px var(--font-body)', textAlign: 'center' }}>
          Prüfe dein Postfach – tippe auf den Link, um fortzufahren.
        </div>
      )}

      <div style={{ flex: 1, minHeight: 14 }} />
      <div style={{ color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', textAlign: 'center' }}>
        🔒 Später verschlüsselt übertragen und geschützt gespeichert. Du kannst jederzeit bei local-first bleiben.
      </div>
    </div>
  )
}
