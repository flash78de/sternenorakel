# Sternenorakel

Eine deutschsprachige, **local-first** Begleiter-App (Web / PWA, mobil-first, Hochformat).
Das Sternenwesen **Luna** schenkt dir täglich eine persönlich wirkende, reflektierende
Botschaft – kombiniert mit Journaling, Habit-Tracking und einem Rang-/Belohnungssystem.

Umgesetzt aus dem Claude-Design-Handoff „Sternenorakel UI-Flow" als echte, interaktive
React-App.

## Stack

- **React 18 + Vite 5**
- **react-router-dom** (HashRouter) für den Screen-Flow
- **vite-plugin-pwa** – installierbar, Offline-Cache, Manifest
- Zustand komplett **local-first** in `localStorage` (kein Konto, keine Wolke)

## Entwicklung

```bash
npm install
npm run dev        # Entwicklungsserver
npm run build      # Produktions-Build nach dist/
npm run preview    # Build lokal prüfen
```

## Designsystem

| Token            | Wert |
|------------------|------|
| Hintergrund      | `#0B0A12` / `#13111C` (Anthrazit-Aubergine) |
| Lila-Verlauf     | `#6A3BE8 → #A66BFF` |
| Gold-Akzent      | `#E8C77A` / `#D9B45A` (nur Headlines, Icons, CTAs) |
| Text             | `#F5F4FA` (hell) · `#B6B0CE` (sekundär) |
| Headlines        | Cinzel (Serif) |
| Fließtext        | Inter (Sans) |
| Stil             | Glassmorphism 2.0, Radius 16–20px, Gold-Lichtkante, Lila-Orbs, Sternen-Funkeln |

Tokens & Animationen (`floaty`, `orbpulse`, `burst`, `twinkle`) leben in
`src/styles/index.css`; Komponenten-Stile in `src/styles/components.css`.

## Screens & Flow

- **Onboarding** (`/welcome` → `/onboarding`): 4 Schritte – Name → Themen (max. 3) →
  Stimmung (1–5) → Geburtstag mit **automatisch berechnetem Sternzeichen**.
- **Anmeldung** (`/auth`): local-first als Standard; „Konto erstellen" ist ausgegraut
  („derzeit nicht verfügbar"). `/auth/account` zeigt die Zukunfts-Variante (magischer Link).
- **Dashboard** (`/dashboard`): App-Bar, Begrüßung (tageszeitabhängig), Status-Chips,
  XP-/Sternenband-Leiste, Luna-Hero mit CTA, 7-Tage-Serie, Teaser der letzten Botschaft.
  Eigener **Leer-Zustand** an Tag 1; **Belohnungs-Popup** bei vollendetem Sternbild / Rangaufstieg.
- **Orakel** (`/oracle`): Ritual-Auswahl (Sternenwürfel frei, Karten & Runen = Plus).
  Kern-Flow (`/oracle/draw`): Auslöser-Orb → Lauschen → Offenbarung (Lichtstoß) →
  Botschaft (Symbol, Mantra, Glückselement, Tagesenergie, Barnum-Hinweis) →
  Reflexion + Speichern (Erfolgs-Banner). Inklusive **Fehlerzustand**. Eine Ziehung pro Tag.
- **Wissen** (`/wissen`): „Was die App sein will" (+ Therapie-Hinweis), „Wie Botschaften
  entstehen" (Barnum), FAQ-Akkordeon.
- **Tagebuch** (`/tagebuch`): Liste der letzten 7 Botschaften mit Suche; eigener Leer-Zustand.
- **Profil** (`/profil`): Sternenband mit kanonischer Rang-Leiter
  (Sternenfunke → Mondwanderer → Sternensammler → Lichtträger → Himmelsdeuter → Erleuchtete\*r).
- **Einstellungen** (`/profil/settings`): Erinnerung, Themen/Ton, Plus, Therapie-Hinweis.
- **Daten & Privatsphäre** (`/profil/privacy`): **KI-Modus**-Schalter (aus → eingebaute
  Bibliothek), Export, „Alle Daten löschen" mit Bestätigungsdialog.

5-Tab-Navigation am unteren Rand: **Start · Orakel · Wissen · Tagebuch · Profil**.

## Datenmodell (local-first)

Alles unter dem Schlüssel `sternenorakel.v1` in `localStorage`:
Profil (Name, Themen, Stimmung, Geburtstag, Sternzeichen), Statistik (Sternenstaub,
Serie, Sternbilder), Einstellungen (KI-Modus, Erinnerung, Ton) und das Tagebuch.
„Alle Daten löschen" entfernt diesen Schlüssel vollständig.

## Haltung

Luna ist ein **weiser Begleiter, kein unfehlbares Orakel**. Der Barnum-Effekt wird
transparent erklärt, ein Therapie-Hinweis ist an mehreren Stellen präsent, und das
Belohnungssystem ist bewusst ehrlich (kein Lootbox-/Fake-Knappheit-Druck).
