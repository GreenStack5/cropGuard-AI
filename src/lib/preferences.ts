export interface AppPreferences {
  name: string
  language: string
  reduceMotion: boolean
}

const KEY = 'cropguard:preferences'
export const PREFERENCES_UPDATED = 'cropguard:preferences-updated'

const defaults: AppPreferences = {
  name: 'Amara Okafor',
  language: 'English',
  reduceMotion: false,
}

export function readPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<AppPreferences>) } : defaults
  } catch {
    return defaults
  }
}

export function savePreferences(prefs: AppPreferences): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
    window.dispatchEvent(new CustomEvent(PREFERENCES_UPDATED))
  } catch {
    // Ignore when storage is unavailable.
  }
}

export function subscribePreferences(callback: (prefs: AppPreferences) => void): () => void {
  const handler = () => callback(readPreferences())
  window.addEventListener(PREFERENCES_UPDATED, handler)
  return () => window.removeEventListener(PREFERENCES_UPDATED, handler)
}