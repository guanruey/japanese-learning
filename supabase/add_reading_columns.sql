alter table if exists public.grammar
  add column if not exists reading text,
  add column if not exists example_reading text;

alter table if exists public.vocabulary
  add column if not exists example_reading text;

alter table if exists public.phrases
  add column if not exists reading text,
  add column if not exists example_reading text;

create index if not exists idx_grammar_reading on public.grammar(reading);
create index if not exists idx_vocabulary_example_reading on public.vocabulary(example_reading);
create index if not exists idx_phrases_reading on public.phrases(reading);
