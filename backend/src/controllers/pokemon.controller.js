/**
 * Pokemon controller for handling Pokemon-related requests
 * @module controllers/pokemon
 */

import { getPokemonList, getPokemonDetails, searchPokemonByName, getSortedPokemonList } from '../services/pokeapi.service.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Handles getting paginated list of Pokemon
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getPokemons = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search;
    const sort = req.query.sort; // 'number' or 'name'

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Limit must be between 1 and 100',
      });
    }

    if (offset < 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Offset must be non-negative',
      });
    }

    // Validate sort parameter
    if (sort && sort !== 'number' && sort !== 'name') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Sort must be either "number" or "name"',
      });
    }

    // If search query is provided, search for specific Pokemon
    if (search) {
      try {
        const data = await searchPokemonByName(search, limit, offset);
        return res.status(HTTP_STATUS.OK).json({
          count: data.count,
          next: null,
          previous: null,
          results: data.results,
        });
      } catch (error) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: error.message,
        });
      }
    }

    // If sort is requested, use sorted list
    if (sort) {
      const data = await getSortedPokemonList(limit, offset, sort);
      return res.status(HTTP_STATUS.OK).json(data);
    }

    // Get regular paginated list (default order by number)
    const data = await getPokemonList(limit, offset);
    res.status(HTTP_STATUS.OK).json(data);
  } catch (error) {
    console.error('Error in getPokemons:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to fetch Pokemon list',
    });
  }
};

/**
 * Handles getting detailed information for a specific Pokemon
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getPokemonById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Pokemon ID is required',
      });
    }

    const pokemon = await getPokemonDetails(id);

    res.status(HTTP_STATUS.OK).json(pokemon);
  } catch (error) {
    console.error('Error in getPokemonById:', error);

    if (error.message.includes('not found')) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: error.message,
      });
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to fetch Pokemon details',
    });
  }
};
