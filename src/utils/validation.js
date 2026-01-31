/**
 * Validation Utilities
 * Reusable validation functions for forms
 */

/**
 * Email validation regex
 * Matches standard email format
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return { isValid: false, error: "Email is required" };
  }

  const trimmedEmail = email.trim();

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: "Email is too long" };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 6)
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`,
    };
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password is too long" };
  }

  return { isValid: true, error: null };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @param {number} minLength - Minimum length (default: 2)
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateName = (name, minLength = 2, maxLength = 50) => {
  if (!name || name.trim() === "") {
    return { isValid: false, error: "Name is required" };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < minLength) {
    return {
      isValid: false,
      error: `Name must be at least ${minLength} characters`,
    };
  }

  if (trimmedName.length > maxLength) {
    return {
      isValid: false,
      error: `Name cannot exceed ${maxLength} characters`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true, error: null };
};

