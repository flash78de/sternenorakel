import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'

// 23 · Rückkehr nach Pause — „Schön, dass du wieder da bist" (kein Scham, weicher Neustart)
export default function Rueckkehr() {
  const nav = useNavigate()
  const { stats, markReturnSeen } = useStore()

  const go = (to) => {
    markReturnSeen()
    nav(to, { replace: true })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 26px 26px', textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <Luna state="idle" width="min(225px, 58vw)" glowSize={255} float />
        <span style={{ position: 'absolute', top: 24, right: 54, fontSize: 22 }}>💜</span>
      </div>

      <div className="h-serif" style={{ fontWeight: 600, fontSize: 24, color: 'var(--gold-1)', marginTop: 6, lineHeight: 1.3 }}>
        Schön, dass du<br />wieder da bist.
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 14px/1.6 var(--font-body)', marginTop: 12, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
        Kein Stern zählt nach, wie lange du fort warst. Wir beginnen einfach neu –
        heute ist ein guter Tag dafür.
      </div>

      {/* pausierte Serie */}
      <div className="glass" style={{ marginTop: 20, padding: '14px 16px', textAlign: 'left' }}>
        <div style={{ color: 'var(--gold-1)', font: '600 11px var(--font-body)', marginBottom: 6 }}>Deine Serie ruht gerade</div>
        <div className="streak-row">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d, i) => (
            <div key={d} className="streak-day">
              <span className={'star' + (i < Math.min(stats.streak, 3) ? '' : ' off')}>★</span>
              <label>{d}</label>
            </div>
          ))}
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 11px var(--font-body)', marginTop: 8 }}>
          Du kannst heute ganz neu beginnen – Luna wartet nicht mit erhobenem Zeigefinger, sondern mit offenen Armen.
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 12 }} />
      <button className="btn-gold" onClick={() => go('/oracle')}>✦ Heute neu beginnen</button>
      <button className="link-soft" style={{ marginTop: 14 }} onClick={() => go('/dashboard')}>Später</button>
    </div>
  )
}
