import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { buzz } from '../lib/haptics.js'
import { formatDate } from '../data/library.js'
import { redeemCoupon, payConfig, createPayOrder, capturePayOrder, loadPayPalSdk, bisDatum } from '../lib/plus.js'

// Free-vs-Plus auf einen Blick (Conversion: Wert sofort sichtbar machen).
// Nur echte, vorhandene Funktionen – keine Versprechen, die die App nicht hält.
const COMPARE = [
  { f: 'Tagesbotschaft & Tagebuch', free: true, plus: true },
  { f: 'Sternenwürfel-Ritual', free: true, plus: true },
  { f: 'Sternenstaub, Ränge & Sternbilder', free: true, plus: true },
  { f: 'KI-Botschaften', free: '7 Sterntage', plus: 'unbegrenzt' },
  { f: 'Sternenkarten & Runen', free: false, plus: true },
  { f: 'Freie Impulse (mehrfach ziehen)', free: false, plus: true },
  { f: 'Monatsbild mit Lunas Rückblick', free: false, plus: true },
  { f: 'Gesprochene Botschaften', free: false, plus: true },
]

// Nur echte, vorhandene Vorteile – keine Versprechen, die die App (noch) nicht hält.
const BENEFITS = [
  { t: 'Alle drei Rituale', d: 'Sternenkarten und Runen zusätzlich zum Sternenwürfel – jede mit eigener Deutungswelt.' },
  { t: 'Freie Impulse', d: 'Zieh zusätzlich zur Tagesbotschaft, wann immer du einen Impuls brauchst.' },
  { t: 'Dein Monatsbild', d: 'Stimmungsverlauf, wiederkehrende Themen und Worte über Wochen – mit Lunas Rückblick.' },
  { t: 'KI-Botschaften ohne Begrenzung', d: 'Luna formuliert jede Botschaft live für dich – auch nach den 7 kostenlosen Sterntagen.' },
  { t: 'Gesprochene Botschaften', d: 'Luna liest dir deine Botschaft vor – zum Zurücklehnen und Nachklingenlassen.' },
]

// Konfetti wie auf dem Feier-Screen (deterministische Positionen)
const PARTS = [
  { left: '8%', delay: 0, size: 14 }, { left: '22%', delay: 1.2, size: 10 },
  { left: '38%', delay: 0.5, size: 13 }, { left: '55%', delay: 1.7, size: 11 },
  { left: '70%', delay: 0.3, size: 15 }, { left: '85%', delay: 0.9, size: 11 },
]

