import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Luna, { LunaAvatar } from '../components/Luna.jsx'
import RewardModal from '../components/RewardModal.jsx'
import { IcBell, IcCalendar, IcCompass, IcBook } from '../components/icons.jsx'
import { useStore } from '../store/store.jsx'
import { formatDate, greeting, lunaSays } from '../data/library.js'

const WD = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export default function Dashboard() {
  const nav = useNavigate()
  const loc = useLocation()
  const { profile, stats, journal, rank, drawnToday } = useStore()
  const [reward, setReward] = useState(loc.state?.reward || null)

  const date = formatDate()
  const last = journal[0]
  const firstDay = journal.length === 0 && stats.streak === 0

  // 7-Tage-Serie als Sternreihe (heute hervorgehoben)
  const todayIdx = (new Date().getDay() + 6) % 7 // Mo=0
  const filled = Math.min(stats.streak, 7)

  if (firstDay) return <EmptyDashboard />

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '13px 15px 16px', gap: 0 }}>
        {/* App-Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ color: 'var(--gold-1)', fontSize: 16 }}>☾</span>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--gold-1)', letterSpacing: 1.5 }}>
              STERNENORAKEL
            </span>
          </div>
          <div style={{ position: 'relative', width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(232,199,122,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IcBell />
            <span style={{ position: 'absolute', top: 4, right: 5, width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-2)', boxShadow: '0 0 6px var(--purple-2)' }} />
          </div>
        </div>

        {/* Begrüßung */}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 21, color: 'var(--gold-1)', lineHeight: 1.05, textShadow: '0 2px 14px rgba(232,199,122,.3)' }}>
            {greeting().teil}, {profile.name || 'Sternenkind'}
          </div>
          <div style={{ color: 'var(--text-dim)', font: '500 12.5px var(--font-body)', marginTop: 4 }}>
            {date.weekday}, {date.short}
          </div>
        </div>

        {/* Status-Chips */}
        <div className="chips-row" style={{ marginTop: 11 }}>
          <div className="stat-chip" style={{ flex: 1.7 }}>
            <span className="gd">✦</span>
            <span>{rank.rank} · Lvl {rank.level}</span>
          </div>
          <div className="stat-chip">
            <span className="gd">✦</span>
            <span>{stats.stardust}</span>
          </div>
          <div className="stat-chip">
            <IcCalendar />
            <span>{stats.streak} {stats.streak === 1 ? 'Tag' : 'Tage'}</span>
          </div>
        </div>

        {/* XP */}
        <div className="xp-card" style={{ marginTop: 9 }}>
          <div className="bar">
            <div className="fill" style={{ width: `${Math.round(rank.progress * 100)}%` }} />
            <span className="marker" style={{ left: `${Math.round(rank.progress * 100)}%` }}>✦</span>
          </div>
          <div style={{ marginTop: 8, color: 'var(--text-dim)', font: '500 11.5px var(--font-body)' }}>
            {rank.next ? (
              <>Noch <b style={{ color: 'var(--text)' }}>{rank.toNext}</b> Sternenstaub bis <b style={{ color: 'var(--gold-1)' }}>{rank.next.name}</b></>
            ) : (
              <>Du hast die höchste Stufe erreicht – <b style={{ color: 'var(--gold-1)' }}>Erleuchtete*r</b>.</>
            )}
          </div>
        </div>

        {/* Luna-Hero · vollflächig (randlos, ggf. Pixel-Crop) */}
        <div className="hero hero--bleed" style={{ marginTop: 10, minHeight: 300 }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 0 }}>
            <div className="hero-bubble">„{lunaSays()}"</div>
            <Luna state="idle" width={330} glow={false} float style={{ alignSelf: 'flex-end' }} />
          </div>
          <button
            className="btn-gold uppercase"
            style={{ padding: 13, borderRadius: 14, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            onClick={() => nav('/oracle')}
          >
            <span style={{ color: '#a07b1e' }}>✦</span>
            {drawnToday ? 'Botschaft erneut lesen' : 'Botschaft empfangen'}
            <span style={{ color: '#a07b1e' }}>✦</span>
          </button>
          <div style={{ textAlign: 'center', color: '#cdbfa0', font: '400 10.5px var(--font-body)', marginTop: 7 }}>
            {drawnToday ? 'Heute schon empfangen · komm morgen wieder.' : 'Dauert ungefähr eine Minute.'}
          </div>
        </div>

        {/* 7-Tage-Serie */}
        <div className="card" style={{ marginTop: 10, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-title" style={{ fontSize: 13 }}>Deine 7-Tage-Serie</span>
            <span style={{ width: 17, height: 17, borderRadius: '50%', border: '1px solid rgba(182,176,206,.4)', color: 'var(--text-dim)', font: '600 10px var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</span>
          </div>
          <div style={{ color: 'var(--text-dim)', font: '400 10.5px var(--font-body)', marginTop: 3 }}>
            Jeder Tag ist ein kleiner Stern. Keine Pflicht. Nur ein Pfad.
          </div>
          <div className="streak-row">
            {WD.map((d, i) => {
              const isToday = i === todayIdx
              const on = i < filled || (isToday && drawnToday)
              return (
                <div key={d} className={'streak-day' + (isToday ? ' is-today' : '')}>
                  {isToday ? (
                    <span className="today">★</span>
                  ) : (
                    <span className={'star' + (on ? '' : ' off')}>★</span>
                  )}
                  <label>{d}</label>
                </div>
              )
            })}
          </div>
        </div>

        {/* Teaser zuletzt empfangen */}
        {last && (
          <div className="card" style={{ marginTop: 10, borderRadius: 16 }}>
            <div style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 11.5, fontWeight: 600, letterSpacing: 0.5 }}>
              Zuletzt empfangen
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 11 }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'radial-gradient(circle,rgba(106,59,232,.5),rgba(40,30,70,.5))', border: '1px solid rgba(232,199,122,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcCompass />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-head)', color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{last.title}</div>
                <div style={{ color: 'var(--text-dim)', font: '400 11px/1.35 var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {last.text}
                </div>
              </div>
            </div>
            <button
              onClick={() => nav('/tagebuch')}
              style={{ marginTop: 9, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: '1px solid rgba(232,199,122,.35)', background: 'rgba(232,199,122,.06)', borderRadius: 11, padding: 8, color: 'var(--gold-1)', font: '600 12px var(--font-body)', cursor: 'pointer' }}
            >
              <IcBook s={14} /> <span>Im Tagebuch öffnen</span> <span style={{ marginLeft: 2 }}>›</span>
            </button>
          </div>
        )}
      </div>

      <RewardModal reward={reward} onClose={() => { setReward(null); nav('.', { replace: true, state: {} }) }} />
    </>
  )
}

// Leerer Zustand · Tag 1
function EmptyDashboard() {
  const nav = useNavigate()
  const { profile, rank } = useStore()
  const date = formatDate()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 0' }}>
      <div className="statusbar" style={{ padding: 0, height: 24 }}>
        <span>9:41</span>
        <span className="glyphs" style={{ fontSize: 10 }}>☾ ✦</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <div>
          <div style={{ color: 'var(--text-dim)', font: '500 12px var(--font-body)' }}>{date.weekday}</div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 22, color: 'var(--gold-1)' }}>{date.short}</div>
        </div>
        <LunaAvatar size={42} />
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1.5, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '9px 11px' }}>
          <div style={{ color: '#7a7494', font: '600 8.5px var(--font-body)', letterSpacing: 0.8, textTransform: 'uppercase' }}>Rang</div>
          <div style={{ color: 'var(--text)', font: '600 12px var(--font-body)', margin: '2px 0 5px' }}>{rank.rank}</div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,.1)' }}>
            <div style={{ width: '3%', height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#6A3BE8,#A66BFF)' }} />
          </div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '9px 10px', textAlign: 'center' }}>
          <div style={{ color: '#7a7494', font: '700 16px var(--font-body)' }}>✦ 0</div>
          <div style={{ color: '#7a7494', font: '600 8.5px var(--font-body)', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 }}>Sternenstaub</div>
        </div>
        <div style={{ flex: 0.9, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '9px 8px', textAlign: 'center' }}>
          <div style={{ color: '#7a7494', font: '700 16px var(--font-body)' }}>0</div>
          <div style={{ color: '#7a7494', font: '600 8.5px var(--font-body)', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 }}>Tage Serie</div>
        </div>
      </div>

      <div className="center-col" style={{ padding: '10px 14px' }}>
        <Luna state="idle" width={170} glowSize={210} float />
        <div className="bubble" style={{ marginTop: 4 }}>
          „Unser erster gemeinsamer Tag – wie aufregend! Lass uns deine erste Botschaft empfangen."
        </div>
      </div>

      <button className="btn-gold" style={{ padding: 15, marginBottom: 8, boxShadow: '0 12px 30px rgba(232,199,122,.4)' }} onClick={() => nav('/oracle')}>
        ✦ Erste Botschaft empfangen
      </button>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 11.5px var(--font-body)', padding: '0 0 12px' }}>
        Hier wächst dein Sternenband mit jedem Tag.
      </div>
    </div>
  )
}
