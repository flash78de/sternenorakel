import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Luna from '../components/Luna.jsx'
import { useStore } from '../store/store.jsx'
import { formatDate } from '../data/library.js'

export default function Tagebuch() {
  const nav = useNavigate()
  const { journal, settings } = useStore()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('Alle')

  // Gratis: die letzten 7 Botschaften · Plus: der ganze Weg
  const pool = useMemo(() => (settings.premium ? journal : journal.slice(0, 7)), [journal, settings.premium])

  const themes = useMemo(() => {
    const set = [...new Set(pool.map((e) => e.theme).filter(Boolean))]
    return ['Alle', ...set]
  }, [pool])

  const visible = useMemo(() => {
    let base = filter === 'Alle' ? pool : pool.filter((e) => e.theme === filter)
    if (!q.trim()) return base
    const needle = q.toLowerCase()
    return base.filter(
      (e) =>
        e.title.toLowerCase().includes(needle) ||
        (e.mantra || '').toLowerCase().includes(needle) ||
        (e.reflection || '').toLowerCase().includes(needle) ||
        (e.theme || '').toLowerCase().includes(needle)
    )
  }, [pool, q, filter])

  if (journal.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 17px 0' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 21, color: 'var(--gold-1)', textAlign: 'center' }}>
          Dein Tagebuch
        </div>
        <div className="center-col" style={{ padding: '0 16px' }}>
          <Luna state="idle" width={150} glowSize={180} float />
          <div style={{ fontFamily: 'var(--font-head)', color: 'var(--text)', fontSize: 17, marginTop: 6 }}>Hier ist es noch still</div>
          <div style={{ color: 'var(--text-dim)', font: '400 13px/1.55 var(--font-body)', marginTop: 8 }}>
            Dein Tagebuch ist noch leer. Empfange deine erste Botschaft auf dem Start-Tab.
          </div>
          <button className="btn-gold" style={{ marginTop: 22, width: 'auto', padding: '12px 22px' }} onClick={() => nav('/oracle')}>
            ✦ Botschaft empfangen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 17px 16px' }}>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 21, color: 'var(--gold-1)', textAlign: 'center' }}>
        Dein Tagebuch
      </div>
      <div style={{ color: 'var(--text-dim)', font: '400 12px var(--font-body)', textAlign: 'center', fontStyle: 'italic', marginTop: 6 }}>
        {settings.premium ? 'Dein ganzer Weg – alle festgehaltenen Botschaften.' : 'Deine letzten 7 Botschaften. Mit Plus bleibt dein ganzer Weg erhalten.'}
      </div>

      <div className="search" style={{ marginTop: 14 }}>
        <span style={{ color: '#7a7494' }}>⌕</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="In deinen Botschaften suchen …"
        />
      </div>

      {themes.length > 1 && (
        <div style={{ marginTop: 11, display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
          {themes.map((t) => (
            <span
              key={t}
              onClick={() => setFilter(t)}
              style={{
                whiteSpace: 'nowrap', cursor: 'pointer', borderRadius: 999, padding: '6px 13px',
                font: '600 11px var(--font-body)',
                background: filter === t ? 'rgba(232,199,122,.14)' : 'rgba(255,255,255,.04)',
                border: '1px solid ' + (filter === t ? 'var(--gold-1)' : 'rgba(255,255,255,.12)'),
                color: filter === t ? 'var(--gold-1)' : 'var(--text-dim)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 13, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visible.map((e) => (
          <div key={e.id} className="journal-item" role="button" tabIndex={0} style={{ cursor: 'pointer' }}
            onClick={() => nav(`/tagebuch/${e.id}`)}
            onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && nav(`/tagebuch/${e.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-head)', color: 'var(--gold-1)', fontSize: 15, fontWeight: 600 }}>{e.title}</span>
              <span style={{ color: '#7a7494', font: '400 10.5px var(--font-body)', whiteSpace: 'nowrap' }}>{formatDate(new Date(e.ts)).short}</span>
            </div>
            <div style={{ color: 'var(--purple-2)', font: '500 10.5px var(--font-body)', marginTop: 4 }}>
              {e.theme}{e.constellation ? ` · ${e.constellation}` : ''}
            </div>
            {e.mantra && (
              <div style={{ color: 'var(--text)', font: '400 13px var(--font-body)', fontStyle: 'italic', marginTop: 7 }}>„{e.mantra}"</div>
            )}
            {e.reflection && (
              <div style={{ color: 'var(--text-dim)', font: '400 12px/1.5 var(--font-body)', marginTop: 8, borderLeft: '2px solid rgba(167,139,250,.35)', paddingLeft: 11 }}>
                {e.reflection}
              </div>
            )}
          </div>
        ))}
        {visible.length === 0 && (
          <div style={{ textAlign: 'center', color: '#7a7494', font: '400 12.5px var(--font-body)', padding: '20px 0' }}>
            Nichts gefunden. Versuch ein anderes Wort.
          </div>
        )}
      </div>
    </div>
  )
}
