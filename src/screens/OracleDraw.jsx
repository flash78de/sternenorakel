import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { MESSAGES, pickMessage, formatDate } from '../data/library.js'

// Kern-Flow: trigger → listening → revelation → message → reflection (+ Erfolg)
// sowie Fehlerzustand. Eine Ziehung pro Tag.
export default function OracleDraw() {
  const nav = useNavigate()
  const { profile, journal, drawnToday, saveEntry, settings } = useStore()

  const todaysEntry = journal.find((e) => e.iso === formatDate().iso)

  const [phase, setPhase] = useState('trigger') // trigger|listening|revelation|message|reflection|error
  const [message, setMessage] = useState(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(null) // Ergebnis von saveEntry
  const timers = useRef([])

  // Bereits heute gezogen? → direkt zur Botschaft (Wiederansicht)
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
      setSaved({ already: true })
      setPhase('message')
    }
    return () => timers.current.forEach(clearTimeout)
  }, []) // eslint-disable-line

  const draw = useCallback(() => {
    setPhase('listening')
    // gelegentliche „Wolken" (Fehlerzustand) zur Demonstration
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
            setMessage(pickMessage(profile.themes, todaysEntry?.mid))
            setPhase('message')
          }, 1700)
        )
      }, 2300)
    )
  }, [profile.themes, todaysEntry])

  const save = () => {
    const result = saveEntry(message, note)
    setSaved(result)
    // kurzer Erfolgsmoment, dann zum Dashboard (mit evtl. Belohnung)
    timers.current.push(
      setTimeout(() => {
        const reward =
          result.constellation || result.rankUp
            ? { ...result }
            : null
        nav('/dashboard', { replace: true, state: { reward } })
      }, 1200)
    )
  }

  // ---------- Render je Phase ----------
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
          Atme einmal tief durch. Wenn du so weit bist, berühre den Orb.
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button className="orb anim-orb" onClick={draw} aria-label="Orb berühren zum Ziehen">
            <span>✦</span>
          </button>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--gold-1)', font: '600 13px var(--font-body)', letterSpacing: 0.5, marginBottom: 6 }}>
          Berühren zum Ziehen
        </div>
        <div style={{ textAlign: 'center', color: '#7a7494', font: '400 11px var(--font-body)' }}>
          Eine Botschaft pro Tag · heute noch nicht gezogen
        </div>
      </div>
    )

  if (phase === 'listening')
    return (
      <div className="center-col" style={{ padding: '30px 30px 40px' }}>
        <Luna state="lauschen" width={215} glowSize={250} float />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 21, color: 'var(--gold-1)', marginTop: 8, textShadow: '0 0 18px rgba(232,199,122,.4)' }}>
          Luna lauscht den Sternen …
        </div>
        <div className="dots" style={{ marginTop: 18 }}>
          <span style={{ background: '#E8C77A' }} />
          <span style={{ background: '#A66BFF', animationDelay: '.3s' }} />
          <span style={{ background: '#E8C77A', animationDelay: '.6s' }} />
        </div>
        <div style={{ marginTop: 20, color: 'var(--text-dim)', font: '400 13px/1.5 var(--font-body)', maxWidth: 240 }}>
          {settings.aiMode
            ? 'Sie verbindet sich mit den Worten und webt deine Botschaft …'
            : 'Sie sammelt die Schwingungen des heutigen Tages für dich …'}
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
        <Luna state="schlaf" width={200} glowSize={210} float={false} />
        <div className="h-serif" style={{ fontWeight: 600, fontSize: 21, marginTop: 8, lineHeight: 1.35, textAlign: 'center' }}>
          Die Sterne sind heute<br />von Wolken verhüllt.
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 13.5px/1.55 var(--font-body)', maxWidth: 250 }}>
          Versuch es in einem Moment noch einmal – sie zeigen sich gleich wieder.
        </div>
        <button className="btn-gold" style={{ marginTop: 24 }} onClick={draw}>Erneut versuchen</button>
        <button className="link-soft" style={{ marginTop: 14 }} onClick={() => nav('/dashboard')}>Später</button>
      </div>
    )

  if (phase === 'message' && message)
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 22px 22px', overflowY: 'auto' }} className="screen-scroll">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text)' }}>
          <button className="back" onClick={() => nav('/dashboard')} style={{ opacity: 0.6 }}>×</button>
          <span style={{ color: 'var(--text-dim)', font: '500 12px var(--font-body)' }}>{formatDate().short}</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span className="symbol-tile">{message.symbol.glyph}</span>
            <span style={{ color: '#7a7494', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>
              Dein Symbol · {message.symbol.name}
            </span>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 28, color: 'var(--gold-1)', textAlign: 'center', marginTop: 8, textShadow: '0 2px 16px rgba(232,199,122,.35)' }}>
          {message.title}
        </div>
        <div style={{ color: 'var(--text)', font: '400 13px/1.6 var(--font-body)', textAlign: 'center', marginTop: 8 }}>
          {message.text}
        </div>

        <div style={{ marginTop: 12, background: 'linear-gradient(160deg,rgba(232,199,122,.14),rgba(232,199,122,.05))', border: '1px solid rgba(232,199,122,.35)', borderRadius: 16, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ color: '#7a7494', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Dein Mantra</div>
          <div style={{ fontFamily: 'var(--font-head)', fontStyle: 'italic', fontWeight: 500, fontSize: 15, color: 'var(--gold-1)' }}>
            „{message.mantra}"
          </div>
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 9 }}>
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

        {saved && !saved.already && (
          <div className="banner pop">
            <Luna state="freude" width={46} glow={false} float={false} />
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--gold-1)', font: '700 13px var(--font-body)' }}>Im Tagebuch gespeichert ✓</div>
              <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginTop: 1 }}>
                +{saved.gainedDust} ✦ Sternenstaub · Serie auf {saved.newStreak} {saved.newStreak === 1 ? 'Tag' : 'Tage'}
              </div>
            </div>
          </div>
        )}

        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 18, color: 'var(--text)', lineHeight: 1.35, marginTop: saved && !saved.already ? 18 : 4 }}>
          {message.reflection}
        </div>

        <textarea
          className="note"
          style={{ marginTop: 12, flex: 1 }}
          placeholder="Schreibe, was in dir nachklingt …"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          readOnly={Boolean(saved)}
          autoFocus={!saved}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ color: '#7a7494', font: '400 11px var(--font-body)' }}>Nur für dich · local-first gespeichert</span>
          <span style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)' }}>{note.length} Zeichen</span>
        </div>

        <button className="btn-gold" style={{ marginTop: 12 }} disabled={Boolean(saved)} onClick={save}>
          {saved ? 'Gespeichert ✓' : 'Im Tagebuch speichern'}
        </button>
      </div>
    )

  return null
}
