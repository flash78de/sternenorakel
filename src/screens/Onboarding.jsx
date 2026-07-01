import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna, { LunaAvatar } from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { THEMES, MONTHS, zodiacOf } from '../data/library.js'

// 4-Schritt-Flow: Name → Themen → Stimmung → Geburtstag (Sternzeichen automatisch)
export default function Onboarding() {
  const nav = useNavigate()
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState(0)

  const [name, setName] = useState('')
  const [themes, setThemes] = useState([])
  const [mood, setMood] = useState(3)
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const zodiac = useMemo(
    () => zodiacOf(Number(day), Number(month)),
    [day, month]
  )

  const years = useMemo(() => {
    const now = new Date().getFullYear()
    return Array.from({ length: 100 }, (_, i) => now - 13 - i)
  }, [])

  const back = () => (step === 0 ? nav('/welcome') : setStep((s) => s - 1))

  const toggleTheme = (t) => {
    setThemes((cur) => {
      if (cur.includes(t)) return cur.filter((x) => x !== t)
      if (cur.length >= 3) return cur
      return [...cur, t]
    })
  }

  const canNext =
    step === 0 ? true : // Name ist optional
    step === 1 ? themes.length > 0 :
    step === 2 ? true :
    Boolean(day && month && year)

  const next = () => {
    if (!canNext) return
    if (step < 3) {
      setStep((s) => s + 1)
      return
    }
    completeOnboarding({
      name: name.trim(),
      themes,
      mood,
      birth: { day: Number(day), month: Number(month), year: Number(year) },
      zodiac,
    })
    nav('/dashboard', { replace: true })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 26px 32px' }}>
      {/* Kopf: zurück + Fortschritt */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <button className="back" onClick={back} aria-label="Zurück">‹</button>
        <div className="steps">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={i <= step ? 'on' : ''} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <StepWrap key="s0">
          <div style={{ textAlign: 'center', margin: '20px 0 4px' }}>
            <LunaAvatar size={104} />
          </div>
          <div className="title-lg" style={{ textAlign: 'center', marginTop: 8 }}>
            Wie darf ich<br />dich nennen?
          </div>
          <div style={{ marginTop: 6, color: 'var(--purple-2)', font: '600 12px var(--font-body)', textAlign: 'center' }}>
            optional · jederzeit änderbar
          </div>
          <input
            className="field"
            style={{ marginTop: 16 }}
            placeholder="Dein Name (optional)"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && next()}
          />
          <div
            className="glass-purple"
            style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start', padding: '13px 15px' }}
          >
            <span style={{ color: 'var(--purple-2)', fontSize: 15, lineHeight: 1.2 }}>✦</span>
            <div style={{ color: 'var(--text-dim)', font: '400 12px/1.55 var(--font-body)' }}>
              Ich bin dein Sternenwesen und dein <b style={{ color: 'var(--text)', fontWeight: 600 }}>Spiegel</b> – kein
              Wahrsager. Was du hier liest, sind Impulse zum Nachdenken.
            </div>
          </div>
        </StepWrap>
      )}

      {step === 1 && (
        <StepWrap key="s1">
          <div style={{ textAlign: 'center', margin: '8px 0 2px' }}>
            <Luna state="lauschen" width={116} glowSize={150} float />
          </div>
          <div className="title-lg" style={{ textAlign: 'center' }}>
            Was beschäftigt<br />dich gerade?
          </div>
          <div style={{ marginTop: 7, color: 'var(--purple-2)', font: '600 12px var(--font-body)', textAlign: 'center' }}>
            bis zu 3 wählen
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 11, justifyContent: 'center' }}>
            {THEMES.map((t) => (
              <span
                key={t}
                className={'chip' + (themes.includes(t) ? ' sel' : '')}
                onClick={() => toggleTheme(t)}
              >
                {t}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 16, color: 'var(--text-dim)', font: '400 12.5px var(--font-body)', textAlign: 'center' }}>
            Luna stimmt deine Botschaften darauf ab.
          </div>
        </StepWrap>
      )}

      {step === 2 && (
        <StepWrap key="s2">
          <div style={{ textAlign: 'center', margin: '12px 0 2px' }}>
            <Luna state="idle" width={140} glowSize={170} float />
          </div>
          <div className="title-lg" style={{ textAlign: 'center' }}>
            Wie fühlst du<br />dich heute?
          </div>
          <div className="mood-row" style={{ marginTop: 24 }}>
            {[1, 2, 3, 4, 5].map((m) => (
              <button key={m} className={'mood' + (mood === m ? ' sel' : '')} onClick={() => setMood(m)}>
                {m}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', font: '400 12px var(--font-body)' }}>
            <span>erschöpft</span>
            <span>voller Energie</span>
          </div>
        </StepWrap>
      )}

      {step === 3 && (
        <StepWrap key="s3">
          <div className="title-lg" style={{ textAlign: 'center', marginTop: 26 }}>
            Wann bist du<br />geboren?
          </div>
          <div style={{ marginTop: 8, color: 'var(--text-dim)', font: '400 13px var(--font-body)', textAlign: 'center' }}>
            Daraus webt Luna deine persönlichen Impulse.
          </div>
          <div className="dob" style={{ marginTop: 26 }}>
            <div className="col">
              <select value={day} onChange={(e) => setDay(e.target.value)} aria-label="Tag">
                <option value="">–</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <label>TAG</label>
            </div>
            <div className="col" style={{ flex: 1.4 }}>
              <select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Monat" style={{ fontSize: 16 }}>
                <option value="">–</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <label style={{ color: month ? 'var(--gold-1)' : undefined }}>MONAT</label>
            </div>
            <div className="col" style={{ flex: 1.2 }}>
              <select value={year} onChange={(e) => setYear(e.target.value)} aria-label="Jahr" style={{ fontSize: 18 }}>
                <option value="">–</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <label>JAHR</label>
            </div>
          </div>

          {zodiac && day && month && (
            <div className="zodiac-card pop" style={{ marginTop: 20 }}>
              <span style={{ fontSize: 30, lineHeight: 1 }}>{zodiac.symbol}</span>
              <div>
                <div style={{ color: '#7a7494', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>
                  Dein Sternzeichen · automatisch
                </div>
                <div style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 20, fontWeight: 600, marginTop: 2 }}>
                  {zodiac.name}
                </div>
              </div>
            </div>
          )}
        </StepWrap>
      )}

      <div style={{ flex: 1 }} />
      <button className="btn-gold" disabled={!canNext} onClick={next}>
        {step === 3 ? 'Mein Orakel öffnen' : 'Weiter'}
      </button>
    </div>
  )
}

function StepWrap({ children }) {
  return <div className="fade-up" style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
}
