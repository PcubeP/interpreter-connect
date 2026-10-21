import { Link } from 'react-router-dom'
import { Avatar, Chip } from './ui'
import { labelForLanguage } from '@/lib/signLanguages'
import type { InterpreterProfile } from '@/lib/types'

const MODE_LABEL: Record<InterpreterProfile['modes'], string> = {
  'in-person': 'In person',
  video: 'Video',
  either: 'In person · Video',
}

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: '$',
  INR: '₹',
  GBP: '£',
  EUR: '€',
  AUD: '$',
}

export default function InterpreterCard({ profile }: { profile: InterpreterProfile }) {
  const symbol = CURRENCY_SYMBOL[profile.currency] ?? ''
  return (
    <Link
      to={`/interpreters/${profile.userId}`}
      className="ic-card block p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <Avatar name={profile.displayName} color={profile.avatarColor} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-bold text-ink">
              {profile.displayName}
            </h3>
            {profile.acceptingBookings ? (
              <Chip tone="mint">Available</Chip>
            ) : (
              <Chip tone="peach">Busy</Chip>
            )}
          </div>
          {profile.headline && (
            <p className="truncate text-sm text-ink/60">{profile.headline}</p>
          )}
          <p className="mt-0.5 text-xs text-ink/50">
            {profile.location || 'Location not set'} · {MODE_LABEL[profile.modes]}
            {profile.experienceYears > 0 && ` · ${profile.experienceYears} yr exp`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {profile.signLanguages.map((code) => (
          <Chip key={code} tone="lavender">
            {labelForLanguage(code)}
          </Chip>
        ))}
        {profile.otherLanguages &&
          profile.otherLanguages
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((other) => (
              <Chip key={other} tone="sky">
                {other}
              </Chip>
            ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-display font-bold text-purple-600">
          {profile.hourlyRate > 0 ? `${symbol}${profile.hourlyRate}/hr` : 'Rate on request'}
        </span>
        <span className="text-sm font-bold text-purple-500">View profile →</span>
      </div>
    </Link>
  )
}
