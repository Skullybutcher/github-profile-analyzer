import { GithubUser, GithubRepo, LanguageStat, ProfileAnalysis } from '../types/index.js'
import { v4 as uuidv4 } from 'uuid'

function ratingForForks(totalForks: number, totalStars: number): string {
  if (totalForks >= 500) return 'Highly Forked'
  if (totalStars >= 1000) return 'Community Favorite'
  if (totalForks >= 50) return 'Well Forked'
  if (totalStars >= 100) return 'Rising Star'
  if (totalForks <= 5 && totalStars <= 10) return 'Solo Builder'
  return 'Steady Contributor'
}

export function analyzeProfile(user: GithubUser, repos: GithubRepo[]): Omit<ProfileAnalysis, 'id' | 'createdAt' | 'updatedAt'> {
  const joined = new Date(user.created_at)
  const now = new Date()
  const accountAgeYears = Math.max(
    0.1,
    (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  )

  let totalStars = 0
  let totalForks = 0
  const langCount: Record<string, number> = {}

  for (const repo of repos) {
    if (repo.fork) continue
    totalStars += repo.stargazers_count
    totalForks += repo.forks_count
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] ?? 0) + 1
    }
  }

  const totalLangRepos = Object.values(langCount).reduce((a, b) => a + b, 0) || 1
  const languages: LanguageStat[] = Object.entries(langCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalLangRepos) * 100),
    }))
    .sort((a, b) => b.count - a.count)

  const dominantLanguage = languages[0]?.name ?? 'Unknown'

  // Engagement score (0-100): weighted blend of reach, traction and breadth.
  const followerScore = Math.min(40, Math.log10(user.followers + 1) * 16)
  const starScore = Math.min(35, Math.log10(totalStars + 1) * 12)
  const repoScore = Math.min(15, Math.log10(user.public_repos + 1) * 8)
  const diversityScore = Math.min(10, languages.length * 1.5)
  const engagementScore = Math.round(
    followerScore + starScore + repoScore + diversityScore,
  )

  return {
    username: user.login,
    displayName: user.name ?? user.login,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    htmlUrl: user.html_url,
    company: user.company,
    location: user.location,
    blog: user.blog ? (user.blog.startsWith('http') ? user.blog : `https://${user.blog}`) : null,
    twitterUsername: user.twitter_username,
    joinedAt: user.created_at,
    accountAgeYears: Math.round(accountAgeYears * 10) / 10,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    engagementScore: Math.min(100, engagementScore),
    dominantLanguage,
    languages,
    totalStars,
    totalForks,
    tractionRating: ratingForForks(totalForks, totalStars),
    reposPerYear: Math.round((user.public_repos / accountAgeYears) * 10) / 10,
  }
}
