import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { RANKS } from '../data/library.js'

// 16/17 · Sternenband / Rang-Leiter — Level anklickbar, Aufstiegslogik sichtbar
export default function RankLadder() {
  const nav = useNavigate()
  const { stats, rank } = useStore()

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/profil')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Dein Sternenband</span>
      </div>

      {/* aktueller Stand */}
      <div className="glass" style={{ marginTop: 12, padding: '16px 16px', textAlign: 'center' }}>
        <div style={{ color: 'var(--purple-2)', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Dein Rang</div>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 24, color: 'var(--gold-1)', marginTop: 4 }}>
          {rank.rank} · Lvl {rank.level}
        </div>
        <div className="bar" style={{ marginTop: 12, height: 9, overflow: 'hidden' }}>
          <div className="fill" style={{ width: `${Math.round(rank.progress * 100)}%` }} />
        </div>
        <div style={{ marginTop: 8, color: 'var(--text-dim)', font: '500 12px var(--font-body)' }}>
          {rank.next ? (
            <>Noch <b style={{ color: 'var(--text)' }}>{rank.toNext} ✦</b> bis <b style={{ color: 'var(--gold-1)' }}>{rank.next.name}</b></>
          ) : (
            <>Höchste Stufe erreicht – <b style={{ color: 'var(--gold-1)' }}>Erleuchtete*r</b> ✦</>
          )}
        </div>
      </div>

      {/* Aufstiegslogik */}
      <div className="glass-purple" style={{ marginTop: 12, padding: '12px 14px' }}>
        <div style={{ color: 'var(--gold-1)', font: '600 11px var(--font-body)', marginBottom: 3 }}>Wie du aufsteigst</div>
        <div style={{ color: 'var(--text-dim)', font: '400 11.5px/1.55 var(--font-body)' }}>
          Jede tägliche Botschaft schenkt dir <b style={{ color: 'var(--text)' }}>+15 ✦ Sternenstaub</b>. Mit jedem Stern
          wächst dein Sternenband – ganz ohne Druck, in deinem Tempo.
        </div>
      </div>

      {/* Rang-Leiter */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RANKS.map((r, i) => {
          const reached = stats.stardust >= r.at
          const current = r.name === rank.rank
          return (
            <div key={r.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, borderRadius: 14, padding: '11px 13px',
              background: current ? 'rgba(232,199,122,.12)' : reached ? 'rgba(166,107,255,.08)' : 'rgba(255,255,255,.03)',
              border: '1px solid ' + (current ? 'var(--gold-1)' : reached ? 'rgba(166,107,255,.25)' : 'rgba(255,255,255,.08)'),
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: reached ? 'linear-gradient(135deg,#E8C77A,#D9B45A)' : 'rgba(255,255,255,.06)',
                color: reached ? 'var(--gold-ink)' : '#7a7494', font: '700 12px var(--font-body)',
              }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: current ? 'var(--gold-1)' : reached ? 'var(--text)' : 'var(--text-dim)', font: '600 13.5px var(--font-body)' }}>
                  {r.name}{current && ' · du bist hier'}
                </div>
                <div style={{ color: '#7a7494', font: '500 10.5px var(--font-body)', marginTop: 1 }}>ab {r.at} ✦</div>
              </div>
              {reached && <span style={{ color: 'var(--gold-1)', fontSize: 14 }}>✓</span>}
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, minHeight: 12 }} />
      <button className="btn-gold" style={{ marginTop: 14 }} onClick={() => nav('/oracle')}>
        ✦ Nächsten Stern sammeln
      </button>
    </div>
  )
}
