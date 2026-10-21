import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getProfile, saveProfile } from '@/lib/db'
import { AVATAR_COLORS, SIGN_LANGUAGES, SPECIALIZATIONS } from '@/lib/signLanguages'
import type { CommunicationMode, InterpreterProfile } from '@/lib/types'

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

const MODES: { value: CommunicationMode; label: string }[] = [
  { value: 'in-person', label: 'In person' },
  { value: 'video', label: 'Video call' },
  { value: 'either', label: 'Either' },
]

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [signLanguages, setSignLanguages] = useState<string[]>([])
  const [otherLanguages, setOtherLanguages] = useState('')
  const [specializations, setSpecializations] = useState<string[]>([])
  const [experienceYears, setExperienceYears] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [location, setLocation] = useState('')
  const [modes, setModes] = useState<CommunicationMode>('either')
  const [availabilityNote, setAvailabilityNote] = useState('')
  const [acceptingBookings, setAcceptingBookings] = useState(true)
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[1])
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    const existing = getProfile(user.id)
    if (existing) {
      setDisplayName(existing.displayName)
      setHeadline(existing.headline)
      setBio(existing.bio)
      setSignLanguages(existing.signLanguages)
      setOtherLanguages(existing.otherLanguages)
      setSpecializations(existing.specializations)
      setExperienceYears(String(existing.experienceYears))
      setHourlyRate(String(existing.hourlyRate))
      setCurrency(existing.currency)
      setLocation(existing.location)
      setModes(existing.modes)
      setAvailabilityNote(existing.availabilityNote)
      setAcceptingBookings(existing.acceptingBookings)
      setAvatarColor(existing.avatarColor)
    } else {
      setDisplayName(user.name)
    }
  }, [user])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!user) return
    if (!displayName.trim()) return setError('Please add a display name.')
    if (signLanguages.length === 0 && !otherLanguages.trim()) {
      return setError('Pick at least one sign language you interpret.')
    }

    const profile: InterpreterProfile = {
      userId: user.id,
      displayName: displayName.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      signLanguages,
      otherLanguages: otherLanguages.trim(),
      specializations,
      experienceYears: Math.max(0, Number(experienceYears) || 0),
      hourlyRate: Math.max(0, Number(hourlyRate) || 0),
      currency,
      location: location.trim(),
      modes,
      avatarColor,
      availabilityNote: availabilityNote.trim(),
      acceptingBookings,
      updatedAt: Date.now(),
    }
    saveProfile(profile)
    setSaved(true)
    setTimeout(() => navigate('/dashboard'), 600)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Your interpreter profile</h1>
        <p className="text-ink/60">
          Tell clients about the sign languages you know and how you can help.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-peach/40 px-4 py-3 text-sm font-bold text-orange-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-2xl bg-mint/40 px-4 py-3 text-sm font-bold text-emerald-700">
          Profile saved! Taking you to your dashboard…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="ic-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink">About you</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="displayName" className="ic-label">
                Display name
              </label>
              <input
                id="displayName"
                className="ic-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="ic-label">
                Location
              </label>
              <input
                id="location"
                className="ic-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>
          <div>
            <label htmlFor="headline" className="ic-label">
              Headline
            </label>
            <input
              id="headline"
              className="ic-input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Certified ISL & ASL interpreter for medical and legal settings"
            />
          </div>
          <div>
            <label htmlFor="bio" className="ic-label">
              About / bio
            </label>
            <textarea
              id="bio"
              className="ic-input min-h-[96px] resize-y"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your experience, approach, and what clients can expect."
            />
          </div>
          <div>
            <span className="ic-label">Avatar color</span>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAvatarColor(c)}
                  className={`h-9 w-9 rounded-xl border-2 transition ${
                    avatarColor === c ? 'border-ink/40 scale-110' : 'border-white'
                  }`}
                  style={{ background: c }}
                  aria-label={`Pick color ${c}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="ic-card space-y-4 p-6">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Sign languages</h2>
            <p className="text-sm text-ink/60">Select every sign language you interpret.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {SIGN_LANGUAGES.map((lang) => {
              const active = signLanguages.includes(lang.code)
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSignLanguages((l) => toggle(l, lang.code))}
                  className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition ${
                    active
                      ? 'border-lavender bg-lavender/15'
                      : 'border-purple-100 bg-white/60 hover:border-lavender/60'
                  }`}
                  aria-pressed={active}
                >
                  <span className="font-bold text-ink">{lang.label}</span>
                  <span className="text-lg" aria-hidden>
                    {active ? '✅' : '➕'}
                  </span>
                </button>
              )
            })}
          </div>
          <div>
            <label htmlFor="otherLanguages" className="ic-label">
              Other sign languages (optional)
            </label>
            <input
              id="otherLanguages"
              className="ic-input"
              value={otherLanguages}
              onChange={(e) => setOtherLanguages(e.target.value)}
              placeholder="e.g. Nepali Sign Language, tactile signing"
            />
          </div>
        </section>

        <section className="ic-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink">Specializations</h2>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map((spec) => {
              const active = specializations.includes(spec)
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSpecializations((l) => toggle(l, spec))}
                  className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition ${
                    active
                      ? 'border-mint bg-mint/40 text-emerald-700'
                      : 'border-purple-100 bg-white/60 text-ink/70 hover:border-mint'
                  }`}
                  aria-pressed={active}
                >
                  {spec}
                </button>
              )
            })}
          </div>
        </section>

        <section className="ic-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink">Availability &amp; rate</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="experienceYears" className="ic-label">
                Years of experience
              </label>
              <input
                id="experienceYears"
                type="number"
                min={0}
                className="ic-input"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="5"
              />
            </div>
            <div>
              <label htmlFor="hourlyRate" className="ic-label">
                Hourly rate
              </label>
              <input
                id="hourlyRate"
                type="number"
                min={0}
                className="ic-input"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="60"
              />
            </div>
            <div>
              <label htmlFor="currency" className="ic-label">
                Currency
              </label>
              <select
                id="currency"
                className="ic-input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>
          <div>
            <span className="ic-label">How do you interpret?</span>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setModes(m.value)}
                  className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition ${
                    modes === m.value
                      ? 'border-sky bg-sky/40 text-sky-800'
                      : 'border-purple-100 bg-white/60 text-ink/70 hover:border-sky'
                  }`}
                  aria-pressed={modes === m.value}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="availabilityNote" className="ic-label">
              Availability note (optional)
            </label>
            <input
              id="availabilityNote"
              className="ic-input"
              value={availabilityNote}
              onChange={(e) => setAvailabilityNote(e.target.value)}
              placeholder="Weekdays after 3pm, weekends flexible"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white/60 px-4 py-3">
            <input
              type="checkbox"
              className="h-5 w-5 accent-purple-500"
              checked={acceptingBookings}
              onChange={(e) => setAcceptingBookings(e.target.checked)}
            />
            <span className="font-bold text-ink">I am currently accepting new bookings</span>
          </label>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="ic-btn-primary text-base">
            Save profile
          </button>
        </div>
      </form>
    </div>
  )
}
