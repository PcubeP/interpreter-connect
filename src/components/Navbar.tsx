import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Avatar } from './ui'

function navClass({ isActive }: { isActive: boolean }): string {
  return `rounded-xl px-3 py-2 text-sm font-bold transition ${
    isActive ? 'bg-white text-purple-700 shadow-soft' : 'text-ink/70 hover:bg-white/60'
  }`
}

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🤟
          </span>
          <span className="font-display text-lg font-bold text-ink">
            Interpreter<span className="text-purple-500">Connect</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/browse" className={navClass}>
            Find interpreters
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2">
                <Avatar name={user.name} color="#c8b6ff" size={36} />
                <span className="hidden text-sm font-bold text-ink md:inline">{user.name}</span>
              </Link>
              <button onClick={handleSignOut} className="ic-btn-ghost px-3 py-2 text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="ic-btn-ghost px-3 py-2 text-sm">
                Log in
              </Link>
              <Link to="/signup" className="ic-btn-primary px-4 py-2 text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
