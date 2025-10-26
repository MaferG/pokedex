/**
 * PokeAPI service for fetching Pokemon data
 * @module services/pokeapi
 */

import axios from 'axios';
import { CONFIG } from '../config/constants.js';

// Cache for all Pokemon data to avoid repeated API calls
let pokemonCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Fetches and caches all Pokemon from PokeAPI
 * @returns {Promise<Array>} Array of all Pokemon with basic details
 */
const getAllPokemonCached = async () => {
  const now = Date.now();

  // Return cached data if still valid
  if (pokemonCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    return pokemonCache;
  }

  try {
    // Fetch all Pokemon names/URLs (lightweight)
    const response = await axios.get(`${CONFIG.POKEAPI_BASE_URL}/pokemon`, {
      params: { limit: 2000, offset: 0 },
    });

    // Fetch details for all Pokemon in batches to avoid overwhelming the API
    const batchSize = 50;
    const allPokemon = [];

    for (let i = 0; i < response.data.results.length; i += batchSize) {
      const batch = response.data.results.slice(i, i + batchSize);
      const batchDetails = await Promise.all(
        batch.map(async (pokemon) => {
          try {
            const detailResponse = await axios.get(pokemon.url);
            return {
              id: detailResponse.data.id,
              name: pokemon.name,
              url: pokemon.url,
              image: detailResponse.data.sprites.other['official-artwork'].front_default ||
                     detailResponse.data.sprites.front_default,
            };
          } catch (error) {
            console.error(`Error fetching details for ${pokemon.name}:`, error.message);
            return null;
          }
        })
      );
      allPokemon.push(...batchDetails.filter(p => p !== null));
    }

    pokemonCache = allPokemon;
    cacheTimestamp = now;
    return pokemonCache;
  } catch (error) {
    console.error('Error fetching all Pokemon:', error.message);
    throw new Error('Failed to fetch Pokemon data');
  }
};

/**
 * Fetches a paginated list of Pokemon from PokeAPI
 * @param {number} [limit=20] - Number of Pokemon per page
 * @param {number} [offset=0] - Starting position for pagination
 * @returns {Promise<{count: number, next: string|null, previous: string|null, results: Array}>} Paginated Pokemon list
 * @throws {Error} If the API request fails
 */
export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${CONFIG.POKEAPI_BASE_URL}/pokemon`, {
      params: { limit, offset },
    });

    // Fetch basic details for each Pokemon to get their images
    const pokemonWithDetails = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const detailResponse = await axios.get(pokemon.url);
        return {
          id: detailResponse.data.id,
          name: pokemon.name,
          url: pokemon.url,
          image: detailResponse.data.sprites.other['official-artwork'].front_default ||
                 detailResponse.data.sprites.front_default,
        };
      })
    );

    return {
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: pokemonWithDetails,
    };
  } catch (error) {
    console.error('Error fetching Pokemon list:', error.message);
    throw new Error('Failed to fetch Pokemon list from PokeAPI');
  }
};

/**
 * Fetches detailed information for a specific Pokemon
 * @param {string|number} id - Pokemon ID or name
 * @returns {Promise<Object>} Detailed Pokemon data including abilities, moves, and forms
 * @throws {Error} If the Pokemon is not found or the API request fails
 */
export const getPokemonDetails = async (id) => {
  try {
    const response = await axios.get(`${CONFIG.POKEAPI_BASE_URL}/pokemon/${id}`);
    const pokemon = response.data;

    // Fetch species data for additional information
    const speciesResponse = await axios.get(pokemon.species.url);
    const species = speciesResponse.data;

    return {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      base_experience: pokemon.base_experience,
      images: {
        front_default: pokemon.sprites.front_default,
        front_shiny: pokemon.sprites.front_shiny,
        official_artwork: pokemon.sprites.other['official-artwork'].front_default,
      },
      types: pokemon.types.map(type => ({
        slot: type.slot,
        name: type.type.name,
      })),
      abilities: pokemon.abilities.map(ability => ({
        name: ability.ability.name,
        is_hidden: ability.is_hidden,
        slot: ability.slot,
      })),
      moves: pokemon.moves.map(move => ({
        name: move.move.name,
        url: move.move.url,
      })),
      forms: pokemon.forms.map(form => ({
        name: form.name,
        url: form.url,
      })),
      stats: pokemon.stats.map(stat => ({
        name: stat.stat.name,
        base_stat: stat.base_stat,
        effort: stat.effort,
      })),
      species: {
        name: species.name,
        description: species.flavor_text_entries
          .find(entry => entry.language.name === 'en')?.flavor_text
          .replace(/\f/g, ' ') || '',
        genera: species.genera.find(g => g.language.name === 'en')?.genus || '',
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Pokemon with ID ${id} not found`);
    }
    console.error('Error fetching Pokemon details:', error.message);
    throw new Error('Failed to fetch Pokemon details from PokeAPI');
  }
};

