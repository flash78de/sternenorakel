import Luna from './Luna.jsx'

// Belohnungs-Popup: Sternbild vollendet und/oder Rang-Aufstieg.
// Ehrlich, kein Lootbox-Druck – nur Würdigung der Gewohnheit.
export default function RewardModal({ reward, onClose }) {
  if (!reward) return null
  const { constellation, rankUp, gainedDust, newStreak } = reward

  const title = constellation ? `Tag ${newStreak}!` : rankUp ? 'Ein neuer Rang!' : 'Schön gemacht!'
  const sub = constellation
    ? 'Du hast ein Sternbild vollendet – ich bin so stolz auf dich. ✦'
    : rankUp
    ? `Dein Sternenband wächst. Willkommen als ${rankUp}.`
    : 'Deine Botschaft ist sicher im Tagebuch.'

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal pop" style={{ paddingTop: 64 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: 'absolute', top: -78, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <Luna state="freude" width={150} glowSize={170} float />
        </div>

        <div className="title-xl" style={{ fontSize: 27 }}>{title}</div>
        <div style={{ color: 'var(--text)', font: '400 14px/1.5 var(--font-body)', marginTop: 8 }}>{sub}</div>

        {constellation && (
          <div style={{ margin: '18px auto 0', width: 150, height: 74 }}>
            <svg viewBox="0 0 150 74" width="150" height="74">
              <polyline points="14,52 44,20 74,40 104,14 136,46" fill="none" stroke="rgba(232,199,122,.5)" strokeWidth="1.5" />
              {[[14, 52], [44, 20], [74, 40], [104, 14], [136, 46]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="#E8C77A" />
              ))}
            </svg>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          {gainedDust > 0 && (
            <div style={{ flex: 1, background: 'rgba(232,199,122,.12)', border: '1px solid rgba(232,199,122,.3)', borderRadius: 14, padding: 11 }}>
              <div style={{ color: 'var(--gold-1)', font: '700 16px var(--font-body)' }}>+{gainedDust} ✦</div>
              <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)', marginTop: 2 }}>Sternenstaub</div>
            </div>
          )}
          {rankUp && (
            <div style={{ flex: 1.3, background: 'rgba(166,107,255,.14)', border: '1px solid rgba(166,107,255,.3)', borderRadius: 14, padding: 11 }}>
              <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>{rankUp}</div>
              <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)', marginTop: 2 }}>Neuer Rang</div>
            </div>
          )}
        </div>

        <button className="btn-gold" style={{ marginTop: 18 }} onClick={onClose}>
          Weitersammeln
        </button>
      </div>
    </div>
  )
}
