import { useState } from 'react'

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
        Über Sternenorakel
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
