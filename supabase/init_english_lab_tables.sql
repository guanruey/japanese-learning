-- English vocabulary sets
create table if not exists public.english_vocabulary (
  id text primary key,
  category text not null,
  focus text not null,
  register text not null,
  headword text not null,
  meaning_zh text,
  nuance_note text,
  examples text[] default '{}',
  example_zh text[] default '{}',
  collocations text[] default '{}',
  confusables text[] default '{}',
  coaching_tip text,
  tags text[] default '{}',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- English expressions
create table if not exists public.english_expressions (
  id text primary key,
  category text not null,
  function text not null,
  register text not null,
  pattern text not null,
  explanation_zh text,
  usage_note text,
  example_sentence text,
  example_zh text,
  common_errors text[] default '{}',
  tags text[] default '{}',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- English writing points
create table if not exists public.english_writing_points (
  id text primary key,
  category text not null,
  error_type text not null,
  tone text not null,
  weak_sentence text not null,
  better_sentence text not null,
  best_sentence text not null,
  explanation_zh text,
  coaching_tip text,
  tags text[] default '{}',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- English reading passages
create table if not exists public.english_readings (
  id text primary key,
  title text not null,
  topic text not null,
  difficulty text not null,
  question_focus text not null,
  passage text not null,
  summary_zh text,
  glossary jsonb default '[]'::jsonb,
  questions jsonb default '[]'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create index if not exists idx_english_vocabulary_category on public.english_vocabulary(category);
create index if not exists idx_english_vocabulary_focus on public.english_vocabulary(focus);
create index if not exists idx_english_expressions_category on public.english_expressions(category);
create index if not exists idx_english_expressions_function on public.english_expressions(function);
create index if not exists idx_english_writing_category on public.english_writing_points(category);
create index if not exists idx_english_writing_tone on public.english_writing_points(tone);
create index if not exists idx_english_readings_topic on public.english_readings(topic);
create index if not exists idx_english_readings_focus on public.english_readings(question_focus);
