# Free Spaced Repetition Scheduler (FSRS) Integration

> **Skill ID**: `fsrs_memory`
> **Version**: 1.0.0 (based on FSRS-4.5 specification)
> **Author**: App Manager / Antigravity Agent System

---

## Overview

**Always integrate memory modeling using the FSRS 3D framework.**
Every vocabulary item, grammar point, or kanji in the system has a live memory state
tracked by three variables: **Retrievability (R)**, **Stability (S)**, **Difficulty (D)**.

The goal is to schedule reviews at the moment when forgetting probability reaches the
configured threshold, maximising long-term retention while minimising review burden.

---

## Core State Variables

| Variable | Symbol | Range | Meaning |
|---|---|---|---|
| Retrievability | `R` | 0.0 – 1.0 | Probability of correct recall **right now** |
| Stability | `S` | 0.1 – ∞ (days) | Number of days until R drops to 0.90 |
| Difficulty | `D` | 1.0 – 10.0 | Intrinsic difficulty of the item (higher = harder) |

---

## Retrievability Formula

$$R(t) = \left(1 + F \cdot \frac{t}{S}\right)^C$$

Where:
- `t` = days elapsed since last review
- `S` = current Stability in days
- `F` = decay factor constant = **0.9** (FSRS-4.5 default)
- `C` = curvature constant = **-0.5** (FSRS-4.5 default)

**Implementation note**: When `t = 0`, `R = 1.0` (perfect recall immediately after review).
When `t = S`, `R ≈ 0.90` (the target retrievability threshold).

```typescript
const F = 0.9
const C = -0.5

function retrievability(t: number, S: number): number {
  return Math.pow(1 + F * (t / S), C)
}
```

---

## Target Retrievability

| Setting | Value |
|---|---|
| Default `R_target` | **0.90** |
| User-adjustable range | 0.85 – 0.95 |
| High retention mode (N1 prep) | 0.95 |
| Casual review mode | 0.85 |

**Rule**: Always respect the user-configured `R_target` when computing next review interval.

```typescript
function nextInterval(S: number, R_target: number): number {
  // Solve R(t) = R_target for t
  // t = S * (R_target^(1/C) - 1) / F
  return S * (Math.pow(R_target, 1 / C) - 1) / F
}
```

---

## Stability Update Rules

After each review event, Stability is updated based on the user's response rating:

### Rating Scale
| Rating | Code | Meaning | Stability Multiplier |
|---|---|---|---|
| Again | 1 | Total forget — item reset | `S_new = S_initial(D)` |
| Hard | 2 | Recalled with great difficulty | `S_new = S * 0.8` |
| Good | 3 | Recalled normally | `S_new = S * (e^(0.1*(11-D)) * R * 2.5)` |
| Easy | 4 | Recalled effortlessly | `S_new = S * (e^(0.1*(11-D)) * R * 2.5) * 1.3` |

```typescript
function updateStability(
  S: number, D: number, R: number, rating: 1|2|3|4
): number {
  const S0 = initialStability(D)
  switch (rating) {
    case 1: return S0                                         // Reset
    case 2: return S * 0.8                                   // Hard
    case 3: return S * Math.exp(0.1 * (11 - D)) * R * 2.5  // Good
    case 4: return S * Math.exp(0.1 * (11 - D)) * R * 2.5 * 1.3 // Easy
  }
}
```

### Initial Stability by Difficulty
```typescript
function initialStability(D: number): number {
  // S0 ranges from ~4 days (D=1, easy) to ~0.5 days (D=10, hard)
  return Math.max(0.1, 4 - (D - 1) * 0.35)
}
```

---

## Difficulty Update Rules

Difficulty updates after every review to reflect observed ease/hardness:

```typescript
function updateDifficulty(D: number, rating: 1|2|3|4): number {
  // rating=1 (again) increases difficulty, rating=4 (easy) decreases it
  const delta = -0.8 * (rating - 3)   // -0.8 per step from "Good"
  return Math.min(10, Math.max(1, D + delta))
}
```

