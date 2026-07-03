import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/store.jsx'
import { TabLayout, PlainLayout } from './components/Layout.jsx'

import Splash from './screens/Splash.jsx'
import Welcome from './screens/Welcome.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Auth from './screens/Auth.jsx'
import AccountVariant from './screens/AccountVariant.jsx'
import Dashboard from './screens/Dashboard.jsx'
import Befinden from './screens/Befinden.jsx'
import OracleRitual from './screens/OracleRitual.jsx'
import OracleDraw from './screens/OracleDraw.jsx'
import Wissen from './screens/Wissen.jsx'
import Tagebuch from './screens/Tagebuch.jsx'
import JournalEntry from './screens/JournalEntry.jsx'
import Profil from './screens/Profil.jsx'
import Settings from './screens/Settings.jsx'
import Privacy from './screens/Privacy.jsx'
import Sternbilder from './screens/Sternbilder.jsx'
import RankLadder from './screens/RankLadder.jsx'
import Celebration from './screens/Celebration.jsx'
import Rueckkehr from './screens/Rueckkehr.jsx'
import PlusDetail from './screens/PlusDetail.jsx'
import Erinnerung from './screens/Erinnerung.jsx'
import Abend from './screens/Abend.jsx'
import Glueck from './screens/Glueck.jsx'
import Monat from './screens/Monat.jsx'
import Woche from './screens/Woche.jsx'
import Rechtliches from './screens/Rechtliches.jsx'

// Schützt Tab-Bereich, bis Onboarding abgeschlossen ist.
function Gate({ children }) {
  const { onboarded } = useStore()
  if (!onboarded) return <Navigate to="/welcome" replace />
  return children
}

export default function App() {
  const { onboarded, settings } = useStore()
  const [splash, setSplash] = useState(settings.splash !== false)

  if (splash) return <Splash onDone={() => setSplash(false)} />

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
        <Route path="/oracle/befinden" element={<Gate><Befinden /></Gate>} />
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
        <Route path="/tagebuch/:id" element={<Gate><JournalEntry /></Gate>} />
        <Route path="/profil/sternbilder" element={<Gate><Sternbilder /></Gate>} />
        <Route path="/profil/raenge" element={<Gate><RankLadder /></Gate>} />
        <Route path="/feier" element={<Gate><Celebration /></Gate>} />
        <Route path="/rueckkehr" element={<Gate><Rueckkehr /></Gate>} />
        <Route path="/profil/plus" element={<Gate><PlusDetail /></Gate>} />
        <Route path="/profil/erinnerung" element={<Gate><Erinnerung /></Gate>} />
        <Route path="/abend" element={<Gate><Abend /></Gate>} />
        <Route path="/woche" element={<Gate><Woche /></Gate>} />
        <Route path="/monat" element={<Gate><Monat /></Gate>} />
        <Route path="/profil/glueck" element={<Gate><Glueck /></Gate>} />
        {/* Rechtliches bewusst OHNE Gate: Impressum muss immer erreichbar sein */}
        <Route path="/rechtliches" element={<Rechtliches />} />
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
