# Master Implementation Plan: Trilingual AI Language Learning App

## Phase 1: Core System & FSRS Memory Engine Setup
- [ ] **[Backend]** Initialize FastAPI / Node.js backend workspace with SQLite/PostgreSQL database.
- [ ] **[Engine]** Implement FSRS 3D algorithm module (Calculates R, S, D, and updates card intervals).
- [ ] **[DB Scheme]** Create User, BaseLanguage (ZH/EN/JA), TargetLanguage (ZH/EN/JA), Vocabulary, and ConversationLogs tables.

## Phase 2: Contrastive Prompt Engine & TBLT State Machine
- [ ] **[Prompting]** Implement dynamic System Prompt Builder based on `.agents/skills/contrastive_prompting.md`.
- [ ] **[TBLT Pipeline]** Implement 3-Stage Task Flow:
  - Pre-task: Vocabulary/Grammar scaffolding generation.
  - Task-cycle: Goal-driven conversational loop (checking information gap completion).
  - Post-task: Feedback report generation (Grammar, Politeness, Pronunciation errors).

## Phase 3: Low-Latency WebRTC Voice Pipeline
- [ ] **[Audio Stream]** Integrate WebRTC / WebSocket audio streaming backend (LiveKit / Deepgram STT / Cartesia TTS).
- [ ] **[Pipeline Test]** Ensure end-to-end response latency is strictly under 400ms.
- [ ] **[Memory Loop]** Connect dialogue output tokens with FSRS: Auto-update vocabulary stability when users speak target words correctly.

## Phase 4: Cross-Platform Frontend (Flutter / React Native)
- [ ] **[UI/UX]** Implement Multi-Base Language Selector (Switch base/target language seamlessly).
- [ ] **[Speech UI]** Build Voice Interaction screen with real-time audio visualizer and sub-400ms interruptible conversation logic.
- [ ] **[Dashboard]** Build FSRS memory retention dashboard showing current memory strength and CEFR progress.

## Phase 5: Automated Verification & E2E Testing
- [ ] **[Terminal]** Run backend test suite for FSRS interval calculation and prompt pipeline.
- [ ] **[Browser Control]** Use Antigravity Browser Controller to open web view, simulate Chinese user learning Japanese, execute audio talk, and verify Post-task feedback report generation.

## Phase 6: CEFR Alignment & Dynamic Difficulty Calibration (i+1)
- [x] **[DB]** Update Database Migration schema to support `UserLanguageProfiles` (Language-Pair Profiles).
- [x] **[Engine]** Implement CEFR conversion matrix API in `cefr_converter.py` and `calibration_engine.py` for post-task dynamic step-up/step-down evaluations.
- [x] **[Prompt]** Integrate `calibrated_cefr_level` into the Contrastive Prompt Engine and TBLT State Machine to constrain vocabulary and grammar output complexity.
- [x] **[Frontend/UI]** Implement Onboarding / Settings UI allowing users to select Base/Target languages, Certification types (JLPT/TOEIC/HSK), scores, and self-assessed speaking confidence.
- [x] **[Testing]** Write automated unit tests verifying standard certification mapping (e.g., N4 translates to A2 CEFR) and dynamic prompt constraints.

## Phase 7: 10-Agent Massive Content Generation
- [x] **[Orchestration]** Spawn 10 AI subagents to brainstorm 10 distinct life scenarios (Airport, Hotel, Dining, Hospital, Shopping, Transport, Workplace, Renting, Socializing, Emergencies).
- [x] **[Data Generation]** Compile results into a structured JSON/JS format containing TBLT goals, FSRS vocabulary, and key expressions.
- [x] **[Frontend Integration]** Inject the generated `tblt_scenarios.js` into the `AiTutorHub.jsx` component.

## Phase 8: Academic SLA Standardization & Pragmatic Scenario Expansion
- [x] **[Skill]** 建立 `.agents/skills/sla_framework.md` 規範檔。
- [x] **[Backend Engine]** 建立 `PragmaticScenarioEngine`，支援四大大範疇高頻真實情境的 dynamic Prompt 生成。
- [x] **[API]** 修改對話與後任務評估 API，使其輸出包含 `sla_rationale` 學術實證欄位。
- [x] **[Frontend]** 在 UI 上加入「顯性科學標籤 (Visible Science Badges)」組件，讓用戶清楚了解每個設計的理論背後依據。
- [x] **[Dashboard]** 實作「SLA 學術導向數據盤」（顯示自動化提取率、語用得體度、FSRS 可檢索詞彙量）。
- [x] **[E2E Testing]** 執行測試，驗證模擬用戶在完成一個商務談判任務後，系統能否產出帶有 SLA 學術標籤的完整對話診斷報告。

## Phase 9: Motivational UX & Content Tone Audit
- [x] **[Content QA]** Audit `tblt_scenarios.js` and backend prompts to ensure an encouraging, gamified tone instead of rigid academic phrasing.
- [x] **[UI Polish]** Redesign `SlaBadge.jsx` as "Premium Collectible Cards" with glassmorphism and subtle gradients.
- [x] **[Gamification]** Implement `[Level Up 🚀]` and `[🛡️ AI Assist Mode]` visual states in `AiTutorHub.jsx` and `StatsDashboard.jsx`.

## Phase 10: Production Deployment Strategy
- [ ] **[Backend]** Create `Dockerfile` and `requirements.txt` for the FastAPI AI Engine.
- [ ] **[Database]** Prepare Supabase Cloud production migration and seed data.
- [ ] **[Frontend]** Verify production `.env` files and prepare Vercel deployment.
- [ ] **[Mobile]** Run Capacitor sync (`npx cap sync ios`) with production build to prepare iOS TestFlight archive.