---

## Out-of-App & Conversation Trigger Events ⚡

**This is the key innovation of this FSRS integration.**

When a word is **successfully used in an AI dialogue** (spoken correctly, in the right
grammatical context, with the correct politeness level), the system issues a **positive
review event** to update Stability `S` dynamically — **without requiring a manual
flashcard drill**.

### Trigger Conditions (all must be met)
1. Target vocabulary item appears in user utterance
2. Contrastive Prompting skill classifies the usage as **correct** (no PH/GR/KH/PL/CL/VB error codes)
3. The item's current `R(t)` ≥ 0.20 (not completely forgotten)

### Conversation Review Event Processing
```typescript
async function handleConversationReview(
  userId: string,
  vocabId: string,
  wasCorrect: boolean,
  usageContext: string
): Promise<void> {
  const card = await db.getCard(userId, vocabId)
  const t = daysSince(card.lastReview)
  const R = retrievability(t, card.stability)

  if (wasCorrect && R >= 0.20) {
    // Treat as "Good" rating from natural conversation
    const rating = classifyConversationRating(usageContext) // 3 or 4
    card.stability = updateStability(card.stability, card.difficulty, R, rating)
    card.difficulty = updateDifficulty(card.difficulty, rating)
    card.lastReview = new Date()
    card.nextReview = addDays(new Date(), nextInterval(card.stability, user.R_target))
    card.reviewLog.push({ type: 'conversation', rating, context: usageContext })
    await db.saveCard(card)
  }
}
```

---

## Database Schema

```sql
-- Vocabulary memory cards
CREATE TABLE fsrs_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  vocab_id        UUID NOT NULL REFERENCES vocabulary(id),
  stability       FLOAT NOT NULL DEFAULT 1.0,    -- S (days)
  difficulty      FLOAT NOT NULL DEFAULT 5.0,    -- D (1-10)
  retrievability  FLOAT GENERATED ALWAYS AS (    -- R (computed)
    POWER(1 + 0.9 * (
      EXTRACT(EPOCH FROM (NOW() - last_review)) / 86400.0
    ) / stability, -0.5)
  ) STORED,
  last_review     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_review     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  review_count    INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Review event log (includes conversation triggers)
CREATE TABLE fsrs_review_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id     UUID NOT NULL REFERENCES fsrs_cards(id),
  event_type  TEXT NOT NULL CHECK (event_type IN ('flashcard', 'conversation', 'tblt_posttask')),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 4),
  s_before    FLOAT NOT NULL,
  s_after     FLOAT NOT NULL,
  d_before    FLOAT NOT NULL,
  d_after     FLOAT NOT NULL,
  r_at_review FLOAT NOT NULL,
  context     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## FSRS Integration Points in the App

| Feature | Integration Type | Trigger |
|---|---|---|
| Flashcard Session | Manual drill | User rates 1–4 |
| AI Tutor Conversation | Auto review | Word used correctly in dialogue |
| TBLT Post-Task Feedback | Batch update | Task completion, error report generated |
| Daily Dashboard | Read-only | Display `R(t)` for all due items |
| CEFR Progress | Aggregate | Average `S` across N5/N4/N3/N2/N1 vocab sets |

---

## Scheduling Algorithm Summary

```
Every 24 hours (or on app open):
  1. Query all cards WHERE next_review <= NOW()
  2. Sort by R(t) ascending (lowest retrievability first)
  3. Present to user as today's review queue
  4. Cap daily new cards at user.daily_new_limit (default: 10)
  5. Cap daily reviews at user.daily_review_limit (default: 100)
```

---

## API Endpoints Required

```
POST   /api/fsrs/review          — Submit manual review rating
POST   /api/fsrs/conversation     — Submit conversation review event
GET    /api/fsrs/due              — Get today's due review queue
GET    /api/fsrs/stats/{userId}   — Get memory retention statistics
GET    /api/fsrs/forecast/{days}  — Get workload forecast for next N days
```
