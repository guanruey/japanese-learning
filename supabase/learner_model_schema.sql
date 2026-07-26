-- Learner Model Schema (v1) SQL Definition
-- This schema translates the learner-model-schema.md into PostgreSQL DDL.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------------------------------
-- 1. TRACKS LAYER
-------------------------------------------------------------------------------

-- 1.1 tracks
-- Defines a single learning track for a user.
CREATE TABLE public.tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    native_language VARCHAR(50) NOT NULL,
    target_language VARCHAR(50) NOT NULL,
    framework_type VARCHAR(50), -- e.g., 'JLPT', 'CEFR'
    goal_type VARCHAR(50),      -- e.g., 'travel', 'exam', 'professional'
    current_level VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'archived'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.2 learner_profiles
-- High-level summary of a track. Read-heavy layer for Today engine.
CREATE TABLE public.learner_profiles (
    track_id UUID PRIMARY KEY REFERENCES public.tracks(id) ON DELETE CASCADE,
    placement_source VARCHAR(100),
    placement_score INTEGER,
    self_reported_confidence INTEGER,
    current_level_estimate VARCHAR(50),
    current_level_confidence INTEGER,
    review_load_estimate_minutes INTEGER DEFAULT 0,
    weakness_summary JSONB DEFAULT '{}'::jsonb,
    recent_task_readiness JSONB DEFAULT '{}'::jsonb,
    last_diagnosed_at TIMESTAMP WITH TIME ZONE,
    last_modeled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.3 active_goals
-- Current learning goals and preferences.
CREATE TABLE public.active_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    goal_category VARCHAR(100),
    goal_label VARCHAR(255) NOT NULL,
    priority INTEGER DEFAULT 1,
    target_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 2. EVENTS & EVIDENCE LAYER
-------------------------------------------------------------------------------

-- 2.1 learning_events
-- Unified event stream for all learning activities.
CREATE TABLE public.learning_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- e.g., 'review_result', 'ai_dialogue_turn'
    source_surface VARCHAR(100),      -- e.g., 'TodayDashboard', 'AiTutor'
    content_id VARCHAR(255),
    task_attempt_id UUID,             -- Will be FK to task_attempts later
    memory_item_id UUID,              -- Will be FK to memory_items later
    skill_node_id UUID,               -- Will be FK to skill_nodes later
    evidence_strength VARCHAR(50),    -- 'weak', 'medium', 'strong'
    success_signal BOOLEAN,
    score DECIMAL(5,2),
    payload_json JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 3. FSRS MEMORY INFRASTRUCTURE
-------------------------------------------------------------------------------

-- 3.1 memory_items
-- Learning units that can be scheduled via FSRS (vocab, grammar, etc.).
CREATE TABLE public.memory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_language VARCHAR(50) NOT NULL,
    item_type VARCHAR(50) NOT NULL,    -- e.g., 'vocabulary', 'grammar'
    content_ref_type VARCHAR(100),
    content_ref_id VARCHAR(255),
    canonical_form VARCHAR(255) NOT NULL,
    difficulty_hint INTEGER,
    tags_json JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3.2 memory_states
-- FSRS state for a specific track and memory item.
CREATE TABLE public.memory_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    memory_item_id UUID NOT NULL REFERENCES public.memory_items(id) ON DELETE CASCADE,
    fsrs_state_json JSONB DEFAULT '{}'::jsonb,
    stability DECIMAL(10,4) DEFAULT 0,
    difficulty DECIMAL(10,4) DEFAULT 0,
    retrievability DECIMAL(5,4),
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    next_due_at TIMESTAMP WITH TIME ZONE,
    overdue_days INTEGER DEFAULT 0,
    evidence_last_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(track_id, memory_item_id)
);

-------------------------------------------------------------------------------
-- 4. SKILL & DIAGNOSIS LAYER
-------------------------------------------------------------------------------

