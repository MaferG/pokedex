/**
 * Pokemon routes
 * @module routes/pokemon
 */

import express from 'express';
import { getPokemons, getPokemonById } from '../controllers/pokemon.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route GET /api/pokemons
 * @description Get paginated list of Pokemon with optional search
 * @query {number} limit - Number of Pokemon per page (1-100, default: 20)
 * @query {number} offset - Starting position for pagination (default: 0)
 * @query {string} search - Search Pokemon by name
 * @access Protected
 */
router.get('/pokemons', requireAuth, getPokemons);

/**
 * @route GET /api/pokemons/:id
 * @description Get detailed information for a specific Pokemon
 * @param {string} id - Pokemon ID or name
 * @access Protected
 */
router.get('/pokemons/:id', requireAuth, getPokemonById);

export default router;
