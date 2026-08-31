# DevLens

**See what's actually wrong.**

DevLens is a developer debugging tool. Paste an error, stack trace, crash log, code snippet, API response, or screenshot. DevLens returns a structured diagnosis: problem, cause, fix, and what to check next.

It is not a chatbot.

```text
Developer has a problem
        ↓
Paste / upload it
        ↓
DevLens analyzes it
        ↓
Problem · Cause · Fix · Code
        ↓
Developer gets back to work
```

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- OpenAI API (server-side only)
- Vercel

V1 has no accounts, database, or billing.

## Local

```bash
npm install
cp .env.example .env.local
```

Create `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Never commit `.env.local` or a real API key.

## Vercel

1. Import the repo in Vercel.
2. Go to **Vercel → Project → Settings → Environment Variables**.
3. Add `OPENAI_API_KEY`.
4. Deploy.

Optional: `NEXT_PUBLIC_SITE_URL` for canonical Open Graph URLs.

The key stays on the server. The browser only calls `POST /api/analyze`. There is no `NEXT_PUBLIC_OPENAI_API_KEY`.

## Privacy

Submitted code, logs, and screenshots are used for the current analysis request only. V1 does not persist them on the server or write them to a database.

## Rate limiting

`POST /api/analyze` uses a process-local limiter: **10 requests / 10 minutes** per client identifier.

This is enough to stop obvious repeated requests on a Vercel MVP. Each serverless isolate has its own memory, so it is not a global guarantee.

Upgrade later with:

- Vercel Firewall rate-limiting rules
- Upstash Redis (or another shared store) for a sliding window

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```
