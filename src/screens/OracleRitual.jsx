import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { asset } from '../lib/asset.js'
import { ritualTheme } from '../lib/ritualTheme.js'

export default function OracleRitual() {
  const nav = useNavigate()
  const { drawnToday, settings } = useStore()
  const premium = settings.premium

  const cardsIcon = (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={ritualTheme('karten').accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7.5" y="4" width="11" height="15" rx="2" transform="rotate(8 13 11)" />
      <rect x="4" y="6" width="11" height="15" rx="2" fill="rgba(40,30,70,.7)" />
      <path d="M7 11h5M7 14h4" />
    </svg>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 18px 14px' }}>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 24, color: 'var(--gold-1)', textAlign: 'center', textShadow: '0 2px 14px rgba(232,199,122,.3)' }}>
        Wähle dein Ritual
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 13px/1.5 var(--font-body)', textAlign: 'center', fontStyle: 'italic', marginTop: 8, padding: '0 6px' }}>
        Jedes Ritual spricht eine eigene Sprache. Folge dem, das dich heute ruft.
      </div>

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 15, flex: 1, justifyContent: 'center' }}>
        <Ritual premium nav={nav} ritual="wuerfel" title="Sternenwürfel" desc="Richtung für heute: ein Archetyp und ein kleiner Schritt."
          icon={<img src={asset('uploads/opt/wuerfel-sm.webp')} alt="Würfel" style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(232,199,122,.45))' }} />} />
        <Ritual premium={premium} nav={nav} ritual="karten" title="Sternenkarten" desc="Du ziehst selbst: ein inneres Bild für tiefere Gefühle & Themen." icon={cardsIcon} />
        <Ritual premium={premium} nav={nav} ritual="runen" title="Runen" desc="Drei Zeichen: was nachwirkt, was jetzt zählt, was entstehen darf."
          icon={<span style={{ fontFamily: 'var(--font-head)', color: ritualTheme('runen').accent, fontSize: 36 }}>ᚱ</span>} />
      </div>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', padding: '14px 0' }}>
        {premium
          ? drawnToday
            ? <>Tagesbotschaft empfangen ✓ – weitere Züge sind <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>freie Impulse</b>, nur für dich.</>
            : 'Mit Plus stehen dir alle Rituale offen. ✦'
          : drawnToday
            ? 'Du hast heute schon gezogen – morgen wartet das nächste Ritual.'
            : <>Weitere Rituale gibt es in <span style={{ color: 'var(--gold-1)', cursor: 'pointer' }} onClick={() => nav('/profil/plus')}>Sternenorakel Plus</span>.</>}
      </div>
    </div>
  )
}

// Ritual-Karte in der eigenen Farbwelt: linker Farbstreifen, getönter
// Icon-Rahmen und farbiger Titel geben sofort Orientierung.
function Ritual({ premium, nav, ritual, title, desc, icon }) {
  const t = ritualTheme(ritual)
  const cardStyle = {
    background: `linear-gradient(150deg, ${t.softer}, rgba(255,255,255,.03) 55%)`,
    border: `1px solid ${t.borderSoft}`,
    boxShadow: `0 6px 22px rgba(0,0,0,.3), inset 3px 0 0 ${t.border}, inset 0 1px 0 rgba(255,255,255,.06)`,
  }
  const icoStyle = {
    background: `radial-gradient(circle, ${t.soft}, rgba(24,18,40,.55))`,
    border: `1px solid ${t.border}`,
    boxShadow: `0 0 18px ${t.glow.replace(/[\d.]+\)$/, '0.18)')}`,
  }
  const inner = (
    <>
      <span className="ico" style={icoStyle}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-head)', color: t.accent, fontSize: 18, fontWeight: 600 }}>{title}</span>
        <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 12.5px/1.45 var(--font-body)', marginTop: 3 }}>{desc}</span>
      </span>
    </>
  )
  if (premium)
    return (
      <button className="ritual" style={cardStyle} onClick={() => nav('/oracle/draw', { state: { ritual } })}>
        {inner}
        <span style={{ color: t.accent, fontSize: 22, opacity: 0.85 }}>›</span>
      </button>
    )
  return (
    <div className="ritual locked" role="button" style={{ cursor: 'pointer', ...cardStyle }} onClick={() => nav('/profil/plus')}>
      {inner}
      <span className="plus-badge">
        <span style={{ fontSize: 14 }}>🔒</span>PLUS
      </span>
    </div>
  )
}
