/**
 * Async Handler Wrapper
 * Eliminates try-catch blocks in async route handlers
 * Automatically passes errors to Express error middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
