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
  icon: 'luna-icon-transparent',
}

const srcFor = (state, small) => asset(`uploads/opt/${FILE[state] || FILE.idle}-${small ? 'sm' : 'md'}.webp`)

const GLOW = {
  idle: 'rgba(166,107,255,.42)',
  lauschen: 'rgba(166,107,255,.5)',
  offenbarung: 'rgba(255,247,225,.7)',
  freude: 'rgba(232,199,122,.5)',
  schlaf: 'rgba(106,59,232,.3)',
  icon: 'rgba(166,107,255,.32)',
}

const SHADOW = {
  idle: 'drop-shadow(0 12px 24px rgba(106,59,232,.5))',
  lauschen: 'drop-shadow(0 14px 26px rgba(106,59,232,.55))',
  offenbarung: 'drop-shadow(0 0 30px rgba(232,199,122,.7))',
  freude: 'drop-shadow(0 12px 22px rgba(232,199,122,.5))',
  schlaf: 'drop-shadow(0 12px 22px rgba(106,59,232,.4))',
  icon: 'drop-shadow(0 8px 22px rgba(106,59,232,.45))',
}

// width: Zahl (px) oder CSS-String wie 'min(330px, 82vw)' für responsive Größen.
export default function Luna({
  state = 'idle',
  width = 180,
  glow = true,
  glowSize,
  float = true,
  burst = false,
  alt = 'Luna',
  style = {},
}) {
  const numeric = typeof width === 'number'
  const small = numeric && width <= 120
  const gSize = glowSize || (numeric ? width * 1.25 : 220)
  return (
    <div className="luna" style={{ display: 'flex', justifyContent: 'center', ...style }}>
      {glow && (
        <span
          className="luna-glow"
          style={{
            width: gSize,
            height: gSize,
            top: -gSize * 0.06,
            background: `radial-gradient(circle, ${GLOW[state]}, transparent 65%)`,
          }}
        />
      )}
      <img
        src={srcFor(state, small)}
        alt={alt}
        className={burst ? 'anim-burst' : float ? 'anim-float' : ''}
        style={{ width, height: 'auto', position: 'relative', filter: SHADOW[state] }}
      />
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
