// Unit-Test der Web-Push-Kryptografie (server/push.js) ohne Netz:
//  1) RFC-8291-Roundtrip: verschlüsseln wie der Worker, entschlüsseln wie der Browser
//  2) RFC-8292-VAPID-JWT: Signatur mit dem öffentlichen Schlüssel verifizieren
import { encryptPayload, vapidAuth } from '../server/push.js'

const te = new TextEncoder()
const td = new TextDecoder()
const b64u = (buf) => Buffer.from(buf).toString('base64url')

let pass = 0
let fail = 0
const check = (name, ok) => {
  ok ? pass++ : fail++
  console.log((ok ? '✅' : '❌') + ' ' + name)
}

// ---- 1) Verschlüsselungs-Roundtrip ----
// „Browser"-Seite simulieren: ECDH-Schlüsselpaar + Auth-Secret wie PushManager.subscribe
const ua = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
const uaPubRaw = new Uint8Array(await crypto.subtle.exportKey('raw', ua.publicKey))
const authSecret = crypto.getRandomValues(new Uint8Array(16))

const msg = JSON.stringify({ title: '✦ Sternenluna', body: 'Testbotschaft mit Umlauten: äöüß „Zitat"' })
const packet = await encryptPayload(msg, b64u(uaPubRaw), b64u(authSecret))

// Entschlüsseln nach RFC 8188/8291 (die Browser-Seite)
const salt = packet.slice(0, 16)
const idlen = packet[20]
const asPub = packet.slice(21, 21 + idlen)
const ct = packet.slice(21 + idlen)

const asKey = await crypto.subtle.importKey('raw', asPub, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: asKey }, ua.privateKey, 256))
const hkdf = async (s, ikm, info, len) => {
  const k = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits'])
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: s, info }, k, len * 8))
}
const keyInfo = new Uint8Array([...te.encode('WebPush: info\0'), ...uaPubRaw, ...asPub])
const ikm = await hkdf(authSecret, ecdh, keyInfo, 32)
const cek = await hkdf(salt, ikm, te.encode('Content-Encoding: aes128gcm\0'), 16)
const nonce = await hkdf(salt, ikm, te.encode('Content-Encoding: nonce\0'), 12)
const aes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['decrypt'])
const record = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, aes, ct))

check('Header: recordsize = 4096', packet[16] === 0 && packet[17] === 0 && packet[18] === 16 && packet[19] === 0)
check('Record endet mit 0x02 (letzter Record)', record[record.length - 1] === 2)
const decrypted = td.decode(record.slice(0, -1))
check('Roundtrip: Klartext identisch (inkl. Umlaute)', decrypted === msg)

// ---- 2) VAPID-JWT verifizieren ----
const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
const privJwk = await crypto.subtle.exportKey('jwk', kp.privateKey)
const pubRaw = new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey))
const env = { VAPID_PRIVATE_JWK: JSON.stringify(privJwk), VAPID_PUBLIC: b64u(pubRaw) }

const header = await vapidAuth('https://web.push.apple.com/XYZabc123', env)
check('Header-Format: vapid t=…, k=…', /^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=[\w-]+$/.test(header))

const jwt = header.match(/t=([^,]+)/)[1]
const [h, c, s] = jwt.split('.')
const claims = JSON.parse(Buffer.from(c, 'base64url').toString())
check('aud = Origin des Push-Endpoints', claims.aud === 'https://web.push.apple.com')
check('exp in der Zukunft (≤ 24h)', claims.exp > Date.now() / 1000 && claims.exp < Date.now() / 1000 + 86400)
check('sub = mailto-Kontakt', claims.sub === 'mailto:ml@mittel-bar.com')

const valid = await crypto.subtle.verify(
  { name: 'ECDSA', hash: 'SHA-256' },
  kp.publicKey,
  Buffer.from(s, 'base64url'),
  te.encode(`${h}.${c}`)
)
check('ES256-Signatur verifiziert mit öffentlichem Schlüssel', valid)

console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`)
if (fail) process.exit(1)
