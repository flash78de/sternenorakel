import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Sternenluna — mobil-first, installierbare PWA (local-first)
// Basis-Pfad: '/' — die App läuft unter der eigenen Domain https://sternenluna.de
// (GitHub Pages mit Custom Domain serviert an der Wurzel; die alte
// github.io-Unterpfad-Adresse leitet automatisch dorthin um).
const BASE = '/'
export default defineConfig(() => ({
  base: BASE,
  define: {
    __ASSET_BASE__: JSON.stringify(BASE),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['uploads/luna-icon.png'],
      manifest: {
        name: 'Sternenluna',
        short_name: 'Sternenluna',
        description:
          'Luna schenkt dir täglich eine persönlich wirkende, reflektierende Botschaft – mit Tagebuch, Habit-Tracking und Sternenband.',
        lang: 'de',
        dir: 'ltr',
        theme_color: '#0B0A12',
        background_color: '#0B0A12',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'uploads/luna-icon.png', sizes: '512x512', type: 'image/png' },
          { src: 'uploads/luna-icon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
}))
