import { useState } from 'react'
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

// Eine Station der Chakren-Reise: Karte · Summen · Handhaltung ·
// Affirmationen · Reflexion. Abschluss speichert die Station (+ Notiz).
export default function ChakraStation() {
  const nav = useNavigate()
  const { n } = useParams()
  const num = Number(n)
  const { settings, reisen, patch } = useStore()
  const c = CHAKREN.find((x) => x.n === num)

  const done = reisen.chakren.done || []
  const [note, setNote] = useState(reisen.chakren.notes?.[num] || '')
  const [finished, setFinished] = useState(false) // Reise gerade vollendet?

  // Zugang: Station 1 frei, sonst Plus; Reihenfolge einhalten (fertige bleiben offen)
  const next = CHAKREN.find((x) => !done.includes(x.n))?.n ?? 7
  const allowed = c && (settings.premium || num === 1) && (num <= next || done.includes(num))
  if (!allowed) {
    return (
      <div className="center-col" style={{ padding: 30 }}>
        <Luna state="lauschen" width={140} glowSize={170} float />
        <div className="h-serif" style={{ fontSize: 18, color: 'var(--text)', marginTop: 12, textAlign: 'center' }}>
          Diese Station ist noch nicht offen.
        </div>
        <button className="btn-gold" style={{ marginTop: 18, width: 'auto', padding: '12px 22px' }} onClick={() => nav('/reisen')}>
          Zur Reise-Übersicht
        </button>
      </div>
    )
  }

  const complete = () => {
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
          completedISO: vollendet ? formatDate().iso : s.reisen.chakren.completedISO,
        },
      },
    }))
    buzz([18, 24, 18])
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

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 24px', background: `radial-gradient(480px 300px at 50% -80px, ${c.farbe}33, transparent 70%)` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="back" onClick={() => nav('/reisen')}>‹</button>
        <span style={{ color: c.farbe, font: '600 10.5px var(--font-body)', letterSpacing: 1.4, textTransform: 'uppercase', filter: 'brightness(1.35)' }}>
          Station {c.n} von 7
        </span>
        <span style={{ width: 38 }} />
      </div>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 24, color: 'var(--gold-1)', textShadow: '0 2px 14px rgba(232,199,122,.35)' }}>
          {c.name} · „{c.bija}“
        </div>
        <div style={{ color: 'var(--text-dim)', font: '500 12.5px var(--font-body)', marginTop: 3 }}>
          {c.dt} · {c.steht}
        </div>
      </div>

      {/* Die Karte */}
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <img src={asset(chakraBild(c.n, 'md'))} alt={c.dt} className="pop"
          style={{ width: 'min(300px, 82%)', height: 'auto', borderRadius: 14, filter: `drop-shadow(0 14px 30px rgba(0,0,0,.55)) drop-shadow(0 0 22px ${c.farbe}55)` }} />
      </div>

      {/* So gehst du durch die Station */}
      <div className="glass" style={{ marginTop: 16, padding: '13px 15px' }}>
        <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 9 }}>
          Deine Station · 3–5 Minuten
        </div>
        {[
          ['1', 'Ankommen', 'Setz dich bequem hin. Drei ruhige Atemzüge – länger aus als ein.'],
          ['2', 'Summen', `Summe auf einem langen Ausatmen den Klang „${c.klang}“ – zwei- oder dreimal. Spür ruhig, wo es im Körper brummt.`],
          ['3', 'Handhaltung', 'Nimm die Handhaltung von der Karte ein – locker, nichts muss perfekt sein.'],
          ['4', 'Mitsprechen', 'Sprich die Sätze unten leise oder still mit – such dir den heraus, der heute stimmt.'],
        ].map(([nr, t, d]) => (
          <div key={nr} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginTop: 8 }}>
            <span style={{ width: 22, height: 22, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `${c.farbe}2e`, border: `1px solid ${c.farbe}66`, color: 'var(--text)', font: '700 11px var(--font-body)' }}>{nr}</span>
            <span style={{ color: 'var(--text-dim)', font: '400 12px/1.5 var(--font-body)' }}>
              <b style={{ color: 'var(--text)', fontWeight: 600 }}>{t}:</b> {d}
            </span>
          </div>
        ))}
      </div>

      {/* Affirmationen der Karte */}
      <div style={{ marginTop: 12, background: `linear-gradient(160deg, ${c.farbe}22, ${c.farbe}0d)`, border: `1px solid ${c.farbe}55`, borderRadius: 16, padding: '13px 15px' }}>
        <div style={{ color: 'var(--text-dim)', font: '600 9.5px var(--font-body)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 7 }}>
          „{c.wort}“ · Affirmationen
        </div>
        {c.affirmationen.map((a) => (
          <div key={a} style={{ fontFamily: 'var(--font-head)', fontStyle: 'italic', fontWeight: 600, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.5, marginTop: 4 }}>
            {a}
          </div>
        ))}
        <div style={{ marginTop: 9, color: 'var(--text-dim)', font: '400 10.5px/1.45 var(--font-body)' }}>
          Sinn: {c.sinn} · Element: {c.element} · {c.eigenschaften}
        </div>
      </div>

      {/* Reflexion (bleibt in der Reise gespeichert) */}
      <div style={{ marginTop: 14 }}>
        <div style={{ color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Lunas Frage zu dieser Station</div>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 16, color: 'var(--text)', lineHeight: 1.4 }}>
          {c.frage}
        </div>
        <textarea
          className="note"
          style={{ marginTop: 10, minHeight: 90 }}
          placeholder="Schreib auf, was auftaucht … (optional, bleibt auf deinem Gerät)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button className="btn-gold" style={{ marginTop: 14 }} onClick={complete}>
        {done.includes(num) ? 'Station aktualisieren ✓' : `Station ${c.n} abschließen ✦`}
      </button>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10px/1.5 var(--font-body)', marginTop: 10 }}>
        Symbolsprache, keine Heilslehre – nimm mit, was dir guttut.
      </div>
    </div>
  )
}
