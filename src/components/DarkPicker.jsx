import { useState } from 'react'

// Dunkler Auswahl-Picker als Ersatz für graue System-Dropdowns.
// Zeigt ein Feld; per Tap öffnet sich eine dunkle, scrollbare Liste.
export default function DarkPicker({ value, onChange, options, placeholder = '–', label, ariaLabel, flex, valueSize = 20 }) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => String(o.value) === String(value))

  return (
    <div className="col" style={flex ? { flex } : undefined}>
      <button type="button" className="picker-field" aria-label={ariaLabel || label} onClick={() => setOpen(true)}>
        <span className={selected ? 'picker-val' : 'picker-ph'} style={{ fontSize: valueSize }}>{selected ? selected.label : placeholder}</span>
        <span className="picker-caret">▾</span>
      </button>
      {label && <label>{label}</label>}

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="sheet pop" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-title">{label || 'Auswahl'}</div>
            <div className="sheet-list">
              {options.map((o) => {
                const sel = String(o.value) === String(value)
                return (
                  <button
                    type="button"
                    key={o.value}
                    className={'sheet-item' + (sel ? ' sel' : '')}
                    onClick={() => { onChange(o.value); setOpen(false) }}
                  >
                    {o.label}
                    {sel && <span className="sheet-check">✓</span>}
                  </button>
                )
              })}
            </div>
            <button type="button" className="link-soft sheet-close" onClick={() => setOpen(false)}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  )
}
