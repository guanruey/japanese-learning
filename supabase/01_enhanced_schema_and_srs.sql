-- 01_enhanced_schema_and_srs.sql
-- Upgrades Japanese Learning database schema with SRS tracking, pitch accent, theme tags, and performance indexes.

-- 1. Extend Vocabulary Table
ALTER TABLE IF EXISTS vocabulary
  ADD COLUMN IF NOT EXISTS pitch_accent TEXT,
  ADD COLUMN IF NOT EXISTS theme_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- 2. Extend Grammar Table
ALTER TABLE IF EXISTS grammar
  ADD COLUMN IF NOT EXISTS theme_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS cultural_note TEXT;

-- 3. Create User Progress (Spaced Repetition System - SRS) Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'local_user',
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('vocabulary', 'grammar', 'phrase')),
  interval_days INTEGER NOT NULL DEFAULT 0,
  ease_factor DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  repetition_count INTEGER NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_progress_unique_item UNIQUE (user_id, item_id, item_type)
);

-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_vocab_level ON vocabulary(level);
CREATE INDEX IF NOT EXISTS idx_vocab_kanji ON vocabulary(kanji);
CREATE INDEX IF NOT EXISTS idx_grammar_level ON grammar(level);
CREATE INDEX IF NOT EXISTS idx_user_progress_review ON user_progress(user_id, next_review_at);
