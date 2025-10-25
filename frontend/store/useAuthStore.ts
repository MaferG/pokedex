/**
 * Zustand store for authentication state management
 * @module store/useAuthStore
 */

import { create } from 'zustand';
import { saveAuthToken, clearAuthToken, getAuthToken } from '@/utils/storage';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, expiresAt: number) => void;
  logout: () => void;
  checkAuth: () => void;
}

/**
 * Authentication store using Zustand
 */
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,

  /**
   * Sets the authentication token and updates authenticated state
   * @param {string} token - Authentication token
   * @param {number} expiresAt - Token expiration timestamp
   */
  login: (token: string, expiresAt: number) => {
    saveAuthToken(token, expiresAt);
    set({ token, isAuthenticated: true });
  },

  /**
   * Clears the authentication token and updates authenticated state
   */
  logout: () => {
    clearAuthToken();
    set({ token: null, isAuthenticated: false });
  },

  /**
   * Checks if there's a valid token in storage and updates state
   */
  checkAuth: () => {
    const token = getAuthToken();
    set({ token, isAuthenticated: token !== null });
  },
}));
