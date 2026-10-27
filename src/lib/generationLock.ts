// generationLock.ts
//
// Prevents duplicate generation runs (roadmap / sprint / youtube) from firing
// concurrently. This is a backstop that survives component remounts — a
// useRef guard only protects a single mounted instance, but two instances
// (e.g. from a double-tap that slips past a button's own guard, a stray
// re-render, or a back/forward navigation) each get a fresh ref. localStorage
// is shared across instances (and tabs) in the same browser, so it closes
// that gap.
//
// Design:
// - Lock is acquired synchronously (localStorage read+write, no await in
//   between) right before the async generation call fires.
// - Lock is released in a `finally` block as soon as that generation attempt
//   finishes (success or failure) — so the common case clears in ~70s.
// - LOCK_MAX_AGE_MS is only a safety net for the abandoned case: tab crashes
//   or is force-closed mid-generation and the `finally` never runs. Kept
//   short (2 minutes) so a legitimate retry shortly after a crash isn't
//   silently swallowed for a full 5 minutes.

const LOCK_MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes

export type GenerationType = 'roadmap' | 'sprint' | 'youtube';

function lockKey(type: GenerationType) {
  return `nav_gen_lock:${type}`;
}

/**
 * Attempts to acquire the generation lock for the given type.
 * Returns true if acquired (caller should proceed), false if another
 * generation of the same type is already in flight (caller should silently
 * no-op — do not show an error to the user, this is not a failure state).
 */
export function tryAcquireGenerationLock(type: GenerationType): boolean {
  const key = lockKey(type);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const startedAt = parseInt(raw, 10);
      const ageMs = Date.now() - startedAt;
      if (!Number.isNaN(startedAt) && ageMs < LOCK_MAX_AGE_MS) {
        // Dev-visible confirmation that the guard actually caught something.
        // Doesn't touch the UI — silent to the user, visible in devtools.
        console.warn(
          `[generationLock] Blocked duplicate "${type}" generation — an attempt ` +
          `started ${Math.round(ageMs / 1000)}s ago is still within its lock window ` +
          `(max ${LOCK_MAX_AGE_MS / 1000}s). This mount will not call the AI again.`
        );
        return false; // locked — a generation of this type is already running
      }
      // Stale lock (older than LOCK_MAX_AGE_MS, likely an abandoned/crashed
      // attempt) — fall through and reacquire.
      console.warn(
        `[generationLock] Found a stale "${type}" lock (${Math.round(ageMs / 1000)}s old) — ` +
        `treating as abandoned and reacquiring.`
      );
    }
    localStorage.setItem(key, String(Date.now()));
    return true;
  } catch (err) {
    // localStorage unavailable (private browsing, quota, etc.) — fail open
    // rather than blocking generation entirely.
    console.warn('[generationLock] localStorage unavailable, failing open:', err);
    return true;
  }
}

/** Releases the generation lock for the given type. Always safe to call. */
export function releaseGenerationLock(type: GenerationType) {
  try {
    localStorage.removeItem(lockKey(type));
  } catch {
    // no-op
  }
}
