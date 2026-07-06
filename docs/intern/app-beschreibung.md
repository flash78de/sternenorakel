# Sternenluna – App-Beschreibung (internes Dokument)

Stand: Juli 2026 · Version 1.1 · https://sternenluna.de

## 1. Kurzprofil

Sternenluna ist eine deutschsprachige Progressive Web App (PWA) für tägliche
Selbstreflexion. Die Begleiterin **Luna** überreicht einmal täglich eine
persönliche Botschaft (Barnum-Stil, bewusst ehrlich gerahmt), lädt zur
Reflexion ein und belohnt Kontinuität mit einer sanften Fortschrittswelt
(Sternenstaub, Serien, Ränge, Sternbilder). Kernprinzip: **local-first** –
alle persönlichen Daten bleiben auf dem Gerät der Nutzerin.

- Zielgruppe: v. a. Frauen 20–45, Interesse an Achtsamkeit/Spiritualität,
  deutschsprachig, mobile Nutzung (iPhone-lastig).
- Positionierung: ehrliche Alternative zu Horoskop-Apps – Symbolsprache
  statt Wahrsagerei, Reflexion statt Vorhersage, keine Heilsversprechen.
- Monetarisierung: Freemium (Sternenluna Plus als Abo) + Einmalkauf
  (Chakren-Reise).

## 2. Technik

### 2.1 Frontend
- **React 18 + Vite 5**, HashRouter (GitHub-Pages-kompatibel)
- **PWA** über vite-plugin-pwa (Workbox generateSW), `display: standalone`,
  vollständig offlinefähig (Precache inkl. Bilder/Fonts)
- **Fonts lokal im Repo** (Cinzel + Inter als latin-subset woff2) – keine
  Google-Einbindung (DSGVO)
- Persistenz: `localStorage`-Schlüssel **`sternenorakel.v1`** (nie ändern –
  Migrationen laufen in `store.jsx` und dürfen keine Daten verlieren);
  Geräte-ID unter `sternenluna.device` (übersteht bewussten Reset)
- Tests: `npm test` = Push-Krypto-Unittests (8) + Playwright-E2E (22) +
  KI-Flow-E2E (6) = **36 Checks**; CI via GitHub Actions

