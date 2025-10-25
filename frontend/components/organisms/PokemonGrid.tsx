/**
 * PokemonGrid organism component
 * @module components/organisms/PokemonGrid
 */

import React from 'react';
import { Pokemon } from '@/types/pokemon';
import { PokemonCard } from '@/components/molecules/PokemonCard';
import { Loading } from '@/components/atoms/Loading';

export interface PokemonGridProps {
  pokemons: Pokemon[];
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Grid of Pokemon cards with loading and error states
 * @param {PokemonGridProps} props - Pokemon grid properties
 * @returns {JSX.Element} Pokemon grid component
 */
export const PokemonGrid: React.FC<PokemonGridProps> = ({
  pokemons,
  isLoading = false,
  error,
}) => {
  if (isLoading) {
    return <Loading size="lg" text="Loading Pokemon..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No Pokemon found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};
