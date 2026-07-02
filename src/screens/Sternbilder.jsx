import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { constellationStatus } from '../data/library.js'

// 21 · Sternbilder — Reflexions-Meilensteine (keine Zufalls-Sticker):
// Ein Sternbild entsteht, wenn du Reflexionen zu einem Themenfeld festhältst.
export default function Sternbilder() {
  const nav = useNavigate()
  const { journal } = useStore()
  const [detail, setDetail] = useState(null)

  const status = useMemo(() => constellationStatus(journal), [journal])

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/profil')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Meine Sternbilder</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: 'var(--gold-1)' }}>
          {status.done} / {status.total} entstanden
        </div>
        <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.5 var(--font-body)', marginTop: 6, fontStyle: 'italic' }}>
          Sternbilder entstehen aus festgehaltenen Reflexionen – sie zeigen, womit du dich wirklich beschäftigst.
        </div>
      </div>

      {/* Nächstes Ziel — ehrliche FOMO */}
      {status.next && (
        <div className="glass" style={{ marginTop: 14, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle,rgba(106,59,232,.4),rgba(40,30,70,.5))', border: '1px solid rgba(232,199,122,.3)', color: 'var(--gold-1)', fontSize: 22 }}>
            {status.next.glyph}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)' }}>Als Nächstes: {status.next.name}</div>
            <div style={{ color: 'var(--purple-2)', font: '600 11px var(--font-body)', marginTop: 2 }}>
              Noch {status.missing} {status.missing === 1 ? 'Reflexion' : 'Reflexionen'}, bis es sich zeigt ✦
            </div>
          </div>
        </div>
      )}

      {/* Sammlung */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {status.list.map((c) => {
          const started = c.have > 0 && !c.unlocked
          return (
            <button key={c.name} onClick={() => setDetail(c)} style={{ textAlign: 'center', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
              <div style={{
                aspectRatio: '1', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, position: 'relative',
                background: c.unlocked
                  ? 'radial-gradient(circle at 50% 35%,rgba(232,199,122,.28),rgba(40,30,70,.5) 70%)'
                  : 'rgba(255,255,255,.03)',
                border: '1px solid ' + (c.unlocked ? 'rgba(232,199,122,.45)' : started ? 'rgba(166,107,255,.5)' : 'rgba(255,255,255,.08)'),
                color: c.unlocked ? 'var(--gold-1)' : '#4e496a',
                boxShadow: c.unlocked ? '0 0 18px rgba(232,199,122,.2)' : 'none',
              }}>
                {c.unlocked ? c.glyph : started ? <span style={{ color: 'var(--purple-2)' }}>{c.glyph}</span> : '🔒'}
                {started && (
                  <span style={{ position: 'absolute', bottom: 6, left: 10, right: 10, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.12)' }}>
                    <span style={{ display: 'block', width: `${Math.round((c.have / c.need) * 100)}%`, height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#6A3BE8,#A66BFF)' }} />
                  </span>
                )}
              </div>
              <div style={{ font: `${c.unlocked ? 600 : 500} 10px/1.3 var(--font-body)`, color: c.unlocked ? 'var(--text)' : started ? 'var(--purple-2)' : '#7a7494', marginTop: 5 }}>
                {c.unlocked ? c.name : started ? `${c.have}/${c.need}` : '???'}
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, minHeight: 12 }} />
      <button className="btn-gold" style={{ marginTop: 14 }} onClick={() => nav('/oracle')}>
        ✦ Heute weiterreflektieren
      </button>

      {/* Detail: Regel & Fortschritt */}
      {detail && (
        <div className="overlay" onClick={() => setDetail(null)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()} style={{ paddingTop: 26, textAlign: 'center' }}>
            <div style={{ fontSize: 40, color: detail.unlocked ? 'var(--gold-1)' : 'var(--purple-2)' }}>{detail.glyph}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 20, color: 'var(--gold-1)', marginTop: 8 }}>
              {detail.unlocked ? detail.name : 'Ein verborgenes Sternbild'}
            </div>
            {detail.unlocked && detail.motto && (
              <div style={{ color: 'var(--purple-2)', font: '600 11.5px var(--font-body)', marginTop: 3 }}>{detail.motto}</div>
            )}
            <div style={{ color: 'var(--text-dim)', font: '400 13px/1.6 var(--font-body)', marginTop: 12 }}>
              {detail.unlocked
                ? <>Entstanden aus deinen Reflexionen: {detail.desc}.</>
                : <>So entsteht es: {detail.desc}. <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>{detail.have}/{detail.need}</b> hast du schon.</>}
            </div>
            <button className="link-soft" style={{ marginTop: 16 }} onClick={() => setDetail(null)}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  )
}
