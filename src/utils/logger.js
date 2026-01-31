/**
 * Logger Utility
 * Environment-aware logging that only logs in development
 * Errors are always logged for production debugging
 */

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

/**
 * Logger object with different log levels
 */
export const logger = {
  /**
   * Log info messages (only in development)
   * @param {...any} args - Arguments to log
   */
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Log warning messages (only in development)
   * @param {...any} args - Arguments to log
   */
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Log error messages (always logged, even in production)
   * @param {...any} args - Arguments to log
   */
  error: (...args) => {
    console.error(...args);
    // In production, you might want to send errors to an error tracking service
    // Example: Sentry.captureException(...args)
  },

  /**
   * Log debug messages (only in development)
   * @param {...any} args - Arguments to log
   */
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Log table data (only in development)
   * @param {...any} args - Arguments to log
   */
  table: (...args) => {
    if (isDev) {
      console.table(...args);
    }
  },

  /**
   * Group related logs (only in development)
   * @param {string} label - Group label
   * @param {Function} fn - Function containing grouped logs
   */
  group: (label, fn) => {
    if (isDev) {
      console.group(label);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  },
};

/**
 * Default export for convenience
 */
export default logger;

