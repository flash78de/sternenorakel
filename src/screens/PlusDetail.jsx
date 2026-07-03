import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { buzz } from '../lib/haptics.js'

const BENEFITS = [
  { t: 'Tiefere Botschaften', d: 'Längere, persönlichere Impulse und vertiefende Deutungen.' },
  { t: 'Monatsrückblick mit Luna', d: 'Erkenne Muster, Themen und Entwicklungen in deinem Monatsbild.' },
  { t: 'Erweiterte Symbolwelt', d: 'Mehr Symboldeutungen und tiefere Musteranalyse deiner Sternbilder.' },
  { t: 'Zusätzliche freie Impulse', d: 'Neben deiner Tagesbotschaft zusätzliche Impulse, wann du magst.' },
  { t: 'Cloud-Sync & Backup', d: 'Dein Sternenband sicher auf allen Geräten – mit automatischem Backup.' },
  { t: 'Export & unbegrenztes Tagebuch', d: 'Dein ganzer Weg bleibt erhalten – als PDF/Text exportierbar.' },
  { t: 'Exklusive Luna-Momente', d: 'Gesprochene Botschaften und zusätzliche Reaktionen nur für dich.' },
]

// Konfetti wie auf dem Feier-Screen (deterministische Positionen)
const PARTS = [
  { left: '8%', delay: 0, size: 14 }, { left: '22%', delay: 1.2, size: 10 },
  { left: '38%', delay: 0.5, size: 13 }, { left: '55%', delay: 1.7, size: 11 },
  { left: '70%', delay: 0.3, size: 15 }, { left: '85%', delay: 0.9, size: 11 },
]

export default function PlusDetail() {
  const nav = useNavigate()
  const { settings, updateSettings } = useStore()
  const active = settings.premium
  // Direkt nach der Aktivierung: eigener Erfolgs-Moment statt Scroll-Gymnastik
  const [justActivated, setJustActivated] = useState(false)

  const activate = () => {
    updateSettings({ premium: true })
    setJustActivated(true)
    buzz([20, 30, 20])
  }

  if (justActivated)
    return (
      <div className="center-col" style={{ flex: 1, padding: '30px 26px', position: 'relative', overflow: 'hidden' }}>
        <div className="anim-burst" style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg at 50% 38%,transparent 0deg,rgba(232,199,122,.12) 12deg,transparent 24deg,rgba(232,199,122,.1) 48deg,transparent 72deg,rgba(232,199,122,.12) 84deg,transparent 96deg)' }} />
        {PARTS.map((p, i) => (
          <span key={i} className="feier-part" aria-hidden="true" style={{ left: p.left, fontSize: p.size, animationDelay: `${p.delay}s`, color: i % 2 ? 'var(--purple-2)' : 'var(--gold-1)' }}>
            {i % 2 ? '✧' : '✦'}
          </span>
        ))}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ color: 'var(--gold-1)', font: '600 12px var(--font-body)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Plus aktiviert ✦
          </div>
          <Luna state="freude" width="min(200px, 52vw)" glowSize={230} burst style={{ marginTop: 10 }} />
          <div className="pop" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 25, color: 'var(--gold-1)', marginTop: 8, textShadow: '0 2px 18px rgba(232,199,122,.45)' }}>
            Alle Sterne stehen<br />dir jetzt offen.
          </div>
          <div style={{ color: 'var(--text)', font: '400 13.5px/1.7 var(--font-body)', marginTop: 12, maxWidth: 280 }}>
            ✦ Sternenkarten &amp; Runen freigeschaltet<br />
            ✦ Freie Impulse, wann du magst<br />
            ✦ Dein Monatsbild wächst ab jetzt mit
          </div>
          <button className="btn-gold" style={{ marginTop: 24, width: 'auto', padding: '15px 28px' }} onClick={() => nav('/oracle', { replace: true })}>
            ✦ Zum Orakel – Karten &amp; Runen entdecken
          </button>
          <button className="link-soft" style={{ marginTop: 14, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} onClick={() => nav('/dashboard', { replace: true })}>
            Später · zum Start
          </button>
        </div>
      </div>
    )

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Sternenluna Plus</span>
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

      {/* CTA ganz oben: aktivieren ohne Scrollen (die Vorteile stehen darunter zum Nachlesen) */}
      {!active && (
        <button className="btn-gold" style={{ marginTop: 14 }} onClick={activate}>
          ✧ Plus 7 Tage kostenlos testen
        </button>
      )}
      {active && (
        <div style={{ marginTop: 12, textAlign: 'center', color: 'var(--gold-1)', font: '700 14px var(--font-body)' }}>
          ✦ Plus ist aktiv – alle Sterne stehen dir offen.
        </div>
      )}

      <div className="glass" style={{ marginTop: 14, padding: '6px 15px' }}>
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
        <button className="link-soft" style={{ marginTop: 12 }} onClick={() => updateSettings({ premium: false })}>
          Plus deaktivieren (Demo)
        </button>
      ) : (
        <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10.5px/1.5 var(--font-body)', marginTop: 10 }}>
          7 Tage gratis, danach 3,99 € / Monat · jederzeit kündbar · <span style={{ textDecoration: 'underline' }}>Alle Preise &amp; Bedingungen</span>
          <br /><b style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Demo:</b> Es wird nichts berechnet – der Schalter aktiviert Plus nur zum Ausprobieren.
        </div>
      )}
    </div>
  )
}
