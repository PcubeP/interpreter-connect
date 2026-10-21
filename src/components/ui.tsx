import type { ReactNode } from 'react'
import type { BookingStatus } from '@/lib/types'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'
}

export function Avatar({
  name,
  color,
  size = 48,
}: {
  name: string
  color: string
  size?: number
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-2xl font-display font-bold text-ink shadow-soft"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials(name)}
    </div>
  )
}

const CHIP_STYLES: Record<string, string> = {
  lavender: 'bg-lavender/25 text-purple-700',
  mint: 'bg-mint/40 text-emerald-700',
  sky: 'bg-sky/40 text-sky-800',
  blossom: 'bg-blossom/30 text-pink-700',
  butter: 'bg-butter/50 text-amber-700',
  peach: 'bg-peach/50 text-orange-700',
}

export function Chip({
  children,
  tone = 'lavender',
}: {
  children: ReactNode
  tone?: keyof typeof CHIP_STYLES
}) {
  return <span className={`ic-chip ${CHIP_STYLES[tone]}`}>{children}</span>
}

const STATUS_TONE: Record<BookingStatus, keyof typeof CHIP_STYLES> = {
  pending: 'butter',
  accepted: 'mint',
  declined: 'peach',
  completed: 'sky',
  cancelled: 'peach',
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <Chip tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Chip>
}

export function EmptyState({
  emoji,
  title,
  subtitle,
  children,
}: {
  emoji: string
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="ic-card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="text-5xl" aria-hidden>
        {emoji}
      </div>
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      {subtitle && <p className="max-w-sm text-ink/60">{subtitle}</p>}
      {children}
    </div>
  )
}
