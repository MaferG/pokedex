/**
 * PokeAPI service for fetching Pokemon data
 * @module services/pokeapi
 */

import axios from 'axios';
import { CONFIG } from '../config/constants.js';

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
 * Searches for Pokemon by name
 * @param {string} query - Search query (Pokemon name)
 * @returns {Promise<Object>} Pokemon data if found
 * @throws {Error} If the Pokemon is not found
 */
export const searchPokemonByName = async (query) => {
  try {
    const response = await axios.get(`${CONFIG.POKEAPI_BASE_URL}/pokemon/${query.toLowerCase()}`);
    return {
      id: response.data.id,
      name: response.data.name,
      url: `${CONFIG.POKEAPI_BASE_URL}/pokemon/${response.data.id}`,
      image: response.data.sprites.other['official-artwork'].front_default ||
             response.data.sprites.front_default,
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Pokemon "${query}" not found`);
    }
    throw new Error('Failed to search for Pokemon');
  }
};
