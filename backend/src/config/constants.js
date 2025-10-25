/**
 * Application configuration constants
 * @module config/constants
 */

export const CONFIG = {
  PORT: process.env.PORT || 3001,
  POKEAPI_BASE_URL: 'https://pokeapi.co/api/v2',
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin',
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

export const ROUTES = {
  LOGIN: '/api/login',
  POKEMONS: '/api/pokemons',
  POKEMON_DETAIL: '/api/pokemons/:id',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
