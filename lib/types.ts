export interface LanguageStat {
  name: string
  count: number
  percentage: number
}

export interface ProfileAnalysis {
  // Identity
  username: string
  displayName: string
  avatarUrl: string
  bio: string | null
  htmlUrl: string
  company: string | null
  location: string | null
  blog: string | null
  twitterUsername: string | null
  joinedAt: string
  accountAgeYears: number

  // High-level metrics
  publicRepos: number
  followers: number
  following: number
  engagementScore: number

  // Developer DNA
  dominantLanguage: string
  languages: LanguageStat[]

  // Repository traction
  totalStars: number
  totalForks: number
  tractionRating: string

  // Activity velocity
  reposPerYear: number

  // Meta
  analyzedAt: string
}

export interface HistoryEntry {
  username: string
  displayName: string
  avatarUrl: string
  dominantLanguage: string
  engagementScore: number
  analyzedAt: string
}
