import { useNavigate } from 'react-router-dom'
import { asset } from '../lib/asset.js'

// Wissen-Hub: gestalteter App-Bildschirm statt Liste – eine große
// Feature-Kachel („Über Sternenluna") plus 2×2-Raster mit Artwork.
// Inhalte liegen in den Unterseiten (WissenThema.jsx).

const kachel = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: 6,
  cursor: 'pointer',
  borderRadius: 20,
  padding: '14px 12px',
  background: 'linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02))',
  border: '1px solid rgba(255,255,255,.12)',
  overflow: 'hidden',
}

export default function Wissen() {
  const nav = useNavigate()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 16px 10px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 21, color: 'var(--gold-1)' }}>
          Wissen
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 13px/1.45 var(--font-body)', marginTop: 3 }}>
          Verstehen macht die Magie nicht kleiner – nur ehrlicher.
        </div>
      </div>

      <div style={{ marginTop: 12, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {/* Feature-Kachel: Über Sternenluna */}
        <button onClick={() => nav('/wissen/ueber')}
          style={{ ...kachel, flexDirection: 'row', textAlign: 'left', justifyContent: 'flex-start', gap: 14, flex: 1, padding: '14px 18px', background: 'linear-gradient(140deg,rgba(106,59,232,.28),rgba(232,199,122,.1))', border: '1px solid rgba(232,199,122,.35)' }}>
          <img src={asset('uploads/opt/luna-freude-transparent-sm.webp')} alt=""
            style={{ width: 84, height: 'auto', flexShrink: 0, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.45))' }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 19, color: 'var(--gold-1)' }}>
              Über Sternenluna
            </span>
            <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 13px/1.5 var(--font-body)', marginTop: 5 }}>
              Was die App sein will, wie Botschaften entstehen – und wer Luna ist.
            </span>
          </span>
          <span style={{ color: 'var(--gold-1)', fontSize: 18 }}>›</span>
        </button>

        {/* 2×2-Raster */}
        <div style={{ flex: 2.4, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 11 }}>
          <button onClick={() => nav('/wissen/psychologie')} style={kachel}>
            <span style={{ width: 52, height: 52, borderRadius: 16, display: 'grid', placeItems: 'center', fontSize: 26, background: 'radial-gradient(circle at 50% 30%,rgba(166,107,255,.4),rgba(40,30,70,.4))', border: '1px solid rgba(167,139,250,.35)' }}>🧠</span>
            <span style={{ color: 'var(--text)', font: '600 15px var(--font-body)' }}>Psychologie<br />dahinter</span>
            <span style={{ color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)' }}>Warum Reflexion &amp; Rituale wirken</span>
          </button>

          <button onClick={() => nav('/wissen/symbole')} style={kachel}>
            <span style={{ position: 'relative', width: 60, height: 56, display: 'block' }}>
              <img src={asset('uploads/opt/karte-kompass-sm.webp')} alt=""
                style={{ position: 'absolute', left: 2, top: 2, width: 34, transform: 'rotate(-9deg)', borderRadius: 4, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))' }} />
              <img src={asset('uploads/opt/rune-fehu-sm.webp')} alt=""
                style={{ position: 'absolute', left: 28, top: 6, width: 30, transform: 'rotate(10deg)', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,.55))' }} />
            </span>
            <span style={{ color: 'var(--text)', font: '600 15px var(--font-body)' }}>Symbol-<br />Lexikon</span>
            <span style={{ color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)' }}>Karten, Runen &amp; Archetypen</span>
          </button>

          <button onClick={() => nav('/wissen/chakren')} style={kachel}>
            <span style={{ position: 'relative', width: 60, height: 56, display: 'block' }}>
              <img src={asset('uploads/opt/chakra-1-sm.webp')} alt=""
                style={{ position: 'absolute', left: 2, top: 3, width: 32, transform: 'rotate(-8deg)', borderRadius: 4, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))' }} />
              <img src={asset('uploads/opt/chakra-6-sm.webp')} alt=""
                style={{ position: 'absolute', left: 27, top: 0, width: 33, transform: 'rotate(9deg)', borderRadius: 4, filter: 'drop-shadow(0 5px 10px rgba(0,0,0,.55))' }} />
            </span>
            <span style={{ color: 'var(--text)', font: '600 15px var(--font-body)' }}>Chakren</span>
            <span style={{ color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)' }}>Sieben Lebensbereiche &amp; die Reise</span>
          </button>

          <button onClick={() => nav('/wissen/faq')} style={kachel}>
            <span style={{ width: 52, height: 52, borderRadius: 16, display: 'grid', placeItems: 'center', fontSize: 24, background: 'radial-gradient(circle at 50% 30%,rgba(232,199,122,.35),rgba(60,45,25,.35))', border: '1px solid rgba(232,199,122,.35)', color: 'var(--gold-1)', fontFamily: 'var(--font-head)', fontWeight: 700 }}>?</span>
            <span style={{ color: 'var(--text)', font: '600 15px var(--font-body)' }}>Häufige<br />Fragen</span>
            <span style={{ color: 'var(--text-dim)', font: '400 12px/1.4 var(--font-body)' }}>Ehrliche Antworten, kurz &amp; klar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
