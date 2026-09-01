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
- Firebase Auth + Firestore
- Vercel

The site is public. Analyzing requires a free Firebase sign-in so OpenAI usage stays capped.

## Local

```bash
npm install
cp .env.example .env.local
```

Create `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

In Firebase Console:

1. Enable **Email/Password** and **Google** under Authentication → Sign-in method.
2. Add `localhost` to Authentication → Settings → Authorized domains.
3. Email/password sign-up sends Firebase’s confirmation email. You can customize the template under Authentication → Templates.
4. Set `FIREBASE_ADMIN_PROJECT_ID` so the server can verify sign-in tokens.
5. For Firestore usage tracking, create a service account (Project settings → Service accounts → Generate new private key) and copy `client_email` and `private_key` into the admin env vars. Keep the private key on one line with `\n` for newlines. Analyze still works without this; daily limits then stay process-local.
6. Create a **Firestore** database in Native mode. Publish `firestore.rules` so a signed-in user can write only `users/{theirUid}`. Until a service account is set, the server writes usage with the user's ID token.

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Never commit `.env.local`, the service account JSON, or a real API key.

## Vercel

1. Import the repo in Vercel.
2. Go to **Vercel → Project → Settings → Environment Variables**.
3. Add `OPENAI_API_KEY` and the Firebase client + admin variables above.
4. In Firebase, add your Vercel domain to Authorized domains and create Firestore if it is not already enabled.
5. Deploy.

Optional: `NEXT_PUBLIC_SITE_URL` for canonical Open Graph URLs.

The OpenAI key stays on the server. The browser only calls `POST /api/analyze` with a Firebase ID token. There is no `NEXT_PUBLIC_OPENAI_API_KEY`.

## Privacy

Submitted code, logs, and screenshots are used for the current analysis request only. They are not written to Firestore.

Usage metadata is stored per account: daily counts, last analyze time, requested mode, input length, whether a screenshot was attached, and high-level result labels (type, technology, severity). The pasted content itself is not stored.

## Auth and usage limits

`POST /api/analyze` requires a valid Firebase ID token.

Each account is limited to:

- **15 analyses per UTC day**
- **8 analyses per 10 minutes**

The daily limit is stored in Firestore when writes succeed. The 10-minute burst limit is still process-local.

Firestore documents:

```text
users/{uid}
  ownerUID, email, emailVerified, createdAt, updatedAt, lastAnalyzedAt
  totalAnalyses, successfulAnalyses, failedAnalyses

users/{uid}/daily/{yyyy-mm-dd}
  date, analyses, successful, failed, updatedAt

users/{uid}/analyses/{id}
  createdAt, day, mode, ok, error
  inputChars, hadScreenshot, analysisType, technology, severity
```

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```
