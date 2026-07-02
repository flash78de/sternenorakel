import { useNavigate } from 'react-router-dom'
import { LunaAvatar } from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { RANKS, constellationStatus } from '../data/library.js'
import { GLUECKSELEMENTE } from '../data/generator.js'

export default function Profil() {
  const nav = useNavigate()
  const { profile, stats, rank, journal } = useStore()
  const cstat = constellationStatus(journal)
  const luckFound = GLUECKSELEMENTE.filter((g) => journal.some((e) => e.luck === g.name)).length

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 16px' }}>
      {/* Kopf */}
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <LunaAvatar size={78} />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 21, color: 'var(--text)', marginTop: 8 }}>
          {profile.name || 'Sternenkind'}
        </div>
        <div style={{ marginTop: 5, display: 'flex', gap: 7, justifyContent: 'center', flexWrap: 'wrap' }}>
          {profile.zodiac && <span className="pill">{profile.zodiac.symbol} {profile.zodiac.name}</span>}
          <span className="pill">{rank.rank} · Lvl {rank.level}</span>
          <span className="pill" style={{ background: 'rgba(232,199,122,.12)', borderColor: 'rgba(232,199,122,.3)' }}>✦ {stats.stardust}</span>
        </div>
      </div>

      {/* Sternenband — anklickbar → Rang-Leiter */}
      <div className="glass" style={{ marginTop: 16, padding: '14px 16px', cursor: 'pointer' }} onClick={() => nav('/profil/raenge')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Sternenband</span>
          <span style={{ color: 'var(--gold-1)', font: '700 13px var(--font-body)' }}>
            {rank.next ? `${rank.into} / ${rank.span} ✦` : `${stats.stardust} ✦`}
          </span>
        </div>
        <div className="bar" style={{ marginTop: 9, height: 8, overflow: 'hidden' }}>
          <div className="fill" style={{ width: `${Math.round(rank.progress * 100)}%` }} />
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', font: '500 11px var(--font-body)' }}>
          <span style={{ color: 'var(--text)' }}>{rank.rank} · Lvl {rank.level}</span>
          {rank.next && <span>→ {rank.next.name}</span>}
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          {RANKS.map((r, i) => (
            <span key={r.name} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ font: `${r.name === rank.rank ? 600 : 500} 9px var(--font-body)`, color: r.name === rank.rank ? 'var(--gold-1)' : '#7a7494' }}>
                {r.name}
              </span>
              {i < RANKS.length - 1 && <span style={{ color: '#7a7494' }}>·</span>}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 8, color: 'var(--purple-2)', font: '600 10.5px var(--font-body)' }}>Tippen für Details &amp; Aufstiegslogik ›</div>
      </div>

      {/* Liste */}
      <div className="list" style={{ marginTop: 14 }}>
        <button className="list-row" onClick={() => nav('/profil/settings')}>
          <span>👤 Name · Geburtstag · Sternzeichen</span>
          <span className="chev">›</span>
        </button>
        <button className="list-row" onClick={() => nav('/profil/raenge')}>
          <span>✦ Sternenstaub &amp; Rang</span>
          <span style={{ color: 'var(--gold-1)', fontWeight: 600 }}>{stats.stardust} ›</span>
        </button>
        <button className="list-row" onClick={() => nav('/profil/sternbilder')}>
          <span>☾ Meine Sternbilder</span>
          <span className="chev">{cstat.done} / {cstat.total} ›</span>
        </button>
        <button className="list-row" onClick={() => nav('/profil/glueck')}>
          <span>🌟 Glückselemente</span>
          <span className="chev">{luckFound} / {GLUECKSELEMENTE.length} ›</span>
        </button>
      </div>

      <div style={{ flex: 1 }} />
      <button className="btn-gold" style={{ background: 'rgba(255,255,255,.04)', color: 'var(--text)', border: '1px solid rgba(255,255,255,.1)', boxShadow: 'none', fontWeight: 600 }} onClick={() => nav('/profil/settings')}>
        ⚙ Einstellungen öffnen
      </button>
    </div>
  )
}
