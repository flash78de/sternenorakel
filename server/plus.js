// ============================================================
// Sternenluna · Plus-Freischaltung (Cloudflare Worker Modul)
// ------------------------------------------------------------
//  - POST /coupon/redeem {code}    → Gutschein prüfen & einlösen
//  - POST /pay/config              → ist PayPal eingerichtet? (Client-ID)
//  - POST /pay/order {plan}        → PayPal-Bestellung anlegen
//  - POST /pay/capture {orderId}   → Zahlung einziehen & bestätigen
//
// Gutscheine liegen im selben KV wie die Push-Abos, Schlüssel:
//   coupon:<CODE IN GROSSBUCHSTABEN>
//   Wert: {"days":31,"maxUsers":20,"oncePerDevice":true,"devices":[],
//          "used":0,"validUntilISO":"2026-08-31","note":"Beta-Runde Juli"}
//   maxUsers   = wie viele VERSCHIEDENE Geräte einlösen dürfen
//   oncePerDevice = true → jedes Gerät nur einmal; false → Gerät darf
//                   mehrfach einlösen (verlängern), zählt aber nur 1 Nutzer
// Marcel kann Codes jederzeit im Cloudflare-Dashboard anlegen/löschen:
//   Compute (Workers) → KV → Namespace „PUSH" → Eintrag hinzufügen/entfernen.
// Der 7-Tage-Gratis-Test läuft über dieselbe Schiene (/coupon/trial):
//   einmal pro Gerät, serverseitig gemerkt unter trial:<geräte-hash>.
//
// PayPal: Einmalzahlungen (KEIN Abo, endet automatisch) über die
// offiziellen Orders-API-Endpunkte. Benötigt Secrets PAYPAL_CLIENT_ID
// und PAYPAL_SECRET eines PayPal-Business-Kontos. Solange sie fehlen,
// meldet /pay/config {configured:false} und die App zeigt den
// Gutschein-Weg als einzige Option.
// ============================================================

import { sendPush } from './push.js'

const PAYPAL_API = 'https://api-m.paypal.com'

// ---- Admin-Info: Push an Marcels Gerät(e) bei Gutschein-Einlösung ----
// KV-Schlüssel admin:push = Array von Push-Abos ({endpoint, keys:{p256dh,auth}}).
// Nur Betriebszähler, keine Personendaten. Fehler hier dürfen die
// Einlösung der Nutzerin niemals stören.
export async function adminNotify(env, title, text) {
  try {
    if (!env.PUSH || !env.VAPID_PRIVATE_JWK) return
    const raw = await env.PUSH.get('admin:push')
    if (!raw) return
    const subs = JSON.parse(raw)
    for (const sub of Array.isArray(subs) ? subs : [subs]) {
      await sendPush(sub, { title, body: text }, env).catch(() => 0)
    }
  } catch {
    /* still – Admin-Info ist nie kritisch */
  }
}

// Feste Pläne – Preise NIE vom Client übernehmen.
// days: 0 = dauerhafter Einmalkauf (z. B. Chakren-Reise), sonst Laufzeit.
const PLANS = {
  monat: { amount: '4.99', days: 31, label: 'Sternenluna Plus · 1 Monat' },
  jahr: { amount: '39.99', days: 366, label: 'Sternenluna Plus · 1 Jahr' },
  chakren: { amount: '9.99', days: 0, label: 'Die Chakren-Reise · Einmalkauf' },
}

// ---- Gerätekennung: nur als Hash gespeichert (keine Rückverfolgung) ----
async function deviceHash(device) {
  const d = String(device || '').trim()
  if (d.length < 8 || d.length > 80) return null
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(d))
  return btoa(String.fromCharCode(...new Uint8Array(h).slice(0, 15)))
    .replace(/\+/g, '-').replace(/\//g, '_')
}

