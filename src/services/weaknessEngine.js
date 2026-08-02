/**
 * Weakness Analysis v1
 * 
 * Generates weakness prescriptions based on weaknessScores and weaknessStats.
 */

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Map skill keys to human readable names and prescriptions
const ONTOLOGY_MAP = {
  'grammar.particles': {
    title: '地點與目的地助詞',
    supporting_message: '你已能表達移動意思；接下來把「去某地」和「在某地做事」分清楚，旅遊對話會更順。',
    why_it_matters: '在問路、搭車、預約時，「に」和「で」會改變目的地與動作場所的意思。',
    activity: {
      type: 'micro_practice.location_particles',
      title: '用地圖練習「に / で」',
      duration_minutes: 4,
      success_criteria: '連續完成 5 題情境選擇，並在 1 個短句中正確使用助詞。'
    }
  },
  'grammar.conjugation.te_form': {
    title: '動詞て形變化',
    supporting_message: 'て形是日語對話的樞紐；只要掌握三個主要群組的變化規則，就能輕鬆說出請求與順序。',
    why_it_matters: '無論是請店員幫忙「～てください」或是描述動作順序，都需要精準的て形。',
    activity: {
      type: 'micro_practice.te_form',
      title: 'て形快速反應特訓',
      duration_minutes: 3,
      success_criteria: '完成 10 組動詞原形轉て形的配對。'
    }
  },
  'vocabulary.keigo': {
    title: '基礎敬語表現',
    supporting_message: '你已經具備很好的詞彙量；套用簡單的敬語規則，可以讓你在職場與飯店更得體。',
    why_it_matters: '過於直接的語氣可能會讓服務人員或長輩感到錯愕，加上「お」或改用謙讓語能瞬間提升好感度。',
    activity: {
      type: 'micro_practice.keigo',
      title: '服務業情境敬語',
      duration_minutes: 5,
      success_criteria: '在 3 個對話情境中選出正確的敬語回應。'
    }
  }
};

const DEFAULT_PRESCRIPTION = {
  title: '文法與句型結構',
  supporting_message: '你在單字上已經累積了不少實力，只要把句型結構稍微調整，表達就會更自然。',
  why_it_matters: '正確的句型結構能幫助母語者更快理解你的意圖，避免溝通誤會。',
  activity: {
    type: 'micro_practice.general',
    title: 'AI 弱點特訓',
    duration_minutes: 3,
    success_criteria: '完成 AI 教練為你準備的 3 題客製化短句。'
  }
};

/**
 * 
 * @param {Object} weaknessScores { 'grammar.particles': 80 }
 * @param {Object} weaknessStats { 'grammar.particles': { occurrences: 4, recentSuccesses: 0 } }
 * @param {string} userGoal e.g., 'travel'
 */
export function generateWeaknessPrescriptions(weaknessScores, weaknessStats, userGoal) {
  const candidates = [];
  const safeScores = weaknessScores || {};

  for (const [key, score] of Object.entries(safeScores)) {
    const stats = weaknessStats[key] || { occurrences: 0, recentSuccesses: 0 };
    
    // Lifecycle rules:
    // Need at least 3 occurrences to move out of 'observing' to 'candidate' or 'actionable'
    if (stats.occurrences < 3) continue;

    // If recent successes >= 3, it's 'improving' or 'repaired', do not show as top actionable
    if (stats.recentSuccesses >= 3) continue;

    // Must have a minimum score to be actionable
    if (score < 40) continue;

    // Calculate Priority Score
    // Recurrence (0-25)
    const recurrence = Math.min(stats.occurrences * 5, 25);
    // Impact & Repairability based on score
    const impact = score > 70 ? 25 : 15;
    const repairability = 15;
    // Goal Relevance
    let goalRelevance = 5;
    if (userGoal === 'travel' && key === 'grammar.particles') goalRelevance = 15;
    if (userGoal === 'work' && key === 'vocabulary.keigo') goalRelevance = 15;
    
    // Recovery Evidence (penalty)
    const recoveryPenalty = stats.recentSuccesses * 5;

    const priorityScore = recurrence + impact + goalRelevance + repairability - recoveryPenalty;

    const template = ONTOLOGY_MAP[key] || { ...DEFAULT_PRESCRIPTION, title: key.replace('grammar.', '').replace('_', ' ') };

    candidates.push({
      weakness_id: generateUUID(),
      track_id: 'default-track-001',
      status: 'actionable',
      priority_score: priorityScore,
      title: template.title,
      supporting_message: template.supporting_message,
      why_it_matters: template.why_it_matters,
      evidence_summary: {
        recent_occurrences: stats.occurrences,
        communication_impact: impact >= 20 ? 'high' : 'medium',
        confidence: 0.85
      },
      recommended_activity: template.activity,
      recheck_plan: {
        trigger: "next_related_task_or_review",
        required_successes: 3
      },
      _rawKey: key // for internal reference
    });
  }

  // Sort by priority descending
  candidates.sort((a, b) => b.priority_score - a.priority_score);

  // Return max 3 actionable weaknesses
  return candidates.slice(0, 3);
}
