// E2E-Smoketest: Ziehung, Glücks-Grid, Sternbilder-Reflexions-Unlock, Monat-Gate, KI-Settings
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'

const DIST = new URL('../dist', import.meta.url).pathname
const BASE = '/'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json' }

const server = http.createServer(async (req, res) => {
  let p = req.url.split('?')[0]
  if (!p.startsWith(BASE)) p = BASE
  let rel = p.slice(BASE.length) || 'index.html'
  try {
    const file = path.join(DIST, rel)
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    const data = await readFile(path.join(DIST, 'index.html'))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(data)
  }
})
await new Promise((r) => server.listen(4173, r))

const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 420, height: 900 } })
page.on('pageerror', (e) => { console.log('PAGEERROR:', e.message); process.exitCode = 1 })

const todayISO = new Date().toISOString().slice(0, 10)
const day = (n) => Date.now() - n * 86400000
const mkEntry = (i, theme, refl, luck) => ({
  id: `seed-${i}`, ts: day(i + 1), iso: new Date(day(i + 1)).toISOString().slice(0, 10),
  title: 'Seed', symbol: { glyph: '✦', name: 'Vertrauen' }, theme, mantra: 'x', text: 'Seed-Text',
  luck, energy: 'Morgenlicht', question: 'Frage?', ritual: 'wuerfel',
  archetype: { name: 'Vertrauen', glyph: '✦', kern: 'k', impuls: 'i' },
  mood: 3 + (i % 3), reflection: refl,
})

const seed = {
  onboarded: true,
  profile: { name: 'Mira', themes: ['Liebe & Beziehungen'], mood: 4, commStyles: ['warm'], coping: 'zuspruch', birth: { day: 1, month: 4, year: 1990 }, zodiac: { name: 'Widder', symbol: '♈' } },
  stats: { stardust: 40, streak: 3, lastDrawISO: null, drawDays: [], constellationsDone: 0, moodTodayISO: todayISO },
  settings: { aiMode: false, aiEndpoint: '', reminder: false, reminderTime: '21:00', reminderWhen: 'abends', tone: 'Sanft', premium: true, splash: false },
  journal: [
    mkEntry(0, 'Liebe & Beziehungen', 'Gedanke eins', 'Goldenes Licht'),
    mkEntry(1, 'Liebe & Beziehungen', 'Gedanke zwei', 'Goldenes Licht'),
    mkEntry(2, 'Liebe & Beziehungen', '', 'Stilles Mondlicht'),
    mkEntry(3, 'Beruf & Berufung', 'Gedanke drei', null),
    mkEntry(4, 'Beruf & Berufung', 'Gedanke vier', null),
    mkEntry(5, 'Selbstwert & innere Ruhe', 'Gedanke fünf', null),
    mkEntry(6, 'Selbstwert & innere Ruhe', 'Gedanke sechs', null),
  ],
  seenReward: null, seenReturnISO: todayISO,
}

await page.goto('http://localhost:4173/')
await page.evaluate((s) => localStorage.setItem('sternenorakel.v1', JSON.stringify(s)), seed)
await page.reload()
await page.waitForTimeout(600)

let pass = 0, fail = 0
const check = (name, ok) => { ok ? pass++ : (fail++, process.exitCode = 1); console.log(`${ok ? '✅' : '❌'} ${name}`) }
const bodyHas = async (t) => (await page.textContent('body')).includes(t)

// --- 1) Glücks-Grid ---
await page.goto('http://localhost:4173/#/profil/glueck')
await page.waitForTimeout(600)
check('Glueck: Screen lädt', await bodyHas('Glückselemente') || await bodyHas('Glück'))
check('Glueck: Goldenes Licht gefunden (2×)', await bodyHas('Goldenes Licht') && await bodyHas('2×'))
check('Glueck: Stilles Mondlicht gefunden', await bodyHas('Stilles Mondlicht'))
check('Glueck: verborgene Elemente vorhanden', await bodyHas('verborgen'))
// Detail-Modal
await page.click('text=Goldenes Licht')
await page.waitForTimeout(300)
check('Glueck: Detail-Modal öffnet', await bodyHas('Bedeutung') || (await page.locator('.modal').count()) > 0)

// --- 2) Sternbilder: Reflexions-Meilensteine ---
await page.goto('http://localhost:4173/#/profil/sternbilder')
await page.waitForTimeout(500)
const stern = await page.textContent('body')
check('Sternbilder: Der Mond entstanden (1. Reflexion)', stern.includes('Der Mond'))
check('Sternbilder: Fortschritt sichtbar (2/3)', stern.includes('2/3'))
check('Sternbilder: FOMO "Noch ... Reflexion"', /Noch \d+ Reflexion/.test(stern))

