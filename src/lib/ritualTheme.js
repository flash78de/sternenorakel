// ============================================================
// Ritual-Farbwelten — jedes Ritual hat eine eigene, sofort
// erkennbare Tonlage (optische Führung statt Einheitslila):
//   Würfel  = Gold   (Handlung, Richtung, Wärme)
//   Karten  = Rosé   (Gefühl, Nähe, inneres Bild)
//   Runen   = Jade   (Erde, Zeit, Ruhe)
// Gold bleibt app-weit die EINE Aktionsfarbe (CTA) – die Ritual-
// Töne führen über Rahmen, Flächen und Leuchten, nicht über CTAs.
// ============================================================

export const RITUAL_THEME = {
  wuerfel: {
    key: 'wuerfel',
    name: 'Sternenwürfel',
    accent: '#E8C77A',
    deep: '#D9B45A',
    soft: 'rgba(232,199,122,.12)',
    softer: 'rgba(232,199,122,.06)',
    border: 'rgba(232,199,122,.45)',
    borderSoft: 'rgba(232,199,122,.22)',
    glow: 'rgba(232,199,122,.4)',
    // dezente Hintergrund-Färbung des Screens (oben eingeblendet)
    wash: 'radial-gradient(120% 55% at 50% -6%, rgba(232,199,122,.14), transparent 60%)',
    glyph: '⬡',
  },
  karten: {
    key: 'karten',
    name: 'Sternenkarten',
    accent: '#F2A0BC',
    deep: '#D97396',
    soft: 'rgba(242,160,188,.12)',
    softer: 'rgba(242,160,188,.06)',
    border: 'rgba(242,160,188,.45)',
    borderSoft: 'rgba(242,160,188,.22)',
    glow: 'rgba(242,160,188,.38)',
    wash: 'radial-gradient(120% 55% at 50% -6%, rgba(242,160,188,.13), transparent 60%)',
    glyph: '♥',
  },
  runen: {
    key: 'runen',
    name: 'Runen',
    accent: '#96D9B4',
    deep: '#5FBF8F',
    soft: 'rgba(150,217,180,.12)',
    softer: 'rgba(150,217,180,.06)',
    border: 'rgba(150,217,180,.45)',
    borderSoft: 'rgba(150,217,180,.22)',
    glow: 'rgba(150,217,180,.36)',
    wash: 'radial-gradient(120% 55% at 50% -6%, rgba(150,217,180,.12), transparent 60%)',
    glyph: 'ᚱ',
  },
}

export const ritualTheme = (key) => RITUAL_THEME[key] || RITUAL_THEME.wuerfel
