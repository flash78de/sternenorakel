// ============================================================
// Zerlegt das Nachschub-Blatt (docs/set-nachschub.png):
//   2 Runensteine (Wunjo, Ansuz) + 1 Karte hochkant („Der verborgene Weg").
// Der Kartentitel ist auf diesem Blatt bereits korrekt → kein Plaketten-Fix.
// Aufruf:  node scripts/slice-nachschub.mjs [pfad.png]
// ============================================================
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const INPUT = process.argv[2] || 'docs/set-nachschub.png'
const OUT = 'public/uploads/opt'
const PREVIEW = 'scripts/.slice-preview'

const meta = await sharp(INPUT).metadata()
const W = meta.width, H = meta.height
const SCALE = 3
const w = Math.floor(W / SCALE), h = Math.floor(H / SCALE)
const raw = await sharp(INPUT).ensureAlpha().resize(w, h, { fit: 'fill' }).raw().toBuffer()

const fg = new Uint8Array(w * h)
for (let i = 0; i < w * h; i++) {
  const r = raw[i * 4], g = raw[i * 4 + 1], b = raw[i * 4 + 2], a = raw[i * 4 + 3]
  fg[i] = a > 16 && !(r > 243 && g > 243 && b > 243) ? 1 : 0
}

const label = new Int32Array(w * h).fill(-1)
const boxes = []
const qx = new Int32Array(w * h), qy = new Int32Array(w * h)
for (let sy = 0; sy < h; sy++) for (let sx = 0; sx < w; sx++) {
  const si = sy * w + sx
  if (!fg[si] || label[si] >= 0) continue
  const id = boxes.length
  let head = 0, tail = 0
  qx[tail] = sx; qy[tail] = sy; tail++
  label[si] = id
  let minx = sx, maxx = sx, miny = sy, maxy = sy, area = 0
  while (head < tail) {
    const cx = qx[head], cy = qy[head]; head++
    area++
    if (cx < minx) minx = cx; if (cx > maxx) maxx = cx
    if (cy < miny) miny = cy; if (cy > maxy) maxy = cy
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = cx + dx, ny = cy + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      const ni = ny * w + nx
      if (fg[ni] && label[ni] < 0) { label[ni] = id; qx[tail] = nx; qy[tail] = ny; tail++ }
    }
  }
  boxes.push({ minx, maxx, miny, maxy, area })
}

const items = boxes
  .filter((b) => b.area > 400)
  .map((b) => ({
    x: Math.max(0, b.minx * SCALE - 2),
    y: Math.max(0, b.miny * SCALE - 2),
    w: Math.min(W, (b.maxx + 1) * SCALE + 2) - Math.max(0, b.minx * SCALE - 2),
    h: Math.min(H, (b.maxy + 1) * SCALE + 2) - Math.max(0, b.miny * SCALE - 2),
  }))
  .sort((a, b) => a.x - b.x)

console.log(`Gefunden: ${items.length} Motive (erwartet: 3)`)
if (items.length !== 3) console.warn('⚠ Bitte Vorschau prüfen!')

await mkdir(OUT, { recursive: true })
await mkdir(PREVIEW, { recursive: true })
const crop = (b) => sharp(INPUT).extract({ left: b.x, top: b.y, width: b.w, height: b.h }).png().toBuffer()
const outWebp = (buf, name, width) =>
  sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, name))

// Steine = die schmaleren Motive, Karte = das mit Karten-Seitenverhältnis
const stones = items.filter((b) => b.w / b.h > 0.72)
const cards = items.filter((b) => b.w / b.h <= 0.72)
const stoneNames = ['wunjo', 'ansuz']

for (let i = 0; i < stones.length; i++) {
  const name = stoneNames[i] || `stein-${i}`
  const buf = await crop(stones[i])
  await outWebp(buf, `rune-${name}-md.webp`, 320)
  await outWebp(buf, `rune-${name}-sm.webp`, 96)
  await writeFile(path.join(PREVIEW, `rune-${name}.png`), buf)
}
for (const b of cards) {
  const buf = await crop(b)
  await outWebp(buf, 'karte-weg-md.webp', 460)
  await outWebp(buf, 'karte-weg-sm.webp', 150)
  await writeFile(path.join(PREVIEW, 'karte-weg.png'), buf)
}
console.log(`✓ fertig — WebP in ${OUT}, Vorschau in ${PREVIEW}`)