/**
 * Fetches all Pokemon and returns sorted/paginated results
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @param {'number'|'name'} sortBy - Sort order
 * @returns {Promise<{count: number, results: Array}>} Sorted Pokemon list
 * @throws {Error} If the API request fails
 */
export const getSortedPokemonList = async (limit = 20, offset = 0, sortBy = 'number') => {
  try {
    // For sorting by number (ID), we can just use the regular endpoint
    // since it's already sorted by ID
    if (sortBy === 'number') {
      return await getPokemonList(limit, offset);
    }

    // For sorting by name, we need to fetch all names first (lightweight),
    // then fetch details only for the page we need
    const allNamesResponse = await axios.get(`${CONFIG.POKEAPI_BASE_URL}/pokemon`, {
      params: { limit: 2000, offset: 0 },
    });

    // Sort all Pokemon names
    const sortedNames = allNamesResponse.data.results.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Paginate the sorted names
    const paginatedNames = sortedNames.slice(offset, offset + limit);

    // Fetch details only for the current page
    const pokemonWithDetails = await Promise.all(
      paginatedNames.map(async (pokemon) => {
        try {
          const detailResponse = await axios.get(pokemon.url);
          return {
            id: detailResponse.data.id,
            name: pokemon.name,
            url: pokemon.url,
            image: detailResponse.data.sprites.other['official-artwork'].front_default ||
                   detailResponse.data.sprites.front_default,
          };
        } catch (error) {
          console.error(`Error fetching details for ${pokemon.name}:`, error.message);
          return null;
        }
      })
    );

    return {
      count: sortedNames.length,
      results: pokemonWithDetails.filter(p => p !== null),
    };
  } catch (error) {
    console.error('Error fetching sorted Pokemon list:', error.message);
    throw new Error('Failed to fetch sorted Pokemon list from PokeAPI');
  }
};

/**
 * Searches for Pokemon by name or number (partial match)
 * @param {string} query - Search query (Pokemon name or number)
 * @param {number} limit - Number of results to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<{count: number, results: Array}>} Matching Pokemon
 * @throws {Error} If search fails
 */
export const searchPokemonByName = async (query, limit = 20, offset = 0) => {
  try {
    // Check if query is a pure number (exact ID search)
    const isExactNumber = /^\d+$/.test(query.trim());

    if (isExactNumber) {
      // Direct search by exact Pokemon ID
      const pokemonId = parseInt(query.trim());
      try {
        const response = await axios.get(`${CONFIG.POKEAPI_BASE_URL}/pokemon/${pokemonId}`);
        const pokemon = response.data;
        return {
          count: 1,
          results: [{
            id: pokemon.id,
            name: pokemon.name,
            url: `${CONFIG.POKEAPI_BASE_URL}/pokemon/${pokemon.id}`,
            image: pokemon.sprites.other['official-artwork'].front_default ||
                   pokemon.sprites.front_default,
          }],
        };
      } catch (error) {
        // If exact ID not found, return empty results
        return {
          count: 0,
          results: [],
        };
      }
    }

    // For name searches or partial matches, fetch list and filter
    const allNamesResponse = await axios.get(`${CONFIG.POKEAPI_BASE_URL}/pokemon`, {
      params: { limit: 2000, offset: 0 },
    });

    // Filter Pokemon by partial name match
    const searchLower = query.toLowerCase().trim();
    const filteredNames = allNamesResponse.data.results.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchLower)
    );

    // Paginate the filtered names
    const paginatedNames = filteredNames.slice(offset, offset + limit);

    // Fetch details only for the current page
    const pokemonWithDetails = await Promise.all(
      paginatedNames.map(async (pokemon) => {
        try {
          const detailResponse = await axios.get(pokemon.url);
          return {
            id: detailResponse.data.id,
            name: pokemon.name,
            url: pokemon.url,
            image: detailResponse.data.sprites.other['official-artwork'].front_default ||
                   detailResponse.data.sprites.front_default,
          };
        } catch (error) {
          console.error(`Error fetching details for ${pokemon.name}:`, error.message);
          return null;
        }
      })
    );

    return {
      count: filteredNames.length,
      results: pokemonWithDetails.filter(p => p !== null),
    };
  } catch (error) {
    console.error('Error searching Pokemon:', error.message);
    throw new Error('Failed to search for Pokemon');
  }
};
