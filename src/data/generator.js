// ============================================================
// Sternenorakel — Barnum-Generator (Batch 7A)
// Erzeugt Botschaften live aus Bausteinen statt aus festen Texten.
// Personalisiert nach Name, Themen, Stimmung und gewähltem Ritual.
// Vorlage: Standalone-„Sternenflüstern". Ausgabe = MESSAGES-Schema.
// ============================================================

// ---- Bausteine ----
export const eroeffnungen = [
  'Etwas in dir hat heute leiser geklopft als sonst.',
  'Der heutige Tag trägt eine feine, kaum hörbare Melodie.',
  'Zwischen deinen Gedanken liegt gerade mehr Raum, als du glaubst.',
  'Du stehst an einer stillen Schwelle, auch wenn außen alles gewohnt wirkt.',
  'Ein Teil von dir sehnt sich nach Klarheit, ein anderer nach Ruhe.',
  'Heute darf sich etwas ordnen, das lange durcheinander schien.',
  'Es liegt eine leise Frage in dir, die keine schnelle Antwort braucht.',
]

export const kernbotschaften = [
  'Du musst nicht alles auf einmal verstehen – ein einziger klarer Gedanke genügt für heute.',
  'Was dich gerade beschäftigt, ist kein Umweg, sondern ein Teil deines Weges.',
  'Deine Zweifel sind kein Zeichen von Schwäche, sondern von Tiefe.',
  'Nicht jede Antwort kommt durch Nachdenken – manche durch Loslassen.',
  'Du trägst mehr Kraft in dir, als der heutige Tag von dir verlangt.',
  'Manchmal ist das Innehalten selbst schon die Bewegung nach vorn.',
  'Das, was du suchst, sucht auf seine Weise auch dich.',
]

// Themen-Bausteine (Key ↔ Onboarding-Label über THEME_KEY)
export const themen = {
  liebe: {
    label: 'Liebe & Beziehungen',
    constellation: 'Das Herz',
    saetze: [
      'In deinen Beziehungen darfst du dich zeigen, ohne dich beweisen zu müssen.',
      'Nähe wächst dort, wo du ehrlich bist – auch mit dir selbst.',
      'Ein offenes Wort kann heute mehr Wärme schenken als ein perfektes.',
      'Wo du dich echt zeigst, darf etwas Verbindendes entstehen.',
    ],
  },
  beruf: {
    label: 'Beruf & Berufung',
    constellation: 'Die Quelle',
    saetze: [
      'Deine Beständigkeit ist eine leise, oft unterschätzte Stärke.',
      'Der nächste kleine Schritt zählt heute mehr als der große Plan.',
      'Was dich erfüllt, verrät dir die Richtung – höre genau hin.',
      'Nicht jede Stärke ist laut; deine ruhige Art trägt dich weit.',
    ],
  },
  selbstwert: {
    label: 'Selbstwert & innere Ruhe',
    constellation: 'Die Weite',
    saetze: [
      'Du darfst innehalten, ohne es dir verdienen zu müssen.',
      'Dein Wert hängt nicht an dem, was du heute leistest.',
      'Ruhe ist kein Stillstand – sie ist der Boden für deinen nächsten klaren Gedanken.',
      'Sei heute ein wenig sanfter mit dir, als du es gewohnt bist.',
    ],
  },
  veraenderung: {
    label: 'Veränderung & Neuanfang',
    constellation: 'Der Wandel',
    saetze: [
      'Was endet, macht Platz für das, was noch werden will.',
      'Ein neuer Weg beginnt mit dem Mut zum nächsten kleinen Schritt.',
      'Du musst das Ende nicht sehen, um vertrauensvoll loszugehen.',
      'Loslassen ist kein Verlust – manchmal ist es ein Weitergeben.',
    ],
  },
  schule: {
    label: 'Schule & Lernen',
    constellation: 'Das Tor',
    saetze: [
      'Du musst heute nicht alles verstehen – es genügt, den nächsten Gedanken wirklich zu durchdringen.',
      'Lernen ist kein Wettlauf; dein eigenes Tempo trägt dich am weitesten.',
      'Ein Fehler ist kein Urteil über dich, sondern eine Stelle, an der du gerade wächst.',
      'Setz dich heute nicht mehr unter Druck, als es dir beim Lernen wirklich hilft.',
    ],
  },
  entscheidungen: {
    label: 'Entscheidungen & Klarheit',
    constellation: 'Der Pfad',
    saetze: [
      'Klarheit kommt selten durch Grübeln – oft durch einen ruhigen Moment mit dir selbst.',
      'Du musst nicht alle Wege überblicken, nur den nächsten ehrlichen Schritt.',
      'Manchmal weiß ein Teil von dir längst, wohin – lausche ihm leise.',
      'Eine Entscheidung darf sich stimmig anfühlen, nicht nur richtig aussehen.',
    ],
  },
  kreativitaet: {
    label: 'Kreativität',
    constellation: 'Der Stern',
    saetze: [
      'Deine Ideen brauchen keinen perfekten Anfang – nur einen mutigen ersten Strich.',
      'Kreativität wächst im Spiel, nicht im Zwang; lass dir Raum zum Ausprobieren.',
      'Was in dir entstehen will, darf zuerst unfertig und roh sein.',
      'Nimm einen Funken heute ernst – aus ihm kann etwas Eigenes werden.',
    ],
  },
  loslassen: {
    label: 'Loslassen',
    constellation: 'Die Feder',
    saetze: [
      'Nicht alles, was du trägst, musst du weitertragen.',
      'Loslassen heißt nicht aufgeben, sondern die Hände für Neues öffnen.',
      'Was getan ist, darfst du dankbar ziehen lassen.',
      'Manchmal ist der leichteste Schritt der, etwas bewusst zurückzulassen.',
    ],
  },
  dankbarkeit: {
    label: 'Dankbarkeit',
    constellation: 'Der Anker',
    saetze: [
      'Ein kleiner Dank am Tag richtet den Blick sanft auf das, was schon trägt.',
      'Was du wertschätzt, wächst leiser weiter in dir.',
      'Auch ein gewöhnlicher Moment kann sich als Geschenk zeigen, wenn du hinschaust.',
      'Dankbarkeit ist kein Muss – nur eine warme Art, den Tag zu halten.',
    ],
  },
}

