# Deploying to Railway

One Railway project, three services. Each app has a `railway.json` next to it describing its build and deploy settings. Railway no longer accepts `railway.json` (config as code) on new services, so those settings are applied in the service settings instead; the files remain as the reference. Migrating to `.railway/railway.ts` (infrastructure as code) is on the roadmap.

## One time setup

1. In Railway, create a project named **teamgondal**.
2. **Add Postgres:** New → Database → PostgreSQL.
3. **Add the API:** New → GitHub Repo → `teamgondal`.
   * Settings → Root Directory: `apps/api`
   * Settings: Dockerfile path `Dockerfile`, watch path `/apps/api/**`, healthcheck `/health`
   * Variables:
     * `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
     * `ADMIN_API_KEY` = a long random string (keep it secret)
     * `CORS_ORIGINS` = `https://teamgondal.com,https://www.teamgondal.com`
   * Rename the service to `api`. No public domain needed yet.
4. **Add the web app:** New → GitHub Repo → `teamgondal` again.
   * Settings → Root Directory: `apps/web`
   * Settings: build `npm run build`, start `npm run start`, watch path `/apps/web/**`, healthcheck `/`
   * Variables:
     * `API_URL` = `http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}`
     * `NEXT_PUBLIC_SITE_URL` = `https://teamgondal.com`
     * `NEXT_PUBLIC_DISCORD_INVITE` = your Discord invite link
   * Rename the service to `web`.
   * Settings → Networking → Generate Domain to test, then add custom domains `teamgondal.com` and `www.teamgondal.com`.
5. At your domain registrar, add the DNS records Railway shows for each custom domain. Railway issues the SSL certificate automatically.

The API listens on Railway's `PORT`. If the private `api.PORT` reference is empty, set `PORT=8080` on the api service.

## Every day

Push to `main`. Railway redeploys only the service whose folder changed.
