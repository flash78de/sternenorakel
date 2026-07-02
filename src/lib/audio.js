// Verbesserte Browser-Sprachausgabe für Luna.
// Kernprobleme, die hier gelöst werden:
//  1. iOS wählt sonst gern eine grauenhafte Roboterstimme (Eloquence-Familie)
//     oder eine „Compact"-Stimme → wir bewerten alle deutschen Stimmen und
//     nehmen die natürlichste (Premium/Enhanced/Siri > Standard > Compact).
//  2. iOS & Chrome brechen lange Utterances einfach ab → der Text wird in
//     Sätze gestückelt und als Warteschlange gesprochen.
//  3. Stimmen laden asynchron → wir cachen erst nach 'voiceschanged'.

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

// iOS 16+ „Eloquence"-Stimmen und Spaßstimmen: technisch de-DE, klingen aber
// nach 90er-Roboter bzw. Karikatur – niemals für Luna verwenden.
const BLOCKED = [
  'eloquence', 'eddy', 'flo', 'grand', 'reed', 'rocko', 'sandy', 'shelley',
  'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'jester', 'organ', 'superstar',
  'trinoids', 'whisper', 'wobble', 'zarvox', 'albert', 'bad news', 'good news', 'fred', 'junior', 'kathy', 'ralph',
]

// Warm klingende deutsche Stimmen, nach Erfahrung sortiert.
const PREFERRED_NAMES = ['anna', 'helena', 'petra', 'katja', 'google deutsch', 'hedda', 'vicki', 'amala']

function scoreVoice(v) {
  const name = (v.name || '').toLowerCase()
  const uri = (v.voiceURI || '').toLowerCase()
  if (BLOCKED.some((b) => name.includes(b) || uri.includes(b))) return -1

  let s = 0
  // Qualitätsstufen (iOS/macOS kodieren sie in Name oder voiceURI)
  if (uri.includes('premium') || name.includes('premium')) s += 50
  if (uri.includes('enhanced') || name.includes('enhanced') || name.includes('erweitert')) s += 40
  if (uri.includes('siri') || name.includes('siri')) s += 45
  if (uri.includes('compact')) s -= 15
  // Bekannte gute Stimmen bevorzugen (früher in der Liste = besser)
  const idx = PREFERRED_NAMES.findIndex((p) => name.includes(p))
  if (idx >= 0) s += 30 - idx * 2
  // Natürlichere Cloud-Stimmen (Chrome „Google Deutsch") sind ok,
  // lokale Stimmen starten dafür sofort.
  if (v.localService) s += 5
  if ((v.lang || '').toLowerCase() === 'de-de') s += 4
  return s
}

let cachedVoice = null
let cachedCount = 0

function pickVoice() {
  const voices = window.speechSynthesis.getVoices() || []
  if (cachedVoice && voices.length === cachedCount) return cachedVoice
  const de = voices.filter((v) => (v.lang || '').toLowerCase().startsWith('de'))
  if (!de.length) return null
  const best = de
    .map((v) => ({ v, s: scoreVoice(v) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s)[0]
  cachedVoice = best ? best.v : null
  cachedCount = voices.length
  return cachedVoice
}

const RATE = { Sanft: 0.92, Poetisch: 0.87, 'Kurz & klar': 1.0 }
const PITCH = { Sanft: 1.02, Poetisch: 1.05, 'Kurz & klar': 1.0 }

// Deko-Zeichen entfernen, damit sie nicht vorgelesen werden („Stern, Stern …").
function cleanText(text) {
  return String(text)
    .replace(/[✦✧★☾☀♥⬡ᚱ„“”«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// In sprechbare Stücke teilen: Satzweise, max. ~200 Zeichen pro Utterance.
// iOS bricht lange Utterances ab; viele kurze laufen zuverlässig als Queue.
function chunkText(text) {
  const sentences = cleanText(text).split(/(?<=[.!?…:])\s+/)
  const chunks = []
  let cur = ''
  for (const s of sentences) {
    if ((cur + ' ' + s).trim().length > 200 && cur) {
      chunks.push(cur.trim())
      cur = s
    } else {
      cur = (cur + ' ' + s).trim()
    }
  }
  if (cur) chunks.push(cur)
  return chunks
}

// Spricht den Text warm und ruhig; tone steuert Tempo/Tonhöhe.
export function speak(text, tone = 'Sanft') {
  if (!speechSupported || !text) return
  const synth = window.speechSynthesis
  synth.cancel()
  const voice = pickVoice()
  const rate = RATE[tone] ?? 0.92
  const pitch = PITCH[tone] ?? 1.02
  for (const chunk of chunkText(text)) {
    const u = new SpeechSynthesisUtterance(chunk)
    u.lang = voice?.lang || 'de-DE'
    u.rate = rate
    u.pitch = pitch
    if (voice) u.voice = voice
    synth.speak(u)
  }
}

export function stopSpeaking() {
  if (speechSupported) window.speechSynthesis.cancel()
}

// Stimmen laden asynchron – bei Änderung den Cache verwerfen und neu wählen.
if (speechSupported) {
  try {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = null
      pickVoice()
    }
    window.speechSynthesis.getVoices()
  } catch {
    /* ignore */
  }
}
