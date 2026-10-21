import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { validatePassword } from '@/lib/auth'
import type { Role } from '@/lib/types'

const ROLE_CARDS: { role: Role; emoji: string; title: string; text: string }[] = [
  {
    role: 'client',
    emoji: '🙋',
    title: 'I need an interpreter',
    text: 'Browse and book interpreters for your events.',
  },
  {
    role: 'interpreter',
    emoji: '🤟',
    title: 'I am an interpreter',
    text: 'Create a profile and receive booking requests.',
  },
]

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<Role>('client')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const pwHint = useMemo(() => (password ? validatePassword(password) : null), [password])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const result = await signUp(name, email, password, role)
      if (result.ok) {
        navigate(role === 'interpreter' ? '/onboarding' : '/browse', { replace: true })
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    } catch {
      setError('We could not create your account right now. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="ic-card p-8">
        <div className="mb-6 text-center">
          <div className="text-4xl" aria-hidden>
            🌸
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Create your account</h1>
          <p className="text-ink/60">Join the InterpreterConnect community.</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {ROLE_CARDS.map((card) => {
            const active = role === card.role
            return (
              <button
                key={card.role}
                type="button"
                onClick={() => setRole(card.role)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  active
                    ? 'border-lavender bg-lavender/15 shadow-soft'
                    : 'border-purple-100 bg-white/60 hover:border-lavender/60'
                }`}
                aria-pressed={active}
              >
                <div className="text-2xl" aria-hidden>
                  {card.emoji}
                </div>
                <div className="mt-1 font-display font-bold text-ink">{card.title}</div>
                <div className="text-xs text-ink/60">{card.text}</div>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-peach/40 px-4 py-3 text-sm font-bold text-orange-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="ic-label">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="ic-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Rivera"
              required
            />
          </div>
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
              autoComplete="new-password"
              className="ic-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
            <p className={`mt-1.5 text-xs ${pwHint ? 'text-orange-600' : 'text-ink/50'}`}>
              {pwHint ?? 'Use 8+ characters with upper, lower, and a number.'}
            </p>
          </div>
          <button type="submit" className="ic-btn-primary w-full" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-purple-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
