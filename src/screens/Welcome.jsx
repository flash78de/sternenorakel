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
        <Luna state="idle" width={208} glowSize={230} style={{ marginBottom: 6 }} />
        <div className="title-xl">Sternenorakel</div>

        <div className="bubble" style={{ marginTop: 18 }}>
          „Hallo, ich bin <b>Luna</b>. Schön, dass du den Weg zu mir gefunden hast."
        </div>
        <div className="subtle" style={{ marginTop: 14 }}>
          Jeden Tag schenke ich dir eine kleine Botschaft – einen Moment, ganz für dich.
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
