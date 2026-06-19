export interface LanguageStat {
  name: string
  count: number
  percentage: number
}

export interface ProfileAnalysis {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string
  bio: string | null
  htmlUrl: string
  company: string | null
  location: string | null
  blog: string | null
  twitterUsername: string | null
  joinedAt: string
  accountAgeYears: number
  publicRepos: number
  followers: number
  following: number
  engagementScore: number
  dominantLanguage: string
  languages: LanguageStat[]
  totalStars: number
  totalForks: number
  tractionRating: string
  reposPerYear: number
  createdAt: string
  updatedAt: string
}

export interface GithubUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  html_url: string
  company: string | null
  location: string | null
  blog: string | null
  twitter_username: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface GithubRepo {
  fork: boolean
  language: string | null
  stargazers_count: number
  forks_count: number
}

export interface PaginatedResponse<T> {
  total: number
  page: number
  limit: number
  data: T[]
}
