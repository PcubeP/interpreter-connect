import { generateId, generateSalt, hashPassword, safeEqual } from './crypto'
import {
  findUserByEmail,
  getUserById,
  saveUser,
  setSessionUserId,
} from './db'
import type { Role, SafeUser, User } from './types'

export interface AuthResult {
  ok: boolean
  error?: string
  user?: SafeUser
}

export function toSafeUser(user: User): SafeUser {
  const { id, name, email, role, createdAt } = user
  return { id, name, email, role, createdAt }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/[a-z]/.test(password)) return 'Include at least one lowercase letter.'
  if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter.'
  if (!/[0-9]/.test(password)) return 'Include at least one number.'
  return null
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: Role,
): Promise<AuthResult> {
  const trimmedName = name.trim()
  const trimmedEmail = email.trim().toLowerCase()

  if (!trimmedName) return { ok: false, error: 'Please enter your name.' }
  if (!EMAIL_RE.test(trimmedEmail)) return { ok: false, error: 'Please enter a valid email address.' }
  if (findUserByEmail(trimmedEmail)) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  const pwError = validatePassword(password)
  if (pwError) return { ok: false, error: pwError }

  const salt = generateSalt()
  const passwordHash = await hashPassword(password, salt)
  const user: User = {
    id: generateId(),
    name: trimmedName,
    email: trimmedEmail,
    role,
    salt,
    passwordHash,
    createdAt: Date.now(),
  }
  saveUser(user)
  setSessionUserId(user.id)
  return { ok: true, user: toSafeUser(user) }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const user = findUserByEmail(email)
  // Always run the hash to reduce timing differences between the "no user" and
  // "wrong password" branches.
  const salt = user?.salt ?? 'ffffffffffffffffffffffffffffffff'
  const candidate = await hashPassword(password, salt)

  if (!user || !safeEqual(candidate, user.passwordHash)) {
    return { ok: false, error: 'Incorrect email or password.' }
  }
  setSessionUserId(user.id)
  return { ok: true, user: toSafeUser(user) }
}

export function signOut(): void {
  setSessionUserId(null)
}

export function getCurrentUser(sessionId: string | null): SafeUser | null {
  if (!sessionId) return null
  const user = getUserById(sessionId)
  return user ? toSafeUser(user) : null
}
