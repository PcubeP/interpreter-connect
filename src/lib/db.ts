import type { Booking, InterpreterProfile, User } from './types'

/**
 * Tiny localStorage-backed persistence layer. Each collection is stored as a
 * JSON array under a namespaced key. All reads are defensive so a corrupted or
 * missing key never throws.
 */

const KEYS = {
  users: 'ic:users',
  profiles: 'ic:profiles',
  bookings: 'ic:bookings',
  session: 'ic:session',
} as const

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function write<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// --- Users ---------------------------------------------------------------

export function getUsers(): User[] {
  return read<User>(KEYS.users)
}

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase()
  return getUsers().find((u) => u.email.toLowerCase() === normalized)
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id)
}

export function saveUser(user: User): void {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === user.id)
  if (idx >= 0) users[idx] = user
  else users.push(user)
  write(KEYS.users, users)
}

// --- Session -------------------------------------------------------------

export function getSessionUserId(): string | null {
  try {
    return localStorage.getItem(KEYS.session)
  } catch {
    return null
  }
}

export function setSessionUserId(id: string | null): void {
  if (id) localStorage.setItem(KEYS.session, id)
  else localStorage.removeItem(KEYS.session)
}

// --- Interpreter profiles ------------------------------------------------

export function getProfiles(): InterpreterProfile[] {
  return read<InterpreterProfile>(KEYS.profiles)
}

export function getProfile(userId: string): InterpreterProfile | undefined {
  return getProfiles().find((p) => p.userId === userId)
}

export function saveProfile(profile: InterpreterProfile): void {
  const profiles = getProfiles()
  const idx = profiles.findIndex((p) => p.userId === profile.userId)
  if (idx >= 0) profiles[idx] = profile
  else profiles.push(profile)
  write(KEYS.profiles, profiles)
}

// --- Bookings ------------------------------------------------------------

export function getBookings(): Booking[] {
  return read<Booking>(KEYS.bookings)
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id)
}

export function getBookingsForClient(clientId: string): Booking[] {
  return getBookings().filter((b) => b.clientId === clientId)
}

export function getBookingsForInterpreter(interpreterId: string): Booking[] {
  return getBookings().filter((b) => b.interpreterId === interpreterId)
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings()
  const idx = bookings.findIndex((b) => b.id === booking.id)
  if (idx >= 0) bookings[idx] = booking
  else bookings.push(booking)
  write(KEYS.bookings, bookings)
}
