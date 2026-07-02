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

// ============================================================
// Ritual-spezifische Welten (Sprint 2 · jedes Ritual eine eigene Sprache)
// ============================================================

// Sternenwürfel · 6 Archetypen — Richtung, Entscheidung, Handlung, Tagesfokus
export const ARCHETYPEN = [
  { name: 'Mut', glyph: '⚔', kern: 'Heute darfst du einen Schritt wagen, bevor du dich ganz sicher fühlst.', impuls: 'Sprich eine Sache aus, die du bisher nur gedacht hast.' },
  { name: 'Ruhe', glyph: '☾', kern: 'Deine Kraft liegt heute nicht im Tun, sondern im bewussten Innehalten.', impuls: 'Schenke dir fünf Minuten ohne Bildschirm und ohne Aufgabe.' },
  { name: 'Klarheit', glyph: '◇', kern: 'Etwas will heute klar werden – wenn du es nicht zerredest.', impuls: 'Schreibe deine Frage in einem einzigen Satz auf.' },
  { name: 'Vertrauen', glyph: '✦', kern: 'Du musst heute nicht alles kontrollieren, damit es gut wird.', impuls: 'Lass eine kleine Sache heute bewusst ungeplant.' },
  { name: 'Veränderung', glyph: '✺', kern: 'Ein alter Rahmen ist dir zu klein geworden – spür einmal hin.', impuls: 'Verändere heute eine winzige Gewohnheit, nur für diesen Tag.' },
  { name: 'Verbindung', glyph: '❤', kern: 'Heute wächst mehr im Miteinander als im Alleinsein.', impuls: 'Melde dich bei einem Menschen, an den du öfter denkst.' },
]

// Sternenkarten · Deck der inneren Bilder — Emotionen, tiefere Themen
export const KARTEN = [
  { title: 'Der stille Kompass', glyph: '🧭', deutung: 'Dieses Bild spricht von einer Richtung, die du längst spürst, aber noch nicht ausgesprochen hast. Der Kompass zeigt nicht nach außen – er zeigt nach innen.', thema: 'innere Ausrichtung' },
  { title: 'Das offene Tor', glyph: '⛩', deutung: 'Ein Übergang steht bereit. Das Tor zwingt dich nicht hindurch – es zeigt dir nur, dass der Weg nicht verschlossen ist, wie du vielleicht dachtest.', thema: 'Möglichkeit' },
  { title: 'Die goldene Feder', glyph: '🪶', deutung: 'Die Feder trägt nichts Schweres. Sie erinnert dich daran, dass Loslassen kein Verlust ist, sondern eine Art zu fliegen.', thema: 'Leichtigkeit & Loslassen' },
  { title: 'Der ruhende See', glyph: '🌊', deutung: 'Erst wenn die Oberfläche still wird, zeigt der See, was in der Tiefe liegt. Deine Ruhe ist kein Rückzug – sie ist ein Blick nach innen.', thema: 'Tiefe & Stille' },
  { title: 'Der erste Funke', glyph: '🕯', deutung: 'Etwas Neues glimmt in dir – noch klein, noch leise. Der Funke fragt nicht nach Garantien. Er fragt nur, ob du ihn nährst.', thema: 'Anfang & Kreativität' },
  { title: 'Der verborgene Weg', glyph: '🌿', deutung: 'Es gibt einen Pfad, den du bisher übersehen hast, weil er nicht der offensichtliche ist. Vielleicht liegt er näher, als du denkst.', thema: 'unerwartete Wege' },
]

