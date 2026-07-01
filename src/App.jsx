import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/store.jsx'
import { TabLayout, PlainLayout } from './components/Layout.jsx'

import Welcome from './screens/Welcome.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Auth from './screens/Auth.jsx'
import AccountVariant from './screens/AccountVariant.jsx'
import Dashboard from './screens/Dashboard.jsx'
import OracleRitual from './screens/OracleRitual.jsx'
import OracleDraw from './screens/OracleDraw.jsx'
import Wissen from './screens/Wissen.jsx'
import Tagebuch from './screens/Tagebuch.jsx'
import Profil from './screens/Profil.jsx'
import Settings from './screens/Settings.jsx'
import Privacy from './screens/Privacy.jsx'

// Schützt Tab-Bereich, bis Onboarding abgeschlossen ist.
function Gate({ children }) {
  const { onboarded } = useStore()
  if (!onboarded) return <Navigate to="/welcome" replace />
  return children
}

export default function App() {
  const { onboarded } = useStore()

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={onboarded ? '/dashboard' : '/welcome'} replace />}
      />

      {/* Onboarding & Auth — ohne Navigation */}
      <Route element={<PlainLayout />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/account" element={<AccountVariant />} />
        <Route
          path="/oracle/draw"
          element={
            <Gate>
              <OracleDraw />
            </Gate>
          }
        />
        <Route
          path="/profil/settings"
          element={
            <Gate>
              <Settings />
            </Gate>
          }
        />
      </Route>

      {/* Tab-Bereich — mit unterer Navigation */}
      <Route
        element={
          <Gate>
            <TabLayout />
          </Gate>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/oracle" element={<OracleRitual />} />
        <Route path="/wissen" element={<Wissen />} />
        <Route path="/tagebuch" element={<Tagebuch />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/profil/privacy" element={<Privacy />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
