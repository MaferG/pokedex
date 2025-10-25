/**
 * API configuration constants
 * @module constants/api
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  POKEMONS: '/pokemons',
  POKEMON_DETAIL: (id: string | number) => `/pokemons/${id}`,
} as const;

export const DEFAULT_PAGINATION = {
  LIMIT: 20,
  OFFSET: 0,
} as const;
