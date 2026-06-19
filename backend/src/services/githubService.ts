import { GithubUser, GithubRepo, LanguageStat, ProfileAnalysis } from '../types/index.js'

const GH_HEADERS: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'github-profile-analyzer',
}

if (process.env.GITHUB_TOKEN) {
  GH_HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
}

export async function fetchGithubUser(username: string): Promise<GithubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: GH_HEADERS,
    })

    if (res.status === 404) {
      return null
    }

    if (res.status === 403) {
      throw new Error('GitHub API rate limit exceeded')
    }

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`)
    }

    return (await res.json()) as GithubUser
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    throw error
  }
}

export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers: GH_HEADERS },
    )

    if (!res.ok) {
      console.warn(`Failed to fetch repos for ${username}, returning empty array`)
      return []
    }

    return (await res.json()) as GithubRepo[]
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return []
  }
}
