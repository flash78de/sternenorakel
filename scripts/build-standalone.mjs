// ============================================================
// Sternenorakel — standalone.html Generator
// Nimmt den Single-File-Build (standalone-dist/index.html) und ersetzt alle
// /uploads-Bildverweise durch eingebettete Data-URIs. Bilder werden dabei
// herunterskaliert und als WebP komprimiert (via sharp), damit die fertige
// Datei klein & robust ist und ohne Server per Doppelklick (file://) läuft.
// Ohne sharp: Fallback auf die Original-PNGs als Base64.
// ============================================================
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const IN_HTML = join(root, 'standalone-dist', 'index.html')
const UPLOADS = join(root, 'public', 'uploads')
const OUT_HTML = join(root, 'standalone.html')

// Längste Kante, auf die Bilder für die Standalone-Vorschau begrenzt werden.
// Deckt Retina bequem ab (größte Anzeige: Lade-Screen ~420×724 CSS-px).
const MAX_EDGE = 1000
const WEBP_QUALITY = 80

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' }
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// sharp optional laden
let sharp = null
try { sharp = (await import('sharp')).default } catch { /* Fallback unten */ }

async function toDataUri(file) {
  const abs = join(UPLOADS, file)
  const raw = readFileSync(abs)
  // Bereits optimierte WebP (uploads/opt/*) roh einbetten – nicht doppelt komprimieren
  if (extname(file).toLowerCase() === '.webp') {
    return `data:image/webp;base64,${raw.toString('base64')}`
  }
  if (sharp) {
    try {
      const out = await sharp(raw)
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()
      return `data:image/webp;base64,${out.toString('base64')}`
    } catch {
      /* auf Original zurückfallen */
    }
  }
  const mime = MIME[extname(file).toLowerCase()] || 'application/octet-stream'
  return `data:${mime};base64,${raw.toString('base64')}`
}

let html = readFileSync(IN_HTML, 'utf8')

// Uploads inkl. opt/-Unterordner (relative Pfade), nach Länge absteigend
// (verhindert Teil-Treffer wie luna-icon vs luna-icon-transparent)
const collect = (dir, prefix = '') =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory()
      ? collect(join(dir, d.name), prefix + d.name + '/')
      : MIME[extname(d.name).toLowerCase()] ? [prefix + d.name] : []
  )
const files = collect(UPLOADS).sort((a, b) => b.length - a.length)

// Manifest-Daten vorbereiten (alle optimierten Varianten uploads/opt/*)
const manifest = {}
for (const file of files.filter((f) => f.startsWith('opt/'))) {
  manifest['uploads/' + file] = await toDataUri(file)
}

// 1) ZUERST wörtliche uploads/-Referenzen im Bundle ersetzen (Alt-/Sonderfälle) —
//    muss vor der Manifest-Injektion passieren, sonst würden die Manifest-Keys
//    selbst mit ersetzt und zerstört.
let replaced = 0
for (const file of files) {
  const dataUri = manifest['uploads/' + file] || (await toDataUri(file))
  const re = new RegExp('(?:\\.?/)?uploads/' + escapeRe(file), 'g')
  const before = html.length
  html = html.replace(re, dataUri)
  if (html.length !== before) replaced++
}

// 2) DANACH Asset-Manifest injizieren: deckt dynamisch gebaute Pfade ab
//    (z. B. `uploads/opt/luna-${state}-sm.webp` in der Luna-Komponente).
const manifestTag = `<script>window.__ASSETS__=${JSON.stringify(manifest)}</script>`
html = html.replace('<head>', '<head>' + manifestTag)

writeFileSync(OUT_HTML, html, 'utf8')

const mb = (Buffer.byteLength(html, 'utf8') / 1048576).toFixed(1)
console.log(`✓ standalone.html erstellt — Manifest: ${Object.keys(manifest).length} Assets, ${replaced} direkte Ersetzungen, ${mb} MB`)
