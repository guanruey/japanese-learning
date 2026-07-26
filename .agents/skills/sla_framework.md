# SLA Academic Framework & Standards

> **Skill ID**: `sla_framework`
> **Version**: 1.0.0
> **Author**: Antigravity Agent System / SLA Architect

---

## 1. Core SLA Theoretical Foundations

All prompts, evaluations, and content generation within the application MUST adhere strictly to the following 5 Evidence-Based SLA paradigms:

### 1.1 Input Hypothesis (Stephen Krashen)
- **Concept**: `i+1` (Comprehensible Input).
- **Rule**: Content difficulty must always remain within `+0.5` to `+1.0` of the user's current CEFR level.
- **Implementation**: The Prompt Engine must bind the AI's vocabulary and grammar output explicitly to the user's calibrated level.

### 1.2 Noticing Hypothesis (Richard Schmidt)
- **Concept**: Learners must consciously "notice" the gap between their interlanguage and the target language to acquire it.
- **Rule**: In the Post-Task evaluation, the AI MUST explicitly highlight deviations in Pronunciation, Syntax, or Pragmatics.
- **Implementation**: API JSON payloads must carry an `sla_rationale` object explaining the theoretical basis for the correction to trigger conscious noticing.

### 1.3 Cognitive Load Theory (John Sweller)
- **Concept**: Working memory is limited; excessive novelty impedes learning.
- **Rule**: Pre-task scaffolding is mandatory.
- **Implementation**: Before every Pragmatic Scenario, the UI must provide 3-5 key lexical items and a clear contextual background to lower intrinsic cognitive load.

### 1.4 Contrastive Linguistics (Robert Lado)
- **Concept**: L1 (Base Language) heavily interferes with L2 (Target Language) acquisition through Negative Transfer.
- **Rule**: The system must map common L1->L2 errors and preemptively correct them.
- **Implementation**: 
  - `ZH->JA`: Focus on Pitch Accent, Kanji homographs (e.g., 勉強 vs 勉强).
  - `JA->ZH`: Focus on Four Tones, SVO vs SOV order.

### 1.5 Memory Retrieval / FSRS (Wozniak / Open Spaced Repetition)
- **Concept**: Desirable Difficulties and Spaced Repetition optimize long-term retention.
- **Rule**: Successfully deployed vocabulary in active communicative tasks updates the 3D model (R, S, D).
- **Implementation**: The backend tracks Retrievability (R), Stability (S), and Difficulty (D) for every targeted lexical item.

---

## 2. API Response Metadata Standard

When evaluating a user's utterance, the API MUST return a structured JSON response containing the `sla_badge` object. This ensures the frontend can render the "Visible Science Badges".

**Schema Example:**
```json
{
  "feedback": "建議將『すみません』改為『恐れ入りますが』以提升職場得體度。",
  "sla_badge": {
    "theory": "Sociopragmatic Competence",
    "explanation": "根據社會語用學研究，高階職場情境需要適當的委婉敬語 (Mitigation) 以降低溝通阻力。"
  }
}
```
