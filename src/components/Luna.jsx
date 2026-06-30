// Luna — das Sternenwesen in 6 Zuständen.
// Jeder Zustand verweist auf die echte transparente Art (Dark-First).

const SRC = {
  idle: '/uploads/luna-idle-transparent.png',
  lauschen: '/uploads/luna-lauschen-transparent.png',
  offenbarung: '/uploads/luna-offenbarung-transparent.png',
  freude: '/uploads/luna-freude-transparent.png',
  schlaf: '/uploads/luna-schlaf-transparent.png',
  icon: '/uploads/luna-icon-transparent.png',
}

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
  const gSize = glowSize || width * 1.25
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
        src={SRC[state]}
        alt={alt}
        className={burst ? 'anim-burst' : float ? 'anim-float' : ''}
        style={{ width, height: 'auto', position: 'relative', filter: SHADOW[state] }}
      />
    </div>
  )
}

// Runder Avatar (Profil, Sprechblasen-Kopf)
export function LunaAvatar({ size = 78, ring = true }) {
  return (
    <img
      src={SRC.icon}
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