// Stimmung 1–5 (mood aus dem Profil)
export const stimmungsSaetze = {
  1: 'Sei heute besonders sanft mit dir – schwere Tage brauchen keine großen Antworten, nur ein wenig Wärme.',
  2: 'Auch wenn es gerade zäh ist: Ein kleiner Lichtpunkt genügt, um die Richtung zu halten.',
  3: 'Du ruhst gerade in einer stillen Mitte – von hier aus kannst du klar spüren, wohin du dich neigst.',
  4: 'Deine leichte Zuversicht ist ein guter Begleiter – lass sie dich tragen, ohne zu drängen.',
  5: 'Deine Offenheit ist heute weit – nutze sie, um etwas Gutes ganz bewusst zu genießen.',
}

export const reflexionsfragen = [
  'Wo versuchst du gerade, etwas zu erzwingen, das sich eigentlich entfalten möchte?',
  'Was bräuchtest du heute wirklich – und wer könnte es dir geben, vielleicht du selbst?',
  'Welcher kleine Schritt wäre heute schon genug?',
  'Was darfst du heute dankbar loslassen?',
  'Worin bist du beständig gewesen, ohne es zu würdigen?',
  'Wem könntest du heute ein wenig ehrlicher begegnen – auch dir selbst?',
  'Was möchte in dir gehört werden, bevor du weitergehst?',
]

export const mantras = [
  'Ich darf langsam klar werden.',
  'Ich vertraue dem nächsten kleinen Schritt.',
  'Ich darf mich zeigen, wie ich bin.',
  'Ich lasse los, was getan ist.',
  'Ich darf innehalten.',
  'Meine Ruhe ist eine stille Stärke.',
  'Ich bin genug, auch heute.',
]

export const glueckselemente = [
  'Goldenes Licht',
  'Warmes Bernsteinlicht',
  'Stilles Mondlicht',
  'Erste Morgenröte',
  'Klarer Bergquell',
  'Abendgold',
  'Sanfter Sternenstaub',
]

export const energien = [
  { label: 'Sanfte Ausrichtung', value: 0.45 },
  { label: 'Aufbruch', value: 0.6 },
  { label: 'Offene Verbindung', value: 0.7 },
  { label: 'Verwurzelte Kraft', value: 0.55 },
  { label: 'Sanfte Erholung', value: 0.4 },
  { label: 'Klärende Bewegung', value: 0.65 },
  { label: 'Stille Zuversicht', value: 0.5 },
]

