import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AI_ENDPOINT } from '../lib/ai.js'

// Kündigungsseite nach § 312k BGB: ohne Anmeldung erreichbar (kein Gate),
// identifiziert den Vertrag über Name + PayPal-E-Mail, schließt mit der
// Bestätigungsschaltfläche „Jetzt kündigen" ab und liefert sofort eine
// speicherbare Eingangsbestätigung mit Datum, Uhrzeit und Vorgangsnummer.
const field = {
  width: '100%', boxSizing: 'border-box', padding: '12px 13px', borderRadius: 12,
  background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.16)',
  color: 'var(--text)', font: '400 14px var(--font-body)', outline: 'none',
}
const label = { color: 'var(--text-dim)', font: '600 11px var(--font-body)', margin: '13px 0 5px', display: 'block' }

export default function Kuendigen() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', vertrag: 'plus-monat', art: 'ordentlich', grund: '', zeitpunkt: 'naechstmoeglich', datum: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [best, setBest] = useState(null) // Eingangsbestätigung {nummer, ts}

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const senden = async () => {
    setErr('')
    if (!form.name.trim()) return setErr('Bitte gib deinen Namen an.')
    if (!/.+@.+\..+/.test(form.email)) return setErr('Bitte gib die E-Mail-Adresse an, die du bei der Zahlung (PayPal) verwendet hast.')
    if (form.art === 'ausserordentlich' && !form.grund.trim()) return setErr('Bei einer außerordentlichen Kündigung gib bitte kurz den Grund an.')
    setBusy(true)
    try {
      const res = await fetch(AI_ENDPOINT + '/kuendigen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'Übermittlung fehlgeschlagen.')
      setBest(data)
    } catch (e) {
      setErr(e.message + ' Du kannst alternativ formlos an ml@mittel-bar.com kündigen.')
    } finally {
      setBusy(false)
    }
  }

  const downloadBestaetigung = () => {
    const txt =
      `Sternenluna – Eingangsbestätigung Kündigung\n\n` +
      `Vorgangsnummer: ${best.nummer}\nEingegangen am: ${new Date(best.ts).toLocaleString('de-DE')}\n\n` +
      `Name: ${form.name}\nE-Mail: ${form.email}\nVertrag: ${form.vertrag === 'plus-jahr' ? 'Sternenluna Plus (Jahr)' : 'Sternenluna Plus (Monat)'}\n` +
      `Art: ${form.art === 'ausserordentlich' ? 'außerordentliche Kündigung' : 'ordentliche Kündigung'}\n` +
      (form.grund.trim() ? `Grund: ${form.grund.trim()}\n` : '') +
      `Beendigung: ${form.zeitpunkt === 'datum' && form.datum ? 'zum ' + form.datum : 'zum nächstmöglichen Zeitpunkt'}\n\n` +
      `Anbieterin: KPK Ingrid Lenk – Bereich Mister Hochzeit · Kontakt: ml@mittel-bar.com\n` +
      `Diese Bestätigung dokumentiert den Eingang deiner Kündigungserklärung (§ 312k BGB).\n` +
      `Eine Bestätigung der Vertragsbeendigung erhältst du zusätzlich per E-Mail.`
    const url = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `sternenluna-kuendigung-${best.nummer}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (best)
    return (
      <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px 22px 26px' }}>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 34 }}>✓</span>
          <div className="h-serif" style={{ fontWeight: 700, fontSize: 22, color: 'var(--gold-1)', marginTop: 8 }}>
            Kündigung eingegangen
          </div>
          <div style={{ color: 'var(--text)', font: '400 13.5px/1.7 var(--font-body)', marginTop: 12, textAlign: 'left' }}>
            Deine Kündigungserklärung ist bei uns eingegangen:
          </div>
          <div className="glass" style={{ marginTop: 12, padding: '13px 15px', textAlign: 'left', font: '400 12.5px/1.8 var(--font-body)', color: 'var(--text-dim)' }}>
            Vorgangsnummer: <b style={{ color: 'var(--gold-1)' }}>{best.nummer}</b><br />
            Eingegangen: <b style={{ color: 'var(--text)' }}>{new Date(best.ts).toLocaleString('de-DE')}</b><br />
            Vertrag: <b style={{ color: 'var(--text)' }}>{form.vertrag === 'plus-jahr' ? 'Sternenluna Plus (Jahr)' : 'Sternenluna Plus (Monat)'}</b><br />
            Beendigung: <b style={{ color: 'var(--text)' }}>{form.zeitpunkt === 'datum' && form.datum ? `zum ${form.datum}` : 'zum nächstmöglichen Zeitpunkt'}</b>
          </div>
          <div style={{ color: 'var(--text-dim)', font: '400 12px/1.6 var(--font-body)', marginTop: 12, textAlign: 'left' }}>
            Bitte sichere dir diese Bestätigung. Die Bestätigung der Vertragsbeendigung mit dem genauen
            Enddatum senden wir dir zusätzlich an <b style={{ color: 'var(--text)' }}>{form.email}</b>.
          </div>
          <button className="btn-gold" style={{ marginTop: 18 }} onClick={downloadBestaetigung}>
            ⬇ Bestätigung speichern
          </button>
          <button className="link-soft" style={{ marginTop: 14 }} onClick={() => nav('/')}>
            Zur Startseite
          </button>
        </div>
      </div>
    )

  return (
    <div className="screen-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 22px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back" onClick={() => nav(-1)}>‹</button>
        <span className="h-serif" style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Verträge hier kündigen</span>
      </div>

      <div style={{ color: 'var(--text-dim)', font: '400 12.5px/1.6 var(--font-body)', marginTop: 12 }}>
        Hier kündigst du dein Sternenluna-Plus-Abo – ohne Anmeldung, in einer Minute.
        Dein Zugang bleibt bis zum Ende der bezahlten Laufzeit bestehen; danach wird nichts mehr abgebucht.
        Dein Tagebuch und alle Daten in der App bleiben unberührt.
      </div>

      <span style={label}>Dein Name</span>
      <input style={field} value={form.name} onChange={set('name')} placeholder="Vor- und Nachname" autoComplete="name" />

      <span style={label}>E-Mail-Adresse (die du bei PayPal verwendest)</span>
      <input style={field} type="email" value={form.email} onChange={set('email')} placeholder="name@beispiel.de" autoComplete="email" inputMode="email" />

      <span style={label}>Welcher Vertrag?</span>
      <select style={field} value={form.vertrag} onChange={set('vertrag')}>
        <option value="plus-monat">Sternenluna Plus · Monats-Abo (4,99 €)</option>
        <option value="plus-jahr">Sternenluna Plus · Jahres-Abo (39,99 €)</option>
      </select>

      <span style={label}>Art der Kündigung</span>
      <select style={field} value={form.art} onChange={set('art')}>
        <option value="ordentlich">Ordentliche Kündigung (zum Laufzeitende)</option>
        <option value="ausserordentlich">Außerordentliche Kündigung (aus wichtigem Grund)</option>
      </select>
      {form.art === 'ausserordentlich' && (
        <>
          <span style={label}>Wichtiger Grund</span>
          <textarea style={{ ...field, minHeight: 70 }} value={form.grund} onChange={set('grund')} placeholder="Kurze Begründung" />
        </>
      )}

      <span style={label}>Beendigung zum …</span>
      <select style={field} value={form.zeitpunkt} onChange={set('zeitpunkt')}>
        <option value="naechstmoeglich">nächstmöglichen Zeitpunkt</option>
        <option value="datum">Wunschdatum (falls später)</option>
      </select>
      {form.zeitpunkt === 'datum' && (
        <input style={{ ...field, marginTop: 8 }} type="date" value={form.datum} onChange={set('datum')} />
      )}

      {err && <div style={{ marginTop: 12, color: 'var(--danger)', font: '500 12px/1.5 var(--font-body)' }}>{err}</div>}

      <button className="btn-gold" style={{ marginTop: 16, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={senden}>
        {busy ? 'Wird übermittelt …' : 'Jetzt kündigen'}
      </button>
      <div style={{ textAlign: 'center', color: '#7a7494', font: '400 10.5px/1.5 var(--font-body)', marginTop: 10 }}>
        Übermittelt werden nur die Angaben aus diesem Formular. Alternativ kannst du formlos
        per E-Mail an <b style={{ color: 'var(--text-dim)' }}>ml@mittel-bar.com</b> kündigen.
      </div>
    </div>
  )
}
