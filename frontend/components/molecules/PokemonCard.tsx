/**
 * PokemonCard molecule component
 * @module components/molecules/PokemonCard
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pokemon } from '@/types/pokemon';
import { formatPokemonName } from '@/utils/validation';
import { ROUTES } from '@/constants/routes';

export interface PokemonCardProps {
  pokemon: Pokemon;
}

/**
 * Pokemon card component displaying basic Pokemon information
 * @param {PokemonCardProps} props - Pokemon card properties
 * @returns {JSX.Element} Pokemon card component
 */
export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <Link href={ROUTES.POKEMON_DETAIL(pokemon.id)}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 cursor-pointer">
        <div className="relative aspect-square mb-3">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain"
            priority={pokemon.id <= 20}
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            #{pokemon.id.toString().padStart(3, '0')}
          </p>
          <h3 className="text-lg font-bold text-gray-800 mt-1">
            {formatPokemonName(pokemon.name)}
          </h3>
        </div>
      </div>
    </Link>
  );
};
