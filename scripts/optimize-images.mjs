// ============================================================
// Erzeugt verkleinerte WebP-Varianten der Uploads (einmalig ausführen,
// Ergebnis wird committet): public/uploads/opt/<name>-md.webp / -sm.webp
//   md ≈ große Darstellung (Hero/Splash), sm ≈ Avatare/Icons/Thumbs.
// Die App lädt damit ~50–200 KB statt 1–2 MB pro Bild.
// ============================================================
import { readdirSync, readFileSync, mkdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname, basename } from 'node:path'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const UPLOADS = join(__dirname, '..', 'public', 'uploads')
const OUT = join(UPLOADS, 'opt')
mkdirSync(OUT, { recursive: true })

// Splash braucht mehr Auflösung (Vollbild-Hochformat)
const MD_EDGE = { default: 1000, 'luna-erwacht': 1400 }

const files = readdirSync(UPLOADS).filter((f) => extname(f).toLowerCase() === '.png')

for (const file of files) {
  const base = basename(file, '.png')
  const raw = readFileSync(join(UPLOADS, file))
  const mdEdge = MD_EDGE[base] || MD_EDGE.default

  for (const [suffix, edge, q] of [['md', mdEdge, 80], ['sm', 320, 75]]) {
    const out = join(OUT, `${base}-${suffix}.webp`)
    await sharp(raw)
      .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: q })
      .toFile(out)
    const kb = Math.round(statSync(out).size / 1024)
    console.log(`✓ ${base}-${suffix}.webp  ${kb} KB`)
  }
}
console.log('Fertig.')