// Runen · alte Grundprinzipien — Dreier-Lesung: Nachwirken · Jetzt · Werden
export const RUNEN = [
  { name: 'Fehu', glyph: 'ᚠ', bedeutung: 'Fülle & Beginn', heute: 'Etwas in deinem Leben ist reicher, als du es gerade würdigst.' },
  { name: 'Raidho', glyph: 'ᚱ', bedeutung: 'Der Weg', heute: 'Du bist in Bewegung, auch wenn es sich langsam anfühlt.' },
  { name: 'Sowilo', glyph: 'ᛊ', bedeutung: 'Lebenskraft', heute: 'Deine Energie will eine Richtung – nicht mehr Aufgaben.' },
  { name: 'Berkano', glyph: 'ᛒ', bedeutung: 'Wachstum', heute: 'Etwas wächst im Verborgenen und braucht noch Schutz, nicht Urteil.' },
  { name: 'Wunjo', glyph: 'ᚹ', bedeutung: 'Freude & Harmonie', heute: 'Erlaube dir Freude, ohne sie erst zu verdienen.' },
  { name: 'Isa', glyph: 'ᛁ', bedeutung: 'Stille & Pause', heute: 'Nicht jede Stille ist Stillstand – manche ist Sammlung.' },
  { name: 'Ansuz', glyph: 'ᚨ', bedeutung: 'Botschaft & Stimme', heute: 'Ein Wort – gesprochen oder gehört – trägt heute mehr als sonst.' },
  { name: 'Algiz', glyph: 'ᛉ', bedeutung: 'Schutz & Grenze', heute: 'Eine Grenze, die du ziehst, ist kein Angriff, sondern Selbstachtung.' },
]

export const RUNEN_POSITIONEN = ['Was wirkt nach?', 'Was ist jetzt wichtig?', 'Was darf entstehen?']

// ---- Kommunikationsstil (Onboarding · „Wie sollen meine Botschaften mit dir sprechen?") ----
export const COMM_STYLES = [
  { key: 'klar', label: 'Klar & direkt', desc: 'Sag mir, worum es geht. Ohne viele Umwege.' },
  { key: 'leicht', label: 'Leicht & inspirierend', desc: 'Gib mir Bilder, Mut und neue Möglichkeiten.' },
  { key: 'warm', label: 'Warm & behutsam', desc: 'Sprich einfühlsam und gib mir Zeit.' },
  { key: 'tief', label: 'Tief & strukturiert', desc: 'Erkläre Zusammenhänge und lass mich genau hinschauen.' },
]

const styleSaetze = {
  klar: ['Kurz gesagt: Der nächste Schritt ist wichtiger als der perfekte Plan.', 'Ohne Umweg: Du weißt mehr, als du dir gerade zugestehst.'],
  leicht: ['Stell es dir wie einen Himmel kurz vor Sonnenaufgang vor – noch dunkel, aber schon voller Richtung.', 'Vielleicht ist heute weniger eine Aufgabe als eine Einladung.'],
  warm: ['Und was auch immer heute wird – du musst es nicht alleine tragen.', 'Sei so freundlich mit dir, wie du es mit einem guten Freund wärst.'],
  tief: ['Achte auf den Zusammenhang: Was dich beschäftigt, hat oft eine ältere Wurzel als der heutige Anlass.', 'Schau genau hin, wo sich dieses Muster schon einmal gezeigt hat.'],
}

// ---- Umgang mit Herausforderungen (verändert die Schlussform) ----
export const COPING = [
  { key: 'schritt', label: 'Ein konkreter nächster Schritt', glyph: '👣' },
  { key: 'perspektive', label: 'Eine neue Perspektive', glyph: '🔭' },
  { key: 'zuspruch', label: 'Zuspruch und Entlastung', glyph: '🕊' },
  { key: 'nachdenken', label: 'Zeit zum eigenen Nachdenken', glyph: '🌙' },
]

const copingSaetze = {
  schritt: ['Dein kleiner Schritt für heute: Schreibe eine Sache auf, die du bereits entschieden hast.', 'Dein kleiner Schritt für heute: Erledige die eine Sache, die nur zwei Minuten braucht.'],
  perspektive: ['Wie sähe die Situation aus, wenn du sie nicht lösen müsstest, sondern nur beobachten dürftest?', 'Was würde ein Mensch sehen, der dich sehr mag und heute zum ersten Mal zuschaut?'],
  zuspruch: ['Du musst heute nicht weiter sein, als du gerade bist.', 'Es ist genug, dass du dir diesen Moment genommen hast.'],
  nachdenken: ['Lass die Frage heute offen. Vielleicht antwortet dein Tag darauf.', 'Du musst nichts festhalten – manche Gedanken sortieren sich über Nacht.'],
}

const pickN = (arr, n) => {
  const pool = [...arr]
  const out = []
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  return out
}

