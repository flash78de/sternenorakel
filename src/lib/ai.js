// ============================================================
// Hybrid-Engine (Entscheidung 1c): Offline-Generator als Standard,
// optionaler KI-Modus über ein kleines Backend (/api/orakel).
// Ohne erreichbares Backend fällt die App IMMER sauber auf die
// Offline-Sternenbibliothek zurück – kein Fehler, kein Warten.
// ============================================================
import { generateMessage } from '../data/generator.js'

// Backend-Endpunkt: bewusst leer in der Demo. Sobald ein Server existiert,
// hier (oder per Build-Variable) die URL eintragen, z. B. '/api/orakel'.
const AI_ENDPOINT = ''
const AI_TIMEOUT_MS = 8000

export const aiAvailable = Boolean(AI_ENDPOINT)

// Liefert eine Botschaft: KI wenn aktiviert UND erreichbar, sonst offline.
// Gibt zusätzlich source: 'ki' | 'offline' zurück (für ehrliche Kennzeichnung).
export async function fetchMessage(params, { aiMode = false } = {}) {
  const offline = () => ({ ...generateMessage(params), source: 'offline' })

  if (!aiMode || !AI_ENDPOINT) return offline()

  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS)
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      // Datensparsam: nur was für die Botschaft nötig ist – keine Notizen, kein Verlauf.
      body: JSON.stringify({
        mood: params.mood,
        themes: params.themes,
        ritual: params.ritual,
        styles: params.styles,
        coping: params.coping,
        name: params.name ? true : false, // nur OB ein Name existiert, nicht welcher
      }),
    })
    clearTimeout(t)
    if (!res.ok) return offline()
    const data = await res.json()
    // Minimal-Validierung: Backend muss das MESSAGES-Schema liefern.
    if (!data || !data.text || !data.title) return offline()
    return { ...generateMessage(params), ...data, id: `ki-${Date.now()}`, source: 'ki' }
  } catch {
    return offline()
  }
}
