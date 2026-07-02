// Dezentes haptisches Feedback für Belohnungsmomente.
// Android-Browser unterstützen navigator.vibrate; iOS ignoriert es still.
export function buzz(pattern = 20) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern)
  } catch {
    /* ignore */
  }
}
