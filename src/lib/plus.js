// ============================================================
// Plus-Freischaltung: Gutscheine & PayPal (Gegenstück: server/plus.js).
// Preise/Laufzeiten entscheidet IMMER der Server – die App zeigt nur an.
// ============================================================
import { AI_ENDPOINT } from './ai.js'

const api = (path, body) =>
  fetch(AI_ENDPOINT + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })

// Anonyme Gerätekennung (eigener Speicher-Schlüssel, übersteht „Alles löschen"
// bewusst – sonst ließe sich der Gratis-Test durch Zurücksetzen wiederholen).
export function deviceId() {
  const KEY = 'sternenluna.device'
  try {
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    return 'ohne-speicher'
  }
}

// Gutschein einlösen → {ok, days, note} oder Error mit verständlicher Meldung
export async function redeemCoupon(code) {
  let res
  try {
    res = await api('/coupon/redeem', { code, device: deviceId() })
  } catch {
    throw new Error('Keine Verbindung – bitte später erneut versuchen.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) throw new Error(data.error || 'Das hat nicht geklappt.')
  return data
}

// 7-Tage-Gratis-Test starten (serverseitig: nur einmal pro Gerät)
export async function redeemTrial() {
  let res
  try {
    res = await api('/coupon/trial', { device: deviceId() })
  } catch {
    throw new Error('Keine Verbindung – der Gratis-Test braucht einmal kurz Internet.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) {
    const err = new Error(data.error || 'Das hat nicht geklappt.')
    err.used = res.status === 409
    throw err
  }
  return data // {days: 7}
}

// Ist die PayPal-Zahlung serverseitig eingerichtet?
export async function payConfig() {
  try {
    const res = await api('/pay/config')
    return await res.json()
  } catch {
    return { configured: false }
  }
}

export async function createPayOrder(plan) {
  const res = await api('/pay/order', { plan })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) throw new Error(data.error || 'Bestellung fehlgeschlagen.')
  return data.orderId
}

export async function capturePayOrder(orderId) {
  const res = await api('/pay/capture', { orderId })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) throw new Error(data.error || 'Zahlung nicht bestätigt.')
  return data // {days, plan, captureId}
}

// PayPal-JS-SDK einmalig nachladen (nur wenn Zahlung konfiguriert ist)
let sdkPromise = null
export function loadPayPalSdk(clientId) {
  if (window.paypal) return Promise.resolve(window.paypal)
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&disable-funding=credit,card`
      s.onload = () => resolve(window.paypal)
      s.onerror = reject
      document.head.appendChild(s)
    })
  }
  return sdkPromise
}

// Deutsche Anzeige eines ISO-Datums (2026-08-01 → 01.08.2026)
export const bisDatum = (iso) => (iso ? iso.split('-').reverse().join('.') : null)
