# Team Gondal

The home of **Team Gondal**, the sim racing community from [techyGondal](https://techygondal.com). Live at **[teamgondal.com](https://teamgondal.com)**.

## What's inside

| Path | What | Stack |
| --- | --- | --- |
| `apps/web` | Public website | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| `apps/api` | Backend API for events, drivers and (soon) results | ASP.NET Core (.NET 10), EF Core, PostgreSQL |
| `docs` | Architecture, roadmap and deployment notes | |

Everything deploys to [Railway](https://railway.com) as one project with three services: `web`, `api` and `postgres`. See [docs/DEPLOY.md](docs/DEPLOY.md).

The crew, their channels, the featured videos and the Discord servers on the home page are hand edited in `apps/web/src/lib/crew.ts` (avatars go in `apps/web/public/crew`). Discord server names and icons are read live from each invite. The Elite Automotive Club invite can be swapped without a code change by setting `NEXT_PUBLIC_ELITE_DISCORD_INVITE` on the web service.

## Run it locally

Requirements: Node 22+, .NET 10 SDK, Docker (for Postgres).

```bash
# 1. Database
docker run -d --name tg-postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:17

# 2. API (http://localhost:5231, OpenAPI at /openapi/v1.json)
cd apps/api
ConnectionStrings__Default="Host=localhost;Database=teamgondal;Username=postgres;Password=postgres" \
ADMIN_API_KEY=dev-key \
dotnet run --project src/TeamGondal.Api

# 3. Web (http://localhost:3000)
cd apps/web
npm install
npm run dev
```

Create a test event:

```bash
curl -X POST http://localhost:5231/api/events \
  -H "Content-Type: application/json" -H "X-Admin-Key: dev-key" \
  -d '{"title":"Friday Night Race","game":"Assetto Corsa","track":"Nordschleife","carClass":"GT3","startsAt":"2026-11-06T03:00:00Z"}'
```

## Tests

```bash
cd apps/api && dotnet test
cd apps/web && npm run lint && npm run build
```

CI runs both on every push and pull request (`.github/workflows/ci.yml`).

## Docs

* [Architecture](docs/ARCHITECTURE.md)
* [Roadmap](docs/ROADMAP.md)
* [Deploying to Railway](docs/DEPLOY.md)
