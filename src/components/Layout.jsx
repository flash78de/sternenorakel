import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

// Wisch-Hinweis: iOS zeigt keine Scrollbalken – ein sanft hüpfender Pfeil
// signalisiert „hier geht es weiter", solange unten noch Inhalt wartet.
// Verschwindet, sobald gescrollt wurde oder nichts überläuft.
function ScrollHinweis({ scrollRef, bottom }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    // Manche Screens bringen ein eigenes, inneres .screen-scroll mit –
    // gesucht wird das Element, das WIRKLICH überläuft.
    let target = null
    const update = () => setShow(Boolean(target) && target.scrollTop < 30)
    const attach = () => {
      const cands = [root, ...root.querySelectorAll('.screen-scroll')]
      const t = cands.find((c) => c.scrollHeight - c.clientHeight > 60) || null
      if (t !== target) {
        target?.removeEventListener('scroll', update)
        target = t
        target?.addEventListener('scroll', update, { passive: true })
      }
      update()
    }
    // Bilder/Fonts laden nach – zweimal verzögert nachmessen
    const t1 = setTimeout(attach, 350)
    const t2 = setTimeout(attach, 1200)
    window.addEventListener('resize', attach)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', attach)
      target?.removeEventListener('scroll', update)
    }
  }, [scrollRef])

  if (!show) return null
  return (
    <div className="scroll-hinweis" style={{ bottom }} aria-hidden="true">
      ⌄
    </div>
  )
}

// Telefon-Hülle mit unterer Navigation (Tab-Screens)
export function TabLayout() {
  const loc = useLocation()
  const scrollRef = useRef(null)
  return (
    <div className="phone">
      <div className="screen">
        <div key={loc.pathname} ref={scrollRef} className="screen-scroll route-fade">
          <Outlet />
        </div>
        <ScrollHinweis key={'h' + loc.pathname} scrollRef={scrollRef} bottom={86} />
        <BottomNav />
      </div>
    </div>
  )
}

// Telefon-Hülle ohne Navigation (Onboarding, Auth, Orakel-Ritual).
// Innerer screen-scroll: Bei fester App-Höhe scrollen zu lange Screens
// intern statt abgeschnitten zu werden; Overlays ankern weiter am .screen.
export function PlainLayout() {
  const loc = useLocation()
  const scrollRef = useRef(null)
  return (
    <div className="phone">
      <div key={loc.pathname} className="screen route-fade">
        <div ref={scrollRef} className="screen-scroll screen--plain">
          <Outlet />
        </div>
        <ScrollHinweis key={'h' + loc.pathname} scrollRef={scrollRef} bottom={20} />
      </div>
    </div>
  )
}
