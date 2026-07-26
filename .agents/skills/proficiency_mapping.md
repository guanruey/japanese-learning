# CEFR Proficiency Mapping & Calibration

> **Skill ID**: `proficiency_mapping`
> **Version**: 1.0.0
> **Author**: App Manager / Antigravity Agent System

---

## 1. Unified CEFR Alignment

All local certification scores provided by the user must be converted to the internal Common European Framework of Reference (CEFR) scale: `A1, A2, B1, B2, C1, C2`.

### Conversion Matrix

**Japanese (JLPT)**
- N5 -> A1
- N4 -> A2
- N3 -> B1
- N2 -> B2
- N1 -> C1

**English (TOEIC)**
- 100-220 -> A1
- 225-545 -> A2
- 550-780 -> B1
- 785-940 -> B2
- 945-990 -> C1

**Chinese (HSK - 6 Level System)**
- HSK 1/2 -> A1
- HSK 3 -> A2
- HSK 4 -> B1
- HSK 5 -> B2
- HSK 6 -> C1/C2

---

## 2. Language-Pair Profile Rule

A user's proficiency is strictly isolated per `(base_language, target_language)` pair.
- Example: If a user learns EN from ZH (`ZH -> EN`), their level is stored in a profile record for `ZH->EN` (e.g. B2).
- If the same user learns JA from ZH (`ZH -> JA`), a separate profile record is created/used (e.g. A1).
- **Rule**: The system must NEVER query global user proficiency. It MUST query `get_profile(user_id, base_lang, target_lang)`.

---

## 3. Dynamic Calibration (i+1)

The system employs Stephen Krashen's `i+1` input hypothesis to adjust difficulty during conversational tasks.

### Triggers for Step-Up (Promotion)
If during a single TBLT Task-Cycle the user:
- Speaks with 0 Grammar (GR) errors.
- Speaks with 0 Vocabulary (VB) gaps.
- Has a response latency of under 2 seconds per turn.
**Action**: Temporarily bump the `calibrated_cefr_level` for the next task by +1 (e.g. A2 -> B1).

### Triggers for Step-Down (Scaffolding)
If during a single TBLT Task-Cycle the user:
- Accrues >= 3 Grammar (GR) or Vocabulary (VB) errors.
- Explicitly says "I don't know" or has long pauses (stalls).
**Action**: Drop the `calibrated_cefr_level` by -1 for the remainder of the conversation, and instruct the AI to switch to **scaffolding mode** (slower speech, use of base language for complex terms).

---

## 4. Prompt Constraint Injections

When `prompt_builder.py` constructs the system prompt, it must bind the AI's vocabulary and grammar output to the `calibrated_cefr_level`.

**A1/A2 Constraints**:
- Use only N5/N4 equivalent grammar (JA) or basic SVO (EN).
- Speak slowly.
- DO NOT use complex idioms or business honorifics.

**B1/B2 Constraints**:
- Use N3/N2 equivalent grammar.
- Speak at a natural conversational pace.
- Introduce colloquialisms and standard politeness (丁寧語/謙譲語).

**C1/C2 Constraints**:
- Use native-level phrasing, complex idioms, and advanced nuances.
- Speak at fast, native tempo.
- Enforce strict business and high-context cultural honorifics if requested by the scenario.
