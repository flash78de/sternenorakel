// ============================================================
// Sternenorakel · KI-Backend (Cloudflare Worker)
// ------------------------------------------------------------
// Nimmt die datensparsame Anfrage der App entgegen (kein Name,
// keine Tagebuch-Notizen) und lässt Claude eine Luna-Botschaft
// im MESSAGES-Schema formulieren. Die App fällt bei jedem
// Fehler automatisch auf die Offline-Sternenbibliothek zurück.
//
// Deployment: siehe server/README.md
// Benötigte Secrets/Variablen:
//   ANTHROPIC_API_KEY  (Secret, Pflicht)
//   ALLOWED_ORIGIN     (optional, z. B. https://flash78de.github.io — sonst *)
//   MODEL              (optional, Standard: claude-opus-4-8)
// ============================================================

import { handlePush, pushScheduled } from './push.js'
import { handlePlus } from './plus.js'
import { handlePing } from './zaehler.js'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-opus-4-8'

// Antwortformat, das Claude einhalten MUSS (Structured Output).
// Entspricht dem Teil des MESSAGES-Schemas, den die KI ersetzt —
// Symbole/Archetypen/Karten/Runen bleiben die der App.
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Kurzer poetischer Titel der Botschaft, 2–4 Worte, Deutsch, ohne Anführungszeichen.' },
    text: { type: 'string', description: 'Die Botschaft: 2–3 kurze Absätze, getrennt durch Leerzeilen (\\n\\n). Deutsch, du-Form.' },
    mantra: { type: 'string', description: 'Ein Satz zum Mitnehmen, max. 12 Worte, ohne Anführungszeichen.' },
    question: { type: 'string', description: 'Eine offene, sanfte Reflexionsfrage für das Tagebuch.' },
  },
  required: ['title', 'text', 'mantra', 'question'],
  additionalProperties: false,
}

// Luna-Charakter (Kurzfassung der Character Bible in docs/luna-character-bible.md).
const SYSTEM = `Du schreibst als Luna, die Sternweberin der App „Sternenluna" — eine ruhige, warme, leicht verspielte Begleiterin, die Menschen hilft, den eigenen Tag zu reflektieren.

Grundregeln (nicht verhandelbar):
- Deutsch, du-Form, warm und klar. Kein Esoterik-Kitsch, keine Engel, keine Energien-Beschwörung.
- KEINE Zukunftsvorhersagen, KEINE Heilsversprechen, KEINE medizinischen oder therapeutischen Ratschläge.
- Luna deutet nicht das Schicksal, sondern gibt Sprache für das, was die Person vermutlich ohnehin fühlt (reflektierend, Barnum-artig, aber ehrlich und nie manipulativ).
- Ton: wie eine weise Freundin bei einer Tasse Tee unterm Sternenhimmel. Konkret statt schwülstig. Kurze Sätze sind erlaubt.
- Immer mindestens ein kleiner, machbarer Impuls für HEUTE (keine Lebensumbau-Aufgaben).
- Bei niedriger Stimmung (1–2): besonders sanft, nichts fordern, Entlastung anbieten. Nie „Kopf hoch"-Floskeln.
- Wenn hasName=true ist: beginne den Text mit dem Platzhalter „{{name}}, …" — die App ersetzt ihn lokal durch den echten Namen. Erfinde NIE einen Namen.
- Beziehe das mitgelieferte Ritual-Ergebnis (Archetyp, Karte oder Runen) inhaltlich ein — es ist das, was die Person gerade gezogen hat.`

// ALLOWED_ORIGIN darf eine kommagetrennte Liste sein; geantwortet wird
// mit dem passenden Origin der Anfrage (oder dem ersten der Liste).
const cors = (env, request) => {
  const allowed = (env.ALLOWED_ORIGIN || '*').split(',').map((s) => s.trim()).filter(Boolean)
  const origin = request?.headers?.get('Origin')
  const allow = allowed.includes('*') ? '*' : allowed.includes(origin) ? origin : allowed[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

const json = (body, status, env, request) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(env, request) },
  })

const MOOD_LABEL = { 1: 'erschöpft', 2: 'müde', 3: 'ausgeglichen', 4: 'wach', 5: 'voller Energie' }
const STYLE_LABEL = { klar: 'klar & direkt', leicht: 'leicht & humorvoll', warm: 'warm & bestärkend', tief: 'tief & nachdenklich' }
const COPING_LABEL = {
  schritt: 'ein kleiner konkreter Schritt',
  perspektive: 'ein Perspektivwechsel',
  zuspruch: 'ehrlicher Zuspruch',
  nachdenken: 'Raum zum Nachdenken',
}

