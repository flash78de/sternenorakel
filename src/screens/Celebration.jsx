import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { CONSTELLATIONS } from '../data/library.js'

// 22 · Rangaufstieg / Sternbild vollendet — eigener Belohnungs-Screen mit Visualisierung
export default function Celebration() {
  const nav = useNavigate()
  const loc = useLocation()
  const { rank } = useStore()
  const reward = loc.state?.reward

  if (!reward) return <Navigate to="/dashboard" replace />

  const isRankUp = Boolean(reward.rankUp) && !reward.constellationName
  const constObj = reward.constellationName
    ? CONSTELLATIONS.find((c) => c.name === reward.constellationName)
    : null

  return (
    <div className="center-col" style={{ padding: '30px 26px', position: 'relative', overflow: 'hidden' }}>
      {/* Strahlenkranz */}
      <div className="anim-burst" style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg at 50% 40%,transparent 0deg,rgba(232,199,122,.12) 12deg,transparent 24deg,rgba(232,199,122,.1) 48deg,transparent 72deg,rgba(232,199,122,.12) 84deg,transparent 96deg)' }} />

      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ color: 'var(--gold-1)', font: '600 12px var(--font-body)', letterSpacing: 2, textTransform: 'uppercase' }}>
          {isRankUp ? 'Herzlichen Glückwunsch!' : 'Sternbild vollendet!'}
        </div>

        <Luna state="freude" width="min(215px, 56vw)" glowSize={245} burst style={{ marginTop: 10 }} />

        {isRankUp ? (
          <>
            <div style={{ color: 'var(--text)', font: '400 15px var(--font-body)', marginTop: 6 }}>Du bist jetzt</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 30, color: 'var(--gold-1)', textShadow: '0 2px 18px rgba(232,199,122,.45)', marginTop: 2 }}>
              {reward.rankUp}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 27, color: 'var(--gold-1)', marginTop: 8, textShadow: '0 2px 18px rgba(232,199,122,.45)' }}>
              {constObj ? <>{constObj.glyph} {constObj.name}</> : 'Sternbild vollendet!'}
            </div>
            <div style={{ color: 'var(--text)', font: '400 14px/1.55 var(--font-body)', marginTop: 8, maxWidth: 270 }}>
              {constObj?.motto ? <>Sternbild „{constObj.motto}" – entstanden aus deinen festgehaltenen Reflexionen. ✦</> : 'Du hast ein Sternbild vollendet – ich bin so stolz auf dich. ✦'}
            </div>
          </>
        )}

        {/* Fortschrittsbalken zum nächsten Rang */}
        <div style={{ width: 220, margin: '18px auto 0' }}>
          <div className="bar" style={{ height: 8, overflow: 'hidden' }}>
            <div className="fill" style={{ width: `${Math.round(rank.progress * 100)}%` }} />
          </div>
          <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginTop: 7 }}>
            {rank.next ? <>Noch {rank.toNext} ✦ bis {rank.next.name}</> : <>Höchste Stufe erreicht ✦</>}
          </div>
        </div>

        {/* Belohnungs-Chips */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
          {reward.gainedDust > 0 && (
            <div style={{ background: 'rgba(232,199,122,.12)', border: '1px solid rgba(232,199,122,.3)', borderRadius: 14, padding: '10px 14px' }}>
              <div style={{ color: 'var(--gold-1)', font: '700 15px var(--font-body)' }}>+{reward.gainedDust} ✦</div>
              <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)', marginTop: 2 }}>Sternenstaub</div>
            </div>
          )}
          {reward.newStreak > 0 && (
            <div style={{ background: 'rgba(166,107,255,.14)', border: '1px solid rgba(166,107,255,.3)', borderRadius: 14, padding: '10px 14px' }}>
              <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>{reward.newStreak} Tage</div>
              <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)', marginTop: 2 }}>Serie</div>
            </div>
          )}
        </div>

        <button className="btn-gold" style={{ marginTop: 22, width: 'auto', padding: '14px 30px' }} onClick={() => nav('/dashboard', { replace: true })}>
          Weiterleuchten ✦
        </button>
        {!isRankUp && (
          <button className="link-soft" style={{ marginTop: 12 }} onClick={() => nav('/profil/sternbilder', { replace: true })}>
            Meine Sternbilder ansehen
          </button>
        )}
      </div>
    </div>
  )
}