// Erzeugt eine personalisierte Botschaft im MESSAGES-Schema.
// styles: Kommunikationsstil-Keys (max 2) · coping: Schlussform-Key · ritual: eigenes Erlebnis je Weg.
export function generateMessage({ name = '', themes = [], mood = 3, ritual = 'wuerfel', styles = [], coping = null } = {}) {
  // Thema wählen: bevorzugt aus den gewählten, sonst zufällig
  const keys = (themes || []).map((t) => THEME_KEY[t]).filter(Boolean)
  const themeKey = keys.length ? pick(keys) : pick(Object.keys(themen))
  const thema = themen[themeKey]

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
  // Absatz 3 (optional): Stil-Färbung + Schlussform nach Umgangs-Präferenz
  const styleKey = (styles || []).length ? pick(styles) : null
  const closing = [
    styleKey && styleSaetze[styleKey] ? pick(styleSaetze[styleKey]) : null,
    coping && copingSaetze[coping] ? pick(copingSaetze[coping]) : null,
  ].filter(Boolean).join(' ')

  const base = {
    id: `gen-${Date.now()}`,
    title: pick(titelPool),
    constellation: thema.constellation,
    theme: thema.label,
    text: [p1, p2, closing].filter(Boolean).join('\n\n'),
    mantra: pick(mantras),
    luck: pick(glueckselemente),
    energy: pick(energien),
    reflection: pick(reflexionsfragen),
    ritual,
  }

  // Ritual-spezifisches Ergebnis (eigene Struktur je Weg)
  if (ritual === 'karten') {
    const card = pick(KARTEN)
    return {
      ...base,
      symbol: { glyph: card.glyph, name: card.title },
      title: card.title,
      card: { title: card.title, glyph: card.glyph, deutung: card.deutung, thema: card.thema },
    }
  }
  if (ritual === 'runen') {
    const drawn = pickN(RUNEN, 3).map((r, i) => ({ ...r, position: RUNEN_POSITIONEN[i] }))
    return {
      ...base,
      symbol: { glyph: drawn[1].glyph, name: drawn[1].name },
      runes: drawn,
    }
  }
  // Standard: Sternenwürfel mit Archetyp + kleiner Handlung
  const arch = pick(ARCHETYPEN)
  return {
    ...base,
    symbol: { glyph: arch.glyph, name: arch.name },
    archetype: { name: arch.name, glyph: arch.glyph, kern: arch.kern, impuls: arch.impuls },
  }
}

// „Dein erster Lichtpunkt" — Mini-Botschaft am Ende des Onboardings (Nutzen beweisen).
export function generateLichtpunkt({ name = '', mood = 3, themes = [], styles = [], coping = null } = {}) {
  const m = clampMood(mood)
  const trimmed = (name || '').trim()
  const keys = (themes || []).map((t) => THEME_KEY[t]).filter(Boolean)
  const thema = keys.length ? themen[pick(keys)] : null

  const moodLine = {
    5: 'Da ist heute viel Bewegung in dir – und sie sucht eine Richtung, keinen Druck.',
    4: 'Du wirkst wach und aufmerksam – ein guter Moment, um leise Dinge zu bemerken.',
    3: 'Du wirkst heute ruhig, aber suchend. Du möchtest Klarheit, ohne gedrängt zu werden.',
    2: 'Du bist heute eher leise unterwegs – das ist kein Mangel, sondern ein Tempo.',
    1: 'Heute darf es sanft sein. Du musst nichts leisten, um hier richtig zu sein.',
  }[m]

  const themaLine = thema ? ` ${pick(thema.saetze)}` : ''
  const closing = coping && copingSaetze[coping] ? ` ${pick(copingSaetze[coping])}` : ''
  const styleNote = (styles || []).map((s) => COMM_STYLES.find((c) => c.key === s)?.label.split(' ')[0].toLowerCase()).filter(Boolean).join(' und ')

  return {
    text: `${trimmed ? trimmed + ', d' : 'D'}${'as hier ist dein erster Lichtpunkt: '}${moodLine}${themaLine}${closing}`,
    styleNote: styleNote ? `So spricht Luna mit dir: ${styleNote} – und immer ohne Vorhersagen.` : 'So spricht Luna mit dir: warm, klar und ohne Vorhersagen.',
  }
}
