import { AI_ENDPOINT } from './ai.js'

// Sternenzähler: höchstens EIN anonymes „+1“ pro Gerät und Tag.
// Kein Cookie, keine Kennung – nur {neu: true|false} für die
// Unterscheidung Erststart/Wiederkehr. Schlägt der Versand fehl
// (offline), wird er beim nächsten Start mit Netz nachgeholt.
// localhost zählt nie mit (Entwicklung & Tests).

const KEY_TAG = 'sternenluna.ping' // letzter erfolgreich gezählter Tag
const KEY_EVER = 'sternenluna.ping-ever' // Gerät wurde schon einmal gezählt

export function tagesPing() {
  try {
    if (['localhost', '127.0.0.1'].includes(location.hostname)) return
    const heute = new Date().toLocaleDateString('sv-SE')
    if (localStorage.getItem(KEY_TAG) === heute) return
    const neu = !localStorage.getItem(KEY_EVER)
    fetch(`${AI_ENDPOINT}/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ neu }),
    })
      .then((r) => {
        if (r.ok) {
          localStorage.setItem(KEY_TAG, heute)
          localStorage.setItem(KEY_EVER, '1')
        }
      })
      .catch(() => {
        /* offline – nächster Start holt es nach */
      })
  } catch {
    /* Zählen darf die App nie stören */
  }
}
