import { useCallback } from 'react';

/**
 * useHaptics
 * Provides consistent haptic feedback patterns across the application.
 * Falls back gracefully if `navigator.vibrate` is not supported (e.g. iOS Safari without PWA, Desktop).
 */
export function useHaptics() {
  const vibrate = useCallback((pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore vibration errors
      }
    }
  }, []);

  // Light tap for selections, tab switches, button clicks
  const hapticSelection = useCallback(() => {
    vibrate(10);
  }, [vibrate]);

  // Success / Achievement unlocked (double tap)
  const hapticSuccess = useCallback(() => {
    vibrate([20, 50, 20]);
  }, [vibrate]);

  // Error / Mistake made (heavy long vibration)
  const hapticError = useCallback(() => {
    vibrate(50);
  }, [vibrate]);

  return {
    hapticSelection,
    hapticSuccess,
    hapticError
  };
}
