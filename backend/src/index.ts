import express from 'express'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { corsMiddleware, errorHandler } from './middleware/index.js'
import apiRoutes from './routes/index.js'

dotenv.config({ path: fileURLToPath(new URL('../.env.local', import.meta.url)) })

const app = express()
const PORT = process.env.PORT || 3001

function buildDocsPage(baseUrl: string): string {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/analyze',
      description: 'Fetches a GitHub profile, analyzes it, and stores the result in MySQL.',
      headers: ['Content-Type: application/json'],
      body: '{ "username": "torvalds" }',
      response: 'Returns the saved analysis object.',
    },
    {
      method: 'GET',
      path: '/api/analyze/:username',
      description: 'Returns a cached analysis for a GitHub username.',
      headers: ['None required'],
      body: 'No request body.',
      response: 'Returns the cached analysis or 404 if no record exists.',
    },
    {
      method: 'GET',
      path: '/api/history',
      description: 'Returns a paginated list of stored analyses.',
      headers: ['None required'],
      body: 'Query params: page, limit',
      response: 'Returns total, page, limit, and data array.',
    },
    {
      method: 'GET',
      path: '/health',
      description: 'Basic health check for the backend process.',
      headers: ['None required'],
      body: 'No request body.',
      response: 'Returns status ok with a timestamp.',
    },
  ]

  const endpointCards = endpoints
    .map(
      (endpoint) => `
        <article class="card">
          <div class="card-head">
            <span class="method ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
            <code>${endpoint.path}</code>
          </div>
          <p>${endpoint.description}</p>
          <div class="meta-grid">
            <div>
              <h3>Headers</h3>
              <p>${endpoint.headers.join('<br />')}</p>
            </div>
            <div>
              <h3>Body</h3>
              <p><code>${endpoint.body}</code></p>
            </div>
            <div>
              <h3>Response</h3>
              <p>${endpoint.response}</p>
            </div>
          </div>
        </article>
      `,
    )
    .join('')

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>GitHub Profile Analyzer API</title>
      <style>
        :root {
          color-scheme: dark;
          --bg: #0b1220;
          --panel: rgba(15, 23, 42, 0.82);
          --panel-border: rgba(148, 163, 184, 0.18);
          --text: #e2e8f0;
          --muted: #94a3b8;
          --accent: #38bdf8;
          --accent-2: #22c55e;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          background:
            radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 28%),
            radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 24%),
            var(--bg);
          color: var(--text);
          min-height: 100vh;
        }
        main {
          max-width: 1040px;
          margin: 0 auto;
          padding: 48px 20px 64px;
        }
        .hero {
          border: 1px solid var(--panel-border);
          background: var(--panel);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 24px 80px rgba(2, 6, 23, 0.45);
          backdrop-filter: blur(16px);
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--accent);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        h1 {
          margin: 0;
          font-size: clamp(2.1rem, 5vw, 4rem);
          line-height: 1;
        }
        .subtle {
          margin: 16px 0 0;
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.7;
          max-width: 70ch;
        }
        .badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid var(--panel-border);
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.62);
          color: var(--text);
          font-size: 14px;
        }
        .section {
          margin-top: 28px;
        }
        .section h2 {
          margin: 0 0 14px;
          font-size: 1.4rem;
        }
        .grid {
          display: grid;
          gap: 16px;
        }
        .card {
          border: 1px solid var(--panel-border);
          background: rgba(15, 23, 42, 0.68);
          border-radius: 20px;
          padding: 22px;
        }
        .card-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .method {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 10px;
          border-radius: 999px;
          color: #06111f;
        }
        .method.post { background: #7dd3fc; }
        .method.get { background: #86efac; }
        code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 0.95em;
          color: #e0f2fe;
        }
        .card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }
        .meta-grid h3 {
          margin: 0 0 8px;
          font-size: 0.85rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .footer {
          margin-top: 22px;
          color: var(--muted);
          font-size: 0.92rem;
        }
        @media (max-width: 720px) {
          main { padding: 18px 14px 48px; }
          .hero { padding: 24px; border-radius: 20px; }
          .meta-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <main>
        <section class="hero">
          <div class="eyebrow">Server Status</div>
          <h1>Backend is live.</h1>
          <p class="subtle">
            The GitHub Profile Analyzer backend is running at <code>${baseUrl}</code>.
            Use the API endpoints below to analyze a profile, retrieve cached results,
            and inspect the saved history.
          </p>
          <div class="badge-row">
            <div class="badge">Express.js</div>
            <div class="badge">MySQL</div>
            <div class="badge">GitHub API</div>
          </div>
        </section>

        <section class="section">
          <h2>API Endpoints</h2>
          <div class="grid">
            ${endpointCards}
          </div>
          <div class="footer">
            Tip: send JSON with <code>Content-Type: application/json</code> for write requests.
          </div>
        </section>
      </main>
    </body>
  </html>`
}

// Middleware
app.use(corsMiddleware)
app.use(express.json())

// Landing page
app.get('/', (req, res) => {
  const protocol = req.headers['x-forwarded-proto']?.toString().split(',')[0] || req.protocol
  const host = req.get('host') || `localhost:${PORT}`
  const baseUrl = `${protocol}://${host}`

  res.status(200).type('html').send(buildDocsPage(baseUrl))
})

// Routes
app.use('/api', apiRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`)
  console.log(`📊 POST   http://localhost:${PORT}/api/analyze`)
  console.log(`📄 GET    http://localhost:${PORT}/api/analyze/:username`)
  console.log(`📋 GET    http://localhost:${PORT}/api/history`)
  console.log(`🏥 GET    http://localhost:${PORT}/health`)
})
