import { CHAKREN } from '../data/chakren.js'

// Meditierende Figur (Frontalansicht, Lotussitz) mit den sieben
// Chakren-Punkten an der Körpermitte – zeigt, WO welches Chakra liegt.
// aktiv: hervorgehobene Station · onSelect: Punkte antippbar (optional)
// Basis ist Marcels Illustration (docs/chakra/figur-original.png),
// die Punkte liegen als SVG-Overlay darüber.

// Punkt-Positionen entlang der Mittelachse (Bild 814 × 934)
const POS = {
  1: 805, // Wurzel – Beckenboden / Sitzbasis
  2: 700, // Sakral – unter dem Nabel
  3: 575, // Solarplexus
  4: 470, // Herz
  5: 288, // Hals
  6: 172, // Stirn
  7: 30, // Krone – am Scheitel
}

export default function ChakraFigur({ aktiv = null, onSelect = null, width = 210 }) {
  return (
    <svg viewBox="0 0 814 934" width={width} height={(width / 814) * 934} role="img"
      aria-label="Sitzende Figur mit den sieben Chakren-Punkten">
      <defs>
        <radialGradient id="cf-aura" cx="50%" cy="48%" r="60%">
          <stop offset="0%" stopColor="rgba(106,59,232,.28)" />
          <stop offset="100%" stopColor="rgba(106,59,232,0)" />
        </radialGradient>
      </defs>

      {/* Aura */}
      <ellipse cx="407" cy="490" rx="395" ry="435" fill="url(#cf-aura)" />

      {/* Figur */}
      <image href="uploads/opt/chakra-figur.webp" x="0" y="0" width="814" height="934" />

      {/* Chakren-Punkte */}
      {CHAKREN.map((c) => {
        const y = POS[c.n]
        const ist = aktiv === c.n
        return (
          <g key={c.n} onClick={onSelect ? () => onSelect(c.n) : undefined}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            {/* Halo (beim aktiven Punkt pulsierend) */}
            <circle cx="407" cy={y} r={ist ? 52 : 40} fill={c.farbe} opacity={ist ? 0.35 : 0.16}>
              {ist && <animate attributeName="r" values="44;60;44" dur="2.4s" repeatCount="indefinite" />}
            </circle>
            <circle cx="407" cy={y} r={ist ? 28 : 22} fill={c.farbe}
              stroke={ist ? '#fff' : 'rgba(255,255,255,.55)'} strokeWidth={ist ? 6 : 3} />
            {/* Nummer daneben (dezent) */}
            <text x="480" y={y + 13} fontSize="36" fontWeight="600"
              fill={ist ? c.farbe : 'rgba(182,176,206,.6)'} style={{ fontFamily: 'var(--font-body)' }}>
              {c.n}
            </text>
            {/* größere unsichtbare Tippfläche */}
            {onSelect && <circle cx="407" cy={y} r="61" fill="transparent" />}
          </g>
        )
      })}
    </svg>
  )
}
