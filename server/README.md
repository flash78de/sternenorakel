# Sternenorakel · KI-Backend

Ein kleiner [Cloudflare Worker](https://workers.cloudflare.com/) (kostenloser Plan reicht),
der Luna-Botschaften live von **Claude** (Anthropic API) formulieren lässt.

Die App funktioniert **komplett ohne dieses Backend** — sie nutzt dann die
Offline-Sternenbibliothek. Das Backend ist optional (Entscheidung „Hybrid 1c").

## Was der Worker macht

- Nimmt per `POST` die datensparsame Anfrage der App entgegen:
  Stimmung (1–5), Themen, Ritual + gezogenes Ergebnis (Archetyp/Karte/Runen),
  Ton-Präferenzen. **Kein Name** (nur `hasName: true/false`, die App setzt den
  Namen lokal über den Platzhalter `{{name}}` ein), **keine Tagebuch-Notizen**.
- Ruft `POST https://api.anthropic.com/v1/messages` auf
  (Modell `claude-opus-4-8`, adaptives Thinking, Structured Output per JSON-Schema).
- Antwortet mit `{ title, text, mantra, question }` — die App mischt das in ihr
  MESSAGES-Schema; Symbole/Karten/Runen bleiben die lokal gezogenen.
- Bei jedem Fehler (Timeout, 4xx/5xx, ungültige Antwort) fällt die App
  automatisch und ohne Fehlermeldung auf die Offline-Bibliothek zurück.

## Deployment (einmalig, ~5 Minuten)

Voraussetzungen: [Node.js](https://nodejs.org), ein Cloudflare-Konto (gratis)
und ein [Anthropic-API-Key](https://console.anthropic.com/).

```bash
npm install -g wrangler
cd server
wrangler init --yes            # falls noch kein wrangler.toml existiert, siehe unten
wrangler secret put ANTHROPIC_API_KEY   # API-Key einfügen (wird nie ins Repo committet!)
wrangler deploy
```

Minimales `server/wrangler.toml`:

```toml
name = "sternenorakel-orakel"
main = "orakel-worker.js"
compatibility_date = "2026-06-01"

[vars]
# Empfohlen: nur die eigene App zulassen (sonst gilt *):
ALLOWED_ORIGIN = "https://flash78de.github.io"
# Optional anderes Modell:
# MODEL = "claude-opus-4-8"
```

`wrangler deploy` gibt am Ende die URL aus, z. B.
`https://sternenorakel-orakel.<dein-account>.workers.dev`.

## In der App verbinden

1. App öffnen → **Profil → Einstellungen**
2. **KI-Modus** einschalten
3. Die Worker-URL in das Feld **„KI-Server-Adresse"** eintragen — fertig.

Die Einstellung wird lokal gespeichert (localStorage), wie alles andere auch.

## Kosten & Sicherheit

- Der API-Key liegt **nur** als Cloudflare-Secret auf dem Worker, nie in der App
  oder im Repo.
- Eine Botschaft kostet grob 1–3 Cent (Opus-Preise, kurze Antworten).
- Wer den Worker öffentlich betreibt, sollte `ALLOWED_ORIGIN` setzen und kann
  zusätzlich Cloudflare **Rate Limiting** (Dashboard → Security) aktivieren,
  damit niemand fremdes den eigenen API-Key leerläuft.

## Lokal testen

```bash
cd server
wrangler dev            # startet auf http://localhost:8787
curl -s http://localhost:8787 -X POST -H 'Content-Type: application/json' -d '{
  "mood": 2, "themes": ["Selbstwert"], "ritual": "wuerfel", "hasName": true,
  "styles": ["warm"], "coping": "zuspruch", "theme": "Selbstwert",
  "archetype": { "name": "Ruhe", "kern": "Deine Kraft liegt heute im Innehalten." }
}'
```

Erwartete Antwort: JSON mit `title`, `text` (mit `{{name}}`-Anfang), `mantra`, `question`.
