# GitHub Profile Analyzer - Setup & Deployment Guide

## Project Overview

This is a **monorepo** with two main services:
- **Frontend**: Next.js 13+ React app (UI)
- **Backend**: Express.js API server (Business logic + Database)

Fully separated for independent scaling, testing, and deployment.

## Folder Structure

```
github-profile-analyser/
├── frontend/                    # Next.js app (UI)
│   ├── app/                    # App Router pages & API routes (optional)
│   ├── components/             # React components
│   ├── lib/
│   │   ├── api.ts             # Backend API client ⭐
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── ...
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── .env.local             # Frontend env vars
│   └── README.md
│
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database setup
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database queries
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # CORS, error handling
│   │   ├── types/             # TypeScript interfaces
│   │   └── index.ts           # Express app entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .env.local             # Backend env vars
│   ├── init.sql               # Database schema
│   └── README.md
│
├── ARCHITECTURE.md            # Architecture decisions
├── SETUP.md                   # This file
├── pnpm-workspace.yaml        # Workspace config
├── package.json               # Root monorepo config
└── .gitignore
```

## Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **pnpm**: 8+ (or npm/yarn)
- **MySQL**: 8+ (local or cloud)

## Local Setup (Development)

### 1. Install Dependencies

```bash
# Install all workspace dependencies at once
pnpm install

# Or individually:
pnpm --filter frontend install
pnpm --filter backend install
```

### 2. Setup MySQL Database

#### Option A: Local MySQL
```bash
# 1. Start MySQL service
# macOS: brew services start mysql
# Windows: Start MySQL from Services
# Linux: sudo systemctl start mysql

# 2. Create database and tables
mysql -u root -p < backend/init.sql

# 3. Verify
mysql -u root -p -e "USE github_analyzer; SHOW TABLES;"
```

#### Option B: Cloud Database (PlanetScale, AWS RDS)
1. Create a new MySQL 8+ database
2. Copy the connection string

### 3. Configure Environment Variables

**Backend** (create `backend/.env.local`):
```bash
cp backend/.env.example backend/.env.local
```

Edit `backend/.env.local`:
```
NODE_ENV=development
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=github_analyzer
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx  # Optional
FRONTEND_URL=http://localhost:3000
```

**Frontend** (already created at root: `.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Run Both Services

**Option A: Run in Parallel (Recommended)**
```bash
# From root directory
pnpm dev
```

This starts both frontend (port 3000) and backend (port 3001) simultaneously.

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
cd backend
pnpm dev
# Output: ✅ Backend server running on http://localhost:3001
```

Terminal 2 - Frontend:
```bash
cd frontend
pnpm dev
# Output: ▲ Next.js 16.2.6
#        - Local: http://localhost:3000
```

### 5. Test the Setup

Backend health check:
```bash
curl http://localhost:3001/health
# Response: {"status":"ok","timestamp":"2026-06-18T..."}
```

Frontend:
- Open http://localhost:3000
- Search for a GitHub username (e.g., "torvalds")
- Should display profile analysis from backend ✅

## Database Schema

The `analyses` table stores GitHub profile analysis results:

| Column | Type | Purpose |
|--------|------|---------|
| `id` | VARCHAR(36) | UUID primary key |
| `username` | VARCHAR(255) | GitHub username (unique) |
| `displayName` | VARCHAR(255) | Display name |
| `engagementScore` | INT | 0-100 score |
| `dominantLanguage` | VARCHAR(50) | Primary language |
| `languages` | JSON | Language statistics |
| `totalStars` | INT | Total stars across repos |
| `totalForks` | INT | Total forks |
| `followers` | INT | Follower count |
| `createdAt` | TIMESTAMP | Record creation time |
| `updatedAt` | TIMESTAMP | Last update time |

See `backend/README.md` for full schema.

## API Reference

### POST /api/analyze
Analyze a GitHub user.

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"torvalds"}'
```

### GET /api/analyze/:username
Get cached analysis.

```bash
curl http://localhost:3001/api/analyze/torvalds
```

### GET /api/history
Get analysis history (paginated).

```bash
curl "http://localhost:3001/api/history?page=1&limit=10"
```

## Frontend Integration

The frontend uses `lib/api.ts` to communicate with the backend:

```typescript
import { analyzeProfile, getProfile, getHistory } from '@/lib/api'

// Analyze a user
const result = await analyzeProfile('torvalds')

