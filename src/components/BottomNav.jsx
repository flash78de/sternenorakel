import { NavLink } from 'react-router-dom'
import { IcStart, IcOracle, IcBook, IcMoon, IcUser } from './icons.jsx'

const TABS = [
  { to: '/dashboard', label: 'Start', Icon: IcStart },
  { to: '/oracle', label: 'Orakel', Icon: IcOracle },
  { to: '/wissen', label: 'Wissen', Icon: IcBook },
  { to: '/tagebuch', label: 'Tagebuch', Icon: IcMoon },
  { to: '/profil', label: 'Profil', Icon: IcUser },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          {({ isActive }) => (
            <>
              <Icon c={isActive ? '#E8C77A' : '#8a83a6'} />
              <span>{label}</span>
              {isActive && <span className="dot" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
