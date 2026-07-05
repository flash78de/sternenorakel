import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { asset } from '../lib/asset.js'
import { buzz } from '../lib/haptics.js'
import { CHAKREN, CHAKREN_INTRO, chakraBild } from '../data/chakren.js'
import { payConfig, createPayOrder, capturePayOrder, loadPayPalSdk } from '../lib/plus.js'

// Reisen-Übersicht: geführte Mehr-Stationen-Programme.
// Zugang zur Chakren-Reise: Plus ODER Einmalkauf (9,99 €, gehört dir dann
// dauerhaft). Station 1 ist für alle frei. Stationen öffnen sich der Reihe nach.
export default function Reisen() {
  const nav = useNavigate()
  const { settings, reisen, updateSettings } = useStore()
  const zugang = settings.premium || settings.chakrenOwned
  const done = reisen.chakren.done || []
  const complete = done.length >= 7
  const next = CHAKREN.find((c) => !done.includes(c.n))?.n ?? 7
  // Eine Station pro Tag: nach einer vollendeten Station öffnet die nächste erst morgen
  const heute = new Date().toISOString().slice(0, 10)
  const dayLocked = reisen.chakren.lastDoneISO === heute && !complete

  // Einmalkauf über PayPal (erscheint, sobald die Zahlung eingerichtet ist)
  const [pay, setPay] = useState({ configured: false })
  const [payMsg, setPayMsg] = useState('')
  const [gekauft, setGekauft] = useState(false)
  const paypalRef = useRef(null)
  useEffect(() => {
    if (!zugang) payConfig().then(setPay).catch(() => {})
  }, [zugang])
  useEffect(() => {
    if (!pay.configured || !pay.clientId || zugang || !paypalRef.current) return
    let cancelled = false
    loadPayPalSdk(pay.clientId)
      .then((paypal) => {
        if (cancelled || !paypalRef.current) return
        paypalRef.current.innerHTML = ''
        paypal.Buttons({
          style: { layout: 'horizontal', color: 'gold', height: 42, label: 'paypal', tagline: false },
          createOrder: () => createPayOrder('chakren'),
          onApprove: async (data) => {
            try {
              await capturePayOrder(data.orderID)
              updateSettings({ chakrenOwned: true })
              setGekauft(true)
              buzz([20, 30, 20])
            } catch (e) {
              setPayMsg(e.message || 'Zahlung nicht bestätigt – du wurdest nicht freigeschaltet.')
            }
          },
          onError: () => setPayMsg('PayPal hat gerade ein Problem – versuche es später erneut.'),
        }).render(paypalRef.current)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [pay, zugang]) // eslint-disable-line

  const open = (n) => {
    if (done.includes(n)) return nav(`/reisen/chakren/${n}`)
    const unlocked = zugang || n === 1
    if (unlocked && n === next && !dayLocked) nav(`/reisen/chakren/${n}`)
  }

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/oracle')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Reisen</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <Luna state="offenbarung" width={100} glowSize={130} float />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 25, color: 'var(--gold-1)', marginTop: 4, textShadow: '0 2px 16px rgba(232,199,122,.4)' }}>
          Die Chakren-Reise
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.55 var(--font-body)', marginTop: 6 }}>
          Sieben Stationen, sieben Lebensbereiche – eine Station pro Tag.
        </div>
        <button onClick={() => nav('/wissen/chakren')} className="link-soft" style={{ marginTop: 6, fontSize: 11.5 }}>
          Was sind Chakren? · Mehr im Wissen ›
        </button>
      </div>

      {/* Geführte Chakren-Meditation: prominent oben (Audio folgt) */}
      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', borderRadius: 15, padding: '12px 14px', background: 'linear-gradient(150deg,rgba(166,107,255,.14),rgba(232,199,122,.08))', border: '1px solid rgba(232,199,122,.3)' }}>
        <span style={{ fontSize: 20 }}>🎧</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', color: 'var(--text)', font: '600 13px var(--font-body)' }}>Chakren-Meditation · geführt</span>
          <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 11px/1.4 var(--font-body)', marginTop: 1 }}>
            Eine gesprochene Reise durch alle sieben Stationen – zum Zurücklehnen.
          </span>
        </span>
        <span style={{ color: 'var(--gold-1)', font: '600 9.5px var(--font-body)', letterSpacing: 0.8, textTransform: 'uppercase', border: '1px solid rgba(232,199,122,.4)', borderRadius: 999, padding: '3px 8px', flexShrink: 0 }}>in Kürze</span>
      </div>

      {/* Ehrliche Rahmung – derselbe Geist wie der Barnum-Hinweis */}
      <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '10px 12px' }}>
        <span style={{ color: '#7a7494', fontSize: 13 }}>ⓘ</span>
        <div style={{ color: '#9a93b8', font: '400 11px/1.5 var(--font-body)' }}>{CHAKREN_INTRO}</div>
      </div>

      {gekauft && (
        <div className="banner pop" style={{ marginTop: 10 }}>
          <Luna state="freude" width={44} glow={false} float={false} />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--gold-1)', font: '700 13px var(--font-body)' }}>Zahlung bestätigt ✓ Die Reise gehört dir.</div>
            <div style={{ color: 'var(--text-dim)', font: '500 11px var(--font-body)', marginTop: 1 }}>Dauerhaft freigeschaltet – keine Folgekosten.</div>
          </div>
        </div>
      )}

      {/* Fortschritt */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.1)' }}>
          <div style={{ width: `${(done.length / 7) * 100}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#E8C77A,#A66BFF)', transition: 'width .6s ease' }} />
        </div>
        <span style={{ color: 'var(--text-dim)', font: '600 12px var(--font-body)' }}>{done.length}/7</span>
      </div>
      {complete && (
        <div style={{ marginTop: 8, textAlign: 'center', color: 'var(--gold-1)', font: '600 12.5px var(--font-body)' }}>
          ✦ Reise vollendet – jede Station bleibt für dich geöffnet.
        </div>
      )}
      {dayLocked && (
        <div style={{ marginTop: 8, textAlign: 'center', color: 'var(--text-dim)', font: '500 11.5px/1.5 var(--font-body)' }}>
          ☾ Schön, dass du heute hier warst. Deine nächste Station öffnet sich morgen.
        </div>
      )}

      {/* Stationen */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {CHAKREN.map((c) => {
          const isDone = done.includes(c.n)
          const unlocked = zugang || c.n === 1
          const inOrder = c.n === next
          const openable = isDone || (unlocked && inOrder && !dayLocked)
          return (
            <button key={c.n} onClick={() => open(c.n)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: openable ? 'pointer' : 'default',
                borderRadius: 15, padding: '10px 13px',
                background: isDone ? 'rgba(232,199,122,.08)' : 'rgba(255,255,255,.04)',
                border: `1px solid ${isDone ? 'rgba(232,199,122,.35)' : 'rgba(255,255,255,.1)'}`,
                opacity: openable || !unlocked ? 1 : 0.55,
              }}>
              <img src={asset(chakraBild(c.n, 'sm'))} alt={c.dt}
                style={{ width: 40, height: 'auto', borderRadius: 6, flexShrink: 0, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.4))' }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', color: 'var(--text)', font: '600 13px var(--font-body)' }}>
                  {c.n} · {c.dt}
                </span>
                <span style={{ display: 'block', color: 'var(--text-dim)', font: '400 11px/1.4 var(--font-body)', marginTop: 1 }}>
                  „{c.wort}“ · {c.thema}
                </span>
              </span>
              <span style={{ flexShrink: 0, font: '600 12px var(--font-body)', color: isDone ? 'var(--gold-1)' : !unlocked ? 'var(--gold-1)' : inOrder ? (dayLocked ? '#7a7494' : 'var(--purple-2)') : '#7a7494' }}>
                {isDone ? '✓' : !unlocked ? '🔒' : inOrder ? (dayLocked ? '☾ morgen' : c.n === 1 && !zugang ? 'Kostprobe ›' : 'Öffnen ›') : '· · ·'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Zugang: Einmalkauf ODER Plus */}
      {!zugang && (
        <div className="glass" style={{ marginTop: 14, padding: '14px 15px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text)', font: '600 13.5px var(--font-body)' }}>
            Die ganze Reise freischalten
          </div>
          <div style={{ color: 'var(--text-dim)', font: '400 11.5px/1.5 var(--font-body)', marginTop: 4 }}>
            Einmal <b style={{ color: 'var(--gold-1)' }}>9,99 €</b> – gehört dir dann dauerhaft, keine Folgekosten.
            <br />Oder in <b style={{ color: 'var(--gold-1)' }}>✦ Plus</b> enthalten.
          </div>
          {pay.configured ? (
            <div ref={paypalRef} style={{ marginTop: 10 }} />
          ) : (
            <div style={{ marginTop: 8, color: '#7a7494', font: '400 10.5px/1.5 var(--font-body)' }}>
              PayPal-Zahlung wird gerade eingerichtet – solange öffnet ein Gutschein-Code oder Plus die Reise.
            </div>
          )}
          {payMsg && <div style={{ marginTop: 8, color: 'var(--danger)', font: '500 11.5px var(--font-body)' }}>{payMsg}</div>}
          <button className="btn-gold" style={{ marginTop: 10 }} onClick={() => nav('/profil/plus')}>
            ✦ Plus ansehen
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10px/1.5 var(--font-body)', marginTop: 12 }}>
        Symbolsprache, keine Heilslehre – nimm mit, was dir guttut.
      </div>
    </div>
  )
}
