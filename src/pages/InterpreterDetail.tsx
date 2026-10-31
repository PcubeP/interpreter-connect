import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, Chip, EmptyState } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { getProfile, saveBooking } from '@/lib/db'
import { generateId } from '@/lib/crypto'
import { EVENT_TYPES, labelForLanguage } from '@/lib/signLanguages'
import type { Booking, CommunicationMode } from '@/lib/types'

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: '$',
  INR: '₹',
  GBP: '£',
  EUR: '€',
  AUD: '$',
}

const MODE_LABEL: Record<CommunicationMode, string> = {
  'in-person': 'In person',
  video: 'Video call',
  either: 'In person or video',
}

export default function InterpreterDetail() {
  const { id = '' } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const profile = useMemo(() => getProfile(id), [id])

  // First option the sign-language <select> actually renders: a real sign
  // language if the interpreter lists any, otherwise the first free-text
  // "other" language. Defaulting state to this keeps the recorded value in
  // sync with what the browser shows selected when the user never opens it.
  const firstLanguageOption = useMemo(() => {
    if (!profile) return ''
    const other = profile.otherLanguages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    return profile.signLanguages[0] ?? other[0] ?? ''
  }, [profile])

  const [eventType, setEventType] = useState(EVENT_TYPES[0])
  const [signLanguage, setSignLanguage] = useState(firstLanguageOption)
  const [mode, setMode] = useState<CommunicationMode>('in-person')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [durationHours, setDurationHours] = useState('1')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // Reset the selection to the first rendered option when the viewed
  // interpreter changes.
  useEffect(() => {
    setSignLanguage(firstLanguageOption)
  }, [firstLanguageOption])

  if (!profile) {
    return (
      <EmptyState emoji="🤷" title="Interpreter not found" subtitle="This profile may have been removed.">
        <Link to="/browse" className="ic-btn-primary">
          Back to browse
        </Link>
      </EmptyState>
    )
  }

  const symbol = CURRENCY_SYMBOL[profile.currency] ?? ''
  const isOwnProfile = user?.id === profile.userId
  const otherLangs = profile.otherLanguages
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  function handleBooking(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!user || !profile) return
    if (!date) return setError('Please choose a date.')
    if (!startTime) return setError('Please choose a start time.')
    const dur = Number(durationHours)
    if (!dur || dur <= 0) return setError('Please enter a valid duration.')

    const booking: Booking = {
      id: generateId(),
      clientId: user.id,
      interpreterId: profile.userId,
      eventType,
      signLanguage: signLanguage || profile.signLanguages[0] || 'Not specified',
      mode,
      date,
      startTime,
      durationHours: dur,
      location: location.trim(),
      notes: notes.trim(),
      status: 'pending',
      createdAt: Date.now(),
    }
    saveBooking(booking)
    setDone(true)
    setTimeout(() => navigate('/dashboard'), 900)
  }

  return (
    <div className="space-y-6">
      <Link to="/browse" className="text-sm font-bold text-purple-500 hover:underline">
        ← Back to browse
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <section className="ic-card p-6">
            <div className="flex items-start gap-4">
              <Avatar name={profile.displayName} color={profile.avatarColor} size={72} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-ink">{profile.displayName}</h1>
                  {profile.acceptingBookings ? (
                    <Chip tone="mint">Available</Chip>
                  ) : (
                    <Chip tone="peach">Not booking</Chip>
                  )}
                </div>
                {profile.headline && <p className="text-ink/70">{profile.headline}</p>}
                <p className="mt-1 text-sm text-ink/50">
                  {profile.location || 'Location not set'} · {MODE_LABEL[profile.modes]}
                  {profile.experienceYears > 0 && ` · ${profile.experienceYears} yr experience`}
                </p>
              </div>
            </div>

            {profile.bio && <p className="mt-5 whitespace-pre-line text-ink/80">{profile.bio}</p>}

            <div className="mt-5 space-y-4">
              <div>
                <h2 className="ic-label">Sign languages</h2>
                <div className="flex flex-wrap gap-1.5">
                  {profile.signLanguages.map((code) => (
                    <Chip key={code} tone="lavender">
                      {labelForLanguage(code)}
                    </Chip>
                  ))}
                  {otherLangs.map((o) => (
                    <Chip key={o} tone="sky">
                      {o}
                    </Chip>
                  ))}
                </div>
              </div>

              {profile.specializations.length > 0 && (
                <div>
                  <h2 className="ic-label">Specializations</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.specializations.map((s) => (
                      <Chip key={s} tone="mint">
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {profile.availabilityNote && (
                <div>
                  <h2 className="ic-label">Availability</h2>
                  <p className="text-ink/70">{profile.availabilityNote}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section className="ic-card sticky top-24 p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-xl font-bold text-ink">Request a booking</h2>
              <span className="font-display font-bold text-purple-600">
                {profile.hourlyRate > 0 ? `${symbol}${profile.hourlyRate}/hr` : ''}
              </span>
            </div>

            {done ? (
              <div className="rounded-2xl bg-mint/40 px-4 py-6 text-center font-bold text-emerald-700">
                🎉 Request sent! Redirecting to your dashboard…
              </div>
            ) : !user ? (
              <div className="space-y-3 text-center">
                <p className="text-ink/60">Log in as a client to send a booking request.</p>
                <Link to="/login" className="ic-btn-primary w-full">
                  Log in to book
                </Link>
                <Link to="/signup" className="ic-btn-ghost w-full">
                  Create an account
                </Link>
              </div>
            ) : isOwnProfile ? (
              <div className="space-y-3 text-center text-ink/60">
                <p>This is your own profile.</p>
                <Link to="/onboarding" className="ic-btn-ghost w-full">
                  Edit my profile
                </Link>
              </div>
            ) : user.role === 'interpreter' ? (
              <p className="text-center text-ink/60">
                You are signed in as an interpreter. Switch to a client account to book.
              </p>
            ) : (
              <form onSubmit={handleBooking} className="space-y-3">
                {error && (
                  <div className="rounded-2xl bg-peach/40 px-3 py-2 text-sm font-bold text-orange-700">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="eventType" className="ic-label">
                    Event type
                  </label>
                  <select
                    id="eventType"
                    className="ic-input"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="bookLanguage" className="ic-label">
                    Sign language needed
                  </label>
                  <select
                    id="bookLanguage"
                    className="ic-input"
                    value={signLanguage}
                    onChange={(e) => setSignLanguage(e.target.value)}
                  >
                    {profile.signLanguages.map((code) => (
                      <option key={code} value={code}>
                        {labelForLanguage(code)}
                      </option>
                    ))}
                    {otherLangs.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="date" className="ic-label">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      className="ic-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="startTime" className="ic-label">
                      Start time
                    </label>
                    <input
                      id="startTime"
                      type="time"
                      className="ic-input"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="duration" className="ic-label">
                      Hours
                    </label>
                    <input
                      id="duration"
                      type="number"
                      min={0.5}
                      step={0.5}
                      className="ic-input"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="mode" className="ic-label">
                      Mode
                    </label>
                    <select
                      id="mode"
                      className="ic-input"
                      value={mode}
                      onChange={(e) => setMode(e.target.value as CommunicationMode)}
                    >
                      <option value="in-person">In person</option>
                      <option value="video">Video call</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="bookLocation" className="ic-label">
                    Location / link
                  </label>
                  <input
                    id="bookLocation"
                    className="ic-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Address or video call link"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="ic-label">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    className="ic-input min-h-[70px] resize-y"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything the interpreter should know in advance."
                  />
                </div>
                <button
                  type="submit"
                  className="ic-btn-primary w-full"
                  disabled={!profile.acceptingBookings}
                >
                  {profile.acceptingBookings ? 'Send booking request' : 'Not accepting bookings'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
