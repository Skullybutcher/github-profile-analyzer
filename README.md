# GitHub Profile Analyzer

GitHub Profile Analyzer is a backend-first assignment project built as part of the **Educase India Assignment Submission - Node.js Intern** task. The required objective was to build a service that analyzes a GitHub user profile using the GitHub public API and stores useful insights in MySQL. The frontend in this repository is a complimentary addition I built on my own to make the submission stand out and present the results in a cleaner experience.

## Assignment Context

**Task:** GitHub Profile Analyzer API

**Objective:** Build a backend service that analyzes a GitHub user profile using the GitHub public API and stores useful insights in a MySQL database.

**Tech Stack Used:**

- Node.js
- Express.js
- MySQL
- GitHub REST API (Third-Party API)

## What This Project Does

- Fetches public GitHub profile data by username
- Calculates useful insights such as engagement score, dominant language, repository traction, and activity velocity
- Stores analysis results in MySQL for caching and history tracking
- Exposes APIs to analyze a profile, fetch one saved profile, and list all stored analyses
- Provides a minimal backend landing page at `GET /` that shows server status and endpoint documentation
- Includes a Next.js frontend as a complimentary UI layer to visualize the results more clearly

## Features

- Profile analysis from GitHub username
- Stored insights in MySQL with upsert support
- Cached profile lookup by username
- Paginated analysis history API
- Health check endpoint
- Minimal documentation page for the backend root route
- Responsive frontend dashboard built as an optional enhancement

## Architecture

This repository is organized as a monorepo with a clean separation between backend and frontend:

```
┌─────────────────────────────────────┐
│ Frontend (Next.js)                  │
│ - Dashboard UI                      │
│ - API client                        │
│ - Optional complimentary addition   │
└──────────────┬──────────────────────┘
               │ HTTP
               │ /api/*
┌──────────────▼──────────────────────┐
│ Backend (Express.js)               │
│ - GitHub API integration           │
│ - Analysis logic                   │
│ - MySQL persistence                │
│ - Docs page at GET /               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ MySQL Database                     │
│ - analyses table                   │
│ - history and caching              │
└─────────────────────────────────────┘
```

## Tech Stack

### Frontend
- Next.js 16.2.6
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui-inspired components
- Sonner for notifications

### Backend
- Node.js
- Express.js
- TypeScript
- MySQL via `mysql2`

### External API
- GitHub REST API v3

## Main API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Minimal backend landing page with live status and docs |
| POST | `/api/analyze` | Analyze a GitHub user and save the result |
| GET | `/api/analyze/:username` | Fetch a saved analysis for one user |
| GET | `/api/history` | Fetch all saved analyses with pagination |
| GET | `/health` | Backend health check |

### Request Details

#### `POST /api/analyze`
- Headers: `Content-Type: application/json`
- Body:
```json
{ "username": "torvalds" }
```
- Response: Returns the saved analysis object

#### `GET /api/analyze/:username`
- Headers: None required
- Body: None
- Response: Returns the cached analysis, or a `404` if no record exists

#### `GET /api/history`
- Headers: None required
- Body: None
- Query params: `page`, `limit`
- Response: Paginated list of saved analyses

#### `GET /health`
- Headers: None required
- Body: None
- Response: `{ "status": "ok", "timestamp": "..." }`

## Database Schema

The backend stores results in the `analyses` table. It includes:

- GitHub identity fields such as username, avatar, bio, and profile URL
- Social metrics such as followers and following
- Analysis metrics such as engagement score, dominant language, stars, forks, and repos per year
- Language statistics stored as JSON
- Created and updated timestamps

See [backend/README.md](./backend/README.md) for the full schema and database setup.

## Setup

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm or pnpm

### Quick Start

```bash
# Install dependencies
npm install

# Create the database schema
mysql -u root -p github_analyzer < backend/init.sql

# Configure backend environment
cp backend/.env.example backend/.env.local

# Run backend and frontend in separate terminals
cd backend && npm run dev
cd frontend && npm run dev
```

Open these URLs after starting the app:

- Frontend: http://localhost:3000
- Backend landing page: http://localhost:3001
- Health check: http://localhost:3001/health

## Postman Collection

- link: `https://avionics-geoscientist-42766540-s-team.postman.co/workspace/My-Workspace~056eac6f-9fd3-47c7-8ba0-4beb75933433/collection/41864211-a7484dc6-a6ff-47a5-a599-3fe44ffeb948?action=share&creator=41864211`

## Project Structure

```
.
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── init.sql
│   └── README.md
├── ARCHITECTURE.md
├── SETUP.md
├── QUICK_REFERENCE.md
└── pnpm-workspace.yaml
```

## Documentation

- [SETUP.md](./SETUP.md) - setup, environment configuration, and troubleshooting
- [ARCHITECTURE.md](./ARCHITECTURE.md) - architecture decisions and project design
- [backend/README.md](./backend/README.md) - backend API reference and database details
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - quick command and endpoint reference

## Submission Notes

This project was prepared to satisfy the Educase India Node.js intern assignment requirements and includes a few improvements beyond the minimum submission scope:

- Backend root landing page for quick API discovery
- Separate frontend app to make the demo more presentable
- Cached analyses and history endpoint for repeated lookups
- Clear backend documentation for easier evaluation

Submission checklist:

- GitHub repository link
- Live deployed API URL
- README with setup instructions
- Database schema/export
- Postman collection

## Live Endpoints

- Backend root docs page: `GET /`
- API base: `https://github-profile-analyzer-backend.vercel.app/api`

## License

MIT
