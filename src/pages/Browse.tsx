import { useMemo, useState } from 'react'
import InterpreterCard from '@/components/InterpreterCard'
import { EmptyState } from '@/components/ui'
import { getProfiles } from '@/lib/db'
import { SIGN_LANGUAGES, SPECIALIZATIONS } from '@/lib/signLanguages'

export default function Browse() {
  const allProfiles = useMemo(() => getProfiles(), [])

  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allProfiles.filter((p) => {
      if (language && !p.signLanguages.includes(language)) return false
      if (specialization && !p.specializations.includes(specialization)) return false
      if (availableOnly && !p.acceptingBookings) return false
      if (q) {
        const haystack = [
          p.displayName,
          p.headline,
          p.bio,
          p.location,
          p.otherLanguages,
          ...p.specializations,
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [allProfiles, query, language, specialization, availableOnly])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Find your interpreter</h1>
        <p className="text-ink/60">
          Filter by sign language and specialization to find the right match.
        </p>
      </div>

      <div className="ic-card grid gap-3 p-5 md:grid-cols-4">
        <div className="md:col-span-2">
          <label htmlFor="search" className="ic-label">
            Search
          </label>
          <input
            id="search"
            className="ic-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, location, keyword…"
          />
        </div>
        <div>
          <label htmlFor="language" className="ic-label">
            Sign language
          </label>
          <select
            id="language"
            className="ic-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">All languages</option>
            {SIGN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="specialization" className="ic-label">
            Specialization
          </label>
          <select
            id="specialization"
            className="ic-input"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All specializations</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 md:col-span-4">
          <input
            type="checkbox"
            className="h-5 w-5 accent-purple-500"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          <span className="text-sm font-bold text-ink/70">Only show interpreters available now</span>
        </label>
      </div>

      {results.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title="No interpreters match yet"
          subtitle={
            allProfiles.length === 0
              ? 'Be the first! Interpreters who sign up and complete a profile will appear here.'
              : 'Try removing a filter or searching for something different.'
          }
        />
      ) : (
        <>
          <p className="text-sm font-bold text-ink/60">
            {results.length} interpreter{results.length === 1 ? '' : 's'} found
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((p) => (
              <InterpreterCard key={p.userId} profile={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
