/**
 * Sorting utility functions for Pokemon lists
 * @module utils/sort
 */

import { Pokemon } from '@/types/pokemon';
import { SortField, SortOrder } from '@/enums/sort';

/**
 * Sorts an array of Pokemon by the specified field and order
 * @param {Pokemon[]} pokemon - Array of Pokemon to sort
 * @param {SortField} field - Field to sort by
 * @param {SortOrder} order - Sort order (ascending or descending)
 * @returns {Pokemon[]} Sorted array of Pokemon
 */
export const sortPokemon = (
  pokemon: Pokemon[],
  field: SortField,
  order: SortOrder
): Pokemon[] => {
  const sorted = [...pokemon].sort((a, b) => {
    if (field === SortField.NAME) {
      return a.name.localeCompare(b.name);
    } else {
      return a.id - b.id;
    }
  });

  return order === SortOrder.DESC ? sorted.reverse() : sorted;
};

/**
 * Filters Pokemon by search query
 * @param {Pokemon[]} pokemon - Array of Pokemon to filter
 * @param {string} query - Search query
 * @returns {Pokemon[]} Filtered array of Pokemon
 */
export const filterPokemon = (pokemon: Pokemon[], query: string): Pokemon[] => {
  if (!query.trim()) return pokemon;

  const lowerQuery = query.toLowerCase().trim();

  return pokemon.filter((p) => {
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      p.id.toString().includes(lowerQuery)
    );
  });
};