### 2.2 Backend (Cloudflare Worker `sternenluna-orakel`)
Ein einziger Worker (https://sternenluna-orakel.sternenorakel.workers.dev):
- **KI-Proxy**: formuliert Botschaften über die Claude-API (Modell
  claude-opus-4-8). Datensparsam: kein Name (nur ob einer existiert),
  keine Notizen, kein Verlauf. Rate-Limit + Ausgabendeckel.
- **Web-Push**: RFC 8291 (aes128gcm) + RFC 8292 (VAPID ES256) in reinem
  WebCrypto; Cron alle 15 Min sendet Tageserinnerungen pro Nutzer-Ortszeit,
  räumt tote Abos (404/410) auf. Abos in **Workers KV**.
- **Gutscheine & Gratis-Test**: Codes in KV (`coupon:CODE`) mit
  Tagen/Nutzer-Limit/einmal-pro-Gerät; 7-Tage-Test serverseitig einmal pro
  Gerät (`trial:<hash>`). Geräte-IDs werden nur gehasht gespeichert.
- **PayPal** (Orders API v2, serverseitige Capture-Prüfung): Pläne
  monat 4,99 € / jahr 39,99 € / chakren 9,99 € (dauerhaft). Aktuell hinter
  `PAY_ACTIVE="false"` verborgen, bis das PayPal-Konto freigegeben ist.
  Echte PayPal-Subscriptions (automatische Verlängerung) folgen danach.
- **§312k-Kündigung**: `/kuendigen` nimmt Kündigungen entgegen, speichert
  sie in KV und liefert eine Vorgangsnummer.

### 2.3 Deployment
`git push` auf `master` → GitHub Actions → GitHub Pages (sternenluna.de).
Worker-Deploys über wrangler (KV-Schreibzugriffe immer mit `--remote`).

## 3. Inhalt & Funktionsumfang

### 3.1 Kernschleife (täglich, gratis)
1. **Befinden** wählen (fließt in Ton/Tiefe der Botschaft ein)
2. **Sternenwürfel-Ritual** → Tagesbotschaft (KI-formuliert, wenn aktiviert;
   sonst kuratierte Offline-Bibliothek – Hybrid mit stillem Fallback,
   Wartezeit hart auf ~9 s gedeckelt)
3. **Reflexion** direkt am Eintrag (auto-gespeichert ins Tagebuch)
4. **Feier-Moment**: Sternenstaub, Serie, ggf. Rangaufstieg/Sternbild

### 3.2 Fortschrittswelt
- **Sternenstaub & Serie** (Wochenband mit echten Zieh-Tagen; Tage vor der
  Installation ausge-x-t)
- **6 Ränge** (Sternenfunke → Erleuchtete*r), jeder mit eigener Kapitel-Story
- **Sternbilder**: Reflexions-Meilensteine je Themenfeld (keine Zufalls-Sticker)
- **Glückselemente**: Abzeichen-Sammlung, abgeleitet aus dem Tagebuch
- **Rückkehr-Screen** nach Pausen (bewusst schamfrei)

### 3.3 Plus (4,99 €/Monat · 39,99 €/Jahr)
- Sternenkarten- & Runen-Ritual (je eigene Deutungswelt, eigene Artworks)
- Freie Impulse (mehrfach ziehen, ohne Serie/Staub)
- KI-Botschaften unbegrenzt (gratis: nur in den ersten 7 Sterntagen)
- Monatsbild (30-Tage-Auswertung mit Lunas Rückblick)
- Gesprochene Botschaften (Sprachausgabe)
- Chakren-Reise komplett
- **Anti-Abo-Falle**: automatische Verlängerung offen angekündigt
  (Popups 14+3 Tage vor Jahres-, 3 Tage vor Monatsabbuchung, mit Kaufdatum),
  kündbar bis einen Tag vorher, Kündigung mit bewusster Doppel-Bestätigung;
  öffentliche §312k-Kündigungsseite ohne Login
- 7-Tage-Gratis-Test (einmal pro Gerät, serverseitig geprüft) + Gutschein-Codes

### 3.4 Chakren-Reise (Plus oder 9,99 € Einmalkauf)
7 handgemalte Stationen (eigene Kartenreihe) mit Klang (Bija-Mantra),
Affirmationen, Reflexionsfrage und Körperkarte (illustrierte Figur mit
antippbaren Chakra-Punkten, Vollbild-Lightbox). Station 1 als Kostprobe frei,
Reihenfolge fix, **eine neue Station pro Tag**. Ehrliche Rahmung als
Symbolsprache. Geführte Audio-Meditation vorbereitet („in Kürze“).

### 3.5 Weitere Bereiche
- **Wissen-Hub**: Über Sternenluna · Psychologie (Barnum offen erklärt) ·
  Symbol-Lexikon (Karten/Runen/Archetypen) · Chakren · FAQ
- **Tagebuch** mit Wochen-/Abendmodus, Export/Teilen (Share-Bilder ohne
  persönliche Daten)
- **Erinnerungen**: echte Web-Push-Nachrichten zur Wunschzeit
- **Backup**: Datei-Export/-Import (iPhone „Dateien“), E-Mail-Backup,
  Erinnerungs-Popup alle 7 Tage (mit „Später“)
- **SOS-Button** auf dem Dashboard: Sofort-Hilfe-Vorschau (Inhalte „in
  Kürze“) + Telefonseelsorge-Nummer
- **Einstellungen** als Hub (Profil, Luna & Botschaften, Plus & Käufe,
  Daten & Rechtliches, App) inkl. KI-Einwilligung (DSGVO, U16-Hinweis)
- **Rechtliches**: Impressum, Datenschutz, Abo & Kündigung

## 4. Datenschutz-Grundsätze
- Alle Einträge, Notizen, Profile: nur lokal auf dem Gerät
- KI-Aufrufe nur mit expliziter Einwilligung; minimale Payload
- Push-Abos und Gutschein-Einlösungen serverseitig nur gehasht/pseudonym
- Keine Tracker, keine Analytics, keine Fremd-Fonts

## 5. Offene Punkte
- PayPal-Konto-Verifizierung (KYC) → danach `PAY_ACTIVE="true"`, Testkauf,
  echte PayPal-Subscriptions + Kündigungs-API anbinden
- Geführte Chakren-Meditation (MP3) einsprechen → Audio-Player einbauen
- Sofort-Hilfe-Inhalte (Atemkreis, Meditation, 90-s-Ritual)
- workers.dev-Subdomain heißt noch „sternenorakel“ (nur im Dashboard änderbar;
  danach App-Endpoint anpassen)
- Alle im Chat geteilten Zugangsdaten rotieren (Cloudflare-Token, PayPal,
  VAPID)
