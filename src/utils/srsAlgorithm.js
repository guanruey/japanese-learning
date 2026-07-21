/**
  * SuperMemo 2 (SM-2) Algorithm implementation for Spaced Repetition System (SRS).
  * 
  * Rating scale:
  * 1: Again (Complete fail)
  * 2: Hard (Recall with heavy hesitation)
  * 3: Good (Recall with slight hesitation)
  * 4: Easy (Perfect recall)
  */
export function calculateNextSRSState({
  rating, // 1 to 4
  repetitionCount = 0,
  intervalDays = 0,
  easeFactor = 2.5
}) {
  let newRepetitionCount = repetitionCount
  let newIntervalDays = intervalDays
  let newEaseFactor = easeFactor

  // Rating 1: Fail (Reset item)
  if (rating < 3) {
    newRepetitionCount = 0
    newIntervalDays = 1
  } else {
    // Rating >= 3: Success
    if (repetitionCount === 0) {
      newIntervalDays = 1
    } else if (repetitionCount === 1) {
      newIntervalDays = 6
    } else {
      newIntervalDays = Math.round(intervalDays * easeFactor)
    }
    newRepetitionCount += 1
  }

  // Calculate new Ease Factor (EF)
  // q in SM-2 is 0-5, mapping 1-4 rating to q=2,3,4,5
  const q = rating + 1
  newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

  // Clamp Ease Factor minimum to 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3
  }

  // Compute next review timestamp
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newIntervalDays)

  return {
    repetitionCount: newRepetitionCount,
    intervalDays: newIntervalDays,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    nextReviewAt: nextReviewDate.toISOString()
  }
}
