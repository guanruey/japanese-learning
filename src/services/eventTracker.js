/**
 * Event Tracker Service
 * Implements the PRD requirements for Learner Model schema event taxonomy.
 * Captures raw immutable learning evidence and emits them in a standard envelope.
 */

// A simple local buffer for MVP logging (to simulate ingestion without triggering actual DB writes)
const eventBuffer = [];

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Tracks a standardized learning event
 * 
 * @param {Object} params
 * @param {string} params.eventType - e.g., 'review.item_rated', 'lesson.item_answered'
 * @param {string} params.sourceSurface - e.g., 'PracticeHub', 'AiTutor', 'Onboarding'
 * @param {string} [params.trackId] - User's current learning track ID
 * @param {Object} [params.contentRef] - Reference to the content { type, id }
 * @param {string[]} [params.skillRefs] - Array of skill codes
 * @param {string[]} [params.memoryItemRefs] - Array of memory item ids
 * @param {string} [params.evidenceStrength] - 'observational', 'weak', 'medium', 'strong', 'verified'
 * @param {number} [params.confidence] - Float 0.0 ~ 1.0
 * @param {string} [params.outcome] - e.g., 'success', 'failure', 'abandoned'
 * @param {Object} params.payload - Custom JSON payload specific to the event type
 */
export function trackLearningEvent({
  eventType,
  sourceSurface,
  trackId = 'default-track-001', // Mock default track
  contentRef = null,
  skillRefs = [],
  memoryItemRefs = [],
  evidenceStrength = 'observational',
  confidence = 1.0,
  outcome = 'success',
  payload = {}
}) {
  const eventEnvelope = {
    id: generateUUID(),
    track_id: trackId,
    event_type: eventType,
    event_version: 1,
    source_surface: sourceSurface,
    source_session_id: generateUUID(), // Mock session ID for MVP
    content_ref: contentRef,
    skill_refs: skillRefs,
    memory_item_refs: memoryItemRefs,
    task_attempt_id: null,
    occurred_at: new Date().toISOString(),
    evidence_strength: evidenceStrength,
    confidence: confidence,
    outcome: outcome,
    payload: payload,
    actor: 'learner',
    created_at: new Date().toISOString()
  };

  // Push to local buffer
  eventBuffer.push(eventEnvelope);

  // Print to console clearly for QA and debugging
  console.log(`[EventTracker: ${eventType}]`, eventEnvelope);
}

// Helper to inspect buffered events (useful for dev tools or subagents)
export function getEventBuffer() {
  return [...eventBuffer];
}
