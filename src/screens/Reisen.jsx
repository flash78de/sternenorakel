import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { asset } from '../lib/asset.js'
import { CHAKREN, CHAKREN_INTRO, chakraBild } from '../data/chakren.js'

// Reisen-Übersicht: geführte Mehr-Stationen-Programme (Plus).
// Erste Reise: die Chakren-Reise mit Marcels eigener Kartenreihe.
// Station 1 ist als Kostprobe frei; die Stationen öffnen sich der Reihe nach.
export default function Reisen() {
  const nav = useNavigate()
  const { settings, reisen } = useStore()
  const premium = settings.premium
  const done = reisen.chakren.done || []
  const complete = done.length >= 7
  // Nächste offene Station (Reihenfolge – eine Reise geht Schritt für Schritt)
  const next = CHAKREN.find((c) => !done.includes(c.n))?.n ?? 7

  const open = (n) => {
    const unlocked = premium || n === 1
    const inOrder = n <= next
    if (!unlocked) return nav('/profil/plus')
    if (inOrder) nav(`/reisen/chakren/${n}`)
  }

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/oracle')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Reisen</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <Luna state="offenbarung" width={110} glowSize={140} float />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 25, color: 'var(--gold-1)', marginTop: 4, textShadow: '0 2px 16px rgba(232,199,122,.4)' }}>
          Die Chakren-Reise
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.55 var(--font-body)', marginTop: 6 }}>
          Sieben Stationen, sieben Lebensbereiche – in deinem Tempo, gern eine pro Tag.
        </div>
      </div>

      {/* Ehrliche Rahmung – derselbe Geist wie der Barnum-Hinweis */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '10px 12px' }}>
        <span style={{ color: '#7a7494', fontSize: 13 }}>ⓘ</span>
        <div style={{ color: '#9a93b8', font: '400 11px/1.5 var(--font-body)' }}>{CHAKREN_INTRO}</div>
      </div>

      {/* Fortschritt */}
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.1)' }}>
          <div style={{ width: `${(done.length / 7) * 100}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#E8C77A,#A66BFF)', transition: 'width .6s ease' }} />
        </div>
        <span style={{ color: 'var(--text-dim)', font: '600 12px var(--font-body)' }}>{done.length}/7</span>
      </div>
      {complete && (
        <div style={{ marginTop: 10, textAlign: 'center', color: 'var(--gold-1)', font: '600 12.5px var(--font-body)' }}>
          ✦ Reise vollendet – jede Station bleibt für dich geöffnet.
        </div>
      )}

      {/* Stationen */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {CHAKREN.map((c) => {
          const isDone = done.includes(c.n)
          const unlocked = premium || c.n === 1
          const inOrder = c.n <= next
          const openable = unlocked && (inOrder || isDone)
          return (
            <button key={c.n} onClick={() => open(c.n)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer',
                borderRadius: 15, padding: '10px 13px',
                background: isDone ? 'rgba(232,199,122,.08)' : 'rgba(255,255,255,.04)',
                border: `1px solid ${isDone ? 'rgba(232,199,122,.35)' : 'rgba(255,255,255,.1)'}`,
                opacity: openable || !unlocked ? 1 : 0.55,
              }}>
              <img src={asset(chakraBild(c.n, 'sm'))} alt={c.dt}
                style={{ width: 40, height: 'auto', borderRadius: 6, flexShrink: 0, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.4))' }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', color: 'var(--text)', font: '600 13px var(--font-body)' }}>
                  {c.n} · {c.dt}
                </span>
                <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 11px/1.4 var(--font-body)', marginTop: 1 }}>
                  „{c.wort}“ · {c.thema}
                </span>
              </span>
              <span style={{ flexShrink: 0, font: '600 12px var(--font-body)', color: isDone ? 'var(--gold-1)' : unlocked ? (inOrder ? 'var(--purple-2)' : '#7a7494') : 'var(--gold-1)' }}>
                {isDone ? '✓' : !unlocked ? '✦ Plus' : inOrder ? (c.n === 1 && !premium ? 'Kostprobe ›' : 'Öffnen ›') : '· · ·'}
              </span>
            </button>
          )
        })}
      </div>

      {!premium && (
        <button className="btn-gold" style={{ marginTop: 14 }} onClick={() => nav('/profil/plus')}>
          ✦ Die ganze Reise mit Plus öffnen
        </button>
      )}

      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10px/1.5 var(--font-body)', marginTop: 12 }}>
        Symbolsprache, keine Heilslehre – nimm mit, was dir guttut.
      </div>
    </div>
  )
}
