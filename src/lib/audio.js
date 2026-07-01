// Verbesserte Browser-Sprachausgabe für Luna.
// Wählt möglichst eine natürliche deutsche Stimme und einen warmen, ruhigen Ton.

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

// Bevorzugte, wärmer klingende deutsche Stimmen (je nach Gerät verfügbar)
const PREFERRED = [
  'Google Deutsch',
  'Anna', // macOS/iOS
  'Petra',
  'Katja',
  'Microsoft Katja',
  'Microsoft Hedda',
]

function pickVoice() {
  const voices = window.speechSynthesis.getVoices() || []
  const de = voices.filter((v) => (v.lang || '').toLowerCase().startsWith('de'))
  if (!de.length) return null
  for (const name of PREFERRED) {
    const hit = de.find((v) => v.name && v.name.includes(name))
    if (hit) return hit
  }
  // sonst: bevorzugt eine „lokale" (natürlichere) Stimme
  return de.find((v) => v.localService) || de[0]
}

const RATE = { Sanft: 0.88, Poetisch: 0.82, 'Kurz & klar': 1.0 }
const PITCH = { Sanft: 1.02, Poetisch: 1.06, 'Kurz & klar': 1.0 }

// Spricht den Text warm und ruhig; tone steuert Tempo/Tonhöhe.
export function speak(text, tone = 'Sanft') {
  if (!speechSupported || !text) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'de-DE'
  u.rate = RATE[tone] ?? 0.88
  u.pitch = PITCH[tone] ?? 1.02
  const v = pickVoice()
  if (v) u.voice = v
  synth.speak(u)
}

export function stopSpeaking() {
  if (speechSupported) window.speechSynthesis.cancel()
}

// Manche Browser laden Stimmen asynchron – einmal anstoßen.
if (speechSupported) {
  try {
    window.speechSynthesis.onvoiceschanged = () => {}
    window.speechSynthesis.getVoices()
  } catch {
    /* ignore */
  }
}
