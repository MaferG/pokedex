/**
 * Header organism component
 * @module components/organisms/Header
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/atoms/Button';
import { ROUTES } from '@/constants/routes';
import { logout as apiLogout } from '@/lib/api';

/**
 * Application header with navigation and logout
 * @returns {JSX.Element} Header component
 */
export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      router.push(ROUTES.LOGIN);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={ROUTES.HOME}>
            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              Pokédex
            </h1>
          </Link>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
