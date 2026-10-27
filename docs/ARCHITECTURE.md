# Architecture

```
            teamgondal.com
                  │
          ┌───────▼────────┐        private network        ┌──────────────┐
 Browser ─►  web (Next.js) ├──────────────────────────────►│ api (.NET 10)│
          └────────────────┘   API_URL (railway.internal)  └──────┬───────┘
                                                                  │ DATABASE_URL
                                                           ┌──────▼───────┐
                                                           │  PostgreSQL  │
                                                           └──────────────┘
```

## Principles

* **The web app renders on the server.** Pages fetch from the API over Railway's private network, so the API does not need to be public at first. Pages revalidate every 60 seconds.
* **The API owns the data.** All business rules and validation live in `apps/api`. The web app never talks to Postgres directly.
* **Each app deploys on its own.** Railway watch patterns mean a change in `apps/web` only redeploys the web service, and the same for the API.
* **Pages degrade gracefully.** If the API is down, pages show a friendly empty state instead of an error.

## API

Minimal APIs grouped by feature in `src/TeamGondal.Api/Endpoints`.

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/health` | none |
| GET | `/api/events?upcoming=true` | none |
| GET | `/api/events/{id}` | none |
| POST, DELETE | `/api/events` | `X-Admin-Key` |
| GET | `/api/drivers`, `/api/drivers/{id}` | none |
| POST | `/api/drivers` | `X-Admin-Key` |

The admin key is a stopgap. It is replaced by Discord sign in with roles (see the roadmap).

## Data

EF Core with Npgsql. The schema is created on startup with `EnsureCreated` while the model is young. Before real data matters, switch to migrations:

```bash
dotnet tool install --global dotnet-ef
cd apps/api/src/TeamGondal.Api
dotnet ef migrations add Initial
```

then replace `EnsureCreatedAsync()` with `MigrateAsync()` in `Program.cs`.

Railway provides `DATABASE_URL` as a `postgresql://` URI; `ConnectionStrings.Resolve` converts it for Npgsql.

## Configuration

| Service | Variable | Purpose |
| --- | --- | --- |
| api | `DATABASE_URL` | Reference to the Postgres service |
| api | `ADMIN_API_KEY` | Protects write endpoints until Discord auth |
| api | `CORS_ORIGINS` | Comma separated origins allowed for browser calls |
| web | `API_URL` | Private URL of the API service |
| web | `NEXT_PUBLIC_DISCORD_INVITE` | Discord invite link (build time) |
| web | `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
