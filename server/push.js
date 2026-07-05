// ============================================================
// Sternenluna · Web-Push (Cloudflare Worker Modul)
// ------------------------------------------------------------
// Echte tägliche Erinnerungen ohne Drittanbieter-Dienst:
//  - POST /push/subscribe   {sub, time:"21:00", tzOff}  → in KV speichern
//  - POST /push/unsubscribe {endpoint}                  → aus KV löschen
//  - POST /push/test        {sub}                       → sofort eine Nachricht
//  - scheduled (Cron */15): wer gerade seine Wunschzeit erreicht, bekommt Push
//
// Datensparsam: gespeichert werden NUR die Push-Adresse des Browsers
// (pseudonym, vom Push-Dienst vergeben), die Wunschzeit und die Zeitzone.
// Kein Name, keine Themen, nichts aus dem Tagebuch.
//
// Kryptografie nach Standard: VAPID (RFC 8292, ES256-JWT) und
// aes128gcm-Payload-Verschlüsselung (RFC 8291) – nur der Browser der
// Nutzerin kann die Nachricht lesen, nicht der Push-Dienst.
// Benötigt: Secret VAPID_PRIVATE_JWK, Var VAPID_PUBLIC, KV-Binding PUSH.
// ============================================================

const te = new TextEncoder()
const VAPID_SUBJECT = 'mailto:ml@mittel-bar.com'

// Nur echte Push-Dienste als Ziel akzeptieren (kein Missbrauch als Proxy)
const PUSH_HOST_OK = (h) =>
  h === 'fcm.googleapis.com' ||
  h === 'web.push.apple.com' ||
  h.endsWith('.push.apple.com') ||
  h.endsWith('.push.services.mozilla.com') ||
  h.endsWith('.notify.windows.com')

// ---- Base64url-Helfer ----
const b64uToBytes = (s) => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4))
  return Uint8Array.from(b, (c) => c.charCodeAt(0))
}
const bytesToB64u = (buf) => {
  const u = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i])
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const concat = (...parts) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
  let o = 0
  for (const p of parts) {
    out.set(p, o)
    o += p.length
  }
  return out
}

async function hkdf(salt, ikm, info, len) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits'])
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, len * 8))
}

// ---- RFC 8291: Payload für genau diesen Browser verschlüsseln ----
export async function encryptPayload(plaintext, p256dhB64u, authB64u) {
  const uaPub = b64uToBytes(p256dhB64u) // 65 Bytes, unkomprimierter P-256-Punkt
  const authSecret = b64uToBytes(authB64u) // 16 Bytes
  const asKeys = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', asKeys.publicKey))
  const uaKey = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, asKeys.privateKey, 256))

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyInfo = concat(te.encode('WebPush: info\0'), uaPub, asPub)
  const ikm = await hkdf(authSecret, ecdh, keyInfo, 32)
  const cek = await hkdf(salt, ikm, te.encode('Content-Encoding: aes128gcm\0'), 16)
  const nonce = await hkdf(salt, ikm, te.encode('Content-Encoding: nonce\0'), 12)

  const record = concat(te.encode(plaintext), new Uint8Array([2])) // 0x02 = letzter Record
  const aes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt'])
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aes, record))

  // aes128gcm-Header: salt(16) | recordsize(4) | keyid-länge(1) | as_public(65)
  const header = concat(salt, new Uint8Array([0, 0, 16, 0]), new Uint8Array([asPub.length]), asPub)
  return concat(header, ct)
}

// ---- RFC 8292: VAPID-Authorization-Header (ES256-JWT) ----
export async function vapidAuth(endpoint, env) {
  const { origin } = new URL(endpoint)
  const jwk = JSON.parse(env.VAPID_PRIVATE_JWK)
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'])
  const enc = (obj) => bytesToB64u(te.encode(JSON.stringify(obj)))
  const input = `${enc({ typ: 'JWT', alg: 'ES256' })}.${enc({ aud: origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: VAPID_SUBJECT })}`
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, te.encode(input))
  return `vapid t=${input}.${bytesToB64u(sig)}, k=${env.VAPID_PUBLIC}`
}

// Eine Push-Nachricht senden; Rückgabe: HTTP-Status des Push-Dienstes.
export async function sendPush(sub, payload, env) {
  const body = await encryptPayload(JSON.stringify(payload), sub.keys.p256dh, sub.keys.auth)
  const res = await fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      Authorization: await vapidAuth(sub.endpoint, env),
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: '86400',
      Urgency: 'normal',
    },
    body,
  })
  return res.status
}

// ---- Abo-Verwaltung (KV) ----
const subKey = async (endpoint) =>
  'sub:' + bytesToB64u(await crypto.subtle.digest('SHA-256', te.encode(endpoint)))

