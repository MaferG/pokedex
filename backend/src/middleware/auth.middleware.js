/**
 * Authentication middleware for protecting routes
 * @module middleware/auth
 */

import { validateToken } from '../services/auth.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Middleware to verify authentication token
 * Checks for token in Authorization header (Bearer token)
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'No authentication token provided',
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const { valid, session } = validateToken(token);

  if (!valid) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'Invalid or expired token',
    });
  }

  // Attach session info to request for use in routes
  req.session = session;
  next();
};
