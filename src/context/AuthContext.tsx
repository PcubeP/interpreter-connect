import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getCurrentUser,
  signIn as doSignIn,
  signOut as doSignOut,
  signUp as doSignUp,
} from '@/lib/auth'
import { getSessionUserId } from '@/lib/db'
import type { AuthResult } from '@/lib/auth'
import type { Role, SafeUser } from '@/lib/types'

interface AuthContextValue {
  user: SafeUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (name: string, email: string, password: string, role: Role) => Promise<AuthResult>
  signOut: () => void
  refresh: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getCurrentUser(getSessionUserId()))
    setLoading(false)
  }, [])

  const refresh = useCallback(() => {
    setUser(getCurrentUser(getSessionUserId()))
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await doSignIn(email, password)
    if (result.ok && result.user) setUser(result.user)
    return result
  }, [])

  const signUp = useCallback(
    async (name: string, email: string, password: string, role: Role) => {
      const result = await doSignUp(name, email, password, role)
      if (result.ok && result.user) setUser(result.user)
      return result
    },
    [],
  )

  const signOut = useCallback(() => {
    doSignOut()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refresh }),
    [user, loading, signIn, signUp, signOut, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