// Get cached analysis
const cached = await getProfile('torvalds')

// Get history
const { total, data } = await getHistory(page, limit)
```

The API URL is configured via `NEXT_PUBLIC_API_URL` environment variable.

## Production Deployment

### Backend Deployment Options

**Option 1: Express.js on Docker** (Recommended)
```bash
cd backend
pnpm build
docker build -t github-analyzer-api .
docker run -p 3001:3001 --env-file .env github-analyzer-api
```

**Option 2: Cloud Platforms**
- **Railway**: `pnpm build && node dist/index.js`
- **Render**: Auto-detects Node.js, use `pnpm build && pnpm start`
- **Azure Container Apps**: Docker + managed MySQL
- **AWS ECS**: Docker image + RDS MySQL

### Frontend Deployment Options

**Option 1: Vercel** (Recommended for Next.js)
```bash
npm install -g vercel
vercel --prod
```

Update `NEXT_PUBLIC_API_URL` in Vercel dashboard to point to production backend.

**Option 2: Static Hosting** (if using `next export`)
- Netlify
- GitHub Pages
- CloudFront + S3

**Option 3: Self-hosted**
```bash
cd frontend
pnpm build
pnpm start
```

### Database Migration

For production, use a managed MySQL service:
- **PlanetScale** (MySQL 8, serverless)
- **AWS RDS** (managed database)
- **DigitalOcean** (managed database)
- **Google Cloud SQL** (managed database)

Example PlanetScale setup:
1. Create new database
2. Copy connection string: `mysql://user:pass@host/db`
3. Set `DATABASE_URL` in backend `.env`

## Environment Variables Checklist

### Backend
- [ ] `DATABASE_HOST` / `DATABASE_URL`
- [ ] `DATABASE_USER`
- [ ] `DATABASE_PASSWORD`
- [ ] `DATABASE_NAME`
- [ ] `GITHUB_TOKEN` (optional, for rate limits)
- [ ] `FRONTEND_URL` (for CORS)
- [ ] `PORT` (default: 3001)

### Frontend
- [ ] `NEXT_PUBLIC_API_URL` (backend URL)

## Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Check connection string
echo $DATABASE_URL

# Verify database exists
mysql -u root -p -e "USE github_analyzer; SHOW TABLES;"
```

### Backend not starting
```bash
# Check port 3001 is free
lsof -i :3001

# Check env vars loaded
cat backend/.env.local

# Check TypeScript compilation
cd backend && pnpm build
```

### Frontend can't reach backend
```bash
# Check NEXT_PUBLIC_API_URL
echo $NEXT_PUBLIC_API_URL

# Test backend directly
curl http://localhost:3001/health

# Check CORS headers
curl -H "Origin: http://localhost:3000" http://localhost:3001/api/history -v
```

### GitHub API rate limit
- Add `GITHUB_TOKEN` to backend `.env`
- Token increases limit from 60 → 5000 requests/hour
- Get token: https://github.com/settings/tokens (no scopes needed)

## Development Tips

### Type Safety
```bash
# Check for TypeScript errors
pnpm type-check

# Or in VS Code: Ctrl+Shift+B → select TypeScript build task
```

### Database Queries
Test queries directly:
```bash
mysql -u root -p github_analyzer < backend/init.sql
mysql -u root -p -e "SELECT * FROM github_analyzer.analyses LIMIT 5"
```

### Frontend Debugging
- Open DevTools (F12)
- Check Network tab for backend calls
- Check Console for errors
- Use React DevTools extension

### Backend Debugging
```bash
# Add detailed logging
export DEBUG=*
cd backend && pnpm dev

# Or use VS Code debugger (launch config below)
```

### VS Code Debug Config
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "program": "${workspaceFolder}/backend/node_modules/.bin/tsx",
      "args": ["watch", "src/index.ts"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Next Steps

1. ✅ Setup database (`pnpm install && mysql < backend/init.sql`)
2. ✅ Configure environment variables
3. ✅ Run both services (`pnpm dev`)
4. ✅ Test API endpoints (see API Reference)
5. ✅ Verify frontend works at http://localhost:3000
6. 🔄 Add more features (authentication, caching, etc.)
7. 🚀 Deploy to production

## Resources

- [Backend README](./backend/README.md)
- [Architecture Document](./ARCHITECTURE.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [GitHub API Docs](https://docs.github.com/en/rest)

## License

MIT
