import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { MESSAGES, formatDate } from '../data/library.js'
import { speak, speechSupported } from '../lib/audio.js'
import { karteBild, runeBild } from '../lib/ritualAssets.js'

const softBtn = {
  flex: 1,
  padding: '12px',
  borderRadius: 12,
  background: 'rgba(166,107,255,.14)',
  border: '1px solid rgba(167,139,250,.4)',
  color: 'var(--text)',
  font: '600 13px var(--font-body)',
  cursor: 'pointer',
}

// 20 · Tagebucheintrag — Einzelansicht (öffnen, Notiz bearbeiten, teilen, exportieren, löschen)
export default function JournalEntry() {
  const nav = useNavigate()
  const { id } = useParams()
  const { journal, updateReflection, deleteEntry, settings } = useStore()

  const entry = journal.find((e) => e.id === id)
  const full = useMemo(() => MESSAGES.find((m) => m.id === entry?.mid) || null, [entry])

  const [note, setNote] = useState(entry?.reflection || '')
  const [confirm, setConfirm] = useState(false)
  const [savedHint, setSavedHint] = useState(false)

  if (!entry) {
    return (
      <div className="center-col" style={{ padding: 30 }}>
        <div className="h-serif" style={{ fontSize: 18, color: 'var(--text)' }}>Eintrag nicht gefunden</div>
        <button className="btn-gold" style={{ marginTop: 18, width: 'auto', padding: '12px 22px' }} onClick={() => nav('/tagebuch')}>
          Zurück zum Tagebuch
        </button>
      </div>
    )
  }

  const dateStr = formatDate(new Date(entry.ts))
  // Bevorzugt die im Eintrag gespeicherten Felder (generierte Botschaften);
  // Fallback auf die kuratierte MESSAGES-Vorlage für ältere Einträge.
  const luck = entry.luck ?? full?.luck
  const energy = entry.energy ?? full?.energy
  const question = entry.question ?? full?.reflection

  const saveNote = () => {
    const unlocked = updateReflection(entry.id, note)
    // Vollendet diese Reflexion ein Sternbild? Dann gebührend feiern.
    if (unlocked) {
      nav('/feier', { state: { reward: { constellationName: unlocked } } })
      return
    }
    setSavedHint(true)
    setTimeout(() => setSavedHint(false), 1600)
  }

  const shareText =
    `✦ ${entry.title}\n${entry.theme}${entry.constellation ? ' · ' + entry.constellation : ''} · ${dateStr.short}\n\n` +
    `${entry.text}\n\n„${entry.mantra}"` +
    (note.trim() ? `\n\nMeine Notiz:\n${note.trim()}` : '') +
    `\n\n— Sternenluna`

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: entry.title, text: shareText })
      else {
        await navigator.clipboard.writeText(shareText)
        setSavedHint(true)
        setTimeout(() => setSavedHint(false), 1600)
      }
    } catch {
      /* abgebrochen – kein Fehler */
    }
  }

  const exportTxt = () => {
    const blob = new Blob([shareText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sternenorakel-${entry.iso}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const remove = () => {
    deleteEntry(entry.id)
    nav('/tagebuch', { replace: true })
  }

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav('/tagebuch')}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Tagebucheintrag</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <span className="symbol-tile" style={{ width: 56, height: 56, fontSize: 26 }}>{entry.symbol?.glyph || '✦'}</span>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 24, color: 'var(--gold-1)', marginTop: 10, textShadow: '0 2px 14px rgba(232,199,122,.35)' }}>
          {entry.title}
        </div>
        <div style={{ color: 'var(--purple-2)', font: '500 11px var(--font-body)', marginTop: 5 }}>
          {entry.theme}{entry.constellation ? ` · ${entry.constellation}` : ''} · {dateStr.weekday}, {dateStr.short}
        </div>
      </div>

      <div style={{ color: 'var(--text)', font: '400 14px/1.7 var(--font-body)', textAlign: 'center', marginTop: 14, whiteSpace: 'pre-line' }}>
        {entry.text}
      </div>

      {/* Ritual-Ergebnis (falls gespeichert) */}
      {entry.archetype && (
        <div style={{ marginTop: 12, background: 'rgba(166,107,255,.1)', border: '1px solid rgba(166,107,255,.3)', borderRadius: 14, padding: '11px 13px' }}>
          <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Archetyp · Sternenwürfel</div>
          <div style={{ color: 'var(--gold-1)', font: '600 14px var(--font-body)', marginTop: 4 }}>{entry.archetype.glyph} {entry.archetype.name}</div>
          <div style={{ color: 'var(--text-dim)', font: '400 11.5px/1.5 var(--font-body)', marginTop: 4 }}>Kleine Handlung: {entry.archetype.impuls}</div>
        </div>
      )}
      {entry.card && (
        <div style={{ marginTop: 12, background: 'rgba(166,107,255,.1)', border: '1px solid rgba(166,107,255,.3)', borderRadius: 14, padding: '11px 13px' }}>
          <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Karte · {entry.card.thema}</div>
          {karteBild(entry.card.title) && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <img src={karteBild(entry.card.title)} alt={entry.card.title}
                style={{ width: 'min(150px, 46%)', height: 'auto', borderRadius: 9, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,.5))' }} />
            </div>
          )}
          <div style={{ color: 'var(--text-dim)', font: '400 11.5px/1.5 var(--font-body)', marginTop: 6 }}>{entry.card.deutung}</div>
        </div>
      )}
      {entry.runes && (
        <div style={{ marginTop: 12, background: 'rgba(166,107,255,.1)', border: '1px solid rgba(166,107,255,.3)', borderRadius: 14, padding: '11px 13px' }}>
          <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Runen-Lesung</div>
          {entry.runes.map((r) => (
            <div key={r.position} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginTop: 7 }}>
              {runeBild(r.name) && (
                <img src={runeBild(r.name)} alt={`Rune ${r.name}`} style={{ width: 30, height: 'auto', flexShrink: 0, filter: 'drop-shadow(0 3px 8px rgba(0,0,0,.5))' }} />
              )}
              <div style={{ color: 'var(--text-dim)', font: '400 11.5px/1.5 var(--font-body)' }}>
                <b style={{ color: 'var(--gold-1)', fontWeight: 600 }}>{runeBild(r.name) ? '' : `${r.glyph} `}{r.position}</b> {r.heute}
              </div>
            </div>
          ))}
        </div>
      )}

      {entry.mantra && (
        <div style={{ marginTop: 14, background: 'linear-gradient(160deg,rgba(232,199,122,.14),rgba(232,199,122,.05))', border: '1px solid rgba(232,199,122,.35)', borderRadius: 16, padding: '12px 14px', textAlign: 'center' }}>
          <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Dein Mantra</div>
          <div style={{ fontFamily: 'var(--font-head)', fontStyle: 'italic', fontWeight: 600, fontSize: 15, color: 'var(--gold-1)' }}>„{entry.mantra}"</div>
        </div>
      )}

      {(luck || energy) && (
        <div style={{ marginTop: 10, display: 'flex', gap: 9 }}>
          <div onClick={() => nav('/profil/glueck')} style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 13, padding: '9px 11px', cursor: 'pointer' }}>
            <div style={{ color: '#7a7494', font: '600 8.5px var(--font-body)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Glückselement ›</div>
            <div style={{ color: 'var(--text)', font: '600 13px var(--font-body)', marginTop: 2 }}>✦ {luck || '—'}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 13, padding: '9px 11px' }}>
            <div style={{ color: '#7a7494', font: '600 8.5px var(--font-body)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Tagesenergie</div>
            <div style={{ color: 'var(--purple-2)', font: '600 12px var(--font-body)', marginTop: 4 }}>{energy?.label || '—'}</div>
          </div>
        </div>
      )}

      {question && (
        <div className="glass-purple" style={{ marginTop: 14, padding: '12px 14px' }}>
          <div style={{ color: 'var(--purple-2)', font: '600 9px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>
            Lunas Frage an dich
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.4 }}>
            {question}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, color: '#7a7494', font: '600 10px var(--font-body)', letterSpacing: 1, textTransform: 'uppercase' }}>Meine Notiz</div>
      <textarea
        className="note"
        style={{ marginTop: 8, minHeight: 96 }}
        placeholder="Schreibe, was dir zu dieser Botschaft in den Sinn kommt … (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="btn-gold" style={{ marginTop: 10 }} onClick={saveNote}>
        {savedHint ? 'Gespeichert ✓' : 'Notiz speichern'}
      </button>

      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <button onClick={share} style={softBtn}>⇪ Teilen</button>
        <button onClick={exportTxt} style={softBtn}>⬇ Export</button>
        {speechSupported && (
          <button style={softBtn} onClick={() => {
            if (!settings.premium) { nav('/profil/plus'); return }
            speak(`${entry.title}. ${entry.text} Dein Mantra: ${entry.mantra}`, settings.tone)
          }}>🔊 Anhören</button>
        )}
      </div>

      <button className="btn-ghost" style={{ marginTop: 10 }} onClick={() => setConfirm(true)}>
        Eintrag löschen
      </button>

      {confirm && (
        <div className="overlay" onClick={() => setConfirm(false)}>
          <div className="modal pop" onClick={(e) => e.stopPropagation()} style={{ paddingTop: 24 }}>
            <div className="title-lg" style={{ fontSize: 19, color: 'var(--text)' }}>Diesen Eintrag löschen?</div>
            <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.55 var(--font-body)', marginTop: 10 }}>
              „{entry.title}" wird unwiderruflich von diesem Gerät entfernt.
            </div>
            <button className="btn-ghost" style={{ marginTop: 18 }} onClick={remove}>Ja, löschen</button>
            <button className="link-soft" style={{ marginTop: 12 }} onClick={() => setConfirm(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  )
}
