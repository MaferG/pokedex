/**
 * Zustand store for Pokemon state management
 * @module store/usePokemonStore
 */

import { create } from 'zustand';
import { Pokemon } from '@/types/pokemon';
import { SortField, SortOrder } from '@/enums/sort';

interface PokemonState {
  pokemons: Pokemon[];
  filteredPokemons: Pokemon[];
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  currentPage: number;
  totalCount: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  setPokemons: (pokemons: Pokemon[], totalCount: number) => void;
  setSearchQuery: (query: string) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setCurrentPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  pokemons: [],
  filteredPokemons: [],
  searchQuery: '',
  sortField: SortField.NUMBER,
  sortOrder: SortOrder.ASC,
  currentPage: 1,
  totalCount: 0,
  limit: 20,
  isLoading: false,
  error: null,
};

/**
 * Pokemon store using Zustand
 */
export const usePokemonStore = create<PokemonState>((set) => ({
  ...initialState,

  /**
   * Sets the list of Pokemon and total count
   * @param {Pokemon[]} pokemons - Array of Pokemon
   * @param {number} totalCount - Total number of Pokemon
   */
  setPokemons: (pokemons: Pokemon[], totalCount: number) =>
    set({ pokemons, filteredPokemons: pokemons, totalCount }),

  /**
   * Sets the search query
   * @param {string} query - Search query string
   */
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  /**
   * Sets the sort field
   * @param {SortField} field - Field to sort by
   */
  setSortField: (field: SortField) => set({ sortField: field }),

  /**
   * Sets the sort order
   * @param {SortOrder} order - Sort order
   */
  setSortOrder: (order: SortOrder) => set({ sortOrder: order }),

  /**
   * Sets the current page
   * @param {number} page - Page number
   */
  setCurrentPage: (page: number) => set({ currentPage: page }),

  /**
   * Sets the loading state
   * @param {boolean} isLoading - Loading state
   */
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  /**
   * Sets the error message
   * @param {string | null} error - Error message
   */
  setError: (error: string | null) => set({ error }),

  /**
   * Resets the store to initial state
   */
  reset: () => set(initialState),
}));
