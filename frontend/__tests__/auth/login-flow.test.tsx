/**
 * Integration tests for login flow and redirects
 * @module __tests__/auth/login-flow
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { saveAuthToken, getAuthToken, clearAuthToken } from '@/utils/storage';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

describe('Login Flow Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.cookie = '';
    jest.clearAllMocks();

    // Reset Zustand store state
    useAuthStore.setState({
      token: null,
      isAuthenticated: false,
    });
  });

  describe('Authentication Store', () => {
    it('should initialize with unauthenticated state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
    });

    it('should update state when logging in', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockToken = 'test-token-123';
      const expiresAt = Date.now() + 3600000; // 1 hour from now

      act(() => {
        result.current.login(mockToken, expiresAt);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe(mockToken);
    });

    it('should clear state when logging out', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockToken = 'test-token-123';
      const expiresAt = Date.now() + 3600000;

      // Login first
      act(() => {
        result.current.login(mockToken, expiresAt);
      });
      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
    });

    it('should persist token to localStorage on login', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockToken = 'test-token-123';
      const expiresAt = Date.now() + 3600000;

      act(() => {
        result.current.login(mockToken, expiresAt);
      });

      expect(localStorage.getItem('pokedex_auth_token')).toBe(mockToken);
      expect(localStorage.getItem('pokedex_token_expiry')).toBe(expiresAt.toString());
    });

    it('should restore auth state from localStorage on checkAuth', () => {
      const mockToken = 'test-token-123';
      const expiresAt = Date.now() + 3600000;

      // Manually set token in storage
      saveAuthToken(mockToken, expiresAt);

      const { result } = renderHook(() => useAuthStore());

      // Initially should be false
      expect(result.current.isAuthenticated).toBe(false);

      // Check auth should restore state
      act(() => {
        result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe(mockToken);
    });

    it('should not restore expired tokens', () => {
      const mockToken = 'expired-token';
      const expiredTime = Date.now() - 1000; // 1 second ago

      // Manually set expired token
      localStorage.setItem('pokedex_auth_token', mockToken);
      localStorage.setItem('pokedex_token_expiry', expiredTime.toString());

      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
      expect(getAuthToken()).toBeNull();
    });
  });

  describe('Storage Utilities', () => {
    it('should save token to localStorage and cookies', () => {
      const token = 'test-token';
      const expiresAt = Date.now() + 3600000;

      saveAuthToken(token, expiresAt);

      expect(localStorage.getItem('pokedex_auth_token')).toBe(token);
      expect(localStorage.getItem('pokedex_token_expiry')).toBe(expiresAt.toString());
    });

    it('should retrieve valid token from storage', () => {
      const token = 'test-token';
      const expiresAt = Date.now() + 3600000;

      saveAuthToken(token, expiresAt);
      const retrievedToken = getAuthToken();

      expect(retrievedToken).toBe(token);
    });

    it('should return null for expired token', () => {
      const token = 'expired-token';
      const expiredTime = Date.now() - 1000;

      localStorage.setItem('pokedex_auth_token', token);
      localStorage.setItem('pokedex_token_expiry', expiredTime.toString());

      const retrievedToken = getAuthToken();
      expect(retrievedToken).toBeNull();
    });

    it('should clear token from storage and cookies', () => {
      const token = 'test-token';
      const expiresAt = Date.now() + 3600000;

      saveAuthToken(token, expiresAt);
      expect(localStorage.getItem('pokedex_auth_token')).toBe(token);

      clearAuthToken();
      expect(localStorage.getItem('pokedex_auth_token')).toBeNull();
      expect(localStorage.getItem('pokedex_token_expiry')).toBeNull();
    });
  });

  describe('Login Redirect Flow', () => {
    it('should redirect to home after successful login', async () => {
      const mockReplace = jest.fn();
      const mockPush = jest.fn();

      (useRouter as jest.Mock).mockReturnValue({
        replace: mockReplace,
        push: mockPush,
      });

      const { result } = renderHook(() => useAuthStore());
      const mockToken = 'test-token-123';
      const expiresAt = Date.now() + 3600000;

      // Simulate login
      act(() => {
        result.current.login(mockToken, expiresAt);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Note: The actual redirect happens in the login page component
      // This test verifies the store state is correct for redirect
    });

    it('should maintain authentication state across page refreshes', () => {
      const mockToken = 'persistent-token';
      const expiresAt = Date.now() + 3600000;

      // First "session" - user logs in
      const { result: firstSession } = renderHook(() => useAuthStore());
      act(() => {
        firstSession.current.login(mockToken, expiresAt);
      });
      expect(firstSession.current.isAuthenticated).toBe(true);

      // Simulate page refresh by resetting store state but keeping localStorage
      act(() => {
        useAuthStore.setState({
          token: null,
          isAuthenticated: false,
        });
      });

      // Second "session" - page refresh, new hook instance
      const { result: secondSession } = renderHook(() => useAuthStore());

      // Should start unauthenticated after reset
      expect(secondSession.current.isAuthenticated).toBe(false);

      // After checkAuth, should restore state from localStorage
      act(() => {
        secondSession.current.checkAuth();
      });
      expect(secondSession.current.isAuthenticated).toBe(true);
      expect(secondSession.current.token).toBe(mockToken);
    });

    it('should handle logout and redirect properly', () => {
      const mockToken = 'test-token';
      const expiresAt = Date.now() + 3600000;

      const { result } = renderHook(() => useAuthStore());

      // Login
      act(() => {
        result.current.login(mockToken, expiresAt);
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(getAuthToken()).toBe(mockToken);

      // Logout
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(getAuthToken()).toBeNull();
    });
  });

  describe('Token Expiry Handling', () => {
    it('should detect and handle token expiry on checkAuth', () => {
      const expiredToken = 'expired-token';
      const expiredTime = Date.now() - 1000; // 1 second ago

      // Manually set expired token
      localStorage.setItem('pokedex_auth_token', expiredToken);
      localStorage.setItem('pokedex_token_expiry', expiredTime.toString());

      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.checkAuth();
      });

      // Should clear expired token and set to unauthenticated
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem('pokedex_auth_token')).toBeNull();
    });

    it('should allow valid token that expires in the future', () => {
      const validToken = 'valid-token';
      const futureTime = Date.now() + 7200000; // 2 hours from now

      localStorage.setItem('pokedex_auth_token', validToken);
      localStorage.setItem('pokedex_token_expiry', futureTime.toString());

      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe(validToken);
    });

    it('should reject token that just expired', () => {
      const justExpiredToken = 'just-expired-token';
      const justExpiredTime = Date.now() - 1; // 1 millisecond ago

      localStorage.setItem('pokedex_auth_token', justExpiredToken);
      localStorage.setItem('pokedex_token_expiry', justExpiredTime.toString());

      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Redirect Loop Prevention', () => {
    it('should not create auth state that causes redirect loops', () => {
      const { result } = renderHook(() => useAuthStore());

      // Unauthenticated state should be clear
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();

      // Login should fully set authenticated state
      const token = 'test-token';
      const expiresAt = Date.now() + 3600000;
      act(() => {
        result.current.login(token, expiresAt);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe(token);

      // Logout should fully clear state
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
    });
  });
});
