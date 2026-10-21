export type Role = 'client' | 'interpreter'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  salt: string
  passwordHash: string
  createdAt: number
}

/** Public view of a user — never exposes salt/passwordHash. */
export interface SafeUser {
  id: string
  name: string
  email: string
  role: Role
  createdAt: number
}

export type CommunicationMode = 'in-person' | 'video' | 'either'

export interface InterpreterProfile {
  userId: string
  displayName: string
  headline: string
  bio: string
  /** Codes from SIGN_LANGUAGES plus any free-text "other" entries. */
  signLanguages: string[]
  otherLanguages: string
  specializations: string[]
  experienceYears: number
  hourlyRate: number
  currency: string
  location: string
  modes: CommunicationMode
  avatarColor: string
  availabilityNote: string
  acceptingBookings: boolean
  updatedAt: number
}

export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  clientId: string
  interpreterId: string
  eventType: string
  signLanguage: string
  mode: CommunicationMode
  date: string
  startTime: string
  durationHours: number
  location: string
  notes: string
  status: BookingStatus
  createdAt: number
}
