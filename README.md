# Backend Template

Node.js backend template with Express, Prisma, and Zod. Uses centralized AI rules from the [ai-rules repository](https://github.com/palpito-hunch/kiro-project-template).

## Stack

- **Runtime**: Node.js 22 LTS
- **Framework**: Express 5.x
- **Database**: PostgreSQL with Prisma 7.x
- **Validation**: Zod 4.x
- **Language**: TypeScript 5.x

## Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL (or use Docker)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/backend-template.git my-service
cd my-service

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start database (if using Docker)
docker compose up -d db

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### Using Docker

```bash
# Build and run everything
docker compose up -d

# View logs
docker compose logs -f app
```

## Project Structure

```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── repositories/   # Data access layer
├── routes/         # Route definitions
├── middleware/     # Express middleware
├── types/          # TypeScript types
├── utils/          # Utility functions
├── app.ts          # Express app setup
├── config.ts       # Configuration
└── index.ts        # Entry point

prisma/
├── schema.prisma   # Database schema
└── seed.ts         # Seed data

.kiro/              # AI rules (synced from ai-rules)
├── standards/      # Coding standards
├── steering/       # Kiro steering files
├── validation/     # Validation rules
└── memory/         # ADRs, glossary
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting errors |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |
| `npm run validate` | Run lint, format check, and type check |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database |
| `npm test` | Run tests |

## AI Rules Sync

This template automatically syncs AI coding standards from the ai-rules repository:

- **Automatic**: Weekly on Mondays at 9am UTC
- **Manual**: Actions → Sync Standards from AI Rules → Run workflow

When updates are available, a PR is created for review.

## API Endpoints

### Health Checks

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Basic health check |
| `GET /health/ready` | Readiness check (includes DB) |

## Architecture

This template follows a layered architecture:

```
Controllers → Services → Repositories → Database
     ↓            ↓            ↓
  Validation   Business    Data Access
  & Routing    Logic       & Queries
```

See `.kiro/memory/decisions/` for Architecture Decision Records.

## License

MIT
