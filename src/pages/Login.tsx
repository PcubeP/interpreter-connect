import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const result = await signIn(email, password)
      if (result.ok) navigate(from, { replace: true })
      else setError(result.error ?? 'Something went wrong.')
    } catch {
      setError('We could not log you in right now. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="ic-card p-8">
        <div className="mb-6 text-center">
          <div className="text-4xl" aria-hidden>
            👋
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Welcome back</h1>
          <p className="text-ink/60">Log in to manage your bookings.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-peach/40 px-4 py-3 text-sm font-bold text-orange-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="ic-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="ic-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="ic-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="ic-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="ic-btn-primary w-full" disabled={busy}>
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          New here?{' '}
          <Link to="/signup" className="font-bold text-purple-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
