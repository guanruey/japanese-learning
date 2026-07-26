/**
 * FSRS (Free Spaced Repetition Scheduler) 3D Memory Engine
 * Memory State: (R, S, D)
 * R: Retrievability (0.0 - 1.0)
 * S: Stability (days until R decays to 0.9)
 * D: Difficulty (1.0 - 10.0)
 */

export const FSRS_DEFAULT_PARAMS = {
  requestRetention: 0.9, // 90% target retention
  w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61],
}

/**
 * Calculate Retrievability R given elapsed days t and Stability S
 */
export function calculateRetrievability(elapsedDays, stability) {
  if (stability <= 0) return 0
  return Math.pow(1 + elapsedDays / (9 * stability), -1)
}

/**
 * Update Stability S after a review rating (1: Again, 2: Hard, 3: Good, 4: Easy)
 */
export function calculateNextStability(stability, difficulty, retrievability, rating) {
  if (rating === 1) {
    // Forgot - Reset stability to low baseline
    return Math.max(0.5, stability * 0.2)
  }

  const { w } = FSRS_DEFAULT_PARAMS
  const ratingBonus = rating === 4 ? 1.3 : rating === 3 ? 1.0 : 0.85
  const newS = stability * (1 + Math.exp(w[8]) * (11 - difficulty) * Math.pow(stability, -w[9]) * (Math.exp((1 - retrievability) * w[10]) - 1)) * ratingBonus
  return Math.max(0.5, Math.round(newS * 10) / 10)
}

/**
 * Update Difficulty D (1.0 to 10.0)
 */
export function calculateNextDifficulty(difficulty, rating) {
  const delta = (rating - 3) * -0.5
  return Math.min(10.0, Math.max(1.0, Math.round((difficulty + delta) * 10) / 10))
}

/**
 * Bi-directional Data Pipeline: Auto-Hydrate FSRS when user spontaneously uses a word in AI dialogue
 */
export function autoHydrateFromDialogue(vocabItem, userUtterance) {
  if (!vocabItem || !userUtterance) return vocabItem

  const targetWord = (vocabItem.japanese || vocabItem.word || '').toLowerCase()
  const isUsedInSpeech = userUtterance.toLowerCase().includes(targetWord)

  if (isUsedInSpeech) {
    const currentS = vocabItem.fsrs_stability || 2.0
    const currentD = vocabItem.fsrs_difficulty || 5.0
    const currentR = calculateRetrievability(1, currentS)

    // Boost stability S positively without needing manual flashcard review
    const boostedS = calculateNextStability(currentS, currentD, currentR, 3)

    return {
      ...vocabItem,
      fsrs_stability: boostedS,
      fsrs_last_reviewed: new Date().toISOString(),
      fsrs_auto_boosted: true,
    }
  }

  return vocabItem
}
