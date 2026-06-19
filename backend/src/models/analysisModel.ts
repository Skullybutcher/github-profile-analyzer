import { v4 as uuidv4 } from 'uuid'
import pool from '../config/database.js'
import { ProfileAnalysis, PaginatedResponse } from '../types/index.js'

export async function saveAnalysis(analysis: Omit<ProfileAnalysis, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProfileAnalysis> {
  const connection = await pool.getConnection()

  try {
    const id = uuidv4()
    const now = new Date()

    const query = `
      INSERT INTO analyses (
        id, username, displayName, avatarUrl, bio, htmlUrl, company, location, 
        blog, twitterUsername, joinedAt, accountAgeYears, publicRepos, followers, 
        following, engagementScore, dominantLanguage, totalStars, totalForks, 
        tractionRating, reposPerYear, languagesJson, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        displayName = VALUES(displayName),
        avatarUrl = VALUES(avatarUrl),
        bio = VALUES(bio),
        htmlUrl = VALUES(htmlUrl),
        company = VALUES(company),
        location = VALUES(location),
        blog = VALUES(blog),
        twitterUsername = VALUES(twitterUsername),
        accountAgeYears = VALUES(accountAgeYears),
        publicRepos = VALUES(publicRepos),
        followers = VALUES(followers),
        following = VALUES(following),
        engagementScore = VALUES(engagementScore),
        dominantLanguage = VALUES(dominantLanguage),
        totalStars = VALUES(totalStars),
        totalForks = VALUES(totalForks),
        tractionRating = VALUES(tractionRating),
        reposPerYear = VALUES(reposPerYear),
        languagesJson = VALUES(languagesJson),
        updatedAt = VALUES(updatedAt)
    `

    const [result] = await connection.execute(query, [
      id,
      analysis.username,
      analysis.displayName,
      analysis.avatarUrl,
      analysis.bio,
      analysis.htmlUrl,
      analysis.company,
      analysis.location,
      analysis.blog,
      analysis.twitterUsername,
      analysis.joinedAt,
      analysis.accountAgeYears,
      analysis.publicRepos,
      analysis.followers,
      analysis.following,
      analysis.engagementScore,
      analysis.dominantLanguage,
      analysis.totalStars,
      analysis.totalForks,
      analysis.tractionRating,
      analysis.reposPerYear,
      JSON.stringify(analysis.languages),
      now,
      now,
    ])

    return {
      id,
      ...analysis,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
  } finally {
    await connection.release()
  }
}

export async function getAnalysisByUsername(username: string): Promise<ProfileAnalysis | null> {
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT 
        id, username, displayName, avatarUrl, bio, htmlUrl, company, location,
        blog, twitterUsername, joinedAt, accountAgeYears, publicRepos, followers,
        following, engagementScore, dominantLanguage, totalStars, totalForks,
        tractionRating, reposPerYear, languagesJson, createdAt, updatedAt
      FROM analyses
      WHERE username = ?
      LIMIT 1
    `

    const [rows] = await connection.execute(query, [username])
    const result = (rows as any[])[0]

    if (!result) {
      return null
    }

    return {
      ...result,
      languages: JSON.parse(result.languagesJson || '[]'),
    }
  } finally {
    await connection.release()
  }
}

export async function getAnalysisHistory(
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<ProfileAnalysis>> {
  const connection = await pool.getConnection()

  try {
    const offset = (page - 1) * limit

    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM analyses')
    const total = (countResult as any[])[0].total

    const query = `
      SELECT 
        id, username, displayName, avatarUrl, bio, htmlUrl, company, location,
        blog, twitterUsername, joinedAt, accountAgeYears, publicRepos, followers,
        following, engagementScore, dominantLanguage, totalStars, totalForks,
        tractionRating, reposPerYear, languagesJson, createdAt, updatedAt
      FROM analyses
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `

    const [rows] = await connection.query(query, [limit, offset])

    const data = (rows as any[]).map((row: any) => ({
      ...row,
      languages: JSON.parse(row.languagesJson || '[]'),
    }))

    return {
      total,
      page,
      limit,
      data,
    }
  } finally {
    await connection.release()
  }
}
