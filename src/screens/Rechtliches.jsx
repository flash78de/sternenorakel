import { useNavigate } from 'react-router-dom'

// Rechtliches: Impressum · Unterhaltungshinweis · Haftungsausschluss · Datenschutz
// Hinweis: Standard-Formulierungen; vor Start echter Zahlungen anwaltlich prüfen lassen.

const H = ({ children }) => (
  <div style={{ color: 'var(--gold-1)', font: '600 12px var(--font-body)', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 18, marginBottom: 6 }}>
    {children}
  </div>
)
const P = ({ children }) => (
  <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.65 var(--font-body)', marginBottom: 8 }}>{children}</div>
)

export default function Rechtliches() {
  const nav = useNavigate()
  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Rechtliches</span>
      </div>

      <div className="glass" style={{ marginTop: 14, padding: '4px 16px 16px' }}>
        <H>Impressum · Angaben gemäß § 5 DDG</H>
        <P>
          Anbieterin:<br />
          <b style={{ color: 'var(--text)' }}>KPK Ingrid Lenk</b> – Bereich „Mister Hochzeit"<br />
          Alte Auerbacher Str. 23<br />
          08304 Schönheide<br />
          Deutschland
        </P>
        <P>
          Kontakt: <a href="mailto:ml@mittel-bar.com" style={{ color: 'var(--purple-2)' }}>ml@mittel-bar.com</a>
        </P>
        <P>
          Verantwortlich für den Inhalt sowie Idee, Entwicklung und Umsetzung:{' '}
          <b style={{ color: 'var(--text)' }}>Marcel Lenk</b> (Anschrift wie oben).
        </P>

        <H>Nur zur Unterhaltung &amp; Selbstreflexion</H>
        <P>
          Sternenluna ist eine App zur <b style={{ color: 'var(--text)' }}>Unterhaltung und persönlichen Selbstreflexion</b>.
          Die Botschaften, Karten, Runen, Sternbilder und alle weiteren Inhalte sind bewusst offen formuliert
          (Barnum-Effekt, siehe Kennzeichnung in der App) und stellen <b style={{ color: 'var(--text)' }}>keine
          Zukunftsvorhersagen</b> dar. Sie sind keine medizinische, psychologische, therapeutische, rechtliche
          oder finanzielle Beratung und ersetzen keine solche. Bei gesundheitlichen oder seelischen Belastungen
          wende dich bitte an qualifizierte Fachpersonen – z.&nbsp;B. die Telefonseelsorge unter{' '}
          <b style={{ color: 'var(--text)' }}>0800&nbsp;111&nbsp;0&nbsp;111</b> (kostenlos, rund um die Uhr).
        </P>

        <H>Haftungsausschluss</H>
        <P>
          Die Inhalte dieser App wurden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität
          wird jedoch keine Gewähr übernommen. Entscheidungen, die du auf Grundlage von Inhalten dieser App
          triffst, liegen in deiner eigenen Verantwortung. Eine Haftung für Schäden materieller oder ideeller
          Art, die durch die Nutzung der App oder ihrer Inhalte entstehen, ist ausgeschlossen, soweit kein
          nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt. Die gesetzliche Haftung für
          Schäden aus der Verletzung von Leben, Körper oder Gesundheit bleibt unberührt.
        </P>

        <H>Datenschutz</H>
        <P>
          <b style={{ color: 'var(--text)' }}>Local-first:</b> Deine Eingaben (Name, Themen, Stimmung, Tagebuch,
          Einstellungen) werden ausschließlich <b style={{ color: 'var(--text)' }}>lokal auf deinem Gerät</b> gespeichert
          (Browser-Speicher). Es gibt kein Konto, keine Registrierung und keine Übertragung deines Tagebuchs an uns.
          Du kannst alle Daten jederzeit unter „Daten &amp; Privatsphäre" exportieren oder unwiderruflich löschen.
        </P>
        <P>
          <b style={{ color: 'var(--text)' }}>KI-Modus (abschaltbar):</b> Ist der KI-Modus aktiv, werden zur Erstellung
          deiner Botschaft folgende Angaben an unseren Server (Cloudflare Workers) und von dort an die
          Anthropic-API übermittelt: Stimmungswert, gewählte Themen, Ritual und das gezogene Ergebnis sowie
          Ton-Präferenzen. <b style={{ color: 'var(--text)' }}>Niemals übertragen werden dein Name oder deine
          Tagebuch-Notizen.</b> Die Verarbeitung kann in den USA stattfinden. Rechtsgrundlage ist deine
          Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die wir vor der ersten KI-Nutzung aktiv abfragen bzw.
          die du durch Einschalten des KI-Modus erteilst; du kannst sie jederzeit durch Abschalten des
          KI-Modus in den Einstellungen widerrufen.
        </P>
        <P>
          <b style={{ color: 'var(--text)' }}>Push-Erinnerungen (optional):</b> Aktivierst du die tägliche Erinnerung,
          speichert unser Server (Cloudflare Workers) dafür die pseudonyme Push-Adresse deines Browsers, deine
          Wunschzeit und deine Zeitzone – <b style={{ color: 'var(--text)' }}>keinen Namen und keine Inhalte</b>.
          Die Zustellung erfolgt über den Push-Dienst deines Systems (z.&nbsp;B. Apple oder Google); der Nachrichtentext
          ist dabei Ende-zu-Ende verschlüsselt und für den Push-Dienst nicht lesbar. Rechtsgrundlage ist deine
          Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); mit dem Ausschalten der Erinnerung wird das Abo auf dem
          Server gelöscht.
        </P>
        <P>
          <b style={{ color: 'var(--text)' }}>Hosting:</b> Die App wird über GitHub Pages (GitHub Inc., USA)
          ausgeliefert. Beim Aufruf verarbeitet GitHub technisch notwendige Verbindungsdaten (z.&nbsp;B. IP-Adresse)
          in Server-Protokollen. Diese App setzt <b style={{ color: 'var(--text)' }}>keine Cookies</b> ein und
          verwendet <b style={{ color: 'var(--text)' }}>kein Tracking</b> und keine Analyse-Dienste.
        </P>
        <P>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer
          Datenschutz-Aufsichtsbehörde. Verantwortliche im Sinne der DSGVO ist die oben genannte Anbieterin;
          erreichbar über die angegebene Kontaktadresse.
        </P>

        <H>Urheberrecht</H>
        <P>
          Alle Inhalte dieser App – insbesondere Texte, die Figur „Luna", Illustrationen, Karten- und
          Runen-Motive – sind urheberrechtlich geschützt. Jede Verwendung außerhalb der App bedarf der
          vorherigen Zustimmung des Betreibers.
        </P>

        <div style={{ marginTop: 12, color: '#7a7494', font: '400 10.5px/1.5 var(--font-body)' }}>
          Stand: Juli 2026
        </div>
      </div>
    </div>
  )
}
