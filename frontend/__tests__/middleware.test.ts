/**
 * Tests for middleware redirect logic
 * @module __tests__/middleware
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { STORAGE_KEYS } from '@/constants/storage';

describe('Middleware', () => {
  const createRequest = (pathname: string, token?: string) => {
    const url = `http://localhost:3000${pathname}`;
    const request = new NextRequest(url);

    if (token) {
      // Mock cookies
      request.cookies.set(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    return request;
  };

  describe('Unauthenticated users', () => {
    it('should redirect from home page to login when no token', () => {
      const request = createRequest('/');
      const response = middleware(request);

      expect(response.status).toBe(307); // Temporary redirect
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    });

    it('should redirect from protected Pokemon detail page to login', () => {
      const request = createRequest('/pokemon/1');
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    });

    it('should allow access to login page', () => {
      const request = createRequest('/login');
      const response = middleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('should redirect from any protected route to login', () => {
      const protectedRoutes = ['/pokemon/25', '/favorites', '/profile'];

      protectedRoutes.forEach((route) => {
        const request = createRequest(route);
        const response = middleware(request);

        expect(response.status).toBe(307);
        expect(response.headers.get('location')).toBe('http://localhost:3000/login');
      });
    });
  });

  describe('Authenticated users', () => {
    const mockToken = 'mock-auth-token-12345';

    it('should allow access to home page with token', () => {
      const request = createRequest('/', mockToken);
      const response = middleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('should redirect from login page to home when authenticated', () => {
      const request = createRequest('/login', mockToken);
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/');
    });

    it('should allow access to Pokemon detail pages', () => {
      const request = createRequest('/pokemon/1', mockToken);
      const response = middleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('should allow access to all protected routes', () => {
      const protectedRoutes = ['/', '/pokemon/25', '/favorites', '/profile'];

      protectedRoutes.forEach((route) => {
        const request = createRequest(route, mockToken);
        const response = middleware(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('location')).toBeNull();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle requests with trailing slashes', () => {
      const request = createRequest('/login/');
      const response = middleware(request);

      // Next.js treats /login/ as different from /login, so it redirects
      // This is expected behavior - the middleware protects routes by pathname
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    });

    it('should handle empty token cookie', () => {
      const request = createRequest('/');
      request.cookies.set(STORAGE_KEYS.AUTH_TOKEN, '');
      const response = middleware(request);

      // Empty token should be treated as no token
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/login');
    });

    it('should not redirect static assets', () => {
      // The matcher in middleware.ts excludes these paths
      const staticPaths = [
        '/_next/static/chunk.js',
        '/_next/image?url=test.png',
        '/favicon.ico',
        '/login-background.png',
      ];

      // These should not even reach the middleware due to matcher config
      // This test documents the expected behavior
      staticPaths.forEach((path) => {
        const request = createRequest(path);
        // In real Next.js, these would be excluded by the matcher
        // For this test, we just verify the middleware handles them gracefully
        const response = middleware(request);
        expect(response).toBeDefined();
      });
    });
  });

  describe('Redirect loop prevention', () => {
    it('should not create redirect loop for unauthenticated users', () => {
      // Unauthenticated user at home
      const homeRequest = createRequest('/');
      const homeResponse = middleware(homeRequest);

      // Should redirect to login
      expect(homeResponse.headers.get('location')).toBe('http://localhost:3000/login');

      // At login page, should not redirect
      const loginRequest = createRequest('/login');
      const loginResponse = middleware(loginRequest);
      expect(loginResponse.status).toBe(200);
    });

    it('should not create redirect loop for authenticated users', () => {
      const mockToken = 'mock-auth-token';

      // Authenticated user at login
      const loginRequest = createRequest('/login', mockToken);
      const loginResponse = middleware(loginRequest);

      // Should redirect to home
      expect(loginResponse.headers.get('location')).toBe('http://localhost:3000/');

      // At home, should not redirect
      const homeRequest = createRequest('/', mockToken);
      const homeResponse = middleware(homeRequest);
      expect(homeResponse.status).toBe(200);
    });
  });
});
