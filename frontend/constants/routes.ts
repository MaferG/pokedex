/**
 * Application route constants
 * @module constants/routes
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  POKEMON_DETAIL: (id: string | number) => `/pokemon/${id}`,
} as const;