// ---- Gutscheine ----
async function redeemCoupon(env, code, device) {
  const norm = String(code || '').trim().toUpperCase()
  if (!/^[A-Z0-9ÄÖÜ_-]{4,40}$/.test(norm)) return { status: 400, body: { error: 'Bitte gib einen gültigen Code ein.' } }
  const dev = await deviceHash(device)
  if (!dev) return { status: 400, body: { error: 'Bitte aktualisiere die App und versuche es erneut.' } }
  const key = 'coupon:' + norm
  const raw = await env.PUSH.get(key)
  if (!raw) return { status: 404, body: { error: 'Diesen Code kennt Luna nicht (mehr).' } }
  let c
  try {
    c = JSON.parse(raw)
  } catch {
    return { status: 500, body: { error: 'Code fehlerhaft hinterlegt.' } }
  }
  const today = new Date().toISOString().slice(0, 10)
  if (c.validUntilISO && c.validUntilISO < today) return { status: 410, body: { error: 'Dieser Code ist abgelaufen.' } }
  const days = Number(c.days)
  if (!Number.isFinite(days) || days < 1 || days > 3700) return { status: 500, body: { error: 'Code fehlerhaft hinterlegt.' } }

  const devices = Array.isArray(c.devices) ? c.devices : []
  const known = devices.includes(dev)
  if (known && c.oncePerDevice) return { status: 409, body: { error: 'Dieser Code wurde auf diesem Gerät schon eingelöst.' } }
  if (!known) {
    const maxUsers = Number(c.maxUsers || c.maxUses || 0)
    if (maxUsers && devices.length >= maxUsers) return { status: 410, body: { error: 'Dieser Code wurde schon zu oft eingelöst.' } }
    devices.push(dev)
  }
  c.devices = devices
  c.used = (c.used || 0) + 1
  await env.PUSH.put(key, JSON.stringify(c))
  // Admin-Meldung (geht NICHT an die Nutzerin – nur ins body-lose Feld)
  const max = Number(c.maxUsers || c.maxUses || 0)
  const voll = max && devices.length >= max
  const adminMsg =
    `${norm}: ${devices.length}${max ? ` von ${max}` : ''} Plätzen vergeben` +
    (c.oncePerDevice ? '' : ` · ${c.used}. Einlösung`) +
    (voll ? ' – der Code ist damit voll! ✦' : '.')
  return { status: 200, body: { ok: true, days, note: c.note || null }, adminMsg }
}

// ---- 7-Tage-Gratis-Test: gleiche Systematik, fest ein Mal pro Gerät ----
async function redeemTrial(env, device) {
  const dev = await deviceHash(device)
  if (!dev) return { status: 400, body: { error: 'Bitte aktualisiere die App und versuche es erneut.' } }
  const key = 'trial:' + dev
  if (await env.PUSH.get(key)) return { status: 409, body: { error: 'Der Gratis-Test wurde auf diesem Gerät schon genutzt.' } }
  await env.PUSH.put(key, JSON.stringify({ iso: new Date().toISOString().slice(0, 10) }))
  return { status: 200, body: { ok: true, days: 7 } }
}

// ---- PayPal (Orders API v2, Einmalzahlung) ----
// PAY_ACTIVE="false" hält die Zahlung ausgeblendet, bis PayPal das
// Geschäftskonto freigegeben hat (PAYEE_ACCOUNT_RESTRICTED bei neuen Konten).
const payConfigured = (env) => Boolean(env.PAYPAL_CLIENT_ID && env.PAYPAL_SECRET && env.PAY_ACTIVE !== 'false')

async function paypalToken(env) {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error('paypal auth')
  return (await res.json()).access_token
}

async function createOrder(env, planKey) {
  const plan = PLANS[planKey]
  if (!plan) return { status: 400, body: { error: 'Unbekannter Plan.' } }
  const token = await paypalToken(env)
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: plan.label,
          custom_id: planKey,
          amount: { currency_code: 'EUR', value: plan.amount },
        },
      ],
      application_context: { brand_name: 'Sternenluna', shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' },
    }),
  })
  if (!res.ok) return { status: 502, body: { error: 'PayPal derzeit nicht erreichbar.' } }
  const order = await res.json()
  return { status: 200, body: { ok: true, orderId: order.id } }
}

