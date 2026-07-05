import { useState } from 'react'
import { asset } from '../lib/asset.js'

// Kurze Grundlagen-Artikel: die Psychologie hinter der App, ehrlich erklärt.
// Vertrauensanker für Neugierige – und echter Mehrwert über die FAQ hinaus.
const ARTIKEL = [
  {
    t: 'Warum Selbstreflexion wirkt',
    a: 'Wer Erlebtes in Worte fasst, verarbeitet es messbar besser – die Psychologie nennt das „Affect Labeling": Gefühle benennen beruhigt nachweislich das emotionale Alarmsystem im Gehirn. Schon wenige Minuten am Tag reichen. Genau dafür ist Lunas Frage unter jeder Botschaft da: nicht um eine „richtige" Antwort zu finden, sondern um dem, was ohnehin in dir arbeitet, einen Moment Raum zu geben.',
  },
  {
    t: 'Journaling: kleine Rituale, große Wirkung',
    a: 'Tagebuchschreiben gehört zu den am besten untersuchten Selbsthilfe-Werkzeugen: Es ordnet Gedanken, schafft Abstand zu Grübelschleifen und macht Entwicklung sichtbar. Der wichtigste Faktor ist nicht Länge, sondern Regelmäßigkeit – ein ehrlicher Satz zählt mehr als eine perfekte Seite. Dein Sternenband belohnt deshalb das Dranbleiben, nie die Menge. Und alles bleibt dabei auf deinem Gerät.',
  },
  {
    t: 'Symbolsprache: Warum Bilder mehr sagen',
    a: 'Karten, Runen und Archetypen sind keine Botschaften „von außen" – sie sind Projektionsflächen. Ein offenes Symbol wie „Das offene Tor" zwingt deinen Kopf, es mit deinem eigenen Leben zu füllen: Was ist bei MIR gerade ein Tor? Dieser Deutungsschritt ist der eigentliche Wert. Deshalb erklärt dir Luna auch offen den Barnum-Effekt – die Magie liegt nicht in der Karte, sondern in dem, was du in ihr erkennst.',
  },
  {
    t: 'Die Psychologie hinter Ritualen',
    a: 'Feste kleine Rituale – gleiche Zeit, gleiche Geste, gleicher Ort – senken Stress und erleichtern es dem Gehirn, eine Gewohnheit aufzubauen. Die Verhaltensforschung spricht von Ankern: Der Würfelwurf ist so ein Anker, der den Übergang vom Alltagsmodus ins Innehalten markiert. Nicht der Zufall des Wurfs verändert etwas, sondern der Moment der Ruhe, den du dir damit verlässlich schenkst.',
  },
  {
    t: 'Was sind Chakren?',
    a: 'Die Chakrenlehre stammt aus jahrtausendealten indischen Yoga-Traditionen. Sie beschreibt sieben „Räder" (Sanskrit: chakra) entlang der Körpermitte – vom Wurzel-Chakra am Beckenboden bis zum Kronen-Chakra am Scheitel. Jedem sind ein Lebensbereich, eine Farbe, ein Klang (Bija-Mantra) und ein Leitsatz zugeordnet: Sicherheit („Ich habe"), Freude („Ich fühle"), Selbstwert („Ich kann"), Liebe („Ich liebe"), Ausdruck („Ich verstehe"), Intuition („Ich sehe"), Verbundenheit („Ich weiß"). Ob man Chakren als Energiezentren versteht oder als kluge Landkarte der eigenen Themen, ist Ansichtssache – und in Sternenluna ausdrücklich deine Entscheidung. Wirksam sind die Zutaten der Praxis in jedem Fall: langsames Ausatmen und Summen beruhigen das Nervensystem, Affirmationen stärken den Blick auf die eigenen Werte, und die sieben Stationen geben deiner Selbstreflexion eine Reihenfolge. Genau so nutzt sie die Chakren-Reise – als Ritual, nicht als Heilslehre.',
  },
]

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
  const [openArt, setOpenArt] = useState(-1)

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

      {/* Vertiefung: die Psychologie dahinter, zum Aufklappen */}
      <div className="card" style={{ marginTop: 11, padding: '6px 15px 8px' }}>
        <div className="card-title" style={{ padding: '9px 0 2px' }}>Wissen &amp; Hintergrund</div>
        {ARTIKEL.map((item, i) => (
          <div key={i}>
            <div className="faq-q" onClick={() => setOpenArt(openArt === i ? -1 : i)}>
              <span>{item.t}</span>
              <span className={'car' + (openArt === i ? ' open' : '')}>▾</span>
            </div>
            {openArt === i && <div className="faq-a">{item.a}</div>}
          </div>
        ))}
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
