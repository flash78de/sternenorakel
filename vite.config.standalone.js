import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Standalone-Build: bündelt JS + CSS in EINE index.html (ohne PWA/Service-Worker).
// Danach bettet scripts/build-standalone.mjs alle /uploads-Bilder als Base64 ein,
// sodass die fertige standalone.html per Doppelklick (file://) lauffähig ist.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'standalone-dist',
    emptyOutDir: true,
    // Alles inline – singlefile setzt die nötigen Optionen, hier zur Sicherheit:
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
})
