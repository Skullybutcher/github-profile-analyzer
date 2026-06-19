import { Request, Response } from 'express'
import { fetchGithubUser, fetchGithubRepos } from '../services/githubService.js'
import { analyzeProfile } from '../services/analysisService.js'
import { saveAnalysis, getAnalysisByUsername, getAnalysisHistory } from '../models/analysisModel.js'

export async function analyzeUser(req: Request, res: Response): Promise<void> {
  try {
    const { username } = req.body

    if (!username || typeof username !== 'string') {
      res.status(400).json({ error: 'A valid username is required.' })
      return
    }

    const clean = username.trim().replace(/^@/, '')

    if (!clean) {
      res.status(400).json({ error: 'A username is required.' })
      return
    }

    // Fetch from GitHub
    const user = await fetchGithubUser(clean)
    if (!user) {
      res.status(404).json({ error: `User "${clean}" not found on GitHub.` })
      return
    }

    const repos = await fetchGithubRepos(clean)

    // Analyze
    const analysis = analyzeProfile(user, repos)

    // Save to database
    const saved = await saveAnalysis(analysis)

    res.status(200).json(saved)
  } catch (error: any) {
    console.error('Error in analyzeUser:', error)

    if (error.message.includes('rate limit')) {
      res.status(429).json({
        error: 'GitHub rate limit reached. Please try again in a few minutes.',
      })
      return
    }

    res.status(500).json({
      error: 'A server error occurred while analyzing the profile.',
    })
  }
}

export async function getUserAnalysis(req: Request, res: Response): Promise<void> {
  try {
    const { username } = req.params

    if (!username) {
      res.status(400).json({ error: 'Username is required.' })
      return
    }

    const analysis = await getAnalysisByUsername(username)

    if (!analysis) {
      res.status(404).json({ error: `No analysis found for user "${username}".` })
      return
    }

    res.status(200).json(analysis)
  } catch (error) {
    console.error('Error in getUserAnalysis:', error)
    res.status(500).json({
      error: 'A server error occurred while retrieving the analysis.',
    })
  }
}

export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    let page = parseInt(req.query.page as string) || 1
    let limit = parseInt(req.query.limit as string) || 10

    // Validate and clamp limits
    if (page < 1) page = 1
    if (limit < 1 || limit > 50) limit = 10

    const history = await getAnalysisHistory(page, limit)
    res.status(200).json(history)
  } catch (error) {
    console.error('Error in getHistory:', error)
    res.status(500).json({
      error: 'A server error occurred while retrieving the history.',
    })
  }
}
