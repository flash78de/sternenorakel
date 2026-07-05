// ============================================================
// Share-Karten: ästhetisches Bild (1080×1350, Instagram-tauglich)
// zur empfangenen Botschaft — je Ritual ein eigenes Design in der
// passenden Farbwelt (Gold/Rosé/Jade), mit Luna und dem gezogenen Motiv.
// Bewusst OHNE Persönliches: kein Name, keine Reflexion, kein
// Botschaftstext — nur Mantra, Motiv und Marke (sanftes FOMO).
// ============================================================
import { asset } from './asset.js'
import { ritualTheme } from './ritualTheme.js'
import { karteBild, runeBild } from './ritualAssets.js'

const W = 1080
const H = 1350

// Deterministisches Sternenfeld (kein Zufall → reproduzierbare Karten)
const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: ((i * 173) % 108) / 108,
  y: ((i * 97) % 135) / 135,
  r: 1 + ((i * 31) % 10) / 6,
  a: 0.25 + ((i * 53) % 10) / 18,
  gold: i % 4 === 0,
}))

const loadImg = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

// Zeilenumbruch für Canvas-Text
function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    const probe = line ? line + ' ' + w : w
    if (ctx.measureText(probe).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = probe
    }
  }
  if (line) lines.push(line)
  return lines
}

// Bild proportional auf Zielhöhe zeichnen (zentriert um cx)
function drawFit(ctx, img, cx, top, targetH) {
  const scale = targetH / img.height
  const w = img.width * scale
  ctx.drawImage(img, cx - w / 2, top, w, targetH)
  return w
}

export async function buildShareCard(entry) {
  const t = ritualTheme(entry.ritual)
  try { await document.fonts?.ready } catch { /* ohne Webfonts: Serif-Fallback */ }

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Nachthimmel-Hintergrund
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#241d36')
  bg.addColorStop(0.45, '#13111c')
  bg.addColorStop(1, '#0b0a12')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  // Ritual-Schimmer oben
  const wash = ctx.createRadialGradient(W / 2, -100, 50, W / 2, -100, 900)
  wash.addColorStop(0, t.glow)
  wash.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, W, H)
  // Sterne
  for (const s of STARS) {
    ctx.globalAlpha = s.a
    ctx.fillStyle = s.gold ? '#E8C77A' : '#F5F4FA'
    ctx.beginPath()
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Kopf: Marke
  ctx.textAlign = 'center'
  ctx.fillStyle = '#E8C77A'
  ctx.font = "600 34px 'Cinzel', Georgia, serif"
  ctx.fillText('✦  S T E R N E N L U N A  ✦', W / 2, 92)

  // Luna mit Glow
  const glow = ctx.createRadialGradient(W / 2, 320, 30, W / 2, 320, 330)
  glow.addColorStop(0, t.glow)
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(W / 2 - 340, 0, 680, 660)
  const luna = await loadImg(asset('uploads/opt/luna-freude-transparent-md.webp'))
  drawFit(ctx, luna, W / 2, 130, 330)

  // Ritual-Motiv (das gezogene Ergebnis — generiert, nichts Persönliches)
  let motifBottom = 500
  if (entry.ritual === 'karten' && entry.card && karteBild(entry.card.title)) {
    const img = await loadImg(karteBild(entry.card.title))
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 40
    ctx.shadowOffsetY = 18
    drawFit(ctx, img, W / 2, 490, 430)
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    motifBottom = 490 + 430
  } else if (entry.ritual === 'runen' && Array.isArray(entry.runes) && entry.runes.length) {
    const stones = []
    for (const r of entry.runes) {
      const src = runeBild(r.name, 'md')
      if (src) stones.push(await loadImg(src))
    }
    if (stones.length) {
      const hgt = 260
      const gap = 40
      const widths = stones.map((img) => (hgt / img.height) * img.width)
      const total = widths.reduce((a, b) => a + b, 0) + gap * (stones.length - 1)
      let x = W / 2 - total / 2
      ctx.shadowColor = 'rgba(0,0,0,0.55)'
      ctx.shadowBlur = 30
      ctx.shadowOffsetY = 14
      stones.forEach((img, i) => {
        ctx.drawImage(img, x, 540, widths[i], hgt)
        x += widths[i] + gap
      })
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0
      // Positions-Begriffe (generisch): Nachwirken · Jetzt · Werden
      ctx.fillStyle = 'rgba(245,244,250,0.55)'
      ctx.font = "500 26px 'Inter', system-ui, sans-serif"
      ctx.fillText('Was wirkt nach · Was jetzt zählt · Was entstehen darf', W / 2, 860)
      motifBottom = 880
    }
  } else {
    // Würfel: Würfelbild + Archetyp
    const img = await loadImg(asset('uploads/opt/wuerfel-sm.webp'))
    ctx.shadowColor = 'rgba(0,0,0,0.55)'
    ctx.shadowBlur = 30
    ctx.shadowOffsetY = 14
    drawFit(ctx, img, W / 2, 500, 280)
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0
    if (entry.archetype?.name) {
      ctx.fillStyle = t.accent
      ctx.font = "600 40px 'Cinzel', Georgia, serif"
      ctx.fillText(`${entry.archetype.glyph || '✦'}  ${entry.archetype.name}`, W / 2, 860)
      ctx.fillStyle = 'rgba(245,244,250,0.55)'
      ctx.font = "500 26px 'Inter', system-ui, sans-serif"
      ctx.fillText('Mein Archetyp des Tages', W / 2, 900)
    }
    motifBottom = 910
  }

  // Ritual-Name als kleines Etikett
  ctx.fillStyle = t.accent
  ctx.font = "600 26px 'Inter', system-ui, sans-serif"
  ctx.fillText(`${t.glyph}  ${t.name.toUpperCase()}`, W / 2, 470)

  // Mantra (generierter Inhalt — persönlich wirkend, aber nichts Privates)
  if (entry.mantra) {
    ctx.fillStyle = '#E8C77A'
    ctx.font = "italic 600 52px 'Cinzel', Georgia, serif"
    const lines = wrapText(ctx, `„${entry.mantra}“`, W - 220)
    let y = Math.max(motifBottom + 90, 1000)
    for (const line of lines) {
      ctx.fillText(line, W / 2, y)
      y += 66
    }
  }

  // Sanftes FOMO + Adresse
  ctx.fillStyle = 'rgba(182,176,206,0.85)'
  ctx.font = "400 30px 'Inter', system-ui, sans-serif"
  ctx.fillText('Welche Botschaft wartet heute auf dich?', W / 2, H - 120)
  ctx.fillStyle = '#E8C77A'
  ctx.font = "700 34px 'Inter', system-ui, sans-serif"
  ctx.fillText('sternenluna.de', W / 2, H - 66)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

// Teilt die Karte (Web Share mit Bild) oder lädt sie herunter (Desktop-Fallback).
export async function shareCard(entry) {
  const blob = await buildShareCard(entry)
  const file = new File([blob], 'sternenluna.png', { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Sternenluna' })
      return 'geteilt'
    } catch {
      /* abgebrochen → Fallback unten */
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sternenluna.png'
  a.click()
  URL.revokeObjectURL(url)
  return 'heruntergeladen'
}
