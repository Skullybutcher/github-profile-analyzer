import type { HistoryEntry, ProfileAnalysis } from './types'

const KEY = 'gh-analyzer-history'
const MAX = 24

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export function saveToHistory(profile: ProfileAnalysis): HistoryEntry[] {
  const entry: HistoryEntry = {
    username: profile.username,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    dominantLanguage: profile.dominantLanguage,
    engagementScore: profile.engagementScore,
    analyzedAt: profile.analyzedAt,
  }

  const existing = getHistory().filter(
    (e) => e.username.toLowerCase() !== entry.username.toLowerCase(),
  )
  const next = [entry, ...existing].slice(0, MAX)

  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // ignore quota errors
  }
  return next
}

export function clearHistory(): HistoryEntry[] {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  return []
}
