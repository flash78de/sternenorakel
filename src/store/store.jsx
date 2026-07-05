import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { formatDate, rankInfo, constellationStatus, isUnder16 } from '../data/library.js'

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
    commStyles: [], // Kommunikationsstil-Keys (max 2): klar|leicht|warm|tief
    coping: null, // Umgang mit Herausforderungen: schritt|perspektive|zuspruch|nachdenken
    birth: { day: null, month: null, year: null }, // month: 1-12
    zodiac: null, // {name, symbol}
  },
  stats: {
    stardust: 0,
    streak: 0,
    lastDrawISO: null, // letzter Tag, an dem gezogen wurde
    drawDays: [], // ISO-Tage mit Ziehung (für 7-Tage-Serie)
    constellationsDone: 0,
    moodTodayISO: null, // Tag, an dem das Befinden zuletzt abgefragt wurde
    installISO: null, // erster App-Start (Basis für die 7 KI-Sterntage nach der Beta)
  },
  settings: {
    aiMode: true, // KI ist Standard – wirksam aber erst nach aktiver Einwilligung (aiConsent)
    aiConsent: null, // null = noch nicht gefragt · true = eingewilligt · false = abgelehnt (DSGVO-Opt-in)
    aiEndpoint: '', // interner Override für Tests – leer = eingebauter Worker
    reminder: true,
    reminderTime: '21:00',
    reminderWhen: 'abends', // morgens | mittags | abends | aus
    tone: 'Sanft',
    premium: false, // Sternenluna Plus – aktiv (abgeleitet aus Quelle + Ablaufdatum)
    plusSource: null, // trial | coupon | paypal | beta – woher kommt das Plus?
    plusUntilISO: null, // letzter gültiger Tag (null = unbefristet)
    plusStartISO: null, // Tag der Sicherung („am xx.xx.xxxx gesichert")
    plusNotice14For: null, // 14-Tage-Endehinweis gezeigt für dieses Enddatum
    plusNotice3For: null, // 3-Tage-Endehinweis gezeigt für dieses Enddatum
    trialUsedISO: null, // Tag, an dem der einmalige Gratis-Test gestartet wurde
    plusExpiredSeenISO: null, // Ablauf-Hinweis für dieses Enddatum bereits gezeigt
    splash: true, // „Luna erwacht"-Startanimation
    lastBackupISO: null, // Tag des letzten Exports (für die Backup-Erinnerung)
    backupNudgeISO: null, // Tag des letzten Backup-Popups (max. alle 7 Tage)
  },
  journal: [], // {id, ts, iso, mid, title, symbol, constellation, theme, mantra, text, luck, energy, question, reflection}
  // Reisen: geführte Mehr-Stationen-Programme (Plus). Notizen bleiben lokal.
  reisen: {
    chakren: { done: [], notes: {}, startISO: null, completedISO: null },
  },
  seenReward: null, // id der zuletzt gezeigten Belohnung
  seenReturnISO: null, // Tag, an dem der Rückkehr-Screen zuletzt gezeigt wurde
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    const parsed = JSON.parse(raw)
    // sanftes Mergen, falls neue Felder dazukommen
    const state = {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
      stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      journal: parsed.journal || [],
      reisen: {
        ...structuredClone(DEFAULT_STATE.reisen),
        ...(parsed.reisen || {}),
        chakren: { ...structuredClone(DEFAULT_STATE.reisen.chakren), ...(parsed.reisen?.chakren || {}) },
      },
    }
    return migratePlus(migrateThemes(state))
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

