/**
 * TypeScript types for authentication
 * @module types/auth
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  expiresAt: number;
  message: string;
}

export interface AuthError {
  error: string;
}
