import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { CONSTELLATIONS, constellationProgress } from '../data/library.js'

// 21 · Symbol-Sammlung / Sternbilder (0/12) — FOMO & Sammel-Motivation
export default function Sternbilder() {
  const nav = useNavigate()
  const { stats } = useStore()
  const { total, done, daysToNext, next } = constellationProgress(stats.constellationsDone, stats.streak)

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/profil')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Meine Sternbilder</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: 'var(--gold-1)' }}>
          {done} / {total} gesammelt
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.5 var(--font-body)', marginTop: 6, fontStyle: 'italic' }}>
          Jedes vollendete 7-Tage-Band schenkt dir ein neues Sternbild.
        </div>
      </div>

      {/* FOMO: nächstes Sternbild */}
      {next && (
        <div className="glass" style={{ marginTop: 14, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle,rgba(106,59,232,.4),rgba(40,30,70,.5))', border: '1px solid rgba(232,199,122,.3)', color: 'var(--gold-1)', fontSize: 22 }}>
            {next.glyph}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>Als Nächstes: {next.name}</div>
            <div style={{ color: 'var(--purple-2)', font: '600 11px var(--font-body)', marginTop: 2 }}>
              Noch {daysToNext} {daysToNext === 1 ? 'Tag' : 'Tage'} bis es leuchtet ✦
            </div>
          </div>
        </div>
      )}

      {/* Sammlung */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {CONSTELLATIONS.map((c, i) => {
          const unlocked = i < done
          const isNext = i === done
          return (
            <div key={c.name} style={{ textAlign: 'center' }}>
              <div style={{
                aspectRatio: '1', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30,
                background: unlocked
                  ? 'radial-gradient(circle at 50% 35%,rgba(232,199,122,.28),rgba(40,30,70,.5) 70%)'
                  : 'rgba(255,255,255,.03)',
                border: '1px solid ' + (unlocked ? 'rgba(232,199,122,.45)' : isNext ? 'rgba(166,107,255,.5)' : 'rgba(255,255,255,.08)'),
                color: unlocked ? 'var(--gold-1)' : '#4e496a',
                boxShadow: unlocked ? '0 0 18px rgba(232,199,122,.2)' : 'none',
              }}>
                {unlocked ? c.glyph : isNext ? '✦' : '🔒'}
              </div>
              <div style={{ font: `${unlocked ? 600 : 500} 10px var(--font-body)`, color: unlocked ? 'var(--text)' : '#7a7494', marginTop: 5 }}>
                {unlocked ? c.name : isNext ? 'in Kürze' : '???'}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, minHeight: 12 }} />
      <button className="btn-gold" style={{ marginTop: 14 }} onClick={() => nav('/oracle')}>
        ✦ Heute weitersammeln
      </button>
    </div>
  )
}
