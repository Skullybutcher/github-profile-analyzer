# Quick Reference

## One-Time Setup

```bash
# Install all dependencies
pnpm install

# Create MySQL database
mysql -u root -p < backend/init.sql

# Configure backend (copy template and edit)
cp backend/.env.example backend/.env.local
# Edit with your MySQL password
```

## Daily Development

```bash
# Start both services
pnpm dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## File Locations

| What | Where |
|------|-------|
| Backend API | `backend/src/index.ts` |
| Profile analysis logic | `backend/src/services/analysisService.ts` |
| GitHub API calls | `backend/src/services/githubService.ts` |
| Database queries | `backend/src/models/analysisModel.ts` |
| Frontend API client | `frontend/lib/api.ts` |
| Database schema | `backend/init.sql` |
| Environment template | `backend/.env.example` |

## API Endpoints

```
POST   /api/analyze           Analyze a GitHub user
GET    /api/analyze/:username Get cached analysis
GET    /api/history           Get all analyses (paginated)
GET    /health                Health check
```

## Environment Variables

**Backend** (`backend/.env.local`):
```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=github_analyzer
GITHUB_TOKEN=ghp_xxxxx (optional)
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env.local` - already created):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Useful Commands

```bash
# Type checking
pnpm type-check

# Build for production
pnpm build:frontend
pnpm build:backend

# Run only backend (port 3001)
pnpm dev:backend

# Run only frontend (port 3000)
pnpm dev:frontend

# Test backend directly
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"torvalds"}'
```

## MySQL Cheat Sheet

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE github_analyzer;

# View all analyses
USE github_analyzer;
SELECT username, engagementScore, totalStars FROM analyses;

# Check table structure
DESCRIBE analyses;

# Count records
SELECT COUNT(*) FROM analyses;

# Delete all (careful!)
DELETE FROM analyses;
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| MySQL connection error | Check `DATABASE_PASSWORD` in `.env.local`, verify MySQL is running |
| Port 3001 in use | Kill process: `lsof -i :3001 \| grep -v COMMAND \| awk '{print $2}' \| xargs kill` |
| Frontend can't reach backend | Check `NEXT_PUBLIC_API_URL`, ensure backend is running on 3001 |
| Database doesn't exist | Run `mysql -u root -p < backend/init.sql` |
| TypeScript errors | Run `pnpm type-check` to see all errors |

## Deployment Checklist

- [ ] MySQL database created and accessible
- [ ] Backend `.env.local` configured with real credentials
- [ ] Frontend API URL points to backend
- [ ] GitHub token added (optional, for rate limits)
- [ ] Tested API endpoints with curl/Postman
- [ ] Frontend loads and can analyze users
- [ ] Build succeeds: `pnpm build`
- [ ] Ready to deploy!

## Documentation

- **Full Setup**: See `SETUP.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Backend API**: See `backend/README.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`

## Key Decisions

| Decision | Why |
|----------|-----|
| Monorepo | Easier to coordinate changes, single workspace |
| Express.js | Lightweight, flexible, easy to scale |
| MySQL | Persistent storage, works with any hosting |
| TypeScript | Type safety across entire stack |
| API client | Cleaner code, easier testing |

---

**Start here**: `pnpm dev` then open http://localhost:3000
