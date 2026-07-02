import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

// Abendmodus / Tagesabschluss — ruhiger, dunkler, weniger Gold.
export default function Abend() {
  const nav = useNavigate()
  const { stats, profile } = useStore()

  return (
    <div className="center-col" style={{ padding: '34px 30px', background: 'radial-gradient(320px 320px at 50% 30%, rgba(106,59,232,.18), transparent 70%)' }}>
      <Luna state="schlaf" width="min(240px, 62vw)" glowSize={270} float />
      <div className="h-serif" style={{ fontWeight: 600, fontSize: 24, marginTop: 10, textAlign: 'center', color: 'var(--text)' }}>
        Dein heutiger Stern ruht.
      </div>
      <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 13.5px/1.6 var(--font-body)', textAlign: 'center', maxWidth: 280 }}>
        Danke, dass du dir heute einen Moment genommen hast{profile.name ? `, ${profile.name}` : ''}. Morgen wartet ein neuer Lichtpunkt auf dich.
      </div>
      {stats.streak > 0 && (
        <div style={{ marginTop: 14, color: 'var(--purple-2)', font: '600 12px var(--font-body)' }}>
          ✦ Dein Sternenband: {stats.streak} {stats.streak === 1 ? 'Tag' : 'Tage'} in Folge
        </div>
      )}
      <button className="btn-ghost" style={{ marginTop: 26, width: 'auto', padding: '13px 28px' }} onClick={() => nav('/dashboard', { replace: true })}>
        ☾ Bis morgen, Luna
      </button>
    </div>
  )
}
