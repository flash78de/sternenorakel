import { useMemo, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { THEMES, MONTHS, zodiacOf, isUnder16 } from '../data/library.js'
import { COMM_STYLES, COPING } from '../data/generator.js'
import DarkPicker from '../components/DarkPicker.jsx'

// Einstellungen-Untersektionen: du · themen · ton · ki (Hub: Settings.jsx)

const TONES = [
  { key: 'Sanft', desc: 'Warm und einfühlsam' },
  { key: 'Poetisch', desc: 'Wie ein kleiner Sternenimpuls' },
  { key: 'Kurz & klar', desc: 'Direkt und wertschätzend' },
]

const TITEL = { du: 'Über dich', themen: 'Deine Themen', ton: 'Lunas Ton & Stil', ki: 'KI-Botschaften' }

export default function SettingsSektion() {
  const nav = useNavigate()
  const { sektion } = useParams()
  const { settings, updateSettings, profile, updateProfile } = useStore()

  const [name, setName] = useState(profile.name || '')
  const [day, setDay] = useState(profile.birth?.day || '')
  const [month, setMonth] = useState(profile.birth?.month || '')
  const [year, setYear] = useState(profile.birth?.year || '')

  const years = useMemo(() => {
    const now = new Date().getFullYear()
    return Array.from({ length: 100 }, (_, i) => now - 13 - i)
  }, [])
  const zodiac = useMemo(() => zodiacOf(Number(day), Number(month)), [day, month])

  if (!TITEL[sektion]) return <Navigate to="/profil/settings" replace />

  const saveBirth = (d, m, y) => {
    updateProfile({
      birth: { day: Number(d) || null, month: Number(m) || null, year: Number(y) || null },
      zodiac: zodiacOf(Number(d), Number(m)),
    })
  }

  const toggleTheme = (t) => {
    const cur = profile.themes || []
    let next
    if (cur.includes(t)) next = cur.filter((x) => x !== t)
    else if (cur.length >= 3) return
    else next = [...cur, t]
    updateProfile({ themes: next })
  }

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)' }}>
        <button className="back" onClick={() => nav('/profil/settings')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 19 }}>{TITEL[sektion]}</span>
      </div>

      {sektion === 'du' && (
        <div className="glass" style={{ marginTop: 14, padding: '15px 16px' }}>
          <div style={{ color: 'var(--text-dim)', font: '500 13px var(--font-body)', marginBottom: 6 }}>Name</div>
          <input className="field" placeholder="Dein Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => updateProfile({ name: name.trim() })} />

          <div style={{ color: 'var(--text-dim)', font: '500 13px var(--font-body)', margin: '16px 0 6px' }}>Geburtstag</div>
          <div className="dob">
            <DarkPicker label="TAG" ariaLabel="Tag" value={day} onChange={(v) => { setDay(v); saveBirth(v, month, year) }}
              options={Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))} />
            <DarkPicker label="MONAT" ariaLabel="Monat" flex={1.6} valueSize={16} value={month} onChange={(v) => { setMonth(v); saveBirth(day, v, year) }}
              options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))} />
            <DarkPicker label="JAHR" ariaLabel="Jahr" flex={1.2} value={year} onChange={(v) => { setYear(v); saveBirth(day, month, v) }}
              options={years.map((y) => ({ value: y, label: String(y) }))} />
          </div>
          {zodiac && day && month && (
            <div className="zodiac-card" style={{ marginTop: 14 }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>{zodiac.symbol}</span>
              <div>
                <div style={{ color: '#8a83a6', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Dein Sternzeichen · automatisch</div>
                <div style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 19, fontWeight: 600, marginTop: 2 }}>{zodiac.name}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {sektion === 'themen' && (
        <div className="glass" style={{ marginTop: 14, padding: '15px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: 'var(--text)', font: '600 14px var(--font-body)' }}>Was dich gerade beschäftigt</span>
            <span style={{ color: 'var(--purple-2)', font: '600 12.5px var(--font-body)' }}>bis zu 3</span>
          </div>
          <div style={{ marginTop: 13, display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {THEMES.map((t) => (
              <span key={t} className={'chip' + ((profile.themes || []).includes(t) ? ' sel' : '')} onClick={() => toggleTheme(t)}>{t}</span>
            ))}
          </div>
          <div style={{ marginTop: 12, color: 'var(--text-dim)', font: '400 13px/1.5 var(--font-body)' }}>Luna stimmt deine Botschaften darauf ab.</div>
        </div>
      )}

      {sektion === 'ton' && (
        <>
          <div className="glass" style={{ marginTop: 14, padding: '15px 16px' }}>
            <div style={{ color: 'var(--text)', font: '600 14px var(--font-body)', marginBottom: 11 }}>Stimmung & Ton</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TONES.map((t) => (
                <button key={t.key}
                  onClick={() => updateSettings({ tone: t.key })}
                  style={{
                    textAlign: 'left', cursor: 'pointer', borderRadius: 14, padding: '12px 14px',
                    background: settings.tone === t.key ? 'rgba(166,107,255,.16)' : 'rgba(10,10,31,.5)',
                    border: '1px solid ' + (settings.tone === t.key ? 'var(--gold-1)' : 'rgba(167,139,250,.28)'),
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                  <span>
                    <span style={{ display: 'block', color: settings.tone === t.key ? 'var(--gold-1)' : 'var(--text)', font: '600 14px var(--font-body)' }}>{t.key}</span>
                    <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)', marginTop: 2 }}>{t.desc}</span>
                  </span>
                  {settings.tone === t.key && <span style={{ color: 'var(--gold-1)' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="glass" style={{ marginTop: 12, padding: '15px 16px' }}>
            <div style={{ color: 'var(--text)', font: '600 14px var(--font-body)', marginBottom: 10 }}>Wie Luna mit dir spricht</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {COMM_STYLES.map((s) => {
                const cur = profile.commStyles || []
                const on = cur.includes(s.key)
                return (
                  <span key={s.key} className={'chip' + (on ? ' sel' : '')}
                    onClick={() => {
                      const next = on ? cur.filter((x) => x !== s.key) : cur.length >= 2 ? cur : [...cur, s.key]
                      updateProfile({ commStyles: next })
                    }}>{s.label}</span>
                )
              })}
            </div>
            <div style={{ margin: '14px 0 8px', color: 'var(--text)', font: '600 14px var(--font-body)' }}>Was dir bei Schwierigem hilft</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {COPING.map((c) => (
                <span key={c.key} className={'chip' + (profile.coping === c.key ? ' sel' : '')}
                  onClick={() => updateProfile({ coping: profile.coping === c.key ? null : c.key })}>{c.glyph} {c.label}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {sektion === 'ki' && (
        <div className="glass" style={{ marginTop: 14, padding: '15px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ color: 'var(--text)', font: '600 15px var(--font-body)' }}>KI-Modus</div>
            {/* Aktives Einschalten = Einwilligung, Ausschalten = Widerruf (DSGVO) */}
            <span className={'toggle' + (settings.aiMode && settings.aiConsent === true ? ' on' : '')}
              onClick={() => (settings.aiMode && settings.aiConsent === true
                ? updateSettings({ aiMode: false, aiConsent: false })
                : updateSettings({ aiMode: true, aiConsent: true }))}>
              <span className="knob" />
            </span>
          </div>
          <div style={{ color: 'var(--text-dim)', font: '400 13px/1.6 var(--font-body)', marginTop: 10 }}>
            Luna formuliert deine Botschaft live mit KI – passend zu deinem gezogenen Ergebnis.
            Ohne Verbindung nutzt sie automatisch die Offline-Sternenbibliothek.
          </div>
          <div style={{ color: 'var(--text-dim)', font: '400 13px/1.6 var(--font-body)', marginTop: 8 }}>
            Übertragen werden nur Stimmung, Themen und das Ritual-Ergebnis –{' '}
            <b style={{ color: 'var(--text)' }}>nie dein Name oder deine Notizen.</b>{' '}
            Ohne Plus stehen dir die KI-Botschaften in den ersten 7 Sterntagen zur Verfügung.
          </div>
          {isUnder16(profile.birth) && (
            <div style={{ color: 'var(--gold-1)', font: '500 12.5px/1.55 var(--font-body)', marginTop: 10 }}>
              🛡️ Unter 16: Bitte nur gemeinsam mit einem Erziehungsberechtigten einschalten –
              das Aktivieren gilt als dessen Zustimmung zur Datenübertragung.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