export const titelPool = [
  'Der stille Kompass',
  'Worte aus der Stille',
  'Der warme Grund',
  'Deine leise Kraft',
  'Raum zum Atmen',
  'Mut zur Wandlung',
  'Ein leiser Anfang',
  'Der Klang deiner Ruhe',
  'Was in dir leuchtet',
  'Das nächste kleine Licht',
]

// Ritual-Symbole: {name, glyph, bedeutung}
export const ritualSymbols = {
  wuerfel: [
    { name: 'Mondsichel', glyph: '☾', bedeutung: 'Intuition & Gefühl' },
    { name: 'Wegstern', glyph: '✦', bedeutung: 'Richtung & Aufbruch' },
    { name: 'Herzfeuer', glyph: '❤', bedeutung: 'Nähe & Wärme' },
    { name: 'Innensonne', glyph: '☀', bedeutung: 'Kraft von innen' },
    { name: 'Sternenhauch', glyph: '✧', bedeutung: 'Ruhe & Weite' },
    { name: 'Wandelstern', glyph: '✺', bedeutung: 'Übergang & Mut' },
  ],
  karten: [
    { name: 'Der Stern', glyph: '★', bedeutung: 'Hoffnung & Ziel' },
    { name: 'Der Mond', glyph: '☾', bedeutung: 'Das Verborgene' },
    { name: 'Die Sonne', glyph: '☀', bedeutung: 'Klarheit & Freude' },
    { name: 'Die Kraft', glyph: '∞', bedeutung: 'Sanfte Stärke' },
    { name: 'Die Welt', glyph: '⟡', bedeutung: 'Vollendung' },
  ],
  runen: [
    { name: 'Fehu', glyph: 'ᚠ', bedeutung: 'Fülle & Beginn' },
    { name: 'Raidho', glyph: 'ᚱ', bedeutung: 'Der Weg' },
    { name: 'Sowilo', glyph: 'ᛊ', bedeutung: 'Lebenskraft' },
    { name: 'Berkano', glyph: 'ᛒ', bedeutung: 'Wachstum' },
    { name: 'Wunjo', glyph: 'ᚹ', bedeutung: 'Freude & Harmonie' },
  ],
}

// Onboarding-Label → Generator-Key
export const THEME_KEY = {
  'Liebe & Beziehungen': 'liebe',
  'Beruf & Berufung': 'beruf',
  'Schule & Lernen': 'schule',
  'Selbstwert & innere Ruhe': 'selbstwert',
  'Veränderung & Neuanfang': 'veraenderung',
  'Entscheidungen & Klarheit': 'entscheidungen',
  'Kreativität': 'kreativitaet',
  'Loslassen': 'loslassen',
  'Dankbarkeit': 'dankbarkeit',
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const clampMood = (m) => Math.min(5, Math.max(1, Math.round(Number(m) || 3)))

// Erzeugt eine personalisierte Botschaft im MESSAGES-Schema.
export function generateMessage({ name = '', themes = [], mood = 3, ritual = 'wuerfel' } = {}) {
  // Thema wählen: bevorzugt aus den gewählten, sonst zufällig
  const keys = (themes || []).map((t) => THEME_KEY[t]).filter(Boolean)
  const themeKey = keys.length ? pick(keys) : pick(Object.keys(themen))
  const thema = themen[themeKey]

  const symbolPool = ritualSymbols[ritual] || ritualSymbols.wuerfel
  const sym = pick(symbolPool)

  const m = clampMood(mood)
  const trimmed = (name || '').trim()
  const eroeffnung = pick(eroeffnungen)
  const kern = pick(kernbotschaften)
  const themenSatz = pick(thema.saetze)
  const stimmung = stimmungsSaetze[m]

  // Absatz 1: (optional Anrede) + Eröffnung + Kernbotschaft
  const opener = trimmed
    ? `${trimmed}, ${eroeffnung.charAt(0).toLowerCase()}${eroeffnung.slice(1)}`
    : eroeffnung
  const p1 = `${opener} ${kern}`
  // Absatz 2: Themen-Satz + Stimmungs-Satz
  const p2 = `${themenSatz} ${stimmung}`

  return {
    id: `gen-${Date.now()}`,
    title: pick(titelPool),
    symbol: { glyph: sym.glyph, name: sym.name },
    constellation: thema.constellation,
    theme: thema.label,
    text: `${p1}\n\n${p2}`,
    mantra: pick(mantras),
    luck: pick(glueckselemente),
    energy: pick(energien),
    reflection: pick(reflexionsfragen),
  }
}
