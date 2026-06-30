import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { formatDate, rankInfo } from '../data/library.js'

// ============================================================
// Sternenorakel — local-first Zustand (localStorage)
// Kein Konto, keine Wolke. Alles bleibt auf diesem Gerät.
// ============================================================

const KEY = 'sternenorakel.v1'

const DEFAULT_STATE = {
  onboarded: false,
  profile: {
    name: '',
    themes: [],
    mood: 3,
    birth: { day: null, month: null, year: null }, // month: 1-12
    zodiac: null, // {name, symbol}
  },
  stats: {
    stardust: 0,
    streak: 0,
    lastDrawISO: null, // letzter Tag, an dem gezogen wurde
    drawDays: [], // ISO-Tage mit Ziehung (für 7-Tage-Serie)
    constellationsDone: 0,
  },
  settings: {
    aiMode: false,
    reminder: true,
    reminderTime: '21:00',
    tone: 'Sanft',
  },
  journal: [], // {id, ts, iso, title, symbol, constellation, theme, mantra, text, reflection}
  seenReward: null, // id der zuletzt gezeigten Belohnung
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    const parsed = JSON.parse(raw)
    // sanftes Mergen, falls neue Felder dazukommen
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
      stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      journal: parsed.journal || [],
    }
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* Speicher voll / privat – local-first bleibt im RAM */
    }
  }, [state])

  const patch = useCallback((fn) => {
    setState((s) => {
      const next = typeof fn === 'function' ? fn(s) : fn
      return { ...s, ...next }
    })
  }, [])

  // ---- Aktionen ----
  const completeOnboarding = useCallback((profile) => {
    setState((s) => ({ ...s, onboarded: true, profile: { ...s.profile, ...profile } }))
  }, [])

  const updateProfile = useCallback((p) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }))
  }, [])

  const updateSettings = useCallback((p) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...p } }))
  }, [])

  // Hat der/die Nutzer*in heute schon gezogen?
  const drawnToday = useMemo(() => {
    const today = formatDate().iso
    return state.stats.lastDrawISO === today
  }, [state.stats.lastDrawISO])

  // Speichert Botschaft + Reflexion ins Tagebuch, vergibt Sternenstaub & Serie.
  // Liefert ein Ergebnis-Objekt für die Belohnungslogik zurück.
  const saveEntry = useCallback((message, reflection) => {
    let result = { gainedDust: 0, newStreak: 0, rankUp: null, constellation: false }
    setState((s) => {
      const today = formatDate().iso
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const already = s.stats.lastDrawISO === today

      // Serie fortführen oder neu starten
      let streak = s.stats.streak
      if (!already) {
        streak = s.stats.lastDrawISO === yesterday ? s.stats.streak + 1 : 1
      }

      const gain = already ? 0 : 15
      const beforeStardust = s.stats.stardust
      const stardust = beforeStardust + gain

      const beforeRank = rankInfo(beforeStardust).rank
      const afterRank = rankInfo(stardust).rank
      const rankUp = afterRank !== beforeRank ? afterRank : null

      // 7-Tage-Sternbild vollendet?
      const constellation = !already && streak > 0 && streak % 7 === 0
      const constellationsDone = constellation
        ? s.stats.constellationsDone + 1
        : s.stats.constellationsDone

      const drawDays = already
        ? s.stats.drawDays
        : [...new Set([...(s.stats.drawDays || []), today])].slice(-60)

      const entry = {
        id: `${Date.now()}`,
        ts: Date.now(),
        iso: today,
        mid: message.id,
        title: message.title,
        symbol: message.symbol,
        constellation: message.constellation,
        theme: message.theme,
        mantra: message.mantra,
        text: message.text,
        reflection: reflection || '',
      }

      result = {
        gainedDust: gain,
        newStreak: streak,
        rankUp,
        constellation,
      }

      return {
        ...s,
        journal: [entry, ...s.journal],
        stats: {
          ...s.stats,
          stardust,
          streak,
          lastDrawISO: today,
          drawDays,
          constellationsDone,
        },
      }
    })
    return result
  }, [])

  const dismissReward = useCallback((id) => {
    setState((s) => ({ ...s, seenReward: id }))
  }, [])

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
    setState(structuredClone(DEFAULT_STATE))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      patch,
      completeOnboarding,
      updateProfile,
      updateSettings,
      saveEntry,
      dismissReward,
      resetAll,
      drawnToday,
      rank: rankInfo(state.stats.stardust),
    }),
    [
      state,
      patch,
      completeOnboarding,
      updateProfile,
      updateSettings,
      saveEntry,
      dismissReward,
      resetAll,
      drawnToday,
    ]
  )

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
