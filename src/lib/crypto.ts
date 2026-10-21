/**
 * Password hashing utilities built on the Web Crypto API (PBKDF2-SHA256).
 *
 * NOTE: This app stores accounts in the browser's localStorage so it can run
 * with no backend. Hashing with a per-user salt and many iterations means raw
 * passwords are never persisted, but client-only storage is not a substitute
 * for a real server with HTTPS and a protected database in production.
 */

const ITERATIONS = 150_000
const KEY_LENGTH = 32 // bytes

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return toHex(bytes.buffer)
}

export function generateId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return toHex(crypto.getRandomValues(new Uint8Array(16)).buffer)
}

export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder()
  const salt = Uint8Array.from(saltHex.match(/.{1,2}/g)!.map((h) => parseInt(h, 16)))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    KEY_LENGTH * 8,
  )
  return toHex(derived)
}

/** Constant-time-ish comparison of two equal-length hex strings. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
