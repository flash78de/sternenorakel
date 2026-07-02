import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

const BENEFITS = [
  { t: 'Tiefere Botschaften', d: 'Längere, persönlichere Impulse und vertiefende Deutungen.' },
  { t: 'Monatsrückblick mit Luna', d: 'Erkenne Muster, Themen und Entwicklungen in deinem Monatsbild.' },
  { t: 'Erweiterte Symbolwelt', d: 'Mehr Symboldeutungen und tiefere Musteranalyse deiner Sternbilder.' },
  { t: 'Zusätzliche freie Impulse', d: 'Neben deiner Tagesbotschaft zusätzliche Impulse, wann du magst.' },
  { t: 'Cloud-Sync & Backup', d: 'Dein Sternenband sicher auf allen Geräten – mit automatischem Backup.' },
  { t: 'Export & unbegrenztes Tagebuch', d: 'Dein ganzer Weg bleibt erhalten – als PDF/Text exportierbar.' },
  { t: 'Exklusive Luna-Momente', d: 'Gesprochene Botschaften und zusätzliche Reaktionen nur für dich.' },
]

export default function PlusDetail() {
  const nav = useNavigate()
  const { settings, updateSettings } = useStore()
  const active = settings.premium

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Sternenorakel Plus</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Luna state="freude" width={130} glowSize={160} float />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 26, color: 'var(--gold-1)', marginTop: 6, textShadow: '0 2px 16px rgba(232,199,122,.4)' }}>
          Mehr Tiefe. Mehr Luna.
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 13px/1.55 var(--font-body)', marginTop: 8 }}>
          Erkenne über Wochen, welche Themen, Gefühle und Entscheidungen sich in deinem Leben wiederholen.
        </div>
      </div>

      <div className="glass" style={{ marginTop: 16, padding: '6px 15px' }}>
        {BENEFITS.map((b, i) => (
          <div key={b.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 0', borderTop: i ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
            <span style={{ color: 'var(--gold-1)', fontSize: 15, lineHeight: 1.2, marginTop: 1 }}>✦</span>
            <div>
              <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>{b.t}</div>
              <div style={{ color: 'var(--text-dim)', font: '400 11.5px/1.45 var(--font-body)', marginTop: 2 }}>{b.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 14, color: 'var(--text-dim)', font: '500 13px var(--font-body)' }}>
        Schon ab <b style={{ color: 'var(--text)', fontSize: 17 }}>3,99 €</b> / Monat
      </div>

      {active ? (
        <>
          <div style={{ marginTop: 12, textAlign: 'center', color: 'var(--gold-1)', font: '700 14px var(--font-body)' }}>
            ✦ Plus ist aktiv – alle Sterne stehen dir offen.
          </div>
          <button className="link-soft" style={{ marginTop: 12 }} onClick={() => updateSettings({ premium: false })}>
            Plus deaktivieren (Demo)
          </button>
        </>
      ) : (
        <>
          <button className="btn-gold" style={{ marginTop: 14 }} onClick={() => updateSettings({ premium: true })}>
            ✧ Plus 7 Tage kostenlos testen
          </button>
          <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10.5px/1.5 var(--font-body)', marginTop: 8 }}>
            7 Tage gratis, danach 3,99 € / Monat · jederzeit kündbar · <span style={{ textDecoration: 'underline' }}>Alle Preise &amp; Bedingungen</span>
            <br /><b style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Demo:</b> Es wird nichts berechnet – der Schalter aktiviert Plus nur zum Ausprobieren.
          </div>
        </>
      )}
    </div>
  )
}
