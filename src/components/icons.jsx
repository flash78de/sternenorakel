// SVG-Linien-Icons im Sternenorakel-Stil (statt Emoji in der Navigation)

export function IcStart({ s = 21, c = 'currentColor' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  )
}

export function IcOracle({ s = 21, c = 'currentColor' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9.5" r="6.2" />
      <path d="M7 19.5h10" />
      <path d="M9 19.5c0-1.6 1.3-2.6 3-2.6s3 1 3 2.6" />
    </svg>
  )
}

export function IcBook({ s = 21, c = 'currentColor' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.5C9.8 5.2 7.2 5.1 4.5 6V19c2.7-.9 5.3-.8 7.5.5 2.2-1.3 4.8-1.4 7.5-.5V6c-2.7-.9-5.3-.8-7.5.5z" />
      <path d="M12 6.5V19" />
    </svg>
  )
}

export function IcMoon({ s = 21, c = 'currentColor' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13.5A8 8 0 1 1 10 4.2a6.3 6.3 0 0 0 10 9.3z" />
    </svg>
  )
}

export function IcUser({ s = 21, c = 'currentColor' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20c.6-3.4 3.2-5.4 6.5-5.4S17.9 16.6 18.5 20" />
    </svg>
  )
}

export function IcBell({ s = 17, c = '#E8C77A' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4.5 1.8 5.5 1.8 5.5H4.2S6 14 6 9.5z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function IcCalendar({ s = 13, c = '#E8C77A' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  )
}

export function IcCompass({ s = 26, c = '#E8C77A' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 5.5l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" fill="rgba(232,199,122,.22)" />
    </svg>
  )
}
