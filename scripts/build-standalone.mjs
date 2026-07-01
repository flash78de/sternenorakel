// ============================================================
// Sternenorakel — standalone.html Generator
// Nimmt den Single-File-Build (standalone-dist/index.html) und ersetzt alle
// /uploads-Bildverweise durch eingebettete Base64-Data-URIs. Ergebnis: EINE
// Datei, die ohne Server per Doppelklick (file://) läuft.
// ============================================================
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const IN_HTML = join(root, 'standalone-dist', 'index.html')
const UPLOADS = join(root, 'public', 'uploads')
const OUT_HTML = join(root, 'standalone.html')

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let html = readFileSync(IN_HTML, 'utf8')

// Dateien nach Namenslänge absteigend sortieren (verhindert Teil-Treffer)
const files = readdirSync(UPLOADS)
  .filter((f) => MIME[extname(f).toLowerCase()])
  .sort((a, b) => b.length - a.length)

let embedded = 0
for (const file of files) {
  const mime = MIME[extname(file).toLowerCase()]
  const b64 = readFileSync(join(UPLOADS, file)).toString('base64')
  const dataUri = `data:${mime};base64,${b64}`
  // Ersetzt "/uploads/x", "./uploads/x" und "uploads/x"
  const re = new RegExp('(?:\\.?/)?uploads/' + escapeRe(file), 'g')
  const before = html.length
  html = html.replace(re, dataUri)
  if (html.length !== before) embedded++
}

writeFileSync(OUT_HTML, html, 'utf8')

const mb = (Buffer.byteLength(html, 'utf8') / 1048576).toFixed(1)
console.log(`✓ standalone.html erstellt — ${embedded} Bilder eingebettet, ${mb} MB`)

// Warnen, falls noch unaufgelöste /uploads-Referenzen übrig sind
const leftover = html.match(/["'(](?:\.?\/)?uploads\/[^"')]+/g)
if (leftover) console.warn('⚠ Nicht eingebettete Verweise:', [...new Set(leftover)].slice(0, 10))
