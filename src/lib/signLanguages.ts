export interface SignLanguageOption {
  code: string
  label: string
  short: string
}

/** Curated list of sign languages interpreters can select during onboarding. */
export const SIGN_LANGUAGES: SignLanguageOption[] = [
  { code: 'ISL', label: 'Indian Sign Language', short: 'ISL' },
  { code: 'ASL', label: 'American Sign Language', short: 'ASL' },
  { code: 'BSL', label: 'British Sign Language', short: 'BSL' },
  { code: 'Auslan', label: 'Australian Sign Language (Auslan)', short: 'Auslan' },
  { code: 'LSF', label: 'French Sign Language (LSF)', short: 'LSF' },
  { code: 'IS', label: 'International Sign', short: 'IS' },
]

export const SPECIALIZATIONS: string[] = [
  'Medical & Healthcare',
  'Legal & Court',
  'Education & Classroom',
  'Conferences & Events',
  'Business Meetings',
  'Religious Services',
  'Mental Health',
  'Performing Arts',
]

export const EVENT_TYPES: string[] = [
  'Medical appointment',
  'Legal appointment',
  'Classroom / Lecture',
  'Conference / Event',
  'Business meeting',
  'Job interview',
  'Wedding / Ceremony',
  'Community gathering',
  'Other',
]

export function labelForLanguage(code: string): string {
  return SIGN_LANGUAGES.find((l) => l.code === code)?.label ?? code
}

/** Soft pastel palette used for generated avatars. */
export const AVATAR_COLORS: string[] = [
  '#f7b7d2',
  '#c8b6ff',
  '#a7d8f0',
  '#b8e6cf',
  '#ffe6a7',
  '#ffd4bd',
]
