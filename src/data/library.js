// ============================================================
// Sternenorakel — eingebaute Bibliothek & Stammdaten
// (local-first: alles offline, KI-Modus optional)
// ============================================================

// ---- Themen (Onboarding · max. 3) ----
export const THEMES = [
  'Liebe & Beziehungen',
  'Beruf & Berufung',
  'Selbstwert & innere Ruhe',
  'Veränderung & Neuanfang',
]

// ---- Rang-Leiter (kanonisch) ----
// Schwellen in Sternenstaub (✦). Jeder Tag/jede Reflexion bringt Sternenstaub.
export const RANKS = [
  { name: 'Sternenfunke', at: 0 },
  { name: 'Mondwanderer', at: 150 },
  { name: 'Sternensammler', at: 350 },
  { name: 'Lichtträger', at: 650 },
  { name: 'Himmelsdeuter', at: 1050 },
  { name: 'Erleuchtete*r', at: 1600 },
]

// Liefert {rank, level, current, next, into, span, toNext, progress}
export function rankInfo(stardust) {
  let idx = 0
  for (let i = 0; i < RANKS.length; i++) {
    if (stardust >= RANKS[i].at) idx = i
  }
  const current = RANKS[idx]
  const next = RANKS[idx + 1] || null
  const base = current.at
  const span = next ? next.at - base : 1
  const into = stardust - base
  const progress = next ? Math.min(1, into / span) : 1
  return {
    rank: current.name,
    level: idx + 1,
    current,
    next,
    into,
    span,
    toNext: next ? next.at - stardust : 0,
    progress,
  }
}

// ---- Sternzeichen aus Geburtstag ----
const ZODIAC = [
  { name: 'Steinbock', symbol: '♑', from: [12, 22], to: [1, 19] },
  { name: 'Wassermann', symbol: '♒', from: [1, 20], to: [2, 18] },
  { name: 'Fische', symbol: '♓', from: [2, 19], to: [3, 20] },
  { name: 'Widder', symbol: '♈', from: [3, 21], to: [4, 19] },
  { name: 'Stier', symbol: '♉', from: [4, 20], to: [5, 20] },
  { name: 'Zwillinge', symbol: '♊', from: [5, 21], to: [6, 20] },
  { name: 'Krebs', symbol: '♋', from: [6, 21], to: [7, 22] },
  { name: 'Löwe', symbol: '♌', from: [7, 23], to: [8, 22] },
  { name: 'Jungfrau', symbol: '♍', from: [8, 23], to: [9, 22] },
  { name: 'Waage', symbol: '♎', from: [9, 23], to: [10, 22] },
  { name: 'Skorpion', symbol: '♏', from: [10, 23], to: [11, 21] },
  { name: 'Schütze', symbol: '♐', from: [11, 22], to: [12, 21] },
]

export function zodiacOf(day, month) {
  if (!day || !month) return null
  for (const z of ZODIAC) {
    const [fm, fd] = z.from
    const [tm, td] = z.to
    if (
      (month === fm && day >= fd) ||
      (month === tm && day <= td)
    ) {
      return { name: z.name, symbol: z.symbol }
    }
  }
  // Steinbock umspannt den Jahreswechsel
  return { name: 'Steinbock', symbol: '♑' }
}

export const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

// ---- Botschafts-Bibliothek ----
// Jede Botschaft trägt Symbol, Kerntext, Mantra, Glückselement, Tagesenergie,
// Reflexionsfrage und Themen-Zuordnung.
export const MESSAGES = [
  {
    id: 'stiller-kompass',
    title: 'Der stille Kompass',
    symbol: { glyph: '☾', name: 'Mondsichel' },
    constellation: 'Der Mond',
    theme: 'Selbstwert & innere Ruhe',
    text:
      'Heute musst du nicht alles lösen. Vielleicht reicht es, die Richtung wieder zu spüren. Manche Antworten kommen nicht, weil du stärker drückst – sondern weil du still genug wirst, sie zu bemerken.',
    mantra: 'Ich darf langsam klar werden.',
    luck: 'Goldenes Licht',
    energy: { label: 'Sanfte Ausrichtung', value: 0.45 },
    reflection:
      'Wo versuche ich gerade, eine Antwort zu erzwingen, obwohl ein leiser Hinweis schon da ist?',
  },
  {
    id: 'worte-aus-der-stille',
    title: 'Worte aus der Stille',
    symbol: { glyph: '✦', name: 'Wegstern' },
    constellation: 'Der Pfad',
    theme: 'Veränderung & Neuanfang',
    text:
      'Ein neuer Weg beginnt selten mit einem großen Schritt, sondern mit dem Mut, den nächsten kleinen zu wagen. Du musst das Ende nicht sehen, um loszugehen.',
    mantra: 'Ich vertraue dem nächsten kleinen Schritt.',
    luck: 'Erste Morgenröte',
    energy: { label: 'Aufbruch', value: 0.6 },
    reflection: 'Welcher kleine Schritt wäre heute schon genug?',
  },
  {
    id: 'warmer-grund',
    title: 'Der warme Grund',
    symbol: { glyph: '❤', name: 'Herzfeuer' },
    constellation: 'Das Herz',
    theme: 'Liebe & Beziehungen',
    text:
      'Nähe entsteht nicht durch perfekte Worte, sondern durch ehrliche Anwesenheit. Wo du dich zeigst, wie du wirklich bist, darf etwas Echtes wachsen.',
    mantra: 'Ich darf mich zeigen, wie ich bin.',
    luck: 'Warmes Bernsteinlicht',
    energy: { label: 'Offene Verbindung', value: 0.7 },
    reflection: 'Wem könnte ich heute ein klein wenig ehrlicher begegnen – auch mir selbst?',
  },
  {
    id: 'leise-kraft',
    title: 'Deine leise Kraft',
    symbol: { glyph: '☀', name: 'Innensonne' },
    constellation: 'Die Quelle',
    theme: 'Beruf & Berufung',
    text:
      'Nicht jede Stärke ist laut. Manchmal liegt deine größte Kraft in der ruhigen Beständigkeit, mit der du immer wieder anfängst. Sieh, wie weit dich das schon getragen hat.',
    mantra: 'Meine Beständigkeit ist eine stille Stärke.',
    luck: 'Klarer Bergquell',
    energy: { label: 'Verwurzelte Kraft', value: 0.55 },
    reflection: 'Worin bin ich beständig gewesen, ohne es zu würdigen?',
  },
  {
    id: 'raum-zum-atmen',
    title: 'Raum zum Atmen',
    symbol: { glyph: '✧', name: 'Sternenhauch' },
    constellation: 'Die Weite',
    theme: 'Selbstwert & innere Ruhe',
    text:
      'Du darfst Pausen machen, ohne sie dir zu verdienen. Ruhe ist kein Stillstand – sie ist der Boden, auf dem dein nächster klarer Gedanke wächst.',
    mantra: 'Ich darf innehalten.',
    luck: 'Stilles Mondlicht',
    energy: { label: 'Sanfte Erholung', value: 0.4 },
    reflection: 'Wo könnte ich mir heute fünf Minuten echte Ruhe schenken?',
  },
  {
    id: 'mut-zur-wandlung',
    title: 'Mut zur Wandlung',
    symbol: { glyph: '✦', name: 'Wandelstern' },
    constellation: 'Der Wandel',
    theme: 'Veränderung & Neuanfang',
    text:
      'Manches darfst du loslassen, gerade weil es dir lange gedient hat. Was endet, macht Platz für das, was noch werden will. Du verlierst nicht – du gibst weiter.',
    mantra: 'Ich lasse los, was getan ist.',
    luck: 'Abendgold',
    energy: { label: 'Klärende Bewegung', value: 0.65 },
    reflection: 'Was darf ich heute dankbar gehen lassen?',
  },
]