async function captureOrder(env, orderId) {
  if (!/^[A-Z0-9]{5,30}$/i.test(String(orderId || ''))) return { status: 400, body: { error: 'Ungültige Bestellung.' } }
  const token = await paypalToken(env)
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) return { status: 502, body: { error: 'Zahlung konnte nicht bestätigt werden.' } }
  const data = await res.json()
  // Serverseitig verifizieren: abgeschlossen + korrekter Betrag → erst dann freischalten
  const unit = data.purchase_units?.[0]
  const cap = unit?.payments?.captures?.[0]
  const planKey = unit?.custom_id || cap?.custom_id
  const plan = PLANS[planKey]
  const paid = cap?.amount
  const complete = data.status === 'COMPLETED' && cap?.status === 'COMPLETED'
  const amountOk = plan && paid && paid.currency_code === 'EUR' && paid.value === plan.amount
  if (!complete || !amountOk) return { status: 402, body: { error: 'Zahlung nicht abgeschlossen.' } }
  return { status: 200, body: { ok: true, days: plan.days, plan: planKey, captureId: cap.id } }
}

// ---- Kündigung (§ 312k BGB): Eingang speichern + Bestätigung zurückgeben ----
// Marcel sieht Eingänge im Cloudflare-Dashboard (KV, Präfix kuendigung:)
// und bestätigt die Vertragsbeendigung dann per E-Mail an die Nutzerin.
async function kuendigungEinreichen(env, body) {
  const name = String(body.name || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().slice(0, 160)
  if (!name || !/.+@.+\..+/.test(email)) return { status: 400, body: { error: 'Name oder E-Mail fehlt.' } }
  const rec = {
    name,
    email,
    vertrag: body.vertrag === 'plus-jahr' ? 'plus-jahr' : 'plus-monat',
    art: body.art === 'ausserordentlich' ? 'ausserordentlich' : 'ordentlich',
    grund: String(body.grund || '').slice(0, 1000),
    zeitpunkt: body.zeitpunkt === 'datum' && body.datum ? String(body.datum).slice(0, 10) : 'naechstmoeglich',
    eingangISO: new Date().toISOString(),
  }
  const nummer = 'K-' + rec.eingangISO.slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
  await env.PUSH.put('kuendigung:' + nummer, JSON.stringify(rec))
  return { status: 200, body: { ok: true, nummer, ts: rec.eingangISO } }
}

// ---- HTTP-Routing (json(body, status) kommt vom Haupt-Worker) ----
export async function handlePlus(request, env, url, json, ctx) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Ungültiges JSON.' }, 400)
  }

  try {
    if (url.pathname === '/coupon/redeem') {
      if (!env.PUSH) return json({ error: 'Gutscheine nicht konfiguriert.' }, 500)
      const r = await redeemCoupon(env, body.code, body.device)
      if (r.status === 200 && r.adminMsg) {
        const p = adminNotify(env, '✦ Gutschein eingelöst', r.adminMsg)
        ctx?.waitUntil ? ctx.waitUntil(p) : await p
      }
      return json(r.body, r.status)
    }
    if (url.pathname === '/kuendigen') {
      if (!env.PUSH) return json({ error: 'Derzeit nicht erreichbar – bitte per E-Mail an ml@mittel-bar.com kündigen.' }, 500)
      const r = await kuendigungEinreichen(env, body)
      return json(r.body, r.status)
    }
    if (url.pathname === '/coupon/trial') {
      if (!env.PUSH) return json({ error: 'Gutscheine nicht konfiguriert.' }, 500)
      const r = await redeemTrial(env, body.device)
      return json(r.body, r.status)
    }
    if (url.pathname === '/pay/config') {
      return json({ configured: payConfigured(env), clientId: payConfigured(env) ? env.PAYPAL_CLIENT_ID : null }, 200)
    }
    if (url.pathname === '/pay/order') {
      if (!payConfigured(env)) return json({ error: 'Zahlung noch nicht eingerichtet.' }, 503)
      const r = await createOrder(env, body.plan)
      return json(r.body, r.status)
    }
    if (url.pathname === '/pay/capture') {
      if (!payConfigured(env)) return json({ error: 'Zahlung noch nicht eingerichtet.' }, 503)
      const r = await captureOrder(env, body.orderId)
      return json(r.body, r.status)
    }
  } catch {
    return json({ error: 'Interner Fehler.' }, 500)
  }
  return json({ error: 'Unbekannter Pfad.' }, 404)
}
