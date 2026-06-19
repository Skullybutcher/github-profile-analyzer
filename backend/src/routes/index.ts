import { Router } from 'express'
import {
  analyzeUser,
  getUserAnalysis,
  getHistory,
} from '../controllers/analysisController.js'

const router = Router()

/**
 * POST /api/analyze
 * Analyze a GitHub user and store insights
 */
router.post('/analyze', analyzeUser)

/**
 * GET /api/analyze/:username
 * Get cached analysis for a user
 */
router.get('/analyze/:username', getUserAnalysis)

/**
 * GET /api/history
 * Get paginated list of all analyses
 * Query params: page (default: 1), limit (default: 10, max: 50)
 */
router.get('/history', getHistory)

export default router
