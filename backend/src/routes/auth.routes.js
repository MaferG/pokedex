/**
 * Authentication routes
 * @module routes/auth
 */

import express from 'express';
import { login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @route POST /api/login
 * @description Authenticate user and receive session token
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /api/logout
 * @description Invalidate session token
 * @access Public
 */
router.post('/logout', logout);

export default router;
