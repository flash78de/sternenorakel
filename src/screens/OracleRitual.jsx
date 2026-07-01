import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'

export default function OracleRitual() {
  const nav = useNavigate()
  const { drawnToday, settings } = useStore()
  const premium = settings.premium

  const cards = {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8C77A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7.5" y="4" width="11" height="15" rx="2" transform="rotate(8 13 11)" />
        <rect x="4" y="6" width="11" height="15" rx="2" fill="rgba(40,30,70,.7)" />
        <path d="M7 11h5M7 14h4" />
      </svg>
    ),
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px 18px 0' }}>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 23, color: 'var(--gold-1)', textAlign: 'center', textShadow: '0 2px 14px rgba(232,199,122,.3)' }}>
        Wähle dein Ritual
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 13px/1.5 var(--font-body)', textAlign: 'center', fontStyle: 'italic', marginTop: 8, padding: '0 6px' }}>
        Jedes Ritual spricht eine eigene Sprache. Folge dem, das dich heute ruft.
      </div>

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
        {/* Sternenwürfel — frei */}
        <button className="ritual" onClick={() => nav('/oracle/draw', { state: { ritual: 'wuerfel' } })}>
          <span className="ico">
            <img src="/uploads/wuerfel.png" alt="Würfel" style={{ width: 50, height: 50, objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(232,199,122,.45))' }} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 16, fontWeight: 600 }}>Sternenwürfel</span>
            <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)', marginTop: 2 }}>
              Sechs Archetypen – einer fällt heute für dich.
            </span>
          </span>
          <span style={{ color: 'var(--purple-2)', fontSize: 20 }}>›</span>
        </button>

        <Ritual premium={premium} nav={nav} ritual="karten" title="Sternenkarten" desc="Ein Bild aus dem Deck der inneren Bilder." icon={cards.icon} />
        <Ritual premium={premium} nav={nav} ritual="runen" title="Runen" desc="Alte Zeichen, die in die Gegenwart sprechen."
          icon={<span style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 26 }}>ᚱ</span>} />
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', padding: '14px 0' }}>
        {premium
          ? 'Mit Plus stehen dir alle Rituale offen. ✦'
          : drawnToday
            ? 'Du hast heute schon gezogen – morgen wartet das nächste Ritual.'
            : <>Weitere Rituale gibt es in <span style={{ color: 'var(--gold-1)', cursor: 'pointer' }} onClick={() => nav('/profil/plus')}>Sternenorakel Plus</span>.</>}
      </div>
    </div>
  )
}

function Ritual({ premium, nav, ritual, title, desc, icon }) {
  if (premium)
    return (
      <button className="ritual" onClick={() => nav('/oracle/draw', { state: { ritual } })}>
        <span className="ico">{icon}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 16, fontWeight: 600 }}>{title}</span>
          <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)', marginTop: 2 }}>{desc}</span>
        </span>
        <span style={{ color: 'var(--purple-2)', fontSize: 20 }}>›</span>
      </button>
    )
  return (
    <div className="ritual locked" role="button" style={{ cursor: 'pointer' }} onClick={() => nav('/profil/plus')}>
      <span className="ico">{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 16, fontWeight: 600 }}>{title}</span>
        <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)', marginTop: 2 }}>{desc}</span>
      </span>
      <span className="plus-badge">
        <span style={{ fontSize: 14 }}>🔒</span>PLUS
      </span>
    </div>
  )
}
