import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { asset } from '../lib/asset.js'
import { ritualTheme } from '../lib/ritualTheme.js'
import SofortHilfe from '../components/SofortHilfe.jsx'

export default function OracleRitual() {
  const nav = useNavigate()
  const { drawnToday, settings } = useStore()
  const premium = settings.premium

  // Echte gemalte Motive als Ritual-Icons: aufgefächerte Karten & Runenstein
  const cardsIcon = (
    <span style={{ position: 'relative', width: 58, height: 62, display: 'block' }}>
      <img src={asset('uploads/opt/karte-see-sm.webp')} alt=""
        style={{ position: 'absolute', left: 0, top: 4, width: 36, transform: 'rotate(-10deg)', borderRadius: 4, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))' }} />
      <img src={asset('uploads/opt/karte-kompass-sm.webp')} alt="Sternenkarten"
        style={{ position: 'absolute', left: 18, top: 0, width: 38, transform: 'rotate(9deg)', borderRadius: 4, filter: 'drop-shadow(0 5px 10px rgba(0,0,0,.55))' }} />
    </span>
  )
  const runesIcon = (
    <span style={{ position: 'relative', width: 60, height: 62, display: 'block' }}>
      <img src={asset('uploads/opt/rune-berkano-sm.webp')} alt=""
        style={{ position: 'absolute', left: 0, top: 8, width: 34, transform: 'rotate(-9deg)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))' }} />
      <img src={asset('uploads/opt/rune-raidho-sm.webp')} alt="Runen"
        style={{ position: 'absolute', left: 22, top: 2, width: 36, transform: 'rotate(8deg)', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,.55))' }} />
    </span>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '13px 18px 14px' }}>
      {/* Sofort-Hilfe auch hier erreichbar – wer Luna öffnet, sucht manchmal Halt */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SofortHilfe />
      </div>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 24, color: 'var(--gold-1)', textAlign: 'center', marginTop: 2, textShadow: '0 2px 14px rgba(232,199,122,.3)' }}>
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
          icon={runesIcon} />

        {/* Reisen: mehrtägige geführte Programme (erste Reise: Chakren) */}
        <button onClick={() => nav('/reisen')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', cursor: 'pointer', borderRadius: 18, padding: '13px 15px', background: 'linear-gradient(140deg, rgba(183,63,142,.14), rgba(63,182,201,.1))', border: '1px solid rgba(232,199,122,.28)' }}>
          <span style={{ position: 'relative', width: 58, height: 62, flexShrink: 0, display: 'block' }}>
            <img src={asset('uploads/opt/chakra-4-sm.webp')} alt=""
              style={{ position: 'absolute', left: 0, top: 5, width: 34, transform: 'rotate(-9deg)', borderRadius: 4, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))' }} />
            <img src={asset('uploads/opt/chakra-6-sm.webp')} alt="Chakren-Reise"
              style={{ position: 'absolute', left: 20, top: 0, width: 36, transform: 'rotate(9deg)', borderRadius: 4, filter: 'drop-shadow(0 5px 10px rgba(0,0,0,.55))' }} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 16.5, color: 'var(--text)' }}>
              Reisen · Die Chakren-Reise {!premium && <span style={{ color: 'var(--gold-1)', fontSize: 11 }}>✦ Plus</span>}
            </span>
            <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 11.5px/1.45 var(--font-body)', marginTop: 3 }}>
              Sieben Stationen in deinem Tempo – Station 1 ist frei.
            </span>
          </span>
          <span style={{ color: 'var(--gold-1)', fontSize: 16 }}>›</span>
        </button>
      </div>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 11.5px/1.5 var(--font-body)', padding: '14px 0' }}>
        {premium
          ? drawnToday
            ? <>Tagesbotschaft empfangen ✓ – weitere Züge sind <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>freie Impulse</b>, nur für dich.</>
            : 'Mit Plus stehen dir alle Rituale offen. ✦'
          : drawnToday
            ? 'Du hast heute schon gezogen – morgen wartet das nächste Ritual.'
            : <>Weitere Rituale gibt es in <span style={{ color: 'var(--gold-1)', cursor: 'pointer' }} onClick={() => nav('/profil/plus')}>Sternenluna Plus</span>.</>}
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
