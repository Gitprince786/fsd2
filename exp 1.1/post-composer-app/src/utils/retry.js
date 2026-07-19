/**
 * Resilient retry utility with support for attempt delays and status hooks.
 * @param {Function} fn - The asynchronous function to execute.
 * @param {number} retries - Number of remaining attempts.
 * @param {number} delayMs - Delay duration in milliseconds between retries.
 * @param {Function} onRetry - Optional callback triggered on each retry attempt: (attemptNumber, error) => void
 * @param {number} _currentAttempt - Internal counter for retry attempts.
 */
export async function retry(fn, retries = 3, delayMs = 1000, onRetry = null, _currentAttempt = 1) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Notify about retry attempt
    if (onRetry) {
      onRetry(_currentAttempt, error);
    }
    
    // Wait for the specified delay before retrying
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    
    // Recursive retry call with decremented retries
    return retry(fn, retries - 1, delayMs, onRetry, _currentAttempt + 1);
  }
}
