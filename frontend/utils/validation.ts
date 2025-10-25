/**
 * Form validation utility functions
 * @module utils/validation
 */

/**
 * Validates login form credentials
 * @param {string} username - Username to validate
 * @param {string} password - Password to validate
 * @returns {{isValid: boolean, errors: {username?: string, password?: string}}} Validation result
 */
export const validateLoginForm = (
  username: string,
  password: string
): {
  isValid: boolean;
  errors: { username?: string; password?: string };
} => {
  const errors: { username?: string; password?: string } = {};

  if (!username || username.trim().length === 0) {
    errors.username = 'Username is required';
  }

  if (!password || password.trim().length === 0) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formats Pokemon name for display
 * @param {string} name - Pokemon name to format
 * @returns {string} Formatted name
 */
export const formatPokemonName = (name: string): string => {
  return name
    .split('-')
    .map((part) => capitalize(part))
    .join(' ');
};
