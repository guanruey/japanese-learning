alter table public.grammar enable row level security;
alter table public.vocabulary enable row level security;
alter table public.phrases enable row level security;
alter table public.english_vocabulary enable row level security;
alter table public.english_expressions enable row level security;
alter table public.english_writing_points enable row level security;
alter table public.english_readings enable row level security;

drop policy if exists "content_studio_grammar_write" on public.grammar;
create policy "content_studio_grammar_write"
on public.grammar
for all
to anon
using (true)
with check (true);

drop policy if exists "content_studio_vocabulary_write" on public.vocabulary;
create policy "content_studio_vocabulary_write"
on public.vocabulary
for all
to anon
using (true)
with check (true);

drop policy if exists "content_studio_phrases_write" on public.phrases;
create policy "content_studio_phrases_write"
on public.phrases
for all
to anon
using (true)
with check (true);

drop policy if exists "content_studio_english_vocabulary_write" on public.english_vocabulary;
create policy "content_studio_english_vocabulary_write"
on public.english_vocabulary
for all
to anon
using (true)
with check (true);

drop policy if exists "content_studio_english_expressions_write" on public.english_expressions;
create policy "content_studio_english_expressions_write"
on public.english_expressions
for all
to anon
using (true)
with check (true);

drop policy if exists "content_studio_english_writing_write" on public.english_writing_points;
create policy "content_studio_english_writing_write"
on public.english_writing_points
for all
to anon
using (true)
with check (true);

drop policy if exists "content_studio_english_readings_write" on public.english_readings;
create policy "content_studio_english_readings_write"
on public.english_readings
for all
to anon
using (true)
with check (true);
