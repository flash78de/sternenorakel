import { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { asset } from '../lib/asset.js'
import ChakraFigur from '../components/ChakraFigur.jsx'
import { karteBild, runeBild } from '../lib/ritualAssets.js'
import { ARCHETYPEN, KARTEN, RUNEN } from '../data/generator.js'
import { CHAKREN, chakraBild } from '../data/chakren.js'

// Wissen-Unterseiten: eine Themenwelt pro Bildschirm (Hub: Wissen.jsx).

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

const CHAKREN_TEXT =
  'Die Chakrenlehre stammt aus jahrtausendealten indischen Yoga-Traditionen. Sie beschreibt sieben „Räder" (Sanskrit: chakra) entlang der Körpermitte – vom Wurzel-Chakra am Beckenboden bis zum Kronen-Chakra am Scheitel. Jedem sind ein Lebensbereich, eine Farbe, ein Klang (Bija-Mantra) und ein Leitsatz zugeordnet. Ob man Chakren als Energiezentren versteht oder als kluge Landkarte der eigenen Themen, ist Ansichtssache – und in Sternenluna ausdrücklich deine Entscheidung. Wirksam sind die Zutaten der Praxis in jedem Fall: langsames Ausatmen und Summen beruhigen das Nervensystem, Affirmationen stärken den Blick auf die eigenen Werte, und die sieben Stationen geben deiner Selbstreflexion eine Reihenfolge. Genau so nutzt sie die Chakren-Reise – als Ritual, nicht als Heilslehre.'

const TITEL = {
  ueber: 'Über Sternenluna',
  psychologie: 'Psychologie dahinter',
  symbole: 'Symbol-Lexikon',
  chakren: 'Chakren',
  faq: 'Häufige Fragen',
}

const SectionLabel = ({ children }) => (
  <div style={{ color: 'var(--gold-1)', font: '600 11px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase', margin: '18px 0 8px' }}>
    {children}
  </div>
)

// Körperkarte: sitzende Figur + Info-Karte zum angetippten Chakra
function ChakrenKarte() {
  const [sel, setSel] = useState(4) // Herz als einladender Startpunkt
  const c = CHAKREN.find((x) => x.n === sel)
  return (
    <div className="card" style={{ marginTop: 14 }}>
      <div className="card-title" style={{ marginBottom: 4 }}>Wo sitzt welches Chakra?</div>
      <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.5 var(--font-body)' }}>
        Tippe die Punkte an – von der Wurzel (1) bis zur Krone (7).
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <ChakraFigur aktiv={sel} onSelect={setSel} width={200} />
      </div>
      <div style={{ background: `linear-gradient(160deg, ${c.farbe}22, ${c.farbe}0d)`, border: `1px solid ${c.farbe}55`, borderRadius: 14, padding: '11px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ color: c.farbe, filter: 'brightness(1.3)', font: '700 14px var(--font-body)' }}>{c.n}</span>
          <span style={{ color: 'var(--text)', font: '600 14.5px var(--font-body)' }}>{c.dt}</span>
          <span style={{ color: 'var(--text-dim)', font: '500 12px var(--font-body)' }}>· „{c.wort}“</span>
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 13px/1.55 var(--font-body)', marginTop: 4 }}>
          Sitzt <b style={{ color: 'var(--text)' }}>{c.ort}</b> · {c.thema} · Klang „{c.bija}“
        </div>
      </div>
    </div>
  )
}

export default function WissenThema() {
  const nav = useNavigate()
  const { thema } = useParams()
  const [open, setOpen] = useState(0)
  if (!TITEL[thema]) return <Navigate to="/wissen" replace />

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 17px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/wissen')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>{TITEL[thema]}</span>
      </div>

      {thema === 'ueber' && (
        <>
          <div className="card" style={{ marginTop: 14 }}>
            <div className="card-title" style={{ marginBottom: 7 }}>Was diese App sein will</div>
            <div style={{ color: 'var(--text)', font: '400 13.5px/1.6 var(--font-body)' }}>
              Ein Begleiter, ein Spiegel und eine Quelle der Inspiration – <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>kein unfehlbares Orakel</b>.
              Luna lädt dich ein, innezuhalten und deinen eigenen Sinn zu finden.
            </div>
            <div style={{ marginTop: 10, color: '#ffd9a0', font: '400 13px/1.55 var(--font-body)', borderLeft: '3px solid #E8C77A', paddingLeft: 12, fontStyle: 'italic' }}>
              Diese App ersetzt keine Therapie oder professionelle Beratung. Wenn es dir nicht gut geht, sprich mit einem
              Menschen, dem du vertraust.
            </div>
          </div>

          <div className="card" style={{ marginTop: 11 }}>
            <div className="card-title" style={{ marginBottom: 7 }}>Wie Botschaften entstehen</div>
            <div style={{ color: 'var(--text)', font: '400 13.5px/1.6 var(--font-body)' }}>
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
        </>
      )}

      {thema === 'psychologie' && (
        <>
          <div style={{ color: 'var(--text-dim)', font: '400 13.5px/1.55 var(--font-body)', marginTop: 12 }}>
            Vier kurze Grundlagen – ehrlich erklärt, ohne Fachchinesisch.
          </div>
          {ARTIKEL.map((item) => (
            <div key={item.t} className="card" style={{ marginTop: 11 }}>
              <div className="card-title" style={{ marginBottom: 7 }}>{item.t}</div>
              <div style={{ color: 'var(--text)', font: '400 13.5px/1.65 var(--font-body)' }}>{item.a}</div>
            </div>
          ))}
        </>
      )}

      {thema === 'symbole' && (
        <>
          <div style={{ color: 'var(--text-dim)', font: '400 13.5px/1.55 var(--font-body)', marginTop: 12 }}>
            Alles, was Luna ziehen kann – zum Nachschlagen. Welche Bedeutung ein Symbol
            für <b style={{ color: 'var(--text)' }}>dich</b> trägt, entscheidet wie immer dein Blick darauf.
          </div>

          <SectionLabel>🃏 Die sechs Sternenkarten</SectionLabel>
          {KARTEN.map((k) => (
            <div key={k.title} className="card" style={{ marginTop: 9, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {karteBild(k.title, 'sm') ? (
                <img src={karteBild(k.title, 'sm')} alt={k.title} style={{ width: 52, height: 'auto', borderRadius: 6, flexShrink: 0, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.45))' }} />
              ) : (
                <span style={{ width: 52, height: 74, flexShrink: 0, borderRadius: 8, display: 'grid', placeItems: 'center', fontSize: 22, background: 'linear-gradient(150deg,#2f1e30,#191021)', border: '1px solid rgba(232,199,122,.3)' }}>{k.glyph}</span>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 14.5, fontWeight: 600 }}>{k.title}</div>
                <div style={{ color: 'var(--purple-2)', font: '600 10px var(--font-body)', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 1 }}>{k.thema}</div>
                <div style={{ color: 'var(--text-dim)', font: '400 13px/1.55 var(--font-body)', marginTop: 4 }}>{k.deutung}</div>
              </div>
            </div>
          ))}

          <SectionLabel>ᚱ Die acht Runen</SectionLabel>
          {RUNEN.map((r) => (
            <div key={r.name} className="card" style={{ marginTop: 9, display: 'flex', gap: 12, alignItems: 'center' }}>
              {runeBild(r.name) ? (
                <img src={runeBild(r.name)} alt={r.name} style={{ width: 40, height: 'auto', flexShrink: 0, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.45))' }} />
              ) : (
                <span style={{ width: 36, height: 42, flexShrink: 0, borderRadius: '44% 44% 38% 38%', display: 'grid', placeItems: 'center', fontSize: 17, background: 'linear-gradient(160deg,#26382f,#131f19)', border: '1px solid rgba(150,217,180,.3)', color: '#96d9b4', fontFamily: 'var(--font-head)' }}>{r.glyph}</span>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ color: 'var(--text)', font: '600 14.5px var(--font-body)' }}>
                  {r.name} <span style={{ color: 'var(--purple-2)', fontWeight: 500, fontSize: 12.5 }}>· {r.bedeutung}</span>
                </div>
                <div style={{ color: 'var(--text-dim)', font: '400 13px/1.55 var(--font-body)', marginTop: 2 }}>{r.heute}</div>
              </div>
            </div>
          ))}

          <SectionLabel>⚔ Die sechs Archetypen des Würfels</SectionLabel>
          {ARCHETYPEN.map((a) => (
            <div key={a.name} className="card" style={{ marginTop: 9 }}>
              <div style={{ color: 'var(--gold-1)', font: '600 15px var(--font-body)' }}>
                {a.glyph} {a.name}
              </div>
              <div style={{ color: 'var(--text-dim)', font: '400 13px/1.55 var(--font-body)', marginTop: 4 }}>{a.kern}</div>
              <div style={{ color: '#9a93b8', font: '400 12.5px/1.5 var(--font-body)', marginTop: 4 }}>
                <b style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Kleine Handlung:</b> {a.impuls}
              </div>
            </div>
          ))}
        </>
      )}

      {thema === 'chakren' && (
        <>
          {/* Körperkarte: WO sitzt welches Chakra? Punkte antippbar */}
          <ChakrenKarte />
          <div className="card" style={{ marginTop: 13 }}>
            <div style={{ color: 'var(--text)', font: '400 13.5px/1.7 var(--font-body)' }}>{CHAKREN_TEXT}</div>
          </div>
          <div className="card" style={{ marginTop: 11 }}>
            <div className="card-title" style={{ marginBottom: 8 }}>Die sieben Leitsätze</div>
            {CHAKREN.map((c) => (
              <div key={c.n} style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginTop: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: c.farbe, alignSelf: 'center' }} />
                <span style={{ color: 'var(--text)', font: '600 13px var(--font-body)', width: 96, flexShrink: 0 }}>„{c.wort}“</span>
                <span style={{ color: 'var(--text-dim)', font: '400 13px var(--font-body)' }}>{c.dt} · {c.thema}</span>
              </div>
            ))}
          </div>
          <button className="btn-gold" style={{ marginTop: 14 }} onClick={() => nav('/reisen')}>
            ✦ Zur Chakren-Reise
          </button>
        </>
      )}

      {thema === 'faq' && (
        <div className="card" style={{ marginTop: 14, padding: '6px 15px 8px' }}>
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
      )}
    </div>
  )
}
