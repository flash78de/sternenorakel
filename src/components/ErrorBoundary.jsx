import { Component } from 'react'
import { asset } from '../lib/asset.js'

// Auffangschirm: Ein unerwarteter Fehler zeigt einen freundlichen Screen
// statt einer weißen Seite. Bewusst OHNE Store/Router – die könnten selbst
// die Fehlerquelle sein. Die lokalen Daten (localStorage) sind nie betroffen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    const build = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px 28px', background: '#0b0a12', color: '#f5f4fa', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <img src={asset('uploads/opt/luna-schlaf-transparent-md.webp')} alt="Luna" style={{ width: 150, height: 'auto' }} />
        <div style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 600, fontSize: 22, color: '#e8c77a', marginTop: 14 }}>
          Luna ist kurz gestolpert.
        </div>
        <div style={{ color: '#b6b0ce', font: '400 13.5px/1.6 inherit', marginTop: 10, maxWidth: 300 }}>
          Etwas ist schiefgelaufen – aber keine Sorge: <b style={{ color: '#f5f4fa' }}>Dein Tagebuch und alle
          Daten sind sicher.</b> Ein Neustart behebt das meistens.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: 24, padding: '14px 30px', border: 'none', borderRadius: 16, background: 'linear-gradient(135deg,#E8C77A,#D9B45A)', color: '#1a1206', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        >
          ✦ Neu starten
        </button>
        <a
          href={`mailto:ml@mittel-bar.com?subject=${encodeURIComponent('Sternenluna – Fehlerbericht')}&body=${encodeURIComponent(`Hallo Marcel,\n\nLuna ist bei mir gestolpert.\n\nWas ich gerade getan habe:\n(bitte kurz beschreiben)\n\n—\nVersion: ${build}`)}`}
          style={{ marginTop: 16, color: '#a66bff', font: '500 12px inherit', textDecoration: 'none' }}
        >
          Fehler melden
        </a>
      </div>
    )
  }
}
