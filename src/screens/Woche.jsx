import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

// Wochenrückblick (Basis · gratis) — sichtbarer Langzeitnutzen:
// „Heute ein Lichtpunkt. Mit der Zeit dein Sternbild."
// Wird ab 4 Einträgen in den letzten 7 Tagen wirklich aussagekräftig.
const MOOD_LABEL = { 1: 'erschöpft', 2: 'müde', 3: 'ausgeglichen', 4: 'wach', 5: 'voller Energie' }

export default function Woche() {
  const nav = useNavigate()
  const { journal, settings } = useStore()

  const week = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000
    const entries = journal.filter((e) => e.ts >= cutoff)
    const themeCount = {}
    const moodVals = []
    let reflected = 0
    for (const e of entries) {
      if (e.theme) themeCount[e.theme] = (themeCount[e.theme] || 0) + 1
      if (e.mood) moodVals.push(e.mood)
      if ((e.reflection || '').trim()) reflected++
    }
    const topThemes = Object.entries(themeCount).sort((a, b) => b[1] - a[1]).slice(0, 3)
    const avgMood = moodVals.length ? Math.round(moodVals.reduce((a, b) => a + b, 0) / moodVals.length) : null
    return { entries, topThemes, avgMood, reflected }
  }, [journal])

  const enough = week.entries.length >= 4

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/dashboard')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Deine Woche mit Luna</span>
      </div>

      {!enough ? (
        <div className="center-col" style={{ flex: 1, padding: '20px 10px' }}>
          <Luna state="lauschen" width={150} glowSize={185} float />
          <div className="h-serif" style={{ fontWeight: 600, fontSize: 19, marginTop: 10, textAlign: 'center' }}>
            Dein Wochenmuster<br />entsteht gerade.
          </div>
          <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 13px/1.6 var(--font-body)', textAlign: 'center', maxWidth: 270 }}>
            Noch <b style={{ color: 'var(--gold-1)' }}>{Math.max(0, 4 - week.entries.length)}</b> {4 - week.entries.length === 1 ? 'Botschaft' : 'Botschaften'}, dann kann Luna dir zeigen, welche Themen sich in deiner Woche wiederholen.
          </div>
          <button className="btn-gold" style={{ marginTop: 24, width: 'auto', padding: '13px 26px' }} onClick={() => nav('/oracle/befinden')}>
            ✦ Heute weitersammeln
          </button>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Luna state="offenbarung" width={110} glowSize={140} float={false} />
          </div>

          <div className="glass" style={{ marginTop: 12, padding: '14px 16px' }}>
            <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Diese Woche</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, textAlign: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--gold-1)', font: '700 20px var(--font-body)' }}>{week.entries.length}</div>
                <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)' }}>Botschaften</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--gold-1)', font: '700 20px var(--font-body)' }}>{week.reflected}</div>
                <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)' }}>Reflexionen</div>
              </div>
              {week.avgMood && (
                <div style={{ flex: 1.4 }}>
                  <div style={{ color: 'var(--gold-1)', font: '700 20px var(--font-body)' }}>{week.avgMood}/5</div>
                  <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)' }}>meist {MOOD_LABEL[week.avgMood]}</div>
                </div>
              )}
            </div>
          </div>

          {week.topThemes.length > 0 && (
            <div className="glass" style={{ marginTop: 12, padding: '14px 16px' }}>
              <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Wiederkehrende Themen</div>
              {week.topThemes.map(([t, n]) => (
                <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 }}>
                  <span style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>{t}</span>
                  <span style={{ color: 'var(--purple-2)', font: '600 12px var(--font-body)' }}>{n}×</span>
                </div>
              ))}
              <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 11.5px/1.5 var(--font-body)', fontStyle: 'italic' }}>
                „{week.topThemes[0][0]}" hat dich diese Woche am häufigsten begleitet. Das ist kein Urteil – nur ein Lichtpunkt, der öfter aufleuchtet.
              </div>
            </div>
          )}

          <div className="glass-purple" style={{ marginTop: 12, padding: '13px 15px' }}>
            <div style={{ color: 'var(--gold-1)', font: '600 11px var(--font-body)', marginBottom: 4 }}>Luna sagt</div>
            <div style={{ color: 'var(--text-dim)', font: '400 12px/1.55 var(--font-body)' }}>
              Du hast dir diese Woche {week.entries.length} Momente genommen. Nicht jede Antwort ist schon da – aber deine Fragen werden klarer. Das ist der eigentliche Weg.
            </div>
          </div>

          <div style={{ marginTop: 12, cursor: 'pointer', background: 'linear-gradient(150deg,rgba(232,199,122,.14),rgba(232,199,122,.04))', border: '1px solid rgba(232,199,122,.35)', borderRadius: 14, padding: '12px 14px' }} onClick={() => nav('/monat')}>
            <div style={{ color: 'var(--gold-1)', font: '600 12px var(--font-body)' }}>✦ {settings.premium ? 'Dein Monatsbild ansehen ›' : 'Mit Plus: dein Monatsbild'}</div>
            <div style={{ color: 'var(--text-dim)', font: '400 11px/1.45 var(--font-body)', marginTop: 3 }}>
              Luna führt deine Einträge über Wochen zusammen – Stimmungsverlauf, wiederkehrende Symbole und ein persönlicher Rückblick.
            </div>
          </div>
        </>
      )}
    </div>
  )
}
