import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { formatDate } from '../data/library.js'
import { fetchMessage } from '../lib/ai.js'
import { speak, speechSupported } from '../lib/audio.js'
import { asset } from '../lib/asset.js'

// Kern-Flow: trigger (Würfel) → listening (Luna lauscht) → revelation →
// message + Reflexion auf EINEM Screen (auto-gespeichert). Fehler = sanfter Zwischenzustand.
const LISTEN_TEXTS = ['Luna lauscht …', 'Ein Gedanke sortiert sich.', 'Die Botschaft nimmt Gestalt an.']

export default function OracleDraw() {
  const nav = useNavigate()
  const loc = useLocation()
  const ritual = loc.state?.ritual || 'wuerfel' // von OracleRitual durchgereicht
  const { profile, journal, drawnToday, saveEntry, updateReflection, settings } = useStore()

  const listen = () => {
    if (!settings.premium) { nav('/profil/plus'); return }
    if (message) speak(`${message.title}. ${message.text} Dein Mantra: ${message.mantra}`, settings.tone)
  }

  const todaysEntry = journal.find((e) => e.iso === formatDate().iso)

  const [phase, setPhase] = useState('trigger') // trigger|listening|revelation|message|error
  const [message, setMessage] = useState(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(null)
  const [micro, setMicro] = useState(0)
  const timers = useRef([])
  const reflectRef = useRef(null)

  // Wechselnde Mikrotexte im Lade-Zustand (Warten wird inszeniert, nicht technisch).
  useEffect(() => {
    if (phase !== 'listening') return
    setMicro(0)
    const iv = setInterval(() => setMicro((i) => (i + 1) % LISTEN_TEXTS.length), 850)
    return () => clearInterval(iv)
  }, [phase])

  useEffect(() => {
    if (drawnToday && todaysEntry) {
      // Wiederansicht direkt aus dem Eintrag (generierte Botschaften stehen nicht in MESSAGES).
      const full = {
        ...todaysEntry,
        luck: todaysEntry.luck ?? '—',
        energy: todaysEntry.energy ?? { label: '—', value: 0.5 },
        reflection: todaysEntry.question ?? 'Was bleibt von dieser Botschaft heute bei dir?',
      }
      setMessage(full)
      setNote(todaysEntry.reflection || '')
      setSaved({ already: true, id: todaysEntry.id })
      setPhase('message')
    }
    return () => timers.current.forEach(clearTimeout)
  }, []) // eslint-disable-line

  const draw = useCallback(() => {
    setPhase('listening')
    const willFail = Math.random() < 0.03
    timers.current.push(
      setTimeout(() => {
        if (willFail) {
          setPhase('error')
          return
        }
        setPhase('revelation')
        timers.current.push(
          setTimeout(async () => {
            // Hybrid: KI-Modus wenn aktiviert & erreichbar, sonst Offline-Bibliothek.
            const msg = await fetchMessage(
              {
                name: profile.name,
                themes: profile.themes,
                mood: profile.mood,
                ritual,
                styles: profile.commStyles,
                coping: profile.coping,
              },
              { aiMode: settings.aiMode }
            )
            const res = saveEntry(msg, '')
            setMessage(msg)
            setSaved(res)
            setPhase('message')
          }, 1700)
        )
      }, 2300)
    )
  }, [profile.name, profile.themes, profile.mood, profile.commStyles, profile.coping, ritual, settings.aiMode, saveEntry])

  // Belohnung → eigener Feier-Screen (22); sonst Dashboard
  const finish = () => {
    if (saved && !saved.already && (saved.constellation || saved.rankUp)) {
      nav('/feier', { replace: true, state: { reward: { ...saved } } })
    } else {
      nav('/dashboard', { replace: true })
    }
  }

  const saveReflection = () => {
    if (saved?.id) updateReflection(saved.id, note)
    finish()
  }

  if (phase === 'trigger') {
    const intro = {
      wuerfel: 'Atme einmal tief durch. Wenn du so weit bist, wirf den Sternenwürfel.',
      karten: 'Lass deine Hand entscheiden – eine der Karten ruft dich heute.',
      runen: 'Drei Runen warten: Was nachwirkt, was jetzt zählt, was entstehen darf.',
    }[ritual]
    const hint = { wuerfel: 'Berühren zum Würfeln', karten: 'Eine Karte berühren', runen: 'Die Runen berühren' }[ritual]
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 28px 34px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text)', font: '600 16px var(--font-body)' }}>
          <button className="back" onClick={() => nav('/oracle')}>‹</button>
          <button className="back" onClick={() => nav('/dashboard')} style={{ opacity: 0.6 }}>×</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Luna state="lauschen" width={96} glowSize={130} float />
        </div>
        <div className="h-serif" style={{ fontWeight: 600, fontSize: 24, textAlign: 'center', marginTop: 4 }}>Bist du bereit?</div>
        <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 13.5px/1.55 var(--font-body)', textAlign: 'center' }}>
          {intro}
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ritual === 'wuerfel' && (
            <button className="dice-orb anim-orb" onClick={draw} aria-label="Sternenwürfel werfen">
              <img src={asset('uploads/wuerfel.png')} alt="Sternenwürfel" width={124} style={{ filter: 'drop-shadow(0 10px 22px rgba(232,199,122,.55))' }} />
            </button>
          )}

          {ritual === 'karten' && (
            <div style={{ display: 'flex', justifyContent: 'center' }} aria-label="Sternenkarten">
              {[-16, -8, 0, 8, 16].map((deg, i) => (
                <button key={i} onClick={draw} aria-label={`Karte ${i + 1} ziehen`}
                  className="anim-float"
                  style={{
                    width: 62, height: 96, marginLeft: i ? -22 : 0, cursor: 'pointer',
                    transform: `rotate(${deg}deg) translateY(${Math.abs(deg) * 0.8}px)`,
                    animationDelay: `${i * 0.35}s`,
                    borderRadius: 10, border: '1px solid rgba(232,199,122,.5)',
                    background: 'linear-gradient(150deg,#2a2140,#171226) center/cover',
                    boxShadow: '0 10px 26px rgba(0,0,0,.5), inset 0 0 18px rgba(106,59,232,.35)',
                    display: 'grid', placeItems: 'center', color: 'var(--gold-1)', fontSize: 20,
                  }}>✦</button>
              ))}
            </div>
          )}

          {ritual === 'runen' && (
            <button onClick={draw} aria-label="Runen legen" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: 16 }}>
              {['ᚠ', 'ᚱ', 'ᛒ'].map((g, i) => (
                <span key={i} className="anim-float" style={{
                  width: 66, height: 80, borderRadius: '46% 46% 40% 40%', animationDelay: `${i * 0.45}s`,
                  background: 'linear-gradient(160deg,#332a4a,#1a1428)', border: '1px solid rgba(232,199,122,.4)',
                  boxShadow: '0 10px 24px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1)',
                  display: 'grid', placeItems: 'center', color: 'rgba(232,199,122,.35)', fontSize: 26, fontFamily: 'var(--font-head)',
                }}>{g}</span>
              ))}
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center', color: 'var(--gold-1)', font: '600 13px var(--font-body)', letterSpacing: 0.5, marginBottom: 6 }}>
          {hint}
        </div>
        <div style={{ textAlign: 'center', color: '#7a7494', font: '400 11px var(--font-body)' }}>
          Eine Botschaft pro Tag · heute noch nicht gezogen
        </div>
      </div>
    )
  }

  if (phase === 'listening')
    return (
      <div className="center-col" style={{ padding: '30px 30px 44px', textAlign: 'center' }}>
        <Luna state="lauschen" width={250} glowSize={290} float />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 22, color: 'var(--gold-1)', marginTop: 14, textShadow: '0 0 18px rgba(232,199,122,.4)', minHeight: 30 }}>
          {LISTEN_TEXTS[micro]}
        </div>
        <div className="dots" style={{ marginTop: 18, justifyContent: 'center' }}>
          <span style={{ background: '#E8C77A' }} />
          <span style={{ background: '#A66BFF', animationDelay: '.3s' }} />
          <span style={{ background: '#E8C77A', animationDelay: '.6s' }} />
        </div>
      </div>
    )

  if (phase === 'revelation')
    return (
      <div className="center-col" style={{ padding: 30, position: 'relative', background: 'radial-gradient(420px 420px at 50% 40%,rgba(255,247,225,.5),rgba(232,199,122,.28) 35%,transparent 62%)' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'conic-gradient(from 0deg at 50% 42%,transparent 0deg,rgba(232,199,122,.12) 12deg,transparent 24deg,rgba(232,199,122,.12) 36deg,transparent 48deg,rgba(232,199,122,.1) 60deg,transparent 72deg,rgba(232,199,122,.12) 84deg,transparent 96deg)',
          }}
          className="anim-burst"
        />
        <Luna state="offenbarung" width={230} glowSize={280} float={false} burst />
        <div style={{ position: 'relative', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: '#fff', marginTop: 6, textAlign: 'center', textShadow: '0 0 24px rgba(232,199,122,.8)' }}>
          {ritual === 'karten' ? <>Deine Karte<br />dreht sich um …</> : ritual === 'runen' ? <>Die Runen<br />ordnen sich …</> : <>Der Würfel fällt –<br />ein Zeichen leuchtet auf …</>}
        </div>
      </div>
    )

  if (phase === 'error')
    return (
      <div className="center-col" style={{ padding: '34px 30px' }}>
        <Luna state="idle" width={190} glowSize={210} float />
        <div className="h-serif" style={{ fontWeight: 600, fontSize: 21, marginTop: 8, lineHeight: 1.35, textAlign: 'center' }}>
          Luna sammelt sich<br />noch einen Moment.
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 13.5px/1.55 var(--font-body)', maxWidth: 260 }}>
          Manchmal braucht eine Botschaft etwas länger, um klar zu werden. Atme ruhig – gleich ist sie da.
        </div>
        <button className="btn-gold" style={{ marginTop: 24 }} onClick={draw}>Nochmal lauschen</button>
        <button className="link-soft" style={{ marginTop: 14 }} onClick={() => nav('/dashboard')}>Später</button>
      </div>
    )

  if (phase === 'message' && message)
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 22px 22px', overflowY: 'auto' }} className="screen-scroll">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text)' }}>
          <button className="back" onClick={finish} style={{ opacity: 0.6 }}>×</button>
          <span style={{ color: 'var(--text-dim)', font: '500 12px var(--font-body)' }}>{formatDate().short}</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="symbol-tile" style={{ width: 60, height: 60, fontSize: 27 }}>{message.symbol.glyph}</span>
            <span style={{ color: 'var(--purple-2)', font: '600 9.5px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
              Dein Symbol · {message.symbol.name}
            </span>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 30, lineHeight: 1.1, color: 'var(--gold-1)', textAlign: 'center', marginTop: 10, textShadow: '0 2px 16px rgba(232,199,122,.4)' }}>
          {message.title}
        </div>
        <div style={{ color: 'var(--text)', font: '400 14px/1.7 var(--font-body)', textAlign: 'center', marginTop: 12, padding: '0 2px', whiteSpace: 'pre-line' }}>
          {message.text}
        </div>

        {/* Ritual-spezifisches Ergebnis */}
        {message.archetype && (
          <div style={{ marginTop: 14, background: 'rgba(166,107,255,.1)', border: '1px solid rgba(166,107,255,.35)', borderRadius: 16, padding: '13px 15px' }}>
            <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase' }}>Dein Archetyp · Sternenwürfel</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <span style={{ fontSize: 22, color: 'var(--gold-1)' }}>{message.archetype.glyph}</span>
              <span style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 18, fontWeight: 600 }}>{message.archetype.name}</span>
            </div>
            <div style={{ color: 'var(--text)', font: '400 12.5px/1.55 var(--font-body)', marginTop: 6 }}>{message.archetype.kern}</div>
            <div style={{ marginTop: 8, color: 'var(--text-dim)', font: '400 12px/1.5 var(--font-body)' }}>
              <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>Kleine Handlung:</b> {message.archetype.impuls}
            </div>
          </div>
        )}
        {message.card && (
          <div style={{ marginTop: 14, background: 'rgba(166,107,255,.1)', border: '1px solid rgba(166,107,255,.35)', borderRadius: 16, padding: '13px 15px' }}>
            <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase' }}>Deine Karte · {message.card.thema}</div>
            <div style={{ color: 'var(--text)', font: '400 12.5px/1.6 var(--font-body)', marginTop: 7 }}>{message.card.deutung}</div>
          </div>
        )}
        {message.runes && (
          <div style={{ marginTop: 14, background: 'rgba(166,107,255,.1)', border: '1px solid rgba(166,107,255,.35)', borderRadius: 16, padding: '13px 15px' }}>
            <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase' }}>Deine Runen-Lesung</div>
            {message.runes.map((r) => (
              <div key={r.position} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginTop: 9 }}>
                <span style={{ width: 34, height: 40, flexShrink: 0, borderRadius: '44% 44% 38% 38%', background: 'linear-gradient(160deg,#332a4a,#1a1428)', border: '1px solid rgba(232,199,122,.4)', display: 'grid', placeItems: 'center', color: 'var(--gold-1)', fontSize: 17, fontFamily: 'var(--font-head)' }}>{r.glyph}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', color: 'var(--gold-1)', font: '600 11.5px var(--font-body)' }}>{r.position} · {r.name} ({r.bedeutung})</span>
                  <span style={{ display: 'block', color: 'var(--text)', font: '400 12px/1.5 var(--font-body)', marginTop: 2 }}>{r.heute}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 14, background: 'linear-gradient(160deg,rgba(232,199,122,.16),rgba(232,199,122,.05))', border: '1px solid rgba(232,199,122,.4)', borderRadius: 16, padding: '13px 14px', textAlign: 'center' }}>
          <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 }}>Dein Mantra</div>
          <div style={{ fontFamily: 'var(--font-head)', fontStyle: 'italic', fontWeight: 600, fontSize: 16, color: 'var(--gold-1)' }}>
            „{message.mantra}"
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 9 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 13, padding: '9px 11px' }}>
            <div style={{ color: '#7a7494', font: '600 8.5px var(--font-body)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Glückselement</div>
            <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)', marginTop: 2 }}>✦ {message.luck}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 13, padding: '9px 11px' }}>
            <div style={{ color: '#7a7494', font: '600 8.5px var(--font-body)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Tagesenergie</div>
            <div style={{ marginTop: 6, height: 5, borderRadius: 3, background: 'rgba(255,255,255,.12)' }}>
              <div style={{ width: `${Math.round((message.energy?.value || 0.5) * 100)}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#6A3BE8,#A66BFF)' }} />
            </div>
            <div style={{ color: 'var(--purple-2)', font: '600 11px var(--font-body)', marginTop: 4 }}>{message.energy?.label}</div>
          </div>
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '9px 11px' }}>
          <span style={{ color: '#7a7494', fontSize: 13 }}>ⓘ</span>
          <div style={{ color: '#7a7494', font: '400 10.5px/1.45 var(--font-body)' }}>
            Bewusst offen formuliert (Barnum-Effekt): Ihre Kraft entsteht durch <b style={{ color: 'var(--text-dim)', fontWeight: 600 }}>deine</b> Deutung.
          </div>
        </div>

        {!saved?.already && (
          <div style={{ marginTop: 10, textAlign: 'center', color: 'var(--gold-1)', font: '600 11px var(--font-body)' }}>
            ✓ Automatisch in deinem Tagebuch gesichert
          </div>
        )}

        {speechSupported && (
          <button
            onClick={listen}
            style={{ marginTop: 12, width: '100%', padding: 12, borderRadius: 12, background: 'rgba(166,107,255,.14)', border: '1px solid rgba(167,139,250,.4)', color: 'var(--text)', font: '600 13px var(--font-body)', cursor: 'pointer' }}
          >
            🔊 Botschaft anhören {!settings.premium && <span style={{ color: 'var(--gold-1)', fontSize: 11 }}>· Plus</span>}
          </button>
        )}
        <button
          className="btn-gold"
          style={{ padding: 14, borderRadius: 15, marginTop: 10 }}
          onClick={() => reflectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          Reflektieren ↓
        </button>

        {/* Reflexion — auf DERSELBEN Seite; die Botschaft bleibt darüber lesbar */}
        <div ref={reflectRef} style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.08)' }}>
          {!saved?.already && (
            <div className="banner pop" style={{ marginBottom: 14 }}>
              <Luna state="freude" width={46} glow={false} float={false} />
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--gold-1)', font: '700 13px var(--font-body)' }}>Im Tagebuch gespeichert ✓</div>
                <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginTop: 1 }}>
                  +{saved?.gainedDust ?? 0} ✦ Sternenstaub · Serie auf {saved?.newStreak ?? 0} {saved?.newStreak === 1 ? 'Tag' : 'Tage'}
                </div>
              </div>
            </div>
          )}

          <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Deine Reflexion</div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 17, color: 'var(--text)', lineHeight: 1.35 }}>
            {message.reflection}
          </div>

          <textarea
            className="note"
            style={{ marginTop: 12, minHeight: 110 }}
            placeholder="Schreibe, was in dir nachklingt … (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ color: '#7a7494', font: '400 11px var(--font-body)' }}>Nur für dich · local-first gespeichert</span>
            <span style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)' }}>{note.length} Zeichen</span>
          </div>

          <button className="btn-gold" style={{ marginTop: 12 }} onClick={saveReflection}>
            {note.trim() ? 'Reflexion speichern' : 'Fertig'}
          </button>
        </div>
      </div>
    )

  return null
}
