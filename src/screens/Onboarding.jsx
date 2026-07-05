import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna, { LunaAvatar } from '../components/Luna.jsx'
import DarkPicker from '../components/DarkPicker.jsx'
import { useStore } from '../store/store.jsx'
import { THEMES, MONTHS, zodiacOf } from '../data/library.js'
import { COMM_STYLES, COPING, generateLichtpunkt } from '../data/generator.js'

// ============================================================
// Onboarding als erste Begegnung mit Luna (kein Formular):
// Versprechen → Name → Befinden → Themen → Stil → Umgang →
// Geburtstag (optional) → Erster Lichtpunkt (Nutzen beweisen).
// Jeder Schritt reagiert sichtbar auf die Eingabe.
// ============================================================

const STEPS = 8

const MOODS = [
  { v: 5, label: 'Voller Energie', d: 'hell und offen', react: 'Da ist heute Bewegung in dir.' },
  { v: 4, label: 'Wach', d: 'aufmerksam, in Bewegung', react: 'Wach und da – ein guter Anfang.' },
  { v: 3, label: 'Ausgeglichen', d: 'ruhig in der Mitte', react: 'Eine ruhige Mitte ist ein schöner Ort.' },
  { v: 2, label: 'Müde', d: 'gedämpft, ruhebedürftig', react: 'Dann machen wir es heute leichter.' },
  { v: 1, label: 'Erschöpft', d: 'leer, kraftlos', react: 'Dann machen wir es heute sanft.' },
]

