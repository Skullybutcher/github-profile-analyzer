# GitHub Profile Analyzer

A full-stack application that analyzes GitHub user profiles and stores insights in a MySQL database.

## ⭐ Features

- 🔍 **Profile Analysis**: Fetch GitHub user data and calculate engagement scores
- 📊 **Metrics Dashboard**: Display language diversity, fork/star counts, activity velocity
- 💾 **Database Storage**: Persist analysis results in MySQL for history tracking
- ⚡ **Fast API**: Express.js backend with optimized GitHub API calls
- 🎨 **Beautiful UI**: Next.js frontend with shadcn/ui components
- 📱 **Responsive Design**: Mobile-friendly analysis dashboard

## 🏗 Architecture

This is a **monorepo** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│   Frontend (Next.js)                │
│   - React components                │
│   - Dashboard UI                    │
│   - API client (lib/api.ts)         │
└──────────────┬──────────────────────┘
               │ HTTP
               │ /api/analyze
               │
┌──────────────▼──────────────────────┐
│   Backend (Express.js)              │
│   - GitHub API integration          │
│   - Profile analysis logic          │
│   - MySQL database queries          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   MySQL Database                    │
│   - analyses table                  │
│   - History & caching               │
└─────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- MySQL 8+

### Setup (5 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Create database
mysql -u root -p < backend/init.sql

# 3. Configure environment
cp backend/.env.example backend/.env.local
# Edit backend/.env.local with your database credentials

# 4. Run both services
pnpm dev
```

Then open:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health check**: http://localhost:3001/health

### First Analysis
1. Go to http://localhost:3000
2. Enter a GitHub username (e.g., `torvalds`, `gvanrossum`, `dhh`)
3. View the analysis results with engagement score, language stats, etc.

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup, deployment, and troubleshooting guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture decisions and design patterns
- **[backend/README.md](./backend/README.md)** - Backend API reference and development guide

## 📦 Tech Stack

### Frontend
- **Next.js 16.2+** (React 19, App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Sonner** for notifications

### Backend
- **Express.js** for HTTP API
- **Node.js** runtime
- **TypeScript** for type safety
- **MySQL** for data persistence

### Third-party APIs
- **GitHub REST API** for user profiles and repositories

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze a GitHub user |
| GET | `/api/analyze/:username` | Get cached analysis |
| GET | `/api/history` | Get all analyses (paginated) |
| GET | `/health` | Backend health check |

### Example Requests

```bash
# Analyze a user
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"torvalds"}'

# Get analysis history
curl "http://localhost:3001/api/history?page=1&limit=10"

# Health check
curl http://localhost:3001/health
```

## 💾 Database Schema

The `analyses` table stores:
- GitHub user profile information
- Calculated metrics (engagement score, language stats, etc.)
- Repository traction data (stars, forks)
- Activity velocity (repos per year)
- Timestamps for caching

See [backend/README.md](./backend/README.md) for full schema details.

## 🛠 Development

### Project Structure

```
.
├── frontend/              # Next.js app (UI)
│   ├── app/              # Pages and layout
│   ├── components/       # React components
│   ├── lib/
│   │   ├── api.ts       # ⭐ Backend API client
│   │   └── types.ts     # Shared types
│   └── ...
│
├── backend/              # Express.js API
│   ├── src/
│   │   ├── config/      # Database setup
│   │   ├── services/    # Business logic
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Database queries
│   │   └── routes/      # API routes
│   └── ...
│
├── SETUP.md             # Setup guide
├── ARCHITECTURE.md      # Architecture docs
└── pnpm-workspace.yaml  # Monorepo config
```

### Development Commands

```bash
# Run all services
pnpm dev

# Run individually
pnpm dev:frontend
pnpm dev:backend

# Build
pnpm build:frontend
pnpm build:backend

# Type check
pnpm type-check
```

## 🚀 Deployment

### Backend
- **Railway**, **Render**: `pnpm build && pnpm start`
- **AWS**: Docker + ECS
- **Azure**: Container Apps + Managed MySQL

### Frontend
- **Vercel**: Auto-deployed from GitHub (recommended)
- **Netlify**: Static site hosting
- **Self-hosted**: `pnpm build && pnpm start`

### Database
- **PlanetScale**: MySQL 8, serverless (recommended)
- **AWS RDS**: Managed MySQL
- **DigitalOcean**: Managed PostgreSQL/MySQL

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙋 Support

- **Issues**: GitHub Issues
- **Docs**: See [SETUP.md](./SETUP.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Questions**: Check the troubleshooting section in [SETUP.md](./SETUP.md)

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Made with ❤️ for developers exploring GitHub profiles**
