import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

// Telefon-Hülle mit unterer Navigation (Tab-Screens)
export function TabLayout() {
  const loc = useLocation()
  return (
    <div className="phone">
      <div className="screen">
        <div key={loc.pathname} className="screen-scroll route-fade">
          <Outlet />
        </div>
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
  return (
    <div className="phone">
      <div key={loc.pathname} className="screen route-fade">
        <div className="screen-scroll screen--plain">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
