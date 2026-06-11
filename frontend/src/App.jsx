import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages temporaires - on les remplacera une par une
const LandingPage = () => <div>Landing Page - Coming soon</div>
const LoginPage = () => <div>Login Page - Coming soon</div>
const RegisterPage = () => <div>Register Page - Coming soon</div>
const GeneratorPage = () => <div>Generator Page - Coming soon</div>
const HistoryPage = () => <div>History Page - Coming soon</div>
const VoicesPage = () => <div>Voices Page - Coming soon</div>
const SettingsPage = () => <div>Settings Page - Coming soon</div>
const DataLabPage = () => <div>Data Lab Page - Coming soon</div>

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages privées - dans l'app */}
        <Route path="/app/generate" element={<GeneratorPage />} />
        <Route path="/app/history" element={<HistoryPage />} />
        <Route path="/app/voices" element={<VoicesPage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/app/datalab" element={<DataLabPage />} />
      </Routes>
    </Router>
  )
}