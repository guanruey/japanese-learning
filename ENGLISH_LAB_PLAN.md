# English Lab Implementation Plan

This app now supports two tracks:

- `Japanese Learning`
- `English Lab`

The Japanese track remains beginner-friendly and JLPT-oriented.
The English track is intended for GEPT Upper-Intermediate learners who already have a basic command of English and need stronger precision, structure, and revision ability.

## Product Goal

English Lab should feel like a focused training environment, not a generic vocabulary website.

Core outcomes:

- Improve precision in word choice
- Build control over formal and semi-formal sentence patterns
- Strengthen reading interpretation
- Upgrade writing quality through revision practice

## IA and Navigation

Top-level switch:

- `日本語學習`
- `English Lab`

English Lab modules:

- `Vocabulary`
- `Expressions`
- `Reading`
- `Writing`

Recommended learning order:

1. Expressions
2. Writing
3. Vocabulary
4. Reading

This order gives learners visible improvement in speaking and writing sooner.

## Module Design

### 1. Vocabulary

Purpose:
Train high-value word families, confusable synonyms, collocations, and register.

Suggested filters:

- Topic
- Register
- Difficulty
- Word family

Suggested content units:

- confusable synonyms
- collocations
- formal replacements
- sentence-level usage

Examples:

- `significant / substantial / considerable`
- `address a concern`
- `play a crucial role`

### 2. Expressions

Purpose:
Provide reusable patterns for explanations, contrast, cause, inference, and cautious claims.

Suggested filters:

- Function
- Register
- Use case

Suggested content units:

- contrast and concession
- cause and implication
- summary and interpretation
- cautious claims
- discussion responses

Examples:

- `While it is true that ...`
- `This suggests that ...`
- `A more plausible explanation is that ...`

### 3. Reading

Purpose:
Train interpretation instead of passive reading.

Suggested filters:

- Topic
- Difficulty
- Question type

Suggested content units:

- medium-length passage
- glossary
- question set
- answer key
- paraphrase notes

Question types:

- main idea
- tone
- inference
- reference
- paraphrase

### 4. Writing

Purpose:
Help learners revise weak learner English into clear, mature English.

Suggested filters:

- Error type
- Skill
- Tone

Suggested content units:

- bad sentence
- improved sentence
- explanation
- follow-up pattern

Examples:

- `Because ... so ...`
- `People can convenient ...`
- `In my opinion, I think ...`

## Suggested Supabase Tables

### `english_vocabulary`

```sql
create table if not exists public.english_vocabulary (
  id text primary key,
  level text not null default 'GEPT Upper-Intermediate',
  topic text,
  headword text not null,
  pos text,
  definition_zh text,
  definition_en text,
  register text,
  confusables text[],
  collocations text[],
  example_sentence text,
  example_zh text,
  notes text,
  created_at timestamptz default timezone('utc', now())
);
```

### `english_expressions`

```sql
create table if not exists public.english_expressions (
  id text primary key,
  category text not null,
  function text,
  pattern text not null,
  register text,
  example_sentence text,
  example_alt text,
  explanation_zh text,
  common_errors text[],
  created_at timestamptz default timezone('utc', now())
);
```

### `english_readings`

```sql
create table if not exists public.english_readings (
  id text primary key,
  title text not null,
  topic text,
  difficulty text,
  passage text not null,
  glossary jsonb,
  questions jsonb,
  answer_key jsonb,
  created_at timestamptz default timezone('utc', now())
);
```

### `english_writing_points`

```sql
create table if not exists public.english_writing_points (
  id text primary key,
  category text not null,
  error_type text,
  bad_example text not null,
  better_example text not null,
  explanation_zh text,
  notes text,
  tags text[],
  created_at timestamptz default timezone('utc', now())
);
```

## Frontend Build Sequence

### Phase 1

- Keep current English Lab overview page
- Add local mock data for all four modules
- Build dedicated module components

### Phase 2

- Connect `Vocabulary` and `Expressions` to Supabase
- Add search and filters
- Add save state for English items

### Phase 3

- Build reading question UI
- Build writing revision exercises
- Add progress and review flows

## Suggested Component Split

- `EnglishLearningHub.jsx`
- `EnglishVocabularyBrowser.jsx`
- `EnglishExpressionsBrowser.jsx`
- `EnglishReadingStudio.jsx`
- `EnglishWritingStudio.jsx`

Shared helpers that may be worth adding later:

- `ModuleShell.jsx`
- `TagRow.jsx`
- `EmptyState.jsx`

## MVP Content Target

- Vocabulary: 100 entries
- Expressions: 60 entries
- Reading: 20 to 30 passages
- Writing: 50 to 80 revision points

## Notes

- Keep the English UI tone more mature than the Japanese track.
- Do not reuse the Japanese reading-support model for English.
- Prioritize Expressions and Writing first because they differentiate the product most clearly.
