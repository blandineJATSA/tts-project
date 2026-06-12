import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedLayout from '@/components/layout/ProtectedLayout'

// Pages publiques temporaires
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

// Pages privées temporaires
import GeneratorPage from '@/pages/app/GeneratorPage'
const HistoryPage   = () => <div>History Page - Coming soon</div>
const VoicesPage    = () => <div>Voices Page - Coming soon</div>
const FilesPage     = () => <div>Files Page - Coming soon</div>
const SettingsPage  = () => <div>Settings Page - Coming soon</div>
const DataLabPage   = () => <div>Data Lab Page - Coming soon</div>

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Pages publiques */}
        <Route path="/"         element={<LandingPage />}  />
        <Route path="/login"    element={<LoginPage />}    />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages privées — protégées par ProtectedLayout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/app/generate" element={<GeneratorPage />} />
          <Route path="/app/history"  element={<HistoryPage />}   />
          <Route path="/app/voices"   element={<VoicesPage />}    />
          <Route path="/app/files"    element={<FilesPage />}     />
          <Route path="/app/settings" element={<SettingsPage />}  />
          <Route path="/app/datalab"  element={<DataLabPage />}   />
        </Route>

      </Routes>
    </Router>
  )
}