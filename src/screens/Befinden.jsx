import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

// 03 · Tägliches Befinden — erscheint vor der ersten Tagesziehung.
// Fließt als Ton/Tiefe in die generierte Botschaft ein (profile.mood).
const MOODS = [
  { v: 5, label: 'Voller Energie', d: 'Hell, offen und bereit, etwas zu bewegen.' },
  { v: 4, label: 'Wach', d: 'Aufmerksam, präsent und innerlich in Bewegung.' },
  { v: 3, label: 'Ausgeglichen', d: 'Ruhig, stabil und ungefähr in deiner Mitte.' },
  { v: 2, label: 'Müde', d: 'Gedämpft, langsam und mit dem Wunsch nach Ruhe.' },
  { v: 1, label: 'Erschöpft', d: 'Kraftlos, leer oder gerade besonders empfindsam.' },
]

export default function Befinden() {
  const nav = useNavigate()
  const { profile, setMoodToday } = useStore()
  const [sel, setSel] = useState(null)

  const next = () => {
    if (sel == null) return
    setMoodToday(sel)
    nav('/oracle')
  }

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/dashboard')}>‹</button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 2 }}>
        <Luna state="idle" width={116} glowSize={150} float />
      </div>
      <div className="title-lg" style={{ textAlign: 'center', marginTop: 2 }}>
        Wie fühlst du<br />dich heute{profile.name ? `, ${profile.name}` : ''}?
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOODS.map((m) => {
          const on = sel === m.v
          return (
            <button
              key={m.v}
              onClick={() => setSel(m.v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer',
                borderRadius: 16, padding: '13px 15px',
                background: on ? 'rgba(166,107,255,.16)' : 'rgba(255,255,255,.04)',
                border: '1px solid ' + (on ? 'var(--gold-1)' : 'rgba(255,255,255,.1)'),
              }}
            >
              <span style={{
                width: 34, height: 34, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center',
                font: '700 15px var(--font-body)',
                background: on ? 'linear-gradient(135deg,#E8C77A,#D9B45A)' : 'rgba(255,255,255,.06)',
                color: on ? 'var(--gold-ink)' : 'var(--text-dim)',
              }}>{m.v}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', color: on ? 'var(--gold-1)' : 'var(--text)', font: '600 14px var(--font-body)' }}>{m.label}</span>
                <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 11.5px/1.4 var(--font-body)', marginTop: 1 }}>{m.d}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div style={{ color: '#7a7494', font: '400 11px/1.5 var(--font-body)', textAlign: 'center', marginTop: 12 }}>
        Dein heutiges Befinden hilft Luna, Ton und Tiefe des Impulses anzupassen.
      </div>

      <div style={{ flex: 1, minHeight: 10 }} />
      <button className="btn-gold" disabled={sel == null} onClick={next}>Weiter</button>
    </div>
  )
}
