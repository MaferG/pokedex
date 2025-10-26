/**
 * Local storage utility functions
 * @module utils/storage
 */

import { STORAGE_KEYS } from '@/constants/storage';

/**
 * Saves authentication token to local storage and cookies
 * @param {string} token - The authentication token
 * @param {number} expiresAt - Token expiration timestamp
 */
export const saveAuthToken = (token: string, expiresAt: number): void => {
  if (typeof window === 'undefined') return;

  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString());

  // Save to cookies for middleware access
  const expiryDate = new Date(expiresAt);
  document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};

/**
 * Retrieves authentication token from local storage
 * @returns {string | null} The authentication token or null if not found/expired
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

  if (!token || !expiry) return null;

  // Check if token has expired
  if (Date.now() > parseInt(expiry, 10)) {
    clearAuthToken();
    return null;
  }

  return token;
};

/**
 * Removes authentication token from local storage and cookies
 */
export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;

  // Clear from localStorage
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);

  // Clear from cookies
  document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

/**
 * Checks if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};
