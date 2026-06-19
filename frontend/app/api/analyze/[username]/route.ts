import { NextResponse } from 'next/server'
import type { LanguageStat, ProfileAnalysis } from '@/lib/types'

const GH_HEADERS: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'github-profile-analyzer',
}

// Optional token support — works without one, but a token raises rate limits.
if (process.env.GITHUB_TOKEN) {
  GH_HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
}

interface GhUser {
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

interface GhRepo {
  fork: boolean
  language: string | null
  stargazers_count: number
  forks_count: number
}

function ratingForForks(totalForks: number, totalStars: number): string {
  if (totalForks >= 500) return 'Highly Forked'
  if (totalStars >= 1000) return 'Community Favorite'
  if (totalForks >= 50) return 'Well Forked'
  if (totalStars >= 100) return 'Rising Star'
  if (totalForks <= 5 && totalStars <= 10) return 'Solo Builder'
  return 'Steady Contributor'
}

function buildAnalysis(user: GhUser, repos: GhRepo[]): ProfileAnalysis {
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
    analyzedAt: new Date().toISOString(),
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params
  const clean = username.trim().replace(/^@/, '')

  if (!clean) {
    return NextResponse.json({ error: 'A username is required.' }, { status: 400 })
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(clean)}`, {
      headers: GH_HEADERS,
      next: { revalidate: 600 },
    })

    if (userRes.status === 404) {
      return NextResponse.json(
        { error: `User "${clean}" not found on GitHub.` },
        { status: 404 },
      )
    }

    if (userRes.status === 403) {
      return NextResponse.json(
        { error: 'GitHub rate limit reached. Please try again in a few minutes.' },
        { status: 429 },
      )
    }

    if (!userRes.ok) {
      return NextResponse.json(
        { error: 'Failed to reach GitHub. Please try again.' },
        { status: 502 },
      )
    }

    const user: GhUser = await userRes.json()

    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(clean)}/repos?per_page=100&sort=updated`,
      { headers: GH_HEADERS, next: { revalidate: 600 } },
    )
    const repos: GhRepo[] = reposRes.ok ? await reposRes.json() : []

    return NextResponse.json(buildAnalysis(user, repos))
  } catch {
    return NextResponse.json(
      { error: 'A server error occurred while analyzing the profile.' },
      { status: 500 },
    )
  }
}