export default function Onboarding() {
  const nav = useNavigate()
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState(0)

  const [name, setName] = useState('')
  const [mood, setMood] = useState(null)
  const [themes, setThemes] = useState([])
  const [styles, setStyles] = useState([])
  const [coping, setCoping] = useState(null)
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [skipAstro, setSkipAstro] = useState(false)

  const zodiac = useMemo(() => zodiacOf(Number(day), Number(month)), [day, month])
  const years = useMemo(() => {
    const now = new Date().getFullYear()
    return Array.from({ length: 100 }, (_, i) => now - 13 - i)
  }, [])

  // Erster Lichtpunkt — einmal pro Ankunft auf dem letzten Schritt erzeugen
  const lichtpunkt = useMemo(
    () => (step === 7 ? generateLichtpunkt({ name, mood: mood ?? 3, themes, styles, coping }) : null),
    [step] // eslint-disable-line
  )

  const back = () => (step === 0 ? nav('/welcome') : setStep((s) => s - 1))

  const toggleTheme = (t) =>
    setThemes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : cur.length >= 3 ? cur : [...cur, t]))
  const toggleStyle = (k) =>
    setStyles((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : cur.length >= 2 ? cur : [...cur, k]))

  const canNext =
    step === 0 ? true :
    step === 1 ? true : // Name optional
    step === 2 ? mood != null :
    step === 3 ? themes.length > 0 :
    step === 4 ? styles.length > 0 :
    step === 5 ? Boolean(coping) :
    step === 6 ? (skipAstro || Boolean(day && month && year)) :
    true

  const next = () => {
    if (!canNext) return
    if (step < STEPS - 1) { setStep((s) => s + 1); return }
    completeOnboarding({
      name: name.trim().slice(0, 30),
      themes,
      mood: mood ?? 3,
      commStyles: styles,
      coping,
      birth: skipAstro ? { day: null, month: null, year: null } : { day: Number(day) || null, month: Number(month) || null, year: Number(year) || null },
      zodiac: skipAstro ? null : zodiac,
    })
    nav('/dashboard', { replace: true })
  }

  const selMood = MOODS.find((m) => m.v === mood)

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <button className="back" onClick={back} aria-label="Zurück">‹</button>
        <div className="steps">
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={i <= step ? 'on' : ''} />
          ))}
        </div>
      </div>

      {/* 0 · Das Versprechen: Empfangen → Reflektieren → Erkennen */}
      {step === 0 && (
        <StepWrap key="s0">
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Luna state="idle" width={150} glowSize={188} float />
          </div>
          <div className="title-lg" style={{ textAlign: 'center', marginTop: 4 }}>
            So begleitet dich Luna
          </div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[
              { g: '✦', t: 'Empfangen', d: 'Du erhältst einen täglichen Impuls.' },
              { g: '☾', t: 'Reflektieren', d: 'Du entscheidest, was davon zu dir passt.' },
              { g: '✧', t: 'Erkennen', d: 'Mit der Zeit werden wiederkehrende Themen sichtbar.' },
            ].map((x) => (
              <div key={x.t} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '13px 15px' }}>
                <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 12, display: 'grid', placeItems: 'center', fontSize: 17, color: 'var(--gold-1)', background: 'rgba(232,199,122,.1)', border: '1px solid rgba(232,199,122,.3)' }}>{x.g}</span>
                <span>
                  <span style={{ display: 'block', color: 'var(--gold-1)', font: '700 14px var(--font-body)' }}>{x.t}</span>
                  <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)', marginTop: 1 }}>{x.d}</span>
                </span>
              </div>
            ))}
          </div>
          {/* Dezenter Ausblick auf die größere Welt – keine Feature-Liste, nur ein Versprechen */}
          <div style={{ marginTop: 12, textAlign: 'center', color: 'var(--text-dim)', font: '500 12px/1.6 var(--font-body)' }}>
            Und wenn du mehr willst: <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>Karten, Runen, die Chakren-Reise
            und eine Sofort-Hilfe</b> warten schon auf dich.
          </div>
          <div style={{ marginTop: 10, color: '#7a7494', font: '400 11.5px/1.55 var(--font-body)', textAlign: 'center' }}>
            Luna sagt dir nicht voraus, was passieren wird. Sie hilft dir, einen Gedanken zu hören, der im Alltag
            vielleicht zu leise ist. Und alles, was du ihr anvertraust, bleibt auf deinem Gerät.
          </div>
        </StepWrap>
      )}

      {/* 1 · Name (optional, mit direkter Luna-Reaktion) */}
      {step === 1 && (
        <StepWrap key="s1">
          <div style={{ textAlign: 'center', margin: '16px 0 4px' }}>
            <LunaAvatar size={100} />
          </div>
          <div className="title-lg" style={{ textAlign: 'center', marginTop: 8 }}>
            Wie darf ich<br />dich nennen?
          </div>
          <div style={{ marginTop: 6, color: 'var(--purple-2)', font: '600 12px var(--font-body)', textAlign: 'center' }}>
            Dein Name oder Sternenname · optional
          </div>
          <input
            className="field"
            style={{ marginTop: 16 }}
            placeholder="Dein Name (optional)"
            value={name}
            maxLength={30}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && next()}
          />
          {name.trim() && (
            <div className="pop" style={{ marginTop: 14, textAlign: 'center', color: 'var(--gold-1)', font: '600 13.5px var(--font-body)' }}>
              „Schön, dich kennenzulernen, {name.trim()}." ✦
            </div>
          )}
          <div className="glass-purple" style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start', padding: '13px 15px' }}>
            <span style={{ color: 'var(--purple-2)', fontSize: 15, lineHeight: 1.2 }}>✦</span>
            <div style={{ color: 'var(--text-dim)', font: '400 12px/1.55 var(--font-body)' }}>
              Ich bin dein Sternenwesen und dein <b style={{ color: 'var(--text)', fontWeight: 600 }}>Spiegel</b> – kein Wahrsager. Was du hier liest, sind Impulse zum Nachdenken.
            </div>
          </div>
        </StepWrap>
      )}

      {/* 2 · Befinden (Luna reagiert sichtbar auf die Auswahl) */}
      {step === 2 && (
        <StepWrap key="s2">
          <div style={{ textAlign: 'center', marginTop: 2 }}>
            <Luna state={mood != null && mood <= 2 ? 'schlaf' : 'idle'} width={110} glowSize={140} float />
          </div>
          <div className="title-lg" style={{ textAlign: 'center', marginTop: 2 }}>
            Wie fühlst du<br />dich heute?
          </div>
          <div style={{ minHeight: 22, marginTop: 6, textAlign: 'center' }}>
            {selMood ? (
              <span className="pop" style={{ color: 'var(--gold-1)', font: '600 13px var(--font-body)', display: 'inline-block' }}>„{selMood.react}"</span>
            ) : (
              <span style={{ color: 'var(--text-dim)', font: '400 12.5px var(--font-body)' }}>Ganz ehrlich – es gibt kein richtig oder falsch.</span>
            )}
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {MOODS.map((m) => {
              const on = mood === m.v
              return (
                <button key={m.v} onClick={() => setMood(m.v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', borderRadius: 15, padding: '11px 14px',
                    background: on ? 'linear-gradient(150deg,rgba(232,199,122,.18),rgba(232,199,122,.05))' : 'rgba(255,255,255,.04)',
                    border: '1px solid ' + (on ? 'var(--gold-1)' : 'rgba(255,255,255,.1)'),
                  }}>
                  <span style={{ width: 32, height: 32, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', font: '700 14px var(--font-body)', background: on ? 'linear-gradient(135deg,#E8C77A,#D9B45A)' : 'transparent', border: on ? 'none' : '1.5px solid rgba(166,107,255,.5)', color: on ? 'var(--gold-ink)' : 'var(--purple-2)' }}>{m.v}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', color: on ? 'var(--gold-1)' : 'var(--text)', font: '600 14px var(--font-body)' }}>{m.label}</span>
                    <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 11px var(--font-body)' }}>{m.d}</span>
                  </span>
                  {on && <span style={{ color: 'var(--gold-1)' }}>✦</span>}
                </button>
              )
            })}
          </div>
        </StepWrap>
      )}

      {/* 3 · Themen */}
      {step === 3 && (
        <StepWrap key="s3">
          <div style={{ textAlign: 'center', margin: '8px 0 2px' }}>
            <Luna state="lauschen" width={112} glowSize={145} float />
          </div>
          <div className="title-lg" style={{ textAlign: 'center' }}>
            Was beschäftigt<br />dich gerade?
          </div>
          <div style={{ marginTop: 7, color: 'var(--purple-2)', font: '600 12px var(--font-body)', textAlign: 'center' }}>
            {themes.length > 0 ? `${themes.length} von 3 gewählt` : 'bis zu 3 wählen'}
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {THEMES.map((t) => (
              <span key={t} className={'chip' + (themes.includes(t) ? ' sel' : '')} onClick={() => toggleTheme(t)}>{t}</span>
            ))}
          </div>
          <div style={{ marginTop: 14, color: 'var(--text-dim)', font: '400 12px/1.5 var(--font-body)', textAlign: 'center' }}>
            Ich werde diese Themen nicht bewerten. Ich achte nur darauf, welche davon bei dir wiederkehren.
          </div>
        </StepWrap>
      )}

      {/* 4 · Kommunikationsstil */}
      {step === 4 && (
        <StepWrap key="s4">
          <div className="title-lg" style={{ textAlign: 'center', marginTop: 14 }}>
            Wie sollen meine Botschaften<br />mit dir sprechen?
          </div>
          <div style={{ marginTop: 7, color: 'var(--purple-2)', font: '600 12px var(--font-body)', textAlign: 'center' }}>
            wähle 1–2 Stile
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {COMM_STYLES.map((s) => {
              const on = styles.includes(s.key)
              return (
                <button key={s.key} onClick={() => toggleStyle(s.key)}
                  style={{
                    textAlign: 'left', cursor: 'pointer', borderRadius: 16, padding: '13px 15px',
                    background: on ? 'linear-gradient(150deg,rgba(232,199,122,.18),rgba(232,199,122,.05))' : 'rgba(255,255,255,.04)',
                    border: '1px solid ' + (on ? 'var(--gold-1)' : 'rgba(255,255,255,.1)'),
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: on ? 'var(--gold-1)' : 'var(--text)', font: '700 14px var(--font-body)' }}>{s.label}</span>
                    {on && <span style={{ color: 'var(--gold-1)' }}>✦</span>}
                  </div>
                  <div style={{ color: 'var(--text-dim)', font: '400 12px/1.45 var(--font-body)', marginTop: 3, fontStyle: 'italic' }}>„{s.desc}"</div>
                </button>
              )
            })}
          </div>
        </StepWrap>
      )}

      {/* 5 · Umgang mit Herausforderungen */}
      {step === 5 && (
        <StepWrap key="s5">
          <div className="title-lg" style={{ textAlign: 'center', marginTop: 14 }}>
            Was hilft dir eher,<br />wenn etwas schwierig ist?
          </div>
          <div style={{ marginTop: 7, color: 'var(--purple-2)', font: '600 12px var(--font-body)', textAlign: 'center' }}>
            Das verändert, wie Luna ihre Impulse beendet.
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {COPING.map((c) => {
              const on = coping === c.key
              return (
                <button key={c.key} onClick={() => setCoping(c.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', cursor: 'pointer', borderRadius: 16, padding: '14px 15px',
                    background: on ? 'linear-gradient(150deg,rgba(232,199,122,.18),rgba(232,199,122,.05))' : 'rgba(255,255,255,.04)',
                    border: '1px solid ' + (on ? 'var(--gold-1)' : 'rgba(255,255,255,.1)'),
                  }}>
                  <span style={{ fontSize: 20 }}>{c.glyph}</span>
                  <span style={{ flex: 1, color: on ? 'var(--gold-1)' : 'var(--text)', font: '600 13.5px var(--font-body)' }}>{c.label}</span>
                  {on && <span style={{ color: 'var(--gold-1)' }}>✦</span>}
                </button>
              )
            })}
          </div>
        </StepWrap>
      )}

      {/* 6 · Geburtstag (optional, ehrlich als Symbolsprache) */}
      {step === 6 && (
        <StepWrap key="s6">
          <div style={{ textAlign: 'center', marginTop: 6 }}>
            <Luna state="idle" width={110} glowSize={140} float />
          </div>
          <div className="title-lg" style={{ textAlign: 'center', marginTop: 2 }}>
            Möchtest du dein Sternzeichen<br />einbeziehen?
          </div>
          <div style={{ marginTop: 8, color: 'var(--text-dim)', font: '400 12.5px/1.5 var(--font-body)', textAlign: 'center' }}>
            Als zusätzliche Symbolsprache – nicht als Vorhersage. (Später im Profil änderbar.)
          </div>
          {!skipAstro && (
            <>
              <div className="dob" style={{ marginTop: 18 }}>
                <DarkPicker label="TAG" ariaLabel="Tag" value={day} onChange={setDay}
                  options={Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))} />
                <DarkPicker label="MONAT" ariaLabel="Monat" flex={1.6} valueSize={16} value={month} onChange={setMonth}
                  options={MONTHS.map((mn, i) => ({ value: i + 1, label: mn }))} />
                <DarkPicker label="JAHR" ariaLabel="Jahr" flex={1.2} value={year} onChange={setYear}
                  options={years.map((y) => ({ value: y, label: String(y) }))} />
              </div>
              {zodiac && day && month && (
                <div className="zodiac-card pop" style={{ marginTop: 16 }}>
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{zodiac.symbol}</span>
                  <div>
                    <div style={{ color: '#7a7494', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Dein symbolisches Sternzeichen</div>
                    <div style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 19, fontWeight: 600, marginTop: 2 }}>{zodiac.name}</div>
                  </div>
                </div>
              )}
            </>
          )}
          <button className="link-soft" style={{ marginTop: 16 }} onClick={() => { setSkipAstro((v) => !v) }}>
            {skipAstro ? 'Doch Geburtstag eingeben' : 'Ohne Astrologie fortfahren'}
          </button>
          {skipAstro && (
            <div className="pop" style={{ marginTop: 10, textAlign: 'center', color: 'var(--text-dim)', font: '400 12px var(--font-body)' }}>
              Gut – Luna arbeitet dann nur mit deinen Themen und deinem Befinden. ✦
            </div>
          )}
        </StepWrap>
      )}

      {/* 7 · Dein erster Lichtpunkt (Nutzen beweisen, bevor es weitergeht) */}
      {step === 7 && lichtpunkt && (
        <StepWrap key="s7">
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <Luna state="offenbarung" width={140} glowSize={180} float={false} burst />
          </div>
          <div style={{ textAlign: 'center', marginTop: 6, color: 'var(--purple-2)', font: '600 10px var(--font-body)', letterSpacing: 1.4, textTransform: 'uppercase' }}>
            Dein erster Lichtpunkt
          </div>
          <div className="glass" style={{ marginTop: 12, padding: '18px 18px' }}>
            <div style={{ color: 'var(--text)', font: '400 14.5px/1.7 var(--font-body)', textAlign: 'center' }}>
              {lichtpunkt.text}
            </div>
          </div>
          <div style={{ marginTop: 12, textAlign: 'center', color: 'var(--gold-1)', font: '600 12px var(--font-body)' }}>
            {lichtpunkt.styleNote}
          </div>
          <div style={{ marginTop: 14, color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', textAlign: 'center' }}>
            Jedes Innehalten wird ein Stern in eurem gemeinsamen Sternenband – und mit jedem Stern
            öffnen sich neue Kapitel deiner Geschichte.
          </div>
        </StepWrap>
      )}

      <div style={{ flex: 1, minHeight: 12 }} />
      <button className="btn-gold" disabled={!canNext} onClick={next}>
        {step === 0 ? 'Zeig mir, wie das funktioniert' : step === STEPS - 1 ? 'Mein Sternenband beginnen ✦' : 'Weiter'}
      </button>
    </div>
  )
}

function StepWrap({ children }) {
  return <div className="fade-up" style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
}
