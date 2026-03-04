# 🔐 Kiddsy Loop — Complete Supabase Auth Setup Guide

Follow these steps exactly. Total time: ~25 minutes.

---

## PART 1 — Create Your Supabase Project

### Step 1.1 — Sign up
Go to **https://supabase.com** → Click **Start your project** → Sign up with GitHub.

### Step 1.2 — New project
1. Click **New project**
2. Name: `kiddsy-loop`
3. Database password: choose a strong password (save it!)
4. Region: choose closest to your users (e.g. `West EU` for Europe)
5. Click **Create new project** — wait ~2 minutes

### Step 1.3 — Get your API keys
Go to **Settings → API** and copy:
- **Project URL** → looks like `https://abcdefgh.supabase.co`
- **anon public** key → a long JWT string

Add these to your `.env` file:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ The `anon` key is safe to put in frontend code — it's designed to be public.
> NEVER put the `service_role` key in frontend code.

---

## PART 2 — Create the Database Tables

### Step 2.1 — Open SQL Editor
In your Supabase project → left sidebar → **SQL Editor** → **New query**

### Step 2.2 — Run the schema
Copy the entire contents of `supabase_schema.sql` and paste it into the editor.
Click **Run** (or Ctrl+Enter).

You should see: `Success. No rows returned.`

### Step 2.3 — Verify
Run these queries to confirm:
```sql
SELECT * FROM public.profiles;
SELECT * FROM public.saved_stories;
```
Both should return empty tables (no rows yet).

---

## PART 3 — Set Up Google OAuth

You'll need a **Google Cloud Console** account (free).

### Step 3.1 — Create a Google Cloud project
1. Go to **https://console.cloud.google.com**
2. Top bar → click the project dropdown → **New Project**
3. Name: `Kiddsy Loop` → **Create**

### Step 3.2 — Enable Google OAuth
1. Left menu → **APIs & Services → OAuth consent screen**
2. Choose **External** → **Create**
3. Fill in:
   - App name: `Kiddsy Loop`
   - User support email: your email
   - App domain: your Vercel URL (e.g. `https://kiddsy-loop.vercel.app`)
   - Developer contact: your email
4. Click **Save and Continue** through all steps
5. On "Test users" step — add your email address for testing

### Step 3.3 — Create OAuth credentials
1. Left menu → **APIs & Services → Credentials**
2. **+ Create Credentials → OAuth Client ID**
3. Application type: **Web application**
4. Name: `Kiddsy Loop Web`
5. **Authorized JavaScript origins** — add:
   ```
   https://YOUR_PROJECT_ID.supabase.co
   http://localhost:3000
   ```
6. **Authorized redirect URIs** — add:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   *(Replace YOUR_PROJECT_ID with your actual Supabase project ID)*
7. Click **Create**

### Step 3.4 — Copy your credentials
A popup shows:
- **Client ID** → looks like `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret** → looks like `GOCSPX-abc123...`

### Step 3.5 — Add to Supabase
1. In Supabase → **Authentication → Providers → Google**
2. Toggle **Enable Google provider** ON
3. Paste your **Client ID** and **Client Secret**
4. **Site URL**: `https://your-app.vercel.app`
5. **Redirect URLs**: add `https://your-app.vercel.app/**` and `http://localhost:3000/**`
6. Click **Save**

---

## PART 4 — Set Up Facebook OAuth

### Step 4.1 — Create a Facebook App
1. Go to **https://developers.facebook.com**
2. Top right → **My Apps → Create App**
3. App type: **Consumer**
4. App name: `Kiddsy Loop`
5. Click through and create the app

### Step 4.2 — Get your App ID and Secret
1. Left sidebar → **Settings → Basic**
2. Copy:
   - **App ID** → a number like `123456789012345`
   - **App Secret** → click "Show" and copy

### Step 4.3 — Add Facebook Login product
1. Left sidebar → **Add Product** → find **Facebook Login** → **Set Up**
2. Choose **Web**
3. Site URL: `https://your-app.vercel.app`

### Step 4.4 — Configure Valid OAuth Redirect URIs
1. Left sidebar → **Facebook Login → Settings**
2. **Valid OAuth Redirect URIs** — add:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
3. Save changes

### Step 4.5 — Add to Supabase
1. In Supabase → **Authentication → Providers → Facebook**
2. Toggle **Enable Facebook provider** ON
3. Paste **App ID** (= Client ID) and **App Secret** (= Client Secret)
4. Save

> **Note:** Facebook apps in development mode only work for users you've added as testers.
> To make it public, submit for Facebook App Review (takes a few days).
> For initial testing, just add your Facebook account as a tester.

---

## PART 5 — Configure Auth Settings in Supabase

### Step 5.1 — Site URL
**Authentication → URL Configuration**
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: 
  ```
  https://your-app.vercel.app/**
  http://localhost:3000/**
  ```

### Step 5.2 — Enable Email Auth (Magic Link)
**Authentication → Providers → Email**
- Enable **Email** provider ✅
- Enable **Confirm email** ✅ (recommended)
- Enable **Magic Link** ✅

### Step 5.3 — Email templates (optional)
**Authentication → Email Templates**
- You can customize the Magic Link and Welcome emails with Kiddsy branding.

---

## PART 6 — Deploy to Vercel

### Step 6.1 — Add env vars to Vercel
In Vercel Dashboard → your project → **Settings → Environment Variables**

Add these two:
| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...your anon key...` |
| `OPENAI_API_KEY` | `sk-...your OpenAI key...` |

### Step 6.2 — Redeploy
Push a commit or click **Redeploy** in Vercel.

---

## PART 7 — Install Supabase npm package

```bash
npm install @supabase/supabase-js
```

Make sure it's in your `package.json` dependencies.

---

## PART 8 — Test the flow

1. Open your app → click **Sign In**
2. Try **Magic Link** → enter your email → check inbox → click link
3. Your name should appear in the Navbar top-right
4. Navigate to **My Library** → should be empty for now
5. Go to **Create Story** → generate one → it saves automatically
6. Back to **My Library** → story appears!
7. Hover story → click **Play Puzzle** → sliding puzzle with story emojis!

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Invalid API key" error | Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env |
| Google OAuth fails | Check redirect URI exactly matches in Google Console |
| Facebook "App not live" | Add yourself as Facebook test user in App Dashboard |
| Magic link not arriving | Check spam folder; verify email provider is enabled in Supabase |
| Profile not created | Run the SQL schema again — check the trigger was created |
| CORS error | Add `http://localhost:3000` to Supabase → Auth → URL Configuration |

---

## Security Notes

- ✅ `VITE_SUPABASE_ANON_KEY` — safe to expose in frontend (it's designed for this)
- ✅ Row Level Security (RLS) ensures users can only see their own data
- ✅ `OPENAI_API_KEY` — only on the backend (`api/index.js`), never in frontend code
- ❌ Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend
- ❌ Never expose OAuth Client Secrets in frontend
