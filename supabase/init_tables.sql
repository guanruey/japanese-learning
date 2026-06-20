-- Grammar table
create table if not exists public.grammar (
  id text primary key,
  level text not null,
  pattern text not null,
  meaning_en text,
  meaning_zh text,
  casual_variant text,
  formal_variant text,
  example_ja text,
  example_zh text,
  explanation text,
  common_mistakes text[],
  related_patterns text[],
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- Vocabulary table
create table if not exists public.vocabulary (
  id text primary key,
  level text not null,
  kanji text,
  reading text not null,
  pos text,
  meaning_zh text,
  meaning_en text,
  example_ja text,
  example_zh text,
  synonyms text[],
  antonyms text[],
  collocations text[],
  conversation_freq text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- Phrases table
create table if not exists public.phrases (
  id text primary key,
  phrase_ja text not null,
  formal text,
  casual text,
  meaning_zh text,
  meaning_en text,
  context text,
  example text,
  related text[],
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- User progress table
create table if not exists public.user_progress (
  id text primary key,
  user_id text not null,
  grammar_completed text[],
  vocabulary_learned int default 0,
  phrases_mastered text[],
  total_study_time int default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- Create indexes
create index if not exists idx_grammar_level on public.grammar(level);
create index if not exists idx_grammar_pattern on public.grammar(pattern);
create index if not exists idx_vocabulary_level on public.vocabulary(level);
create index if not exists idx_vocabulary_reading on public.vocabulary(reading);
create index if not exists idx_user_progress_user_id on public.user_progress(user_id);
