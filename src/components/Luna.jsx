// Luna — das Sternenwesen in 6 Zuständen.
// Lädt automatisch die passende optimierte Variante (opt/*-md|sm.webp):
// kleine Darstellungen (Avatare, Icons) → sm, große (Hero, Rituale) → md.
import { asset } from '../lib/asset.js'

const FILE = {
  idle: 'luna-idle-transparent',
  lauschen: 'luna-lauschen-transparent',
  offenbarung: 'luna-offenbarung-transparent',
  freude: 'luna-freude-transparent',
  schlaf: 'luna-schlaf-transparent',
  sehnsucht: 'luna-sehnsucht-transparent', // „Sie hat gewartet – ohne Vorwurf"
  icon: 'luna-icon-transparent',
}

const srcFor = (state, small) => asset(`uploads/opt/${FILE[state] || FILE.idle}-${small ? 'sm' : 'md'}.webp`)

const GLOW = {
  idle: 'rgba(166,107,255,.42)',
  lauschen: 'rgba(166,107,255,.5)',
  offenbarung: 'rgba(255,247,225,.7)',
  freude: 'rgba(232,199,122,.5)',
  schlaf: 'rgba(106,59,232,.3)',
  sehnsucht: 'rgba(166,107,255,.36)', // gedämpfter, lila-dominant (lt. Briefing)
  icon: 'rgba(166,107,255,.32)',
}

const SHADOW = {
  idle: 'drop-shadow(0 12px 24px rgba(106,59,232,.5))',
  lauschen: 'drop-shadow(0 14px 26px rgba(106,59,232,.55))',
  offenbarung: 'drop-shadow(0 0 30px rgba(232,199,122,.7))',
  freude: 'drop-shadow(0 12px 22px rgba(232,199,122,.5))',
  schlaf: 'drop-shadow(0 12px 22px rgba(106,59,232,.4))',
  sehnsucht: 'drop-shadow(0 12px 24px rgba(106,59,232,.45))',
  icon: 'drop-shadow(0 8px 22px rgba(106,59,232,.45))',
}

// Tempo je Zustand: schlafend atmet langsam, Freude ist lebhafter.
const TEMPO = {
  idle: 6,
  lauschen: 5.2,
  offenbarung: 4.2,
  freude: 3.6,
  schlaf: 8.5,
  sehnsucht: 7, // ruhig, geduldig wartend
  icon: 6,
}

// Funkelnde Sternchen um Luna (nur bei größeren Darstellungen)
const SPARKS = [
  { top: '6%', left: '10%', size: 13, delay: 0, dur: 3.1 },
  { top: '20%', right: '6%', size: 10, delay: 1.1, dur: 2.6 },
  { bottom: '14%', left: '4%', size: 9, delay: 1.9, dur: 3.5 },
]

// luna-sehnsucht-transparent.png ist hochgeladen und optimiert.
const SEHNSUCHT_VERFUEGBAR = true

// width: Zahl (px) oder CSS-String wie 'min(330px, 82vw)' für responsive Größen.
export default function Luna({
  state = 'idle',
  width = 180,
  glow = true,
  glowSize,
  float = true,
  burst = false,
  sparkle = true,
  alt = 'Luna',
  style = {},
}) {
  if (state === 'sehnsucht' && !SEHNSUCHT_VERFUEGBAR) state = 'idle'
  const numeric = typeof width === 'number'
  const small = numeric && width <= 120
  const gSize = glowSize || (numeric ? width * 1.25 : 220)
  const tempo = TEMPO[state] || 6
  const animate = !burst // burst hat eine eigene Animation (Feier)
  return (
    <div className="luna" style={{ display: 'flex', justifyContent: 'center', ...style }}>
      {glow && (
        <span
          className={'luna-glow' + (animate ? ' luna-glow--pulse' : '')}
          style={{
            width: gSize,
            height: gSize,
            top: -gSize * 0.06,
            background: `radial-gradient(circle, ${GLOW[state]}, transparent 65%)`,
            animationDuration: `${tempo}s`,
          }}
        />
      )}
      {sparkle && !small && animate && SPARKS.map((sp, i) => (
        <span key={i} className="luna-spark" aria-hidden="true"
          style={{
            top: sp.top, left: sp.left, right: sp.right, bottom: sp.bottom,
            fontSize: sp.size,
            animationDuration: `${sp.dur}s`,
            animationDelay: `${sp.delay}s`,
            color: i === 1 ? 'var(--purple-2)' : 'var(--gold-1)',
          }}>✦</span>
      ))}
      <span
        className={animate && float ? 'luna-sway' : undefined}
        style={{ position: 'relative', animationDuration: `${tempo * 1.3}s` }}
      >
        <img
          src={srcFor(state, small)}
          alt={alt}
          className={burst ? 'anim-burst' : animate ? 'luna-breath' : ''}
          style={{ width, height: 'auto', display: 'block', filter: SHADOW[state], animationDuration: burst ? undefined : `${tempo}s` }}
        />
      </span>
    </div>
  )
}

// Runder Avatar (Profil, Sprechblasen-Kopf) — immer kleine Variante
export function LunaAvatar({ size = 78, ring = true }) {
  return (
    <img
      src={srcFor('icon', true)}
      alt="Luna"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        border: ring ? '2px solid rgba(232,199,122,.45)' : 'none',
        boxShadow: '0 0 18px rgba(106,59,232,.5)',
      }}
    />
  )
}
