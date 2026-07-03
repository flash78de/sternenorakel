import { useState } from 'react'
import { asset } from '../lib/asset.js'

const FAQ = [
  {
    q: 'Ist das echte Astrologie?',
    a: 'Nein – eine Mischung aus Symbolik, Psychologie und (optional) KI-Texten. Ein Anstoß zur Selbstreflexion, keine Vorhersage.',
  },
  {
    q: 'Warum fühlt es sich so persönlich an?',
    a: 'Botschaften sind bewusst offen formuliert (Barnum-Effekt). Dein eigener Bezug macht sie stimmig – die Bedeutung legst du hinein, nicht die App.',
  },
  {
    q: 'Was passiert mit meinen Daten?',
    a: 'Alles bleibt local-first auf deinem Gerät. Es gibt kein Konto. Nur im KI-Modus wird der Text deiner Anfrage zur Erstellung der Botschaft verarbeitet.',
  },
]

export default function Wissen() {
  const [open, setOpen] = useState(0)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 17px 16px' }}>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 21, color: 'var(--gold-1)', textAlign: 'center', marginBottom: 12 }}>
        Über Sternenluna
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 7 }}>Was diese App sein will</div>
        <div style={{ color: 'var(--text)', font: '400 12px/1.55 var(--font-body)' }}>
          Ein Begleiter, ein Spiegel und eine Quelle der Inspiration – <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>kein unfehlbares Orakel</b>.
          Luna lädt dich ein, innezuhalten und deinen eigenen Sinn zu finden.
        </div>
        <div style={{ marginTop: 10, color: '#ffd9a0', font: '400 11.5px/1.5 var(--font-body)', borderLeft: '3px solid #E8C77A', paddingLeft: 12, fontStyle: 'italic' }}>
          Diese App ersetzt keine Therapie oder professionelle Beratung. Wenn es dir nicht gut geht, sprich mit einem
          Menschen, dem du vertraust.
        </div>
      </div>

      <div className="card" style={{ marginTop: 11 }}>
        <div className="card-title" style={{ marginBottom: 7 }}>Wie Botschaften entstehen</div>
        <div style={{ color: 'var(--text)', font: '400 12px/1.55 var(--font-body)' }}>
          Aus Symbolen, warmen Kernaussagen und – wenn verfügbar – KI-Texten. Bewusst allgemein gehalten
          (<b style={{ color: 'var(--purple-2)', fontWeight: 600 }}>Barnum-Effekt</b>), damit du deinen eigenen Sinn
          hineinlegen kannst.
        </div>
      </div>

      <div className="card" style={{ marginTop: 11 }}>
        <div className="card-title" style={{ marginBottom: 9 }}>Luna begleitet dich – in 6 Zuständen</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { s: 'idle', n: 'Ruhe', d: 'Start & Dashboard' },
            { s: 'lauschen', n: 'Lauschen', d: 'beim Laden' },
            { s: 'offenbarung', n: 'Offenbarung', d: 'die Botschaft' },
            { s: 'freude', n: 'Freude', d: 'Belohnung' },
            { s: 'icon', n: 'Sehnsucht', d: 'Rückkehr' },
            { s: 'schlaf', n: 'Schlaf', d: 'Abend & Pause' },
          ].map((x) => (
            <div key={x.n} style={{ textAlign: 'center' }}>
              <div style={{ borderRadius: 12, padding: 6, background: 'radial-gradient(circle at 50% 30%,rgba(106,59,232,.28),transparent 65%)' }}>
                <img src={asset(`uploads/opt/luna-${x.s}-transparent-sm.webp`)} alt={x.n} style={{ width: '100%', height: 'auto' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 12, marginTop: 4 }}>{x.n}</div>
              <div style={{ color: '#7a7494', font: '400 9.5px var(--font-body)' }}>{x.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 11, padding: '6px 15px 8px' }}>
        <div className="card-title" style={{ padding: '9px 0 2px' }}>Häufige Fragen</div>
        {FAQ.map((item, i) => (
          <div key={i}>
            <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{item.q}</span>
              <span className={'car' + (open === i ? ' open' : '')}>▾</span>
            </div>
            {open === i && <div className="faq-a">{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
