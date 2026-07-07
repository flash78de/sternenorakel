// ============================================================
// Sternenzähler – anonyme Tageszählung (POST /ping)
// ------------------------------------------------------------
// Die App meldet höchstens einmal pro Gerät und Tag ein „+1“ –
// ohne Cookie, ohne Kennung, ohne IP-Speicherung. Gespeichert
// wird NUR ein Tageszähler im KV:
//   zaehler:YYYY-MM-DD → {"starts": n, "neu": m}
//   starts = aktive Geräte an diesem Tag · neu = Erststarts
// Kein Personenbezug: Das Signal enthält nur {neu: true|false}.
// ============================================================

import { adminNotify } from './plus.js'

// ---- Lunas Morgenbericht: täglich ~08:00 deutscher Zeit ein Push an
// Marcels Admin-Gerät mit Gestern-Zahlen und Gutschein-Ständen. Läuft
// über den bestehenden */15-Cron; bericht:last verhindert Doppelsendung.
export async function morgenBericht(env, jetzt = new Date()) {
  if (!env.PUSH || !env.VAPID_PRIVATE_JWK) return
  const [h, m] = jetzt
    .toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour12: false, hour: '2-digit', minute: '2-digit' })
    .split(':')
    .map(Number)
  if (h !== 8 || m >= 15) return
  const heute = jetzt.toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' })
  if ((await env.PUSH.get('bericht:last')) === heute) return
  await env.PUSH.put('bericht:last', heute) // zuerst markieren – nie doppelt senden
  await adminNotify(env, '☾ Lunas Morgenbericht', await berichtText(env, jetzt))
}

// Berichtstext getrennt gehalten (so bleibt er ohne Push-Versand testbar).
export async function berichtText(env, jetzt = new Date()) {
  const gestern = new Date(jetzt.getTime() - 86400000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' })
  let z = { starts: 0, neu: 0 }
  try {
    z = JSON.parse((await env.PUSH.get('zaehler:' + gestern)) || '{"starts":0,"neu":0}')
  } catch {
    /* fehlender/kaputter Zähler = 0 */
  }
  const codes = []
  try {
    const page = await env.PUSH.list({ prefix: 'coupon:' })
    for (const { name } of page.keys) {
      const c = JSON.parse((await env.PUSH.get(name)) || '{}')
      const max = Number(c.maxUsers || 0)
      const kurz = name.replace('coupon:LUNA-', '').replace(/-\d{4}$/, '')
      codes.push(`${kurz} ${(c.devices || []).length}${max ? '/' + max : ''}`)
    }
  } catch {
    /* ohne Codes trotzdem berichten */
  }
  return (
    `Gestern: ${z.starts} Sternenmoment${z.starts === 1 ? '' : 'e'} · ${z.neu} neue Geräte` +
    (codes.length ? ` · Codes: ${codes.join(' · ')}` : '')
  )
}

export async function handlePing(request, env, json) {
  if (!env.PUSH) return json({ ok: true }, 200)
  let neu = false
  try {
    neu = Boolean((await request.json())?.neu)
  } catch {
    /* leerer Body ist ok */
  }
  // Tagesgrenze nach deutscher Zeit (Kernzielgruppe)
  const tag = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' })
  const key = 'zaehler:' + tag
  try {
    const cur = JSON.parse((await env.PUSH.get(key)) || '{"starts":0,"neu":0}')
    cur.starts += 1
    if (neu) cur.neu += 1
    // 400 Tage aufbewahren – genug für Jahresvergleiche, dann Selbstlöschung
    await env.PUSH.put(key, JSON.stringify(cur), { expirationTtl: 60 * 60 * 24 * 400 })
  } catch {
    /* Zählen darf nie einen Fehler in die App tragen */
  }
  return json({ ok: true }, 200)
}
