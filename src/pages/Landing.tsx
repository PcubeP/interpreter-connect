import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { SIGN_LANGUAGES } from '@/lib/signLanguages'

const STEPS = [
  {
    emoji: '🔎',
    title: 'Browse interpreters',
    text: 'Search by sign language, specialization, and location to find the right match.',
  },
  {
    emoji: '📅',
    title: 'Request a booking',
    text: 'Share your event details — date, time, and what you need help with.',
  },
  {
    emoji: '🤝',
    title: 'Connect with confidence',
    text: 'Your interpreter confirms, and you are all set for the big day.',
  },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <span className="ic-chip bg-mint/40 text-emerald-700">
            ✨ Friendly, trusted, and easy to use
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Book a sign-language interpreter for{' '}
            <span className="text-purple-500">any moment</span> that matters.
          </h1>
          <p className="max-w-md text-lg text-ink/70">
            InterpreterConnect brings together skilled sign-language interpreters and the people who
            need them — for appointments, classrooms, events, and everything in between.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/browse" className="ic-btn-primary text-base">
              Find an interpreter
            </Link>
            {!user && (
              <Link to="/signup" className="ic-btn-ghost text-base">
                Join as an interpreter
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {SIGN_LANGUAGES.map((l) => (
              <span key={l.code} className="ic-chip bg-white/70 text-ink/60">
                {l.short}
              </span>
            ))}
          </div>
        </div>

        <div className="ic-card relative overflow-hidden p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blossom/40 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-sky/40 blur-2xl" />
          <div className="relative space-y-4">
            <div className="text-6xl" aria-hidden>
              🤟💬🫶
            </div>
            <p className="font-display text-xl font-bold text-ink">
              “Everyone deserves to be understood.”
            </p>
            <p className="text-ink/60">
              Create an account in seconds. Interpreters build a profile with the sign languages they
              know; clients book in just a few clicks.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-center font-display text-3xl font-bold text-ink">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="ic-card p-6 text-center">
              <div className="mb-3 text-4xl" aria-hidden>
                {s.emoji}
              </div>
              <h3 className="font-display text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-ink/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ic-card grid gap-6 p-8 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-display text-2xl font-bold text-ink">I need an interpreter</h3>
          <p className="text-ink/60">
            Find the perfect interpreter for your event and send a booking request in minutes.
          </p>
          <Link to={user ? '/browse' : '/signup'} className="ic-btn-primary">
            Get started
          </Link>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-2xl font-bold text-ink">I am an interpreter</h3>
          <p className="text-ink/60">
            Showcase the sign languages you know, set your rate, and receive booking requests.
          </p>
          <Link to={user ? '/onboarding' : '/signup'} className="ic-btn-ghost">
            Build your profile
          </Link>
        </div>
      </section>
    </div>
  )
}
