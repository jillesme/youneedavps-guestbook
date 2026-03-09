# youneedavps.com guestbook

A small guestbook demo for teaching Dokku deployment with SQLite.

Stack:

- [Next.js](https://nextjs.org)
- [Better Auth](https://www.better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- SQLite
- Cloudflare Turnstile

The app is intentionally limited:

- email/password auth only
- optional public display name
- one guestbook message table
- one SQLite file mounted at `/app/data`

## Local development

```bash
cp .env.example .env.local
pnpm install
pnpm db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Required environment variables:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `DATABASE_URL`
- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

Example local database path:

```bash
DATABASE_URL=file:./data/guestbook.sqlite
```

## Docker

The Docker image is intentionally simple:

- one build stage that installs dependencies and runs `next build`
- one runtime stage that installs production dependencies with `pnpm`
- container startup runs `node scripts/migrate.mjs`, then starts `next start`
- SQLite lives at `/app/data/guestbook.sqlite`

Build it:

```bash
docker build -t youneedavps-guestbook .
```

Run it with a mounted data directory:

```bash
docker run \
  --env-file .env.local \
  -p 3000:3000 \
  -v "$(pwd)/data:/app/data" \
  youneedavps-guestbook
```

## Dokku

Create the app:

```bash
dokku apps:create guestbook-nextjs
```

Set the app domain:

```bash
dokku domains:add guestbook-nextjs youneedavps.com
```

Set environment variables:

```bash
dokku config:set guestbook-nextjs \
  BETTER_AUTH_SECRET=replace-with-a-long-random-string \
  BETTER_AUTH_URL=https://youneedavps.com \
  DATABASE_URL=file:./data/guestbook.sqlite \
  TURNSTILE_SITE_KEY=1x00000000000000000000AA \
  TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Mount persistent storage for SQLite:

```bash
dokku storage:ensure-directory guestbook-nextjs
dokku storage:mount guestbook-nextjs /var/lib/dokku/data/storage/guestbook-nextjs:/app/data
```

Push the app:

```bash
git remote add dokku dokku@your-server-ip:guestbook-nextjs
git push dokku main
```

If needed, map Dokku's public ports to the app's internal port:

```bash
dokku ports:set guestbook-nextjs http:80:3000 https:443:3000
```

## Notes

- Drizzle migrations are checked in under `drizzle/`.
- If Turnstile keys are missing, auth still renders locally and shows a warning.
- The Dockerfile uses Node 24 on Debian slim to keep native SQLite dependencies less surprising.
- `DATABASE_URL` is only required when the container starts, not when `docker build` runs.
- The app expects the database file to already exist when the web process starts; the container entrypoint creates it by running migrations first.
