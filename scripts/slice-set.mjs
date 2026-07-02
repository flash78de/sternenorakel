// ============================================================
// Zerlegt das Karten-&-Runen-Set (ein großes PNG) in Einzelbilder:
//   Reihe 1: Runensteine (oval) · Reihe 2: Karten hochkant ·
//   Reihe 3: Karten quer (Banner)
// Die KI-generierten (kaputten) Kartentitel werden dabei ersetzt:
// Die Titelplakette wird mit der gesampelten Plakettenfarbe über-
// deckt und der korrekte Titel in Cinzel/Serif neu gesetzt.
//
// Aufruf:  node scripts/slice-set.mjs [pfad-zum-set.png]
// Ausgabe: public/uploads/opt/rune-*.webp, karte-*.webp (+ Vorschau
//          der Einzelteile in scripts/.slice-preview/ zum Prüfen)
// ============================================================
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const INPUT = process.argv[2] || 'public/uploads/set-karten-runen.png'
const OUT = 'public/uploads/opt'
const PREVIEW = 'scripts/.slice-preview'

// Reihenfolge im Set (links → rechts) — nach Sichtprüfung ggf. anpassen.
const RUNEN_ORDER = ['fehu', 'raidho', 'sowilo', 'wunjo', 'berkano', 'isa', 'algiz']
const PORTRAIT_ORDER = ['kompass', 'tor', 'feder', 'see', 'funke']
const QUER_ORDER = ['kompass', 'tor', 'funke', 'weg']

const TITEL = {
  kompass: 'Der stille Kompass',
  tor: 'Das offene Tor',
  feder: 'Die goldene Feder',
  see: 'Der ruhende See',
  funke: 'Der erste Funke',
  weg: 'Der verborgene Weg',
}

