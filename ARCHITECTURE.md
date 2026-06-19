# GitHub Profile Analyzer - Architecture

## Overview
Monorepo with separated **Frontend** (Next.js) and **Backend** (Express + MySQL).

```
github-profile-analyser/
├── frontend/                 # Next.js 13+ App Router (UI)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # Express.js API Server
│   ├── src/
│   │   ├── config/          # DB, env configs
│   │   ├── controllers/      # Route handlers
│   │   ├── models/          # Database queries
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, error handling
│   │   ├── services/        # Business logic (GitHub API, analysis)
│   │   ├── types/           # TypeScript interfaces
│   │   └── index.ts         # Express app entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── package.json             # Root workspace (pnpm workspaces)
├── pnpm-workspace.yaml      # Workspace config
└── ARCHITECTURE.md          # This file
```

## Tech Stack

### Frontend
- **Next.js 13+** (App Router)
- **React 18+**
- **TypeScript**
- **Shadcn/ui** (UI components)
- **Axios** or native `fetch` for API calls

### Backend
- **Node.js** (LTS)
- **Express.js**
- **TypeScript**
- **MySQL 8+** (via `mysql2` driver)
- **dotenv** (config management)

### Database
- **MySQL 8+** (local dev or cloud: PlanetScale, AWS RDS, etc.)

## API Contract

### POST /api/analyze
Analyze a GitHub user and store insights.

**Request:**
```json
{
  "username": "torvalds"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "torvalds",
  "displayName": "Linus Torvalds",
  "avatarUrl": "...",
  "bio": "...",
  "engagementScore": 95,
  "dominantLanguage": "C",
  "languages": [
    { "name": "C", "count": 45, "percentage": 78 },
    ...
  ],
  "totalStars": 45000,
  "totalForks": 15000,
  "tractionRating": "Community Favorite",
  "analyzedAt": "2026-06-18T...",
  "createdAt": "2026-06-18T...",
  "updatedAt": "2026-06-18T..."
}
```

### GET /api/history
List all analyzed profiles (paginated).

**Query Params:**
- `page` (default: 1)
- `limit` (default: 10, max: 50)

**Response:**
```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "data": [{ ...analysis }, ...]
}
```

### GET /api/analyze/:username
Retrieve cached analysis.

**Response:** Same as POST response.

## Database Schema

### `analyses` table
```sql
CREATE TABLE analyses (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  displayName VARCHAR(255),
  avatarUrl VARCHAR(500),
  bio TEXT,
  htmlUrl VARCHAR(500),
  company VARCHAR(255),
  location VARCHAR(255),
  blog VARCHAR(500),
  twitterUsername VARCHAR(255),
  joinedAt VARCHAR(255),
  accountAgeYears DECIMAL(5,2),
  publicRepos INT,
  followers INT,
  following INT,
  engagementScore INT,
  dominantLanguage VARCHAR(50),
  totalStars INT,
  totalForks INT,
  tractionRating VARCHAR(100),
  reposPerYear DECIMAL(8,2),
  languagesJson JSON,
  rawGithubData JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Development Workflow

### Setup
```bash
# Install dependencies for all workspaces
pnpm install

# or individually
cd frontend && pnpm install
cd backend && pnpm install
```

### Run Locally
```bash
# Terminal 1: Backend (port 3001)
cd backend
pnpm dev

# Terminal 2: Frontend (port 3000)
cd frontend
pnpm dev
```

### Environment Variables

**Backend** (`.env.local`):
```
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://user:password@localhost:3306/github_analyzer
GITHUB_TOKEN=ghp_xxxxx  # Optional, for higher rate limits
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Deployment Strategy

### Backend (Express)
- **Docker Container** → Azure Container Apps, AWS ECS, or Railway
- **Serverless** → AWS Lambda (with serverless-http adapter)
- **VPS** → Vercel, Render, DigitalOcean App Platform

### Frontend (Next.js)
- **Vercel** (native Next.js hosting) ⭐
- **Azure Static Web Apps** (with API integration)
- **Docker** → Container Apps, ECS

### Database
- **PlanetScale** (MySQL-compatible, serverless)
- **AWS RDS** (managed MySQL)
- **DigitalOcean Managed Database**
- **Local MySQL** (dev only)

## Security Considerations

1. **GitHub Token**: Store in env, never in code.
2. **Database Credentials**: Use env variables or managed secrets.
3. **API Rate Limiting**: Add middleware for brute-force protection.
4. **CORS**: Configure origin whitelist on backend.
5. **Input Validation**: Sanitize usernames on both client & server.
6. **Error Handling**: Don't leak stack traces; log securely.

## Next Steps

1. **Scaffold backend** with Express + MySQL setup
2. **Migrate business logic** from Next.js to backend services
3. **Implement API endpoints** (POST /api/analyze, GET /api/history)
4. **Update frontend** to call backend API
5. **Add authentication** (optional: JWT, API keys)
6. **Deploy** to production
