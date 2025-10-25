/**
 * Authentication controller for handling login/logout operations
 * @module controllers/auth
 */

import { authenticate, invalidateToken } from '../services/auth.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Handles user login
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Username and password are required',
      });
    }

    // Authenticate user
    const result = authenticate(username, password);

    if (!result.success) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: result.error,
      });
    }

    // Return success with token
    res.status(HTTP_STATUS.OK).json({
      success: true,
      token: result.token,
      expiresAt: result.expiresAt,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred during login',
    });
  }
};

/**
 * Handles user logout
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      invalidateToken(token);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred during logout',
    });
  }
};
