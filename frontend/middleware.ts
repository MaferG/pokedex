/**
 * Next.js middleware for route protection
 * @module middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { STORAGE_KEYS } from './constants/storage';

/**
 * Middleware to protect routes and handle authentication redirects
 * @param {NextRequest} request - Next.js request object
 * @returns {NextResponse} Next.js response object
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get(STORAGE_KEYS.AUTH_TOKEN)?.value;

  const isLoginPage = pathname === '/login';
  const isPublicPage = isLoginPage;

  // If accessing protected route without token, redirect to login
  if (!token && !isPublicPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login page with token, redirect to home
  if (token && isLoginPage) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