-- 4.1 skill_nodes
-- Cross-content ability nodes (e.g., 'particles', 'politeness').
CREATE TABLE public.skill_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_language VARCHAR(50) NOT NULL,
    framework_type VARCHAR(50),
    skill_category VARCHAR(100),
    skill_code VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    parent_skill_id UUID REFERENCES public.skill_nodes(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.2 skill_states
-- Mastery and weakness state for each skill node per track.
CREATE TABLE public.skill_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    skill_node_id UUID NOT NULL REFERENCES public.skill_nodes(id) ON DELETE CASCADE,
    mastery_score DECIMAL(5,2) DEFAULT 0,
    confidence_score DECIMAL(5,2) DEFAULT 0,
    weakness_score DECIMAL(5,2) DEFAULT 0,
    sample_size INTEGER DEFAULT 0,
    last_evidence_at TIMESTAMP WITH TIME ZONE,
    needs_intervention BOOLEAN DEFAULT false,
    recommended_action_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(track_id, skill_node_id)
);

-- 4.3 error_ontology
-- Contrastive language error definitions (e.g., zh-Hant -> ja).
CREATE TABLE public.error_ontology (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    native_language VARCHAR(50) NOT NULL,
    target_language VARCHAR(50) NOT NULL,
    error_code VARCHAR(100) UNIQUE NOT NULL,
    error_category VARCHAR(100),
    label_zh_hant VARCHAR(255),
    description_zh_hant TEXT,
    severity_policy VARCHAR(50),
    remediation_type VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.4 error_events
-- Log of actual errors made by the learner.
CREATE TABLE public.error_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    learning_event_id UUID REFERENCES public.learning_events(id) ON DELETE CASCADE,
    task_attempt_id UUID, -- Will be FK to task_attempts later
    error_ontology_id UUID REFERENCES public.error_ontology(id) ON DELETE CASCADE,
    skill_node_id UUID REFERENCES public.skill_nodes(id) ON DELETE CASCADE,
    severity VARCHAR(50),
    communication_impact VARCHAR(50),
    was_repaired BOOLEAN DEFAULT false,
    explanation_shown BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 5. DECISION & RECOMMENDATION LAYER
-------------------------------------------------------------------------------

-- 5.1 task_attempts
-- Records of transfer-oriented tasks (TBLT, AI roleplay).
CREATE TABLE public.task_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    task_type VARCHAR(100) NOT NULL,
    scenario_id VARCHAR(255),
    goal_label VARCHAR(255),
    success_status VARCHAR(50),
    communicative_success_score DECIMAL(5,2),
    feedback_summary JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5.2 today_recommendations
-- Explainable recommendations generated by the Today Engine.
CREATE TABLE public.today_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100) NOT NULL,
    reason_code VARCHAR(100),
    reason_text TEXT,
    source_entity_type VARCHAR(100),
    source_entity_id UUID,
    priority_score DECIMAL(5,2) DEFAULT 0,
    estimated_minutes INTEGER,
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expired_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- Add Deferred Foreign Keys (Circular/Forward references)
-------------------------------------------------------------------------------

ALTER TABLE public.learning_events
    ADD CONSTRAINT fk_learning_events_task_attempt
    FOREIGN KEY (task_attempt_id) REFERENCES public.task_attempts(id) ON DELETE CASCADE;

ALTER TABLE public.learning_events
    ADD CONSTRAINT fk_learning_events_memory_item
    FOREIGN KEY (memory_item_id) REFERENCES public.memory_items(id) ON DELETE CASCADE;

ALTER TABLE public.learning_events
    ADD CONSTRAINT fk_learning_events_skill_node
    FOREIGN KEY (skill_node_id) REFERENCES public.skill_nodes(id) ON DELETE CASCADE;

ALTER TABLE public.error_events
    ADD CONSTRAINT fk_error_events_task_attempt
    FOREIGN KEY (task_attempt_id) REFERENCES public.task_attempts(id) ON DELETE CASCADE;

-- END OF SCHEMA
