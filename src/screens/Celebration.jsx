import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { CONSTELLATIONS } from '../data/library.js'
import { buzz } from '../lib/haptics.js'

// 22 · Feier-Screen — der Dopamin-Moment nach jedem vollendeten Ritual.
// Drei Stufen: Sternbild vollendet > Rangaufstieg > tägliche Vollendung.
// Belohnung wird ERLEBT (Konfetti, Hochzählen, Balken füllt sich), nicht nur angezeigt.

// Sternchen-Konfetti: deterministische Positionen/Verzögerungen (kein Math.random im Render)
const PARTS = [
  { left: '6%', delay: 0, size: 15, gold: true }, { left: '16%', delay: 1.1, size: 11, gold: false },
  { left: '26%', delay: 0.4, size: 13, gold: true }, { left: '36%', delay: 1.6, size: 10, gold: false },
  { left: '46%', delay: 0.8, size: 16, gold: true }, { left: '56%', delay: 0.2, size: 11, gold: false },
  { left: '66%', delay: 1.3, size: 14, gold: true }, { left: '76%', delay: 0.6, size: 10, gold: false },
  { left: '86%', delay: 1.9, size: 13, gold: true }, { left: '93%', delay: 0.9, size: 11, gold: false },
]

export default function Celebration() {
  const nav = useNavigate()
  const loc = useLocation()
  const { rank, stats } = useStore()
  const reward = loc.state?.reward

  const constObj = reward?.constellationName
    ? CONSTELLATIONS.find((c) => c.name === reward.constellationName)
    : null
  const isConst = Boolean(reward?.constellationName)
  const isRankUp = !isConst && Boolean(reward?.rankUp)

  // Sternenstaub zählt hoch (Belohnung erleben statt nur lesen)
  const target = reward?.gainedDust || 0
  const [shownDust, setShownDust] = useState(0)
  useEffect(() => {
    if (!target) return
    let i = 0
    const iv = setInterval(() => {
      i += 1
      setShownDust(i)
      if (i >= target) clearInterval(iv)
    }, Math.max(35, 700 / target))
    return () => clearInterval(iv)
  }, [target])

  // Fortschrittsbalken füllt sich sichtbar zum aktuellen Stand
  const [barW, setBarW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarW(Math.round(rank.progress * 100)), 250)
    return () => clearTimeout(t)
  }, [rank.progress])

  // Feier spürbar machen (Android; iOS ignoriert vibrate still)
  useEffect(() => {
    if (reward) buzz(isConst || isRankUp ? [30, 45, 30] : [20, 30, 20])
  }, [reward, isConst, isRankUp])

  if (!reward) return <Navigate to="/dashboard" replace />

  return (
    <div className="center-col" style={{ padding: '30px 26px', position: 'relative', overflow: 'hidden' }}>
      {/* Strahlenkranz */}
      <div className="anim-burst" style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg at 50% 40%,transparent 0deg,rgba(232,199,122,.12) 12deg,transparent 24deg,rgba(232,199,122,.1) 48deg,transparent 72deg,rgba(232,199,122,.12) 84deg,transparent 96deg)' }} />
      {/* Aufsteigendes Sternchen-Konfetti */}
      {PARTS.map((p, i) => (
        <span key={i} className="feier-part" aria-hidden="true" style={{
          left: p.left, fontSize: p.size, animationDelay: `${p.delay}s`,
          color: p.gold ? 'var(--gold-1)' : 'var(--purple-2)',
        }}>{p.gold ? '✦' : '✧'}</span>
      ))}

      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ color: 'var(--gold-1)', font: '600 12px var(--font-body)', letterSpacing: 2, textTransform: 'uppercase' }}>
          {isConst ? 'Sternbild vollendet!' : isRankUp ? 'Herzlichen Glückwunsch!' : 'Ritual vollendet ✦'}
        </div>

        <Luna state="freude" width="min(215px, 56vw)" glowSize={245} burst style={{ marginTop: 10 }} />

        {isConst ? (
          <>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 27, color: 'var(--gold-1)', marginTop: 8, textShadow: '0 2px 18px rgba(232,199,122,.45)' }}>
              {constObj ? <>{constObj.glyph} {constObj.name}</> : 'Sternbild vollendet!'}
            </div>
            <div style={{ color: 'var(--text)', font: '400 14px/1.55 var(--font-body)', marginTop: 8, maxWidth: 270 }}>
              {constObj?.motto ? <>Sternbild „{constObj.motto}" – entstanden aus deinen festgehaltenen Reflexionen. ✦</> : 'Du hast ein Sternbild vollendet – ich bin so stolz auf dich. ✦'}
            </div>
          </>
        ) : isRankUp ? (
          <>
            <div style={{ color: 'var(--text)', font: '400 15px var(--font-body)', marginTop: 6 }}>Du bist jetzt</div>
            <div className="pop" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 30, color: 'var(--gold-1)', textShadow: '0 2px 18px rgba(232,199,122,.45)', marginTop: 2 }}>
              {reward.rankUp}
            </div>
          </>
        ) : (
          <>
            <div className="pop" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 40, color: 'var(--gold-1)', marginTop: 6, textShadow: '0 2px 22px rgba(232,199,122,.55)' }}>
              +{shownDust} ✦
            </div>
            <div style={{ color: 'var(--text)', font: '400 13.5px/1.5 var(--font-body)', marginTop: 6, maxWidth: 270 }}>
              Sternenstaub gesammelt – dein heutiger Lichtpunkt leuchtet in deinem Sternenband.
            </div>
          </>
        )}

        {/* Fortschrittsbalken zum nächsten Rang — füllt sich animiert */}
        <div style={{ width: 220, margin: '18px auto 0' }}>
          <div className="bar" style={{ height: 8, overflow: 'hidden' }}>
            <div className="fill" style={{ width: `${barW}%` }} />
          </div>
          <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginTop: 7 }}>
            {rank.next ? <>Noch {rank.toNext} ✦ bis {rank.next.name}</> : <>Höchste Stufe erreicht ✦</>}
          </div>
        </div>

        {/* Belohnungs-Chips */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
          {/* Staub-Chip nur bei Sternbild/Rangaufstieg – im Tagesmodus zählt die große Zahl */}
          {(isConst || isRankUp) && reward.gainedDust > 0 && (
            <div style={{ background: 'rgba(232,199,122,.12)', border: '1px solid rgba(232,199,122,.3)', borderRadius: 14, padding: '10px 14px' }}>
              <div style={{ color: 'var(--gold-1)', font: '700 15px var(--font-body)' }}>+{reward.gainedDust} ✦</div>
              <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)', marginTop: 2 }}>Sternenstaub</div>
            </div>
          )}
          {(reward.newStreak > 0 || stats.streak > 0) && (
            <div className="pop" style={{ background: 'rgba(166,107,255,.14)', border: '1px solid rgba(166,107,255,.3)', borderRadius: 14, padding: '10px 14px', animationDelay: '.35s' }}>
              <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>★ {reward.newStreak || stats.streak} {(reward.newStreak || stats.streak) === 1 ? 'Tag' : 'Tage'}</div>
              <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)', marginTop: 2 }}>Serie</div>
            </div>
          )}
        </div>

        <button className="btn-gold" style={{ marginTop: 22, width: 'auto', padding: '14px 30px' }} onClick={() => nav('/dashboard', { replace: true })}>
          Weiterleuchten ✦
        </button>
        {isConst && (
          <button className="link-soft" style={{ marginTop: 12 }} onClick={() => nav('/profil/sternbilder', { replace: true })}>
            Meine Sternbilder ansehen
          </button>
        )}
      </div>
    </div>
  )
}
