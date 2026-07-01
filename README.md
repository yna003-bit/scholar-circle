# Scholar Circle — phase 1

A starter app for posting scholarships/sponsorships and following other students.
Phase 1 covers: login, posting opportunities, like/comment/share, and a public
follow network. Friend requests and DMs are phase 2/3 — not in this codebase yet.

Costs €0 to run at this stage. Everything below is free tier, no credit card required.

## 1. Create a Supabase project (free)

1. Go to supabase.com and create a free account and a new project.
2. In the project dashboard, open **SQL Editor** → **New query**, paste the
   contents of `supabase/schema.sql`, and run it. This creates all the tables
   and access rules.
3. Go to **Project Settings → API**. Copy the **Project URL** and the
   **anon public key** — you'll need both in step 3 below.

## 2. Turn on Google sign-in (free)

1. In Supabase: **Authentication → Providers → Google**, toggle it on.
2. You'll need a Google OAuth client ID/secret — create one for free at
   console.cloud.google.com (APIs & Services → Credentials → OAuth client ID,
   type "Web application"). Add the redirect URL Supabase shows you on that
   same screen.
3. Paste the client ID/secret into the Supabase Google provider screen and save.

Email sign-in (the "Continue with email" magic link) works out of the box —
nothing to configure.

## 3. Configure the app

1. Copy `.env.local.example` to `.env.local`.
2. Fill in the two values from step 1.3 above.

## 4. Run it locally

```
npm install
npm run dev
```

Open http://localhost:3000 — you should land on the login screen.

## 5. Deploy for free

Push this folder to a GitHub repo, then import it at vercel.com (free Hobby
plan). Add the same two environment variables in the Vercel project settings.
Vercel gives you a free `yourapp.vercel.app` URL — a custom domain is optional
and the only real future cost (~€12/year) if you want one.

## What's next (phase 2/3)

Friend requests and DMs need two more tables (`friend_requests`, `messages`)
and a realtime chat screen — bigger pieces, best added once phase 1 is live
and you've seen how people actually use it.
