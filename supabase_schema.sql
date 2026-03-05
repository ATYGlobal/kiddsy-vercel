-- ═══════════════════════════════════════════════════════
-- Kiddsy — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════

-- ─── 1. PROFILES TABLE ───────────────────────────────────────────────────
-- Stores one row per authenticated user, created on first login
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  last_seen   TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (users can only see their own profile)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ─── 2. SAVED STORIES TABLE ──────────────────────────────────────────────
-- Each user's personal story library
CREATE TABLE IF NOT EXISTS public.saved_stories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  story_id    TEXT,                      -- e.g. "generated-1234567890"
  title       TEXT NOT NULL,
  emoji       TEXT,
  color       TEXT,                      -- Tailwind gradient class
  pages       JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url   TEXT,                      -- Optional: AI image URL for puzzle
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS saved_stories_user_idx ON public.saved_stories(user_id, created_at DESC);

-- Row Level Security
ALTER TABLE public.saved_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stories"
  ON public.saved_stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stories"
  ON public.saved_stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories"
  ON public.saved_stories FOR DELETE
  USING (auth.uid() = user_id);


-- ─── 3. AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────────────
-- This trigger runs automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── 4. VERIFY SETUP ─────────────────────────────────────────────────────
-- Run these to confirm everything was created:
-- SELECT * FROM public.profiles LIMIT 5;
-- SELECT * FROM public.saved_stories LIMIT 5;
