import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { RANKS } from '../data/library.js'

// 16/17 · Sternenband / Rang-Leiter — jede Stufe erzählt beim Antippen ihr
// Kapitel (Lunas Stimme). Zukünftige Kapitel sind lesbar und enden mit der
// Entfernung in ✦ – sanftes Ziehen statt hartem Verstecken.
export default function RankLadder() {
  const nav = useNavigate()
  const { stats, rank } = useStore()
  const [openIdx, setOpenIdx] = useState(() => RANKS.findIndex((r) => r.name === rank.rank))

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
          const open = openIdx === i
          const fehlt = Math.max(0, r.at - stats.stardust)
          return (
            <div key={r.name} style={{
              borderRadius: 14, overflow: 'hidden',
              background: current ? 'rgba(232,199,122,.12)' : reached ? 'rgba(166,107,255,.08)' : 'rgba(255,255,255,.03)',
              border: '1px solid ' + (current ? 'var(--gold-1)' : reached ? 'rgba(166,107,255,.25)' : 'rgba(255,255,255,.08)'),
            }}>
              <button onClick={() => setOpenIdx(open ? -1 : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: reached ? 'linear-gradient(135deg,#E8C77A,#D9B45A)' : 'rgba(255,255,255,.06)',
                  color: reached ? 'var(--gold-ink)' : '#7a7494', font: '700 12px var(--font-body)',
                }}>{i + 1}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', color: current ? 'var(--gold-1)' : reached ? 'var(--text)' : 'var(--text-dim)', font: '600 14.5px var(--font-body)' }}>
                    {r.name}{current && ' · du bist hier'}
                  </span>
                  <span style={{ display: 'block', color: '#8a83a6', font: '500 12px var(--font-body)', marginTop: 1 }}>ab {r.at} ✦</span>
                </span>
                {reached && <span style={{ color: 'var(--gold-1)', fontSize: 14 }}>✓</span>}
                <span style={{ color: '#8a83a6', fontSize: 12, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
              </button>
              {open && (
                <div style={{ padding: '0 15px 13px 55px' }} className="pop">
                  <div style={{ fontFamily: 'var(--font-head)', fontStyle: 'italic', color: 'var(--text)', font: '400 13.5px/1.65 var(--font-body)', fontSize: 13.5, lineHeight: 1.65 }}>
                    {r.glyph} {r.story}
                  </div>
                  <div style={{ marginTop: 9, color: current ? 'var(--gold-1)' : reached ? 'var(--purple-2)' : 'var(--text-dim)', font: '600 12px var(--font-body)' }}>
                    {current
                      ? '✦ Dein jetziges Kapitel.'
                      : reached
                        ? '✓ Dieses Kapitel hast du bereits gelebt.'
                        : <>☾ Noch <b style={{ color: 'var(--gold-1)' }}>{fehlt} ✦</b> trennen dich von diesem Kapitel.</>}
                  </div>
                </div>
              )}
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
