import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

// Monatsbild (Plus) — führt die Einträge der letzten 30 Tage zusammen:
// Themen, Stimmungsverlauf, Symbole, wiederkehrende Worte + Lunas Rückblick.
const STOP = new Set(['und','oder','aber','auch','dass','doch','denn','wenn','weil','wie','was','wer','wir','ich','du','er','sie','es','ihr','mich','mir','dich','dir','sich','uns','euch','mein','dein','sein','ihre','ihrer','eine','einen','einem','einer','eines','ein','der','die','das','den','dem','des','ist','bin','bist','sind','war','waren','wird','werden','wurde','habe','hast','hat','haben','hatte','kann','könnte','muss','soll','will','mag','nicht','kein','keine','noch','schon','sehr','mehr','heute','morgen','gestern','dann','also','nur','mal','so','zu','im','in','an','am','auf','aus','bei','mit','nach','von','vor','für','über','unter','um','durch','als','bis','es','man','da','hier','dort','jetzt','immer','wieder','etwas','nichts','alles','viel','wenig','gut','gerne'])

const MOOD_LABEL = { 1: 'erschöpft', 2: 'müde', 3: 'ausgeglichen', 4: 'wach', 5: 'voller Energie' }

export default function Monat() {
  const nav = useNavigate()
  const { journal, settings, profile } = useStore()

  const m = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000
    const entries = journal.filter((e) => e.ts >= cutoff)
    const reflected = entries.filter((e) => (e.reflection || '').trim())

    const themeCount = {}
    const symCount = {}
    const wordCount = {}
    const weekMoods = [[], [], [], []] // 4 Wochen-Buckets (0 = älteste)
    for (const e of entries) {
      if (e.theme) themeCount[e.theme] = (themeCount[e.theme] || 0) + 1
      const sym = e.archetype?.name || e.card?.title || e.symbol?.name
      if (sym) symCount[sym] = (symCount[sym] || 0) + 1
      if (e.mood) {
        const age = Math.min(3, Math.floor((Date.now() - e.ts) / (7 * 86400000)))
        weekMoods[3 - age].push(e.mood)
      }
      for (const w of (e.reflection || '').toLowerCase().replace(/[^\wäöüß\s-]/g, ' ').split(/\s+/)) {
        if (w.length >= 4 && !STOP.has(w)) wordCount[w] = (wordCount[w] || 0) + 1
      }
    }
    const top = (obj, n) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n)
    const weekAvg = weekMoods.map((arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null))
    const moodsAll = entries.map((e) => e.mood).filter(Boolean)
    const avgMood = moodsAll.length ? Math.round(moodsAll.reduce((a, b) => a + b, 0) / moodsAll.length) : null
    return {
      entries, reflected,
      topThemes: top(themeCount, 3),
      topSyms: top(symCount, 3),
      topWords: top(wordCount, 4).filter(([, n]) => n >= 2),
      weekAvg, avgMood,
    }
  }, [journal])

  // Plus-Gate: Das Monatsbild ist der Kern-Erkenntnisnutzen von Plus.
  if (!settings.premium) {
    return (
      <div className="center-col" style={{ flex: 1, padding: '24px 26px' }}>
        <Luna state="offenbarung" width={150} glowSize={190} float={false} />
        <div className="h-serif" style={{ fontWeight: 600, fontSize: 21, marginTop: 10, textAlign: 'center', color: 'var(--gold-1)' }}>
          Dein Monatsbild wartet
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 13px/1.6 var(--font-body)', textAlign: 'center', maxWidth: 280 }}>
          Mit Plus führt Luna deine Einträge über Wochen zusammen: wiederkehrende Themen, dein Stimmungsverlauf und die Worte, die dich wirklich begleiten.
        </div>
        <button className="btn-gold" style={{ marginTop: 22, width: 'auto', padding: '13px 26px' }} onClick={() => nav('/profil/plus')}>
          ✦ Plus entdecken
        </button>
        <button className="link-soft" style={{ marginTop: 12 }} onClick={() => nav(-1)}>Zurück</button>
      </div>
    )
  }

  const enough = m.entries.length >= 7

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Dein Monatsbild</span>
      </div>

      {!enough ? (
        <div className="center-col" style={{ flex: 1, padding: '20px 10px' }}>
          <Luna state="lauschen" width={150} glowSize={185} float />
          <div className="h-serif" style={{ fontWeight: 600, fontSize: 19, marginTop: 10, textAlign: 'center' }}>
            Dein Monatsbild<br />nimmt Gestalt an.
          </div>
          <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 13px/1.6 var(--font-body)', textAlign: 'center', maxWidth: 275 }}>
            Noch <b style={{ color: 'var(--gold-1)' }}>{7 - m.entries.length}</b> {7 - m.entries.length === 1 ? 'Botschaft' : 'Botschaften'}, dann kann Luna dir zeigen, was sich in deinem Monat wiederholt.
          </div>
          <button className="btn-gold" style={{ marginTop: 24, width: 'auto', padding: '13px 26px' }} onClick={() => nav('/oracle/befinden')}>
            ✦ Heute weitersammeln
          </button>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Luna state="offenbarung" width={115} glowSize={145} float={false} />
          </div>

          {/* Kennzahlen */}
          <div className="glass" style={{ marginTop: 12, padding: '14px 16px' }}>
            <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Letzte 30 Tage</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, textAlign: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--gold-1)', font: '700 20px var(--font-body)' }}>{m.entries.length}</div>
                <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)' }}>Botschaften</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--gold-1)', font: '700 20px var(--font-body)' }}>{m.reflected.length}</div>
                <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)' }}>Reflexionen</div>
              </div>
              {m.avgMood && (
                <div style={{ flex: 1.4 }}>
                  <div style={{ color: 'var(--gold-1)', font: '700 20px var(--font-body)' }}>{m.avgMood}/5</div>
                  <div style={{ color: 'var(--text-dim)', font: '500 10px var(--font-body)' }}>meist {MOOD_LABEL[m.avgMood]}</div>
                </div>
              )}
            </div>
          </div>

          {/* Stimmungsverlauf über 4 Wochen */}
          <div className="glass" style={{ marginTop: 12, padding: '14px 16px' }}>
            <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Stimmungsverlauf</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginTop: 12, height: 64 }}>
              {m.weekAvg.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '58%', height: v ? `${(v / 5) * 100}%` : 3, borderRadius: 6, background: v ? 'linear-gradient(180deg,#A66BFF,#6A3BE8)' : 'rgba(255,255,255,.08)' }} />
                  <span style={{ color: '#7a7494', font: '500 9px var(--font-body)' }}>W{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wiederkehrende Themen & Symbole */}
          <div className="glass" style={{ marginTop: 12, padding: '14px 16px' }}>
            <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Was sich wiederholt</div>
            {m.topThemes.map(([t, n]) => (
              <div key={t} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
                <span style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>{t}</span>
                <span style={{ color: 'var(--purple-2)', font: '600 12px var(--font-body)' }}>{n}×</span>
              </div>
            ))}
            {m.topSyms.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 9, borderTop: '1px solid rgba(255,255,255,.07)', color: 'var(--text-dim)', font: '400 11.5px/1.5 var(--font-body)' }}>
                Häufigste Zeichen: {m.topSyms.map(([s, n]) => `${s} (${n}×)`).join(' · ')}
              </div>
            )}
          </div>

          {/* Deine Worte */}
          {m.topWords.length > 0 && (
            <div className="glass" style={{ marginTop: 12, padding: '14px 16px' }}>
              <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Worte, die dich begleiten</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {m.topWords.map(([w, n]) => (
                  <span key={w} className="pill" style={{ background: 'rgba(232,199,122,.1)', borderColor: 'rgba(232,199,122,.3)', color: 'var(--gold-1)' }}>{w} · {n}×</span>
                ))}
              </div>
            </div>
          )}

          {/* Lunas Rückblick */}
          <div className="glass-purple" style={{ marginTop: 12, padding: '13px 15px' }}>
            <div style={{ color: 'var(--gold-1)', font: '600 11px var(--font-body)', marginBottom: 4 }}>Lunas Rückblick</div>
            <div style={{ color: 'var(--text-dim)', font: '400 12px/1.6 var(--font-body)' }}>
              {profile.name ? `${profile.name}, d` : 'D'}ieser Monat trug {m.entries.length} Lichtpunkte.
              {m.topThemes[0] ? ` „${m.topThemes[0][0]}" hat dich am stärksten begleitet – nicht als Problem, sondern als Thema, das gesehen werden will.` : ''}
              {m.reflected.length >= 4 ? ' Deine Reflexionen zeigen: Du schaust nicht mehr nur hin, du hörst dir selbst zu. Genau daraus entstehen Sternbilder.' : ' Je mehr Gedanken du festhältst, desto klarer wird dein Bild.'}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
