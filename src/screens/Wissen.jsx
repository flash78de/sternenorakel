import { useNavigate } from 'react-router-dom'
import { asset } from '../lib/asset.js'

// Wissen-Hub: fünf Themenwelten statt eines langen Scroll-Bildschirms.
// Die Inhalte liegen in den Unterseiten (WissenThema.jsx).
const THEMEN = [
  { key: 'ueber', icon: '🌙', title: 'Über Sternenluna', desc: 'Was die App sein will, wie Botschaften entstehen – und wer Luna ist.' },
  { key: 'psychologie', icon: '🧠', title: 'Psychologie dahinter', desc: 'Warum Reflexion, Journaling, Symbole und Rituale wirklich wirken.' },
  { key: 'symbole', icon: '🔮', title: 'Symbol-Lexikon', desc: 'Alle Karten, Runen und Archetypen – zum Nachschlagen und Stöbern.' },
  { key: 'chakren', icon: '🕉', title: 'Chakren', desc: 'Die sieben Lebensbereiche – und die Chakren-Reise.' },
  { key: 'faq', icon: '❓', title: 'Häufige Fragen', desc: 'Echte Astrologie? Warum so persönlich? Was passiert mit meinen Daten?' },
]

export default function Wissen() {
  const nav = useNavigate()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 17px 16px' }}>
      <div style={{ textAlign: 'center' }}>
        <img src={asset('uploads/opt/luna-lauschen-transparent-sm.webp')} alt="" style={{ width: 74, height: 'auto' }} />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 21, color: 'var(--gold-1)', marginTop: 2 }}>
          Wissen
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 12px/1.5 var(--font-body)', marginTop: 4 }}>
          Verstehen macht die Magie nicht kleiner – nur ehrlicher.
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {THEMEN.map((t) => (
          <button key={t.key} onClick={() => nav(`/wissen/${t.key}`)}
            style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', borderRadius: 16, padding: '13px 14px', background: 'linear-gradient(160deg,rgba(255,255,255,.06),rgba(255,255,255,.02))', border: '1px solid rgba(255,255,255,.1)' }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 19, background: 'radial-gradient(circle at 50% 30%,rgba(106,59,232,.35),rgba(40,30,70,.4))', border: '1px solid rgba(232,199,122,.28)' }}>
              {t.icon}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', color: 'var(--text)', font: '600 13.5px var(--font-body)' }}>{t.title}</span>
              <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 11px/1.4 var(--font-body)', marginTop: 2 }}>{t.desc}</span>
            </span>
            <span style={{ color: 'var(--gold-1)', fontSize: 16 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
