import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, EmptyState, StatusBadge } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import {
  getBookingById,
  getBookingsForClient,
  getBookingsForInterpreter,
  getProfile,
  getUserById,
  saveBooking,
} from '@/lib/db'
import { labelForLanguage } from '@/lib/signLanguages'
import type { Booking, BookingStatus } from '@/lib/types'

function formatWhen(date: string, time: string): string {
  if (!date) return 'Date TBD'
  const d = new Date(`${date}T${time || '00:00'}`)
  if (Number.isNaN(d.getTime())) return `${date} ${time}`.trim()
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(time ? { hour: 'numeric', minute: '2-digit' } : {}),
  })
}

interface Row {
  booking: Booking
  counterpartyName: string
  counterpartyColor: string
}

function BookingRow({
  row,
  perspective,
  onUpdate,
}: {
  row: Row
  perspective: 'client' | 'interpreter'
  onUpdate: (id: string, status: BookingStatus) => void
}) {
  const { booking } = row
  return (
    <div className="ic-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={row.counterpartyName} color={row.counterpartyColor} size={44} />
          <div>
            <p className="font-display font-bold text-ink">{row.counterpartyName}</p>
            <p className="text-sm text-ink/60">{booking.eventType}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <dl className="mt-4 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-bold text-ink/50">When</dt>
          <dd className="text-ink/80">{formatWhen(booking.date, booking.startTime)}</dd>
        </div>
        <div>
          <dt className="font-bold text-ink/50">Duration</dt>
          <dd className="text-ink/80">
            {booking.durationHours} hr · {booking.mode === 'video' ? 'Video' : 'In person'}
          </dd>
        </div>
        <div>
          <dt className="font-bold text-ink/50">Sign language</dt>
          <dd className="text-ink/80">{labelForLanguage(booking.signLanguage)}</dd>
        </div>
        {booking.location && (
          <div>
            <dt className="font-bold text-ink/50">Location / link</dt>
            <dd className="break-words text-ink/80">{booking.location}</dd>
          </div>
        )}
      </dl>

      {booking.notes && (
        <p className="mt-3 rounded-2xl bg-white/70 px-4 py-2 text-sm text-ink/70">
          “{booking.notes}”
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {perspective === 'interpreter' && booking.status === 'pending' && (
          <>
            <button
              onClick={() => onUpdate(booking.id, 'accepted')}
              className="ic-btn-primary px-4 py-2 text-sm"
            >
              Accept
            </button>
            <button
              onClick={() => onUpdate(booking.id, 'declined')}
              className="ic-btn-ghost px-4 py-2 text-sm"
            >
              Decline
            </button>
          </>
        )}
        {perspective === 'interpreter' && booking.status === 'accepted' && (
          <button
            onClick={() => onUpdate(booking.id, 'completed')}
            className="ic-btn-ghost px-4 py-2 text-sm"
          >
            Mark completed
          </button>
        )}
        {perspective === 'client' &&
          (booking.status === 'pending' || booking.status === 'accepted') && (
            <button
              onClick={() => onUpdate(booking.id, 'cancelled')}
              className="ic-btn-ghost px-4 py-2 text-sm"
            >
              Cancel request
            </button>
          )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [version, setVersion] = useState(0)

  const handleUpdate = useCallback((id: string, status: BookingStatus) => {
    const target = getBookingById(id)
    if (target) {
      saveBooking({ ...target, status })
      setVersion((v) => v + 1)
    }
  }, [])

  const rows = useMemo<Row[]>(() => {
    if (!user) return []
    void version
    if (user.role === 'interpreter') {
      return getBookingsForInterpreter(user.id)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((booking) => {
          const client = getUserById(booking.clientId)
          return {
            booking,
            counterpartyName: client?.name ?? 'Client',
            counterpartyColor: '#a7d8f0',
          }
        })
    }
    return getBookingsForClient(user.id)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((booking) => {
        const profile = getProfile(booking.interpreterId)
        return {
          booking,
          counterpartyName: profile?.displayName ?? 'Interpreter',
          counterpartyColor: profile?.avatarColor ?? '#c8b6ff',
        }
      })
  }, [user, version])

  if (!user) return null

  const isInterpreter = user.role === 'interpreter'
  const profile = isInterpreter ? getProfile(user.id) : undefined
  const pendingCount = rows.filter((r) => r.booking.status === 'pending').length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Hi {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-ink/60">
            {isInterpreter
              ? 'Here are your incoming booking requests.'
              : 'Here are the interpreters you have requested.'}
          </p>
        </div>
        {isInterpreter ? (
          <Link to="/onboarding" className="ic-btn-ghost">
            Edit my profile
          </Link>
        ) : (
          <Link to="/browse" className="ic-btn-primary">
            Find an interpreter
          </Link>
        )}
      </div>

      {isInterpreter && !profile && (
        <div className="ic-card flex flex-wrap items-center justify-between gap-4 bg-butter/30 p-6">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Finish your profile ✨</h2>
            <p className="text-ink/60">
              Clients can only find and book you once your profile is complete.
            </p>
          </div>
          <Link to="/onboarding" className="ic-btn-primary">
            Complete profile
          </Link>
        </div>
      )}

      {isInterpreter && profile && (
        <div className="ic-card flex flex-wrap items-center gap-4 p-6">
          <Avatar name={profile.displayName} color={profile.avatarColor} size={56} />
          <div className="flex-1">
            <p className="font-display text-lg font-bold text-ink">{profile.displayName}</p>
            <p className="text-sm text-ink/60">
              {profile.signLanguages.map((c) => labelForLanguage(c)).join(' · ') ||
                'No languages set'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-purple-600">{pendingCount}</p>
            <p className="text-xs font-bold text-ink/50">pending</p>
          </div>
          <Link
            to={`/interpreters/${user.id}`}
            className="ic-btn-ghost px-4 py-2 text-sm"
          >
            View public profile
          </Link>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-ink">
          {isInterpreter ? 'Booking requests' : 'My bookings'}
        </h2>
        {rows.length === 0 ? (
          <EmptyState
            emoji={isInterpreter ? '📭' : '🗓️'}
            title={isInterpreter ? 'No requests yet' : 'No bookings yet'}
            subtitle={
              isInterpreter
                ? 'Once clients request you, their bookings will show up here.'
                : 'Find an interpreter and send your first booking request.'
            }
          >
            {!isInterpreter && (
              <Link to="/browse" className="ic-btn-primary">
                Browse interpreters
              </Link>
            )}
          </EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rows.map((row) => (
              <BookingRow
                key={row.booking.id}
                row={row}
                perspective={isInterpreter ? 'interpreter' : 'client'}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