export default function PlusDetail() {
  const nav = useNavigate()
  const { settings, updateSettings } = useStore()
  const active = settings.premium
  // Direkt nach der Aktivierung: eigener Erfolgs-Moment statt Scroll-Gymnastik
  const [justActivated, setJustActivated] = useState(null) // {until, quelle}

  // Gutschein-Einlösung
  const [couponOpen, setCouponOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponBusy, setCouponBusy] = useState(false)
  const [couponMsg, setCouponMsg] = useState('')

  // PayPal (erscheint erst, wenn serverseitig eingerichtet)
  const [pay, setPay] = useState({ configured: false })
  const [payMsg, setPayMsg] = useState('')
  const paypalRef = useRef(null)

  useEffect(() => {
    payConfig().then(setPay).catch(() => {})
  }, [])

  // Plus gutschreiben: verlängert ab heute bzw. ab aktuellem Ablaufdatum
  const grantPlus = (days, source) => {
    const today = formatDate().iso
    const base = settings.premium && settings.plusUntilISO && settings.plusUntilISO >= today
      ? new Date(settings.plusUntilISO + 'T12:00').getTime()
      : Date.now()
    const until = new Date(base + days * 86400000).toISOString().slice(0, 10)
    updateSettings({ premium: true, plusSource: source, plusUntilISO: until, plusExpiredSeenISO: null })
    setJustActivated({ until, quelle: source })
    buzz([20, 30, 20])
    return until
  }

  const startTrial = () => {
    updateSettings({ trialUsedISO: formatDate().iso })
    grantPlus(7, 'trial')
  }

  const submitCoupon = async () => {
    if (couponBusy || !couponCode.trim()) return
    setCouponBusy(true)
    setCouponMsg('')
    try {
      const { days } = await redeemCoupon(couponCode)
      grantPlus(days, 'coupon')
    } catch (e) {
      setCouponMsg(e.message)
    } finally {
      setCouponBusy(false)
    }
  }

  // PayPal-Buttons rendern, sobald konfiguriert (Einmalzahlung, kein Abo)
  useEffect(() => {
    if (!pay.configured || !pay.clientId || active || justActivated || !paypalRef.current) return
    let cancelled = false
    loadPayPalSdk(pay.clientId)
      .then((paypal) => {
        if (cancelled || !paypalRef.current) return
        paypalRef.current.innerHTML = ''
        for (const plan of ['monat', 'jahr']) {
          const host = document.createElement('div')
          host.style.marginTop = '8px'
          paypalRef.current.appendChild(host)
          paypal.Buttons({
            style: { layout: 'horizontal', color: 'gold', height: 42, label: 'paypal', tagline: false },
            createOrder: () => createPayOrder(plan),
            onApprove: async (data) => {
              try {
                const grant = await capturePayOrder(data.orderID)
                grantPlus(grant.days, 'paypal')
              } catch (e) {
                setPayMsg(e.message || 'Zahlung nicht bestätigt – du wurdest nicht freigeschaltet.')
              }
            },
            onError: () => setPayMsg('PayPal hat gerade ein Problem – versuche es später oder nutze einen Gutschein.'),
          }).render(host)
        }
      })
      .catch(() => setPayMsg('PayPal ließ sich nicht laden.'))
    return () => {
      cancelled = true
    }
  }, [pay, active, justActivated]) // eslint-disable-line

  if (justActivated)
    return (
      <div className="center-col" style={{ flex: 1, padding: '30px 26px', position: 'relative', overflow: 'hidden' }}>
        <div className="anim-burst" style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg at 50% 38%,transparent 0deg,rgba(232,199,122,.12) 12deg,transparent 24deg,rgba(232,199,122,.1) 48deg,transparent 72deg,rgba(232,199,122,.12) 84deg,transparent 96deg)' }} />
        {PARTS.map((p, i) => (
          <span key={i} className="feier-part" aria-hidden="true" style={{ left: p.left, fontSize: p.size, animationDelay: `${p.delay}s`, color: i % 2 ? 'var(--purple-2)' : 'var(--gold-1)' }}>
            {i % 2 ? '✧' : '✦'}
          </span>
        ))}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ color: 'var(--gold-1)', font: '600 12px var(--font-body)', letterSpacing: 2, textTransform: 'uppercase' }}>
            {justActivated.quelle === 'paypal' ? 'Zahlung bestätigt · Plus aktiviert ✦' : justActivated.quelle === 'coupon' ? 'Gutschein eingelöst ✦' : 'Plus aktiviert ✦'}
          </div>
          <Luna state="freude" width="min(200px, 52vw)" glowSize={230} burst style={{ marginTop: 10 }} />
          <div className="pop" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 25, color: 'var(--gold-1)', marginTop: 8, textShadow: '0 2px 18px rgba(232,199,122,.45)' }}>
            Alle Sterne stehen<br />dir jetzt offen.
          </div>
          <div style={{ color: 'var(--text)', font: '400 13.5px/1.7 var(--font-body)', marginTop: 12, maxWidth: 280 }}>
            ✦ Sternenkarten &amp; Runen freigeschaltet<br />
            ✦ Freie Impulse, wann du magst<br />
            ✦ Plus gilt bis <b style={{ color: 'var(--gold-1)' }}>{bisDatum(justActivated.until)}</b>
          </div>
          <button className="btn-gold" style={{ marginTop: 24, width: 'auto', padding: '15px 28px' }} onClick={() => nav('/oracle', { replace: true })}>
            ✦ Zum Orakel – Karten &amp; Runen entdecken
          </button>
          <button className="link-soft" style={{ marginTop: 14, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} onClick={() => nav('/dashboard', { replace: true })}>
            Später · zum Start
          </button>
        </div>
      </div>
    )

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Sternenluna Plus</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Luna state="freude" width={130} glowSize={160} float />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 26, color: 'var(--gold-1)', marginTop: 6, textShadow: '0 2px 16px rgba(232,199,122,.4)' }}>
          Mehr Tiefe. Mehr Luna.
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 13px/1.55 var(--font-body)', marginTop: 8 }}>
          Erkenne über Wochen, welche Themen, Gefühle und Entscheidungen sich in deinem Leben wiederholen.
        </div>
      </div>

      {/* Preis prominent OBEN: Einmalzahlung, kein Abo – endet automatisch */}
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <span style={{ display: 'inline-block', padding: '7px 16px', borderRadius: 999, background: 'rgba(232,199,122,.12)', border: '1px solid rgba(232,199,122,.35)', color: 'var(--text)', font: '600 12.5px var(--font-body)' }}>
          <b style={{ color: 'var(--gold-1)' }}>4,99 €</b> / Monat
          <span style={{ color: '#7a7494' }}> · oder </span>
          <b style={{ color: 'var(--gold-1)' }}>39,99 €</b> / Jahr
        </span>
        <div style={{ marginTop: 6, color: 'var(--text-dim)', font: '500 11px var(--font-body)' }}>
          Jahres-Zugang = <span style={{ color: 'var(--gold-1)', fontWeight: 700 }}>4 Monate geschenkt</span>
          <span style={{ color: '#7a7494' }}> · Einmalzahlung, kein Abo – endet automatisch</span>
        </div>
      </div>

      {active ? (
        <div style={{ marginTop: 12, textAlign: 'center', color: 'var(--gold-1)', font: '700 14px var(--font-body)' }}>
          ✦ Plus ist aktiv{settings.plusUntilISO ? <> · bis {bisDatum(settings.plusUntilISO)}</> : null}
        </div>
      ) : (
        <>
          {/* Einmaliger Gratis-Test */}
          {!settings.trialUsedISO && (
            <button className="btn-gold" style={{ marginTop: 12 }} onClick={startTrial}>
              ✧ 7 Tage kostenfrei testen
            </button>
          )}

          {/* PayPal – erscheint automatisch, sobald die Zahlung eingerichtet ist */}
          {pay.configured && <div ref={paypalRef} style={{ marginTop: 10 }} />}
          {payMsg && (
            <div style={{ marginTop: 8, textAlign: 'center', color: 'var(--danger)', font: '500 11.5px/1.5 var(--font-body)' }}>{payMsg}</div>
          )}
        </>
      )}

      {/* Gutschein-Code: auch mit aktivem Plus einlösbar (verlängert) */}
      <div style={{ marginTop: 10 }}>
        {!couponOpen ? (
          <button
            onClick={() => setCouponOpen(true)}
            style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(166,107,255,.14)', border: '1px solid rgba(167,139,250,.4)', color: 'var(--text)', font: '600 13px var(--font-body)', cursor: 'pointer' }}
          >
            🎟 Gutschein-Code einlösen
          </button>
        ) : (
          <div className="glass" style={{ padding: '12px 13px' }}>
            <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Gutschein-Code</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="field"
                style={{ flex: 1, textTransform: 'uppercase' }}
                placeholder="z. B. LUNA-…"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitCoupon()}
                autoCapitalize="characters"
                autoCorrect="off"
              />
              <button className="btn-gold" style={{ width: 'auto', padding: '0 18px', opacity: couponBusy ? 0.6 : 1 }} disabled={couponBusy} onClick={submitCoupon}>
                {couponBusy ? '…' : 'Einlösen'}
              </button>
            </div>
            {couponMsg && <div style={{ marginTop: 8, color: 'var(--danger)', font: '500 11.5px/1.5 var(--font-body)' }}>{couponMsg}</div>}
            {active && <div style={{ marginTop: 8, color: '#7a7494', font: '400 10.5px var(--font-body)' }}>Ein Code verlängert dein bestehendes Plus.</div>}
          </div>
        )}
      </div>

      {/* Free vs. Plus – der Wert auf einen Blick */}
      <div className="glass" style={{ marginTop: 14, padding: '12px 15px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <span style={{ flex: 1, color: '#7a7494', font: '600 9.5px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Was ist drin?</span>
          <span style={{ width: 58, textAlign: 'center', color: 'var(--text-dim)', font: '600 10.5px var(--font-body)' }}>Free</span>
          <span style={{ width: 58, textAlign: 'center', color: 'var(--gold-1)', font: '700 10.5px var(--font-body)' }}>✦ Plus</span>
        </div>
        {COMPARE.map((r) => (
          <div key={r.f} style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderTop: '1px solid rgba(255,255,255,.05)' }}>
            <span style={{ flex: 1, color: 'var(--text)', font: '500 12px/1.35 var(--font-body)', paddingRight: 8 }}>{r.f}</span>
            <span style={{ width: 58, textAlign: 'center', font: '600 11px var(--font-body)', color: r.free ? 'var(--text-dim)' : '#5a5472' }}>
              {r.free === true ? '✓' : r.free === false ? '–' : r.free}
            </span>
            <span style={{ width: 58, textAlign: 'center', font: '700 11px var(--font-body)', color: 'var(--gold-1)' }}>
              {r.plus === true ? '✓' : r.plus}
            </span>
          </div>
        ))}
      </div>

      <div className="glass" style={{ marginTop: 12, padding: '6px 15px' }}>
        {BENEFITS.map((b, i) => (
          <div key={b.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 0', borderTop: i ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
            <span style={{ color: 'var(--gold-1)', fontSize: 15, lineHeight: 1.2, marginTop: 1 }}>✦</span>
            <div>
              <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>{b.t}</div>
              <div style={{ color: 'var(--text-dim)', font: '400 11.5px/1.45 var(--font-body)', marginTop: 2 }}>{b.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Zweiter Einstieg am Ende der Liste – wer bis hier liest, will nicht zurückscrollen */}
      {!active && !settings.trialUsedISO && (
        <button className="btn-gold" style={{ marginTop: 14 }} onClick={startTrial}>
          ✧ 7 Tage kostenfrei testen
        </button>
      )}
      {!active && settings.trialUsedISO && (
        <button
          onClick={() => { setCouponOpen(true); window.scrollTo?.(0, 0) }}
          className="btn-gold"
          style={{ marginTop: 14 }}
        >
          🎟 Mit Gutschein-Code weitermachen
        </button>
      )}

      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10.5px/1.5 var(--font-body)', marginTop: 10 }}>
        Zugang als <b style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Einmalzahlung</b> – kein Abo, keine automatische
        Verlängerung. Zahlung per PayPal{pay.configured ? '' : ' (wird gerade eingerichtet – nutze solange einen Gutschein-Code)'}.
        {' '}<span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => nav('/rechtliches')}>Rechtliches &amp; Datenschutz</span>
      </div>
    </div>
  )
}
