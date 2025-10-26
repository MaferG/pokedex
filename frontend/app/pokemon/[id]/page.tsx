"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { TypeBadge } from "@/components/atoms/type-badge";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Weight,
  Ruler,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { getPokemonDetail, getPokemons } from "@/lib/api";
import { ROUTES } from "@/constants/routes";

const TYPE_COLORS: Record<string, string> = {
  bug: "#A7B723",
  dark: "#75574C",
  dragon: "#7037FF",
  electric: "#F9CF30",
  fairy: "#E69EAC",
  fighting: "#C12239",
  fire: "#F57D31",
  flying: "#A891EC",
  ghost: "#70559B",
  normal: "#AAA67F",
  grass: "#74CB48",
  ground: "#DEC16B",
  ice: "#9AD6DF",
  poison: "#A43E9E",
  psychic: "#FB5584",
  rock: "#B69E31",
  steel: "#B7B9D0",
  water: "#6493EB",
};

const PokemonDetailPage = () => {
  // --- Hooks -----------------------------------------------------------------
  const { checkAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [pokemon, setPokemon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPokemon, setTotalPokemon] = useState<number>(0);
  // --- END: Local state ------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const id = params?.id as string;
  const typeColor =
    TYPE_COLORS[pokemon?.types[0]?.name?.toLowerCase()] || "#AAA67F";
  const abilities = pokemon?.abilities.map((a: { name: string }) => a.name).join(" ");
  const currentId = parseInt(id);
  const isFirstPokemon = currentId === 1;
  const isLastPokemon = currentId === totalPokemon;

  const handlePrevious = () => {
    const currentId = parseInt(id);
    if (currentId > 1) {
      router.push(`/pokemon/${currentId - 1}`);
    }
  };

  const handleNext = () => {
    const currentId = parseInt(id);
    if (currentId < totalPokemon) {
      router.push(`/pokemon/${currentId + 1}`);
    }
  };
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
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
        const [pokemonData, listData] = await Promise.all([
          getPokemonDetail(id),
          getPokemons(1, 0), // Fetch just to get total count
        ]);
        setPokemon(pokemonData);
        setTotalPokemon(listData.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch Pokemon details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [id, isAuthenticated]);
  // --- END: Side effects -----------------------------------------------------

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading Pokemon details...</div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error || "Pokemon not found"}
          </p>
          <Link href="/" className="text-blue-600 underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: typeColor }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div
          className="absolute top-20 right-10 w-96 h-96 rounded-full"
          style={{ backgroundColor: "white" }}
        />
        <div
          className="absolute bottom-20 left-10 w-64 h-64 rounded-full"
          style={{ backgroundColor: "white" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="w-10 h-10 flex items-center justify-center">
          <ArrowLeft className="w-8 h-8 text-white" />
        </Link>
        <h1 className="text-white text-[24px] leading-[32px] font-bold capitalize">
          {pokemon.name}
        </h1>
        <span className="text-white text-[12px] leading-[16px] font-bold">
          #{pokemon.id.toString().padStart(3, "0")}
        </span>
      </header>

      <div className="relative flex flex-col items-center md:w-full min-h-screen mx-1">
        {/* Pokémon Image */}
        <div className="relative z-10 px-6 pt-8 pb-0 flex justify-center">
          {!isFirstPokemon && (
            <button
              onClick={handlePrevious}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Previous Pokemon"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}
          <div className="relative w-80 h-80">
            <Image
              src={pokemon.images.official_artwork}
              alt={pokemon.name}
              fill
              className="object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.2)]"
            />
          </div>
          {!isLastPokemon && (
            <button
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Next Pokemon"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}
        </div>

        {/* Content Card — Overlaps the image */}
        <div className="relative bg-white rounded-t-[32px] px-6 py-8 shadow-[0_-6px_12px_rgba(0,0,0,0.1)] -mt-24 w-full flex-grow flex flex-col justify-between">
          <div>
            {/* Type Badges */}
            <div className="flex justify-center gap-3 mb-6 pt-16">
              {pokemon.types.map((type: any) => (
                <TypeBadge key={type.name} type={type.name} />
              ))}
            </div>

            {/* About Section */}
            <h2
              className="text-[14px] leading-[16px] font-bold text-center mb-6"
              style={{ color: typeColor }}
            >
              About
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-[#212121]" />
                  <span className="text-[#212121] text-[14px] leading-[16px]">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
                <span className="text-[#666666] text-[12px] leading-[16px]">
                  Weight
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 border-x border-[#E0E0E0]">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#212121]" />
                  <span className="text-[#212121] text-[14px] leading-[16px]">
                    {(pokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <span className="text-[#666666] text-[12px] leading-[16px]">
                  Height
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[#212121] text-[14px] leading-[16px] text-center">
                  {abilities}
                </span>
                <span className="text-[#666666] text-[12px] leading-[16px]">
                  Abilities
                </span>
              </div>
            </div>

            <p className="text-[#212121] text-[14px] leading-[16px] text-justify mb-8">
              {pokemon.species.description}
            </p>

            {/* Base Stats */}
            <h2
              className="text-[14px] leading-[16px] font-bold text-center mb-6"
              style={{ color: typeColor }}
            >
              Base Stats
            </h2>

            <div className="flex gap-4">
              <div className="space-y-3">
                {pokemon.stats.map((stat: any) => (
                  <div
                    key={stat.name}
                    className="text-[12px] leading-[16px] font-bold w-12 text-right"
                    style={{ color: typeColor }}
                  >
                    {{
                      hp: "HP",
                      attack: "ATK",
                      defense: "DEF",
                      "special-attack": "SATK",
                      "special-defense": "SDEF",
                      speed: "SPD",
                    }[stat.name as string] || stat.name.toUpperCase()}
                  </div>
                ))}
              </div>
              <div className="w-px bg-[#E0E0E0]" />
              <div className="flex-1 space-y-3">
                {pokemon.stats.map((stat: any) => (
                  <div key={stat.name} className="flex items-center gap-4">
                    <span className="text-[#212121] text-[14px] leading-[16px] font-semibold w-12">
                      {stat.base_stat.toString().padStart(3, "0")}
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: typeColor + "33" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(stat.base_stat / 255) * 100}%`,
                          backgroundColor: typeColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;