// Baut aus der datensparsamen Anfrage den Prompt für Claude.
function buildPrompt(b) {
  const lines = ['Schreibe die heutige Botschaft für diese Person:', '']
  lines.push(`- Stimmung heute: ${MOOD_LABEL[b.mood] || 'unbekannt'} (${b.mood ?? '?'} von 5)`)
  if (Array.isArray(b.themes) && b.themes.length) lines.push(`- Gewählte Lebensthemen: ${b.themes.join(', ')}`)
  if (b.theme) lines.push(`- Thema dieser Botschaft: ${b.theme}`)
  const styles = (b.styles || []).map((s) => STYLE_LABEL[s]).filter(Boolean)
  if (styles.length) lines.push(`- Gewünschter Ton: ${styles.join(' und ')}`)
  if (b.coping && COPING_LABEL[b.coping]) lines.push(`- Was bei Schwierigem hilft: ${COPING_LABEL[b.coping]}`)
  lines.push(`- hasName: ${b.hasName === true}`)
  lines.push('')

  if (b.ritual === 'karten' && b.card) {
    lines.push(`Ritual: Sternenkarten. Gezogene Karte: „${b.card.title}" (Thema: ${b.card.thema || '—'}).`)
    lines.push('Der Titel deiner Botschaft ist der Kartentitel; deute die Karte im Text.')
  } else if (b.ritual === 'runen' && Array.isArray(b.runes) && b.runes.length) {
    lines.push('Ritual: Sternenrunen. Gelegte Runen:')
    for (const r of b.runes) lines.push(`  · ${r.name} — Position: ${r.position}`)
    lines.push('Verwebe die drei Positionen (Nachwirken / Jetzt / Entstehen) im Text.')
  } else if (b.archetype) {
    lines.push(`Ritual: Sternenwürfel. Gewürfelter Archetyp: „${b.archetype.name}" — Kern: ${b.archetype.kern}`)
    if (b.archetype.impuls) lines.push(`  Kleine Handlung dazu: ${b.archetype.impuls}`)
    lines.push('Greife den Archetyp im Text auf.')
  }
  return lines.join('\n')
}

// Eigenes Rate-Limit (Schutz des API-Guthabens): 6 Anfragen/Minute pro IP,
// 60/Minute insgesamt pro Worker-Instanz. Das Cloudflare-Ratelimit-Binding
// greift auf dem Free-Plan nicht zuverlässig, daher zählen wir selbst.
const ipHits = new Map()
let allHits = []
function rateOk(ip) {
  const now = Date.now()
  const win = 60000
  allHits = allHits.filter((t) => now - t < win)
  if (allHits.length >= 60) return false
  const mine = (ipHits.get(ip) || []).filter((t) => now - t < win)
  if (mine.length >= 6) {
    ipHits.set(ip, mine)
    return false
  }
  mine.push(now)
  ipHits.set(ip, mine)
  allHits.push(now)
  if (ipHits.size > 5000) ipHits.clear() // Speicher-Backstop
  return true
}

export default {
  // Cron (*/15): tägliche Erinnerungen zur Wunschzeit der Nutzerin
  async scheduled(event, env, ctx) {
    ctx.waitUntil(pushScheduled(env))
  },

  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env, request) })
    if (request.method !== 'POST') return json({ error: 'Nur POST.' }, 405, env, request)

    // Rate-Limit: bei Überschreitung 429 – die App fällt lautlos auf offline zurück.
    const ip = request.headers.get('CF-Connecting-IP') || 'unbekannt'
    if (!rateOk(ip)) return json({ error: 'Zu viele Anfragen – bitte kurz warten.' }, 429, env, request)

    // Push-Erinnerungen (Abo an/aus, Testnachricht) – gleiche CORS-/Rate-Regeln
    const url = new URL(request.url)
    if (url.pathname.startsWith('/push/')) {
      return handlePush(request, env, url, (body, status) => json(body, status, env, request))
    }
    // Sternenzähler: anonyme Tageszählung (kein Personenbezug)
    if (url.pathname === '/ping') {
      return handlePing(request, env, (body, status) => json(body, status, env, request))
    }
    // Plus-Freischaltung (Gutscheine, PayPal) + Kündigungsbutton (§ 312k BGB)
    if (url.pathname.startsWith('/coupon/') || url.pathname.startsWith('/pay/') || url.pathname === '/kuendigen') {
      return handlePlus(request, env, url, (body, status) => json(body, status, env, request), ctx)
    }

    if (!env.ANTHROPIC_API_KEY) return json({ error: 'ANTHROPIC_API_KEY fehlt.' }, 500, env, request)
    if (env.RATE_LIMITER) {
      const { success } = await env.RATE_LIMITER.limit({ key: ip }).catch(() => ({ success: true }))
      if (!success) return json({ error: 'Zu viele Anfragen – bitte kurz warten.' }, 429, env, request)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Ungültiges JSON.' }, 400, env, request)
    }

    try {
      const res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: env.MODEL || DEFAULT_MODEL,
          // Großzügig: adaptives Thinking zählt mit ins Budget – zu knapp
          // bemessen wurde der Botschaftstext mitten im Satz abgeschnitten.
          max_tokens: 4000,
          thinking: { type: 'adaptive' },
          system: SYSTEM,
          output_config: { format: { type: 'json_schema', schema: OUTPUT_SCHEMA } },
          messages: [{ role: 'user', content: buildPrompt(body) }],
        }),
      })

      if (!res.ok) {
        // Keine API-Fehlerdetails nach außen geben (Info-Leak) – die App
        // braucht nur das Signal „nicht verfügbar" für den Offline-Fallback.
        return json({ error: 'KI-Dienst derzeit nicht verfügbar.' }, 502, env, request)
      }

      const data = await res.json()
      if (data.stop_reason === 'refusal') return json({ error: 'Anfrage wurde abgelehnt.' }, 502, env, request)
      // Abgeschnittene Antworten NIE ausliefern – die App soll offline zurückfallen
      if (data.stop_reason === 'max_tokens') return json({ error: 'Antwort unvollständig.' }, 502, env, request)

      // Bei aktiviertem Thinking kommen thinking- UND text-Blöcke; wir brauchen den Text.
      const textBlock = (data.content || []).find((c) => c.type === 'text')
      if (!textBlock) return json({ error: 'Leere Antwort.' }, 502, env, request)

      const msg = JSON.parse(textBlock.text) // dank json_schema garantiert valide
      return json(msg, 200, env, request)
    } catch (e) {
      return json({ error: 'Interner Fehler.' }, 500, env, request)
    }
  },
}
