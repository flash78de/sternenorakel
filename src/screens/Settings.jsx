import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { THEMES, MONTHS, zodiacOf } from '../data/library.js'

const TONES = [
  { key: 'Sanft', desc: 'Warm und einfühlsam' },
  { key: 'Poetisch', desc: 'Wie ein kleiner Sternenimpuls' },
  { key: 'Kurz & klar', desc: 'Direkt und wertschätzend' },
]

export default function Settings() {
  const nav = useNavigate()
  const { settings, updateSettings, profile, updateProfile } = useStore()

  // Editier-Status (local-first, sofort persistiert)
  const [name, setName] = useState(profile.name || '')
  const [day, setDay] = useState(profile.birth?.day || '')
  const [month, setMonth] = useState(profile.birth?.month || '')
  const [year, setYear] = useState(profile.birth?.year || '')

  const years = useMemo(() => {
    const now = new Date().getFullYear()
    return Array.from({ length: 100 }, (_, i) => now - 13 - i)
  }, [])

  const zodiac = useMemo(() => zodiacOf(Number(day), Number(month)), [day, month])

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
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)' }}>
        <button className="back" onClick={() => nav('/profil')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 18 }}>Einstellungen</span>
      </div>

      {/* Über dich – editierbar */}
      <div className="glass" style={{ marginTop: 14, padding: '14px 15px' }}>
        <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Über dich</div>

        <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginBottom: 6 }}>Name</div>
        <input className="field" placeholder="Dein Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => updateProfile({ name: name.trim() })} />

        <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', margin: '14px 0 6px' }}>Geburtstag</div>
        <div className="dob">
          <div className="col">
            <select value={day} onChange={(e) => { setDay(e.target.value); saveBirth(e.target.value, month, year) }} aria-label="Tag">
              <option value="">–</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <label>TAG</label>
          </div>
          <div className="col" style={{ flex: 1.4 }}>
            <select value={month} onChange={(e) => { setMonth(e.target.value); saveBirth(day, e.target.value, year) }} aria-label="Monat" style={{ fontSize: 16 }}>
              <option value="">–</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <label style={{ color: month ? 'var(--gold-1)' : undefined }}>MONAT</label>
          </div>
          <div className="col" style={{ flex: 1.2 }}>
            <select value={year} onChange={(e) => { setYear(e.target.value); saveBirth(day, month, e.target.value) }} aria-label="Jahr" style={{ fontSize: 18 }}>
              <option value="">–</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <label>JAHR</label>
          </div>
        </div>
        {zodiac && day && month && (
          <div className="zodiac-card" style={{ marginTop: 14 }}>
            <span style={{ fontSize: 26, lineHeight: 1 }}>{zodiac.symbol}</span>
            <div>
              <div style={{ color: '#7a7494', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Dein Sternzeichen · automatisch</div>
              <div style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 18, fontWeight: 600, marginTop: 2 }}>{zodiac.name}</div>
            </div>
          </div>
        )}
      </div>

      {/* Themen – editierbar (max 3) */}
      <div className="glass" style={{ marginTop: 12, padding: '14px 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Deine Themen</span>
          <span style={{ color: 'var(--purple-2)', font: '600 11px var(--font-body)' }}>bis zu 3</span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {THEMES.map((t) => (
            <span key={t} className={'chip' + ((profile.themes || []).includes(t) ? ' sel' : '')} onClick={() => toggleTheme(t)}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 11.5px var(--font-body)' }}>Luna stimmt deine Botschaften darauf ab.</div>
      </div>

      {/* Ton – editierbar */}
      <div className="glass" style={{ marginTop: 12, padding: '14px 15px' }}>
        <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Stimmung & Ton</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {TONES.map((t) => (
            <button key={t.key}
              onClick={() => updateSettings({ tone: t.key })}
              style={{
                flex: 1, textAlign: 'left', cursor: 'pointer', borderRadius: 14, padding: '11px 12px',
                background: settings.tone === t.key ? 'rgba(166,107,255,.16)' : 'rgba(10,10,31,.5)',
                border: '1px solid ' + (settings.tone === t.key ? 'var(--gold-1)' : 'rgba(167,139,250,.28)'),
              }}>
              <div style={{ color: settings.tone === t.key ? 'var(--gold-1)' : 'var(--text)', font: '600 12.5px var(--font-body)' }}>{t.key}</div>
              <div style={{ color: 'var(--text-dim)', font: '400 10px/1.35 var(--font-body)', marginTop: 3 }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tägliche Erinnerung */}
      <div style={{ marginTop: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <img src="/uploads/luna-schlaf-transparent.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>Tägliche Erinnerung</div>
          <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginTop: 1 }}>
            Jeden Abend um <b style={{ color: 'var(--gold-1)' }}>{settings.reminderTime}</b>
          </div>
        </div>
        <span className={'toggle' + (settings.reminder ? ' on' : '')} onClick={() => updateSettings({ reminder: !settings.reminder })}>
          <span className="knob" />
        </span>
      </div>

      {/* Premium */}
      <div style={{ marginTop: 12, background: 'linear-gradient(150deg,rgba(232,199,122,.2),rgba(232,199,122,.05))', border: '1px solid rgba(232,199,122,.4)', borderRadius: 18, padding: '14px 16px', boxShadow: '0 8px 26px rgba(232,199,122,.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--gold-1)', fontSize: 16 }}>✦</span>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 16, color: 'var(--gold-1)' }}>Sternenorakel Plus</span>
        </div>
        <div style={{ marginTop: 8, color: 'var(--text)', font: '400 12px/1.7 var(--font-body)' }}>
          Unbegrenzt ziehen · alle Rituale &amp; Sternbilder · tiefere Botschaften &amp; Monatsrückblick · Export
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-dim)', font: '500 12px var(--font-body)' }}>
            <b style={{ color: 'var(--text)', fontSize: 16 }}>3,99 €</b> / Monat
          </span>
          <button style={{ background: 'linear-gradient(135deg,#E8C77A,#D9B45A)', color: 'var(--gold-ink)', font: '700 12px var(--font-body)', padding: '9px 18px', borderRadius: 12, border: 'none', boxShadow: '0 6px 16px rgba(232,199,122,.3)', cursor: 'pointer' }}>
            Plus entdecken
          </button>
        </div>
      </div>

      {/* Privatsphäre */}
      <button className="list-row" style={{ marginTop: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16 }} onClick={() => nav('/profil/privacy')}>
        <span>🔒 Daten &amp; Privatsphäre</span>
        <span className="meta">Export · Löschen ›</span>
      </button>

      {/* Therapie-Hinweis */}
      <div className="glass-purple" style={{ marginTop: 12, padding: '11px 13px' }}>
        <div style={{ color: 'var(--gold-1)', font: '600 11px var(--font-body)', marginBottom: 3 }}>Ein ehrliches Wort von Luna</div>
        <div style={{ color: 'var(--text-dim)', font: '400 11px/1.5 var(--font-body)' }}>
          Ich bin ein weiser Begleiter – kein Ersatz für Therapie. Wenn es dir schwer fällt, sprich mit einem Menschen.{' '}
          <b style={{ color: 'var(--text)', fontWeight: 600 }}>Telefonseelsorge: 0800 111 0 111</b>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10px var(--font-body)', paddingTop: 12 }}>
        Sternenorakel · v1.0 · local-first
      </div>
    </div>
  )
}
