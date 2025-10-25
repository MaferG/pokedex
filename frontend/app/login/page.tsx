/**
 * Login page
 * @module app/login/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/molecules/LoginForm';
import { useAuthStore } from '@/store/useAuthStore';
import { login as apiLogin } from '@/lib/api';
import { ROUTES } from '@/constants/routes';

/**
 * Login page component (Presentational)
 * @returns {JSX.Element} Login page
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, checkAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [checkAuth, isAuthenticated, router]);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiLogin({ username, password });
      login(response.token, response.expiresAt);
      router.push(ROUTES.HOME);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pokédex</h1>
          <p className="text-gray-600">Sign in to explore Pokemon</p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Hint: Use <span className="font-semibold">admin/admin</span> to login
          </p>
        </div>
      </div>
    </div>
  );
}
