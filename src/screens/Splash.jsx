import { useEffect } from 'react'
import { asset } from '../lib/asset.js'

// 01 · App-Start „Luna erwacht" — nur beim echten Start, in den Einstellungen abschaltbar.
// Das Bild trägt Titel & Schriftzug bereits; wir zeigen es kurz und blenden dann über.
export default function Splash({ onDone }) {
  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(onDone, reduced ? 800 : 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="phone">
      <div className="screen" style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={asset('uploads/luna-erwacht.png')}
          alt="Luna erwacht … Sternenorakel"
          className="fade-up"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="dots" style={{ position: 'absolute', bottom: 30, left: 0, right: 0, justifyContent: 'center' }}>
          <span style={{ background: '#E8C77A' }} />
          <span style={{ background: '#A66BFF', animationDelay: '.3s' }} />
          <span style={{ background: '#E8C77A', animationDelay: '.6s' }} />
        </div>
      </div>
    </div>
  )
}
