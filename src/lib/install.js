// PWA-Installation: Als installierte App ist der lokale Speicher (das
// Tagebuch!) deutlich besser vor Browser-Aufräumaktionen geschützt –
// iOS-Safari löscht Website-Daten von NICHT installierten Seiten nach
// ~7 Tagen Inaktivität. Deshalb werben wir aktiv für die Installation.

let deferredPrompt = null
const listeners = new Set()

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // Chrome/Android: eigenen Button anbieten statt Mini-Banner
    deferredPrompt = e
    listeners.forEach((fn) => fn())
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    listeners.forEach((fn) => fn())
  })
}

// Läuft die App bereits als installierte PWA (Homescreen)?
export const isInstalled = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)

export const isIOS = () =>
  typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

// Android/Chrome: direkte Installation möglich?
export const canPromptInstall = () => Boolean(deferredPrompt)

export async function promptInstall() {
  if (!deferredPrompt) return false
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') deferredPrompt = null
  return outcome === 'accepted'
}

export function onInstallChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
