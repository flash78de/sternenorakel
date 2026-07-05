import { CHAKREN } from '../data/chakren.js'

// Sitzende Silhouette (Frontalansicht, Meditationssitz) mit den sieben
// Chakren-Punkten an der Körpermitte – zeigt, WO welches Chakra liegt.
// aktiv: hervorgehobene Station · onSelect: Punkte antippbar (optional)
// Bewusst stilisiert (Formen + Glow) statt anatomisch – passt zur App-Welt.

// Punkt-Positionen entlang der Mittelachse (viewBox 0 0 200 236)
const POS = {
  1: 176, // Wurzel – Beckenboden / Sitzbasis
  2: 148, // Sakral – unter dem Nabel
  3: 124, // Solarplexus
  4: 98, // Herz
  5: 72, // Hals
  6: 42, // Stirn
  7: 14, // Krone – über dem Scheitel
}

export default function ChakraFigur({ aktiv = null, onSelect = null, width = 210 }) {
  return (
    <svg viewBox="0 0 200 236" width={width} height={(width / 200) * 236} role="img"
      aria-label="Sitzende Figur mit den sieben Chakren-Punkten">
      <defs>
        <radialGradient id="cf-aura" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="rgba(106,59,232,.30)" />
          <stop offset="100%" stopColor="rgba(106,59,232,0)" />
        </radialGradient>
        <linearGradient id="cf-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#413363" />
          <stop offset="100%" stopColor="#241c3c" />
        </linearGradient>
      </defs>

      {/* Aura */}
      <ellipse cx="100" cy="112" rx="92" ry="106" fill="url(#cf-aura)" />

      {/* Kopf */}
      <circle cx="100" cy="42" r="20" fill="url(#cf-body)" stroke="rgba(232,199,122,.55)" strokeWidth="1.2" />
      {/* Rumpf */}
      <path
        d="M100 60 C 76 60 64 76 62 98 C 60 122 65 146 74 162 L 126 162 C 135 146 140 122 138 98 C 136 76 124 60 100 60 Z"
        fill="url(#cf-body)" stroke="rgba(232,199,122,.55)" strokeWidth="1.2" />
      {/* Arme: locker auf den Knien */}
      <path d="M66 84 C 48 102 40 134 44 164 C 45 174 56 176 60 168 C 58 140 64 114 76 96 Z"
        fill="url(#cf-body)" stroke="rgba(232,199,122,.4)" strokeWidth="1.1" />
      <path d="M134 84 C 152 102 160 134 156 164 C 155 174 144 176 140 168 C 142 140 136 114 124 96 Z"
        fill="url(#cf-body)" stroke="rgba(232,199,122,.4)" strokeWidth="1.1" />
      {/* Gekreuzte Beine / Sitzbasis */}
      <path
        d="M34 196 C 40 172 66 158 100 158 C 134 158 160 172 166 196 C 169 206 162 213 150 213 L 50 213 C 38 213 31 206 34 196 Z"
        fill="url(#cf-body)" stroke="rgba(232,199,122,.55)" strokeWidth="1.2" />
      {/* Hände */}
      <circle cx="56" cy="170" r="7" fill="#241c3c" stroke="rgba(232,199,122,.3)" strokeWidth="1" />
      <circle cx="144" cy="170" r="7" fill="#241c3c" stroke="rgba(232,199,122,.3)" strokeWidth="1" />

      {/* Chakren-Punkte */}
      {CHAKREN.map((c) => {
        const y = POS[c.n]
        const ist = aktiv === c.n
        return (
          <g key={c.n} onClick={onSelect ? () => onSelect(c.n) : undefined}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            {/* Halo (beim aktiven Punkt pulsierend) */}
            <circle cx="100" cy={y} r={ist ? 13 : 10} fill={c.farbe} opacity={ist ? 0.35 : 0.16}>
              {ist && <animate attributeName="r" values="11;15;11" dur="2.4s" repeatCount="indefinite" />}
            </circle>
            <circle cx="100" cy={y} r={ist ? 7 : 5.5} fill={c.farbe}
              stroke={ist ? '#fff' : 'rgba(255,255,255,.55)'} strokeWidth={ist ? 1.6 : 0.8} />
            {/* Nummer daneben (dezent) */}
            <text x="121" y={y + 3.5} fontSize="9" fontWeight="600"
              fill={ist ? c.farbe : 'rgba(182,176,206,.55)'} style={{ fontFamily: 'var(--font-body)' }}>
              {c.n}
            </text>
            {/* größere unsichtbare Tippfläche */}
            {onSelect && <circle cx="100" cy={y} r="15" fill="transparent" />}
          </g>
        )
      })}
    </svg>
  )
}
