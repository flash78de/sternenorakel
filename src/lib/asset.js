// Zentrale Asset-URL-Auflösung.
// __ASSET_BASE__ wird per Vite-`define` gesetzt:
//   • Dev-Server        → '/'                (npm run dev)
//   • GitHub-Pages-Build→ '/sternenorakel/'  (npm run build)
//   • Standalone-Build  → ''                 (Bilder werden als Data-URI eingebettet)
// So funktionieren dieselben Pfade in allen drei Umgebungen.
const BASE = typeof __ASSET_BASE__ !== 'undefined' ? __ASSET_BASE__ : '/'

// Standalone-Build: scripts/build-standalone.mjs injiziert window.__ASSETS__
// (Pfad → Data-URI). Damit funktionieren auch dynamisch zusammengesetzte
// Bildpfade (Template-Strings) unter file:// ohne Server.
export const asset = (path = '') => {
  const p = String(path).replace(/^\/+/, '')
  if (typeof window !== 'undefined' && window.__ASSETS__ && window.__ASSETS__[p]) {
    return window.__ASSETS__[p]
  }
  return BASE + p
}
