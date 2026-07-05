// ============================================================
// Hybrid-Engine (Entscheidung 1c): Offline-Generator als Standard,
// optionaler KI-Modus über ein kleines Backend (server/orakel-worker.js).
// Ohne erreichbares Backend fällt die App IMMER sauber auf die
// Offline-Sternenbibliothek zurück – kein Fehler, kein Warten.
// ============================================================
import { generateMessage } from '../data/generator.js'

// Fest eingebauter Endpunkt: der eigene Cloudflare Worker (server/).
// Der KI-Modus-Schalter in den Einstellungen aktiviert ihn; über
// settings.aiEndpoint ließe sich intern ein anderer Server testen.
export const AI_ENDPOINT = 'https://sternenluna-orakel.sternenorakel.workers.dev'
// Opus mit Thinking braucht oft 8–15 s – großzügig warten,
// die Offenbarungs-Animation überbrückt die Zeit.
const AI_TIMEOUT_MS = 20000

export const aiAvailable = Boolean(AI_ENDPOINT)

// Ist irgendein Endpunkt konfiguriert (Build-Konstante ODER Einstellung)?
export const isAiConfigured = (endpoint) => Boolean((endpoint || AI_ENDPOINT || '').trim())

// Liefert eine Botschaft: KI wenn aktiviert UND erreichbar, sonst offline.
// Gibt zusätzlich source: 'ki' | 'offline' zurück (für ehrliche Kennzeichnung).
// Wichtig: Das Ritual-Ergebnis (Archetyp/Karte/Runen) wird IMMER lokal gezogen;
// die KI formuliert nur Titel, Text, Mantra und Reflexionsfrage passend dazu.
export async function fetchMessage(params, { aiMode = false, endpoint = '' } = {}) {
  const base = generateMessage(params)
  const offline = () => ({ ...base, source: 'offline' })

  const url = (endpoint || AI_ENDPOINT || '').trim()
  if (!aiMode || !url) return offline()

  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      // Datensparsam: nur was für die Botschaft nötig ist – keine Notizen,
      // kein Verlauf, kein Name (nur OB einer existiert; die Anrede setzt
      // die App lokal über den {{name}}-Platzhalter ein).
      body: JSON.stringify({
        mood: params.mood,
        themes: params.themes,
        ritual: params.ritual,
        styles: params.styles,
        coping: params.coping,
        hasName: Boolean((params.name || '').trim()),
        // Lokal gezogenes Ergebnis, damit der KI-Text dazu passt:
        theme: base.theme,
        archetype: base.archetype ? { name: base.archetype.name, kern: base.archetype.kern, impuls: base.archetype.impuls } : undefined,
        card: base.card ? { title: base.card.title, thema: base.card.thema } : undefined,
        runes: base.runes ? base.runes.map((r) => ({ name: r.name, position: r.position })) : undefined,
      }),
    })
    clearTimeout(t)
    if (!res.ok) return offline()
    const data = await res.json()
    // Minimal-Validierung: Backend muss mindestens einen Text liefern.
    if (!data || typeof data.text !== 'string' || !data.text.trim()) return offline()
    // Abgeschnittene Texte erkennen (Token-Limit): endet die Botschaft nicht
    // mit einem Satzzeichen, lieber die Offline-Bibliothek als ein halber Satz.
    if (!/[.!?…"“”)]\s*$/.test(data.text.trim())) return offline()

    const name = (params.name || '').trim()
    const text = data.text.replaceAll('{{name}}', name || 'Du')
    return {
      ...base,
      title: data.title || base.title,
      text,
      mantra: data.mantra || base.mantra,
      reflection: data.question || base.reflection,
      id: `ki-${Date.now()}`,
      source: 'ki',
    }
  } catch {
    return offline()
  }
}