function validSub(sub) {
  try {
    const u = new URL(sub?.endpoint || '')
    return u.protocol === 'https:' && PUSH_HOST_OK(u.hostname) && sub.keys?.p256dh && sub.keys?.auth
  } catch {
    return false
  }
}

// Sanfte, generische Texte (kein Bezug auf Persönliches) – rotieren nach Tag.
const REMINDER_LINES = [
  'Ein ruhiger Moment wartet auf dich. ✦',
  'Luna hat einen Gedanken für dich aufgehoben.',
  'Dein Stern für heute ist noch nicht gezogen.',
  'Ein kleiner Impuls, nur für dich – wann du magst.',
  'Zeit für einen Atemzug unterm Sternenhimmel.',
  'Deine heutige Botschaft wartet schon.',
  'Ein Moment nur für dich – Luna lauscht.',
]
const payloadForDay = (dayIdx) => ({
  title: '✦ Sternenluna',
  body: REMINDER_LINES[dayIdx % REMINDER_LINES.length],
  tag: 'sternenluna-erinnerung',
  url: '/',
})

// ---- HTTP-Endpunkte /push/* ----
export async function handlePush(request, env, url, json) {
  if (!env.PUSH || !env.VAPID_PRIVATE_JWK) return json({ error: 'Push nicht konfiguriert.' }, 500)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Ungültiges JSON.' }, 400)
  }

  if (url.pathname === '/push/subscribe') {
    const { sub, time, tzOff } = body || {}
    if (!validSub(sub)) return json({ error: 'Ungültiges Abo.' }, 400)
    if (!/^\d{2}:\d{2}$/.test(time || '')) return json({ error: 'Ungültige Zeit.' }, 400)
    const off = Number(tzOff)
    if (!Number.isFinite(off) || off < -840 || off > 720) return json({ error: 'Ungültige Zeitzone.' }, 400)
    const value = JSON.stringify({
      sub: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } },
      time,
      tzOff: off,
      lastISO: null,
    })
    await env.PUSH.put(await subKey(sub.endpoint), value)
    return json({ ok: true }, 200)
  }

  if (url.pathname === '/push/unsubscribe') {
    const { endpoint } = body || {}
    if (typeof endpoint !== 'string' || !endpoint) return json({ error: 'Endpoint fehlt.' }, 400)
    await env.PUSH.delete(await subKey(endpoint))
    return json({ ok: true }, 200)
  }

  if (url.pathname === '/push/test') {
    // Sofortige Testnachricht an das EIGENE Abo (kommt im Request mit).
    const { sub } = body || {}
    if (!validSub(sub)) return json({ error: 'Ungültiges Abo.' }, 400)
    const status = await sendPush(sub, {
      title: '✦ Sternenluna',
      body: 'Wunderbar – genau so wird Luna dich erinnern.',
      tag: 'sternenluna-test',
      url: '/',
    }, env).catch(() => 0)
    return status >= 200 && status < 300 ? json({ ok: true }, 200) : json({ error: `Push-Dienst antwortete ${status}.` }, 502)
  }

  return json({ error: 'Unbekannter Pfad.' }, 404)
}

// ---- Cron: alle 15 Minuten – wer gerade seine Wunschzeit erreicht, bekommt Push ----
export async function pushScheduled(env) {
  if (!env.PUSH || !env.VAPID_PRIVATE_JWK) return
  const now = Date.now()
  let seen = 0
  let sent = 0
  let cursor
  do {
    const page = await env.PUSH.list({ prefix: 'sub:', cursor })
    cursor = page.list_complete ? undefined : page.cursor
    for (const { name } of page.keys) {
      seen++
      try {
        const raw = await env.PUSH.get(name)
        if (!raw) continue
        const rec = JSON.parse(raw)
        // Lokale Zeit der Nutzerin: UTC minus getTimezoneOffset()-Minuten
        const local = new Date(now - rec.tzOff * 60000)
        const [h, m] = rec.time.split(':').map(Number)
        const localMin = local.getUTCHours() * 60 + local.getUTCMinutes()
        const target = h * 60 + m
        const localISO = local.toISOString().slice(0, 10)
        const due = localMin >= target && localMin < target + 15 && rec.lastISO !== localISO
        if (!due) continue
        const dayIdx = Math.floor(now / 86400000)
        const status = await sendPush(rec.sub, payloadForDay(dayIdx), env).catch(() => 0)
        sent++
        if (status === 404 || status === 410) {
          await env.PUSH.delete(name) // Abo existiert nicht mehr
        } else {
          rec.lastISO = localISO // auch bei Fehlversuch: kein Spam am selben Tag
          await env.PUSH.put(name, JSON.stringify(rec))
        }
      } catch {
        /* einzelnes kaputtes Abo darf den Lauf nicht stoppen */
      }
    }
  } while (cursor)
  // Betriebssignal ohne Personenbezug (sichtbar via `wrangler tail`)
  console.log(`push-cron: ${seen} Abos geprüft, ${sent} gesendet`)
}
