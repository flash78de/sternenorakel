import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { asset } from '../lib/asset.js'
import { buzz } from '../lib/haptics.js'
import { formatDate } from '../data/library.js'
import { CHAKREN, chakraBild } from '../data/chakren.js'

// Konfetti-Positionen für die Reise-Vollendung (deterministisch)
const PARTS = [
  { left: '8%', delay: 0, size: 14 }, { left: '22%', delay: 1.2, size: 10 },
  { left: '38%', delay: 0.5, size: 13 }, { left: '55%', delay: 1.7, size: 11 },
  { left: '70%', delay: 0.3, size: 15 }, { left: '85%', delay: 0.9, size: 11 },
]

// Eine Station der Chakren-Reise: Karte (per Tipp im Vollbild), kompakte
// Anleitung, Affirmationen, Reflexion. Wischen (links/rechts) wechselt
// zwischen den offenen Stationen – in Text- UND Vollbild-Ansicht.
export default function ChakraStation() {
  const nav = useNavigate()
  const { n } = useParams()
  const num = Number(n)
  const { settings, reisen, patch } = useStore()
  const c = CHAKREN.find((x) => x.n === num)

  const done = reisen.chakren.done || []
  const zugang = settings.premium || settings.chakrenOwned
  const next = CHAKREN.find((x) => !done.includes(x.n))?.n ?? 7
  // Eine Station pro Tag: Wurde heute schon eine NEUE Station vollendet,
  // öffnet sich die nächste erst morgen (fertige bleiben immer besuchbar).
  const dayLocked = reisen.chakren.lastDoneISO === formatDate().iso
  const canVisit = (m) => done.includes(m) || (m === next && !dayLocked && (zugang || m === 1))

  const [note, setNote] = useState(reisen.chakren.notes?.[num] || '')
  const [finished, setFinished] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [guideOpen, setGuideOpen] = useState(!done.includes(num))

  // Beim Stationswechsel (gleiche Route, anderer Parameter) Zustand nachziehen
  useEffect(() => {
    setNote(reisen.chakren.notes?.[num] || '')
    setGuideOpen(!(reisen.chakren.done || []).includes(num))
  }, [num]) // eslint-disable-line

  // Wisch-Navigation: gilt für Text- und Vollbild-Ansicht
  const touch = useRef(null)
  const goTo = (m) => {
    if (m >= 1 && m <= 7 && canVisit(m)) nav(`/reisen/chakren/${m}`, { replace: true })
  }
  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) goTo(dx < 0 ? num + 1 : num - 1)
  }

  const allowed = c && canVisit(num)
  if (!allowed) {
    // Unterscheide: Tages-Rhythmus vs. Kauf nötig vs. Reihenfolge
    const brauchtKauf = c && !zugang && num !== 1
    const morgen = c && !brauchtKauf && num === next && dayLocked
    return (
      <div className="center-col" style={{ padding: 30 }}>
        <Luna state={morgen ? 'schlaf' : 'lauschen'} width={140} glowSize={170} float />
        <div className="h-serif" style={{ fontSize: 18, color: 'var(--text)', marginTop: 12, textAlign: 'center', lineHeight: 1.4 }}>
          {morgen ? <>Diese Station öffnet sich morgen.</> : brauchtKauf ? <>Hier beginnt der Teil<br />der ganzen Reise.</> : <>Diese Station ist noch nicht offen.</>}
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-dim)', font: '400 12.5px/1.6 var(--font-body)', textAlign: 'center', maxWidth: 270 }}>
          {morgen
            ? 'Eine Station pro Tag – gute Reisen brauchen Zwischenraum. Deine bisherigen Stationen bleiben offen.'
            : brauchtKauf
              ? 'Die Stationen 2–7 gehören zur vollständigen Chakren-Reise – einmal 9,99 € oder in Plus enthalten.'
              : 'Die Reise geht Schritt für Schritt – schließe zuerst die vorherige Station ab.'}
        </div>
        {brauchtKauf && (
          <button className="btn-gold" style={{ marginTop: 18, width: 'auto', padding: '12px 22px' }} onClick={() => nav('/reisen')}>
            ✦ Reise freischalten
          </button>
        )}
        <button className={brauchtKauf ? 'link-soft' : 'btn-gold'} style={{ marginTop: brauchtKauf ? 12 : 18, width: 'auto', padding: brauchtKauf ? undefined : '12px 22px' }} onClick={() => nav('/reisen')}>
          Zur Reise-Übersicht
        </button>
      </div>
    )
  }

  const complete = () => {
    const neu = !done.includes(num) // Notiz-Update verbraucht den Tag nicht
    const newDone = [...new Set([...done, num])]
    const vollendet = newDone.length >= 7 && done.length < 7
    patch((s) => ({
      reisen: {
        ...s.reisen,
        chakren: {
          ...s.reisen.chakren,
          done: newDone,
          notes: { ...s.reisen.chakren.notes, ...(note.trim() ? { [num]: note.trim() } : {}) },
          startISO: s.reisen.chakren.startISO || formatDate().iso,
          lastDoneISO: neu ? formatDate().iso : s.reisen.chakren.lastDoneISO,
          completedISO: vollendet ? formatDate().iso : s.reisen.chakren.completedISO,
        },
      },
    }))
    buzz([18, 24, 18])
    // Kein Auto-Sprung zur nächsten Station: die öffnet sich erst morgen
    if (vollendet) setFinished(true)
    else nav('/reisen')
  }

  if (finished)
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
            Reise vollendet ✦
          </div>
          <Luna state="freude" width="min(190px, 50vw)" glowSize={220} burst style={{ marginTop: 10 }} />
          <div className="pop" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 24, color: 'var(--gold-1)', marginTop: 8, textShadow: '0 2px 18px rgba(232,199,122,.45)' }}>
            Alle sieben Stationen<br />liegen hinter dir.
          </div>
          <div style={{ color: 'var(--text)', font: '400 13.5px/1.7 var(--font-body)', marginTop: 12, maxWidth: 290 }}>
            Du hast dir sieben Mal Zeit für dich genommen – das ist das eigentliche Geschenk.
            Jede Station bleibt für dich geöffnet, so oft du zurückkehren magst.
          </div>
          <button className="btn-gold" style={{ marginTop: 24, width: 'auto', padding: '15px 28px' }} onClick={() => nav('/reisen', { replace: true })}>
            ✦ Zur Reise-Übersicht
          </button>
        </div>
      </div>
    )

  const dots = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 10 }}>
      {CHAKREN.map((x) => {
        const reachable = canVisit(x.n)
        return (
          <button key={x.n} onClick={() => goTo(x.n)} aria-label={`Station ${x.n}`}
            style={{
              width: x.n === num ? 20 : 8, height: 8, borderRadius: 4, border: 'none', padding: 0,
              cursor: reachable ? 'pointer' : 'default', transition: 'all .25s',
              background: x.n === num ? x.farbe : reachable ? 'rgba(245,244,250,.4)' : 'rgba(245,244,250,.13)',
            }} />
        )
      })}
    </div>
  )

  return (
    <div className="screen-scroll" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 24px', background: `radial-gradient(480px 300px at 50% -80px, ${c.farbe}33, transparent 70%)` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="back" onClick={() => nav('/reisen')}>‹</button>
        <span style={{ color: c.farbe, font: '600 10.5px var(--font-body)', letterSpacing: 1.4, textTransform: 'uppercase', filter: 'brightness(1.35)' }}>
          Station {c.n} von 7 {done.includes(num) ? '· ✓' : ''}
        </span>
        <span style={{ width: 38 }} />
      </div>

      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 23, color: 'var(--gold-1)', textShadow: '0 2px 14px rgba(232,199,122,.35)' }}>
          {c.name} · „{c.bija}“
        </div>
        <div style={{ color: 'var(--text-dim)', font: '500 12px var(--font-body)', marginTop: 2 }}>
          {c.dt} · „{c.wort}“ · {c.thema}
        </div>
      </div>

      {/* Karte → Tipp öffnet Vollbild; Pfeile + Punkte + Wischen zum Navigieren */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        <button className="back" style={{ opacity: num > 1 && canVisit(num - 1) ? 0.9 : 0.25 }} onClick={() => goTo(num - 1)} aria-label="vorherige Station">‹</button>
        <button onClick={() => setLightbox(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'zoom-in' }} aria-label="Karte im Vollbild ansehen">
          <img src={asset(chakraBild(c.n, 'md'))} alt={c.dt} className="pop"
            style={{ width: 'min(250px, 62vw)', height: 'auto', borderRadius: 13, filter: `drop-shadow(0 14px 30px rgba(0,0,0,.55)) drop-shadow(0 0 22px ${c.farbe}55)` }} />
        </button>
        <button className="back" style={{ opacity: num < 7 && canVisit(num + 1) ? 0.9 : 0.25 }} onClick={() => goTo(num + 1)} aria-label="nächste Station">›</button>
      </div>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10px var(--font-body)', marginTop: 6 }}>
        Tippen für Vollbild · Wischen wechselt die Station
      </div>
      {dots}

      {/* Kompakte Anleitung – aufklappbar, damit die Seite ruhig bleibt */}
      <div className="glass" style={{ marginTop: 14, padding: '4px 15px' }}>
        <button onClick={() => setGuideOpen(!guideOpen)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', color: 'var(--text)', font: '600 12.5px var(--font-body)' }}>
          <span>☾ So gehst du durch die Station <span style={{ color: '#7a7494', fontWeight: 400 }}>· 3–5 Min</span></span>
          <span style={{ color: 'var(--gold-1)', transform: guideOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
        </button>
        {guideOpen && (
          <div style={{ paddingBottom: 11 }}>
            {[
              ['1', 'Ankommen', 'Setz dich bequem hin. Drei ruhige Atemzüge – länger aus als ein.'],
              ['2', 'Summen', `„${c.klang}“ auf einem langen Ausatmen – zwei- oder dreimal. Spür, wo es brummt.`],
              ['3', 'Handhaltung', 'Wie auf der Karte – locker, nichts muss perfekt sein.'],
              ['4', 'Mitsprechen', 'Such dir unten den Satz heraus, der heute stimmt.'],
            ].map(([nr, t, d]) => (
              <div key={nr} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginTop: 7 }}>
                <span style={{ width: 21, height: 21, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `${c.farbe}2e`, border: `1px solid ${c.farbe}66`, color: 'var(--text)', font: '700 10.5px var(--font-body)' }}>{nr}</span>
                <span style={{ color: 'var(--text-dim)', font: '400 12px/1.5 var(--font-body)' }}>
                  <b style={{ color: 'var(--text)', fontWeight: 600 }}>{t}:</b> {d}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Affirmationen der Karte */}
      <div style={{ marginTop: 11, background: `linear-gradient(160deg, ${c.farbe}22, ${c.farbe}0d)`, border: `1px solid ${c.farbe}55`, borderRadius: 16, padding: '13px 15px' }}>
        <div style={{ color: 'var(--text-dim)', font: '600 9.5px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 7 }}>
          Affirmationen
        </div>
        {c.affirmationen.map((a) => (
          <div key={a} style={{ fontFamily: 'var(--font-head)', fontStyle: 'italic', fontWeight: 600, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.5, marginTop: 4 }}>
            {a}
          </div>
        ))}
      </div>

      {/* Reflexion (bleibt in der Reise gespeichert) */}
      <div style={{ marginTop: 13 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15.5, color: 'var(--text)', lineHeight: 1.4 }}>
          {c.frage}
        </div>
        <textarea
          className="note"
          style={{ marginTop: 9, minHeight: 80 }}
          placeholder="Schreib auf, was auftaucht … (optional, bleibt auf deinem Gerät)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button className="btn-gold" style={{ marginTop: 12 }} onClick={complete}>
        {done.includes(num) ? 'Station aktualisieren ✓' : `Station ${c.n} abschließen ✦`}
      </button>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10px/1.5 var(--font-body)', marginTop: 10 }}>
        Symbolsprache, keine Heilslehre – nimm mit, was dir guttut.
      </div>

      {/* Lightbox: Karte im Vollbild, Wischen wechselt auch hier */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(8,7,14,.94)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <img src={asset(chakraBild(c.n, 'md'))} alt={c.dt}
            style={{ maxWidth: '94vw', maxHeight: '82vh', width: 'auto', height: 'auto', borderRadius: 14, boxShadow: `0 20px 60px rgba(0,0,0,.7), 0 0 40px ${c.farbe}44` }} />
          <div style={{ marginTop: 12, color: 'var(--text-dim)', font: '500 11.5px var(--font-body)' }}>
            {c.n}/7 · {c.dt} · Wischen zum Blättern · Tippen schließt
          </div>
        </div>
      )}
    </div>
  )
}
