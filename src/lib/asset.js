// Zentrale Asset-URL-Auflösung.
// __ASSET_BASE__ wird per Vite-`define` gesetzt:
//   • Dev-Server        → '/'                (npm run dev)
//   • GitHub-Pages-Build→ '/sternenorakel/'  (npm run build)
//   • Standalone-Build  → ''                 (Bilder werden als Data-URI eingebettet)
// So funktionieren dieselben Pfade in allen drei Umgebungen.
const BASE = typeof __ASSET_BASE__ !== 'undefined' ? __ASSET_BASE__ : '/'

export const asset = (path = '') => BASE + String(path).replace(/^\/+/, '')
