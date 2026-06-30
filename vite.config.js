import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Sternenorakel — mobil-first, installierbare PWA (local-first)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['uploads/luna-icon.png'],
      manifest: {
        name: 'Sternenorakel',
        short_name: 'Sternenorakel',
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
})