// Plus-Lebenszyklus: Aus der kostenlosen Beta wird ein befristetes Modell
// (Test / Gutschein / Zahlung). Beim Laden wird geprüft, ob das Plus noch gilt.
function migratePlus(state) {
  try {
    const s = state.settings
    const today = new Date().toISOString().slice(0, 10)
    // Bestands-Beta-Nutzer (premium ohne Quelle): großzügige Übergangsfrist,
    // danach geht es mit Gutschein-Code oder Zahlung weiter.
    if (s.premium && !s.plusSource) {
      s.plusSource = 'beta'
      s.plusUntilISO = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
    }
    // Abgelaufen? Plus-Funktionen einschränken (der sanfte Hinweis kommt im Dashboard).
    if (s.premium && s.plusUntilISO && s.plusUntilISO < today) {
      s.premium = false
    }
    return state
  } catch {
    return state // Migration darf nie Daten kosten
  }
}

// Themen-Umbenennung „Schule & Lernen" → „Lernen & Wachstum" (Positionierung).
// Bestandsdaten (Profil-Themen + Tagebucheinträge) werden beim Laden migriert,
// damit Sternbild-Regeln und Monatsbild weiter zusammenpassen.
const THEME_RENAMES = { 'Schule & Lernen': 'Lernen & Wachstum' }