// ---------- 1) Vordergrund-Maske + Zusammenhangskomponenten ----------
const img = sharp(INPUT).ensureAlpha()
const meta = await img.metadata()
const W = meta.width, H = meta.height
const SCALE = 3 // Downscale fürs Labeling (schnell & verbindet feine Lücken)
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
for (let sy = 0; sy < h; sy++) {
  for (let sx = 0; sx < w; sx++) {
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
}

// kleine Fragmente an nahe große Boxen anfügen, Rest verwerfen
let items = boxes.filter((b) => b.area > 400)
const frags = boxes.filter((b) => b.area <= 400 && b.area > 8)
for (const f of frags) {
  const host = items.find((b) => f.minx >= b.minx - 6 && f.maxx <= b.maxx + 6 && f.miny >= b.miny - 6 && f.maxy <= b.maxy + 6)
  if (host) {
    host.minx = Math.min(host.minx, f.minx); host.maxx = Math.max(host.maxx, f.maxx)
    host.miny = Math.min(host.miny, f.miny); host.maxy = Math.max(host.maxy, f.maxy)
  }
}

// zurückskalieren + 2px Rand
items = items.map((b) => ({
  x: Math.max(0, b.minx * SCALE - 2),
  y: Math.max(0, b.miny * SCALE - 2),
  w: Math.min(W, (b.maxx + 1) * SCALE + 2) - Math.max(0, b.minx * SCALE - 2),
  h: Math.min(H, (b.maxy + 1) * SCALE + 2) - Math.max(0, b.miny * SCALE - 2),
}))

// ---------- 2) In Reihen gruppieren (Steine / hochkant / quer) ----------
items.sort((a, b) => (a.y + a.h / 2) - (b.y + b.h / 2))
const rows = []
for (const it of items) {
  const cy = it.y + it.h / 2
  const row = rows.find((r) => Math.abs(r.cy - cy) < H * 0.12)
  if (row) { row.items.push(it); row.cy = (row.cy * (row.items.length - 1) + cy) / row.items.length }
  else rows.push({ cy, items: [it] })
}
rows.sort((a, b) => a.cy - b.cy)
rows.forEach((r) => r.items.sort((a, b) => a.x - b.x))

if (rows.length !== 3) console.warn(`⚠ Erwartet 3 Reihen, gefunden: ${rows.length} — bitte Vorschau prüfen!`)
const [steine, portraits, quer] = rows.map((r) => r.items)

console.log(`Gefunden: ${steine?.length ?? 0} Steine · ${portraits?.length ?? 0} Karten hochkant · ${quer?.length ?? 0} Karten quer`)

// ---------- 3) Plaketten-Fix: Farbe sampeln, überdecken, Titel neu setzen ----------
async function fixCaption(buf, cw, ch, title, landscape) {
  // Plaketten-Bereich (relativ, aus dem Set-Layout ermittelt)
  const px = Math.round(cw * (landscape ? 0.14 : 0.13))
  const pw = Math.round(cw * (landscape ? 0.72 : 0.74))
  const py = Math.round(ch * (landscape ? 0.72 : 0.845))
  const ph = Math.round(ch * (landscape ? 0.17 : 0.095))

  // Innenfarbe der Plakette sampeln (Mitte oben & unten → Verlauf)
  const rawCard = await sharp(buf).ensureAlpha().raw().toBuffer()
  const sample = (sx, sy) => {
    const i = (sy * cw + sx) * 4
    return [rawCard[i], rawCard[i + 1], rawCard[i + 2]]
  }
  const cx = Math.round(px + pw / 2)
  const top = sample(cx, py + Math.round(ph * 0.2))
  const bot = sample(cx, py + Math.round(ph * 0.8))
  const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`

  const fontSize = Math.min(ph * 0.52, (pw * 0.94) / (title.length * 0.58))
  const svg = `<svg width="${cw}" height="${ch}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${rgb(top)}"/><stop offset="1" stop-color="${rgb(bot)}"/>
    </linearGradient></defs>
    <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="${Math.round(ph * 0.22)}" fill="url(#p)"/>
    <text x="${cw / 2}" y="${py + ph / 2}" text-anchor="middle" dominant-baseline="central"
      font-family="Cinzel, Liberation Serif, serif" font-weight="700"
      font-size="${fontSize.toFixed(1)}" fill="#3d2a08" letter-spacing="0.5">${title}</text>
  </svg>`
  return sharp(buf).composite([{ input: Buffer.from(svg) }]).png().toBuffer()
}

// ---------- 4) Zuschneiden, fixen, WebP-Varianten schreiben ----------
await mkdir(OUT, { recursive: true })
await mkdir(PREVIEW, { recursive: true })

const crop = (b) => sharp(INPUT).extract({ left: b.x, top: b.y, width: b.w, height: b.h }).png().toBuffer()
const outWebp = async (buf, name, width) =>
  sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(OUT, name))

for (let i = 0; i < (steine?.length ?? 0); i++) {
  const name = RUNEN_ORDER[i] || `stein-${i}`
  const buf = await crop(steine[i])
  await outWebp(buf, `rune-${name}-md.webp`, 320)
  await outWebp(buf, `rune-${name}-sm.webp`, 96)
  await writeFile(path.join(PREVIEW, `rune-${name}.png`), buf)
}

for (let i = 0; i < (portraits?.length ?? 0); i++) {
  const key = PORTRAIT_ORDER[i] || `karte-${i}`
  const b = portraits[i]
  const fixed = await fixCaption(await crop(b), b.w, b.h, TITEL[key] || key, false)
  await outWebp(fixed, `karte-${key}-md.webp`, 460)
  await outWebp(fixed, `karte-${key}-sm.webp`, 150)
  await writeFile(path.join(PREVIEW, `karte-${key}.png`), fixed)
}

for (let i = 0; i < (quer?.length ?? 0); i++) {
  const key = QUER_ORDER[i] || `quer-${i}`
  const b = quer[i]
  const fixed = await fixCaption(await crop(b), b.w, b.h, TITEL[key] || key, true)
  await outWebp(fixed, `karte-${key}-quer-md.webp`, 640)
  await writeFile(path.join(PREVIEW, `karte-${key}-quer.png`), fixed)
}

console.log(`✓ fertig — WebP in ${OUT}, Prüf-Vorschau in ${PREVIEW}`)
