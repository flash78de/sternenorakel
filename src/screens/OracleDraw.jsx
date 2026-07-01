import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { MESSAGES, pickMessage, formatDate } from '../data/library.js'

// Kern-Flow: trigger (Würfel) → listening (Luna erwacht) → revelation → message
// (auto-gespeichert) → reflection. Fehler = sanfter Zwischenzustand.
export default function OracleDraw() {
  const nav = useNavigate()
  const { profile, journal, drawnToday, saveEntry, updateReflection } = useStore()

  const todaysEntry = journal.find((e) => e.iso === formatDate().iso)

  const [phase, setPhase] = useState('trigger') // trigger|listening|revelation|message|reflection|error
  const [message, setMessage] = useState(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(null)
  const [splashFail, setSplashFail] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    if (drawnToday && todaysEntry) {
      const full = MESSAGES.find((m) => m.id === todaysEntry.mid) || {
        ...todaysEntry,
        luck: '—',
        energy: { label: '—', value: 0.5 },
        reflection: 'Was bleibt von dieser Botschaft heute bei dir?',
      }
      setMessage(full)
      setNote(todaysEntry.reflection || '')
      setSaved({ already: true, id: todaysEntry.id })
      setPhase('message')
    }
    return () => timers.current.forEach(clearTimeout)
  }, []) // eslint-disable-line

  const draw = useCallback(() => {
    setSplashFail(false)
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
          setTimeout(() => {
            const msg = pickMessage(profile.themes, todaysEntry?.mid)
            const res = saveEntry(msg, '')
            setMessage(msg)
            setSaved(res)
            setPhase('message')
          }, 1700)
        )
      }, 2300)
    )
  }, [profile.themes, todaysEntry, saveEntry])

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

  if (phase === 'trigger')
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
          Atme einmal tief durch. Wenn du so weit bist, wirf den Sternenwürfel.
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button className="dice-orb anim-orb" onClick={draw} aria-label="Sternenwürfel werfen">
            <img src="/uploads/wuerfel.png" alt="Sternenwürfel" width={124} style={{ filter: 'drop-shadow(0 10px 22px rgba(232,199,122,.55))' }} />
          </button>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--gold-1)', font: '600 13px var(--font-body)', letterSpacing: 0.5, marginBottom: 6 }}>
          Berühren zum Würfeln
        </div>
        <div style={{ textAlign: 'center', color: '#7a7494', font: '400 11px var(--font-body)' }}>
          Eine Botschaft pro Tag · heute noch nicht gezogen
        </div>
      </div>
    )

  if (phase === 'listening')
    return (
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center' }}>
        {!splashFail ? (
          <img
            src="/uploads/luna-erwacht.png"
            alt="Luna erwacht"
            onError={() => setSplashFail(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="center-col" style={{ padding: '30px 30px 40px' }}>
            <Luna state="lauschen" width={215} glowSize={250} float />
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 22, color: 'var(--gold-1)', marginTop: 8, textShadow: '0 0 18px rgba(232,199,122,.4)' }}>
              Luna erwacht …
            </div>
            <div style={{ marginTop: 8, color: 'var(--text-dim)', font: '400 13px/1.5 var(--font-body)', maxWidth: 240 }}>
              Einen kleinen Sternenmoment …
            </div>
          </div>
        )}
        <div className="dots" style={{ position: 'absolute', bottom: 34, left: 0, right: 0, justifyContent: 'center' }}>
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
          Eine Botschaft<br />formt sich für dich …
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
        <div style={{ color: 'var(--text)', font: '400 14px/1.7 var(--font-body)', textAlign: 'center', marginTop: 12, padding: '0 2px' }}>
          {message.text}
        </div>

        <div style={{ marginTop: 16, background: 'linear-gradient(160deg,rgba(232,199,122,.16),rgba(232,199,122,.05))', border: '1px solid rgba(232,199,122,.4)', borderRadius: 16, padding: '13px 14px', textAlign: 'center' }}>
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

        <div style={{ flex: 1, minHeight: 10 }} />
        <button className="btn-gold" style={{ padding: 14, borderRadius: 15, marginTop: 10 }} onClick={() => setPhase('reflection')}>
          Reflektieren ↓
        </button>
      </div>
    )

  if (phase === 'reflection' && message)
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <button className="back" onClick={() => setPhase('message')}>‹</button>
          <span style={{ background: 'rgba(166,107,255,.18)', border: '1px solid rgba(166,107,255,.3)', borderRadius: 999, padding: '5px 12px', font: '600 11px var(--font-body)', color: 'var(--gold-1)' }}>
            {message.symbol.glyph} {message.title}
          </span>
        </div>

        {!saved?.already && (
          <div className="banner pop">
            <Luna state="freude" width={46} glow={false} float={false} />
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--gold-1)', font: '700 13px var(--font-body)' }}>Im Tagebuch gespeichert ✓</div>
              <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginTop: 1 }}>
                +{saved?.gainedDust ?? 0} ✦ Sternenstaub · Serie auf {saved?.newStreak ?? 0} {saved?.newStreak === 1 ? 'Tag' : 'Tage'}
              </div>
            </div>
          </div>
        )}

        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 18, color: 'var(--text)', lineHeight: 1.35, marginTop: !saved?.already ? 18 : 4 }}>
          {message.reflection}
        </div>

        <textarea
          className="note"
          style={{ marginTop: 12, flex: 1 }}
          placeholder="Schreibe, was in dir nachklingt … (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          autoFocus
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ color: '#7a7494', font: '400 11px var(--font-body)' }}>Nur für dich · local-first gespeichert</span>
          <span style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)' }}>{note.length} Zeichen</span>
        </div>

        <button className="btn-gold" style={{ marginTop: 12 }} onClick={saveReflection}>
          {note.trim() ? 'Reflexion speichern' : 'Fertig'}
        </button>
      </div>
    )

  return null
}
