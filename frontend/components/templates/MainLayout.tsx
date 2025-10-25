/**
 * MainLayout template component
 * @module components/templates/MainLayout
 */

import React from 'react';
import { Header } from '@/components/organisms/Header';

export interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout template with header
 * @param {MainLayoutProps} props - Main layout properties
 * @returns {JSX.Element} Main layout component
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
