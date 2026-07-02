import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

// 03 · Tägliches Befinden — erscheint vor der ersten Tagesziehung.
// Fließt als Ton/Tiefe in die generierte Botschaft ein (profile.mood).
const MOODS = [
  { v: 5, label: 'Voller Energie', d: 'hell und offen' },
  { v: 4, label: 'Wach', d: 'aufmerksam, in Bewegung' },
  { v: 3, label: 'Ausgeglichen', d: 'ruhig in der Mitte' },
  { v: 2, label: 'Müde', d: 'gedämpft, ruhebedürftig' },
  { v: 1, label: 'Erschöpft', d: 'leer, kraftlos' },
]

export default function Befinden() {
  const nav = useNavigate()
  const { setMoodToday } = useStore()
  const [sel, setSel] = useState(null)

  const next = () => {
    if (sel == null) return
    setMoodToday(sel)
    nav('/oracle')
  }

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 22px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="back" onClick={() => nav('/dashboard')}>‹</button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 2 }}>
        <Luna state="idle" width={148} glowSize={186} float />
      </div>
      <div className="title-lg" style={{ textAlign: 'center', marginTop: 2, fontSize: 26 }}>
        Wie fühlst du<br />dich heute?
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 13.5px var(--font-body)', textAlign: 'center', marginTop: 8 }}>
        Ganz ehrlich – es gibt kein richtig oder falsch.
      </div>

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {MOODS.map((m) => {
          const on = sel === m.v
          return (
            <button
              key={m.v}
              onClick={() => setSel(m.v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 15, textAlign: 'left', cursor: 'pointer',
                borderRadius: 18, padding: '15px 17px',
                background: on ? 'linear-gradient(150deg,rgba(232,199,122,.18),rgba(232,199,122,.05))' : 'rgba(255,255,255,.04)',
                border: '1px solid ' + (on ? 'var(--gold-1)' : 'rgba(255,255,255,.1)'),
                boxShadow: on ? '0 8px 24px rgba(232,199,122,.14)' : 'none',
              }}
            >
              <span style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center',
                font: '700 17px var(--font-body)',
                background: on ? 'linear-gradient(135deg,#E8C77A,#D9B45A)' : 'transparent',
                border: on ? 'none' : '1.5px solid rgba(166,107,255,.5)',
                color: on ? 'var(--gold-ink)' : 'var(--purple-2)',
              }}>{m.v}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', color: on ? 'var(--gold-1)' : 'var(--text)', font: '700 16px var(--font-body)' }}>{m.label}</span>
                <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 12px var(--font-body)', marginTop: 2 }}>{m.d}</span>
              </span>
              {on && <span style={{ color: 'var(--gold-1)', fontSize: 16 }}>✦</span>}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, minHeight: 12 }} />
      <div style={{ color: '#7a7494', font: '400 10.5px/1.45 var(--font-body)', textAlign: 'center', marginBottom: 10 }}>
        Dein Befinden hilft Luna, Ton und Tiefe des Impulses anzupassen.
      </div>
      <button className="btn-gold" disabled={sel == null} onClick={next}>Weiter</button>
    </div>
  )
}
