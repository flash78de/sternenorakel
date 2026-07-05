// ============================================================
// Echte Push-Erinnerungen (Web Push, RFC 8030).
// Abo läuft über den eigenen Cloudflare Worker (server/push.js):
// gespeichert werden dort nur Push-Adresse, Wunschzeit und Zeitzone –
// kein Name, nichts aus dem Tagebuch.
// iPhone: funktioniert ab iOS 16.4, aber NUR wenn die App auf dem
// Home-Bildschirm installiert ist (Apple-Vorgabe).
// ============================================================
import { AI_ENDPOINT } from './ai.js'

// Öffentlicher VAPID-Schlüssel (Gegenstück liegt als Secret im Worker)
export const VAPID_PUBLIC = 'BHkBrf0O-w77EpXz_5NxHXL5EdtNOz8X6V8xF1UpscXY1yaTa5_8t0SojqvZd46dtSZ-OOBXDv53eCBjeNisat4'

export const pushSupported = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window

const b64uToUint8 = (s) => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4))
  return Uint8Array.from(b, (c) => c.charCodeAt(0))
}

const api = (path, body) =>
  fetch(AI_ENDPOINT + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

async function currentSubscription() {
  const reg = await navigator.serviceWorker.ready
  return reg.pushManager.getSubscription()
}

// Gibt es ein aktives Push-Abo auf diesem Gerät?
export async function pushActive() {
  if (!pushSupported()) return false
  try {
    return Boolean(await currentSubscription())
  } catch {
    return false
  }
}

// Erinnerung aktivieren bzw. Wunschzeit aktualisieren.
// Wirft Error mit .code: 'denied' | 'server' | 'unsupported'
export async function enablePush(timeHHMM) {
  if (!pushSupported()) throw Object.assign(new Error('unsupported'), { code: 'unsupported' })
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') throw Object.assign(new Error('denied'), { code: 'denied' })
  const reg = await navigator.serviceWorker.ready
  const sub =
    (await reg.pushManager.getSubscription()) ||
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToUint8(VAPID_PUBLIC) }))
  const res = await api('/push/subscribe', {
    sub: sub.toJSON(),
    time: timeHHMM,
    tzOff: new Date().getTimezoneOffset(),
  })
  if (!res.ok) throw Object.assign(new Error('server'), { code: 'server' })
  return true
}

// Erinnerung beenden: Abo im Browser UND auf dem Server lösen.
export async function disablePush() {
  if (!pushSupported()) return
  try {
    const sub = await currentSubscription()
    if (!sub) return
    await api('/push/unsubscribe', { endpoint: sub.endpoint }).catch(() => {})
    await sub.unsubscribe()
  } catch {
    /* Abo war schon weg */
  }
}

// Sofortige Testnachricht an dieses Gerät (nur bei aktivem Abo).
export async function sendTestPush() {
  const sub = await currentSubscription()
  if (!sub) throw Object.assign(new Error('nosub'), { code: 'nosub' })
  const res = await api('/push/test', { sub: sub.toJSON() })
  if (!res.ok) throw Object.assign(new Error('server'), { code: 'server' })
  return true
}