function migrateThemes(state) {
  try {
    const ren = (t) => THEME_RENAMES[t] || t
    if (state.profile?.themes?.some((t) => THEME_RENAMES[t])) {
      state.profile.themes = state.profile.themes.map(ren)
    }
    if (state.journal?.some((e) => THEME_RENAMES[e.theme])) {
      state.journal = state.journal.map((e) => (THEME_RENAMES[e.theme] ? { ...e, theme: ren(e.theme) } : e))
    }
    return state
  } catch {
    return state // Migration darf nie Daten kosten
  }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  // Spiegel des aktuellen Zustands für synchrone Berechnungen (z. B. Sternbild-Unlock).
  const stateRef = useRef(state)
  stateRef.current = state

  // Dauerhafte Speicherung anfordern: schützt v. a. auf iOS davor, dass der
  // Browser den lokalen Speicher (das Tagebuch!) nach Inaktivität aufräumt.
  useEffect(() => {
    try {
      navigator.storage?.persist?.().catch(() => {})
    } catch {
      /* ältere Browser */
    }
    // Erster App-Start einmalig festhalten (auch bei Bestandsnutzern ab jetzt)
    setState((s) => (s.stats.installISO ? s : { ...s, stats: { ...s.stats, installISO: formatDate().iso } }))
  }, [])

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
    // Befinden wurde im Onboarding erfragt → zählt als heutige Abfrage.
    const today = formatDate().iso
    setState((s) => {
      // Jugendschutz: unter 16 startet der KI-Modus ausgeschaltet –
      // Erziehungsberechtigte können ihn in den Einstellungen aktivieren.
      const minor = isUnder16(profile?.birth ?? s.profile.birth)
      return {
        ...s,
        onboarded: true,
        profile: { ...s.profile, ...profile },
        stats: { ...s.stats, moodTodayISO: today },
        settings: minor ? { ...s.settings, aiMode: false, aiConsent: false } : s.settings,
      }
    })
  }, [])

  const updateProfile = useCallback((p) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }))
  }, [])

  const updateSettings = useCallback((p) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...p } }))
  }, [])

  // Tägliches Befinden: setzt die Stimmung (fließt in die Botschaft ein) und
  // merkt sich den Tag, damit die Abfrage nur einmal pro Tag erscheint.
  const setMoodToday = useCallback((mood) => {
    const today = formatDate().iso
    setState((s) => ({
      ...s,
      profile: { ...s.profile, mood },
      stats: { ...s.stats, moodTodayISO: today },
    }))
  }, [])

  // Hat der/die Nutzer*in heute schon gezogen?
  const drawnToday = useMemo(() => {
    const today = formatDate().iso
    return state.stats.lastDrawISO === today
  }, [state.stats.lastDrawISO])

  // Wurde das Befinden heute schon abgefragt?
  const moodToday = useMemo(() => {
    return state.stats.moodTodayISO === formatDate().iso
  }, [state.stats.moodTodayISO])

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

      // Sternbilder entstehen jetzt durch Reflexionen (constellationStatus),
      // nicht mehr durch die Serie — hier keine Freischaltung mehr.
      const constellation = false
      const constellationsDone = s.stats.constellationsDone

      const drawDays = already
        ? s.stats.drawDays
        : [...new Set([...(s.stats.drawDays || []), today])].slice(-60)

      const entryId = `${Date.now()}`
      const entry = {
        id: entryId,
        ts: Date.now(),
        iso: today,
        mid: message.id,
        title: message.title,
        symbol: message.symbol,
        constellation: message.constellation,
        theme: message.theme,
        mantra: message.mantra,
        text: message.text,
        // Generierte Botschaften stehen nicht in MESSAGES → volle Felder mitspeichern,
        // damit Wiederansicht & Detailseite unabhängig funktionieren.
        luck: message.luck ?? null,
        energy: message.energy ?? null,
        question: message.reflection ?? null, // Reflexionsfrage (NICHT die Nutzer-Notiz)
        ritual: message.ritual ?? 'wuerfel',
        archetype: message.archetype ?? null, // Würfel: {name, glyph, kern, impuls}
        card: message.card ?? null, // Karten: {title, glyph, deutung, thema}
        runes: message.runes ?? null, // Runen: [{name, glyph, bedeutung, heute, position}]
        mood: s.profile.mood ?? null, // damalige Stimmung (für Wochen-/Monatsmuster)
        reflection: reflection || '', // Nutzer-Notiz
      }

      result = {
        id: entryId,
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

  // Rückkehr nach Pause: erkannt, wenn zuletzt vor mehr als „gestern" gezogen wurde
  const yesterdayISO = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const pausedReturn =
    state.journal.length > 0 &&
    state.stats.lastDrawISO &&
    state.stats.lastDrawISO !== formatDate().iso &&
    state.stats.lastDrawISO !== yesterdayISO &&
    state.seenReturnISO !== formatDate().iso

  const markReturnSeen = useCallback(() => {
    setState((s) => ({ ...s, seenReturnISO: formatDate().iso }))
  }, [])

  // Reflexion eines vorhandenen Eintrags nachträglich setzen (kein Duplikat).
  // Liefert den Namen eines dadurch NEU vollendeten Sternbilds zurück (oder null).
  // Wichtig: synchron aus stateRef berechnet – der setState-Updater läuft
  // in React 18 nicht garantiert vor dem return.
  const updateReflection = useCallback((id, reflection) => {
    const s = stateRef.current
    const trimmed = (reflection || '').trim()
    const nextJournal = s.journal.map((e) => (e.id === id ? { ...e, reflection: trimmed } : e))
    const before = constellationStatus(s.journal)
    const after = constellationStatus(nextJournal)
    let unlockedName = null
    if (after.done > before.done) {
      const beforeNames = new Set(before.list.filter((c) => c.unlocked).map((c) => c.name))
      unlockedName = after.list.find((c) => c.unlocked && !beforeNames.has(c.name))?.name || null
    }
    setState((cur) => ({
      ...cur,
      journal: cur.journal.map((e) => (e.id === id ? { ...e, reflection: trimmed } : e)),
    }))
    return unlockedName
  }, [])

  // Einzelnen Tagebuch-Eintrag löschen
  const deleteEntry = useCallback((id) => {
    setState((s) => ({ ...s, journal: s.journal.filter((e) => e.id !== id) }))
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
      setMoodToday,
      saveEntry,
      updateReflection,
      deleteEntry,
      dismissReward,
      markReturnSeen,
      pausedReturn,
      resetAll,
      drawnToday,
      moodToday,
      rank: rankInfo(state.stats.stardust),
    }),
    [
      state,
      patch,
      completeOnboarding,
      updateProfile,
      updateSettings,
      setMoodToday,
      saveEntry,
      updateReflection,
      deleteEntry,
      dismissReward,
      markReturnSeen,
      pausedReturn,
      resetAll,
      drawnToday,
      moodToday,
    ]
  )

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
