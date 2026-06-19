# GitHub Profile Analyzer - Backend

Express.js server that analyzes GitHub user profiles and stores insights in MySQL.

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database

#### Local MySQL
```bash
# Create database
mysql -u root -p << EOF
CREATE DATABASE github_analyzer;
USE github_analyzer;

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
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_createdAt (createdAt)
);
EOF
```

#### Cloud Database (PlanetScale, AWS RDS, etc.)
1. Create a MySQL 8+ database
2. Copy the connection string to `.env.local` as `DATABASE_URL`

### 3. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://user:password@localhost:3306/github_analyzer
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx  # Optional, for higher rate limits
FRONTEND_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
pnpm dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### POST /api/analyze
Analyze a GitHub user and store insights.

**Request:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{ "username": "torvalds" }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "torvalds",
  "displayName": "Linus Torvalds",
  "avatarUrl": "https://avatars.githubusercontent.com/u/1024454?v=4",
  "bio": "...",
  "engagementScore": 95,
  "dominantLanguage": "C",
  "languages": [
    { "name": "C", "count": 45, "percentage": 78 },
    { "name": "Shell", "count": 8, "percentage": 14 }
  ],
  "totalStars": 45000,
  "totalForks": 15000,
  "tractionRating": "Community Favorite",
  "createdAt": "2026-06-18T10:30:45.123Z",
  "updatedAt": "2026-06-18T10:30:45.123Z"
}
```

### GET /api/analyze/:username
Retrieve cached analysis for a user.

**Request:**
```bash
curl http://localhost:3001/api/analyze/torvalds
```

**Response:** Same as POST response

### GET /api/history
Get paginated list of all analyses.

**Query Params:**
- `page` (default: 1)
- `limit` (default: 10, max: 50)

**Request:**
```bash
curl "http://localhost:3001/api/history?page=1&limit=20"
```

**Response:**
```json
{
  "total": 42,
  "page": 1,
  "limit": 20,
  "data": [
    { ...analysis },
    { ...analysis }
  ]
}
```

### GET /health
Health check endpoint.

**Request:**
```bash
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-18T10:30:45.123Z"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Database configuration
│   │   └── database.ts   # MySQL pool setup
│   ├── controllers/       # Express request handlers
│   │   └── analysisController.ts
│   ├── middleware/        # Express middleware
│   │   └── index.ts      # CORS, error handling
│   ├── models/           # Database queries
│   │   └── analysisModel.ts
│   ├── routes/           # API routes
│   │   └── index.ts
│   ├── services/         # Business logic
│   │   ├── githubService.ts  # GitHub API calls
│   │   └── analysisService.ts # Profile analysis logic
│   ├── types/            # TypeScript interfaces
│   │   └── index.ts
│   └── index.ts          # Express app entry point
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Development

### Type Checking
```bash
pnpm type-check
```

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

## Database Schema

### `analyses` table
Stores GitHub profile analysis results.

| Column | Type | Notes |
|--------|------|-------|
| `id` | VARCHAR(36) | UUID primary key |
| `username` | VARCHAR(255) | GitHub username (unique index) |
| `displayName` | VARCHAR(255) | Display name |
| `avatarUrl` | VARCHAR(500) | Avatar image URL |
| `bio` | TEXT | GitHub bio |
| `htmlUrl` | VARCHAR(500) | GitHub profile URL |
| `company` | VARCHAR(255) | Company name |
| `location` | VARCHAR(255) | Location |
| `blog` | VARCHAR(500) | Blog URL |
| `twitterUsername` | VARCHAR(255) | Twitter handle |
| `joinedAt` | VARCHAR(255) | Account creation date (ISO 8601) |
| `accountAgeYears` | DECIMAL(5,2) | Years since account creation |
| `publicRepos` | INT | Public repository count |
| `followers` | INT | Follower count |
| `following` | INT | Following count |
| `engagementScore` | INT | Calculated engagement score (0-100) |
| `dominantLanguage` | VARCHAR(50) | Primary programming language |
| `totalStars` | INT | Sum of all star counts |
| `totalForks` | INT | Sum of all fork counts |
| `tractionRating` | VARCHAR(100) | Qualitative rating |
| `reposPerYear` | DECIMAL(8,2) | Repository creation rate |
| `languagesJson` | JSON | Language statistics array |
| `createdAt` | TIMESTAMP | Record creation timestamp |
| `updatedAt` | TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_username` on `username` (unique)
- `idx_createdAt` on `createdAt`

## Security Notes

1. **GitHub Token**: Stored in env vars, enables higher API rate limits (60 → 5000 req/hour)
2. **Database**: Connections use pool with limits, proper error handling
3. **CORS**: Whitelist frontend origin(s), no wildcard in production
4. **Validation**: Input sanitized on both client & server
5. **Error Handling**: No stack traces leaked to client

## Integration with Frontend

The frontend (Next.js app) calls the backend at `NEXT_PUBLIC_API_URL`.

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Frontend API calls:**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username })
})
```

## Troubleshooting

### Database Connection Error
- Verify MySQL is running: `mysql -u root -p`
- Check `.env.local` credentials
- Ensure database `github_analyzer` exists

### GitHub API Rate Limit
- Add `GITHUB_TOKEN` to `.env.local`
- Wait 1 hour for limit reset
- Use `X-RateLimit-*` headers to check status

### CORS Issues
- Verify `FRONTEND_URL` in `.env.local`
- Check browser console for exact error
- Ensure frontend origin is in whitelist

## License
MIT
