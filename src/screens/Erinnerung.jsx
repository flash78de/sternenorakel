import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { asset } from '../lib/asset.js'

const WHEN = [
  { key: 'morgens', icon: '☀', label: 'Morgens', desc: 'Sanfter Start in den Tag', time: '08:00' },
  { key: 'mittags', icon: '🌤', label: 'Mittags', desc: 'Eine kleine Pause', time: '13:00' },
  { key: 'abends', icon: '🌙', label: 'Abends', desc: 'Zur Ruhe kommen', time: '21:00' },
  { key: 'aus', icon: '✦', label: 'Ohne', desc: 'Ich entscheide spontan', time: null },
]

const TONES = [
  { key: 'Sanft', state: 'idle', desc: 'Warm und einfühlsam' },
  { key: 'Poetisch', state: 'offenbarung', desc: 'Wie ein kleiner Sternenimpuls' },
  { key: 'Kurz & klar', state: 'lauschen', desc: 'Direkt und wertschätzend' },
]

export default function Erinnerung() {
  const nav = useNavigate()
  const { settings, updateSettings } = useStore()
  const [hint, setHint] = useState('')

  const when = settings.reminderWhen || 'abends'
  const [hh, mm] = (settings.reminderTime || '21:00').split(':')

  const setWhen = (w) => {
    const def = WHEN.find((x) => x.key === w)
    updateSettings({ reminderWhen: w, reminder: w !== 'aus', ...(def?.time ? { reminderTime: def.time } : {}) })
  }

  const bump = (field, delta, max) => {
    let h = Number(hh), m = Number(mm)
    if (field === 'h') h = (h + delta + 24) % 24
    else m = (m + delta + 60) % 60
    updateSettings({ reminderTime: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` })
  }

  const activate = async () => {
    let ok = true
    if ('Notification' in window && Notification.permission !== 'granted') {
      try { ok = (await Notification.requestPermission()) === 'granted' } catch { ok = false }
    }
    updateSettings({ reminder: ok && when !== 'aus' })
    setHint(ok ? 'Erinnerung aktiv. Luna meldet sich sanft – ganz ohne Druck.' : 'Benachrichtigungen sind nicht erlaubt. Du kannst sie in den Browsereinstellungen freigeben.')
  }

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/profil/settings')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Erinnerung</span>
      </div>

      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: 'var(--gold-1)', marginTop: 12 }}>
        Wann darf Luna dich erinnern?
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.5 var(--font-body)', marginTop: 6 }}>
        ✦ Sanft, nie aufdringlich – nur ein leiser Impuls für deinen Moment mit dir selbst.
      </div>

      {/* Zeitfenster */}
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {WHEN.map((w) => (
          <button key={w.key} onClick={() => setWhen(w.key)}
            style={{
              textAlign: 'left', cursor: 'pointer', borderRadius: 14, padding: '13px 14px',
              background: when === w.key ? 'rgba(166,107,255,.16)' : 'rgba(255,255,255,.04)',
              border: '1px solid ' + (when === w.key ? 'var(--gold-1)' : 'rgba(255,255,255,.1)'),
            }}>
            <div style={{ fontSize: 20 }}>{w.icon}</div>
            <div style={{ color: when === w.key ? 'var(--gold-1)' : 'var(--text)', font: '600 13px var(--font-body)', marginTop: 4 }}>{w.label}</div>
            <div style={{ color: 'var(--text-dim)', font: '400 10.5px/1.35 var(--font-body)', marginTop: 2 }}>{w.desc}</div>
          </button>
        ))}
      </div>

      {/* Uhrzeit */}
      {when !== 'aus' && (
        <div className="glass" style={{ marginTop: 12, padding: '14px 15px' }}>
          <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Uhrzeit</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <TimeCol value={hh} onUp={() => bump('h', 1)} onDown={() => bump('h', -1)} />
            <span style={{ color: 'var(--text)', font: '700 24px var(--font-body)' }}>:</span>
            <TimeCol value={mm} onUp={() => bump('m', 5)} onDown={() => bump('m', -5)} />
          </div>
          <div style={{ color: 'var(--text-dim)', font: '400 11px var(--font-body)', textAlign: 'center', marginTop: 8 }}>
            Wir erinnern dich nur, wenn es zu deinem Alltag passt.
          </div>
        </div>
      )}

      {/* Ton */}
      <div className="glass" style={{ marginTop: 12, padding: '14px 15px' }}>
        <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Ton & Stil der Erinnerung</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {TONES.map((t) => (
            <button key={t.key} onClick={() => updateSettings({ tone: t.key })}
              style={{
                flex: 1, cursor: 'pointer', borderRadius: 14, padding: '11px 8px', textAlign: 'center',
                background: settings.tone === t.key ? 'rgba(166,107,255,.16)' : 'rgba(10,10,31,.5)',
                border: '1px solid ' + (settings.tone === t.key ? 'var(--gold-1)' : 'rgba(167,139,250,.28)'),
              }}>
              <img src={asset(`uploads/opt/luna-${t.state}-transparent-sm.webp`)} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} />
              <div style={{ color: settings.tone === t.key ? 'var(--gold-1)' : 'var(--text)', font: '600 11.5px var(--font-body)', marginTop: 4 }}>{t.key}</div>
              <div style={{ color: 'var(--text-dim)', font: '400 9px/1.3 var(--font-body)', marginTop: 2 }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button className="btn-gold" style={{ marginTop: 14 }} onClick={activate}>
        🔔 Erinnerung aktivieren
      </button>
      <div style={{ textAlign: 'center', color: hint ? 'var(--gold-1)' : '#7a7494', font: '400 10.5px/1.45 var(--font-body)', marginTop: 8 }}>
        {hint || 'Du kannst das jederzeit in den Einstellungen ändern.'}
      </div>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 9.5px/1.4 var(--font-body)', marginTop: 6 }}>
        Hinweis: Browser-Erinnerungen funktionieren nur, wenn die App geöffnet bzw. installiert ist – zuverlässige tägliche Push-Nachrichten folgen später.
      </div>
    </div>
  )
}

function TimeCol({ value, onUp, onDown }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button className="back" style={{ transform: 'rotate(90deg)' }} onClick={onUp} aria-label="mehr">‹</button>
      <div style={{ width: 68, textAlign: 'center', background: 'rgba(10,10,31,.5)', border: '1px solid rgba(232,199,122,.25)', borderRadius: 12, padding: '10px 0', color: 'var(--text)', font: '700 24px var(--font-body)' }}>{value}</div>
      <button className="back" style={{ transform: 'rotate(-90deg)' }} onClick={onDown} aria-label="weniger">‹</button>
    </div>
  )
}