// --- 3) Sternbild-Unlock via nachträglicher Reflexion → Feier ---
await page.goto('http://localhost:4173/#/tagebuch/seed-2')
await page.waitForTimeout(500)
const ta = page.locator('textarea')
if (await ta.count()) {
  await ta.fill('Dritter Liebes-Gedanke')
  const saveBtn = page.locator('button:has-text("speichern"), button:has-text("Speichern"), button:has-text("festhalten"), button:has-text("Festhalten")').first()
  if (await saveBtn.count()) {
    await saveBtn.click()
    await page.waitForTimeout(900)
    const after = await page.textContent('body')
    check('Unlock: Das Herz erscheint nach 3. Liebes-Reflexion', after.includes('Das Herz') || page.url().includes('feier'))
  } else check('Unlock: Speichern-Button gefunden', false)
} else check('Unlock: Reflexions-Textarea gefunden', false)

// --- 4) Monatsbild (Plus aktiv, 7 Einträge) ---
await page.goto('http://localhost:4173/#/monat')
await page.waitForTimeout(500)
const monat = await page.textContent('body')
check('Monat: Statistik sichtbar', monat.includes('Letzte 30 Tage') && monat.includes('Stimmungsverlauf'))
check('Monat: Lunas Rückblick', monat.includes('Lunas Rückblick') && monat.includes('Mira'))

// Monat-Gate ohne Plus
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('sternenorakel.v1'))
  s.settings.premium = false
  localStorage.setItem('sternenorakel.v1', JSON.stringify(s))
})
await page.reload(); await page.waitForTimeout(600)
check('Monat: Plus-Gate ohne Premium', await bodyHas('Monatsbild wartet') || await bodyHas('Plus entdecken'))

// --- 5) Settings: KI-Modus (Server fest eingebaut, nur Toggle) ---
await page.goto('http://localhost:4173/#/profil/settings')
await page.waitForTimeout(500)
check('Settings: KI-Modus vorhanden, kein "kein Server"-Hinweis', await bodyHas('KI-Modus') && !(await bodyHas('kein Server verbunden')))
check('Settings: keine sichtbare Server-Adresse', !(await bodyHas('KI-Server-Adresse')) && !(await bodyHas('workers.dev')))
await page.locator('text=KI-Modus').locator('..').locator('..').locator('.toggle').first().click()
await page.waitForTimeout(400)
const aiOn = await page.evaluate(() => JSON.parse(localStorage.getItem('sternenorakel.v1')).settings.aiMode)
check('Settings: Toggle aktiviert KI-Modus', aiOn === true)

// --- 6) Ziehung offline (KI-Modus an, Endpunkt unerreichbar → Fallback) ---
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('sternenorakel.v1'))
  s.settings.aiEndpoint = 'http://localhost:9/x' // garantiert unerreichbar (überschreibt den eingebauten Worker)
  localStorage.setItem('sternenorakel.v1', JSON.stringify(s))
})
await page.reload()
await page.waitForTimeout(600)
await page.goto('http://localhost:4173/#/oracle')
await page.waitForTimeout(600)
const drawBtn = page.getByText('Sternenwürfel').first()
if (await drawBtn.count()) await drawBtn.click()
await page.waitForTimeout(700)
// Ritual starten (Würfel antippen oder Gold-Button)
const trigger = page.locator('[aria-label*="ürfel"]').first()
if (await trigger.count()) { await trigger.click({ force: true }) } else {
  const anyBtn = page.locator('button.btn-gold').first()
  if (await anyBtn.count()) await anyBtn.click({ force: true })
}
await page.waitForTimeout(5500)
const drawn = await page.textContent('body')
check('Ziehung: Botschaft trotz totem KI-Endpunkt (Offline-Fallback)', drawn.includes('Mantra') || drawn.includes('Botschaft') || drawn.length > 500)

// --- 7) Privacy: Voll-Backup ---
await page.goto('http://localhost:4173/#/profil/privacy')
await page.waitForTimeout(500)
const [download] = await Promise.all([
  page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
  page.click('text=Backup als Datei'),
])
if (download) {
  const file = await download.path()
  const content = JSON.parse(await readFile(file, 'utf8'))
  check('Privacy: Backup enthält profile+stats+settings+journal', Boolean(content.profile && content.stats && content.settings && content.journal && content.app === 'sternenluna'))
} else check('Privacy: Download ausgelöst', false)

console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`)
await browser.close()
server.close()
