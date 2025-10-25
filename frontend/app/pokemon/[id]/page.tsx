/**
 * Pokemon detail page
 * @module app/pokemon/[id]/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/templates/MainLayout';
import { Button } from '@/components/atoms/Button';
import { Loading } from '@/components/atoms/Loading';
import { useAuthStore } from '@/store/useAuthStore';
import { getPokemonDetail } from '@/lib/api';
import { formatPokemonName } from '@/utils/validation';
import { ROUTES } from '@/constants/routes';
import type { PokemonDetail } from '@/types/pokemon';

/**
 * Pokemon detail page component
 * @returns {JSX.Element} Pokemon detail page
 */
export default function PokemonDetailPage() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [checkAuth, isAuthenticated, router]);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      if (!id || !isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getPokemonDetail(id);
        setPokemon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      {isLoading && <Loading size="lg" text="Loading Pokemon details..." />}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={() => router.push(ROUTES.HOME)}>Back to Home</Button>
        </div>
      )}

      {pokemon && !isLoading && (
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6"
          >
            ← Back
          </Button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 mx-auto md:mx-0">
                  <Image
                    src={pokemon.images.official_artwork}
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="flex-grow">
                <p className="text-gray-500 font-medium text-lg">
                  #{pokemon.id.toString().padStart(3, '0')}
                </p>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {formatPokemonName(pokemon.name)}
                </h1>
                <p className="text-gray-600 italic mb-4">
                  {pokemon.species.genera}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {pokemon.species.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.name}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {formatPokemonName(type.name)}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Height:</span>
                    <span className="ml-2 font-medium">{pokemon.height / 10}m</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Weight:</span>
                    <span className="ml-2 font-medium">{pokemon.weight / 10}kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Base Experience:</span>
                    <span className="ml-2 font-medium">{pokemon.base_experience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Stats</h2>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">
                        {formatPokemonName(stat.name)}
                      </span>
                      <span className="text-gray-600">{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abilities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Abilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.name}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-800">
                      {formatPokemonName(ability.name)}
                      {ability.is_hidden && (
                        <span className="ml-2 text-xs text-blue-600">(Hidden)</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Moves */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Moves ({pokemon.moves.length})
              </h2>
              <div className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {pokemon.moves.slice(0, 20).map((move) => (
                    <div
                      key={move.name}
                      className="px-3 py-2 bg-gray-100 rounded text-sm text-gray-700"
                    >
                      {formatPokemonName(move.name)}
                    </div>
                  ))}
                </div>
                {pokemon.moves.length > 20 && (
                  <p className="text-gray-500 text-sm mt-2">
                    ...and {pokemon.moves.length - 20} more moves
                  </p>
                )}
              </div>
            </div>

            {/* Forms */}
            {pokemon.forms.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Forms</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.forms.map((form) => (
                    <span
                      key={form.name}
                      className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {formatPokemonName(form.name)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