// Wählt eine Botschaft, möglichst zu den gewählten Themen passend.
export function pickMessage(themes = [], excludeId = null) {
  let pool = MESSAGES
  if (themes && themes.length) {
    const matched = MESSAGES.filter((m) => themes.includes(m.theme))
    if (matched.length) pool = matched
  }
  if (excludeId && pool.length > 1) {
    pool = pool.filter((m) => m.id !== excludeId)
  }
  const i = Math.floor(Math.random() * pool.length)
  return pool[i]
}

// ---- Lunas Sprechblasen je Tageszeit ----
export function greeting(name) {
  const h = new Date().getHours()
  if (h < 11) return { teil: 'Guten Morgen', state: 'idle' }
  if (h < 17) return { teil: 'Schön, dass du da bist', state: 'idle' }
  if (h < 22) return { teil: 'Guten Abend', state: 'idle' }
  return { teil: 'Gute Nacht', state: 'schlaf' }
}

export function lunaSays() {
  const h = new Date().getHours()
  if (h < 11)
    return 'Heute wartet ein kleiner Impuls auf dich. Nur klar genug, um gehört zu werden.'
  if (h < 17)
    return 'Halte einen Moment inne. Vielleicht möchte dir der Tag etwas Leises sagen.'
  if (h < 22)
    return 'Der Abend lädt zum Nachklingen ein. Empfange deine Botschaft, wenn du bereit bist.'
  return 'Bevor du ruhst – möchtest du noch einen letzten Stern für heute sammeln?'
}

// ---- Sternbilder-Sammlung (12) ----
// Jedes vollendete 7-Tage-Band schaltet das nächste Sternbild frei.
export const CONSTELLATIONS = [
  { name: 'Der Mond', glyph: '☾', motto: 'Gefühl & Intuition' },
  { name: 'Der Pfad', glyph: '✧', motto: 'Richtung & Entscheidung' },
  { name: 'Das Herz', glyph: '❤', motto: 'Nähe & Verbindung' },
  { name: 'Die Quelle', glyph: '☀', motto: 'Kraft von innen' },
  { name: 'Die Weite', glyph: '✦', motto: 'Ruhe & Raum' },
  { name: 'Der Wandel', glyph: '✺', motto: 'Übergang & Mut' },
  { name: 'Der Anker', glyph: '⚓', motto: 'Halt & Werte' },
  { name: 'Die Brücke', glyph: '⌢', motto: 'Versöhnung' },
  { name: 'Der Stern', glyph: '★', motto: 'Sehnsucht & Ziel' },
  { name: 'Die Feder', glyph: '❦', motto: 'Loslassen & Vertrauen' },
  { name: 'Das Tor', glyph: '⟡', motto: 'Neue Möglichkeit' },
  { name: 'Die Krone', glyph: '♛', motto: 'Vollendung' },
]

// Fortschritt zur Sammlung: wie viele frei, wie viele Tage bis zum nächsten.
export function constellationProgress(constellationsDone = 0, streak = 0) {
  const total = CONSTELLATIONS.length
  const done = Math.min(constellationsDone, total)
  const rem = streak % 7
  const daysToNext = rem === 0 ? 7 : 7 - rem
  return { total, done, daysToNext, next: CONSTELLATIONS[done] || null }
}

// ---- Datum auf Deutsch ----
const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
export function formatDate(d = new Date()) {
  return {
    weekday: WEEKDAYS[d.getDay()],
    short: `${d.getDate()}. ${MONTHS[d.getMonth()]}`,
    iso: d.toISOString().slice(0, 10),
  }
}
