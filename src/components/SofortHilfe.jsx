import { useState } from 'react'

// Sofort-Hilfe: goldener Pillen-Knopf + Vorschau-Modal der kommenden Inhalte.
// Wird überall eingesetzt, wo Nutzerinnen in einem schweren Moment landen
// könnten (Dashboard, Luna-Screen). Die echten Übungen folgen in Kürze –
// die Telefonseelsorge-Nummer steht jetzt schon drin.

export default function SofortHilfe({ style }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Sofort-Hilfe"
        style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', borderRadius: 999, border: '1px solid rgba(232,199,122,.4)', background: 'rgba(232,199,122,.1)', color: 'var(--gold-1)', font: '650 11px var(--font-body)', cursor: 'pointer', ...style }}>
        ✦ Sofort-Hilfe
      </button>

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()} style={{ paddingTop: 22 }}>
            <div className="title-lg" style={{ fontSize: 19, color: 'var(--text)', textAlign: 'center' }}>✦ Sofort-Hilfe</div>
            <div style={{ color: 'var(--text-dim)', font: '400 12px/1.55 var(--font-body)', marginTop: 8, textAlign: 'center' }}>
              Luna lernt gerade, dich zu halten – diese Momente kommen in Kürze:
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                ['🌊', 'Zur Ruhe kommen', 'geführter Atemkreis bei Unruhe & Stress'],
                ['🌙', 'Gedanken loslassen', 'Meditation & Grounding bei Grübeln und zum Einschlafen'],
                ['⭐', 'Stärke sammeln', '90 Sekunden Mut – vor Prüfung, Gespräch oder großem Moment'],
              ].map(([g, t, d]) => (
                <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '10px 12px' }}>
                  <span style={{ fontSize: 16 }}>{g}</span>
                  <span style={{ flex: 1 }}>
                    <b style={{ display: 'block', color: 'var(--text)', font: '600 12.5px var(--font-body)' }}>{t}</b>
                    <span style={{ color: 'var(--text-dim)', font: '400 11px/1.4 var(--font-body)' }}>{d}</span>
                  </span>
                  <span style={{ color: 'var(--gold-1)', font: '600 9.5px var(--font-body)', letterSpacing: 0.8, textTransform: 'uppercase', border: '1px solid rgba(232,199,122,.4)', borderRadius: 999, padding: '2px 7px', flexShrink: 0 }}>in Kürze</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, color: '#7a7494', font: '400 10.5px/1.5 var(--font-body)', textAlign: 'center' }}>
              Wenn es dir gerade ernsthaft nicht gut geht: Telefonseelsorge <b style={{ color: 'var(--text-dim)' }}>0800 111 0 111</b> – kostenlos, rund um die Uhr.
            </div>
            <button className="btn-gold" style={{ marginTop: 14 }} onClick={() => setOpen(false)}>Alles klar ✦</button>
          </div>
        </div>
      )}
    </>
  )
}
