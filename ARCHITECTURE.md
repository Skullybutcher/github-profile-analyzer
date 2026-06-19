# GitHub Profile Analyzer - Architecture

## Overview
This repository is a monorepo with a UI app and a backend API:

- frontend: Next.js app for user interaction and visualization.
- backend: Express + MySQL API for persistence and server-side analysis.

The backend is the source of truth for cached analyses. The key persistence boundary is the `analyses` table.

## Project Structure

```text
github-profile-analyser/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── init.sql
│   └── package.json
├── package.json
├── pnpm-workspace.yaml
└── ARCHITECTURE.md
```

## Tech Stack

- Frontend: Next.js (App Router), React, TypeScript, shadcn/ui.
- Backend: Node.js, Express, TypeScript.
- Database: MySQL 8+ via `mysql2/promise`.

## API Contract

### POST /api/analyze
Analyzes a GitHub user and persists the result in MySQL.

Request:

```json
{
  "username": "torvalds"
}
```

### GET /api/analyze/:username
Returns cached analysis from the database only. Does not fallback to GitHub.

### GET /api/history
Returns paginated cached analyses.

Query params:

- page: default 1
- limit: default 10, max 50

## Database Schema

The primary table is `analyses`:

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
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_createdAt (createdAt)
);
```

## Decision Rationale

### Why monorepo?

- Shared ownership and easier cross-layer refactors.
- One PR can change API contracts and frontend consumption together.
- Lower coordination overhead than separate repositories for this project size.

Tradeoff: CI pipelines can become slower as the repository grows.

### Why Express + MySQL for backend?

- Express keeps routing and middleware explicit and easy to debug.
- MySQL provides mature indexing, JSON support, and predictable query behavior.
- The app needs durable cache semantics, not just in-memory speed.

Tradeoff: more operational setup than a pure serverless/no-db architecture.

### Why connection pooling?

- Reusing DB connections avoids connect/disconnect overhead per request.
- Prevents exhausting database resources under concurrent load.
- Improves tail latency for frequently hit endpoints like `/api/history`.

Implementation note: the backend uses a shared `mysql2` pool with bounded connections.

### Why upsert (`INSERT ... ON DUPLICATE KEY UPDATE`) instead of plain insert?

- `username` is logically unique for cached analyses.
- Re-analysis should refresh the same record, not create duplicates.
- Upsert makes write behavior idempotent for repeated analyze calls.

Tradeoff: historical versions are not kept in the same table. If audit/history snapshots are needed, introduce a separate versioned table.

### Why store languages as JSON (`languagesJson`) instead of a join table?

- Language breakdown is read and written as one blob with the analysis payload.
- Avoids extra joins for the main response path.
- Simpler schema and faster delivery for current read patterns.

Tradeoff: ad-hoc SQL analytics on nested language fields are harder than fully normalized relational modeling.

### Why normalize usernames?

- GitHub usernames are case-insensitive for lookup semantics.
- Trimming and lowercasing reduce cache misses from casing/input variance.
- Makes endpoint behavior deterministic across clients.

### Why pagination on history?

- Prevents unbounded response payloads as data grows.
- Stabilizes response times and memory use.
- Keeps UI responsive while allowing expansion through page navigation.

### Why database-only behavior for cached retrieval?

- `GET /api/analyze/:username` is intentionally a cache read endpoint.
- A strict cache contract makes behavior predictable for clients.
- Avoids surprising side effects (network calls and writes) from a read route.

If live fallback is ever required, it should be a separate endpoint or an explicit query flag.

## Operational Notes

- Backend defaults to port 3001.
- If startup fails with `EADDRINUSE`, another process is already listening on that port.
- Use `/health` to verify the active process.

## Environment Variables

Backend (`backend/.env.local`):

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://user:password@localhost:3306/github_analyzer
GITHUB_TOKEN=ghp_xxxxx
FRONTEND_URL=http://localhost:3000
```

## Future Improvements

1. Add an explicit live-analysis endpoint separate from cache reads.
2. Add API-level rate limiting and request tracing.
3. Add integration tests for DB read/write and pagination semantics.
4. Consider schema versioning if analytics requirements grow.
