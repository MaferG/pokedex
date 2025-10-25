/**
 * Authentication service for managing user sessions
 * @module services/auth
 */

import { CONFIG } from '../config/constants.js';

// In-memory session storage (in production, use Redis or a proper session store)
const sessions = new Map();

/**
 * Authenticates a user with username and password
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to authenticate
 * @returns {{success: boolean, token?: string, error?: string}} Authentication result
 */
export const authenticate = (username, password) => {
  if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
    const token = generateToken();
    const expiresAt = Date.now() + CONFIG.SESSION_DURATION;

    sessions.set(token, {
      username,
      createdAt: Date.now(),
      expiresAt,
    });

    return {
      success: true,
      token,
      expiresAt,
    };
  }

  return {
    success: false,
    error: 'Invalid username or password',
  };
};

/**
 * Validates a session token
 * @param {string} token - The session token to validate
 * @returns {{valid: boolean, session?: Object}} Validation result
 */
export const validateToken = (token) => {
  const session = sessions.get(token);

  if (!session) {
    return { valid: false };
  }

  // Check if session has expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return { valid: false };
  }

  return {
    valid: true,
    session,
  };
};

/**
 * Invalidates a session token (logout)
 * @param {string} token - The session token to invalidate
 * @returns {boolean} True if the token was invalidated, false otherwise
 */
export const invalidateToken = (token) => {
  return sessions.delete(token);
};

/**
 * Generates a random session token
 * @returns {string} A random token string
 * @private
 */
const generateToken = () => {
  return Math.random().toString(36).substring(2) +
         Date.now().toString(36) +
         Math.random().toString(36).substring(2);
};

/**
 * Cleans up expired sessions (should be called periodically)
 * @returns {number} Number of sessions cleaned up
 */
export const cleanupExpiredSessions = () => {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
      cleanedCount++;
    }
  }

  return cleanedCount;
};

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
