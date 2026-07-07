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
