import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'

export default function Welcome() {
  const nav = useNavigate()
  return (
    <>
      <div className="statusbar">
        <span>9:41</span>
        <span className="glyphs">☾ ✦</span>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8px 30px 34px',
        }}
      >
        <Luna state="idle" width="min(230px, 60vw)" glowSize={260} style={{ marginBottom: 6 }} />
        <div className="title-xl">Sternenorakel</div>
        <div style={{ marginTop: 6, color: 'var(--purple-2)', font: '600 12.5px var(--font-body)', letterSpacing: 0.3 }}>
          Heute ein Lichtpunkt. Mit der Zeit dein Sternbild.
        </div>

        <div className="bubble" style={{ marginTop: 16 }}>
          „Hallo, ich bin <b>Luna</b>. Ich sage dir nicht voraus, was passieren wird. Ich helfe dir, einen Gedanken zu hören, der im Alltag vielleicht zu leise ist."
        </div>

        <div style={{ flex: 1 }} />

        <button className="btn-gold" onClick={() => nav('/onboarding')}>
          Mit Luna beginnen
        </button>
        <button className="link-soft" style={{ marginTop: 14 }} onClick={() => nav('/auth')}>
          Ich habe schon ein <b>Sternenband</b>
        </button>
      </div>
    </>
  )
}
