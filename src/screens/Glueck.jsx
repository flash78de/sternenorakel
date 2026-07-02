import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { GLUECKSELEMENTE } from '../data/generator.js'

// Glückselemente-Sammlung — wie Abzeichen: erreichte sichtbar (mit Zähler),
// unerreichte als verborgene Plätze. Abgeleitet aus dem Tagebuch (local-first).
export default function Glueck() {
  const nav = useNavigate()
  const { journal } = useStore()
  const [detail, setDetail] = useState(null)

  const counts = useMemo(() => {
    const c = {}
    for (const e of journal) if (e.luck) c[e.luck] = (c[e.luck] || 0) + 1
    return c
  }, [journal])

  const found = GLUECKSELEMENTE.filter((g) => counts[g.name]).length

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Meine Glückselemente</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: 'var(--gold-1)' }}>
          {found} / {GLUECKSELEMENTE.length} gefunden
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.5 var(--font-body)', marginTop: 6, fontStyle: 'italic' }}>
          Jede Botschaft bringt ein Glückselement mit – kleine Erinnerungsanker deines Weges.
        </div>
      </div>

      {/* Grid: erreichte leuchten, unerreichte bleiben verborgen */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {GLUECKSELEMENTE.map((g) => {
          const n = counts[g.name] || 0
          const unlocked = n > 0
          return (
            <button
              key={g.name}
              onClick={() => unlocked && setDetail({ ...g, n })}
              style={{
                textAlign: 'center', cursor: unlocked ? 'pointer' : 'default', border: 'none', background: 'none', padding: 0,
              }}
            >
              <div style={{
                aspectRatio: '1', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, position: 'relative',
                background: unlocked
                  ? 'radial-gradient(circle at 50% 35%,rgba(232,199,122,.28),rgba(40,30,70,.5) 70%)'
                  : 'rgba(255,255,255,.03)',
                border: '1px solid ' + (unlocked ? 'rgba(232,199,122,.45)' : 'rgba(255,255,255,.08)'),
                boxShadow: unlocked ? '0 0 18px rgba(232,199,122,.2)' : 'none',
              }}>
                {unlocked ? g.glyph : <span style={{ color: '#4e496a', fontSize: 22 }}>?</span>}
                {n > 1 && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6, minWidth: 20, height: 20, borderRadius: 10, padding: '0 5px',
                    background: 'linear-gradient(135deg,#E8C77A,#D9B45A)', color: 'var(--gold-ink)',
                    font: '700 10.5px/20px var(--font-body)',
                  }}>{n}×</span>
                )}
              </div>
              <div style={{ font: `${unlocked ? 600 : 500} 10px/1.3 var(--font-body)`, color: unlocked ? 'var(--text)' : '#7a7494', marginTop: 5, minHeight: 26 }}>
                {unlocked ? g.name : 'noch verborgen'}
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: 14, color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', textAlign: 'center' }}>
        {found < GLUECKSELEMENTE.length
          ? <>Noch <b style={{ color: 'var(--gold-1)' }}>{GLUECKSELEMENTE.length - found}</b> Elemente warten darauf, dir zu begegnen.</>
          : 'Du hast alle Glückselemente gefunden ✦ – sie begleiten dich weiter.'}
      </div>

      <div style={{ flex: 1, minHeight: 12 }} />
      <button className="btn-gold" onClick={() => nav('/oracle')}>✦ Heute weitersammeln</button>

      {/* Detail-Ansicht eines gefundenen Elements */}
      {detail && (
        <div className="overlay" onClick={() => setDetail(null)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()} style={{ paddingTop: 26, textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>{detail.glyph}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 20, color: 'var(--gold-1)', marginTop: 8 }}>{detail.name}</div>
            <div style={{ color: 'var(--purple-2)', font: '600 11px var(--font-body)', marginTop: 4 }}>{detail.n}× erhalten</div>
            <div style={{ color: 'var(--text-dim)', font: '400 13px/1.6 var(--font-body)', marginTop: 12 }}>{detail.bedeutung}</div>
            <button className="link-soft" style={{ marginTop: 16 }} onClick={() => setDetail(null)}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  )
}
