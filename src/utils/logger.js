/**
 * Logger Utility
 * Environment-aware logging that only logs in development
 * Errors are always logged for production debugging
 * 
 * ⚠️ PRODUCTION BEHAVIOR:
 * - log(), info(), warn(), debug(), table() → SUPPRESSED (no output)
 * - error() → ALWAYS LOGGED (for debugging production issues)
 * 
 * 💡 USAGE:
 * - Use logger.log() or logger.info() for general information
 * - Use logger.debug() for detailed debugging info
 * - Use logger.warn() for non-critical warnings
 * - Use logger.error() for errors (always logged)
 */

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

/**
 * Logger object with different log levels
 * All methods except error() are suppressed in production
 */
export const logger = {
  /**
   * Log general info messages (SUPPRESSED IN PRODUCTION)
   * @param {...any} args - Arguments to log
   */
  log: (...args) => {
    if (isDev) {
      console.log("ℹ️", ...args);
    }
  },

  /**
   * Log info messages (SUPPRESSED IN PRODUCTION)
   * Alias for log() for semantic clarity
   * @param {...any} args - Arguments to log
   */
  info: (...args) => {
    if (isDev) {
      console.info("ℹ️", ...args);
    }
  },

  /**
   * Log warning messages (SUPPRESSED IN PRODUCTION)
   * @param {...any} args - Arguments to log
   */
  warn: (...args) => {
    if (isDev) {
      console.warn("⚠️", ...args);
    }
  },

  /**
   * Log error messages (ALWAYS LOGGED - PRODUCTION & DEVELOPMENT)
   * Use this for errors that need to be tracked in production
   * @param {...any} args - Arguments to log
   */
  error: (...args) => {
    if (isProd) {
      // In production, send errors to an error tracking service
      // Example: Sentry.captureException(...args);
    }
    console.error("❌", ...args);
  },

  /**
   * Log debug messages (SUPPRESSED IN PRODUCTION)
   * @param {...any} args - Arguments to log
   */
  debug: (...args) => {
    if (isDev) {
      console.debug("🐛", ...args);
    }
  },

  /**
   * Log table data (SUPPRESSED IN PRODUCTION)
   * @param {...any} args - Arguments to log
   */
  table: (...args) => {
    if (isDev) {
      console.table(...args);
    }
  },

  /**
   * Group related logs (SUPPRESSED IN PRODUCTION)
   * @param {string} label - Group label
   * @param {Function} fn - Function containing grouped logs
   */
  group: (label, fn) => {
    if (isDev) {
      console.group(label);
      fn();
      console.groupEnd();
    } else {
      // Execute function but don't show group
      fn();
    }
  },

  /**
   * Start a timer (SUPPRESSED IN PRODUCTION)
   * @param {string} label - Timer label
   */
  time: (label) => {
    if (isDev) {
      console.time(label);
    }
  },

  /**
   * End a timer (SUPPRESSED IN PRODUCTION)
   * @param {string} label - Timer label
   */
  timeEnd: (label) => {
    if (isDev) {
      console.timeEnd(label);
    }
  },
};

/**
 * Default export for convenience
 */
export default logger;

