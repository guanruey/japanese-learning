/**
 * Today Engine v1
 * 
 * Responsible for scoring and returning the [primary, secondary, optional]
 * next-best-actions based on learner context (FSRS, weakness, goals).
 */

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

import { generateWeaknessPrescriptions } from './weaknessEngine.js';

/**
 * @param {Object} context
 * @param {number} context.srsDueCount - Number of due FSRS items
 * @param {Object} context.weaknessScores - e.g. { 'grammar.particles': 80 }
 * @param {Object} context.weaknessStats - tracking sample sizes
 * @param {string} context.userGoal - User's active goal (travel, exam, etc.)
 * @param {boolean} context.isJapanese - Target language check
 * @param {Object} context.randomGrammar - Optional fallback item
 * @returns {Array} Array of up to 3 recommendations: [primary, secondary, optional]
 */
export function generateTodayRecommendations(context) {
  const { srsDueCount, weaknessScores, weaknessStats, userGoal, isJapanese, randomGrammar } = context;

  const candidates = [];

  // --- 1. Due Review ---
  let reviewScore = 0;
  if (srsDueCount > 0) {
    // Urgency (0-30): Highly urgent if many due items.
    let urgency = Math.min(srsDueCount * 2, 30);
    // LearningValue (0-25)
    let value = 15;
    
    reviewScore = urgency + value;
    
    candidates.push({
      type: 'due_review',
      priority_score: reviewScore,
      action: 'review',
      color: 'rose',
      emoji: '🔥',
      context: 'AI 學習管家建議',
      title: srsDueCount > 10 ? '記憶負債過高！' : '每日記憶複習',
      reason_text: `您有 ${srsDueCount} 個單字/文法已經接近遺忘，現在是複習的最佳時機。`,
      reason_codes: ['memory_due'],
      estimated_minutes: Math.max(2, Math.ceil(srsDueCount * 0.3))
    });
  }

  // --- 2. Weakness Micro-practice ---
  // --- 2. Weakness Micro-practice ---
  const prescriptions = generateWeaknessPrescriptions(weaknessScores, weaknessStats || {}, userGoal);
  if (prescriptions.length > 0) {
    const topWeakness = prescriptions[0]; // Get the most actionable weakness
    
    candidates.push({
      type: 'weakness_micro_practice',
      priority_score: topWeakness.priority_score,
      action: 'aitutor',
      color: 'amber',
      emoji: '🚑',
      context: '重點弱項補強',
      title: topWeakness.title,
      reason_text: topWeakness.supporting_message,
      reason_codes: ['recent_error_recurrence', 'actionable_weakness'],
      estimated_minutes: topWeakness.recommended_activity.duration_minutes
    });
  }

  // --- 3. Path Continuation ---
  // Baseline task, always available.
  const pathScore = 50; // Moderate priority baseline
  candidates.push({
    type: 'path_continuation',
    priority_score: pathScore,
    action: 'lesson',
    color: 'primary',
    emoji: '💡',
    context: `今日焦點 · ${randomGrammar?.level || 'N5'}`,
    title: randomGrammar?.example_ja || (isJapanese ? 'コーヒーをひとつください。' : "Let's learn something new!"),
    reason_text: '根據您的課程進度，這是最適合您當前程度的下一堂課。',
    reason_codes: ['path_progression'],
    estimated_minutes: 5,
    romaji: randomGrammar?.example_reading || (isJapanese ? 'Kōhī o hitotsu kudasai.' : ''),
    translation: randomGrammar?.example_zh || (isJapanese ? '請給我一杯咖啡。' : '')
  });

  // --- 4. TBLT Transfer Task ---
  // High value if goal aligns, especially if they haven't done one today
  const tbltScore = userGoal === 'travel' || userGoal === 'work' ? 65 : 45;
  candidates.push({
    type: 'tblt_transfer_task',
    priority_score: tbltScore,
    action: 'aitutor',
    color: 'indigo',
    emoji: '🗣️',
    context: '情境溝通實戰',
    title: '與 AI 進行實境對話',
    reason_text: `您的目標是「${userGoal === 'travel' ? '旅遊' : '實戰'}」，透過實際對話能大幅提升口說信心。`,
    reason_codes: ['goal_relevant', 'transfer_practice'],
    estimated_minutes: 8
  });

  // --- 5. Confidence Quick Win ---
  // If they have huge debts, they might be fatigued, offer an easy win.
  const quickWinScore = srsDueCount > 20 ? 70 : 30; // High priority if highly fatigued
  candidates.push({
    type: 'confidence_quick_win',
    priority_score: quickWinScore,
    action: 'lesson',
    color: 'emerald',
    emoji: '🌟',
    context: '輕鬆暖身',
    title: '無壓力單字小測驗',
    reason_text: '感覺有點壓力嗎？來一場簡單的 2 分鐘測驗找回語感吧！',
    reason_codes: ['fatigue_recovery', 'short_session_fit'],
    estimated_minutes: 2
  });

  // Sort candidates by priority score descending
  candidates.sort((a, b) => b.priority_score - a.priority_score);

  // Hard Rule 1: Limit to 3 recommendations
  // Hard Rule 2: Try not to make them all the same `action` type
  const selected = [];
  const actionCounts = {};

  for (const c of candidates) {
    if (selected.length >= 3) break;
    
    // Prevent more than 2 of the exact same action type if possible
    if (actionCounts[c.action] >= 2 && selected.length < 2) {
      continue;
    }
    
    c.recommendation_id = generateUUID();
    selected.push(c);
    actionCounts[c.action] = (actionCounts[c.action] || 0) + 1;
  }

  // Assign slots
  const results = [];
  if (selected.length > 0) {
    selected[0].slot = 'primary';
    results.push(selected[0]);
  }
  if (selected.length > 1) {
    selected[1].slot = 'secondary';
    results.push(selected[1]);
  }
  if (selected.length > 2) {
    selected[2].slot = 'optional';
    results.push(selected[2]);
  }

  return results;
}
