import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Browse from '@/pages/Browse'
import InterpreterDetail from '@/pages/InterpreterDetail'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/interpreters/:id" element={<InterpreterDetail />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute role="interpreter">
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-white/60 bg-white/50 py-6 text-center text-sm text-ink/50">
        Made with 💜 for the Deaf &amp; hard-of-hearing community · InterpreterConnect
      </footer>
    </div>
  )
}
