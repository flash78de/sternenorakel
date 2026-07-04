// KI-Pfad-Test: Mock-Backend liefert eine Botschaft, App muss sie mergen + {{name}} ersetzen.
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'

const DIST = new URL('../dist', import.meta.url).pathname
const BASE = '/'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json' }

const app = http.createServer(async (req, res) => {
  let p = req.url.split('?')[0]
  if (!p.startsWith(BASE)) p = BASE
  const rel = p.slice(BASE.length) || 'index.html'
  try {
    const data = await readFile(path.join(DIST, rel))
    res.writeHead(200, { 'Content-Type': MIME[path.extname(rel)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(await readFile(path.join(DIST, 'index.html')))
  }
})
await new Promise((r) => app.listen(4173, r))

let received = null
const mock = http.createServer(async (req, res) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end() }
  let body = ''
  for await (const c of req) body += c
  received = JSON.parse(body)
  res.writeHead(200, { 'Content-Type': 'application/json', ...cors })
  res.end(JSON.stringify({
    title: 'Der leise Anfang',
    text: '{{name}}, heute zählt der KI-MOCK-SATZ mehr als jede Eile.\n\nZweiter Absatz der Botschaft.',
    mantra: 'Ich gehe in meinem Tempo.',
    question: 'Wo warst du heute schneller, als dir guttat?',
  }))
})
await new Promise((r) => mock.listen(4599, r))

const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 420, height: 900 } })
page.on('pageerror', (e) => { console.log('PAGEERROR:', e.message); process.exitCode = 1 })

const todayISO = new Date().toISOString().slice(0, 10)
const seed = {
  onboarded: true,
  profile: { name: 'Mira', themes: ['Selbstwert & innere Ruhe'], mood: 3, commStyles: ['warm'], coping: 'zuspruch', birth: { day: 1, month: 4, year: 1990 }, zodiac: null },
  stats: { stardust: 10, streak: 1, lastDrawISO: null, drawDays: [], constellationsDone: 0, moodTodayISO: todayISO },
  settings: { aiMode: true, aiConsent: true, aiEndpoint: 'http://localhost:4599/', reminder: false, reminderTime: '21:00', reminderWhen: 'abends', tone: 'Sanft', premium: false, splash: false },
  journal: [], seenReward: null, seenReturnISO: todayISO,
}

await page.goto('http://localhost:4173/')
await page.evaluate((s) => localStorage.setItem('sternenorakel.v1', JSON.stringify(s)), seed)
await page.reload(); await page.waitForTimeout(600)

let pass = 0, fail = 0
const check = (name, ok) => { ok ? pass++ : (fail++, process.exitCode = 1); console.log(`${ok ? '✅' : '❌'} ${name}`) }

await page.goto('http://localhost:4173/#/oracle')
await page.waitForTimeout(600)
await page.getByText('Sternenwürfel').first().click()
await page.waitForTimeout(700)
const trigger = page.locator('[aria-label*="ürfel"]').first()
if (await trigger.count()) await trigger.click({ force: true })
await page.waitForTimeout(6000)

const body = await page.textContent('body')
check('KI: Backend wurde aufgerufen', received !== null)
check('KI: kein Name im Request (nur hasName)', received && received.hasName === true && !JSON.stringify(received).includes('Mira'))
check('KI: Ritual-Kontext im Request (Archetyp)', received && received.archetype && typeof received.archetype.name === 'string')
check('KI: Text erscheint in der App', body.includes('KI-MOCK-SATZ'))
check('KI: {{name}} wurde durch Mira ersetzt', body.includes('Mira,') && !body.includes('{{name}}'))
check('KI: Mantra übernommen', body.includes('Ich gehe in meinem Tempo'))

console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`)
await browser.close()
app.close(); mock.close()
