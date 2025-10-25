/**
 * Home page
 * @module app/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { SearchInput } from '@/components/atoms/SearchInput';
import { SortControls } from '@/components/molecules/SortControls';
import { PokemonGrid } from '@/components/organisms/PokemonGrid';
import { Pagination } from '@/components/molecules/Pagination';
import { useAuthStore } from '@/store/useAuthStore';
import { usePokemonStore } from '@/store/usePokemonStore';
import { getPokemons } from '@/lib/api';
import { sortPokemon } from '@/utils/sort';
import { SortField, SortOrder } from '@/enums/sort';
import { ROUTES } from '@/constants/routes';

/**
 * Home page component with Pokemon list, search, sort, and pagination
 * @returns {JSX.Element} Home page
 */
export default function HomePage() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const {
    pokemons,
    searchQuery,
    sortField,
    sortOrder,
    currentPage,
    totalCount,
    limit,
    isLoading,
    error,
    setPokemons,
    setSearchQuery,
    setSortField,
    setSortOrder,
    setCurrentPage,
    setIsLoading,
    setError,
  } = usePokemonStore();

  const router = useRouter();
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [checkAuth, isAuthenticated, router]);

  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * limit;
        const data = await getPokemons(limit, offset);
        setPokemons(data.results, data.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPokemons();
    }
  }, [currentPage, limit, isAuthenticated, setPokemons, setIsLoading, setError]);

  const handleSearch = () => {
    setSearchQuery(localSearch);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
  };

  const handleSortOrderChange = (order: SortOrder) => {
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort pokemon client-side
  const filteredPokemons = searchQuery
    ? pokemons.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toString().includes(searchQuery)
      )
    : pokemons;

  const sortedPokemons = sortPokemon(filteredPokemons, sortField, sortOrder);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pokédex</h1>
          <p className="text-gray-600">
            Showing {totalCount} Pokemon
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-96">
            <SearchInput
              placeholder="Search Pokemon by name or number..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onClear={handleClearSearch}
            />
          </div>

          <SortControls
            sortField={sortField}
            sortOrder={sortOrder}
            onSortFieldChange={handleSortFieldChange}
            onSortOrderChange={handleSortOrderChange}
          />
        </div>

        <PokemonGrid
          pokemons={sortedPokemons}
          isLoading={isLoading}
          error={error}
        />

        {!isLoading && !error && (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </MainLayout>
  );
}
