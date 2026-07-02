// ============================================================
// Bild-Zuordnung für das gemalte Karten-&-Runen-Set.
// Die Einzelbilder erzeugt scripts/slice-set.mjs aus dem großen
// Set-PNG (public/uploads/set-karten-runen.png) → uploads/opt/.
// Fehlt ein Motiv im Set (z. B. Rune Ansuz), liefern die Helfer
// null und die App zeigt den bisherigen gezeichneten Platzhalter.
// ============================================================
import { asset } from './asset.js'

// Wird auf true gestellt, sobald scripts/slice-set.mjs die Einzelbilder
// erzeugt hat (uploads/opt/karte-*.webp, rune-*.webp). Solange false,
// zeigt die App die bisherigen gezeichneten Platzhalter.
const SET_VERFUEGBAR = false

// Kartentitel → Datei-Schlüssel
const KARTEN_KEY = {
  'Der stille Kompass': 'kompass',
  'Das offene Tor': 'tor',
  'Die goldene Feder': 'feder',
  'Der ruhende See': 'see',
  'Der erste Funke': 'funke',
  'Der verborgene Weg': 'weg',
}
// Welche Varianten das Set hergibt
const HAT_HOCHKANT = new Set(['kompass', 'tor', 'feder', 'see', 'funke'])
const HAT_QUER = new Set(['kompass', 'tor', 'funke', 'weg'])

// Runenname → Datei-Schlüssel (Ansuz ist im gemalten Set nicht enthalten)
const RUNEN_KEY = {
  Fehu: 'fehu', Raidho: 'raidho', Sowilo: 'sowilo', Wunjo: 'wunjo',
  Berkano: 'berkano', Isa: 'isa', Algiz: 'algiz',
}

// Hochkant-Kartenbild (md|sm) oder null
export function karteBild(title, size = 'md') {
  const k = KARTEN_KEY[title]
  if (!SET_VERFUEGBAR || !k || !HAT_HOCHKANT.has(k)) return null
  return asset(`uploads/opt/karte-${k}-${size}.webp`)
}

// Quer-Banner der Karte oder null
export function karteBanner(title) {
  const k = KARTEN_KEY[title]
  if (!SET_VERFUEGBAR || !k || !HAT_QUER.has(k)) return null
  return asset(`uploads/opt/karte-${k}-quer-md.webp`)
}

// Runenstein-Bild (sm|md) oder null
export function runeBild(name, size = 'sm') {
  const k = RUNEN_KEY[name]
  return SET_VERFUEGBAR && k ? asset(`uploads/opt/rune-${k}-${size}.webp`) : null
}
