-- Supabase Schema for Japanese Learning App (Phase 5)
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS (Row Level Security) extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table (Linked to Auth)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  target_level TEXT DEFAULT 'N5',
  native_lang TEXT DEFAULT 'zh',
  streak_days INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT FALSE,
  daily_energy INTEGER DEFAULT 3,
  last_energy_refill DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Create User Progress Table (FSRS Spaced Repetition Data)
CREATE TABLE public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word_id TEXT NOT NULL,          -- e.g., 'word_coffee_n5' or raw Japanese word
  stability DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  difficulty DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  retrievability DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  state TEXT NOT NULL DEFAULT 'New', -- 'New', 'Learning', 'Review', 'Relearning'
  last_review TIMESTAMP WITH TIME ZONE,
  due TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  reps INTEGER DEFAULT 0,
  lapses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id, word_id)
);

-- Enable RLS for user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress." ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress." ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress." ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- 4. Create TBLT Sessions Table (Mission Tracking)
CREATE TABLE public.tblt_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  transcript JSONB DEFAULT '[]'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for tblt_sessions
ALTER TABLE public.tblt_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sessions." ON public.tblt_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions." ON public.tblt_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Auto-update updated_at Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
