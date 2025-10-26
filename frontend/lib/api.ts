/**
 * API service for backend communication
 * @module lib/api
 */

import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { getAuthToken, clearAuthToken } from '@/utils/storage';
import type { LoginCredentials, LoginResponse } from '@/types/auth';
import type { PokemonListResponse, PokemonDetail } from '@/types/pokemon';

/**
 * Creates axios instance with auth token if available
 * @returns {import('axios').AxiosInstance} Configured axios instance
 */
const getApiClient = () => {
  const token = getAuthToken();

  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  // Add response interceptor to handle 401 errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        clearAuthToken();
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Authenticates user and returns session token
 * @param {LoginCredentials} credentials - User credentials
 * @returns {Promise<LoginResponse>} Login response with token
 * @throws {Error} If authentication fails
 */
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const { data } = await axios.post<LoginResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`,
      credentials
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ error: string }>;
      throw new Error(err.response?.data?.error || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export const logout = async (): Promise<void> => {
  try {
    const client = getApiClient();
    await client.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
    // Don't throw, just log - we'll clear local storage anyway
  }
};

/**
 * Fetches paginated list of Pokemon
 * @param {number} [limit=20] - Number of Pokemon per page
 * @param {number} [offset=0] - Starting position for pagination
 * @param {string} [search] - Search query
 * @param {'number' | 'name'} [sortBy] - Sort order (number or name)
 * @returns {Promise<PokemonListResponse>} Paginated Pokemon list
 * @throws {Error} If the request fails
 */
export const getPokemons = async (
  limit: number = 20,
  offset: number = 0,
  search?: string,
  sortBy?: 'number' | 'name'
): Promise<PokemonListResponse> => {
  try {
    const client = getApiClient();
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    if (sortBy) {
      params.append('sort', sortBy);
    }

    const { data } = await client.get<PokemonListResponse>(
      `${API_ENDPOINTS.POKEMONS}?${params.toString()}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ error: string }>;
      throw new Error(
        err.response?.data?.error || 'Failed to fetch Pokemon list'
      );
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Fetches detailed information for a specific Pokemon
 * @param {string | number} id - Pokemon ID or name
 * @returns {Promise<PokemonDetail>} Detailed Pokemon data
 * @throws {Error} If the request fails
 */
export const getPokemonDetail = async (
  id: string | number
): Promise<PokemonDetail> => {
  try {
    const client = getApiClient();
    const { data } = await client.get<PokemonDetail>(
      API_ENDPOINTS.POKEMON_DETAIL(id)
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ error: string }>;
      throw new Error(
        err.response?.data?.error || `Failed to fetch Pokemon ${id}`
      );
    }
    throw new Error('An unexpected error occurred');
  }
};
