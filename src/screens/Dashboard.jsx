import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Luna, { LunaAvatar } from '../components/Luna.jsx'
import RewardModal from '../components/RewardModal.jsx'
import { IcBell, IcCalendar, IcCompass, IcBook } from '../components/icons.jsx'
import { useStore } from '../store/store.jsx'
import { formatDate, greeting, lunaSays, constellationStatus } from '../data/library.js'
import { karteBild, runeBild } from '../lib/ritualAssets.js'

const WD = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export default function Dashboard() {
  const nav = useNavigate()
  const loc = useLocation()
  const { profile, stats, journal, rank, drawnToday, moodToday, pausedReturn, settings, updateSettings } = useStore()
  const [reward, setReward] = useState(loc.state?.reward || null)

  // 7-Tage-Backup-Popup (P3): regt regelmäßig die Sicherung an – höchstens
  // alle 7 Tage, nur mit Einträgen und nur wenn das letzte Backup älter ist.
  const [backupNudge, setBackupNudge] = useState(false)
  useEffect(() => {
    const stale = (iso, days) => !iso || Date.now() - new Date(iso + 'T12:00').getTime() > days * 86400000
    if (journal.length > 0 && stale(settings.lastBackupISO, 7) && stale(settings.backupNudgeISO, 7)) {
      setBackupNudge(true)
    }
  }, []) // eslint-disable-line
  const closeBackupNudge = (goBackup) => {
    updateSettings({ backupNudgeISO: formatDate().iso })
    setBackupNudge(false)
    if (goBackup) nav('/profil/privacy')
  }

  // Tagesziehung: erst Befinden (falls heute noch nicht abgefragt), dann Ritual.
  // Bereits gezogen → direkt die heutige Botschaft erneut ansehen.
  const goDraw = () => nav(drawnToday ? '/oracle/draw' : moodToday ? '/oracle' : '/oracle/befinden')

  // Rückkehr nach Pause → eigener Screen (23)
  useEffect(() => {
    if (pausedReturn) nav('/rueckkehr', { replace: true })
  }, [pausedReturn, nav])

  const date = formatDate()
  const last = journal[0]
  const firstDay = journal.length === 0 && stats.streak === 0

  const todayIdx = (new Date().getDay() + 6) % 7 // Mo=0
  const filled = Math.min(stats.streak, 7)
  const cstat = constellationStatus(journal)

  if (firstDay) return <EmptyDashboard />

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '13px 15px 16px', gap: 0 }}>
        {/* App-Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ color: 'var(--gold-1)', fontSize: 16 }}>☾</span>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--gold-1)', letterSpacing: 1.5 }}>
              STERNENLUNA
            </span>
          </div>
          {/* Glocke → Erinnerungs-Einstellungen; Punkt zeigt aktive Erinnerung */}
          <button onClick={() => nav('/profil/erinnerung')} aria-label="Erinnerung einstellen"
            style={{ position: 'relative', width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(232,199,122,.3)', background: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IcBell />
            {settings.reminder && (
              <span style={{ position: 'absolute', top: 4, right: 5, width: 6, height: 6, borderRadius: '50%', background: 'var(--purple-2)', boxShadow: '0 0 6px var(--purple-2)' }} />
            )}
          </button>
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

        {/* Status-Chips — Rang klickbar → Rang-Leiter */}
        <div className="chips-row" style={{ marginTop: 11 }}>
          <div className="stat-chip" style={{ flex: 1.7, cursor: 'pointer' }} onClick={() => nav('/profil/raenge')}>
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
        <div className="xp-card" style={{ marginTop: 9, cursor: 'pointer' }} onClick={() => nav('/profil/raenge')}>
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

        {/* Luna-Hero · vollflächig (randlos) */}
        <div className="hero hero--bleed" style={{ marginTop: 10, minHeight: 300 }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 0 }}>
            <div className="hero-bubble">„{lunaSays()}"</div>
            <Luna state="idle" width="min(345px, 88vw)" glow={false} float style={{ alignSelf: 'flex-end' }} />
          </div>
          <button
            className="btn-gold uppercase"
            style={{ padding: 13, borderRadius: 14, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            onClick={goDraw}
          >
            <span style={{ color: '#a07b1e' }}>✦</span>
            {drawnToday ? 'Botschaft erneut lesen' : 'Botschaft empfangen'}
            <span style={{ color: '#a07b1e' }}>✦</span>
          </button>
          <div style={{ textAlign: 'center', color: '#cdbfa0', font: '400 10.5px var(--font-body)', marginTop: 7 }}>
            {drawnToday ? 'Heute schon empfangen · komm morgen wieder.' : 'Dein heutiger Lichtpunkt ist noch unentdeckt. ✦'}
          </div>
          {drawnToday && new Date().getHours() >= 19 && (
            <button className="link-soft" style={{ marginTop: 6 }} onClick={() => nav('/abend')}>
              ☾ Heute abschließen
            </button>
          )}
        </div>

        {/* 7-Tage-Serie + FOMO nächstes Sternbild */}
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
          <div onClick={() => nav('/profil/sternbilder')} style={{ marginTop: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 9 }}>
            <span style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)' }}>
              {cstat.next
                ? <>Noch <b style={{ color: 'var(--gold-1)' }}>{cstat.missing}</b> {cstat.missing === 1 ? 'Reflexion' : 'Reflexionen'} bis <b style={{ color: 'var(--gold-1)' }}>{cstat.next.name}</b></>
                : <>Alle Sternbilder vollendet ✦</>}
            </span>
            <span style={{ color: 'var(--purple-2)', font: '600 11px var(--font-body)' }}>{cstat.done}/{cstat.total} ›</span>
          </div>
        </div>

        {/* Backup-Anregung läuft jetzt als 7-Tage-Popup (siehe unten) */}

        {/* Plus abgelaufen: einmaliger, sanfter Hinweis mit Weg zurück (Gutschein/Zahlung) */}
        {!settings.premium && settings.plusSource && settings.plusUntilISO && settings.plusExpiredSeenISO !== settings.plusUntilISO && (
          <div className="card" style={{ marginTop: 10, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(232,199,122,.35)' }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 18, background: 'radial-gradient(circle,rgba(232,199,122,.25),rgba(40,30,70,.5))', border: '1px solid rgba(232,199,122,.35)' }}>✧</span>
            <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => nav('/profil/plus')}>
              <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>Dein Plus-Zeitraum ist beendet</div>
              <div style={{ color: 'var(--text-dim)', font: '400 11px/1.4 var(--font-body)', marginTop: 1 }}>
                Dein Tagebuch bleibt vollständig. Mit Gutschein-Code oder Zahlung geht es weiter ›
              </div>
            </div>
            <button aria-label="Hinweis schließen" onClick={() => updateSettings({ plusExpiredSeenISO: settings.plusUntilISO })}
              style={{ background: 'none', border: 'none', color: '#7a7494', fontSize: 16, cursor: 'pointer', padding: 4 }}>×</button>
          </div>
        )}

        {/* Wochenrückblick — echter Langzeitnutzen statt reiner Punkte */}
        <div className="card" style={{ marginTop: 10, borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => nav('/woche')}>
          <span style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 18, background: 'radial-gradient(circle,rgba(106,59,232,.45),rgba(40,30,70,.5))', border: '1px solid rgba(232,199,122,.3)' }}>✧</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>Deine Woche mit Luna</div>
            <div style={{ color: 'var(--text-dim)', font: '400 11px/1.4 var(--font-body)', marginTop: 1 }}>
              {(() => {
                const wk = journal.filter((e) => e.ts >= Date.now() - 7 * 86400000).length
                return wk >= 4
                  ? 'Dein Wochenmuster ist bereit – sieh, was sich wiederholt.'
                  : `Noch ${4 - wk} ${4 - wk === 1 ? 'Botschaft' : 'Botschaften'}, dann zeigt Luna dein erstes Wochenmuster.`
              })()}
            </div>
          </div>
          <span style={{ color: 'var(--purple-2)', fontSize: 16 }}>›</span>
        </div>

        {/* Teaser zuletzt empfangen — anklickbar */}
        {last && (
          <div className="card" style={{ marginTop: 10, borderRadius: 16, cursor: 'pointer' }} onClick={() => nav(`/tagebuch/${last.id}`)}>
            <div style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 11.5, fontWeight: 600, letterSpacing: 0.5 }}>
              Zuletzt empfangen
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 11 }}>
              {/* Gezogenes Motiv als kleines Bild – macht den Tag „greifbar" */}
              {last.card && karteBild(last.card.title, 'sm') ? (
                <img src={karteBild(last.card.title, 'sm')} alt={last.card.title}
                  style={{ width: 42, height: 'auto', flexShrink: 0, borderRadius: 6, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.5))' }} />
              ) : last.runes?.length && runeBild(last.runes[1]?.name || last.runes[0]?.name) ? (
                <img src={runeBild(last.runes[1]?.name || last.runes[0]?.name)} alt="Rune"
                  style={{ width: 42, height: 'auto', flexShrink: 0, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.5))' }} />
              ) : (
                <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'radial-gradient(circle,rgba(106,59,232,.5),rgba(40,30,70,.5))', border: '1px solid rgba(232,199,122,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcCompass />
                </span>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-head)', color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{last.title}</div>
                <div style={{ color: 'var(--text-dim)', font: '400 11px/1.35 var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {last.text}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 9, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: '1px solid rgba(232,199,122,.35)', background: 'rgba(232,199,122,.06)', borderRadius: 11, padding: 8, color: 'var(--gold-1)', font: '600 12px var(--font-body)' }}>
              <IcBook s={14} /> <span>Im Tagebuch öffnen</span> <span style={{ marginLeft: 2 }}>›</span>
            </div>
          </div>
        )}
      </div>

      <RewardModal reward={reward} onClose={() => { setReward(null); nav('.', { replace: true, state: {} }) }} />

      {/* 7-Tage-Backup-Popup: sanfte, wiederkehrende Sicherungs-Anregung */}
      {backupNudge && !reward && (
        <div className="overlay" onClick={() => closeBackupNudge(false)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()} style={{ paddingTop: 24, textAlign: 'center' }}>
            <span style={{ fontSize: 30 }}>🛡️</span>
            <div className="title-lg" style={{ fontSize: 19, color: 'var(--text)', marginTop: 8 }}>Sichere dein Sternenband</div>
            <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.6 var(--font-body)', marginTop: 10 }}>
              {journal.length} {journal.length === 1 ? 'Eintrag' : 'Einträge'} ·{' '}
              {settings.lastBackupISO ? `letzte Sicherung am ${settings.lastBackupISO}` : 'noch nie gesichert'}.
              Ein Backup per E-Mail an dich selbst dauert nur einen Moment – und dein Tagebuch ist sicher,
              was auch immer mit diesem Gerät passiert.
            </div>
            <button className="btn-gold" style={{ marginTop: 16 }} onClick={() => closeBackupNudge(true)}>
              ✉️ Jetzt sichern
            </button>
            <button className="link-soft" style={{ marginTop: 12 }} onClick={() => closeBackupNudge(false)}>
              Später · in 7 Tagen erinnern
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Kleiner Ausblick-Teaser (Erst-Dashboard)
function Teaser({ nav, to, glyph, title, desc }) {
  return (
    <div className="card" style={{ borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => nav(to)}>
      <span style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 18, background: 'radial-gradient(circle,rgba(106,59,232,.45),rgba(40,30,70,.5))', border: '1px solid rgba(232,199,122,.3)', color: 'var(--gold-1)' }}>{glyph}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>{title}</div>
        <div style={{ color: 'var(--text-dim)', font: '400 11px/1.4 var(--font-body)', marginTop: 1 }}>{desc}</div>
      </div>
      <span style={{ color: 'var(--purple-2)', fontSize: 16 }}>›</span>
    </div>
  )
}

// Leerer Zustand · Tag 1 — einladend, mit großer Luna und Ausblick
function EmptyDashboard() {
  const nav = useNavigate()
  const { profile, rank, moodToday } = useStore()
  const date = formatDate()
  // Befinden wurde ggf. schon im Onboarding erfasst → nicht doppelt fragen
  const start = () => nav(moodToday ? '/oracle' : '/oracle/befinden')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '13px 15px 16px' }}>
      {/* App-Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: 'var(--gold-1)', fontSize: 16 }}>☾</span>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--gold-1)', letterSpacing: 1.5 }}>STERNENLUNA</span>
        </div>
        <LunaAvatar size={34} />
      </div>

      {/* Begrüßung */}
      <div style={{ marginTop: 10 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 21, color: 'var(--gold-1)', lineHeight: 1.05, textShadow: '0 2px 14px rgba(232,199,122,.3)' }}>
          Willkommen, {profile.name || 'Sternenkind'}
        </div>
        <div style={{ color: 'var(--text-dim)', font: '500 12.5px var(--font-body)', marginTop: 4 }}>{date.weekday}, {date.short}</div>
      </div>

      {/* Startwert-Chips */}
      <div className="chips-row" style={{ marginTop: 11 }}>
        <div className="stat-chip" style={{ flex: 1.7 }}><span className="gd">✦</span><span>{rank.rank} · Lvl {rank.level}</span></div>
        <div className="stat-chip"><span className="gd">✦</span><span>0</span></div>
        <div className="stat-chip"><IcCalendar /><span>0 Tage</span></div>
      </div>

      {/* Luna-Hero groß */}
      <div className="hero hero--bleed" style={{ marginTop: 10, minHeight: 320 }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 0 }}>
          <div className="hero-bubble">„Unser erster gemeinsamer Tag – schön, dass du da bist. Lass uns deine erste Botschaft empfangen."</div>
          <Luna state="idle" width="min(345px, 88vw)" glow={false} float style={{ alignSelf: 'flex-end' }} />
        </div>
        <button
          className="btn-gold uppercase"
          style={{ padding: 13, borderRadius: 14, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onClick={start}
        >
          <span style={{ color: '#a07b1e' }}>✦</span>
          Erste Botschaft empfangen
          <span style={{ color: '#a07b1e' }}>✦</span>
        </button>
        <div style={{ textAlign: 'center', color: '#cdbfa0', font: '400 10.5px var(--font-body)', marginTop: 7 }}>
          Dauert ungefähr eine Minute.
        </div>
      </div>

      {/* Ausblick: was hier entsteht */}
      <div style={{ marginTop: 12, color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Was hier entsteht</div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Teaser nav={nav} to="/profil/raenge" glyph="✦" title="Dein Sternenband wächst" desc="Mit jeder Botschaft sammelst du Sternenstaub und steigst im Rang auf." />
        <Teaser nav={nav} to="/tagebuch" glyph="📖" title="Dein Tagebuch entsteht hier" desc="Jede Botschaft und Reflexion wird zu deinem persönlichen Spiegel." />
        <Teaser nav={nav} to="/profil/sternbilder" glyph="✧" title="Sammle 12 Sternbilder" desc="Vervollständige nach und nach dein eigenes Sternenbild." />
      </div>
    </div>
  )
}
